<template>
  <div class="message-center-wrapper common-page-wrapper">
    <div class="msg-content">
      <div class="pr-30 pl-30 pt-30">
        <el-form ref="form" :model="formData" class="message-center-form" @submit.native.prevent>
          <el-form-item label="" prop="readFlag">
            <el-select clearable v-model="formData.readFlag" placeholder="请选择消息状态">
              <el-option
                :key="item"
                v-for="item in Object.keys(messageStatus)"
                :label="messageStatus[item]"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="type">
            <el-select clearable v-model="formData.type" placeholder="请选择类型">
              <el-option v-for="key in Object.keys(types)" :key="key" :label="types[key]" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="priority">
            <el-select popper-class="priority-class" clearable v-model="formData.priority" placeholder="请选择优先级">
              <el-option
                :class="getItemPriorityClass(item)"
                :key="item"
                v-for="item in Object.keys(messageLevel)"
                :label="messageLevel[item]"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="title">
            <el-input clearable v-model="formData.title" autocomplete="off" placeholder="请输入消息名称"></el-input>
          </el-form-item>
          <el-form-item style="position: relative; width: 42px">
            <el-button type="primary" class="search-button text-center" @click="search"></el-button>
          </el-form-item>
          <el-form-item style="position: relative; width: 42px; margin-right: 136px;">
            <el-button type="primary" class="refresh-button text-center" @click="reset"></el-button>
          </el-form-item>
          <el-form-item style="position: relative; float: right; margin-right: 0">
            <el-button class="common-button" :class="DeleteClass" @click="deleteMulti">删除</el-button>
            <el-button class="common-button" :class="ReadClass" @click="read">已读</el-button>
            <el-button class="common-button" type="primary" @click="readAll">全部已读</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="horizontal-line" style="margin-bottom: 30px"></div>
      <div class="pr-30 pl-30 checkbox-edit priority-class">
        <el-table
          ref="Table"
          :data="tableData.records"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-class-name="rowClassName"
        >
          <el-table-column type="selection" width="118" align="center"></el-table-column>
          <el-table-column label="标题" width="520">
            <template slot-scope="scope">
              <div class="float-container">
                <div class="float-left envelope"></div>
                <div class="float-left">
                  <el-tooltip class="show-dot" effect="dark" :content="scope.row.title" placement="top">
                    <div style="max-width: 520px">{{ scope.row.title }}</div>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="优先级">
            <template slot-scope="scope">
              <span :class="getItemPriorityClass(scope.row.priority)">{{ messageLevel[scope.row.priority] }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="类型">
            <template slot-scope="scope">
              <span :class="getMessageType(scope.row)">{{ types[scope.row.type] }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="时间">
            <template slot-scope="scope">{{ formatTime(scope.row) }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="关联" prop="details"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <div class="float-container">
                <div class="float-left" style="margin-right: 21px">
                  <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                    <img class="row-eye" :src="eye" alt="" @click="showDetail(scope.row)" />
                  </el-tooltip>
                </div>
                <div class="float-left">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <img class="row-delete" :src="delA" alt="" @click="del(scope.row)" />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <APagination
          :table-data="tableData"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
        ></APagination>
      </div>
    </div>
    <Detail :visible="visibleDetail" :row-data="rowData" @reset="resetDetail"></Detail>
    <DeleteModal
      :data="delData"
      display-key="title"
      :visible="visibleDel"
      @reset="resetDelModal"
      @submit="deleteSubmit"
    ></DeleteModal>
  </div>
</template>

<script>
import APagination from '@/components/pagination/APagination';
import DeleteModal from '@/components/modal/DelModal.vue';
import Detail from './Detail';

import { templateTypes, queryAllWebInfo, msgUserLogDelete, msgUserLogHasRead } from '@/api/message';
import { getStyle } from '@/utils/utils';

import message from '@/mixins/message';
import { getToken } from '@/storage/auth';
import { generateUrlParams } from '@/utils';

const eye = require('@/assets/eye.png');
const delA = require('@/assets/button/del-active.png');

export default {
  name: 'message-center',
  components: {
    APagination,
    DeleteModal,
    Detail
  },
  data() {
    return {
      eye,
      delA,
      visibleDel: false,
      delData: {},
      deleteSubmit: () => {}, // Function
      types: {},
      formData: {
        readFlag: '',
        type: '',
        priority: '',
        title: ''
      },
      tableData: {
        current: 1,
        pages: 0,
        records: [],
        size: 10,
        total: 0
      },
      pageSize: 10,
      pageCurrent: 1,
      multipleSelection: [],
      records: [],
      operateRequestParams: {},
      operateResponseContent: {},
      visibleContent: false,
      prevIndex: null,
      msgDataIdList: [],
      visibleDetail: false,
      rowData: {}
    };
  },
  computed: {
    DeleteClass() {
      return [`danger` + (this.multipleSelection.length ? '-active' : '')];
    },
    ReadClass() {
      return [`pink` + (this.multipleSelection.length ? '-active' : '')];
    }
  },
  created() {
    this.getSelects().then(this.getList);
  },
  mixins: [message],
  methods: {
    formatTime(row) {
      if (!row.eventTime) return '';
      return this.$$moment(row.eventTime || '').format('YYYY.MM.DD HH:mm:ss');
    },
    getSelects() {
      return templateTypes().then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.types = object;
        }
      });
    },
    formatNumber(number) {
      return number < 10 ? '0' + number : number;
    },
    search() {
      this.pageCurrent = 1;
      this.getList();
    },
    reset() {
      this.$refs.form.resetFields();
      this.search();
    },
    sort(val) {
      this.$refs.Table.clearSelection();
      this.getList();
    },
    async getList() {
      const params = {
        current: this.pageCurrent,
        size: this.pageSize
      };
      const query = generateUrlParams('', params);
      const data = {};
      this.formData.title = this.formData.title.replace(/^(\s+)|(\s+)$/g, '');
      if (this.formData.title.length) data.title = this.formData.title;
      if (this.formData.readFlag.length) data.readFlag = Boolean(JSON.parse(this.formData.readFlag));
      if (this.formData.type.length) data.type = this.formData.type;
      if (this.formData.priority.length) data.priority = this.formData.priority;
      const access_token = getToken();
      if (!access_token) return;
      const Authorization = access_token.Authorization;
      if (!Authorization) return;
      const info = access_token[Authorization];
      if (!info) return;
      const { userInfo } = info;
      if (!userInfo) return;
      // data.userId = userInfo.id;
      data.userId = userInfo.staffId;
      queryAllWebInfo(query, data).then(res => {
        const { code, object } = res;
        if (code === 200 && object) {
          this.tableData = object;
        }
      });
    },
    rowClassName({ row }) {
      return [`logReadFlag-${row.logReadFlag}`, `priority-${row.priority}`];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getList();
    },
    onRowClick(row, index) {
      this.operateRequestParams = row.operateRequestParams;
      this.operateResponseContent = JSON.parse(row.operateResponseContent);
      row.visibleContent = !this.visibleContent;
      let el;
      if (this.prevIndex !== index) {
        el = this.$refs['rowContent-' + this.prevIndex];
        el && (el.style.display = 'none');
      }
      this.prevIndex = index;
      el = this.$refs['rowContent-' + index];
      const style = getStyle(el, 'display');
      const eq = style === 'block';
      let display;
      if (eq && this.prevIndex === index) {
        display = 'none';
      } else {
        display = 'block';
      }
      el.style.display = display;
    },
    getAlarmLevelClass(row) {
      // console.log(row);
    },
    getMessageType(row) {
      // console.log(row);
    },
    showDetail(row) {
      this.visibleDetail = true;
      this.rowData = row;
    },
    read() {
      const ids = this.multipleSelection.map(val => val.id);
      if (!ids.length) {
        this.$message.info(`请选中至少一条数据`);
        return;
      }
      msgUserLogHasRead({ msgDataIdList: ids }).then(res => {
        const { code, message } = res;
        if (code === 200) {
          this.$message.success(message || '成功');
          this.getList();
          this.$store.dispatch('RefreshMessageCount');
        } else {
          this.$message.error(message || '失败');
        }
      });
    },
    readAll() {
      this.$confirm('确定 标记为全部已读 吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          msgUserLogHasRead({ msgDataIdList: [] }).then(res => {
            const { code, message } = res;
            if (code === 200) {
              this.$message.success(message || '成功');
              this.getList();
            } else {
              this.$message.error(message || '失败');
            }
          });
        })
        .catch(() => this.$message({ type: 'info', message: '已取消' }));
    },
    del(row) {
      this.visibleDel = true;
      this.delData = row;
      this.msgDataIdList = [row.id];
      this.deleteSubmit = this.delMsg;
    },
    deleteMulti() {
      const ids = this.multipleSelection.map(val => val.id);
      if (!ids.length) {
        this.$message.info(`请选中至少一条数据`);
        return;
      }
      this.visibleDel = true;
      this.msgDataIdList = ids;
      this.delData = this.multipleSelection.concat();
      this.deleteSubmit = this.delMsg;
    },
    delMsg() {
      msgUserLogDelete({ msgDataIdList: this.msgDataIdList })
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '删除消息成功');
          } else {
            this.$message.error(message || '删除消息失败');
          }
        })
        .finally(() => {
          this.visibleDel = false;
          this.getList();
        });
    },
    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    resetDetail() {
      msgUserLogHasRead({ msgDataIdList: [this.rowData.id] })
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            // this.$message.success(message || '成功');
            console.log(message || '成功');
            this.getList();
            this.$store.dispatch('RefreshMessageCount');
          } else {
            // this.$message.error(message || '失败');
            console.log(message || '失败');
          }
        })
        .finally(() => {
          this.visibleDetail = false;
          this.rowData = {};
        });
    }
  }
};
</script>

<style lang="scss">
@import './message';
</style>

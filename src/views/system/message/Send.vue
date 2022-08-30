<template>
  <div class="send-wrapper common-page-wrapper">
    <div class="send-content-account send-content">
      <div class="pr-30 pl-30 pt-30">
        <el-form ref="form" :model="formData" class="message-center-form" @submit.native.prevent>
          <el-form-item label="" prop="status">
            <el-select clearable v-model="formData.status" placeholder="请选择状态">
              <el-option
                :key="item"
                v-for="item in Object.keys(statusObj)"
                :label="statusObj[item]"
                :value="item"
              ></el-option>
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
          <el-form-item style="position: relative; width: 42px">
            <el-button type="primary" class="search-button text-center" @click="search"></el-button>
          </el-form-item>
          <el-form-item style="position: relative; width: 42px; margin-right: 136px;">
            <el-button type="primary" class="refresh-button text-center" @click="reset"></el-button>
          </el-form-item>
          <el-form-item style="position: relative; float: right; margin-right: 0">
            <PrimaryButton @click="showAddModal">{{ $$ButtonText.add }}</PrimaryButton>
          </el-form-item>
        </el-form>
      </div>
      <div class="horizontal-line" style="margin-bottom: 30px"></div>
      <div class="pr-30 pl-30 checkbox-edit">
        <el-table
          ref="Table"
          class="table-striped"
          highlight-current-row
          :data="tableData.records"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="index" width="208" label="序号">
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.$index + 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" width="520" prop="title">
            <el-tooltip slot-scope="scope" effect="dark" :content="scope.row.title" placement="top">
              <div style="float: left">
                <div style="width: auto; max-width: 520px">
                  <div class="show-dot">{{ scope.row.title }}</div>
                </div>
              </div>
            </el-tooltip>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="发布时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="状态">
            <template slot-scope="scope">
              {{ rowStatusObj[scope.row.status] || '--' }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="运维状态">
            <template slot-scope="scope">
              <span :class="getPriorityClass(scope.row.priority)">{{ messageLevel[scope.row.priority] }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <div class="row-wrapper float-container">
                <div class="row-dot float-left" @click.stop="onRowClick(scope.row, scope.$index, $event)"></div>
                <div @click="stop($event)" class="send-row-inner" :ref="`rowContent-${scope.$index}`">
                  <div class="a-menu" @click="onMenuClick(scope.row, $event)">
                    <div class="a-menu-item a-icon-eye" data-id="views">查看</div>
                    <template v-if="scope.row.status !== 'NOTICE_SUCCESS'">
                      <div class="a-menu-item a-icon-edit" data-id="edit">编辑</div>
                      <div class="a-menu-item a-icon-person" data-id="person">全员发送</div>
                      <div class="a-menu-item a-icon-plane" data-id="send">自定义发送</div>
                      <div class="a-menu-item a-icon-delete-active" data-id="delete">删除</div>
                    </template>
                  </div>
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
    <Detail v-if="visibleDetail" :visible="visibleDetail" :row-data="rowData" @reset="resetDetail"></Detail>
    <Modal
      v-if="isAdd || isEdit"
      :action-type="actionType"
      :row-data="rowData"
      :title="modalTitle"
      @add="generateSysMessage"
      @edit="editSysMessage"
      @reset="resetModal"
    ></Modal>
    <DeleteModal
      :data="rowData"
      display-key="title"
      :visible="visibleDel"
      @reset="resetDelModal"
      @submit="deleteSubmit"
    ></DeleteModal>
    <Person v-if="visibleSend" :visible="visibleSend" @selected="onSelectPerson" @reset="resetPersonModal"></Person>
  </div>
</template>

<script>
import APagination from '@/components/pagination/APagination';
import PrimaryButton from '@/components/button/PrimaryButton';
import DeleteModal from '@/components/modal/DelModal.vue';
import Detail from './send/Detail';
import Modal from './send/Modal';
import Person from './send/Person';

import { systemMessage } from '@/api/message';
import { getStyle } from '@/utils/utils';

import message from '@/mixins/message';
import { generateSysMessage, msgDataUpdate, msgDelete, sendSysMessage } from '@/api/message';

export default {
  name: 'action',
  components: {
    APagination,
    DeleteModal,
    Person,
    PrimaryButton,
    Detail,
    Modal
  },
  data() {
    return {
      tryCount: 0,
      visibleDel: false,
      deleteSubmit: () => {}, // Function
      formData: {
        status: '',
        priority: ''
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
      queryType: 'operateLog',
      visibleDetail: false,
      visibleSend: false,
      userIdList: [],
      actionType: '',
      modalTitle: '',
      rowData: {}
    };
  },
  mixins: [message],
  computed: {
    isAdd() {
      return this.actionType === this.$$ActionType.add;
    },
    isEdit() {
      return this.actionType === this.$$ActionType.edit;
    },
    isViews() {
      return this.actionType === this.$$ActionType.views;
    }
  },
  created() {
    this.getList();
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickEvent);
  },
  methods: {
    init() {
      document.addEventListener('click', this.clickEvent, false);
    },
    clickEvent(e) {
      const els = document.querySelectorAll('.send-row-inner');
      Array.prototype.forEach.call(els, el => {
        el.style.display = 'none';
      });
    },
    stop(event) {
      document.all ? (event.cancelBubble = true) : event.stopPropagation();
    },
    onRowClick(row, index, event) {
      this.operateRequestParams = row.operateRequestParams;
      this.operateResponseContent = row.operateResponseContent;
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
      this.stop(event);
    },
    onMenuClick(data, event) {
      if (!event) return;
      const { target } = event;
      const { dataset } = target;
      this.rowData = data;
      switch (dataset.id) {
        case 'views':
          this.visibleDetail = true;
          break;
        case 'edit':
          this.showEditModal();
          break;
        case 'person':
          this.userIdList = [];
          this.sendAll();
          break;
        case 'send':
          this.visibleSend = true;
          break;
        case 'delete':
          this.showDeleteModal();
          break;
      }
    },
    formatNumber(number) {
      return number < 10 ? '0' + number : number;
    },
    formatTime(row) {
      if (!row.eventTime) return '';
      return this.$$moment(row.eventTime || '').format('YYYY.MM.DD HH:mm:ss');
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
    getList() {
      const params = {
        current: this.pageCurrent,
        size: this.pageSize
      };
      if (this.formData.status.length) params.status = this.formData.status;
      if (this.formData.priority.length) params.priority = this.formData.priority;
      systemMessage(params).then(res => {
        const { code, object } = res;
        if (code === 200 && object) {
          const { records } = object;
          if (Array.isArray(records) && !records.length) {
            if (this.tryCount) {
              this.tryCount = 0;
              return;
            }
            this.pageCurrent = 1;
            this.tryCount++;
            this.getList();
          }
          this.tableData = object;
        }
      });
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
    showEditModal() {
      this.modalTitle = '消息编辑';
      this.actionType = this.$$ActionType.edit;
    },
    sendAll() {
      this.$confirm('确定 全员发送 吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.send();
        })
        .catch(() => this.$message({ type: 'info', message: '已取消' }));
    },
    send() {
      sendSysMessage({ id: this.rowData.id, userIdList: this.userIdList })
        .then(res => {
          // const { code, message } = res;
          // if (code === 200) {
          //   this.$message.success(message || '发送消息成功');
          // } else {
          //   this.$message.error(message || '发送消息失败');
          // }
          this.printMsg(res);
        })
        .finally(() => {
          this.visibleSend = false;
          this.getList();
        });
    },
    printMsg(result) {
      const { object, message, code } = result;
      if (code === 200 && object != null) {
        this.$message.success(message || '发送成功');
      } else {
        this.$message.error(message || '发送消息失败');
      }
    },
    showAddModal() {
      this.modalTitle = '消息添加';
      this.actionType = this.$$ActionType.add;
      this.rowData = {};
    },
    showDeleteModal() {
      this.visibleDel = true;
      this.deleteSubmit = this.deleteMessage;
    },
    onSelectPerson(list) {
      if (!Array.isArray(list)) return;
      this.userIdList = list.map(val => val.id);
      this.send();
    },
    resetPersonModal() {
      this.visibleSend = false;
    },
    resetModal() {
      this.actionType = '';
      this.rowData = {};
    },
    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    resetDetail() {
      // msgUserLogHasRead({ msgDataIdList: [this.rowData.id] })
      //   .then(res => {
      //     const { code, message } = res;
      //     if (code === 200) {
      //       // this.$message.success(message || '成功');
      //       console.log(message || '成功');
      //       this.getList();
      //       this.$store.dispatch('RefreshMessageCount');
      //     } else {
      //       // this.$message.error(message || '失败');
      //       console.log(message || '失败');
      //     }
      //   })
      //   .finally(() => {
      //     this.visibleDetail = false;
      //     this.rowData = {};
      //   });
      this.visibleDetail = false;
      this.rowData = {};
    },
    generateSysMessage(data) {
      generateSysMessage(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '添加成功');
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.getList();
        });
    },
    editSysMessage(data) {
      msgDataUpdate(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '添加成功');
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.getList();
        });
    },
    deleteMessage() {
      const id = this.rowData.id;
      if (!id) {
        this.$message.error(`数据不完整`);
        return;
      }
      if (!id) {
        this.$message.error(`数据不完整`);
        return;
      }
      msgDelete(id)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '删除成功');
          } else {
            this.$message.error(message || '删除失败');
          }
        })
        .finally(() => {
          this.visibleDel = false;
          this.rowData = {};
          this.getList();
        });
    }
  }
};
</script>

<style lang="scss">
@import './send/send';
@import '@/styles/menu';
</style>

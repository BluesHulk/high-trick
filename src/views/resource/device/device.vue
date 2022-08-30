<template>
  <div class="log-wrapper common-page-wrapper">
    <div
      v-if="typeFrom == 'views' || typeFrom == 'add' || typeFrom == 'edit'"
      class="log-content scrollbar scrollbar-y scrollbar-light resource-manage"
    >
      <device-form
        :current-data="currentData"
        :type-from="typeFrom"
        :action-type="actionType"
        @submit-add="submitAdd"
      ></device-form>
    </div>
    <div v-else class="log-content scrollbar scrollbar-y scrollbar-light resource-manage">
      <div class="pr-30 pl-30 pt-30" style="overflow:hidden;">
        <div class="float-left form-select-left">
          <el-form ref="form" :model="formData" class="log-user-form" @submit.native.prevent>
            <el-form-item prop="categoryId">
              <el-cascader
                v-model="formData.categoryId"
                :options="categoryList"
                :props="props"
                :show-all-levels="false"
                placeholder="请选择设备类型"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item prop="status">
              <el-select clearable v-model="formData.status" placeholder="请选择设备状态">
                <el-option :key="item.id" v-for="item in statusList" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="onlineStatus">
              <el-select clearable v-model="formData.onlineStatus" placeholder="请选择在线状态">
                <el-option :key="item.id" v-for="item in onlineList" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="maintainStatus">
              <el-select clearable v-model="formData.maintainStatus" placeholder="请选择运维状态">
                <el-option :key="item.id" v-for="item in maintainList" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="nameOrCode">
              <el-input
                clearable
                v-model="formData.nameOrCode"
                autocomplete="off"
                placeholder="请输入设备编号/名称"
              ></el-input>
            </el-form-item>
            <el-form-item style="position: relative">
              <el-button type="primary" class="search-button text-center" @click="search"></el-button>
              <el-button type="primary" class="search-button reset-button text-center" @click="reset"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="float-right form-select-right">
          <ActionButton @click="add" :type="$$ActionType.add">{{ $$ButtonText.plus }}</ActionButton>
        </div>
      </div>
      <div class="horizontal-line" style="margin-bottom: 30px"></div>
      <div class="pr-30 pl-30">
        <el-table
          ref="Table"
          :data="tableData.records"
          height="565"
          tooltip-effect="dark"
          class="freestyle-table"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip label="编号" width="210" prop="code"></el-table-column>
          <el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>
          <el-table-column show-overflow-tooltip label="所属类型" prop="category.name"></el-table-column>
          <el-table-column show-overflow-tooltip label="所属空间" prop="spaceData.name">
            <template slot-scope="scope">
              <span v-if="scope.row.spaceData">{{ scope.row.spaceData.name || '--' }}</span>
              <span v-else>{{ '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="设备状态" prop="status">
            <template slot-scope="scope">{{ status(scope.row.status) }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="在线状态" prop="onlineStatus">
            <template slot-scope="scope">{{ onlineStatus(scope.row.onlineStatus) }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="开关状态" prop="onOffStatus">
            <template slot-scope="scope">{{ onOffStatus(scope.row.onOffStatus) }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="运维状态" prop="maintainStatus">
            <template slot-scope="scope">{{ maintainStatus(scope.row.maintainStatus) }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="位置" prop="positionDesc">
            <template slot-scope="scope">{{ scope.row.positionDesc || '--' }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="80" prop="">
            <template slot-scope="scope">
              <el-tooltip popper-class="freestyle-tooltip" effect="light" placement="bottom">
                <div slot="content" class="tooltip-box">
                  <!-- <p @click="view(scope.row)" type="danger">
                    <img src="../../../assets/button/control.png" /><span>测试</span>
                  </p> -->
                  <p @click="view(scope.row)" type="danger">
                    <img src="../../../assets/button/views.png" /><span>查看</span>
                  </p>
                  <p @click="edit(scope.row)" type="danger">
                    <img src="../../../assets/button/edit-active.png" /><span>编辑</span>
                  </p>
                  <p @click="del(scope.row)" type="danger">
                    <img src="../../../assets/button/del-active.png" /><span>删除</span>
                  </p>
                </div>
                <el-button class="idoot"></el-button>
              </el-tooltip>
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
    <del-confirm
      v-if="delVisible"
      :del-visible="delVisible"
      :del-text="delText"
      @del-concel="delConcel"
      @del-submit="delSubmit"
    ></del-confirm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import APagination from '@/components/pagination/APagination';
import deviceForm from '@/views/resource/device/deviceForm';
import delConfirm from '@/views/resource/delConfirm';
import ActionButton from '@/components/button/ActionButton.vue';
import { getDeviceData, deviceUpdate, getCategoryQuery } from '@/api/config';

export default {
  name: 'res-device',
  components: {
    APagination,
    deviceForm,
    delConfirm,
    ActionButton
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      actionType: '',
      tableData: {},
      pageSize: 10,
      pageCurrent: 1,
      multipleSelection: [],
      currentData: {},
      formData: {
        categoryId: [],
        status: null,
        onlineStatus: null,
        maintainStatus: null,
        nameOrCode: ''
      },
      categoryList: [],
      props: {
        lazy: true,
        label: 'name',
        value: 'id',
        lazyLoad: this.getQueryById
      },
      statusList: [
        { name: '正常', id: true },
        { name: '故障', id: false }
      ],
      onlineList: [
        { name: '在线', id: true },
        { name: '离线', id: false }
      ],
      maintainList: [
        { name: '维护中', id: 0 },
        { name: '维修中', id: 1 }
      ],
      typeFrom: '',
      delVisible: false,
      delText: '',
      delObject: {}
    };
  },
  mounted() {
    this.deviceCategory();
    this.getDeviceList(this.formData);
    localStorage.clear('device');
    localStorage.clear('asset');
    localStorage.clear('space');
    localStorage.clear('member');
    localStorage.clear('deviceCategory');
  },
  methods: {
    // 类别树
    deviceCategory(val) {
      getCategoryQuery({ type: 'DEVICE' }).then(res => {
        if (res.code == 200) {
          this.categoryList = res.object;
        }
      });
    },
    // 类型树
    getQueryById(node, resolve) {
      if (node.data) {
        getCategoryQuery({ type: 'DEVICE', parentId: node.data.id }).then(res => {
          if (res.code == 200) {
            const { level } = node;
            const nodes = res.object.map(item => ({
              name: item.name,
              id: item.id,
              leaf: level < 2
            }));
            resolve(nodes);
          }
        });
      }
    },
    getDeviceList(val) {
      const data = {};
      data.current = this.pageCurrent;
      data.size = this.pageSize;
      if (val.categoryId.length) {
        data.categoryId = val.categoryId[1];
      }
      if (val.status != null) {
        data.status = val.status;
      }
      if (val.onlineStatus != null) {
        data.onlineStatus = val.onlineStatus;
      }
      if (val.maintainStatus != null) {
        data.maintainStatus = val.maintainStatus;
      }
      if (val.nameOrCode) {
        data.nameOrCode = val.nameOrCode;
      }
      getDeviceData(data).then(res => {
        if (res.code == 200) {
          this.tableData = res.object;
        }
      });
    },
    search() {
      this.pageCurrent = 1;
      this.getDeviceList(this.formData);
    },
    reset() {
      this.$refs['form'].resetFields();
      this.pageCurrent = 1;
      this.getDeviceList(this.formData);
    },
    status(val) {
      switch (val) {
        case true:
          return '正常';
        case false:
          return '故障';
        default:
          return '--';
      }
    },
    onlineStatus(val) {
      switch (val) {
        case true:
          return '在线';
        case false:
          return '离线';
        default:
          return '--';
      }
    },
    onOffStatus(val) {
      switch (val) {
        case true:
          return '开';
        case false:
          return '关';
        default:
          return '--';
      }
    },
    maintainStatus(val) {
      switch (val) {
        case 0:
          return '维护中';
        case 1:
          return '维修中';
        default:
          return '--';
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDeviceList(this.formData);
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getDeviceList(this.formData);
    },
    add() {
      this.typeFrom = 'add';
      this.actionType = 'add';
    },
    view(val) {
      this.currentData = val;
      this.typeFrom = 'views';
      this.actionType = 'views';
    },
    edit(val) {
      this.currentData = val;
      this.typeFrom = 'edit';
      this.actionType = 'edit';
    },
    del(data, node) {
      this.delVisible = true;
      this.delText = data.name;
      this.delObject = data;
    },
    delConcel() {
      this.delVisible = false;
    },
    delSubmit() {
      deviceUpdate({ id: this.delObject.id, deleted: true }).then(res => {
        if (res.code == 200) {
          this.$message.success('设备删除成功');
          this.getDeviceList(this.formData);
          this.delVisible = false;
        } else {
          this.$message.error(res.message || '设备删除失败');
        }
      });
    },
    submitAdd() {
      this.currentData = {};
      this.typeFrom = '';
      this.getDeviceList(this.formData);
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
@import '@/views/system/log/log';
@import '@/views/resource/resource';
</style>

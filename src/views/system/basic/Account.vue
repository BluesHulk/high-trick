<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head float-container">
        <el-input
          clearable
          @clear="search"
          placeholder="搜索"
          v-model="searchValue"
          class="float-left input-container mr-20 search-container"
          style="width: 210px"
        >
          <el-button slot="append" icon="el-icon-search" @click="search">
            <div style="width: 100%; height: 100%"></div>
          </el-button>
        </el-input>
        <el-select
          clearable
          @clear="loadMore"
          v-model="enable"
          placeholder="请选择状态"
          class="input-container float-left mr-20"
          style="width: 150px"
          @change="onEnableChange"
        >
          <el-option v-for="(item, index) in $$Enable.List" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <CircleButton :type="$$ActionType.add" @click="addAccount">{{ $$ButtonText.plus }}</CircleButton>
      </div>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loaded"
        infinite-scroll-distance="10"
        class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light"
      >
        <div class="list-wrapper" ref="DataList">
          <div
            style="padding: 16px 50px; height: 54px"
            class="float-container list-item"
            :class="{ selected: index === currentIndex }"
            v-for="(item, index) in dataList"
            :key="index"
            @click="onSelect(index, item, $event)"
          >
            <div class="float-left">
              <el-tooltip effect="dark" :content="item.username" placement="top">
                <div class="account-name show-dot">
                  {{ item.username }}
                </div>
              </el-tooltip>
              <div class="account-phone">{{ item.phone || '--' }}</div>
            </div>
            <div class="float-right">
              <ImageButton data-id="enabled" :src="ButtonImage[item.enable]"></ImageButton>
              <div data-id="edit" class="edit"></div>
              <div class="delete" @click.stop="del(item)"></div>
            </div>
          </div>
        </div>
        <div class="lazy-loader"></div>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <template v-if="actionType === $$ActionType.add || actionType === $$ActionType.edit">
          <!--<div class="page-title">{{ $$ButtonText[GlobalActionType] }}</div>-->
          <div class="page-title">{{ $$ButtonText[actionType] }}</div>
          <div>
            <div class="reset-button el-button text-center" v-if="isEdit" style="margin-right: 20px" @click="resetPwd">
              重置密码
            </div>
            <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
          </div>
        </template>
        <div v-else class="page-title">查看</div>
      </div>
      <AForm
        class="centered mb-14"
        gutter="30"
        width="670"
        ref="autoForm"
        v-model="formData"
        :col="2"
        :elements="elements"
        :rules="rules"
        inline
        stretch
      ></AForm>
      <div class="horizontal-line"></div>
      <div style="height: 30px"></div>
      <NavBox :list="navList" @selected="selectTab" style="margin-bottom: 40px"></NavBox>
      <div class="pl-30 pr-30 role-table-wrapper">
        <!--<ATable
          v-if="selectTabType === 'role'"
          highlight-current-row
          ref="tableRef"
          :records="roleRecords"
          :columns="columns"
          @table="getTable"
          @selection-change="handleSelectionChange"
        ></ATable>-->
        <!--<el-table
          v-if="selectTabType === 'role'"
          highlight-current-row
          ref="roleTable"
          :data="roleRecords"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          &lt;!&ndash;<el-table-column align="center" label="序号" type="index" width="260px"></el-table-column>&ndash;&gt;

          <el-table-column align="center" type="index" width="260" label="序号">
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.$index + 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="角色名称" prop="name"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="操作" width="260px">
            <template slot-scope="scope">
              &lt;!&ndash;{{ scope.row.renderChecked }}&ndash;&gt;
              <a-el-checkbox
                :class="getCheckboxClass(scope.row)"
                :disabled="isViews"
                :id="scope.row.id"
                @change="changeCheckbox(scope.row)"
                v-model="scope.row.renderChecked"
              ></a-el-checkbox>
            </template>
          </el-table-column>
        </el-table>-->
        <Role ref="Role" v-show="selectTabType === 'role'" :current-node="currentNode" :action-type="actionType"></Role>
        <Project
          ref="Project"
          v-show="selectTabType === 'project'"
          :current-node="currentNode"
          :action-type="actionType"
        ></Project>
        <Space
          ref="Space"
          v-show="selectTabType === 'space'"
          :current-node="currentNode"
          :action-type="actionType"
        ></Space>
        <Device
          ref="Device"
          v-show="selectTabType === 'device'"
          :current-node="currentNode"
          :current-auth="currentAuth"
          :action-type="actionType"
        ></Device>
        <Other
          ref="Other"
          v-show="selectTabType === 'xasset'"
          :current-node="currentNode"
          :current-auth="currentAuth"
          :action-type="actionType"
        ></Other>
      </div>
    </template>
    <DeleteModal
      :data="currentNode"
      display-key="username"
      :visible="visibleDel"
      @reset="resetDelModal"
      @submit="deleteSubmit"
    ></DeleteModal>
    <Person
      v-if="showPersonModal"
      :visible="showPersonModal"
      @selected="onSelectPerson"
      @reset="resetPersonModal"
    ></Person>
  </TreeContent>
</template>

<script>
import TreeContent from '@/components/layout/TreeContent.vue';
import CircleButton from '@/components/button/CircleButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import AForm from '@/components/form/AForm';
// import ATable from '@/components/table/ATable';
import ImageButton from '@/components/button/ImageButton.vue';
import ButtonImage from '@/constants/ButtonImage';
import { mapGetters } from 'vuex';
import DeleteModal from '@/components/modal/DelModal.vue';
import Person from './account/Person';
import NavBox from './account/NavBox.vue';

import { userQueryPage, userAdd, userUpdate, userDelete, dataAuthUpdate, dataAuthQueryById } from '@/api/rbac';
import { resourceDeviceDataQueryDeviceList } from '@/api/resource';
import Project from './account/Project';
import Role from './account/Role';
import Space from './account/Space';
import Device from './account/Device';
import Other from './account/Other';

const md5 = require('md5');

// const columns = vm => [
//   {
//     label: '序号',
//     type: 'index',
//     width: 260,
//     align: 'center'
//   },
//   {
//     label: '角色名称',
//     prop: 'name',
//     showOverflowTooltip: true,
//     align: 'center'
//   },
//   {
//     label: '操作',
//     type: 'selection',
//     width: 260,
//     align: 'center'
//   }
// ];

export default {
  name: 'account',
  components: {
    Role,
    Project,
    Space,
    Device,
    Other,
    AForm,
    // ATable,
    CircleButton,
    DeleteModal,
    Person,
    NavBox,
    PrimaryButton,
    ImageButton,
    TreeContent
  },
  computed: {
    isViews() {
      return this.actionType === this.$$ActionType.views;
    },
    isAdd() {
      return this.actionType === this.$$ActionType.add;
    },
    isEdit() {
      return this.actionType === this.$$ActionType.edit;
    },
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      navList: [],
      // 分页
      total: 0,
      size: 0,
      loaded: false,
      // 角色
      // roleRecords: [],
      // roleTotal: 0,
      // roleSize: 50,
      // roleLoaded: false,
      tableRoleRef: null,
      // roleSelection: [],
      // columns: columns(this),
      // 选中项
      currentIndex: 0,
      ButtonImage,
      dataList: [],
      actionType: '',
      currentNode: {},
      currentAuth: {},
      enable: '',
      searchValue: '',
      elements: [],
      formData: {
        staffName: '',
        username: '',
        phone: '',
        date: ''
      },
      rules: {
        // spaceName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        // staffName: [{ required: true, message: '请输入名称', trigger: 'change' }]
      },
      // dialog
      memberTitle: '',
      memberAction: '',
      // 删除对话框
      deleteSubmit: () => {}, // Function
      visibleDel: false,
      showPersonModal: false,
      selectedTabData: null,
      selectTabType: 'role'
    };
  },
  watch: {
    actionType() {
      this.setElements();
      // this.setRules();
    }
  },
  created() {
    this.resourceDeviceDataQueryDeviceList();
    this.setElements();
  },
  methods: {
    resourceDeviceDataQueryDeviceList() {
      resourceDeviceDataQueryDeviceList().then(res => {
        const { code, object } = res;
        if (code === 200 && Array.isArray(object)) {
          this.navList = object;
        }
      });
    },
    search() {
      this.size = 0;
      this.loadMore();
    },
    async loadMore() {
      if (this.total < this.size) return;
      const val = this.searchValue.replace(/(^\s+)|(\s+$)/g, '');
      this.searchValue = val;
      const data = {};
      if (val) data.condition = val;
      if (typeof this.enable === 'boolean') data.enable = this.enable;
      this.loaded = true;
      this.size += 50;
      this.$$ALoading.show();
      data.size = this.size;
      const res = await userQueryPage(data);
      const { code, object } = res;
      if (code === 200 && this.$$util.isObject(object)) {
        const { records, total } = object;
        if (Array.isArray(records)) {
          this.loaded = false;
          this.size = object.size;
          this.total = total;
          this.dataList = records;
        }
      }
      this.$$ALoading.close();
      this.onSelect(this.currentIndex);
    },
    setRules() {
      const validName = (rule, value, callback) => {
        const len = value.replace(/(^\s+)|(\s+$)/g, '').length;
        if (len) {
          callback();
        } else {
          callback(new Error('请选择'));
        }
      };
      switch (this.actionType) {
        case this.$$ActionType.add:
        case this.$$ActionType.edit:
          this.rules = {
            // username: [{ validator: validName, required: true, message: '请输入英文或数字', trigger: 'blur' }],
            staffName: [{ validator: validName, required: true, trigger: 'blur' }],
            phone: [{ validator: this.$$Validator.checkPhone(), trigger: 'blur' }]
          };
          break;
        case this.$$ActionType.views:
          this.rules = {};
          this.$nextTick(() => {
            this.$refs.autoForm && this.$refs.autoForm.clearValidate(['staffName', 'phone']);
          });
          break;
      }
    },
    selectTab(data) {
      const domain = data.domain.toLowerCase();
      this.selectTabType = domain;
      this.selectedTabData = data;
      switch (domain) {
        case 'role':
          // this.loadRole();
          this.$nextTick(() => {
            this.$refs.Role.loadData();
          });
          break;
        case 'project':
          this.$nextTick(() => {
            this.loadProjects();
          });
          break;
        case 'place':
          break;
        case 'space':
          this.$nextTick(() => {
            this.$refs.Space.loadData();
          });
          break;
        case 'device':
          this.$nextTick(() => {
            this.$refs.Device.loadData({ type: 'DEVICE' });
            this.$refs.Device.fixTreeNodeWrapperStyle();
          });
          break;
        case 'xasset':
          this.$nextTick(() => {
            this.$refs.Other.loadData({ type: 'XASSET' });
            this.$refs.Other.fixTreeNodeWrapperStyle();
          });
          break;
      }
    },
    enabled(item, index) {
      const data = { id: item.id, enable: !item.enable };
      this.$$ALoading.show();
      userUpdate(data)
        .then(res => {
          this.dataList = [];
          this.loaded = false;
          this.size = 0;
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '添加成功');
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.$$ALoading.close();
          this.actionType = this.$$ActionType.views;
          this.loadMore();
        });
    },
    edit(data) {
      this.currentNode = data;
      this.actionType = this.$$ActionType.edit;
    },
    del(data) {
      this.currentNode = data;
      this.visibleDel = true;
      this.deleteSubmit = this.userDelete;
    },
    onSelect(index, item, event) {
      this.currentIndex = index;
      if (!item) item = this.dataList[index || 0];
      for (let i = 0; i < this.dataList.length; i++) {
        const d = this.dataList[i];
        if (d.id !== item.id) {
          this.$set(d, 'selected', false);
        }
      }
      item.selected = true;
      this.currentNode = item;
      const { target } = event || {};
      const { dataset } = target || {};
      switch ((dataset || {}).id) {
        case 'enabled':
          this.enabled(item);
          this.actionType = this.$$ActionType.views;
          this.$nextTick(() => {
            this.$refs.autoForm && this.$refs.autoForm.clearValidate(['staffName']);
          });
          break;
        case 'edit':
          this.edit(item);
          this.loadAllList();
          break;
        default:
          this.actionType = this.$$ActionType.views;
          this.loadAllList();
          this.$nextTick(() => {
            this.$refs.autoForm && this.$refs.autoForm.clearValidate(['staffName']);
          });
      }
      this.setFormData();
      this.$store.dispatch('SetGlobalActionType', this.actionType);
    },
    loadAllList() {
      // this.roleLoaded = false;
      // this.roleRecords = [];
      // this.roleSelection = [];
      // this.roleTotal = 0;
      // this.loadRole();
      dataAuthQueryById(this.currentNode.id).then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.currentAuth = object || {};
          this.$refs.Role.loadData();
          this.loadProjects();
          this.loadDevices();
          this.loadAssets();
        }
      });
    },
    loadProjects() {
      const PROJECT = this.currentAuth.PROJECT || [];
      this.$refs.Project.loadData().then(() => {
        if (PROJECT.length) {
          for (let i = 0; i < this.$refs.Project.records.length; i++) {
            const p = this.$refs.Project.records[i];
            for (let j = 0; j < PROJECT.length; j++) {
              const id = PROJECT[j];
              if (id === p.id) {
                this.$set(this.$refs.Project.records[i], 'renderChecked', true);
              }
            }
          }
        } else {
          for (let i = 0; i < this.$refs.Project.records.length; i++) {
            this.$set(this.$refs.Project.records[i], 'renderChecked', false);
          }
        }
      });
    },
    loadDevices() {
      // const DEVICE = this.currentAuth.DEVICE || [];
      this.$refs.Device.loadData({ type: 'DEVICE' }).then(() => {
        // 树结构结构通过多个接口返回动态加载并挂载到页面上，和项目表格式的数据加载是由差异的，因此，下面的页面需要在设备节点加载到数据之后处理
        // 下面注释的代码适合处理表格数据回现业务
        // if (DEVICE.length) {
        //   for (let i = 0; i < this.$refs.Device.records.length; i++) {
        //     const p = this.$refs.Device.records[i];
        //     for (let j = 0; j < DEVICE.length; j++) {
        //       const id = DEVICE[j];
        //       if (id === p.id) {
        //         this.$set(this.$refs.Device.records[i], 'checked', true);
        //       }
        //     }
        //   }
        // } else {
        //   for (let i = 0; i < this.$refs.Device.records.length; i++) {
        //     this.$set(this.$refs.Device.records[i], 'checked', false);
        //   }
        // }
      });
    },
    loadAssets() {
      this.$refs.Other.loadData({ type: 'XASSET' }).then(() => {
        // 可以处理异步业务
      });
    },
    resetFormData() {
      this.formData.staffName = '';
      this.formData.username = '';
      this.formData.phone = '';
      this.formData.date = '';
    },
    setFormData() {
      this.formData.staffName = this.currentNode.staffName;
      this.formData.username = this.currentNode.username;
      this.formData.phone = this.currentNode.phone;
      this.formData.date = this.currentNode.createdTime;
    },
    onEnableChange(val) {
      this.enable = val;
      this.userQueryPage();
    },
    filter(arr = []) {
      const o = {};
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        o[item.id] = item;
      }
      return Object.values(o);
    },
    // button
    addAccount() {
      this.resetFormData();
      // this.roleRecords = [];
      // this.roleTotal = 0;
      // this.roleLoaded = false;
      // this.roleSelection = [];
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.add);
      this.actionType = this.$$ActionType.add;
      this.setRules();
      this.$refs.Role.loadData();
    },
    onUserFocus(event) {
      this.showPersonModal = true;
    },
    resetPersonModal() {
      this.showPersonModal = false;
    },
    onSelectPerson(node) {
      this.formData.staffName = node.name;
      this.formData.username = node.username;
      this.formData.phone = node.phone;
      this.formData.date = node.createdTime;
      this.formData.staffId = node.id;
      this.$refs.autoForm.validateField('staffName');
    },
    setElements() {
      if (this.isViews) {
        this.elements = [
          {
            label: '姓名',
            prop: 'staffName',
            type: this.$$FormItem.Input,
            labelPosition: 'top',
            placeholder: '请选择人员',
            disabled: this.isViews
          },
          {
            label: '账号',
            prop: 'username',
            type: this.$$FormItem.Input,
            labelPosition: 'top',
            disabled: this.isViews
          },
          {
            label: '手机',
            prop: 'phone',
            type: this.$$FormItem.Input,
            labelPosition: 'top',
            disabled: this.isViews
          },
          { label: '创建日期', prop: 'date', type: this.$$FormItem.Date, labelPosition: 'top', disabled: this.isViews }
        ];
      } else if (this.isEdit || this.isAdd) {
        this.elements = [
          {
            label: '姓名',
            prop: 'staffName',
            type: this.$$FormItem.Input,
            labelPosition: 'top',
            placeholder: '请选择人员',
            disabled: this.isEdit,
            focus: event => {
              this.onUserFocus(event);
            }
          },
          {
            label: '账号',
            prop: 'username',
            type: this.$$FormItem.Input,
            labelPosition: 'top',
            disabled: true
          },
          {
            label: '手机',
            prop: 'phone',
            type: this.$$FormItem.Input,
            labelPosition: 'top',
            disabled: true
          }
        ];
      }
    },
    memberReset() {
      this.memberTitle = '';
      this.memberAction = '';
    },
    resetPwd() {
      this.$$ALoading.show();
      userUpdate({ id: this.currentNode.id, whetherFirst: true })
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '重置成功');
          } else {
            this.$message.error(message || '重新失败');
          }
        })
        .finally(() => {
          this.$$ALoading.close();
        });
    },
    save() {
      this.$refs.autoForm.submitForm().then(valid => {
        if (!valid) return;
        switch (this.actionType) {
          case this.$$ActionType.add:
            this.userAdd();
            break;
          case this.$$ActionType.edit:
            this.userUpdate();
            this.dataAuthUpdate();
            break;
        }
      });
    },
    dataAuthUpdate(userId) {
      userId = userId || this.currentNode.id;
      const projectRecords = this.$refs.Project.records;
      const projectAdd = projectRecords.filter(value => value.renderChecked).map(value => value.id);
      const projectDel = projectRecords.filter(value => !value.renderChecked).map(value => value.id);
      const deviceRecords = this.$refs.Device.records;
      const deviceAdd = deviceRecords.filter(value => value.checked).map(value => value.id);
      const deviceDel = deviceRecords.filter(value => !value.checked).map(value => value.id);
      const assetRecords = this.$refs.Other.records;
      const assetAdd = assetRecords.filter(value => value.checked).map(value => value.id);
      const assetDel = assetRecords.filter(value => !value.checked).map(value => value.id);
      const data = {
        userId,
        dataAuth: [
          {
            domain: 'PROJECT',
            add: projectAdd,
            del: this.isAdd ? [] : projectDel
          },
          {
            domain: 'DEVICE',
            add: deviceAdd,
            del: this.isAdd ? [] : deviceDel
          },
          {
            domain: 'XASSET',
            add: assetAdd,
            del: this.isAdd ? [] : assetDel
          }
        ]
      };
      return dataAuthUpdate(data).then(res => {
        const { code, message } = res;
        if (code === 200) {
          this.$message.success(message);
        } else {
          this.$message.error(message);
        }
      });
    },
    userAdd() {
      // if (!this.currentNode) {
      //   this.$message.info(`数据不完整`);
      //   return;
      // }
      // if (!this.currentNode.id) {
      //   this.$message.info(`数据不完整`);
      //   return;
      // }
      const data = {
        staffName: this.formData.staffName,
        username: this.formData.username,
        password: md5(this.formData.username),
        staffId: this.formData.staffId
      };
      const roleId = this.$refs.Role.records
        .filter(value => value.renderChecked)
        .map(value => value.id)
        .join(',');
      if (roleId) data.roleId = roleId;
      this.$$ALoading.show();
      return userAdd(data)
        .then(async res => {
          const { code, message, object } = res;
          if (code === 200) {
            this.loaded = false;
            this.total = 0;
            this.dataList = [];
            this.$message.success(message || '添加成功');
            await this.dataAuthUpdate(object.id);
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.$$ALoading.close();
          this.actionType = this.$$ActionType.views;
          this.size = 0;
          this.loadMore();
          // this.onSelect(this.currentIndex);
        });
    },
    userUpdate() {
      this.$nextTick(() => {
        this.$$ALoading.show();
        this.$nextTick(() => {
          const data = { ...this.formData, id: this.currentNode.id };
          const roleId = this.$refs.Role.records
            .filter(value => value.renderChecked)
            .map(value => value.id)
            .join(',');
          if (roleId) data.roleId = roleId;
          userUpdate(data)
            .then(res => {
              const { code, message } = res;
              if (code === 200) {
                this.$message.success(message || '添加成功');
              } else {
                this.$message.error(message || '添加失败');
              }
            })
            .finally(() => {
              this.dataList = [];
              this.$$ALoading.close();
              this.actionType = this.$$ActionType.views;
              this.size = 0;
              this.loadMore();
              // this.onSelect(this.currentIndex);
            });
        });
      });
    },
    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    userDelete() {
      if (!this.currentNode) {
        this.$message.info('数据不完整');
        return;
      }
      if (!this.currentNode.id) {
        this.$message.info('数据不完整');
        return;
      }
      userDelete(this.currentNode.id)
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
          this.dataList = [];
          this.loaded = false;
          this.size = 0;
          this.currentNode = {};
          this.loadMore();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
.input-container {
  height: 42px;
  input {
    height: 42px;
  }
}
.account-name {
  height: 32px;
  font-size: 16px;
  font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
  font-weight: 500;
  color: $--color-dark;
  //line-height: 24px;
  max-width: 280px;
}
.account-phone {
  height: 14px;
  font-size: 14px;
  font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
  font-weight: 500;
  color: $--color-form-label;
  line-height: 21px;
}
</style>
<style lang="scss">
@import '@/styles/ui-theme';
.input-container {
  height: 42px;
  input {
    height: 42px;
    font-size: 14px;
    color: $--color-username;
    letter-spacing: 1px;
  }
}
.search-container {
  .el-input-group__append {
    cursor: pointer;
    background: url(../../../assets/button/search.png) center no-repeat;
  }
  .el-icon-search {
    display: none;
  }
  .el-input__inner:focus {
    border: 1px solid $--color-pink;
  }
  .el-input__inner {
    border-right: none;
    font-size: 14px;
    color: rgba(68, 79, 132, 0.3);
    line-height: 22px;
    letter-spacing: 1px;
  }
}
.reset-button {
  padding-left: 0;
  padding-right: 0;
  width: 100px;
  height: 42px;
  border-radius: 24px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  border: 1px solid $--color-pink;
  color: $--color-username;
  line-height: 24px;
  letter-spacing: 1px;
}
</style>

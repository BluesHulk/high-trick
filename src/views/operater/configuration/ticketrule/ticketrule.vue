<template>
  <div class="order-wrapper common-page-wrapper">
    <div v-if="isMessageAuto === 1" class="order-content-account order-content">
      <div class="pr-30 pl-30 pt-30 border-b">
        <el-form ref="form" class="order-user-form" @submit.native.prevent>
          <el-form-item>
            <div class="block">
              <el-select @change="equipChangeTypeHeader" v-model="equipSortvalue" placeholder="请选择设备类别">
                <el-option v-for="item in equipSort" :key="item.value" :label="item.label" :value="item"> </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="block">
              <el-select @change="equipChangeErrorHeader" placeholder="请选择设备类型" v-model="equipTypevalue">
                <el-option v-for="item in equipType" :key="item.value" :label="item.label" :value="item"> </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="block">
              <el-select placeholder="请选择故障类型" v-model="equipErrorvalue">
                <el-option v-for="item in equipError" :key="item.value" :label="item.label" :value="item"> </el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item style="position: relative">
            <el-button type="primary" class="search-button text-center" @click="search"></el-button>
            <el-button type="primary" class="reload-button text-center" @click="reload"></el-button>
          </el-form-item>
          <el-button type="primary" class="text-center add" @click="addRule">添加</el-button>
          <el-button type="primary" class="text-center add" @click="mesSetting">消息配置</el-button>
          <el-button type="primary" class="text-center add" @click="autoCompelte">自动生成配置</el-button>
        </el-form>
      </div>
      <div class="horizontal-line" style="margin-bottom: 30px"></div>

      <div class="pr-30 pl-30">
        <el-table
          class="tableC"
          ref="Table"
          :data="tableData.records"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="index" width="200" label="序号">
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.$index + 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="设备类别/类型">
            <template slot-scope="scope">
              <span>{{ scope.row.deviceCategoryName }}/{{ scope.row.deviceTypeName }}</span>
            </template>
          </el-table-column>
          <!--prop为字段名称 -->
          <el-table-column show-overflow-tooltip label="故障类型" prop="faultTypeName"></el-table-column>
          <el-table-column show-overflow-tooltip label="优先级" prop="priorityLevel">
            <template slot-scope="scope">
              <span style="color: #0f1736" v-if="scope.row.priorityLevel == 'COMMON'">普通</span>
              <span style="color: #ffad3c" v-if="scope.row.priorityLevel == 'URGENT'">紧急</span>
              <span style="color: #ff4807" v-if="scope.row.priorityLevel == 'UNUSUALLY_URGENT'">特级</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="维修时间" prop="repairTime"></el-table-column>
          <el-table-column show-overflow-tooltip label="限定时间" prop="limitTime"></el-table-column>
          <el-table-column show-overflow-tooltip label="维修预案" prop="repairPlan">
            <template slot-scope="scope">
              <span style="width: 215px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{
                scope.row.repairPlan
              }}</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip align="center" label="操作">
            <template slot-scope="scope">
              <p class="iconImgOperater" type="danger">
                <img
                  @click="handleAbandoned(scope.$index, scope.row)"
                  src="../../../../assets/button/edit-active.png"
                />
                <img @click="handleDel(scope.$index, scope.row)" src="../../../../assets/button/del-active.png" />
              </p>
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
    <el-dialog
      title="消息配置"
      class="dialog-rule"
      :visible.sync="messDialogVisible"
      v-if="messDialogVisible"
      width="535px"
      :close-on-click-modal="false"
    >
      <div>
        <el-form ref="form" :model="formData" class="order-user-form" @submit.native.prevent>
          <el-form-item prop="errorMes">
            <div class="demonstration">故障消息模板</div>
            <el-select v-model="formData.errorMes" placeholder="请选择消息模板">
              <el-option v-for="item in errorMes" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orderMes">
            <div class="demonstration">收到工单消息模板</div>
            <el-select v-model="formData.orderMes" placeholder="请选择消息模板">
              <el-option v-for="item in orderMes" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer-mes">
        <el-button class="cancleDialog" @click="mesCancle">取 消</el-button>
        <el-button class="confimDialog" type="primary" @click="mesSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :title="addOrEdit"
      class="dialog-rule"
      @close="closeDialog"
      :visible.sync="editDialogRule"
      width="535px"
    >
      <div>
        <el-form ref="addoredit" :model="addOrEditForm" class="order-user-form" @submit.native.prevent>
          <el-form-item prop="valueEquip">
            <div class="demonstration">设备类别</div>
            <el-select
              :disabled="isAdd === 2"
              v-model="addOrEditForm.valueEquip"
              @change="equipChangeType"
              placeholder="请选择设备类别"
            >
              <el-option v-for="item in equipSort" :key="item.value" :label="item.label" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="equipTypeModal">
            <div class="demonstration">设备类型</div>
            <el-select
              :disabled="isAdd === 2"
              v-model="addOrEditForm.equipTypeModal"
              @change="equipChangeError"
              placeholder="请选择设备类型"
            >
              <el-option v-for="item in equipType" :key="item.value" :label="item.label" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="errortype">
            <div class="demonstration">故障类型</div>
            <el-select :disabled="isAdd === 2" v-model="addOrEditForm.errortype" placeholder="请选择故障类型">
              <el-option v-for="item in errortypeSelect" :key="item.value" :label="item.label" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="level">
            <div class="demonstration">优先级</div>
            <el-select v-model="addOrEditForm.level" :disabled="isAdd === 2" placeholder="请选择优先级">
              <el-option v-for="item in levelSelect" :key="item.value" :label="item.label" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <div class="timeTip">
            <el-form-item prop="inputFixTime">
              <div class="demonstration">维修时间</div>
              <el-input
                onkeyup="value=value.replace(/[^\d]/g,'')"
                v-model="addOrEditForm.inputFixTime"
                placeholder="请输入维修时间    min"
              ></el-input>
              <div class="tipTime">提示：根据工单大数据分析，建议该类工单用时调整为120分钟。</div>
            </el-form-item>
            <el-form-item prop="inputLimiTime">
              <div class="demonstration">限定时间</div>
              <el-input
                onkeyup="value=value.replace(/[^\d]/g,'')"
                v-model="addOrEditForm.inputLimiTime"
                placeholder="请输入限定时间    min"
              ></el-input>
              <div class="tipTime">提示：根据工单大数据分析，建议该类工单用时调整为120分钟。</div>
            </el-form-item>
          </div>
          <div class="fixPre">
            <el-form-item prop="fixPre" class="fixPreTextArea">
              <div class="demonstration">维修预案</div>
              <el-input
                type="textarea"
                :disabled="isAdd === 2"
                class="resizeNone"
                v-model="addOrEditForm.fixPre"
                maxlength="200"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer-mes">
        <el-button class="cancleDialog" @click="cancleForm">取 消</el-button>
        <el-button class="confimDialog" type="primary" @click="confirmForm">确 定</el-button>
      </span>
    </el-dialog>
    <DeleteModal
      :data="rowData"
      :display-key="delDisplayKey"
      :visible="visibleDel"
      @reset="resetDelModal"
      @submit="deleteSubmit"
    ></DeleteModal>
    <div v-if="isMessageAuto === 2" class="auto-message order-content scrollbar scrollbar-y scrollbar-light">
      <div class="topheader">
        <span class="auto"> 自动生成配置 </span>
        <el-button class="cancleDialog" @click="isMessageAuto = 1">返回</el-button>
      </div>
      <div class="tab-el">
        <Tab :tabArr="tabArr" @handleSelect="handleSelect" :navIndex="navIndex"></Tab>
      </div>
      <div class="tree-box">
        <Collapse @backCancle="backCancle" @isMessageAuto="succBack" :initId="initId"></Collapse>
      </div>
    </div>
  </div>
</template>

<script>
import APagination from '@/components/pagination/APagination';
import DeleteModal from '@/components/modal/DelModal.vue';
// import PeopleSelect from '@/components/peopleselect/peopleselect';
import Collapse from './collapse/collapse.vue';
import Tab from './tab/tab.vue';
// import TransferTree from '@/components/transferTree/transferTree';
// import { clone } from '@/utils/utils';

import {
  orderRuleList,
  getCategoryQuery,
  deviceFaultType,
  orderRuleListAdd,
  orderRuleListdel,
  orderRuleListupdate,
  queryByType,
  messageConfConfig,
  messageConfQuery,
  queryByCategoryId
} from '@/api/order';
import { generateUrlParams } from '@/utils';
export default {
  name: 'opa-project',
  components: {
    APagination,
    // PeopleSelect,
    Collapse,
    Tab,
    DeleteModal
  },
  watch: {
    isAdd(val) {
      console.log(val);
      if (val === 1) {
        this.$refs.addoredit.resetFields();
      }
    }
  },
  computed: {},
  data() {
    return {
      categoryList: [],
      addOrEdit: '',
      tabArr: [],
      navIndex: 0,
      isMessageAuto: 1,
      name: '工单列表',
      queryType: 'userLog',
      dialogVisible: false,
      messDialogVisible: false,
      editDialogRule: false,
      placeholder: '请输入姓名',
      addOrEditForm: {
        deviceCategoryId: '',
        deviceCategoryName: '',
        errortype: [],
        valueEquip: '',
        equipTypeModal: '',
        level: [],
        inputFixTime: '',
        inputLimiTime: '',
        fixPre: '',
        deviceTypeId: '',
        deviceTypeName: ''
      },
      formData: {
        errorMes: '',
        orderMes: ''
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

      defaultCheckedKeys: [], // 左侧默认选中数据
      title: ['未选择', '已选择'],
      value: [],
      valueSelect: '',
      optionSelect: [],
      optionsequip: [],
      errortypeSelect: [],
      equipSortvalue: '',
      equipSort: [],
      equipTypevalue: '',
      equipType: [],
      equipErrorvalue: '',
      equipError: [],
      levelSelect: [
        {
          value: 'COMMON',
          label: '普通'
        },
        {
          value: 'URGENT',
          label: '紧急'
        },
        {
          value: 'UNUSUALLY_URGENT',
          label: '特级'
        }
      ],
      visibleDel: false,
      rowData: {},
      delDisplayKey: '',
      deleteSubmit: () => {}, // Function
      isAdd: 1, // 1添加 2编辑
      errorMes: [],
      orderMes: [],
      setted: [],
      initId: ''
    };
  },

  methods: {
    succBack(val) {
      this.isMessageAuto = val;
    },
    // 设备类别
    deviceCategory(val) {
      getCategoryQuery({
        type: 'DEVICE'
      }).then(res => {
        if (res.code === 200) {
          //   this.categoryList = res.object;
          this.equipSort = res.object.map(item => ({
            label: item.name,
            value: item.id
          }));
          this.tabArr = res.object.map(item => ({
            text: item.name,
            id: item.id
          }));
          this.initId = this.tabArr[0];
        }
      });
    },
    // 设备类型
    getQueryById(node, resolve) {
      if (node) {
        getCategoryQuery({
          type: 'DEVICE',
          parentId: node
        }).then(res => {
          if (res.code === 200) {
            this.equipType = res.object.map(item => ({
              label: item.name,
              value: item.id
            }));
          }
        });
      }
    },
    // 故障类型
    filterDeviceFaultType(id) {
      if (this.editDialogRule) {
        deviceFaultType({
          deviceTypeId: id
        }).then(res => {
          if (res.code === 200) {
            this.errortypeSelect = res.object.map(item => ({
              value: item.id,
              label: item.name
            }));
          }
        });
      } else {
        queryByCategoryId({
          categoryId: id
        }).then(res => {
          if (res.code === 200) {
            this.equipError = res.object.map(item => ({
              value: item.id,
              label: item.name
            }));
          }
        });
      }
    },

    equipChangeType(val) {
      // 设备类别切换显示类型
      console.log(val);
      this.getQueryById(val.value);
      this.filterDeviceFaultType(val.value);
    },
    equipChangeTypeHeader(val) {
      // 设备类别切换显示类型
      this.equipErrorvalue = '';
      // this.deviceCategory();
      this.getQueryById(val.value);
      this.filterDeviceFaultType(val.value);
    },
    equipChangeErrorHeader(val) {
      this.equipErrorvalue = '';
      this.filterDeviceFaultType(val.value);
    },

    equipChangeError(val) {
      this.filterDeviceFaultType(val.value);
    },

    addRule() {
      // 添加工单规则
      this.addOrEdit = '添加工单规则';
      this.editDialogRule = true;
      this.isAdd = 1;
      this.$nextTick(() => {
        this.$refs.addoredit.resetFields();
      });
      this.deviceCategory();
      if (this.isAdd === 1) {
        // this.addOrEditForm.deviceCategoryId = '';
        // this.addOrEditForm.deviceCategoryName= '';
        // this.addOrEditForm.errortype= [];
        // this.addOrEditForm.valueEquip= '';
        // this.addOrEditForm.equipTypeModal= '';
        // this.addOrEditForm.level= [];
        // this.addOrEditForm.inputFixTime= '';
        // this.addOrEditForm.inputLimiTime= '';
        this.addOrEditForm.fixPre = '';
        // this.addOrEditForm.deviceTypeId= '';
        // this.addOrEditForm.deviceTypeName= '';
      }
      console.log(this.addOrEditForm);
    },
    cancleForm() {
      this.editDialogRule = false;
      // this.equipSort = [];
      // this.equipType = [];
      this.$nextTick(() => {
        this.$refs.addoredit.resetFields();
      });
    },
    closeDialog() {
      // this.equipSort = [];
      // this.equipType = [];
      this.$nextTick(() => {
        this.$refs.addoredit.resetFields();
      });
    },
    confirmForm() {
      // 添加按钮 添加工单规则
      var params = {
        deviceCategoryId: '',
        deviceCategoryName: '',
        deviceTypeId: '',
        deviceTypeName: '',
        faultTypeId: '',
        faultTypeName: '',
        priorityLevel: '',
        repairTime: '',
        limitTime: '',
        repairPlan: ''
      };

      params.deviceCategoryId = this.addOrEditForm.valueEquip.value;
      params.deviceCategoryName = this.addOrEditForm.valueEquip.label;
      params.deviceTypeId = this.addOrEditForm.equipTypeModal.value;
      params.deviceTypeName = this.addOrEditForm.equipTypeModal.label;
      params.faultTypeId = this.addOrEditForm.errortype.value;
      params.faultTypeName = this.addOrEditForm.errortype.label;
      params.priorityLevel = this.addOrEditForm.level.value;
      params.repairTime = this.addOrEditForm.inputFixTime;
      params.limitTime = this.addOrEditForm.inputLimiTime;
      params.repairPlan = this.addOrEditForm.fixPre;
      console.log(this.addOrEditForm);
      if (this.addOrEditForm.valueEquip === '') {
        return this.$message.error('请选择设备类别');
      }
      if (this.addOrEditForm.equipTypeModal === '') {
        return this.$message.error('请选择设备类型');
      }
      if (this.addOrEditForm.errortype === '') {
        return this.$message.error('请选择故障类型');
      }
      if (this.addOrEditForm.level === '') {
        return this.$message.error('请选择优先级');
      }
      if (params.repairTime === '') {
        return this.$message.error('请输入维修时间');
      }
      if (params.limitTime === '') {
        return this.$message.error('请输入限定时间');
      }
      // if(params.deviceCategoryName)
      if (this.isAdd === 1) {
        orderRuleListAdd(params)
          .then(res => {
            const { code, message } = res;
            if (code === 200) {
              this.$message.success(message || '添加成功');
            } else {
              this.$message.error(message || '添加失败');
            }
          })
          .finally(() => {
            this.editDialogRule = false;
            this.getList();
            this.$nextTick(() => {
              this.$refs.addoredit.resetFields();
            });
          });
      }
      if (this.isAdd === 2) {
        params.id = this.addOrEditForm.id;
        orderRuleListupdate(params)
          .then(res => {
            const { code, message } = res;
            if (code === 200) {
              this.$message.success(message || '编辑成功');
            } else {
              this.$message.error(message || '编辑失败');
            }
          })
          .finally(() => {
            this.editDialogRule = false;
            this.getList();
            this.$nextTick(() => {
              this.$refs.addoredit.resetFields();
            });
          });
      }
    },
    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    handleDel(index, row) {
      this.rowData = row;
      this.delDisplayKey = 'username';
      this.visibleDel = true;
      this.deleteSubmit = this.delItem;
    },
    delItem() {
      orderRuleListdel(this.rowData.id)
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
          this.getList();
        });
    },
    handleAbandoned(index, row) {
      let state;
      this.addOrEdit = '编辑工单规则';
      this.isAdd = 2;
      console.log(this.addOrEditForm);
      this.addOrEditForm.valueEquip = {
        value: row.deviceCategoryId,
        label: row.deviceCategoryName
      };
      this.addOrEditForm.fixPre = row.repairPlan;
      this.addOrEditForm.inputFixTime = row.repairTime;
      this.addOrEditForm.inputLimiTime = row.limitTime;

      if (row.priorityLevel === 'URGENT') {
        state = '紧急';
      } else if (row.priorityLevel === 'COMMON') {
        state = '普通';
      } else if (row.priorityLevel === 'UNUSUALLY_URGENT') {
        state = '特急';
      }
      this.addOrEditForm.level = {
        value: row.priorityLevel,
        label: state
      };
      if (row.deviceCategoryId) {
        this.getQueryById(row.deviceCategoryId);
        if (row.deviceTypeId) {
          this.filterDeviceFaultType(row.deviceTypeId);
          this.addOrEditForm.equipTypeModal = {
            value: row.deviceTypeId,
            label: row.deviceTypeName
          };
          console.log(this.errortypeSelect);
          window.sessionStorage.setItem('error-id', row.faultTypeId);
          window.sessionStorage.setItem('error-name', row.faultTypeName);
          this.errortypeSelect.push({
            value: row.faultTypeId,
            label: row.faultTypeName
          });
          this.addOrEditForm.errortype = {
            value: row.faultTypeId,
            label: row.faultTypeName
          };
        }
      }

      // this.$refs.addoredit.resetFields();
      this.addOrEditForm.deviceCategoryId = row.deviceCategoryId;
      this.addOrEditForm.deviceCategoryName = row.deviceCategoryName;
      this.addOrEditForm.id = row.id;
      // 编辑重新赋值点击当前项的数据
      this.editDialogRule = true;
      this.isAdd = 2;
    },
    queryByType(type) {
      // 故障消息模板 EVENT
    },
    messageConfConfig(data) {
      messageConfConfig(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '配置成功');
          } else {
            this.$message.error(message || '配置失败');
          }
        })
        .finally(() => {
          this.messDialogVisible = false;
        });
    },
    mesSetting() {
      this.messDialogVisible = true;

      this.getSelectes().then(this.messageConfQuery);
    },
    getSelectes() {
      const todo = queryByType({
        type: 'TODO',
        enableFlag: true
      });
      const event = queryByType({
        type: 'EVENT',
        enableFlag: true
      });
      return Promise.all([todo, event]).then(results => {
        const todoRes = results[0];
        const eventRes = results[1];
        if (todoRes) {
          const { object, code } = todoRes;
          if (code === 200) {
            this.orderMes = object;
          }
        }
        if (eventRes) {
          const { object, code } = eventRes;
          if (code === 200) {
            this.errorMes = object;
          }
        }
      });
    },
    mesSave() {
      // 消息保存
      console.log(this.formData);
      const params = {
        confList: []
      };
      const err = this.errorMes.find(ii => ii.id === this.formData.errorMes);
      const ordtpl = this.orderMes.find(ii => ii.id === this.formData.orderMes);
      if (this.formData.errorMes.length) {
        params.confList.push({
          msgTemplateId: err.id,
          mntType: 'FAULT_REPORT'
        });
      }
      if (this.formData.orderMes.length) {
        params.confList.push({
          msgTemplateId: ordtpl.id,
          mntType: 'ASSIGN_ORDER'
        });
      }

      this.messageConfConfig(params);
    },
    mesCancle() {
      // 消息取消保存
      this.messDialogVisible = false;
    },
    messageConfQuery() {
      messageConfQuery()
        .then(res => {
          const { code, object } = res;
          if (code === 200) {
            this.setted = object;
            const error = object.find(ii => ii.mntType === 'FAULT_REPORT');
            const event = object.find(ii => ii.mntType === 'ASSIGN_ORDER');
            this.formData.errorMes = error.msgTemplateId;
            this.formData.orderMes = event.msgTemplateId;
          }
        })
        .finally(() => {});
    },
    autoCompelte() {
      this.isMessageAuto = 2;
    },
    backCancle(val) {
      this.isMessageAuto = val;
    },
    handleSelect(index, item) {
      this.navIndex = index;
      console.log(item);
      this.initId = item;
      console.log(this.tabArr);
    },
    TabhandleClick(tab, event) {
      console.log(tab, event);
    },
    handleChange(value) {
      // 级联选择器触发事件
      console.log(value);
    },
    resetPersonModal() {
      this.dialogVisible = false;
    },
    onSelectPerson(node) {},
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatNumber(number) {
      return number < 10 ? '0' + number : number;
    },
    commenSearch() {
      if (this.equipSortvalue.value && this.equipTypevalue.value) {
        // 都存在
        this.getList(this.equipTypevalue.value, this.equipErrorvalue.value ? this.equipErrorvalue.value : '');
      }
      if (!this.equipSortvalue.value && this.equipTypevalue.value) {
        // 类型有 类别无
        this.getList(this.equipTypevalue.value, this.equipErrorvalue.value ? this.equipErrorvalue.value : '');
      }
      if (this.equipSortvalue.value && !this.equipTypevalue.value) {
        // 类别有 类型无
        this.getList(this.equipSortvalue.value, this.equipErrorvalue.value ? this.equipErrorvalue.value : '');
      }
      if (!this.equipSortvalue.value && !this.equipTypevalue.value) {
        // 都不存在
        this.getList();
      }
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.commenSearch();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    getList(deviceTypeId, faultTypeId) {
      const params = {
        current: this.pageCurrent,
        size: this.pageSize
      };
      const data = {
        deviceTypeId: deviceTypeId,
        faultTypeId: faultTypeId
      };
      const query = generateUrlParams('', params);
      orderRuleList(query, data).then(response => {
        const { code, object } = response;
        if (code === 200 && object) {
          this.tableData = object;
        }
      });
    },
    search() {
      this.pageCurrent = 1;
      this.commenSearch();
    },
    reload() {
      this.equipSortvalue = '';
      this.equipTypevalue = '';
      this.equipErrorvalue = '';
      this.getList();
    },
    sort(val) {
      this.$refs.Table.clearSelection();
      this.getList();
    }
  },
  created() {
    this.getList();
    this.deviceCategory();
  },
  mounted() {},
  updated: function() {}
};
</script>

<style lang="scss" scoped>
@import './ticketrule.scss';

// .el-tooltip__popper {
//   border: none !important;
//   width: 148px;
//   height: 50px;
//   background: #ffffff;
//   box-shadow: 0px 0px 20px -3px rgba(16, 25, 74, 0.18);
//   border-radius: 6px;

//   .popper__arrow {
//     // display: none;
//   }
// }

.fixPre {
  width: 100%;

  .fixPreTextArea {
    width: 100% !important;
  }
}

.resizeNone {
  .el-textarea__inner {
    //el_input中的隐藏属性
    resize: none; //主要是这个样式
  }
}

.tipTime {
  height: 40px;
  font-size: 11px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #ff4908;
  padding: 10px;
  background: rgba(255, 73, 8, 0.18);
  line-height: 20px;
  position: relative;
  margin-top: 8px;

  &::after {
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    border-bottom: 4px solid rgba(255, 73, 8, 0.18);
    left: 5px;
    top: -4px;
  }
}

.tip-box {
  p {
    line-height: 24px;
    font-size: 14px;
    width: 100%;
    margin-top: 10px;
    cursor: pointer;

    img {
      margin-top: 5px;
      float: left;
      margin-left: 14px;
      margin-right: 18px;
    }
  }
}

.order-content-account {
  .tableC {
    min-height: 500px !important;

    .iconImgOperater {
      img {
        margin-right: 8px;
        cursor: pointer;
        margin-left: 8px;
      }
    }
  }

  .el-table .cell {
    overflow: visible;
    position: relative;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #eff4ff;
  }

  .el-table__body {
    border-collapse: separate;
    border-spacing: 0 16px;
  }
  .el-table__body-wrapper {
    max-height: calc(100vh - 412px);
    overflow-y: auto !important;
    overflow-x: hidden !important;
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 6px;
      border-radius: 6px;
      outline-offset: -1px;
      border-width: 1px;
      border-style: solid;
      outline-width: 2px;
      outline-style: solid;
    }

    &::-webkit-scrollbar-track-piece {
      -webkit-border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(243, 244, 249, 1);
      outline-color: #fff;
      border-color: #fff;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(217, 217, 217, 0.3);
      background-color: #fff;
    }

    &::-webkit-scrollbar-track-piece {
      background-color: #fff;
    }
  }

  .el-table__row:nth-of-type(2n) {
    background: #f6f8fc;
  }

  .show {
    display: block;
  }

  .hide {
    display: none;
  }

  .row-wrapper {
    width: 160px;

    .row-text,
    .row-message {
      display: inline-block;
    }

    .row-text {
      width: 126px;
      height: 21px;
      overflow: hidden;
      font-size: 14px;
      font-family: 'SourceHanSansCN-Normal, SourceHanSansCN';
      font-weight: 400;
      color: rgba(15, 23, 54, 1);
      line-height: 21px;
    }

    .row-message {
      width: 16px;
      height: 21px;
      background: url(../../../../assets/log/row-message.png) center no-repeat;
      cursor: pointer;
    }

    .order-row-inner {
      display: none;
      position: absolute;
      z-index: 1;
      top: -17px;
      left: 180px;
      width: 360px;
      height: 258px;
      background: $--bg-light;
      box-shadow: 0 0 20px -3px rgba(16, 25, 74, 0.18);
      border-radius: 6px;

      .order-row-header {
        padding: 20px 30px;
      }

      .order-row-header-title {
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: rgba(15, 23, 54, 1);
        line-height: 21px;
        display: inline-block;
        margin-left: 14px;
      }

      .order-row-text {
      }

      .order-row-content {
        padding: 30px 6px 30px 30px;
      }

      .order-con {
        padding-right: 24px;
        height: 141px;
        white-space: normal;

        &::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
      }
    }
  }

  .el-table,
  .el-table__body-wrapper {
    overflow: visible;
  }

  .td:last-of-type .cell {
    overflow: hidden;
  }

  .add {
    height: 42px;
    background: #3045b1;
    border-radius: 24px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-right: 10px;
  }
}

.auto-message {
  //自动生成配置
  .tab-el {
    height: 100px;
    padding: 0 20px;
    border-bottom: 1px solid #e5e9f3;

    .el-tabs__header {
      border-bottom: 1px solid #e5e9f3;
    }

    .el-tabs__nav {
      height: 80px;
      line-height: 95px;
      width: 100%;
    }

    .el-tabs__nav-wrap {
      margin-left: 30px;
    }

    .el-tabs__nav-wrap::after {
      background: #fff;
      height: 0;
    }

    .el-tabs__active-bar {
      height: 3px;
    }

    .el-tabs__item {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #0f1736;
    }
  }

  .topheader {
    padding-top: 30px;
    padding-left: 30px;
    .cancleDialog {
      width: 100px;
      height: 42px;
      border-radius: 24px;
      margin-right: 20px !important;
      float: right;
      border: 1px solid #3045b1;
      color: #3045b1;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      span {
        width: 34px;
        height: 16px;
        font-size: 16px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #b4b9cf;
        letter-spacing: 1px;
      }
    }
    .auto {
      background: #ffffff;
      font-size: 20px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
      border: none;
      span {
        display: inline-block;
      }
    }
  }
}

.dialog-rule {
  .el-dialog__body {
    padding: 40px 20px;

    .order-user-form {
      margin-left: 15px;

      .el-form-item {
        width: 220px;
        margin-right: 12px;
        margin-bottom: 20px;
      }
    }
  }
}

.dialog-footer-mes {
  .cancleDialog {
    width: 100px;
    height: 42px;
    border-radius: 24px;
    border: 1px solid #b4b9cf;
    margin-right: 20px !important;

    span {
      width: 34px;
      height: 16px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #b4b9cf;
      letter-spacing: 1px;
    }
  }

  .confimDialog {
    width: 100px;
    height: 42px;
    background: #3045b1;
    border-radius: 24px;

    span {
      width: 34px;
      height: 16px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #ffffff;
      letter-spacing: 1px;
    }
  }
}
</style>

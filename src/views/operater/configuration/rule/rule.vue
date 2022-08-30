<template>
  <div class="order-wrapper common-page-wrapper">
    <div class="order-content-account order-content">
      <div class="pr-30 pl-30 pt-30 border-b">
        <el-form ref="form" :model="formData" class="order-user-form" @submit.native.prevent>
          <el-form-item prop="equipTypeOrContent">
            <el-input
              clearable
              @clear="clearInput"
              v-model="formData.equipTypeOrContent"
              autocomplete="off"
              placeholder="请输入设备类型或内容"
            ></el-input>
          </el-form-item>
          <el-form-item style="position: relative">
            <el-button type="primary" class="search-button text-center" @click="search"></el-button>
            <el-button type="primary" class="reload-button text-center" @click="reload"></el-button>
          </el-form-item>

          <el-button type="primary" class="text-center add" @click="addRuleReprot">添加</el-button>
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
          <el-table-column show-overflow-tooltip label="巡检内容" prop="inspectContent"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="操作">
            <template slot-scope="scope">
              <!-- <el-tooltip> -->
              <p type="danger">
                <img
                  class="edit-img"
                  style="cursor: pointer"
                  @click="handleAbandonedEdit(scope.$index, scope.row)"
                  src="../../../../assets/button/edit-active.png"
                />
                <img
                  class="del-img"
                  style="cursor: pointer"
                  @click="handleAbandoned(scope.$index, scope.row)"
                  src="../../../../assets/button/del-active.png"
                />
              </p>
              <!-- </el-tooltip> -->
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

      <el-dialog
        :close-on-click-modal="false"
        title="巡检规则"
        class="dialog-rule"
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        width="620px"
      >
        <template slot="title">
          <div class="demonstration">
            <span>{{ isAddrule }}巡检规则</span>
          </div>
        </template>
        <el-form ref="reportForm" :model="reprotRule" class="report-rule" @submit.native.prevent>
          <el-form-item prop="typeEquip">
            <div class="demonstration">设备类别</div>
            <el-select v-model="reprotRule.typeEquip" @change="equipChangeType" placeholder="请选择设备类别">
              <el-option v-for="item in equipSort" :key="item.value" :label="item.label" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="equipTypeModal">
            <div class="demonstration">设备类型</div>
            <el-select v-model="reprotRule.sortTypeModal" @change="equipChangeError" placeholder="请选择设备类型">
              <el-option v-for="item in equipType" :key="item.value" :label="item.label" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ruleDescribe">
            <div class="check-con demonstration">巡检规则内容</div>
            <el-input
              type="textarea"
              placeholder="请输入巡检规则描述"
              class="resizeNone"
              v-model="reprotRule.ruleDescribe"
              maxlength="500"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer-mes">
          <el-button class="cancleDialog" @click="ruleCancle">取 消</el-button>
          <el-button class="confimDialog" type="primary" @click="ruleSave">确 定</el-button>
        </span>
      </el-dialog>
      <DeleteModal
        :data="rowData"
        :display-key="delDisplayKey"
        :visible="visibleDel"
        @reset="resetDelModal"
        @submit="deleteSubmit"
      ></DeleteModal>
    </div>
  </div>
</template>

<script>
import APagination from '@/components/pagination/APagination';
import DeleteModal from '@/components/modal/DelModal.vue';
// import TransferTree from '@/components/transferTree/transferTree';
// <TransferTree :placeholder="placeholder" :title="title" :initfromData="initfromData" :toData="toData" :defaultCheckedKeys="defaultCheckedKeys"></TransferTree>
// import { clone } from '@/utils/utils';
import { generateUrlParams } from '@/utils';
import { inspectRuleList, getCategoryQuery, inspectRuleAdd, inspectRuleupdate, inspectRuledel } from '@/api/order';
export default {
  name: 'opa-project',
  components: {
    APagination,
    DeleteModal
    // TransferTree
  },
  watch: {},
  computed: {},
  data() {
    return {
      isAddrule: '',
      equipSort: [],
      equipType: [],
      reprotRule: {
        typeEquip: '',
        typeEquipId: '',
        sortTypeModal: '',
        sortTypeModalId: '',
        ruleDescribe: '',
        RuleId: ''
      },
      delDisplayKey: '',
      rowData: {},
      name: '工单列表',
      dialogVisible: false,
      placeholder: '请输入姓名',
      formData: {
        equipTypeOrContent: ''
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
      visibleDel: false,
      deleteSubmit: () => {} // Function
    };
  },
  methods: {
    addRuleReprot() {
      // this.$refs.reportForm.resetFields();
      this.reprotRule.typeEquip = '';
      this.reprotRule.sortTypeModal = '';
      this.reprotRule.ruleDescribe = '';
      this.reprotRule.typeEquip = '';
      this.dialogVisible = true;
      this.isAddrule = '新增';
    },
    deviceCategory(val) {
      // 设备类别
      getCategoryQuery({
        type: 'DEVICE'
      }).then(res => {
        if (res.code == 200) {
          //   this.categoryList = res.object;
          this.equipSort = res.object.map(item => ({
            label: item.name,
            value: item.id
          }));
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
          if (res.code == 200) {
            this.equipType = res.object.map(item => ({
              label: item.name,
              value: item.id
            }));
          }
        });
      }
    },
    equipChangeType(val) {
      console.log(val);
      this.reprotRule.typeEquip = val.label;
      this.reprotRule.typeEquipId = val.value;
      this.getQueryById(val.value);
    },
    equipChangeError(val) {
      this.valueType = [];
      this.reprotRule.sortTypeModal = val.label;
      this.reprotRule.sortTypeModalId = val.value;
    },
    ruleCancle() {
      this.dialogVisible = false;
    },
    ruleSave() {
      this.dialogVisible = false;
      if (this.isAddrule === '新增') {
        this.addItem();
      } else {
        this.editItem();
      }
    },
    resetPersonModal() {
      this.dialogVisible = false;
    },
    onSelectPerson(node) {
      if (node == 'succsess') {
        this.getList();
      }
    },
    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    handleAbandoned(index, row) {
      this.rowData = row;
      this.visibleDel = true;
      this.deleteSubmit = this.delItem;
    },
    handleAbandonedEdit(index, row) {
      this.rowData = row;
      this.dialogVisible = true;
      this.isAddrule = '编辑';
      if (row.deviceCategoryId) {
        this.getQueryById(row.deviceCategoryId);
        this.reprotRule.sortTypeModal = {
          value: row.deviceTypeId,
          label: row.deviceTypeName
        };
      }
      this.reprotRule.typeEquip = {
        value: row.deviceCategoryId,
        label: row.deviceCategoryName
      };
      this.reprotRule.ruleDescribe = row.inspectContent;
      this.reprotRule.RuleId = row.id;
    },
    editItem() {
      debugger;
      var params = {
        deviceCategoryId: '',
        deviceCategoryName: '',
        deviceTypeId: '',
        deviceTypeName: '',
        inspectContent: '',
        id: ''
      };

      params.deviceCategoryId = this.reprotRule.typeEquip.value;
      params.deviceCategoryName = this.reprotRule.typeEquip.label;
      params.deviceTypeId = this.reprotRule.sortTypeModal.value;
      params.deviceTypeName = this.reprotRule.sortTypeModal.label;
      params.inspectContent = this.reprotRule.ruleDescribe;
      params.id = this.reprotRule.RuleId;
      inspectRuleupdate(params).then(res => {
        const { code, message } = res;
        if (code === 200) {
          this.$message.success(message || '编辑成功');
          this.getList();
        } else {
          this.$message.error(message || '编辑失败');
        }
      });
    },
    addItem() {
      var params = {
        deviceCategoryId: '',
        deviceCategoryName: '',
        deviceTypeId: '',
        deviceTypeName: '',
        inspectContent: ''
      };
      params.deviceCategoryId = this.reprotRule.typeEquipId;
      params.deviceCategoryName = this.reprotRule.typeEquip;
      params.deviceTypeId = this.reprotRule.sortTypeModalId;
      params.deviceTypeName = this.reprotRule.sortTypeModal;
      params.inspectContent = this.reprotRule.ruleDescribe;
      if (!params.deviceCategoryName) {
        return this.$message.error('请选择设备类别');
      }
      if (!params.deviceTypeName) {
        return this.$message.error('请选择设备类型');
      }
      if (params.inspectContent.length > 500) {
        return this.$message.error('巡检规则内容描述不能超过500字符');
      }
      inspectRuleAdd(params).then(res => {
        const { code, message } = res;
        if (code === 200) {
          this.$message.success(message || '添加成功');
          this.getList();
        } else {
          this.$message.error(message || '添加失败');
        }
      });
    },
    delItem() {
      // 巡检规则删除
      inspectRuledel(this.rowData.id)
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
    handleCurrentChange(val) {
      this.pageCurrent = val;
      const name = this.formData.equipTypeOrContent;
      this.getList(name);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    getList(name) {
      const params = {
        current: this.pageCurrent,
        size: this.pageSize
      };
      const data = {
        keyword: name
      };
      const query = generateUrlParams('', params);
      inspectRuleList(query, data).then(res => {
        const { code, object } = res;
        if (code === 200 && object) {
          this.tableData = object;
        }
      });
    },
    search() {
      this.pageCurrent = 1;
      const name = this.formData.equipTypeOrContent;
      this.getList(name);
    },
    clearInput() {
      this.pageCurrent = 1;
      this.getList();
    },
    // valueChange() {
    //   const name = this.formData.equipTypeOrContent;
    //   this.getList(name);
    // },
    reload() {
      this.$refs.form.resetFields();
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

<style lang="scss">
@import './rule.scss';
.manger {
  display: inline-block;
  img {
    float: right;
    margin-left: 5px;
    margin-top: 3px;
    width: 16px;
    height: 16px;
  }
}
// .el-tooltip__popper {
//   border: none !important;
//   width: 148px;
//   height: 50px;
//   background: #ffffff;
//   box-shadow: 0px 0px 20px -3px rgba(16, 25, 74, 0.18);
//   border-radius: 6px;

//   .popper__arrow {
//     display: none;
//   }
// }
.dialog-rule {
  .el-dialog__body {
    padding: 30px 26px 10px 26px;
    .el-form-item {
      margin-bottom: 10px;
      .demonstration {
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #747aa5;
      }
    }
  }
  .check-con {
    width: 560px;
  }
}
.resizeNone {
  .el-textarea__inner {
    height: 240px !important;
    resize: none;
    outline-style: none;
  }
}
.el-popper {
  .el-icon-arrow-right {
    display: none;
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
    .edit-img {
      margin-right: 10px;
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
      color: $--color-dark;
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
        color: $--color-dark;
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

<template>
  <div class="order-wrapper common-page-wrapper">
    <div class="order-content-account order-content">
      <div class="pr-30 pl-30 pt-30  border-b">
        <el-form ref="form" :model="formData" class="order-user-form" @submit.native.prevent>
          <el-form-item prop="username">
            <el-input
              clearable
              @clear="clearInput"
              v-model="formData.username"
              autocomplete="off"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item style="position: relative">
            <el-button type="primary" class="search-button text-center" @click="search"></el-button>
            <el-button type="primary" class="reload-button text-center" @click="reload"></el-button>
          </el-form-item>

          <el-button type="primary" class="text-center add" @click="dialogVisible = true">添加</el-button>
        </el-form>
      </div>
      <div class="horizontal-line" style="margin-bottom: 30px;"></div>

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
          <el-table-column show-overflow-tooltip label="姓名" prop="name"></el-table-column>
          <!--prop为字段名称 -->
          <el-table-column show-overflow-tooltip label="联系电话" prop="phone"></el-table-column>
          <el-table-column show-overflow-tooltip label="职能">
            <template slot-scope="scope">
              <span v-if="scope.row.duty == 'MEMBER'">成员</span>
              <span class="manger" v-if="scope.row.duty == 'MANAGER'">
                负责人
                <img src="../../../../assets/button/star-green.png" alt="" />
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="操作">
            <template slot-scope="scope">
              <!-- <el-tooltip> -->
              <p type="danger">
                <img
                  style="cursor: pointer;"
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
      <PeopleSelect
        v-if="dialogVisible"
        :visible="dialogVisible"
        @selected="onSelectPerson"
        @reset="resetPersonModal"
      ></PeopleSelect>
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
import PeopleSelect from '@/components/operaterAdd/member';
import DeleteModal from '@/components/modal/DelModal.vue';
// import TransferTree from '@/components/transferTree/transferTree';
// <TransferTree :placeholder="placeholder" :title="title" :initfromData="initfromData" :toData="toData" :defaultCheckedKeys="defaultCheckedKeys"></TransferTree>
// import { clone } from '@/utils/utils';
import { generateUrlParams } from '@/utils';
import { inspectStaffList, inspectStaffdel } from '@/api/order';
export default {
  name: 'opa-project',
  components: {
    APagination,
    PeopleSelect,
    DeleteModal
    // TransferTree
  },
  watch: {},
  computed: {},
  data() {
    return {
      delDisplayKey: '',
      rowData: {},
      name: '工单列表',
      dialogVisible: false,
      placeholder: '请输入姓名',
      formData: {
        username: ''
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
    delItem() {
      // 巡检人员删除
      inspectStaffdel(this.rowData.id)
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
      const name = this.formData.username;
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
        name: name
      };
      const query = generateUrlParams('', params);
      inspectStaffList(query, data).then(res => {
        const { code, object } = res;
        if (code === 200 && object) {
          this.tableData = object;
        }
      });
    },
    search() {
      this.pageCurrent = 1;
      const name = this.formData.username;
      this.getList(name);
    },
    clearInput() {
      this.pageCurrent = 1;
      this.getList();
    },
    // valueChange() {
    //   const name = this.formData.username;
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
  },
  mounted() {},
  updated: function() {}
};
</script>

<style lang="scss">
@import './inspect.scss';
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
</style>

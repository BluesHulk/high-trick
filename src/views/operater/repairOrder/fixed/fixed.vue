<template>
  <div class="order-wrapper common-page-wrapper">
    <div v-if="typeInfoFix == 1" class="order-content-account order-content">
      <div class="pr-30 pl-30 pt-30 border-b form-head">
        <el-form ref="form" :model="formData" class="order-user-form" @submit.native.prevent>
          <el-form-item label="" prop="orderStatus">
            <el-select
              @clear="clearInputorderStatus"
              clearable
              v-model="formData.orderStatus"
              @change="waitFaultState"
              placeholder="请选择故障状态"
            >
              <el-option :key="item.name" v-for="item in actionOb" :label="item.desc" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="selecTime">
            <el-date-picker
              @change="clearInputselecTime"
              clearable
              v-model="formData.selecTime"
              type="datetime"
              placeholder="请选择上报时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="orderCode">
            <el-input
              clearable
              @clear="clearInputorderCode"
              v-model="formData.orderCode"
              autocomplete="off"
              placeholder="请输入设备编号/名称"
            ></el-input>
          </el-form-item>
          <el-form-item style="position: relative">
            <el-button type="primary" class="search-button text-center" @click="search"></el-button>
            <el-button type="primary" class="reload-button text-center" @click="reload"></el-button>
          </el-form-item>
        </el-form>
        <Tab :tabArr="tabArr" @handleSelect="handleSelect" :navIndex="navIndex"></Tab>
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
          <!--prop为字段名称 -->
          <el-table-column show-overflow-tooltip width="300" label="工单编号" prop="orderCode">
            <template slot-scope="scope">
              <span v-if="scope.row.orderCode">{{ scope.row.orderCode }}</span>
              <span v-else>——</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="200" label="设备名称" prop="deviceName"></el-table-column>

          <el-table-column show-overflow-tooltip width="200" label="故障来源">
            <template slot-scope="scope">
              <span v-if="scope.row.faultSource == 'SYSTEM'">系统生成</span>
              <span v-if="scope.row.faultSource == 'INSPECTION'">巡检生成</span>
              <span v-if="scope.row.faultSource == 'OTHER'">其他</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="200" label="故障类型" prop="faultTypeName"></el-table-column>
          <el-table-column show-overflow-tooltip width="200" label="上报时间">
            <template slot-scope="scope">
              <span>{{ scope.row.reportTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="200" label="故障状态">
            <template slot-scope="scope">
              <span v-if="scope.row.orderId">已生成工单</span>
              <span v-else>等待生成工单</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <p type="primary" class="fliterImg">
                <img src="../../../../assets/button/eyes.png" @click="handleView(scope.$index, scope.row)" />
                <img
                  src="../../../../assets/button/fix.png"
                  v-if="!scope.row.orderId && scope.row.filtered == false"
                  @click="orderGenerate(scope.$index, scope.row)"
                />
                <img src="../../../../assets/button/fix-grey.png" class="fil-grey" v-else />
                <span
                  @click="handleViewFilter(scope.$index, scope.row)"
                  v-if="scope.row.filtered == false"
                  class="filter-data"
                >
                  过滤
                </span>
                <span v-else class="has-filter-data">已过滤</span>
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
    <div v-if="typeInfoFix == 1" @click="reportFix" class="fix-report">
      <img src="../../../../assets/button/report-orange.png" alt="" />
      <span>上报故障</span>
    </div>
    <Report :typeInfoFix="typeInfoFix" :fixsort="fixsort"></Report>
    <FixDetail :typeInfoFix="typeInfoFix" :fixsort="fixsort"></FixDetail>
  </div>
</template>

<script>
import APagination from '@/components/pagination/APagination';
import Report from './report/report';
import Tab from './tab/tab';
import FixDetail from './detail/detail';
import { orderFaultList, /* commonGetEnum, */ generateOrder, faultFilter } from '@/api/order';
import { generateUrlParams } from '@/utils';
import moment from 'moment'; // 时间
export default {
  name: 'opa-project',
  components: {
    // Maincontent,
    APagination,
    Tab,
    Report,
    FixDetail
  },
  watch: {
    $route(to, from) {
      if (to.query.type == 1) {
        this.typeInfoFix = '2';
      } else if (to.query.type == 2) {
        this.typeInfoFix = '3';
      } else {
        this.typeInfoFix = '1';
        this.getList('', '', false);
      }
    }
  },
  computed: {},
  data() {
    return {
      typeInfoFix: '1',
      fixsort: '1',
      name: '故障列表',
      tabArr: [
        { text: '显示全部', id: '1' },
        { text: '显示过滤', id: '2' }
      ],
      actionOb: [
        { name: true, desc: '已生成工单' },
        { name: false, desc: '等待生成工单' }
      ],
      formData: {
        selecTime: '',
        orderStatus: '',
        orderCode: ''
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
      navIndex: 0,
      orderFaultstate: '',
      isFilted: false
    };
  },
  methods: {
    orderGenerate(index, row) {
      // 生成工单
      this.$$ALoading.show();
      generateOrder(row.id).then(res => {
        const { code, message } = res;
        if (code === 200) {
          this.$message.success(message || '工单生成成功');
          this.getList('', '', false);
          this.$$ALoading.close();
        } else {
          this.$message.error(message || '工单生成失败');
          this.$$ALoading.close();
        }
      });
    },
    reload() {
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
      this.formData.selecTime = '';
      this.getList('', '', false, '');
    },
    waitFaultState(val) {
      this.orderFaultstate = val;
    },
    handleViewFilter(index, row) {
      // 过滤
      this.$$ALoading.show();
      faultFilter(row.id).then(res => {
        const { code, message } = res;
        if (code === 200) {
          this.$message.success(message || '过滤成功');
          this.$$ALoading.close();
          this.getList('', '', false);
        } else {
          this.$message.error(message || '过滤失败');
          this.$$ALoading.close();
        }
      });
    },
    handleSelect(index) {
      this.navIndex = index;
      this.$$ALoading.show();
      if (index == 0) {
        this.isFilted = false;
        this.getList('', '', false);
      } else {
        this.isFilted = true;
        this.getList('', '', true);
      }
    },
    handleDistributed(index, row) {
      console.log(index, row);
    },
    handleView(index, row) {
      this.$router.push({
        path: 'fixed',
        query: {
          type: '2',
          sort: '1',
          id: row.id
        }
      });

      console.log(row);
    },
    reportFix() {
      this.$router.push({
        path: 'fixed',
        query: {
          type: '1',
          sort: '1'
        }
      });
    },
    handleAbandoned(index, row) {
      console.log(index, row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    formatNumber(number) {
      return number < 10 ? '0' + number : number;
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      const { orderCode, selecTime } = this.formData;
      if (selecTime) {
        const time = moment(selecTime).format('YYYY-MM-DD');
        this.getList(orderCode, time, this.isFilted);
      } else {
        this.getList(orderCode, '', this.isFilted);
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      const { orderCode, selecTime } = this.formData;
      if (selecTime) {
        const time = moment(selecTime).format('YYYY-MM-DD');
        this.getList(orderCode, time, this.isFilted);
      } else {
        this.getList(orderCode, '', this.isFilted);
      }
    },
    getList(deviceCode, reportTime, filtered, generatedOrder) {
      const params = {
        current: this.pageCurrent,
        size: this.pageSize
      };
      const data = {
        deviceCode: deviceCode,
        reportTime: reportTime,
        filtered: filtered,
        generatedOrder: generatedOrder
      };
      const query = generateUrlParams('', params);
      orderFaultList(query, data).then(res => {
        const { code, object } = res;
        if (code === 200 && object) {
          this.tableData = object;
          this.$$ALoading.close();
        }
      });
    },
    search() {
      this.pageCurrent = 1;
      const { orderCode, selecTime } = this.formData;
      if (selecTime) {
        const time = moment(selecTime).format('YYYY-MM-DD');
        this.getList(orderCode, time, this.isFilted, this.orderFaultstate);
      } else {
        this.getList(orderCode, '', this.isFilted, this.orderFaultstate);
      }
    },
    clearInputorderStatus() {
      const { orderCode, selecTime } = this.formData;
      if (selecTime) {
        const time = moment(selecTime).format('YYYY-MM-DD');
        this.getList(orderCode, time, this.isFilted, this.orderFaultstate);
      } else {
        this.getList(orderCode, '', this.isFilted, this.orderFaultstate);
      }
    },
    clearInputselecTime() {
      debugger;
      const { orderCode, selecTime } = this.formData;
      if (selecTime) {
        const time = moment(selecTime).format('YYYY-MM-DD');
        this.getList(orderCode, time, this.isFilted, this.orderFaultstate);
      } else {
        this.getList(orderCode, '', this.isFilted, this.orderFaultstate);
      }
    },
    clearInputorderCode() {
      const { orderCode, selecTime } = this.formData;
      if (selecTime) {
        const time = moment(selecTime).format('YYYY-MM-DD');
        this.getList(orderCode, time, this.isFilted, this.orderFaultstate);
      } else {
        this.getList(orderCode, '', this.isFilted, this.orderFaultstate);
      }
    },
    sort(val) {
      this.$refs.Table.clearSelection();
      this.getList();
    }
    // getSelects() {
    //     const state = commonGetEnum({enumName:"OrderStatusType"});

    //     return Promise.all([state]).then(res => {
    //       const sta = res[0];

    //       if (sta) {
    //         const { code, object } = sta;
    //         if (code === 200) {
    //           this.actionOb = object;
    //         }
    //       }
    //     });
    //   },
  },
  created() {
    // this.getSelects().then(this.getList('','',true));
    this.getList('', '', this.isFilted, '');
  },
  mounted() {
    if (this.$route.query.type == 1) {
      this.typeInfoFix = 2;
    } else if (this.$route.query.type == 2) {
      this.typeInfoFix = 3;
    } else {
      this.typeInfoFix = 1;
    }
  },
  updated: function() {}
};
</script>

<style lang="scss">
@import './fixed';
// .el-tooltip__popper {
//   border: none !important;
//   width: 148px;
//   height: 110px;
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
  .form-head {
    position: relative;
  }
  .tableC {
    min-height: 500px !important;
    .fliterImg {
      img {
        margin-right: 10px;
        display: inline-block;
        vertical-align: text-top;
        cursor: pointer;
        &.fil-grey {
          cursor: not-allowed;
        }
      }
      span {
        display: inline-block;
      }
      .filter-data {
        cursor: pointer;
        font-size: 14px;
        font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
        font-weight: 400;
        color: #3045b1;
      }
      .has-filter-data {
        font-size: 14px;
        font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
        font-weight: 400;
        color: rgba(15, 23, 54, 0.4);
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
}

// 工单日志的样式
.box {
  display: flex;
}
</style>

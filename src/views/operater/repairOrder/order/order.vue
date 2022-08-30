<template>
  <div class="order-wrapper common-page-wrapper">
    <div v-if="typeInfo == 1" class="order-content-account order-content">
      <div class="pr-30 pl-30 pt-30 border-b">
        <el-form ref="form" :model="formData" class="order-user-form" @submit.native.prevent>
          <el-form-item label="" prop="orderOrigin">
            <el-select
              clearable
              @clear="clearInputorderOrigin"
              v-model="formData.orderOrigin"
              placeholder="请选择工单来源"
            >
              <el-option :key="item.name" v-for="item in actionOb" :label="item.desc" :value="item.name"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="orderStatus">
            <el-select
              clearable
              @clear="clearInputorderStatus"
              v-model="formData.orderStatus"
              placeholder="请选择工单状态"
            >
              <el-option :key="item.name" v-for="item in statusObj" :label="item.desc" :value="item.name"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="orderLevel">
            <el-select clearable @clear="clearInputorderLevel" v-model="formData.orderLevel" placeholder="请选择优先级">
              <el-option :key="item.name" v-for="item in levelOb" :label="item.desc" :value="item.name"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orderCode">
            <el-input
              clearable
              v-model="formData.orderCode"
              @clear="clearInputorderCode"
              autocomplete="off"
              placeholder="请输入工单编号"
            >
            </el-input>
          </el-form-item>
          <el-form-item style="position: relative">
            <el-button type="primary" class="search-button text-center" @click="search"></el-button>
            <el-button type="primary" class="reload-button text-center" @click="reload"></el-button>
          </el-form-item>
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
          <el-table-column align="center" type="index" width="150" label="序号">
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.$index + 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="100" label="优先级">
            <template slot-scope="scope">
              <span style="color: #0f1736" v-if="scope.row.priorityLevel == 'COMMON'">普通</span>
              <span style="color: #ffad3c" v-if="scope.row.priorityLevel == 'URGENT'">紧急</span>
              <span style="color: #ff4807" v-if="scope.row.priorityLevel == 'UNUSUALLY_URGENT'">特级</span>
            </template>
          </el-table-column>
          <!--prop为字段名称 -->
          <el-table-column show-overflow-tooltip width="260" label="工单编号" prop="orderCode"></el-table-column>
          <el-table-column show-overflow-tooltip width="150" label="工单状态">
            <template slot-scope="scope">
              <span v-if="scope.row.orderStatus === 'UNALLOCATE'">未派单</span>
              <span v-if="scope.row.orderStatus === 'UNRESPONSE'">未响应</span>
              <span v-if="scope.row.orderStatus === 'RESPONDED'">已响应</span>
              <span v-if="scope.row.orderStatus === 'TRANSFERED'">已转单</span>
              <span v-if="scope.row.orderStatus === 'COMPLETED'">已完成</span>
              <span v-if="scope.row.orderStatus === 'FINISHED'">已结束</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="120" label="工单来源">
            <template slot-scope="scope">
              <span v-if="scope.row.faultSource === 'SYSTEM'">系统生成</span>
              <span v-if="scope.row.faultSource === 'INSPECTION'">巡检生成</span>
              <span v-if="scope.row.faultSource === 'OTHER'">其他</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="120" label="执行人" prop="repairStaffName"> </el-table-column>
          <el-table-column show-overflow-tooltip width="340" label="预计完成时间" prop="deadline">
            <template slot-scope="scope">
              {{ scope.row.limitTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
              <span
                class="finishTime"
                v-if="
                  moment(moment().format('YYYY-MM-DD')).diff(
                    moment(moment(scope.row.limitTime).format('YYYY-MM-DD')),
                    'days'
                  ) >= 1 &&
                    scope.row.orderStatus !== 'FINISHED' &&
                    scope.row.orderStatus !== 'COMPLETED'
                "
              >
                <img src="../../../../assets/button/timeIcon.png" alt="" />
                已逾期{{
                  moment(moment().format('YYYY-MM-DD')).diff(
                    moment(moment(scope.row.limitTime).format('YYYY-MM-DD')),
                    'days'
                  )
                }}天
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="完成时间" prop="finishTimeLine">
            <template slot-scope="scope">
              <span v-if="scope.row.finishTime">{{ scope.row.finishTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
              <span v-else style="color: #0f1736; font-size: 20px">----</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="操作">
            <template slot-scope="scope">
              <p @click="handleView(scope.$index, scope.row)" style="cursor: pointer" type="primary">
                <img src="../../../../assets/button/eyes.png" />
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
    <OrderDetail :typeInfo="typeInfo" :ordersort="ordersort"></OrderDetail>
  </div>
</template>

<script>
// import Maincontent from '@/components/layout/Maincontent.vue';
import APagination from '@/components/pagination/APagination';
import OrderDetail from '../orderDetail/detail';
import { orderList, commonGetEnum } from '@/api/order';
import { generateUrlParams } from '@/utils';
import { mapGetters } from 'vuex';
export default {
  name: 'opa-project',
  components: {
    // Maincontent,
    APagination,
    OrderDetail
  },
  watch: {
    $route(to, from) {
      if (to.query.type) {
        this.typeInfo = '2';
      } else {
        this.typeInfo = '1';
        this.getList();
      }
    },
    WsMaintain(val, old) {
      console.log(val, old);
      this.listenWsMaintain(val);
    }
  },
  computed: {
    ...mapGetters(['WsMaintain'])
  },
  data() {
    return {
      name: '工单列表',
      queryType: 'userLog',
      typeInfo: '1',
      ordersort: '1',
      statusObj: {},
      actionOb: {},
      levelOb: {},
      formData: {
        orderOrigin: '',
        orderStatus: '',
        orderCode: '',
        orderLevel: ''
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
      records: []
    };
  },
  methods: {
    initWs() {
      const data = {
        host: null,
        port: null
      };
      this.$store.dispatch('initWsMaintain', data);
    },
    listenWsMaintain(data) {
      if (data.orderOperateType) {
        if (data.orderOperateType !== 'CREATE' && data.orderOperateType !== 'DELETE') {
          // 通過id从tableData.records的数组里使用数组的find方法查找数据
          const item = this.tableData.records.find(ii => ii.id === data.object.id);
          let index;
          for (let i = 0; i < this.tableData.records.length; i++) {
            const item = this.tableData.records[i];
            if (item.id === data.object.id) {
              index = i;
              break;
            }
          }
          // 如果找到，就更新数据
          if (item && this.typeInfo == 1) {
            this.$message.success('工单列表有数据更新');
            this.$set(this.tableData.records, index, data.object);
          }
        } else {
          this.$message.success('工单列表有新数据');
        }
      }
    },
    reload() {
      this.$refs.form.resetFields();
      this.getList();
    },
    clearInputorderOrigin() {
      const faultSource = this.formData.orderOrigin;
      const orderStatus = this.formData.orderStatus;
      const orderCode = this.formData.orderCode;
      const priorityLevel = this.formData.orderLevel;
      this.getList(faultSource, orderStatus, orderCode, priorityLevel);
    },
    clearInputorderStatus() {
      const faultSource = this.formData.orderOrigin;
      const orderStatus = this.formData.orderStatus;
      const orderCode = this.formData.orderCode;
      const priorityLevel = this.formData.orderLevel;
      this.getList(faultSource, orderStatus, orderCode, priorityLevel);
    },
    clearInputorderLevel() {
      const faultSource = this.formData.orderOrigin;
      const orderStatus = this.formData.orderStatus;
      const orderCode = this.formData.orderCode;
      const priorityLevel = this.formData.orderLevel;
      this.getList(faultSource, orderStatus, orderCode, priorityLevel);
    },
    clearInputorderCode() {
      const faultSource = this.formData.orderOrigin;
      const orderStatus = this.formData.orderStatus;
      const orderCode = this.formData.orderCode;
      const priorityLevel = this.formData.orderLevel;
      this.getList(faultSource, orderStatus, orderCode, priorityLevel);
    },
    handleDistributed(index, row) {
      console.log(index, row);
    },
    handleView(index, row) {
      this.typeInfo = 2;
      this.$router.push({
        path: 'list',
        query: {
          type: '1',
          sort: '1',
          id: row.id
        }
      });
      this.ordersort = 1;
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
      const faultSource = this.formData.orderOrigin;
      const orderStatus = this.formData.orderStatus;
      const orderCode = this.formData.orderCode;
      const priorityLevel = this.formData.orderLevel;
      this.getList(faultSource, orderStatus, orderCode, priorityLevel);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      const faultSource = this.formData.orderOrigin;
      const orderStatus = this.formData.orderStatus;
      const orderCode = this.formData.orderCode;
      const priorityLevel = this.formData.orderLevel;
      this.getList(faultSource, orderStatus, orderCode, priorityLevel);
    },
    getList(faultSource, orderStatus, orderCode, priorityLevel) {
      const params = {
        current: this.pageCurrent,
        size: this.pageSize
      };
      const data = {
        faultSource: faultSource,
        orderStatus: orderStatus,
        orderCode: orderCode,
        priorityLevel: priorityLevel
      };
      const query = generateUrlParams('', params);
      orderList(query, data).then(res => {
        const { code, object } = res;
        if (code === 200 && object) {
          this.tableData = object;
        }
      });
    },
    search() {
      this.pageCurrent = 1;
      const faultSource = this.formData.orderOrigin;
      const orderStatus = this.formData.orderStatus;
      const orderCode = this.formData.orderCode;
      const priorityLevel = this.formData.orderLevel;
      this.getList(faultSource, orderStatus, orderCode, priorityLevel);
    },
    sort() {
      this.$refs.Table.clearSelection();
      this.getList();
    },
    getSelects() {
      const origin = commonGetEnum({
        enumName: 'FaultSourceType'
      });
      const state = commonGetEnum({
        enumName: 'OrderStatusType'
      });
      const level = commonGetEnum({
        enumName: 'PriorityLevelType'
      });

      return Promise.all([origin, state, level]).then(res => {
        const ori = res[0];
        const sta = res[1];
        const lev = res[2];

        if (ori) {
          const { code, object } = ori;
          if (code === 200) {
            this.actionOb = object;
          }
        }
        if (sta) {
          const { code, object } = sta;
          if (code === 200) {
            this.statusObj = object;
          }
        }
        if (lev) {
          const { code, object } = lev;
          if (code === 200) {
            this.levelOb = object;
            // console.log(levelOb)
          }
        }
      });
    }
  },
  created() {
    this.initWs();
    this.getSelects().then(this.getList);
  },
  mounted() {
    if (this.$route.query.type || this.$route.query.sort) {
      this.typeInfo = 2;
    } else {
      this.typeInfo = 1;
    }
  },
  updated: function() {}
};
</script>

<style lang="scss">
@import './order';

.finishTime {
  display: inline-block;
  padding: 5px 10px;
  width: 120px;
  height: 24px;
  background: rgba(255, 72, 7, 0.1);
  border-radius: 25px;
  line-height: 24px;
  text-indent: 10px;
  font-size: 12px;
  font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
  font-weight: 400;
  color: #ff4807;
  margin-left: 15px;

  img {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-top: 5px;
    float: left;
    margin-left: 12px;
  }
}

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
}

// 工单日志的样式
.box {
  display: flex;
}
</style>

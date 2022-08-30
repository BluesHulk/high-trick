<template>
  <div class="record-equipment pt-30 pl-50 pb-10">
    <div class="list-info" v-if="equipmentDetails">
      <div class="record-list">
        <div class="dootStyle">
          <span class="act1"></span>
        </div>

        <div class="record-info ml-10 mt-15">
          <p class="record-status mt-10">设备第一次上线</p>
          <p class="record-time">{{ equipmentDetails.firstOnlineTime | dateFormat('YYYY-MM-DD') }}</p>
        </div>
      </div>
      <div class="record-list" v-if="equipmentDetails.latestFault">
        <div class="dootStyle">
          <span class="act2"></span>
        </div>

        <div class="record-info ml-10 mt-15">
          <!-- <p class="record-status mt-10">{{ equipmentDetails.latestFault.faultDesc }}</p> -->
          <p class="record-status mt-10">设备故障</p>
          <p class="record-time">{{ equipmentDetails.latestFault.reportTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</p>
          <p class="record-detail mt-10" @click="checkDetailFault">查看详情</p>
        </div>
      </div>
      <div class="record-list" v-if="equipmentDetails.latestCompeleteFault">
        <div class="dootStyle">
          <span class="act3"></span>
        </div>

        <div class="record-info ml-10 mt-15">
          <!-- <p class="record-status mt-10">{{ equipmentDetails.latestCompeleteFault.faultDesc }}</p> -->
          <p class="record-status mt-10">故障修复</p>
          <p class="record-time">
            {{ equipmentDetails.latestCompeleteFault.reportTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
          </p>
          <p class="record-detail mt-10" @click="checkTenFaultFix">查看详情</p>
        </div>
      </div>
      <!-- <div class="record-list ">
        <div class="dootStyle">
          <span class="act4"></span>
        </div>

        <div class="record-info ml-10 mt-15">
          <P class="record-status mt-10">设备修复</P>
          <p class="record-time">2020.10.13 09:30:53</p>
        </div>
      </div> -->
    </div>
    <el-dialog class="dialog-end-order-list" :visible.sync="cancleList" width="520px">
      <template slot="title" class="fixList">
        <div class="demonstration">
          <span>设备故障详情 <span class="ten">(仅展示最近10次)</span></span>
        </div>
      </template>
      <div class="fault-wait-flow scrollbar scrollbar-y scrollbar-light mt-30" v-if="faultTenList.length > 0">
        <div class="flow-list box flow-path" v-for="(item, index) in faultTenList" :key="index">
          <div class="flow-doot" :class="falg == 1 ? 'flow-doot' : 'flow-doot-green'">
            <i></i>
          </div>

          <div class="flow-info">
            <p class="info-time">{{ item.reportTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</p>
            <h3>{{ item.faultTypeName }}</h3>
          </div>
        </div>
      </div>
      <div class="nodata" v-else>暂无数据</div>
      <span slot="footer" class="dialog-footer-equip">
        <el-button class="cancleDialog" @click="cancleList = false">取 消</el-button>
        <el-button class="confimDialog" type="primary" @click="corfimHide">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { latestFault, latestCompletedFault } from '@/api/order';
export default {
  name: 'a-back',
  props: ['equipmentDetails'],
  data() {
    return {
      cancleList: false,
      faultTenList: [],
      fixTenList: [],
      falg: 1
    };
  },
  methods: {
    corfimHide() {
      this.cancleList = false;
    },
    checkDetailFault() {
      this.cancleList = true;
      this.falg = 1;
      latestFault({
        deviceCode: this.equipmentDetails.fault.deviceCode
      }).then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.faultTenList = object;
        }
      });
    },
    checkTenFaultFix() {
      this.cancleList = true;
      this.falg = 2;
      latestCompletedFault({
        deviceCode: this.equipmentDetails.fault.deviceCode
      }).then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.faultTenList = object;
        }
      });
    }
  },
  created() {}
};
</script>
<style lang="scss">
.dialog-end-order-list {
  .el-dialog__body {
    padding: 0px 26px 40px 26px;
  }
  .demonstration {
    span {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 500;
      color: #0f1736;
    }
    .ten {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 500;
      color: #c6cada;
    }
  }
}

.pl-50 {
  padding-top: 50px;
}
.record-equipment {
  width: 642px;
  margin: 0 auto;
  .list-info {
  }

  .record-list {
    height: 104px;
    position: relative;
    float: left;

    .dootStyle {
      margin-left: 50%;
      span {
        &.act1 {
          width: 10px;
          height: 10px;
          border: 3px solid #3045b1;
          border-radius: 10px;
          margin-top: 2px;
          display: inline-block;
        }
        &.act2 {
          width: 10px;
          height: 10px;
          border: 3px solid #ff4807;
          border-radius: 10px;
          margin-top: 2px;
          display: inline-block;
        }
        &.act3 {
          width: 10px;
          height: 10px;
          border: 3px solid #00dcc3;
          border-radius: 10px;
          margin-top: 2px;
          display: inline-block;
        }
        &.act4 {
          width: 10px;
          height: 10px;
          border: 3px solid #3045b1;
          border-radius: 10px;
          margin-top: 2px;
          display: inline-block;
        }
      }
    }

    &::after {
      content: '';
      height: 2px;
      width: calc(100% - 15px);
      border-bottom: 2px dashed rgba(180, 185, 207, 0.4);
      position: absolute;
      top: 8px;
      left: calc(50% + 16px);
    }

    &:last-child {
      &::after {
        content: '';
        height: 0px;
        width: calc(100% - 15px);
        border: none;
        position: absolute;
        top: 8px;
        left: calc(50% + 16px);
      }
    }

    .record-info {
      p {
        font-size: 14px;
        line-height: 1;
        text-align: center;
      }

      .record-time {
        font-size: 12px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #aeb4c6;
        margin-top: 8px;
      }

      .record-status {
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #0f1736;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .record-detail {
        cursor: pointer;
        text-align: center;
        width: 70px;
        height: 29px;
        background: #3045b1;
        font-size: 12px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #ffffff;
        line-height: 29px;
        border-radius: 4px;
        position: absolute;
        top: -45px;
        left: 50%;
        margin-left: -26px;
        &:after {
          position: absolute;
          left: 28px;
          bottom: -6px;
          content: '';
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #3045b1;
        }
      }
    }
  }
}

.fault-wait-flow {
  height: 415px;
  .nodata {
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .flow-path {
    &::after {
      content: '';
      width: 2px;
      height: calc(100% - 10px);
      border-right: 2px dashed rgba(180, 185, 207, 0.4);
      position: absolute;
      left: 5px;
      top: 16px;
    }
  }

  .flow-list {
    position: relative;
    .flow-doot {
      i {
        width: 10px;
        height: 10px;
        border: 3px solid #ff4807;
        border-radius: 10px;
        margin-top: 2px;
        display: inline-block;
        &.null-step {
          border-color: #ccc;
        }

        &.end-step {
          border-color: #ff4807;
        }
      }
    }
    .flow-doot-green {
      i {
        width: 10px;
        height: 10px;
        border: 3px solid #00dcc3;
        border-radius: 10px;
        margin-top: 2px;
        display: inline-block;
        &.null-step {
          border-color: #ccc;
        }

        &.end-step {
          border-color: #00dcc3;
        }
      }
    }

    .flow-info {
      padding: 5px 20px;
      flex: 1;
      .outBox {
        width: 800px;
        height: 100px;
        overflow: hidden;
        position: relative;

        .demo-image__preview {
          position: relative;
        }
      }
      .nav-right {
        position: absolute;
        right: 0px;
        top: 22px;
        width: 42px;
        height: 100px;
        background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);
        span {
          width: 20px;
          height: 100px;
          background: #ffffff;
          box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
          border-radius: 4px;
          margin-left: 20px;
          display: inline-block;
          img {
            margin-top: 42px;
            margin-left: 3px;
          }
        }
      }
      .nav-left {
        position: absolute;
        left: 0px;
        top: 0;
        z-index: 88;
        width: 42px;
        height: 100px;
        background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);
        span {
          width: 20px;
          height: 100px;
          background: #ffffff;
          box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
          border-radius: 4px; // margin-left: 20px;
          display: inline-block;
          img {
            margin-top: 42px;
            margin-left: 3px;
          }
        }
      }
      p {
        font-size: 14px;
        line-height: 14px;
        .operation-null {
          color: #999999;
        }

        .operation {
          color: #ff4807;
        }

        .operation-defeated {
          color: #eb4132;
        }
      }

      .info-time {
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #aeb4c6;
        padding-bottom: 10px;
      }
      h3 {
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 600;
        color: #0f1736;
        padding-bottom: 20px;
      }
      .info-note,
      .info-reason,
      .info-result {
        font-size: 12px;
        font-family: 'SourceHanSansCN-Normal, SourceHanSansCN';
        font-weight: 400;
        color: #0f1736;
        padding-bottom: 10px;
      }
      .info-status {
        color: #ff4807;
      }
    }
  }
}
.dialog-footer-equip {
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

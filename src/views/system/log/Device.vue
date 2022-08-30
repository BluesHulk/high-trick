<template>
  <div class="log-wrapper common-page-wrapper">
    <div class="log-content-device log-content">
      <div class="pr-30 pl-30 pt-30">
        <el-form ref="form" :model="formData" class="log-user-form" @submit.native.prevent>
          <el-form-item label="">
            <el-select clearable v-model="formData.operateResponseStatus" placeholder="请选择状态">
              <el-option
                :key="item"
                v-for="item in Object.keys(statusObj)"
                :label="statusObj[item]"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select clearable v-model="formData.operateType" placeholder="请选择操作">
              <el-option
                :key="item"
                v-for="item in Object.keys(actionOb)"
                :label="actionOb[item]"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="time-wrapper">
            <div class="time a-date-picker">
              <el-date-picker
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                autocomplete="off"
                type="datetime"
                placeholder="开始日期"
                :picker-options="startDateDisabled"
                v-model="formData.operateBeginTime"
                @blur="onStartDateBlur"
              ></el-date-picker>
            </div>
            <div class="split-line"></div>
            <div class="time a-date-picker">
              <el-date-picker
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                autocomplete="off"
                type="datetime"
                placeholder="结束日期"
                :picker-options="endDateDisabled"
                v-model="formData.operateEndTime"
                @blur="onStartDateBlur"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              clearable
              v-model="formData.condition"
              autocomplete="off"
              placeholder="请输入账号/中文名"
            ></el-input>
          </el-form-item>
          <el-form-item style="position: relative; width: 42px">
            <el-button type="primary" class="search-button text-center" @click="search"></el-button>
          </el-form-item>
          <el-form-item style="position: relative; width: 42px; margin-right: 136px;">
            <el-button type="primary" class="refresh-button text-center" @click="reset"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="horizontal-line" style="margin-bottom: 30px"></div>
      <div class="pr-30 pl-30">
        <el-table
          ref="Table"
          class="table-striped"
          highlight-current-row
          :data="tableData.records"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="index" width="148" label="序号">
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.$index + 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作人" prop="username"></el-table-column>
          <el-table-column show-overflow-tooltip label="中文名" prop="staffName"></el-table-column>
          <el-table-column show-overflow-tooltip label="序列号" prop="id"></el-table-column>
          <el-table-column label="类型">
            <template>
              <div>设备类型</div>
            </template>
          </el-table-column>
          <el-table-column label="名称">名称</el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="row-wrapper float-container">
                <div class="row-text float-left">{{ actionOb[scope.row.operateType] }}</div>
                <div class="row-message float-left" @click.stop="onRowClick(scope.row, scope.$index, $event)"></div>
                <div @click="stop($event)" class="log-row-inner" :ref="`rowContent-${scope.$index}`">
                  <div class="log-row-header float-container">
                    <div class="row-message float-left"></div>
                    <div class="log-row-header-title float-left">备注信息</div>
                  </div>
                  <div class="horizontal-line"></div>
                  <div class="log-row-content">
                    <div class="log-con scrollbar scrollbar-light">
                      菜单名称：{{ scope.row.functionName }}
                      <div style="height: 20px"></div>
                      <div class="horizontal-line"></div>
                      <div style="height: 20px"></div>
                      {{ operateRequestParams }}
                      <div style="height: 20px"></div>
                      <div class="horizontal-line"></div>
                      <div style="height: 20px"></div>
                      {{ operateResponseContent }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="状态">
            <template slot-scope="scope">
              <span :class="scope.row.operateResponseStatus">
                {{ statusObj[scope.row.operateResponseStatus] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作时间">
            <template slot-scope="scope">
              {{ (scope.row.operateBeginTime || '').replace(/-/g, '.') }}
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
  </div>
</template>

<script>
import APagination from '@/components/pagination/APagination';
import log from './log.js';
import { getStyle } from '@/utils/utils';

export default {
  name: 'device',
  components: {
    APagination
  },
  mixins: [log],
  data() {
    return {
      operateRequestParams: {},
      operateResponseContent: {},
      visibleContent: false,
      prevIndex: null,
      queryType: 'operateLog'
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      document.onclick = e => {
        const els = document.querySelectorAll('.log-row-inner');
        Array.prototype.forEach.call(els, el => {
          el.style.display = 'none';
        });
      };
    },
    stop(event) {
      document.all ? (event.cancelBubble = true) : event.stopPropagation();
    },
    onRowClick(row, index, event) {
      this.operateRequestParams = row.operateRequestParams;
      // this.operateResponseContent = JSON.parse(row.operateResponseContent);
      // GT20201103-29
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
    }
  }
};
</script>

<style lang="scss">
@import './log';
.log-content-device {
  .el-table .td:nth-of-type(5) .cell {
    overflow: visible;
    position: relative;
  }

  .show {
    display: block;
  }

  .hide {
    display: none;
  }

  .current-row {
    .row-wrapper {
      .row-text {
        color: $--color-light;
      }
    }
  }

  .row-wrapper {
    .row-text,
    .row-message {
      display: inline-block;
    }

    .row-text {
      width: auto;
      height: 42px;
      overflow: hidden;
      font-size: 14px;
      font-family: 'SourceHanSansCN-Normal, SourceHanSansCN';
      font-weight: 400;
      color: $--color-dark;
      line-height: 42px;
      margin-right: 8px;
    }

    .row-message {
      width: 16px;
      height: 42px;
      background: url(../../../assets/log/row-message.png) center no-repeat;
      cursor: pointer;
    }

    .log-row-inner {
      display: none;
      position: absolute;
      z-index: 1;
      top: -17px;
      left: 80px;
      width: 280px;
      height: 258px;
      background: $--bg-light;
      box-shadow: 0 0 20px -3px rgba(16, 25, 74, 0.18);
      border-radius: 6px;

      .log-row-header {
        padding: 20px 30px;
      }

      .log-row-header-title {
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: $--color-dark;
        line-height: 21px;
        display: inline-block;
        margin-left: 14px;
      }

      .log-row-text {
      }

      .log-row-content {
        padding: 30px 6px 30px 30px;
      }

      .log-con {
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
}
</style>

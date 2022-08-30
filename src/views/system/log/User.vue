<template>
  <div class="log-wrapper common-page-wrapper">
    <div class="log-content">
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
                ref="start"
                type="datetime"
                placeholder="开始日期"
                :picker-options="startDateDisabled"
                v-model="formData.operateBeginTime"
                @blur="onStartDateBlur"
              ></el-date-picker>
              <!--<div @click="$refs.start.focus()" class="icon-data-picker"></div>-->
            </div>
            <div class="split-line"></div>
            <div class="time a-date-picker">
              <el-date-picker
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                autocomplete="off"
                ref="end"
                type="datetime"
                placeholder="结束日期"
                :picker-options="endDateDisabled"
                v-model="formData.operateEndTime"
                @blur="onStartDateBlur"
              ></el-date-picker>
              <!--<div @click="$refs.end.focus()" class="icon-data-picker"></div>-->
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
          <el-table-column align="center" type="index" width="260" label="序号">
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.$index + 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="账号" prop="username"></el-table-column>
          <el-table-column show-overflow-tooltip label="中文名" prop="staffName"></el-table-column>
          <el-table-column show-overflow-tooltip label="登录IP" prop="remoteIp"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              {{ actionOb[scope.row.operateType] }}
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

export default {
  name: 'user',
  components: {
    APagination
  },
  mixins: [log],
  data() {
    return {
      queryType: 'userLog'
    };
  }
};
</script>

<style lang="scss">
@import './log';
</style>

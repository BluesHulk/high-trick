<template>
  <div class="date-time-range">
    <template v-if="!isTime">
      <el-date-picker
        v-if="!isTime"
        v-model="timeRange[0]"
        placeholder="开始时间"
        align="center"
        :type="type"
        :picker-options="pickerOptionsStart"
        clearable
        @change="setTimeRange"
        v-bind="$attrs"
        style="width: 220px"
      ></el-date-picker>
      <span class="line"></span>
      <el-date-picker
        v-model="timeRange[1]"
        placeholder="结束时间"
        align="center"
        :type="type"
        :picker-options="pickerOptionsEnd"
        clearable
        @change="setTimeRange"
        v-bind="$attrs"
        style="width: 220px"
      ></el-date-picker>
    </template>
    <template v-if="isTime">
      <el-time-picker
        v-model="timeRange[0]"
        @change="setTimeRange"
        placeholder="起始时间"
        v-bind="$attrs"
        :picker-options="{
          selectableRange: `00:00:00 - ${formatTime(timeRange[1]) || '23:59:59'}`
        }"
        style="width: 220px"
      >
      </el-time-picker>
      <span class="line"></span>
      <el-time-picker
        v-model="timeRange[1]"
        @change="setTimeRange"
        placeholder="结束时间"
        v-bind="$attrs"
        :picker-options="{
          selectableRange: `${formatTime(timeRange[0]) || '00:00:00'} - 23:59:59`
        }"
        style="width: 220px"
      >
      </el-time-picker>
    </template>
  </div>
</template>

<script>
export default {
  name: 'date-time-range',
  props: {
    timeRange: {
      type: Array,
      required: false,
      default: () => []
    },
    type: {
      type: String,
      required: false,
      default: 'date'
    }
  },
  model: {
    prop: 'timeRange',
    event: 'change'
  },
  computed: {
    isTime() {
      return this.type === 'time';
    }
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          const endDateVal = this.timeRange[1];
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const beginDateVal = this.timeRange[0];
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        }
      },
      formatTime(time) {
        if (!time) return '';
        if (time instanceof Date) {
          return this.$$moment(time).format('HH:mm:ss');
        } else {
          return time.split(':')[2] ? time : time + ':00';
        }
      }
    };
  },
  methods: {
    setTimeRange() {
      if (this.timeRange[0] === null) this.timeRange[0] = '';
      if (this.timeRange[1] === null) this.timeRange[1] = '';
      this.$emit('change', this.timeRange);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme.scss';
.date-time-range {
  width: auto;
}
.line {
  width: 32px;
  height: 1px;
  display: inline-block;
  line-height: 32px;
  margin: 15px 16px;
  vertical-align: middle;
}
</style>

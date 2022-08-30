import { operateLogQueryPage, operateLogQueryStatus, operateLogQueryOperate } from '@/api/rbac';

export default {
  data() {
    return {
      tryCount: 0,
      startDateDisabled: {},
      endDateDisabled: {},
      statusObj: {},
      actionOb: {},
      formData: {
        operateResponseStatus: '',
        operateType: '',
        operateBeginTime: '',
        operateEndTime: '',
        condition: ''
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
  created() {
    this.initDate();
    this.getSelects().then(this.getList);
  },
  methods: {
    initDate() {
      // 限制开始日期不能超过当前日期
      this.startDateDisabled.disabledDate = time => {
        if (this.formData.operateEndTime) {
          return time.getTime() > new Date(this.formData.operateEndTime).getTime();
        }
      };
      // 限制结束日期：当前日期往后的日期都不能选取
      this.endDateDisabled.disabledDate = time => {
        if (this.formData.operateBeginTime) {
          return time.getTime() < new Date(this.formData.operateBeginTime).getTime() - 24 * 60 * 3600;
        }
      };
    },
    onStartDateBlur(instance) {
      if (this.formData.operateEndTime && this.formData.operateEndTime < instance.value) {
        this.$message.info(`开始时间不能大于结束时间`);
        // this.formData.operateBeginTime = '';
        instance.focus();
      }
    },
    onEndDateBlur(instance) {
      if (this.formData.operateBeginTime && this.formData.operateBeginTime > instance.value) {
        this.$message.info(`结束时间不能小于开始时间`);
        // this.formData.operateEndTime = '';
        instance.focus();
      }
    },
    getSelects() {
      const ope = operateLogQueryOperate({ queryType: this.queryType });
      const sta = operateLogQueryStatus();
      return Promise.all([ope, sta]).then(res => {
        const opeRes = res[0];
        const staRes = res[1];
        if (opeRes) {
          const { code, object } = opeRes;
          if (code === 200) {
            this.actionOb = object;
          }
        }
        if (staRes) {
          const { code, object } = staRes;
          if (code === 200) {
            this.statusObj = object;
          }
        }
      });
    },
    formatNumber(number) {
      return number < 10 ? '0' + number : number;
    },
    search() {
      this.pageCurrent = 1;
      this.getList();
    },
    reset() {
      this.formData = {
        operateResponseStatus: '',
        operateType: '',
        operateBeginTime: '',
        operateEndTime: '',
        condition: ''
      };
      this.search();
    },
    sort(val) {
      this.$refs.Table.clearSelection();
      this.getList();
    },
    getList() {
      const params = {
        current: this.pageCurrent,
        size: this.pageSize,
        queryType: this.queryType
      };
      this.formData.condition = this.formData.condition.replace(/^(\s+)|(\s+)$/g, '');
      if (this.formData.condition.length) params.condition = this.formData.condition;
      if (this.formData.operateResponseStatus.length) {
        params.operateResponseStatus = this.formData.operateResponseStatus;
      }
      if (this.formData.operateType.length) params.operateType = this.formData.operateType;
      if (this.formData.operateBeginTime) params.operateBeginTime = this.formData.operateBeginTime;
      if (this.formData.operateEndTime) params.operateEndTime = this.formData.operateEndTime;
      operateLogQueryPage(params).then(res => {
        const { code, object } = res;
        if (code === 200 && object) {
          const { records } = object;
          if (Array.isArray(records) && !records.length) {
            if (this.tryCount) {
              this.tryCount = 0;
              return;
            }
            this.pageCurrent = 1;
            this.tryCount++;
            this.getList();
          }
          this.tableData = object;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getList();
    }
  }
};

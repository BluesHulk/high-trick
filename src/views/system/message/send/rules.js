export default {
  data() {
    return {
      rules: {}
    };
  },
  methods: {
    setRules() {
      const validPriority = (rule, value, callback) => {
        if (value) {
          callback();
        } else {
          callback(new Error('请选择优先级'));
        }
      };
      const validTitle = (rule, value, callback) => {
        value = value.replace(/(^\s+)|(\s+$)/g, '');
        if (value) {
          const max = 60;
          const len = value.length;
          if (len < 1 || len > max) {
            callback(new Error(`最多只能输入${max}个字符`));
          } else {
            callback();
          }
        } else {
          callback(new Error('请输入标题'));
        }
      };
      const validCont = (rule, value, callback) => {
        const len = value.replace(/(^\s+)|(\s+$)/g, '').length;
        const count = 300;
        if (len && value.length && value.length <= count) {
          callback();
        } else {
          callback(new Error(`最多只能输入${count}个字符`));
        }
      };
      switch (this.actionType) {
        case this.$$ActionType.add:
        case this.$$ActionType.edit:
          this.rules = {
            priority: [{ validator: validPriority, required: true, trigger: 'blur' }],
            title: [{ validator: validTitle, required: true, trigger: 'blur' }],
            content: [{ validator: validCont, trigger: 'blur' }]
          };
          break;
        case this.$$ActionType.views:
          this.rules = {};
          // this.$nextTick(() => {
          //   this.$refs.autoForm && this.$refs.autoForm.clearValidate(['name', 'content']);
          // });
          break;
      }
    }
  }
};

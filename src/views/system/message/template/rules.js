export default {
  data() {
    return {
      rules: {}
    };
  },
  methods: {
    setRules() {
      const validName = (rule, value, callback) => {
        const re = /[\u4e00-\u9fa5A-Za-z\d]/g;
        if (re.test(value)) {
          callback();
        } else {
          callback(new Error('请输入中文或英文或数字或部分字符'));
        }
      };
      const validType = (rule, value, callback) => {
        if (value) {
          callback();
        } else {
          callback(new Error('请选择类别'));
        }
      };
      const validTitle = (rule, value, callback) => {
        value = value.replace(/(^\s+)|(\s+$)/g, '');
        if (value) {
          callback();
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
      // const validDesc = (rule, value, callback) => {
      //   if (value === '') {
      //     this.$refs.autoForm.clearValidate('content');
      //     callback();
      //   } else {
      //     if (value.length > 50) {
      //       callback(new Error(`字符索不能超过50个`));
      //     } else {
      //       callback();
      //     }
      //   }
      // };
      switch (this.actionType) {
        case this.$$ActionType.add:
        case this.$$ActionType.edit:
          this.rules = {
            name: [{ validator: validName, required: true, trigger: 'blur' }],
            type: [{ validator: validType, required: true, trigger: 'blur' }],
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

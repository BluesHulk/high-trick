export default {
  data() {
    return {
      priorityClass: [],
      // 这个好像不用了
      statusObj: {
        // UNHANDLED: '未处理',
        // NO_TEMPLATE_MATCHED: '未匹配模板',
        // NOTICE_FAILURE: '发布失败',
        // NOTICE_SUCCESS: '发布成功'
        UNHANDLED: '未发布',
        NOTICE_SUCCESS: '已发布'
      },
      messageStatus: {
        0: '未读',
        1: '已读'
      },
      messageLevel: {
        1: '普通',
        2: '紧急',
        3: '特急'
      },
      rowStatusObj: {
        UNHANDLED: '未发布',
        NOTICE_SUCCESS: '已发布'
      },
      typeList: [
        { label: 'Web', value: 'WEB' },
        { label: 'E-Mail', value: 'MAIL' },
        { label: 'APP', value: 'APP' },
        { label: '短信提醒', value: 'SMS' }
      ]
    };
  },
  methods: {
    getPriorityClass(val) {
      this.priorityClass = [`priority-` + val];
      return [`priority-` + val];
    },
    getItemPriorityClass(priority) {
      return [`item-priority-` + priority];
    }
  }
};

// 控制设备
export function control({ ids, type, value }) {
  const { showControlTips } = require('@/classes/Message').default;
  const { Screen } = require('@/api/control');
  return new Promise(resolve => {
    Screen.command({
      ids: ids.join(','),
      type,
      value: JSON.stringify(value)
    })
      .then(res => {
        if (res) {
          const { success, message } = res;
          if (success) {
            showControlTips(res);
          } else {
            this.$message.error(message || '操作失败');
          }
          resolve(res);
        }
      })
      .catch(e => Promise.reject(e));
  });
}

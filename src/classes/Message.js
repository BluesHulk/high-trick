import { Message } from 'element-ui';

let messageInstance = null;
const mainMessage = options => {
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
};
const arr = ['success', 'warning', 'info', 'error'];
arr.forEach(type => {
  mainMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    return mainMessage(options);
  };
});

export function showControlTips(result) {
  const outerSuccess = result.success;
  let resSu = '';
  let resErr = '';
  const arr = result.object || [];
  if (outerSuccess) {
    arr.forEach(value => {
      const response = value.response || {};
      const { message, success } = response;
      if (success) {
        resSu += '<div class="item-message-success">' + (message || '操作成功') + '</div>';
      } else {
        resErr += '<div class="item-message-error">' + (message || '操作失败') + '</div>';
      }
    });
  }
  mainMessage({
    dangerouslyUseHTMLString: true,
    message: '<div class="message-wrapper">' + resSu + resErr + '</div>'
  });
}

export function showDeleteTips(result) {
  const outerSuccess = result.success;
  let resErr = '';
  const arr = result.object || [];
  if (outerSuccess) {
    arr.forEach(value => {
      const { name } = value;
      resErr += '<div class="item-message-error">' + `${name} 删除失败` + '</div>';
    });
  }
  if (resErr.length) {
    Message({
      dangerouslyUseHTMLString: true,
      message: '<div class="message-wrapper">' + resErr + '</div>'
    });
  }
}

export function showImportTips(result) {
  const { message } = result;
  if (message && message.length) {
    Message({
      dangerouslyUseHTMLString: true,
      message: `<div class="message-wrapper"><div class="message-content">${message}</div></div>`
    });
  }
}

export default mainMessage;

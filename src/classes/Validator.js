import { Message } from 'element-ui';

export default class Validator {
  static string(msg = '', minlength, maxlength) {
    if (typeof msg === 'function') msg = msg();
    return (rule, value, callback) => {
      value = String(value).replace(/^\s+|\s+$/g, '');
      if (!value) {
        callback(new Error('必填项填写不正确'));
      } else if (value.length < minlength || value.length > maxlength) {
        callback(new Error(msg + `字符长度为${minlength}~${maxlength}位`));
      } else {
        callback();
      }
    };
  }

  static checkId(msg = '', minlength, maxlength) {
    if (typeof msg === 'function') msg = msg();
    return (rule, value, callback) => {
      value = String(value).replace(/^\s+|\s+$/g, '');
      const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (!reg.test(value)) {
        callback(new Error('身份证格式不正确'));
      } else if (value.length < minlength || value.length > maxlength) {
        callback(new Error(msg + `身份证字符个数为${minlength}~${maxlength}位`));
      } else {
        callback();
      }
    };
  }

  static illegal(string = '') {
    const has = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/g.test(String(string));
    if (has) {
      Message.info('存在非法字符');
    }
    return has;
  }

  static validIllegal(msg = '', minlength, maxlength) {
    if (typeof msg === 'function') msg = msg();
    return (rule, value, callback) => {
      const has = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/g.test(String(value));
      if (has) return callback(new Error('存在非法字符'));
      value = String(value).replace(/^\s+|\s+$/g, '');
      if (!value) {
        callback(new Error('必填项填写不正确'));
      } else if (value.length < minlength || value.length > maxlength) {
        callback(new Error(msg + `字符长度为${minlength}~${maxlength}位`));
      } else {
        callback();
      }
    };
  }

  static name(msg = '', minlength, maxlength) {
    if (typeof msg === 'function') msg = msg();
    return (rule, value, callback) => {
      const has = !/^\w+$/g.test(String(value));
      if (has) {
        callback(new Error('字符类型错误'));
      } else {
        value = String(value).replace(/^\s+|\s+$/g, '');
        if (!value) {
          callback(new Error('必填项填写不正确'));
        } else if (value.length < minlength || value.length > maxlength) {
          callback(new Error(msg + `字符长度为${minlength}~${maxlength}位`));
        } else {
          callback();
        }
      }
    };
  }

  static number(msg = '', minlength, maxlength) {
    if (typeof msg === 'function') msg = msg();
    return (rule, value, callback) => {
      const isSafe = Number.MIN_SAFE_INTEGER < value && Number.MAX_SAFE_INTEGER > value;
      if (!isSafe) return callback(new Error('不是合理的数字'));
      const has = /\D/.test(String(value));
      if (has) return callback(new Error('不是整数'));
      value = String(value).replace(/^\s+|\s+$/g, '');
      if (!value) {
        callback(new Error('必填项填写不正确'));
      } else if (value.length < minlength || value.length > maxlength) {
        callback(new Error(msg + `字符长度为${minlength}~${maxlength}位`));
      } else {
        callback();
      }
    };
  }

  static integer = Validator.number;

  static float(msg = '', minlength, maxlength) {
    if (typeof msg === 'function') msg = msg();
    return (rule, value, callback) => {
      const isSafe = Number.MIN_VALUE < value && Number.MAX_VALUE > value;
      if (!isSafe) return callback(new Error('不是合理的数字'));
      const has = !/^(-?\d+)(\.\d+)?$/.test(value);
      if (has) return callback(new Error('不是数字'));
      value = String(value).replace(/^\s+|\s+$/g, '');
      if (!value) {
        callback(new Error('必填项填写不正确'));
      } else if (value.length < minlength || value.length > maxlength) {
        callback(new Error(msg + `字符长度为${minlength}~${maxlength}位`));
      } else {
        callback();
      }
    };
  }

  /**
   * 是否跳过验证
   * @param skip { Boolean } false表示不跳过验证，但不校验未填写
   * @returns {Function}
   */
  static checkPhone(skip) {
    const re = /^1\d{10}$/;
    const msg = '请输入正确的手机号码';
    return (rule, value, callback) => {
      value = String(value);
      if (re.test(value) && !skip) {
        callback();
      } else {
        // value = String(value).replace(/^\s+|\s+$/g, '');
        value = String(value);
        if (value === '') {
          if (!skip) callback();
          else callback(new Error(msg));
        } else {
          if (/^\d+$/g.test(value)) {
            if (value.length < 11) {
              callback(new Error(msg));
            } else if (value.length > 11) {
              callback(new Error(msg));
            } else {
              callback();
            }
          } else {
            callback(new Error(msg));
          }
        }
      }
    };
  }

  static email(msg = '') {
    if (typeof msg === 'function') msg = msg();
    const re = /^\w+@[a-z0-9]+\.[a-z]{2,4}$/;
    return (rule, value, callback) => {
      value = String(value).replace(/^\s+|\s+$/g, '');
      if (!value) {
        callback(new Error('请填写邮箱'));
      } else {
        if (re.test(value)) {
          callback();
        } else {
          callback(new Error('邮箱填写不正确'));
        }
      }
    };
  }

  static password(msg = '', minlength, maxlength) {
    if (typeof msg === 'function') msg = msg();
    return (rule, value, callback) => {
      value = String(value); // .replace(/^\s+|\s+$/g, '');
      if (!/^[A-Za-z0-9]+$/g.test(value)) {
        callback(new Error('密码格式为数字或大小写字母'));
      } else {
        if (value.length < minlength || value.length > maxlength) {
          callback(new Error(msg + `密码长度为${minlength}~${maxlength}位`));
        } else {
          callback();
        }
      }
    };
  }
}

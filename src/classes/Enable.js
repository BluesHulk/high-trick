export default class Enable {
  static get List() {
    return [
      { label: '启用', value: true },
      { label: '禁用', value: false }
    ];
  }

  static getValue(label = '', defaultValue = '') {
    const val = Enable.List.find(item => item.label === label);
    return (val && val.value) || defaultValue;
  }

  static getText(value = '', defaultText = '') {
    const val = Enable.List.find(item => item.value === value);
    return (val && val.label) || defaultText;
  }

  static toBoolean(value) {
    return !!value;
  }

  static toNumber(val) {
    return Number(val);
  }
}

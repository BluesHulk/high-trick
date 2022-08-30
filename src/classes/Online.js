export default class Online {
  static get List() {
    return [
      { label: '全部', value: '' },
      { label: '在线', value: true },
      { label: '离线', value: false }
    ];
  }

  static getValue(label = '', defaultValue = '') {
    const val = Online.List.find(item => item.label === label);
    return (val && val.value) || defaultValue;
  }

  static getText(value = '', defaultText = '') {
    const val = Online.List.find(item => item.value === value);
    return (val && val.label) || defaultText;
  }

  static toBoolean(value) {
    return !!value;
  }

  static toNumber(val) {
    return Number(val);
  }
}

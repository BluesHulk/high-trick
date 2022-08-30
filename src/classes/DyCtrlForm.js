import FormItem from '@/constants/FormItem';
import PageType from '@/constants/PageType';
import { isObject } from '@silen/utils';
import { getProps } from '@/utils';
import Validator from '@/classes/Validator';

export default class DyCtrlForm {
  // vm里pageType必填项
  constructor(vm, array) {
    this.vm = vm;
    this.origin = array;
    this.formData = {};
    this.elements = [];
    this.rules = {};
    this.init(array);
  }

  // formData, elements, rules
  init(array = []) {
    this.setFormData(array);
    this.setElements(array);
    this.setRules(array);
  }

  static getDefaultValue(formItemType, type) {
    switch (FormItem[formItemType]) {
      case FormItem.Input:
        return type === 'STRING' ? '' : 0;
      case FormItem.Textarea:
        break;
      case FormItem.Select:
        break;
      case FormItem.Date:
        break;
      case FormItem.Time:
        break;
      case FormItem.Switch:
        return false;
      case FormItem.CheckboxGroup:
        break;
      case FormItem.RadioGroup:
        break;
      case FormItem.Checkbox:
        break;
      case FormItem.Radio:
        break;
      case FormItem.InputNumber:
        break;
      case FormItem.Cascader:
        break;
      case FormItem.Slider:
        break;
      case FormItem.ColorPicker:
        break;
      case FormItem.Transfer:
        break;
      case FormItem.Year:
        break;
      case FormItem.Month:
        break;
      case FormItem.Dates:
        break;
      case FormItem.Week:
        break;
      case FormItem.Datetime:
        break;
      case FormItem.Datetimerange:
        break;
      case FormItem.Daterange:
        break;
      case FormItem.Monthrange:
        break;
      case FormItem.SliderInput:
        return 0;
    }
  }

  setFormData(fields = []) {
    this.formData = fields.reduce((def, val) => {
      const { name, value, formItemType } = val;
      let nv;
      if (FormItem[formItemType] === FormItem.SliderInput) {
        nv = parseInt(value, 10);
      } else {
        nv = value;
      }
      return { ...def, [name]: nv };
    }, {});
  }

  setElements(fields = []) {
    const data = [];
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      const { title, name, formItemType, value, showed } = field;
      const item = { ...field };
      const isDataAdd = showed.includes('ADD');
      const isDataEdit = showed.includes('EDIT');
      const isDataView = showed.includes('INFO');
      item.hidden = !(isDataAdd || isDataEdit || isDataView);
      let type;
      if (isDataAdd) {
        type = FormItem[formItemType];
      } else if (isDataEdit) {
        type = FormItem[formItemType];
      } else if (isDataView) {
        type = FormItem.Readable;
      }
      item.label = title;
      item.prop = name;
      item.value = value;
      item.formItemType = FormItem[formItemType];
      // const type = (isEdit || isViews) && !controllable ? FormItem.Readable : FormItem[formItemType];
      item.type = type;
      this.parseTemplate(item, field, type);
      data.push(item);
    }
    this.elements = data;
  }

  setRules(fields = []) {
    const { pageType } = this.vm;
    const pageTypes = [PageType.add, PageType.edit];
    if (!pageTypes.includes(pageType)) return {};
    const rules = {};
    const defaults = [
      FormItem.Switch,
      FormItem.CheckboxGroup,
      FormItem.RadioGroup,
      FormItem.Checkbox,
      FormItem.Radio,
      FormItem.ColorPicker,
      FormItem.Transfer
    ];
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      const { name, formItemType, type, required, showed } = field;
      const isDataAdd = showed.includes('ADD');
      const isDataEdit = showed.includes('EDIT');
      const isDataView = showed.includes('INFO');
      if (!(isDataAdd || isDataEdit || isDataView)) continue;
      const t = FormItem[formItemType];
      switch (t) {
        case FormItem.InputNumber:
        case FormItem.Slider:
        case FormItem.SliderInput:
          switch (type) {
            case 'INTEGER':
              required && (rules[name] = [{ validator: Validator.number(), required, trigger: 'blur' }]);
              break;
            case 'FLOAT':
              required && (rules[name] = [{ validator: Validator.float(), required, trigger: 'blur' }]);
              break;
          }
          break;
        case FormItem.Input:
        case FormItem.Textarea:
          switch (type) {
            case 'INTEGER':
              required && (rules[name] = [{ validator: Validator.number(), required, trigger: 'blur' }]);
              break;
            case 'FLOAT':
              required && (rules[name] = [{ validator: Validator.float(), required, trigger: 'blur' }]);
              break;
            default:
              required && (rules[name] = [{ validator: Validator.string(), required, trigger: 'blur' }]);
          }
          break;
        case FormItem.Select:
        case FormItem.Cascader:
          required && (rules[name] = [{ validator: Validator.string(), required, trigger: 'blur' }]);
          break;
        case FormItem.Date:
        case FormItem.Time:
        case FormItem.Year:
        case FormItem.Month:
        case FormItem.Dates:
        case FormItem.Week:
        case FormItem.Datetime:
        case FormItem.Datetimerange:
        case FormItem.Daterange:
        case FormItem.Monthrange:
          required && (rules[name] = [{ required, trigger: 'blur' }]);
          break;
        default:
          defaults.includes(t) && required && (rules[name] = [{ required, trigger: 'blur' }]);
      }
    }
    this.rules = rules;
  }

  getFormData() {
    return this.formData;
  }

  getElements() {
    return this.elements;
  }

  getRules() {
    return this.rules;
  }

  getValue(key) {
    return this.formData[key];
  }

  updateFormItem(key, value) {
    const item = this.origin.find(i => i.name === key);
    if (item) {
      this.formData[key] = value;
    }
  }

  updateFormData(object = {}) {
    if (isObject(object)) {
      for (const p in object) {
        this.formData[p] = object[p];
      }
    }
  }

  getSwitchData(field, array = []) {
    // { label', prop, type: FormItem.Switch, activeText: '开屏', inactiveText: '关屏', activeColor: 'rgba(39, 102, 204, 1)' },
    const activeText = (array.find(i => i.value) || {}).label;
    const inactiveText = (array.find(i => !i.value) || {}).label;
    return {
      activeText,
      inactiveText,
      activeColor: 'rgba(39, 102, 204, 1)'
    };
  }

  parseTemplate(item = {}, field = {}, type) {
    const { valueTemplate } = field;
    const tmp = (valueTemplate && JSON.parse(valueTemplate)) || {};
    let data;
    switch (type) {
      case FormItem.SliderInput:
        data = getProps(tmp, ['max', 'min', 'step']);
        data.inputSize = 'small';
        data.value = parseInt(item.value);
        break;
      case FormItem.Switch:
        data = this.getSwitchData(field, tmp);
        break;
      case FormItem.Select:
        data = tmp;
        break;
    }
    if (!data) data = {};
    if (isObject(data)) {
      for (const p in data) {
        item[p] = data[p];
      }
    } else if (Array.isArray(data)) {
      console.log(238);
      item.data = data;
    }
  }
}

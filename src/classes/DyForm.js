import FormItem from '@/constants/FormItem';
import PageType from '@/constants/PageType';
import { isObject } from '@silen/utils';
import { getProps } from '@/utils';
import Validator from '@/classes/Validator';

export default class DyForm {
  constructor(array = [], vm) {
    // 为array添加sn
    this.origin = array;
    this.contents = array.concat();
    this.groups = null;
    this.initialized = false;
    this.vm = vm;
    this.init();
  }

  init() {
    if (this.initialized) throw new Error(`You have already initialized. this.initialized: ${this.initialized}`);
    this.initialized = true;

    this.group();
  }

  // 对数据进行分组
  group() {
    const group = {};

    for (let i = 0; i < this.origin.length; i++) {
      const item = this.origin[i];
      const { groupId } = item;
      if (!group[groupId]) group[groupId] = [];
      group[groupId].push(item);
    }

    this.groups = group;
  }

  getGroups() {
    return this.groups;
  }

  static parseTemplate(field) {
    const { valueTemplate } = field;
    let tmp;
    try {
      tmp = JSON.parse(valueTemplate);
    } catch (e) {
      tmp = {};
    }
    return tmp || {};
  }

  static getTextFromTemplate(value, template) {
    const item = template.find(i => i.value === value);
    if (!item) return value;
    return item.label;
  }

  // 获取表单
  getForm(array = []) {
    const { vm } = this;
    const { pageType } = vm;
    const isViews = pageType === PageType.views;
    return array.reduce((def, val) => {
      const { name, formItemType, value } = val;
      const template = DyForm.parseTemplate(val);
      let showValue;
      switch (FormItem[formItemType]) {
        case FormItem.Switch:
          if (isViews && Array.isArray(template)) {
            showValue = DyForm.getTextFromTemplate(value, template);
          }
          break;
        case FormItem.Select:
          if (isViews && Array.isArray(template)) {
            showValue = DyForm.getTextFromTemplate(value, template);
          } else {
            showValue = value;
          }
          break;
        case FormItem.SliderInput:
          showValue = parseInt(value, 10);
          break;
        default:
          showValue = value;
          break;
      }
      showValue = showValue == null ? '' : showValue;
      return {
        ...def,
        [name]: showValue
      };
    }, {});
  }

  /**
   * 获取表单项
   * @returns {Array} 数据格式：[{ groupId, formData }]
   */
  getForms() {
    const res = [];
    if (Object.keys(this.groups).length) {
      for (const k in this.groups) {
        const list = this.groups[k];
        const rest = this.getForm(list);
        const has = res.find(value => value.groupId === k);
        if (!has) {
          //   has.formData = { ...has.formData, ...rest };
          // } else {
          res.push({ groupId: list[0].groupId, formData: rest });
        }
      }
    }
    return res;
  }

  /**
   * 根据type为每一条数据对象添加属性
   * @param item {Object}
   * @param field {Object}
   * @param type {FormItem}
   * @param tmp 解析field.valueTemplate的结果
   */
  addPropsByType(item = {}, field = {}, type, tmp) {
    let data;
    switch (type) {
      case FormItem.SliderInput:
        data = getProps(tmp, ['max', 'min', 'step']);
        data.value = parseInt(data.value, 10);
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
      item.data = data;
    }
  }

  getSwitchData(field, array = []) {
    if (!Array.isArray(array)) {
      console.error(
        `当前的数据对象为${JSON.stringify(field)}\n\n其中，formItemType为${
          field.formItemType
        }，但valueTemplate解析出来的是`,
        array,
        `不是数组结构`
      );
    }
    array = Array.from(array);
    const activeText = (array.find(i => i.value) || {}).label;
    const inactiveText = (array.find(i => !i.value) || {}).label;
    return {
      activeText,
      inactiveText,
      activeColor: 'rgba(39, 102, 204, 1)'
    };
  }

  getElement(fields) {
    const { vm } = this;
    const { pageType } = vm;
    const isViews = pageType === PageType.views;
    const isEdit = pageType === PageType.edit;
    const isAdd = pageType === PageType.add;
    const data = [];
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      const { title, unit, name, formItemType, value, showed, controllable } = field;
      const item = { ...field };
      const isDataAdd = showed.includes('ADD');
      const isDataEdit = showed.includes('EDIT');
      const isDataView = showed.includes('INFO');
      item.hidden = !((isAdd && isDataAdd) || (isEdit && isDataEdit) || (isViews && isDataView));
      let type;
      if (isAdd && isDataAdd) {
        type = FormItem[formItemType];
      } else if (isEdit && isDataEdit) {
        type = FormItem[formItemType];
      } else if (isViews && isDataView) {
        if (controllable) {
          type = FormItem[formItemType];
        } else {
          type = FormItem.Readable;
        }
      }
      const template = DyForm.parseTemplate(field);
      item.label = title + (unit ? `(${unit})` : '');
      item.prop = name;
      item.value = value;
      item.formItemType = FormItem[formItemType];
      item.type = type;
      this.addPropsByType(item, field, type, template);
      data.push(item);
    }
    return data;
  }

  getElements() {
    const res = [];
    if (Object.keys(this.groups).length) {
      for (const k in this.groups) {
        const list = this.groups[k];
        const rest = this.getElement(list);
        const has = res.find(value => value.groupId === k);
        if (has) {
          has.elements.push(...rest);
        } else {
          res.push({ groupId: list[0].groupId, elements: rest });
        }
      }
    }
    return res;
  }

  getRules() {
    const res = [];
    if (Object.keys(this.groups).length) {
      for (const p in this.groups) {
        const list = this.groups[p];
        const rest = this.getRule(list);
        res.push({ groupId: list[0].groupId, rules: rest });
      }
    }
    return res;
  }

  getRule(fields = []) {
    const { vm } = this;
    const { pageType } = vm;
    const pageTypes = [PageType.add, PageType.edit];
    if (!pageTypes.includes(pageType)) return {};
    const rules = {};
    const defaults = [
      FormItem.Switch,
      FormItem.CheckboxGroup,
      FormItem.RadioGroup,
      FormItem.Checkbox,
      FormItem.Radio,
      FormItem.Slider,
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
        case FormItem.Input:
        case FormItem.InputNumber:
        case FormItem.SliderInput:
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
        case FormItem.Textarea:
          required && (rules[name] = [{ validator: Validator.string(), required, trigger: 'blur' }]);
          break;
        case FormItem.Select:
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
    return rules;
  }

  updateContentPropValue(prop, value) {
    for (let j = 0; j < this.contents.length; j++) {
      if (this.contents[j].name === prop) {
        this.contents[j].value = value;
      }
    }
  }

  clear() {
    this.origin = [];
    this.groups = null;
    this.initialized = null;
  }
}

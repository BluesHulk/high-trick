<template>
  <el-form-item
    :style="model.style"
    :label="model.label"
    :prop="model.prop"
    :label-position="model['label-position'] || model.labelPosition"
  >
    <!-- input -->
    <template v-if="model.type === $$FormItem.Input">
      <el-input
        :size="model.size"
        :resize="model.resize"
        :disabled="model.disabled"
        :readonly="model.readonly"
        :type="$$FormItem[model.type].toLowerCase()"
        :autocomplete="model.autocomplete"
        :validate-event="model.validateEvent"
        :suffix-icon="model.suffixIcon"
        :prefix-icon="model.prefixIcon"
        :label="model.label"
        :clearable="model.clearable"
        :show-password="model.showPassword"
        :show-word-limit="model.showWordLimit"
        :tabindex="model.tabindex"
        v-model="value[model.prop]"
        :maxlength="model.maxlength"
        :minlength="model.minlength"
        :placeholder="model.placeholder"
        :name="model.name"
        :max="model.max"
        :min="model.min"
        :step="model.step"
        :autofocus="model.autofocus"
        :form="model.form"
        @blur="event => onInputBlur(model.blur, event)"
        @focus="event => onInputFocus(model.focus, event)"
        @change="val => onInputChange(model.change, val)"
        @input="val => onInput(model.input, val)"
      ></el-input>
    </template>
    <!-- input-number -->
    <template v-if="model.type === $$FormItem.InputNumber">
      <el-input-number
        v-model="value[model.prop]"
        :max="model.max"
        :min="model.min"
        :step="model.step"
        :step-strictly="model.stepStrictly"
        :precision="model.precision"
        :size="model.size"
        :disabled="model.disabled"
        :controls="model.controls"
        :controls-position="model.controlsPosition"
        :name="model.name"
        :label="model.label"
        :placeholder="model.placeholder"
        :autofocus="model.autofocus"
        @blur="event => onInputNumberBlur(model.blur, event)"
        @focus="event => onInputNumberFocus(model.focus, event)"
        @change="(currentValue, oldValue) => onInputNumberChange(model.change, currentValue, oldValue)"
      ></el-input-number>
    </template>
    <!-- select -->
    <template v-else-if="model.type === $$FormItem.Select">
      <el-select
        :multiple="model.multiple"
        :disabled="model.disabled"
        :value-key="model.valueKey"
        :size="model.size"
        :clearable="model.clearable"
        :collapse-tags="model.collapseTags"
        :multiple-limit="model.multipleLimit"
        :name="model.name"
        :autocomplete="model.autocomplete"
        v-model="value[model.prop]"
        :placeholder="model.placeholder"
        :filterable="model.filterable"
        :allow-create="model.allowCreate"
        :filter-method="model.filterMethod"
        :remote="model.remote"
        :remote-method="model.remoteMethod"
        :loading="model.loading"
        :loading-text="model.loadingText"
        :no-match-text="model.noMatchText"
        :no-data-text="model.noDataText"
        :popper-class="model.popperClass"
        :reserve-keyword="model.reserveKeyword"
        :default-first-option="model.defaultFirstOption"
        :popper-append-to-body="model.popperAppendToBody"
        :automatic-dropdown="model.automaticDropdown"
        @change="val => onSelectChange(model.change, val)"
        @blur="val => onSelectBlur(model.blur, val)"
        @focus="val => onSelectFocus(model.focus, val)"
        @remove-tag="val => onSelectRemoveTag(model.removeTag, val)"
        @visible-change="val => onSelectVisibleChangeChange(model.visibleChange, val)"
      >
        <el-option v-for="(val, index) in model.data" :key="index" :label="val.label" :value="val.value"></el-option>
      </el-select>
    </template>
    <!-- cascader -->
    <template v-else-if="model.type === $$FormItem.Cascader">
      <el-cascader
        v-model="value[model.prop]"
        :options="model.options"
        :props="model.props"
        :size="model.size"
        :placeholder="model.placeholder"
        :disabled="model.disabled"
        :clearable="model.clearable"
        :show-all-levels="model.showAllLevels"
        :collapse-tags="model.collapseTags"
        :separator="model.separator"
        :filterable="model.filterable"
        :filter-method="model.filterMethod"
        :debounce="model.debounce"
        :before-filter="model.beforeFilter"
        :popper-class="model.popperClass"
        @change="val => onCascaderChange(model.change, val)"
        @expand-change="arr => onCascaderExpandChange(model.expandChange, arr)"
        @blur="event => onCascaderBlur(model.blur, event)"
        @focus="event => onCascaderFocus(model.focus, event)"
        @visible-change="event => onCascaderVisibleChange(model.visibleChange, event)"
        @remove-tag="event => onCascaderRemoveTag(model.removeTag, event)"
      ></el-cascader>
    </template>
    <!-- date -->
    <template v-else-if="numbers.includes(model.type)">
      <el-date-picker
        :readonly="model.readonly"
        :disabled="model.disabled"
        :editable="model.editable"
        :clearable="model.clearable"
        :size="model.size"
        :placeholder="model.placeholder"
        :start-placeholder="model.startPlaceholder || model['start-placeholder']"
        :end-placeholder="model.endPlaceholder || model['end-placeholder']"
        :type="getDateType(model)"
        :format="model.format"
        :align="model.align"
        :popper-class="model.popperClass || model['popper-class']"
        :picker-options="model.pickerOptions || model['picker-options']"
        :range-separator="model.rangeSeparator || model['range-separator']"
        :default-value="model.defaultValue || model['default-value']"
        :default-time="model.defaultTime || model['default-time']"
        :value-format="model.valueFormat || model['value-format']"
        :name="model.name"
        :unlink-panels="model.unlinkPanels || model['unlink-panels']"
        :prefix-icon="model.prefixIcon || model['prefix-icon']"
        :clear-icon="model.clearIcon || model['clear-icon']"
        :validate-event="model.validateEvent || model['validate-event']"
        v-model="value[model.prop]"
        style="width: 100%"
        @change="time => onDateChange(model.change, time)"
        @blur="instance => onDateBlur(model.blur, instance)"
        @focus="instance => onDateFocus(model.focus, instance)"
      ></el-date-picker>
    </template>
    <!-- time -->
    <template v-else-if="model.type === $$FormItem.Time">
      <el-time-picker
        :readonly="model.readonly"
        :disabled="model.disabled"
        :editable="model.editable"
        :clearable="model.clearable"
        :size="model.size"
        :placeholder="model.placeholder"
        :start-placeholder="model.startPlaceholder || model['start-placeholder']"
        :end-placeholder="model.endPlaceholder || model['end-placeholder']"
        :is-range="model.isRange || model['is-range']"
        :arrow-control="model.arrowControl || model['arrow-control']"
        :align="model.align"
        :popper-class="model.popperClass || model['popper-class']"
        :picker-options="model.pickerOptions || model['picker-options']"
        :range-separator="model.rangeSeparator || model['range-separator']"
        :value-format="model.valueFormat || model['value-format']"
        :default-value="model.defaultValue || model['default-value']"
        :name="model.name"
        :prefix-icon="model.prefixIcon || model['prefix-icon']"
        :clear-icon="model.clearIcon || model['clear-icon']"
        v-model="value[model.prop]"
        style="width: 100%"
        @change="time => onTimeChange(model.change, time)"
        @blur="instance => onTimeBlur(model.blur, instance)"
        @focus="instance => onTimeFocus(model.focus, instance)"
      ></el-time-picker>
    </template>
    <!-- switch -->
    <template v-else-if="model.type === $$FormItem.Switch">
      <el-switch
        v-model="value[model.prop]"
        :disabled="model.disabled"
        :width="model.width"
        :active-icon-class="model.activeIconClass"
        :inactive-icon-class="model.inactiveIconClass"
        :active-value="model.activeValue"
        :active-text="model.activeText"
        :inactive-text="model.inactiveText"
        :inactive-value="model.inactiveValue"
        :active-color="model.activeColor"
        :inactive-color="model.inactiveColor"
        :name="model.name"
        :validate-event="model.validateEvent"
        @change="val => onSwitchChange(model.change, val)"
      ></el-switch>
    </template>
    <!-- slider -->
    <template v-else-if="model.type === $$FormItem.Slider">
      <el-slider
        v-model="value[model.prop]"
        :max="model.max"
        :min="model.min"
        :disabled="model.disabled"
        :step="model.step"
        :input-size="model.inputSize"
        :show-stops="model.showStops"
        :show-tooltip="model.showTooltip"
        :format-tooltip="model.formatTooltip"
        :range="model.range"
        :vertical="model.vertical"
        :height="model.height"
        :label="model.label"
        :debounce="model.debounce"
        :tooltip-class="model.tooltipClass"
        :marks="model.marks"
        @change="val => onSliderChange(model.change, val)"
        @input="val => onSliderInput(model.input, val)"
      >
      </el-slider>
    </template>
    <!-- slider-input -->
    <template v-else-if="model.type === $$FormItem.SliderInput">
      <el-slider
        v-model="value[model.prop]"
        :max="model.max"
        :min="model.min"
        :disabled="model.disabled"
        :step="model.step"
        :show-input="true"
        :show-input-controls="true"
        :input-size="model.inputSize"
        :show-stops="model.showStops"
        :show-tooltip="model.showTooltip"
        :format-tooltip="model.formatTooltip"
        :range="model.range"
        :vertical="model.vertical"
        :height="model.height"
        :label="model.label"
        :debounce="model.debounce"
        :tooltip-class="model.tooltipClass"
        :marks="model.marks"
        @input="val => onSliderInput(model.input, val)"
        @change="val => onSliderChange(model.change, val)"
      >
      </el-slider>
    </template>
    <!-- color-picker -->
    <template v-else-if="model.type === $$FormItem.ColorPicker">
      <el-color-picker
        v-model="value[model.prop]"
        :disabled="model.disabled"
        :size="model.size"
        :show-alpha="model.showAlpha"
        :color-format="model.colorFormat"
        :popper-class="model.popperClass"
        :predefine="model.predefine"
        @change="val => onColorPickerChange(model.change, val)"
        @active-change="val => onColorPickerActiveChange(model.activeChange, val)"
      ></el-color-picker>
    </template>
    <!-- checkbox-group -->
    <template v-else-if="model.type === $$FormItem.CheckboxGroup">
      <el-checkbox
        v-model="value[model.prop]"
        :label="model.label"
        :true-label="model.trueLabel"
        :false-label="model.falseLabel"
        :disabled="model.disabled"
        :border="model.border"
        :size="model.size"
        :name="model.name"
        :checked="model.checked"
        :indeterminate="model.indeterminate"
        @change="val => onCheckboxChange(model.change, val)"
      >
        <el-checkbox v-for="(val, index) in model.data" :key="index" :label="val.label" name="type"></el-checkbox>
      </el-checkbox>
    </template>
    <!-- checkbox-group -->
    <template v-else-if="model.type === $$FormItem.CheckboxGroup">
      <el-checkbox-group
        v-model="value[model.prop]"
        :size="model.size"
        :disabled="model.disabled"
        :min="model.min"
        :max="model.max"
        :text-color="model.textColor"
        :fill="model.fill"
      >
        <el-checkbox v-for="(val, index) in model.data" :key="index" :label="val.label" name="type"></el-checkbox>
      </el-checkbox-group>
    </template>
    <!-- radio-group -->
    <template v-else-if="model.type === $$FormItem.RadioGroup">
      <el-radio-group v-model="value[model.prop]" @change="val => onRadioGroupChange(model.change, val)">
        <el-radio
          v-for="(val, index) in model.data"
          :disabled="model.disabled"
          :label="val.label"
          :key="index"
        ></el-radio>
      </el-radio-group>
    </template>
    <!-- radio -->
    <template v-else-if="model.type === $$FormItem.Radio">
      <el-radio
        v-model="value[model.prop]"
        :label="model.label"
        :disabled="model.disabled"
        :border="model.border"
        :size="model.size"
        :name="model.name"
        @change="val => onRadioChange(model.change, val)"
      ></el-radio>
    </template>
    <!-- transfer -->
    <template v-else-if="model.type === $$FormItem.Transfer">
      <el-transfer
        v-model="value[model.prop]"
        :props="model.props"
        :data="model.data"
        :filterable="model.filterable"
        :filter-placeholder="model.filterPlaceholder"
        :filter-method="model.filterMethod"
        :target-order="model.targetOrder"
        :titles="model.titles"
        :button-texts="model.buttonTexts"
        :render-content="model.renderContent"
        :format="model.format"
        :left-default-checked="model.leftDefaultChecked"
        :right-default-checked="model.rightDefaultChecked"
      >
        <slot name="left-footer"></slot>
        <slot name="right-footer"></slot>
      </el-transfer>
    </template>
    <!-- textarea -->
    <template v-else-if="model.type === $$FormItem.Textarea">
      <el-input
        v-model="value[model.prop]"
        :maxlength="model.maxlength"
        :minlength="model.minlength"
        :show-word-limit="model.showWordLimit"
        :placeholder="model.placeholder"
        :clearable="model.clearable"
        :show-password="model.showPassword"
        :disabled="model.disabled"
        :size="model.size"
        :prefix-icon="model.prefixIcon"
        :suffix-icon="model.suffixIcon"
        :resize="model.resize"
        :readonly="model.readonly"
        :autocomplete="model.autocomplete"
        :validate-event="model.validateEvent"
        :label="model.label"
        :tabindex="model.tabindex"
        :name="model.name"
        :max="model.max"
        :min="model.min"
        :step="model.step"
        :autofocus="model.autofocus"
        :form="model.form"
        @blur="event => onTextareaBlur(model.blur, event)"
        @focus="event => onTextareaFocus(model.focus, event)"
        @change="val => onTextareaChange(model.change, val)"
        @input="val => onTextareaInput(model.input, val)"
        :autosize="model.autosize"
        :rows="model.rows"
        type="textarea"
      ></el-input>
    </template>
    <template v-else-if="model.type === $$FormItem.Button">
      <el-button @click="model.click(model)" type="primary">{{ getButtonText(model) }}</el-button>
    </template>
    <template v-else-if="model.type === $$FormItem.Readable">
      <div class="show-dot" :title="value[model.prop]">{{ value[model.prop] }}</div>
    </template>
  </el-form-item>
</template>

<script>
export default {
  name: 'form-item',
  props: {
    value: Object,
    model: Object
  },
  data() {
    return {
      types: ['year', 'month', 'date', 'dates', 'week', 'datetime', 'datetimerange', 'daterange', 'monthrange'],
      numbers: [16, 17, 3, 18, 19, 20, 21, 22, 23]
    };
  },
  methods: {
    getButtonText(model) {
      const vt = model.valueTemplate;
      return typeof vt === 'string' ? JSON.parse(vt).label : vt.label;
    },
    getDateType(model) {
      let t = parseInt(model.type, 10);
      if (Number.isSafeInteger(t)) {
        t = this.$$FormItem[t];
        if (t) {
          t = t.toLowerCase();
          if (this.types.includes(t)) return t;
        }
      }
      return model.type;
    },
    onInputBlur(blur, event) {
      typeof blur === 'function' && blur(event);
    },
    onInputFocus(focus, event) {
      typeof focus === 'function' && focus(event);
    },
    onInputChange(change, value) {
      typeof change === 'function' && change(value);
    },
    onInput(input, value) {
      typeof input === 'function' && input(value);
    },
    onTextareaBlur(blur, event) {
      typeof blur === 'function' && blur(event);
    },
    onTextareaFocus(focus, event) {
      typeof focus === 'function' && focus(event);
    },
    onTextareaChange(change, value) {
      typeof change === 'function' && change(value);
    },
    onTextareaInput(input, value) {
      typeof input === 'function' && input(value);
    },
    onInputNumberBlur(blur, event) {
      typeof blur === 'function' && blur(event);
    },
    onInputNumberFocus(focus, event) {
      typeof focus === 'function' && focus(event);
    },
    onInputNumberChange(change, currentValue, oldValue) {
      typeof change === 'function' && change(currentValue, oldValue);
    },
    onTimeChange(fn, time) {
      typeof fn === 'function' && fn(time);
    },
    onTimeBlur(fn, instance) {
      typeof fn === 'function' && fn(instance);
    },
    onTimeFocus(fn, instance) {
      typeof fn === 'function' && fn(instance);
    },
    onDateChange(fn, time) {
      typeof fn === 'function' && fn(time);
    },
    onDateBlur(fn, instance) {
      typeof fn === 'function' && fn(instance);
    },
    onDateFocus(fn, instance) {
      typeof fn === 'function' && fn(instance);
    },
    onSelectChange(change, value) {
      typeof change === 'function' && change(value);
    },
    onSelectVisibleChangeChange(change, value) {
      typeof change === 'function' && change(value);
    },
    onSelectRemoveTag(change, value) {
      typeof change === 'function' && change(value);
    },
    onSelectBlur(blur, value) {
      typeof blur === 'function' && blur(value);
    },
    onSelectFocus(focus, value) {
      typeof focus === 'function' && focus(value);
    },
    onCascaderChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onCascaderExpandChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onCascaderBlur(blur, val) {
      typeof blur === 'function' && blur(val);
    },
    onCascaderFocus(focus, val) {
      typeof focus === 'function' && focus(val);
    },
    onCascaderVisibleChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onCascaderRemoveTag(rm, val) {
      typeof rm === 'function' && rm(val);
    },
    onSwitchChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onSliderChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onSliderInput(input, val) {
      typeof input === 'function' && input(val);
    },
    onColorPickerChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onColorPickerActiveChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onRadioChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onRadioGroupChange(change, val) {
      typeof change === 'function' && change(val);
    },
    onCheckboxChange(change, val) {
      typeof change === 'function' && change(val);
    }
  }
};
</script>

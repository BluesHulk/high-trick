<template>
  <div
    :style="{
      width: wid + 'px'
    }"
  >
    <el-form
      :inline="inline"
      :model="value"
      :rules="rules"
      ref="form"
      :class="formClass"
      :label-width="labelWidth"
      :style="{ width: wid + gut + 'px' }"
    >
      <template v-if="inline">
        <template v-if="multiCol">
          <el-row :gutter="gut" type="flex" justify="space-between" v-for="rowIndex in rows" :key="rowIndex">
            <el-col
              :class="getClassName(item, item.hidden ? 'hidden-form-item' : '')"
              :span="isLast(rowIndex) ? 24 : getSpan(rowIndex)"
              v-for="(item, colIndex) in getColumns(rowIndex)"
              :key="colIndex"
            >
              <AFormItem
                v-model="value"
                :model="item"
                :class="getClassName(item, stretch ? 'a-stretch-form-item' : '')"
              ></AFormItem>
            </el-col>
          </el-row>
        </template>
        <template v-else v-for="(item, i) in elements">
          <AFormItem
            v-if="!stretch"
            v-model="value"
            :model="item"
            :key="i"
            :class="getClassName(item, item.hidden ? 'hidden-form-item' : '')"
          ></AFormItem>
          <AFormItem
            v-else
            :key="i"
            v-model="value"
            :model="item"
            :class="getClassName(item, stretch ? 'a-stretch-form-item' : '', item.hidden ? 'hidden-form-item' : '')"
          >
          </AFormItem>
        </template>
      </template>
      <el-row :gutter="gut" v-else v-for="rowIndex in rows" :key="rowIndex">
        <el-col
          :class="getClassName(item, item.hidden ? 'hidden-form-item' : '')"
          :span="isLast(rowIndex) ? 24 : getSpan(rowIndex)"
          v-for="(item, colIndex) in getColumns(rowIndex)"
          :key="colIndex"
        >
          <AFormItem v-model="value" :model="item"></AFormItem>
        </el-col>
      </el-row>
      <el-form-item v-if="buttons">
        <el-button
          v-auth="btn.auth"
          v-for="(btn, btnIndex) in buttons"
          :key="btnIndex"
          :type="btn.type"
          @click="execute(btn)"
        >
          {{ btn.text }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AFormItem from './AFormItem';

export default {
  name: 'a-form',
  components: {
    AFormItem
  },
  props: {
    width: {
      type: [String, Number]
    },
    gutter: {
      type: [String, Number]
    },
    labelWidth: String,
    buttons: Array,
    inline: Boolean,
    stretch: Boolean, // inline时生效
    col: {
      type: [String, Number],
      default: 1,
      validator(value) {
        return value > 0;
      }
    },
    elements: Array, // 表单元素
    value: Object, // 表单数据
    rules: {} // 表单规则
  },
  computed: {
    rows() {
      return Math.ceil(this.elements.length / (this.column < 1 ? 1 : this.column));
    },
    formClass() {
      return this.inline ? ['form-inline', { 'a-stretch-form': this.stretch, 'a-multi-col-form': this.multiCol }] : [];
    },
    multiCol() {
      return Number.isFinite(this.column) && this.column > 1;
    }
  },
  data() {
    return {
      gut: 0,
      column: 0,
      wid: 0
    };
  },
  beforeDestroy() {
    // this.resetForm();
  },
  created() {
    this.wid = parseInt(this.width, 10);
    this.gut = parseInt(this.gutter, 10);
    this.column = parseInt(this.col, 10);
  },
  // mounted() {
  //   // this.setWidth();
  // },
  methods: {
    isLast(current) {
      const isOdd = this.elements.length % 2 === 1;
      return isOdd && this.rows === current;
    },
    getSpan(current) {
      const isLast = this.isLast(current);
      return isLast ? Math.floor(24 / this.column) : 24;
    },
    getClassName(item, ...computedClassName) {
      return [item.className || '', ...computedClassName];
    },
    getColumns(rowIndex) {
      return this.elements.slice(this.column * (rowIndex - 1), this.column * (rowIndex - 1) + this.column);
    },
    setWidth() {
      if (!this.stretch) return;
      this.$nextTick(() => {
        const content = document.querySelectorAll('.a-stretch-form-item .el-form-item__content');
        const arr = [...content];
        const w = Math.ceil(this.labelWidth);
        arr.forEach((c, index) => {
          const width = Math.ceil(c.previousElementSibling.getBoundingClientRect().width);
          c.style.width = `calc(100% - ${w || width}px)`;
        });
      });
    },
    execute(btn = {}) {
      const { btnType } = btn;
      const events = btn.events || {};
      const keys = Object.keys(events);
      const isSubmit = btnType === this.$$ButtonType.FILTER;
      if (!keys.length) {
        if (isSubmit) {
          this.submitForm();
        } else if (btnType === this.$$ButtonType.RESET) {
          this.resetForm();
        }
      } else {
        for (const p in events) {
          if (typeof events[p] === 'function') {
            events[p](isSubmit ? this.submitForm() : null);
          }
        }
      }
    },
    submitForm() {
      return this.$refs['form']
        .validate()
        .then(valid => {
          if (valid) {
            console.log('submit!');
            this.$emit('submit');
            return true;
          } else {
            console.log('error submit!!');
            return false;
          }
        })
        .catch(e => {
          console.log('AForm.submitForm', e);
          if (typeof e === 'boolean') return e;
          return false;
        });
    },
    resetForm() {
      return new Promise(resolve => {
        this.$refs['form'].resetFields();
        this.$emit('reset');
        resolve();
      });
    },
    validateField(props, cb) {
      this.$refs['form'].validateField(props, cb);
    },
    clearValidate(props) {
      this.$refs['form'].clearValidate(props);
    }
  }
};
</script>

<template>
  <el-form ref="form" :model="formData" :rules="rules" :class="FormClass" @submit.native.prevent>
    <el-row :gutter="30" style="margin-bottom: 30px">
      <el-col :span="12">
        <el-form-item prop="parentId">
          <div class="form-label">
            <span class="form-label-text">上级组织架构</span>
          </div>
          <el-cascader
            :disabled="isViews"
            v-model="formData.parentId"
            :options="treeNodes"
            :show-all-levels="false"
            :props="{ checkStrictly: true }"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="name">
          <div class="form-label">
            <span class="form-label-text form-item-required">组织架构名称</span>
          </div>
          <el-input
            :disabled="isViews"
            style="width: 320px"
            v-model="formData.name"
            autocomplete="off"
            placeholder=""
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="desc">
      <div class="form-label">
        <span class="form-label-text">描述</span>
      </div>
      <el-input
        :disabled="isViews"
        type="textarea"
        resize="none"
        v-model="formData.desc"
        autocomplete="off"
        placeholder="请输入描述"
      >
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'org-form',
  props: {
    treeNodes: Array,
    actionType: String,
    nodeData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    FormClass() {
      return this.actionType && this.actionType !== this.$$ActionType.views ? ['editable-form'] : '';
    },
    isEdit() {
      return this.actionType === this.$$ActionType.edit;
    },
    isViews() {
      return this.actionType === this.$$ActionType.views;
    }
  },
  data() {
    return {
      formData: {
        parentId: '',
        name: '',
        desc: ''
      },
      rules: {}
    };
  },
  watch: {
    actionType() {
      this.setFormData();
    },
    nodeData() {
      this.setFormData();
    }
  },
  methods: {
    submitForm() {
      return this.$refs['form']
        .validate()
        .then(valid => valid)
        .catch(e => {
          console.log('OrgForm.submitForm', e);
          if (typeof e === 'boolean') return e;
          return false;
        });
    },
    setRules() {
      const validName = (rule, value, callback) => {
        const re = /[\u4e00-\u9fa5A-Za-z\d]/g;
        if (re.test(value)) {
          callback();
        } else {
          callback(new Error('请输入中文或英文或数字或部分字符'));
        }
      };
      const validDesc = (rule, value, callback) => {
        if (value === '') {
          this.$refs.form.clearValidate('desc');
          callback();
        } else {
          if (value && value.length > 50) {
            callback(new Error(`字符索不能超过50个`));
          } else {
            callback();
          }
        }
      };
      switch (this.actionType) {
        case this.$$ActionType.edit:
          this.rules = {
            name: [{ validator: validName, required: true, message: '请输入中文或英文或数字', trigger: 'blur' }],
            desc: [{ validator: validDesc, message: '描述字数在50字内', trigger: 'blur' }]
          };
          break;
        case this.$$ActionType.views:
          this.rules = {};
          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.clearValidate(['name', 'desc']);
          });
          break;
      }
    },
    setFormData() {
      if (this.nodeData) {
        this.formData = {
          parentId: this.nodeData.parentId,
          name: this.nodeData.label,
          desc: this.nodeData.desc
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
@import '@/styles/system/form';
</style>

<template>
  <el-form ref="form" :model="formData" :rules="rules" class="editable-form" @submit.native.prevent>
    <el-row :gutter="30" style="margin-bottom: 30px">
      <el-col :span="12">
        <el-form-item prop="name">
          <div class="form-label">
            <span class="form-label-text">角色名称</span>
          </div>
          <el-input v-model="formData.name" autocomplete="off" placeholder="输入角色名称"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="desc">
      <div class="form-label">
        <span class="form-label-text">描述</span>
      </div>
      <el-input type="textarea" resize="none" v-model="formData.desc" autocomplete="off" placeholder="输入描述">
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'role-form-add',
  props: {
    treeNodes: Array
  },
  data() {
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
    return {
      formData: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{ validator: validName, required: true, message: '请输入中文或英文或数字', trigger: 'blur' }],
        desc: [{ validator: validDesc, message: '描述字数在50字内', trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm() {
      return this.$refs['form']
        .validate()
        .then(valid => valid)
        .catch(e => {
          console.log('RoleForm.submitForm', e);
          if (typeof e === 'boolean') return e;
          return false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
@import '@/styles/system/form';
</style>

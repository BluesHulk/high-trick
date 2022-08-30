<template>
  <el-form ref="form" :model="formData" class="message-template-form" @submit.native.prevent>
    <el-row :gutter="30" style="margin-bottom: 30px">
      <el-col :span="12">
        <el-form-item prop="name">
          <div class="form-label">
            <span class="form-label-text">模板名称</span>
          </div>
          <el-input style="width: 320px" disabled v-model="formData.name" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="type">
          <div class="form-label">
            <span class="form-label-text">模板类别</span>
          </div>
          <el-select disabled style="width: 320px" clearable v-model="formData.type" placeholder="请选择类别">
            <el-option :key="item" v-for="item in Object.keys(types)" :label="types[item]" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="title">
      <div class="form-label">
        <span class="form-label-text">模板标题</span>
      </div>
      <el-input disabled resize="none" v-model="formData.title" autocomplete="off" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item prop="content">
      <div class="form-label">
        <span class="form-label-text">消息内容</span>
      </div>
      <el-input
        disabled
        resize="none"
        v-model="formData.content"
        autocomplete="off"
        type="textarea"
        placeholder="请输入内容"
      ></el-input>
    </el-form-item>
    <el-form-item prop="distribution">
      <div class="checkbox-views">
        <div class="form-label">
          <span class="form-label-text">分发方式</span>
        </div>
        <el-checkbox-group disabled v-model="formData.distribution">
          <el-checkbox v-for="(val, index) in typeList" :key="index" :label="val.value" name="distribution">
            {{ val.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import message from '@/mixins/message';

export default {
  name: 'views',
  props: {
    types: Object,
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      checkedList: []
    };
  },
  mixins: [message]
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
@import '@/styles/system/form';
</style>
<style lang="scss">
.message-template-form {
  .el-checkbox__label {
    padding-left: 16px;
  }
}
</style>

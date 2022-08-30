<template>
  <el-dialog :close-on-click-modal="false" width="730px" title="消息详情" :visible="visible" :before-close="cancel">
    <el-form ref="form" :model="formData" class="detail-form" @submit.native.prevent>
      <el-form-item prop="title" class="detail-form-item">
        <div class="detail-form-label">消息名称</div>
        <el-input disabled v-model="formData.title" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item prop="content" class="detail-form-item">
        <div class="detail-form-label">消息内容</div>
        <el-input
          disabled
          resize="none"
          v-model="formData.content"
          autocomplete="off"
          type="textarea"
          placeholder=""
        ></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'message-detail',
  props: {
    visible: Boolean,
    rowData: Object
  },
  data() {
    return {
      elements: [],
      formData: {
        title: '',
        content: ''
      },
      rules: {}
    };
  },
  watch: {
    rowData() {
      this.initFormData();
    }
  },
  methods: {
    initFormData() {
      this.formData.title = this.rowData.title;
      this.formData.content = this.rowData.content;
    },
    cancel() {
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
.detail-form {
  .detail-form-item {
    width: 670px;
    .el-input {
      width: 320px;
    }
    .detail-form-label {
      height: 14px;
      font-size: 14px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: $--color-form-label;
      line-height: 14px;
      margin-bottom: 10px;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>

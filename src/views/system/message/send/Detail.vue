<template>
  <el-dialog :close-on-click-modal="false" width="730px" title="消息详情" :visible="visible" :before-close="cancel">
    <el-form ref="form" :model="formData" class="message-detail-form" @submit.native.prevent>
      <el-form-item prop="title" class="message-detail-form-item">
        <div class="message-detail-form-label">消息名称</div>
        <el-input style="width: 320px" disabled v-model="formData.title" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item prop="content" class="message-detail-form-item">
        <div class="message-detail-form-label">消息内容</div>
        <el-input
          disabled
          resize="none"
          v-model="formData.content"
          autocomplete="off"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item prop="distribution" class="message-detail-form-item">
        <ActionWrapper class="checkbox-views">
          <div class="message-detail-form-label">分发方式</div>
          <el-checkbox-group disabled v-model="formData.distribution">
            <el-checkbox v-for="(val, index) in typeList" :key="index" :label="val.value" name="distribution">
              {{ val.label }}
            </el-checkbox>
          </el-checkbox-group>
        </ActionWrapper>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import ActionWrapper from '@/components/action/ActionWrapper';
import message from '@/mixins/message';

export default {
  name: 'detail',
  components: {
    ActionWrapper
  },
  props: {
    visible: Boolean,
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        name: ''
      },
      checkedList: []
    };
  },
  mixins: [message],
  created() {
    this.setFormData();
  },
  methods: {
    setFormData() {
      console.log(this.rowData);
      this.formData = {
        title: this.rowData.title,
        content: this.rowData.content,
        distribution: (this.rowData.distribution || '').split('_')
      };
    },
    cancel() {
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
.message-detail-form {
  width: 670px;
  margin: 0 auto;
  .message-detail-form-item {
    width: 670px;
    .message-detail-form-label {
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
  .el-checkbox {
    margin-right: 20px;
  }
}
</style>
<style lang="scss">
.message-detail-form {
  .el-checkbox__label {
    padding-left: 16px;
  }
}
</style>

<template>
  <el-dialog
    class="del-dialog"
    :close-on-click-modal="false"
    width="520px"
    title="删除"
    :visible="delVisible"
    :before-close="cancel"
  >
    <!--<div class="delete-message text-center">是否确认删除此条信息？</div>-->
    <div class="delete-message text-center">是否确认解除 {{ delText }} 的关联？</div>
    <div class="delete-sub-message text-center">解除后关联关系则不存在</div>
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <DeleteButton @click="submit">{{ $$ButtonText.ok }}</DeleteButton>
    </div>
  </el-dialog>
</template>

<script>
import CancelButton from '@/components/button/CancelButton.vue';
import DeleteButton from '@/components/button/DeleteButton.vue';

export default {
  name: 'del-modal',
  components: {
    CancelButton,
    DeleteButton
  },
  props: {
    delText: String,
    delVisible: Boolean
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit('del-concel');
    },
    submit() {
      this.$emit('del-submit');
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';

.delete-message {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: $--color-dark;
  line-height: 22px;
  margin-bottom: 10px;
  padding-top: 20px;
}
.delete-sub-message {
  color: $--color-username;
  height: 14px;
  font-size: 14px;
  font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
  font-weight: 400;
  line-height: 21px;
  letter-spacing: 1px;
  padding-bottom: 20px;
}
.del-dialog {
  .el-dialog__footer {
    border-bottom-left-radius: 14px !important;
    border-bottom-right-radius: 14px !important;
  }
}
</style>

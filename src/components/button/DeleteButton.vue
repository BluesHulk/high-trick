<template>
  <div class="delete-button el-button el-button--danger text-center" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'delete-button'
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';

.delete-button {
  width: 100px;
  height: 42px;
  background: $--color-danger;
  border-radius: 24px;
  padding-left: 0;
  padding-right: 0;
  font-size: 16px;
  font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
  font-weight: 500;
  color: $--color-light;
  line-height: 24px;
  letter-spacing: 1px;
}
</style>

<template>
  <div class="save-button el-button el-button--primary text-center" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'save-button'
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';

.save-button {
  width: 100px;
  height: 42px;
  background: #3045b1;
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

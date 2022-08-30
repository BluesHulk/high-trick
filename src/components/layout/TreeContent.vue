<template>
  <div class="page-content-outer">
    <GlobalActionWrapper class="page-tree-wrapper custom-tree-wrapper">
      <slot name="tree"></slot>
    </GlobalActionWrapper>
    <div class="page-content-wrapper scrollbar scrollbar-y scrollbar-light">
      <slot name="content"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import GlobalActionWrapper from '@/components/action/GlobalActionWrapper.vue';

export default {
  name: 'tree-content',
  components: {
    GlobalActionWrapper
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.page-content-outer {
  position: relative;
  .c {
    position: absolute;
    bottom: 0;
    top: 0;
    background: $--color-light;
    box-shadow: 0 10px 20px -4px rgba(16, 25, 74, 0.18);
    border-radius: 6px;
  }
  .page-tree-wrapper {
    width: 560px;
    left: 0;
    @extend .c;
  }
  .page-content-wrapper {
    width: calc(100% - 570px);
    right: 0;
    @extend .c;
  }
}
</style>

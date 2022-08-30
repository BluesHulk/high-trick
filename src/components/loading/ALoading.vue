<template>
  <div ref="loading" class="a-loading-modal">
    <div class="a-loading-container">
      <div class="a-loading-content">
        <div class="a-loading-header">
          <slot class="a-loading-header" name="header"></slot>
        </div>
        <div class="a-loading-body">
          <i class="el-icon-a-loading"></i>
          <slot></slot>
        </div>
        <div class="a-loading-footer">
          <slot class="a-loading-footer" name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'a-loading',
  methods: {
    show() {
      this.$refs.loading.style.display = 'block';
    },
    hide() {
      this.$refs.loading.style.display = 'hide';
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../styles/ui-theme.scss';
.a-loading-modal {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
}
.a-loading-container {
  position: absolute;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}
.a-loading-content {
  position: relative;
  .a-loading-header,
  .a-loading-body,
  .a-loading-footer {
  }
  .a-loading-body {
    font-size: 14px;
    text-align: center;
  }
}
</style>

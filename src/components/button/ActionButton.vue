<template>
  <div class="action-button el-button el-button--primary" @click="$emit('click')">
    <div class="float-container action-button-inner">
      <div class="action-button-img float-left" :style="{ backgroundImage: `url(${src})` }"></div>
      <div class="action-button-text float-left">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'action-button',
  props: {
    type: String
  },
  data() {
    return {
      src: ''
    };
  },
  created() {
    this.src = require(`@/assets/button/${this.type}.png`);
  }
};
</script>

<style lang="scss">
.action-button {
  height: 42px;
  width: 100px;
  text-align: left;
  padding-left: 20px;
  padding-right: 20px;
  &-inner {
    height: 22px;
    line-height: 22px;
    position: relative;
  }
  &-img {
    width: 16px;
    height: 16px;
    background-position: 0 center;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    -webkit-background-size: 16px;
    background-size: 16px;
  }
  &-text {
    margin-left: 28px;
    height: 14px;
    font-size: 14px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 2px;
  }
}
</style>

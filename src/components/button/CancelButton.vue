<template>
  <div class="cancel-button el-button text-center" @click="$emit('click')">
    {{ $$ButtonText.cancel }}
  </div>
</template>

<script>
export default {
  name: 'cancel-button'
};
</script>

<style lang="scss">
.cancel-button {
  width: 100px;
  height: 42px;
  border-radius: 24px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  border: 1px solid #b4b9cf;
  color: #b4b9cf;
  line-height: 24px;
  letter-spacing: 1px;
}
</style>

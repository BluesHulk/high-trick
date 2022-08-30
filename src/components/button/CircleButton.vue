<template>
  <div class="circle-button" @click="$emit('click')">
    <img src="../../assets/icon/add.png" />
  </div>
</template>

<script>
export default {
  name: 'circle-button',
  props: {
    type: String
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.circle-button {
  height: 42px;
  width: 42px;
  float: right;
  cursor: pointer;
  img {
    height: 100%;
    width: 100%;
  }
}
</style>

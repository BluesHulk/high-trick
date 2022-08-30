<template>
  <div
    class="image-button"
    @click="$emit('click')"
    :style="{ width: w + 'px', height: h + 'px', backgroundImage: `url(${src})` }"
  ></div>
</template>

<script>
export default {
  name: 'image-button',
  props: {
    src: String,
    width: {
      type: [String, Number],
      default: 42
    },
    height: {
      type: [String, Number],
      default: 24
    }
  },
  data() {
    return {
      w: 0,
      h: 0
    };
  },
  created() {
    this.w = parseInt(this.width, 10);
    this.h = parseInt(this.height, 10);
  }
};
</script>

<style lang="scss">
.image-button {
  margin-right: 20px;
  display: inline-block;
  background-repeat: no-repeat;
  transition: all 0.3s;
}
</style>

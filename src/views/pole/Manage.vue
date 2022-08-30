<template>
  <div class="pole-wrapper">
    <iframe src="/loopAlgorithmDemo/moreMap.html" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: 'manage'
};
</script>

<style lang="scss">
.pole-wrapper {
  position: relative;
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
    padding-bottom: 20px;
  }
}
</style>

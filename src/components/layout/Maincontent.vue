<template>
  <div class="page-content-inter">
    <h1>
      {{ name }}
    </h1>
  </div>
</template>

<script>
export default {
  name: 'content',
  components: {},
  props: ['name']
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.page-content-inter {
  position: relative;
  min-height: 45px;
  background: $--color-light;
  box-shadow: 0 10px 20px -4px rgba(16, 25, 74, 0.18);
  border-radius: 8px;
}
</style>

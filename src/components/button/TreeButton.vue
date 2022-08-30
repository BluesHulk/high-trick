<template>
  <div :class="`tree-icon-${type}`" @click="$emit('click')"></div>
</template>

<script>
export default {
  name: 'tree-button',
  props: {
    type: String
  }
};
</script>

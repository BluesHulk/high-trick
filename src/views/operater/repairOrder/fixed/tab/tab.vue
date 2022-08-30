<template>
  <div class="navtab">
    <span
      class="tab-li"
      :class="{ 'li-activate': navIndex === index }"
      v-for="(item, index) in tabArr"
      :key="item.id"
      @click="handleSelect(index, item)"
    >
      <span class="li-text">{{ item.text }}</span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ['tabArr', 'navIndex'],
  methods: {
    handleSelect(index) {
      this.$emit('handleSelect', index);
    }
  }
};
</script>

<style lang="scss" scoped>
.navtab {
  height: 42px;
  line-height: 42px;
  position: absolute;
  right: 0;
  top: 30px;
  border: 1px solid #d2daea;
  border-radius: 4px;
  .tab-li {
    position: relative;
    cursor: pointer;
    color: #d2daea;
    width: 100px;
    font-size: 16px;
    display: inline-block;
    background-color: #f6f8fc;
    text-align: center;
    .li-text {
      display: inline-block;
      height: 40px;
    }
    &:first-child {
      border-right: 1px solid #ccc;
    }
    &.li-activate {
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #3045b1;
      background-color: #ffffff;
      // position:absolute;
    }
  }
}
</style>

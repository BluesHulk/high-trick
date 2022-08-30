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
    handleSelect(index, item) {
      this.$emit('handleSelect', index, item);
    }
  }
};
</script>

<style lang="scss" scoped>
.navtab {
  height: 100px;
  line-height: 100px;
  .tab-li {
    padding: 5px;
    position: relative;
    cursor: pointer;
    color: #c6cada;
    margin-right: 40px;
    font-size: 16px;
    .li-text {
      display: inline-block;
      min-width: 80px;
      text-align: center;
    }
    &.li-activate {
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
      line-height: 24px;
      &:after {
        content: '';
        width: 100px;
        height: 3px;
        background: #3045b1;
        border-radius: 2px;
        position: absolute;
        left: 50%;
        top: 65px;
        margin-left: -50px;
      }

      // position:absolute;
    }
  }
}
</style>

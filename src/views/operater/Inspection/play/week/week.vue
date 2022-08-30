<template>
  <div>
    <ul class="week-item">
      <li v-for="(item, index) in list" :key="index" :data-index="index" @click="setListCheck(index)">
        <span :class="item.check ? 'cur' : 'curB'">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ['list'],
  methods: {
    setListCheck: function(idx) {
      this.$emit('weekChecked', idx);
      // var check = this.list[idx].check;
      // this.list[idx].check = check !== true;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.week-item {
  width: 100%;
  height: 60px;
  li {
    float: left;
    margin-right: 20px;
    span {
      cursor: pointer;
      display: inline-block;
      width: 60px;
      height: 60px;
      background: #f6f8fc;
      border-radius: 4px;
      border: 1px solid #d2daea;
      line-height: 60px;
      text-align: center;
      font-size: 12px;
      color: #747aa5;
    }
    .cur {
      color: #fff;
      background: #3045b1;
      border-radius: 4px;
      font-size: 12px;
    }
  }
}
</style>

<template>
  <div class="a-select-box" :style="{ width: w }" @click="toggleSelect">
    <div :title="value[display]" class="a-display-name show-dot">{{ model[display] }}</div>
    <div class="a-toggle-select" :class="{ 'el-icon-arrow-down': expand, 'el-icon-arrow-up': !expand }"></div>
    <div v-if="data.length" class="a-select-list scrollbar" :class="{ 'show-select': expand }">
      <div
        v-for="item in data"
        :key="item[label]"
        :title="item[display]"
        class="a-select-item show-dot"
        @click="selectItem(item)"
      >
        {{ item[display] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'a-select',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    label: String,
    display: {
      type: String,
      default: 'label'
    },
    data: Array,
    width: [String, Number]
  },
  data() {
    return {
      model: {},
      expand: false,
      w: null
    };
  },
  created() {
    this.getWidth();
    this.model = this.value;
  },
  methods: {
    toggleSelect() {
      this.expand = !this.expand;
    },
    selectItem(data) {
      this.model = data;
      this.$emit('change', data);
    },
    getWidth() {
      if (typeof this.width === 'string') {
        const w = parseFloat(this.width);
        if (Number.isFinite(w)) {
          this.w = this.width;
        } else {
          this.w = 'auto';
        }
      } else if (Number.isFinite(this.width)) {
        this.w = this.width + 'px';
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../styles/ui-theme';
.a-select-box {
  $el-icon-size: 14px;
  position: relative;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 400;
  z-index: 9;
  cursor: pointer;
  .a-display-name {
    padding: 0 30px 0 10px;
    height: inherit;
    border-radius: 3px;
  }
  .a-toggle-select {
    font-size: $el-icon-size;
    position: absolute;
    right: 1px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    //color: $-components-select-ASelect-color-1;
  }
  .a-select-list {
    width: 100%;
    max-height: 280px;
    display: none;
    -webkit-transition: all 0.2s;
    -moz-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;
    margin-top: 4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .a-select-item {
      padding: 5px 10px;
      white-space: nowrap;
      &:hover {
        cursor: pointer;
      }
    }
  }
  /*.scrollbar {
    &::-webkit-scrollbar-thumb {
      background-color: $--components-a-select-background-color-3;
      outline: $--components-a-select-outline-1;
      border-color: $--components-a-select-border-color-1;
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: $--components-a-select--webkit-box-shadow-1;
      background-color: $--components-a-select-background-color-4;
    }
    &::-webkit-scrollbar-track-piece {
      background-color: $--components-a-select-background-color-5;
    }
  }*/
  .show-select {
    display: block;
  }
}
</style>

<template>
  <div
    :style="{ paddingLeft: step + 'px' }"
    :data-string="JSON.stringify(model)"
    class="a-tree-item"
    :class="{ [`a-tree-item-${index}`]: getLevelClass(index) }"
  >
    <template v-if="model[defaultProps.children]">
      <div
        :class="{ 'a-tree-item-has-children': isFolder }"
        @click="toggle"
        @dblclick="changeType"
        class="a-tree-item-toggle a-toolbar-between"
      >
        <div>
          <div v-if="isFolder" class="a-tree-item-icon">[{{ open ? '-' : '+' }}]</div>
          <div class="a-tree-item-text">{{ model.name }}</div>
        </div>
        <div :class="getCheckedClass(model)"></div>
      </div>
      <div class="horizontal-line mb-20"></div>
    </template>
    <template v-else>
      <div class="a-tree-item-static">
        <span class="a-tree-item-text">{{ model.name }}</span>
      </div>
    </template>
    <div v-show="open" v-if="isFolder" class="a-tree-content">
      <tree-item
        :key="model.id"
        :class="model[defaultProps.children] ? 'a-tree-item-nodes' : 'is-last-node'"
        v-for="model in model[defaultProps.children]"
        :model="model"
        :step="step"
        :index="model[defaultProps.children] ? index + 1 : null"
      ></tree-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tree-item',
  props: {
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'nodes',
        label: 'name'
      })
    },
    index: Number,
    step: Number,
    model: Object,
    actionType: String
  },
  data() {
    return {
      open: false
    };
  },
  computed: {
    isFolder() {
      return this.model[this.defaultProps.children] && this.model[this.defaultProps.children].length;
    }
  },
  methods: {
    getCheckedClass(model) {
      return [
        'a-tree-item-icon',
        this.actionType === this.$$ActionType.edit ? 'tree-checked-edit' : 'tree-checked-views'
      ];
    },
    getLevelClass(index) {
      return index == null ? false : `a-tree-item-${index}`;
    },
    toggle() {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    changeType() {
      if (!this.isFolder) {
        this.$set(this.model, this.defaultProps.children, []);
        this.open = true;
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';

.is-last-node {
  display: inline-block;
  &:first-of-type {
    padding-left: 0 !important;
  }
}
.tree-checked-edit {
  width: 18px;
  height: 18px;
  background: url(../../../../assets/basic/tree-checked-edit.png) center no-repeat;
}
.tree-checked-views {
  width: 18px;
  height: 18px;
  background: url(../../../../assets/basic/tree-checked-views.png) center no-repeat;
}
.tree-unchecked {
  width: 18px;
  height: 18px;
  background: url(../../../../assets/basic/tree-unchecked.png) center no-repeat;
}
.a-tree-item-has-children {
}
.a-tree-item-icon,
.a-tree-item-text {
  display: inline-block;
}
.a-tree-item {
  .a-tree-item-text {
    height: 16px;
    font-size: 16px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: $--color-dark;
    line-height: 24px;
  }
}
.a-tree-item-0 {
  > .a-tree-item-toggle {
    margin-bottom: 40px;
  }
  > .horizontal-line {
    display: none;
  }
}
.a-tree-item-1 {
  > .a-tree-item-toggle {
    margin-bottom: 20px;
  }
}
</style>

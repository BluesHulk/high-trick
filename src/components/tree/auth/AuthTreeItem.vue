<template>
  <div class="v-tree-item" :class="getVTreeItemClass(model)">
    <!--:style="{ paddingLeft: step + 'px' }">-->
    <div
      class="inline-checkbox"
      :class="{ 'global-action-views': actionType === $$ActionType.views }"
      v-if="model[defaultProps.children].length === 0"
    >
      <el-checkbox v-model="model.checked" @change="toggleChange">{{ model.name }}</el-checkbox>
    </div>
    <div
      class="mb-40 v-tree-node-pos v-tree-node"
      :class="{ 'global-action-views': actionType === $$ActionType.views }"
      v-else-if="level === 1"
      @click="toggle"
    >
      <span class="v-tree-node-icon" :class="open ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></span>
      <span class="v-tree-node-text">{{ model.name }}</span>
      <el-checkbox v-model="model.checked" :indeterminate="model.indeterminate" @change="toggleChange"></el-checkbox>
    </div>
    <template v-else>
      <template v-if="Array.isArray(model.nodes)">
        <div
          class="mb-20 v-tree-node-pos v-tree-node"
          :class="{ 'global-action-views': actionType === $$ActionType.views }"
        >
          <el-checkbox
            v-model="model.checked"
            :indeterminate="model.indeterminate"
            @change="toggleChange"
          ></el-checkbox>
          <span class="v-tree-node-icon"></span>
          <span class="v-tree-node-text">{{ model.name }}</span>
        </div>
        <div class="horizontal-line mb-20"></div>
      </template>
      <div
        v-else
        class="v-tree-horizontal v-tree-node"
        :class="{ 'global-action-views': actionType === $$ActionType.views }"
      >
        <el-checkbox v-model="model.checked" :indeterminate="model.indeterminate" @change="toggleChange"></el-checkbox>
        <span class="v-tree-node-icon"></span>
        <span class="v-tree-node-text">{{ model.name }}</span>
      </div>
    </template>

    <!--<div :class="{ shown: open, hide: !open }">-->
    <div class="v-tree-content" :class="{ shown: open, hide: !open && level === 1 }">
      <tree-node
        :primaryKey="primaryKey"
        :action-type="actionType"
        :level="level + 1"
        v-for="(subModel, index) in model[defaultProps.children]"
        :model="subModel"
        :ids="ids"
        :key="index"
        :root="root"
        :status="itemStatus"
        :withoutParents="withoutParents"
        :options="options"
        @onChildChange="onChildChange"
      ></tree-node>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tree-node',
  props: {
    primaryKey: {
      type: String,
      required: true
    },
    actionType: {
      type: String,
      default: 'views'
    },
    level: {
      type: Number,
      default: 1
    },
    step: {
      type: Number,
      default: 20
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'nodes',
        label: 'name'
      })
    },
    treeData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // ?????????????????????
    ids: {
      type: Array,
      default: function() {
        return [];
      }
    },
    withoutParents: {
      type: Array,
      default: function() {
        return [];
      }
    },
    model: {
      type: Object,
      default: function() {
        return {};
      }
    },
    status: {
      type: Number,
      default: 0
    },
    rootStatus: {
      type: Number,
      default: 0
    },
    // ???????????????????????????????????????????????????????????????????????????????????????indeterminate??????
    root: {
      type: Array,
      default: function() {
        return [];
      }
    },
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      open: false,
      // rootItemStatus:0,
      itemStatus: 0 // ??????????????????????????????watch??????status
    };
  },
  created() {
    // ??????????????????????????????????????????
    if (this.ids.indexOf(this.model[this.primaryKey]) !== -1) {
      this.itemStatus = this.itemStatus + 1;
      this.$set(this.model, 'checked', true);
      this.$emit('onChildChange', true);
    }
    if (this.status > 0) {
      this.addChecked();
      this.itemStatus = this.itemStatus + 1;
    }
  },
  mounted() {},
  computed: {
    isFolder() {
      return this.model[this.defaultProps.children] && this.model[this.defaultProps.children].length;
    }
  },
  watch: {
    // ????????????????????????????????????????????????
    // ????????????????????????????????????????????????????????????
    status(val, old) {
      if (val > old) {
        this.addChecked();
        this.itemStatus = this.itemStatus + 1;
      } else {
        this.delChecked();
        this.itemStatus = this.itemStatus - 1;
      }
      this.setIndeterminateFun();
    }
  },
  methods: {
    getVTreeItemClass(model) {
      return [`checkbox-${this.actionType}`, !(model[this.defaultProps.children] || []).length ? 'sub-tree-all' : ''];
    },
    toggle() {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    // ???????????????????????????????????????????????????????????????
    setIndeterminateFun() {
      if (this.model[this.defaultProps.children] && this.model[this.defaultProps.children].length > 0) {
        if (this.root.indexOf(this.model[this.primaryKey]) != -1) {
          this.deleteRootChecked();
        }
        this.model.indeterminate = false;
      }
    },
    toggleChange() {
      // this.model.id???????????????????????????ID?????????ids???????????????????????????
      // ?????????????????????????????????this.model[this.primaryKey]???true????????????????????????false??????????????????
      // ????????????????????????????????????????????????
      // ????????????status,
      this.setIndeterminateFun();
      if (this.ids.indexOf(this.model[this.primaryKey]) !== -1) {
        this.delChecked();
        this.$emit('onChildChange', false);
        this.itemStatus = this.itemStatus - 1;
      } else {
        this.addChecked();
        this.$emit('onChildChange', true);
        this.itemStatus = this.itemStatus + 1;
      }
    },
    // ????????????
    addChecked() {
      const _this = this;
      if (this.ids.indexOf(this.model[this.primaryKey]) === -1) {
        // ???????????????????????????????????????
        if (!this.options.withParents) {
          if (this.model[this.defaultProps.children] && this.model[this.defaultProps.children].length == 0) {
            this.$set(_this.withoutParents, _this.withoutParents.length, _this.model[this.primaryKey]);
          }
        }
        this.$set(this.ids, this.ids.length, this.model[this.primaryKey]);
        this.$set(this.model, 'checked', true);
      }
    },
    // ???????????????
    delChecked() {
      const _this = this;
      const index = this.ids.indexOf(this.model[this.primaryKey]);
      if (index != -1) {
        this.$delete(this.ids, index);
        this.$set(this.model, 'checked', false);
      }
      // ???????????????????????????????????????
      if (!this.options.withParents) {
        if (this.model[this.defaultProps.children] && this.model[this.defaultProps.children].length == 0) {
          const key = this.withoutParents.indexOf(this.model[this.primaryKey]);
          this.$delete(_this.withoutParents, key);
        }
      }
    },
    // ???????????????
    setRootChecked() {
      if (this.root.indexOf(this.model[this.primaryKey]) === -1) {
        this.$set(this.root, this.root.length, this.model[this.primaryKey]);
        // this.rootItemStatus ++
        this.model.indeterminate = true;
      }
    },
    // ???????????????
    deleteRootChecked() {
      const idx = this.root.indexOf(this.model[this.primaryKey]);
      if (idx !== -1) {
        this.$delete(this.root, idx);
        // this.rootItemStatus --
        this.model.indeterminate = false;
      }
    },
    // ??????????????????????????????
    onChildChange(check) {
      if (this.model[this.defaultProps.children].some(val => this.root.indexOf(val[this.primaryKey]) !== -1)) {
        this.addChecked();
        this.setRootChecked();
        this.$emit('onChildChange', true);
        return;
      }
      if (check) {
        this.addChecked();
        if (this.model[this.defaultProps.children].some(val => this.ids.indexOf(val[this.primaryKey]) == -1)) {
          this.setRootChecked();
        } else {
          this.deleteRootChecked();
        }
        this.$emit('onChildChange', true);
      } else {
        // ????????????????????????child????????????ids?????????????????????????????????model???id
        if (this.model[this.defaultProps.children].some(val => this.ids.indexOf(val[this.primaryKey]) !== -1)) {
          this.setRootChecked();
        } else {
          this.delChecked();
          this.deleteRootChecked();
        }
        this.$emit('onChildChange', false);
      }
    }
  },
  components: {}
};
</script>

<style lang="scss">
.v-tree-item {
  margin-left: 50px;

  .sub-tree-all {
    //width: 134px;
    content: '';
    display: inline-block;
    clear: both;
    margin-right: 50px;

    &:first-of-type {
      padding-left: 0;
    }

    .inline-checkbox {
      float: left;
    }
  }

  .v-tree-node {
    cursor: pointer;
    .el-checkbox {
      // margin-right: 20px;
    }
  }

  .v-tree-node-pos:not(.v-tree-horizontal) {
    position: relative;

    .el-checkbox {
      position: absolute;
      right: 0;
    }
  }
}
/*
.v-tree-views {
  .el-checkbox__inner {
    background: transparent url(../../../assets/basic/tree-unchecked.png) center no-repeat;
    border-color: transparent;
  }

  .el-checkbox__input.is-checked,
  .is-checked {
    .el-checkbox__inner {
      background: url(../../../assets/basic/tree-checked-views.png) center no-repeat;
      border-color: transparent;
    }
  }
}

.v-tree-edit {
  .el-checkbox__inner {
    background: transparent url(../../../assets/basic/tree-unchecked.png) center no-repeat;
    border-color: transparent;
  }

  .el-checkbox__input.is-checked,
  .is-checked {
    .el-checkbox__inner {
      background: url(../../../assets/basic/tree-checked-edit.png) center no-repeat;
      border-color: transparent;
    }
  }
}
*/
.shown {
  display: block;
  .v-tree-item {
    .v-tree-item {
      margin-left: 0;
    }
  }
  > .v-tree-item {
    margin-bottom: 36px;
  }
}

.hide {
  display: none;
}
</style>

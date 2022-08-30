<template>
  <div class="tree-root-wrapper">
    <treenode
      :step="20"
      v-for="(model, index) in treeData"
      :model="model"
      :key="index"
      :withoutParents="withoutParents"
      :ids="ids"
      :primaryKey="primaryKey"
      :options="treeOptions"
      :action-type="actionType"
    >
    </treenode>
  </div>
</template>
<script>
import tree from './AuthTreeItem';

export default {
  name: 'auth-tree',
  model: {
    prop: 'ids',
    event: 'change'
  },
  props: {
    primaryKey: {
      type: String,
      required: true
    },
    level: Number,
    treeData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    actionType: {
      type: String,
      default: 'views'
    },
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
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      defaultOptions: {
        withParents: true
      },
      treeOptions: {}
    };
  },
  created() {
    this.initOptions();
  },
  mounted() {},
  watch: {},
  methods: {
    initOptions() {
      this.treeOptions = Object.assign({}, this.defaultOptions, this.options);
    }
  },
  components: {
    treenode: tree
  }
};
</script>

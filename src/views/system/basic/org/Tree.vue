<template>
  <el-tree
    ref="pTree"
    highlight-current
    @node-click="nodeClick"
    :data="treeNodes"
    node-key="value"
    default-expand-all
    :expand-on-click-node="false"
  >
    <div class="custom-tree-node float-container" slot-scope="{ node, data }">
      <div class="float-left">
        <span>{{ data.label }}</span>
        <span class="node-count">{{ data.staffNum }}</span>
      </div>
      <div class="float-right">
        <TreeButton :type="$$ActionType.edit" @click.native.stop="edit(data, node)"></TreeButton>
        <TreeButton :type="$$ActionType.delete" @click.native.stop="del(data, node)"></TreeButton>
      </div>
    </div>
  </el-tree>
</template>

<script>
import TreeButton from '@/components/button/TreeButton.vue';
import { organizeQueryFuncTree } from '@/api/rbac';

export default {
  name: 'org-tree',
  components: {
    TreeButton
  },
  props: {
    currentNode: Object
    // nodes: Array,
    // nodeKey: {
    //   type: String,
    //   default: 'id'
    // }
  },
  data() {
    return {
      treeNodes: []
    };
  },
  mounted() {
    this.load();
    this.$emit('init', this.$refs.pTree);
  },
  methods: {
    load() {
      organizeQueryFuncTree().then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.treeNodes = JSON.parse(
            JSON.stringify(object)
              .replace(/"name":/g, '"label":')
              .replace(/"id":/g, '"value":')
              .replace(/"nodes":/g, '"children":')
          );
          this.$emit('data', this.treeNodes);
          this.selectNode();
        }
      });
    },
    selectNode(node) {
      this.$nextTick(() => {
        node = node || this.currentNode || this.treeNodes[0];
        this.$refs.pTree.setCurrentKey(node.value);
        this.$emit('selected', this.$refs.pTree.getCurrentNode());
      });
    },
    nodeClick(node) {
      this.$emit('selected', node);
    },
    edit(data, node) {
      console.log(data, node);
      this.$emit('edit', data, node);
    },
    del(data, node) {
      this.$emit('del', data, node);
    }
  }
};
</script>

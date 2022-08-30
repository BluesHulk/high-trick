<template>
  <el-tree
    ref="pTree"
    highlight-current
    :data="treeNodes"
    node-key="value"
    :default-expand-all="defaultExpandAll"
    :default-expanded-keys="defaultExpandedKeys"
    :expand-on-click-node="false"
  >
    <div @click="onClick(node, data, $event)" class="custom-tree-node float-container" slot-scope="{ node, data }">
      <div class="float-left">
        <div class="float-left" style="max-width: 280px">
          <el-tooltip class="show-dot" effect="dark" :content="data && data.label" placement="top">
            <div>{{ data && data.label }}</div>
          </el-tooltip>
        </div>
        <div class="float-left node-count">{{ data.staffNum }}</div>
      </div>
      <div class="float-right">
        <TreeButton data-id="edit" :type="$$ActionType.edit"></TreeButton>
        <TreeButton data-id="delete" :type="$$ActionType.delete"></TreeButton>
      </div>
    </div>
  </el-tree>
</template>

<script>
import TreeButton from '@/components/button/TreeButton.vue';

export default {
  name: 'tree',
  props: {
    defaultExpandedKeys: Array,
    defaultExpandAll: Boolean,
    currentNode: Object,
    loader: {
      type: Function,
      required: true
    }
  },
  components: {
    TreeButton
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
      return new Promise(resolve => {
        this.loader().then(res => {
          const { code, object } = res;
          if (code === 200) {
            this.treeNodes = JSON.parse(
              JSON.stringify(object)
                .replace(/"name":/g, '"label":')
                .replace(/"id":/g, '"value":')
                .replace(/"nodes":/g, '"children":')
            );
            this.$emit('data', this.treeNodes);
            // this.selectNode();
            resolve(this.treeNodes, res);
          }
        });
      });
    },
    selectNode(node) {
      this.$nextTick(() => {
        if (node) {
          node.label = node.name;
          node.value = node.id;
        }
        node = node || this.currentNode || this.treeNodes[0];
        this.$refs.pTree && this.$refs.pTree.setCurrentKey(node.value);
        this.$emit('selected', node || this.$refs.pTree.getCurrentNode());
      });
    },
    selectFirstNode() {
      this.$nextTick(() => {
        const node = this.treeNodes[0];
        this.$refs.pTree && this.$refs.pTree.setCurrentKey(node.value);
        this.$emit('selected', this.$refs.pTree.getCurrentNode());
      });
    },
    onClick(node, data, event) {
      // console.log(node, data, event);
      const { target } = event;
      const { dataset } = target;
      // console.log(node, data, event, target);
      switch (dataset.id) {
        case 'edit':
          this.edit(data, node);
          break;
        case 'delete':
          this.del(data, node);
          break;
        default:
          this.nodeClick(data);
      }
    },
    nodeClick(data) {
      this.$emit('node-click', data);
    },
    edit(data, node) {
      this.$emit('edit', data, node);
    },
    del(data, node) {
      this.$emit('del', data, node);
    }
  }
};
</script>

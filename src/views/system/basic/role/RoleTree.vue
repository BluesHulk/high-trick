<template>
  <el-tree
    class="role-tree custom-tree-wrapper"
    ref="pTree"
    highlight-current
    @node-click="nodeClick"
    :data="treeNodes"
    :props="defaultProps"
    node-key="value"
    default-expand-all
    :expand-on-click-node="false"
  >
    <div class="role-tree-node" slot-scope="{ node, data }" style="width: 100%">
      <template v-if="data.nodes">
        <div class="a-toolbar-between mb-20">
          <div class="" style="height: 30px; line-height: 30px">{{ data.name }}-------------</div>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            全选
          </el-checkbox>
        </div>
        <template v-if="!data.nodes[0].nodes">
          <div class="horizontal-line mb-20"></div>
          <div class="a-toolbar-between">
            <el-checkbox-group v-model="checkedNodes" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="node in data.nodes" :label="node.name" :key="node.id">{{ node.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
      </template>
    </div>
  </el-tree>
</template>

<script>
import { funcQueryFuncTree } from '@/api/rbac';

export default {
  name: 'role-tree',
  data() {
    return {
      treeNodes: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      checkAll: false,
      checkedNodes: ['上海', '北京'],
      nodes: ['上海', '北京', '广州', '深圳'],
      isIndeterminate: true
    };
  },
  created() {
    this.loadTreeData();
  },
  methods: {
    loadTreeData() {
      funcQueryFuncTree().then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.treeNodes = object;
        }
      });
    },
    handleCheckAllChange(val) {
      this.checkedNodes = val ? this.nodes : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.nodes.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.nodes.length;
    },
    nodeClick(node) {
      this.$emit('selected', node);
    }
  }
};
</script>

<style lang="scss">
.role-tree {
  .el-tree-node__content {
    align-items: start;
  }
  .el-tree-node__content {
    height: auto !important;
    padding-top: 30px;
    padding-bottom: 30px;
  }
}
</style>

<template>
  <div class="other-assets">
    <div class="tab-title">其他资产目录</div>
    <el-tree
      :indent="30"
      inline
      level
      ref="tree"
      :data="treeData"
      :expand-on-click-node="true"
      :class="CheckboxClass"
      @node-click="nodeClick"
      @node-expand="nodeExpand"
      :load="loadNode"
      lazy
    >
      <span :class="getNodeClass(node, data)" slot-scope="{ node, data }">
        <!-- 第三级为资产节点 -->
        <a-el-checkbox
          v-if="node.level === 3"
          :class="getCheckboxClass(data)"
          :disabled="isViews"
          @change="changeCheckbox(data)"
          v-model="data.checked"
        ></a-el-checkbox>
        <span class="node-text">{{ data.name }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { resourceConfigCategoryQuery, resourceXAssetDataQueryXassetList } from '@/api/resource';

// 因为这种树的数据是分多个接口返回的，当切换到非设备的tab后再次切换回来，之前勾选的状态会丢失，

export default {
  name: 'asset',
  props: {
    currentNode: Object,
    currentAuth: Object,
    actionType: String
  },
  data() {
    return {
      records: [],
      treeData: [],
      treeList: [],
      defaultCheckedKeys: []
    };
  },
  computed: {
    CheckboxClass() {
      return [`checkbox-` + this.actionType];
    },
    isViews() {
      return this.actionType === this.$$ActionType.views;
    },
    isAdd() {
      return this.actionType === this.$$ActionType.add;
    },
    isEdit() {
      return this.actionType === this.$$ActionType.edit;
    }
  },
  methods: {
    fixStyle() {
      this.$nextTick(() => {
        $.each(
          $('.the-last-node')
            .parent()
            .parent()
            .parent(),
          (index, el) => {
            el.classList.add('the-last-node-wrapper');
          }
        );
        $.each(
          $('.the-last-node')
            .parent()
            .parent()
            .siblings(),
          (index, el) => {
            el.classList.add('float-left');
          }
        );
      });
    },
    getNodeClass(node, data) {
      // 树只有三级，当第三级，节点横向展示
      return [`custom-tree-node`, node.level === 3 ? `the-last-node` : `device-tree-${node.level}-node`];
    },
    nodeClick(data) {
      this.fixStyle();
      this.fixTreeNodeWrapperStyle();
    },
    nodeExpand(data, node, instance) {
      this.fixStyle();
      this.fixTreeNodeWrapperStyle();
    },
    loadNode(node, resolve) {
      if (node.level > 2) {
        this.fixTreeNodeWrapperStyle();
        return resolve([]);
      }
      if (node.level === 1) {
        this.$$ALoading.show();
        resourceConfigCategoryQuery({ parentId: node.data.id, type: 'XASSET' })
          .then(res => {
            const { code, object } = res;
            if (code === 200) {
              resolve(object);
              this.$nextTick(() => {
                // 为level-2-node的父级元素设置样式
                this.fixTree2NodeWrapperStyle();
              });
            }
          })
          .finally(() => {
            this.$$ALoading.close();
          });
      }
      if (node.level === 2) {
        this.$$ALoading.show();
        resourceXAssetDataQueryXassetList({ categoryId: node.data.id })
          .then(res => {
            const { code, object } = res;
            if (code === 200) {
              resolve(object);
              // 得到的object的checked并不是可以直接使用的，权限是通过/rbac/dataAuth/query/接口拿到的，需要根据权限接口来渲染
              const XASSET = (this.currentAuth || {}).XASSET || [];
              for (let i = 0; i < object.length; i++) {
                const p = object[i];
                for (let j = 0; j < XASSET.length; j++) {
                  const id = XASSET[j];
                  if (id === p.id) {
                    this.$set(object[i], 'checked', true);
                  }
                }
              }
              this.toRecords(object);
              this.fixStyle();
            }
          })
          .finally(() => {
            this.$$ALoading.close();
          });
      }
    },
    fixTreeNodeWrapperStyle() {
      this.fixStyle();
      this.fixTree1NodeWrapperStyle();
      this.fixTree2NodeWrapperStyle();
    },
    fixTree1NodeWrapperStyle() {
      this.$nextTick(() => {
        // 为level-1-node的父级元素设置样式
        $.each($('.device-tree-1-node').parent(), (index, el) => {
          el.classList.add('device-tree-1-node-wrapper');
        });
      });
    },
    fixTree2NodeWrapperStyle() {
      this.$nextTick(() => {
        // 为level-2-node的父级元素设置样式
        $.each($('.device-tree-2-node').parent(), (index, el) => {
          el.classList.add('device-tree-2-node-wrapper');
        });
      });
    },
    changeCheckbox(row) {
      console.log(row);
    },
    getCheckboxClass(model) {
      return [`checkbox-${this.actionType}`];
    },
    toRecords(array) {
      // 保存所有的第三级节点数据
      const list = this.records.concat(array);
      const map = {};
      for (let i = 0; i < list.length; i++) {
        map[list[i].id] = list[i];
      }
      this.records = Object.values(map);
    },
    renderChecked() {
      const XASSET = (this.currentAuth || {}).XASSET || [];
      if (XASSET.length) {
        for (let i = 0; i < this.records.length; i++) {
          const p = this.records[i];
          for (let j = 0; j < XASSET.length; j++) {
            const id = XASSET[j];
            if (id === p.id) {
              this.$set(this.records[i], 'checked', true);
            }
          }
        }
      } else {
        for (let i = 0; i < this.records.length; i++) {
          this.$set(this.records[i], 'checked', false);
        }
      }
    },
    loadData(params) {
      this.treeData = [];
      // 加载一级节点
      return resourceConfigCategoryQuery(params).then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.treeData = object;

          this.$nextTick(() => {
            this.fixTree1NodeWrapperStyle();
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.other-assets {
  .tab-title {
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: $--color-dark;
  }
  .the-last-node-wrapper {
    overflow: hidden;
    padding-bottom: 16px;
    .el-tree-node {
      padding-bottom: 28px;
    }
    .el-tree-node__expand-icon {
      display: none;
    }
    .el-tree-node__content {
      //padding-left: 66px !important;
      margin-left: 6px;
    }
    .the-last-node {
      position: relative;
      padding-left: 34px;
      .a-el-checkbox {
        position: absolute;
        top: 55%;
        left: 0;
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
      }
    }
    .is-expanded {
      float: left !important;
      width: 233px !important;
    }
    .float-left {
      float: left;
      width: 233px !important;
    }
  }
  .el-tree {
    padding-left: 49px;
  }
  .el-tree-node__content:hover {
    background-color: transparent;
  }
  .device-tree-1-node-wrapper {
    padding-top: 40px;
    padding-bottom: 40px;
    height: 16px;
    line-height: 16px;
    .node-text {
      font-size: 16px;
      font-weight: 500;
      color: $--color-dark;
    }
  }
  .device-tree-2-node-wrapper {
    height: 16px;
    padding-bottom: 40px;
    overflow: hidden;
    position: relative;
    &:hover {
      background-color: transparent;
    }
    .node-text {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: $--color-dark;
    }
  }
  .is-expanded {
    > .device-tree-2-node-wrapper {
      &:after {
        content: '';
        display: block;
        position: absolute;
        height: 1px;
        background-color: rgba(229, 233, 243, 1);
        bottom: 20px;
        left: 66px;
        width: 100%;
      }
    }
  }
}
</style>

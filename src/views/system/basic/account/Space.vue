<template>
  <div class="space">
    <div class="tab-title">空间目录</div>
    <el-tree :indent="30" inline level ref="tree" :data="treeData" :props="defaultProps" lazy :load="loadNode">
      <span :class="getNodeClass(node, data)" slot-scope="{ node, data }">
        <!-- 第三级为设备节点 -->
        <a-el-checkbox
          v-if="node.level !== 1 && data.childCount == 0"
          :class="getCheckboxClass(data)"
          :disabled="isViews"
          v-model="data.checked"
        ></a-el-checkbox>
        <span class="node-text">{{ data.name }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { resourceSpaceDataQuerySpaceList } from '@/api/resource';

// 因为这种树的数据是分多个接口返回的，当切换到非设备的tab后再次切换回来，之前勾选的状态会丢失，

export default {
  name: 'space',
  props: {
    currentNode: Object,
    currentAuth: Object,
    actionType: String
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: (data, node) => {
          if (data.childCount == 0) {
            return true;
          }
        }
      },
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
  mounted() {},
  methods: {
    getCheckboxClass(model) {
      return [`checkbox-${this.actionType}`];
    },
    fixTreeNodeWrapperStyle() {
      this.fixStyle();
      this.fixTree1NodeWrapperStyle();
      this.fixTree2NodeWrapperStyle();
    },
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
        $.each($('.the-last-node-wrapper'), function(index, el) {
          // let width = '<style>.space .the-last-node-wrapper:after{left:'+parseFloat($(this).find('.el-tree-node__content')[0].style.paddingLeft+6)+'px}</style>';
          const num = parseFloat($(this).find('.el-tree-node__content')[0].style.paddingLeft) + 6;
          console.log(num);
          //  $(this).append(width)
          $(this).css({ 'border-top': '1px solid rgba(229, 233, 243, 1)', 'margin-left': num + 'px' });
          $(this)
            .children(':nth-child(odd)')
            .css('margin-left', -num + 'px');
        });
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
      return [`custom-tree-node`, node.level !== 1 && data.childCount == 0 ? `the-last-node` : ``];
    },
    fixTree1NodeWrapperStyle() {
      this.$nextTick(() => {
        // 为level-1-node的父级元素设置样式
        $.each($('.el-tree-node__content'), (index, el) => {
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
    loadData() {
      this.treeData = [];
      resourceSpaceDataQuerySpaceList({ parentId: 0 }).then(res => {
        const { success, object } = res;
        if (success) {
          object.map(item => {
            item.label = item.name;
          });
          this.treeData = object;
          this.$nextTick(() => {
            this.fixTree1NodeWrapperStyle();
          });
        }
      });
    },
    loadNode(node, resolve) {
      if (node.data.childCount == 0) {
        return resolve([]);
      }

      if (node.data.childCount != 0) {
        resourceSpaceDataQuerySpaceList({ parentId: node.data.id }).then(res => {
          const { success, object } = res;
          if (success) {
            object.map(item => {
              item.label = item.name;
              if (item.childCount == 0) {
                this.$nextTick(() => {
                  // this.fixStyle();
                  this.fixTreeNodeWrapperStyle();

                  // document.styleSheets[0].addRule('.space .the-last-node-wrapper:after', 'left:'+(36+(node.level-1)*30)+'px');
                });
              }
            });
            return resolve(object);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.space {
  .is-leaf {
    .el-tree-node_expand-icon {
      display: none；;
    }
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
}
.space {
  .tab-title {
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: $--color-dark;
  }
  .the-last-node-wrapper {
    // &:after {
    //     content: '';
    //     display: block;
    //     position: absolute;
    //     height: 1px;
    //     background-color: rgba(229, 233, 243, 1);
    //     top: 0px;
    //     left: 36px;
    //     width: 100%;
    //   }
    //padding-bottom:20px;
    position: relative;
    overflow: hidden;
    .el-tree-node {
      //padding-bottom: 28px;
    }
    .el-tree-node__expand-icon {
      display: none;
    }
    .el-tree-node__content {
      //padding-left: 66px !important;
      padding-top: 20px;
      padding-bottom: 8px;
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
    .is-focusable {
      padding-top: 6px;
      float: left;
      width: 233px !important;
    }
  }
  .el-tree {
    padding-left: 49px;
    padding-bottom: 20px;
    margin-top: 20px;
  }
  .el-tree-node__content:hover {
    background-color: transparent;
  }
  .device-tree-1-node-wrapper {
    padding-top: 20px;
    padding-bottom: 20px;
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

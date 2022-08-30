<template>
  <div>
    <div class="ckall">
      <div class="chooseAll">
        <div class="all-checked-box" :class="allCheckboxClass" @click="checkAll"></div>
        <span>全选</span>
      </div>
      <span class="dialog-footer-auto">
        <el-button class="cancleDialog" @click="backCancle">取 消</el-button>
        <el-button class="confimDialog" @click="saveSet" type="primary">保存</el-button>
      </span>
    </div>

    <div class="treeBox">
      <a-el-tree
        :indent="30"
        inline
        level
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :expand-on-click-node="false"
        :class="CheckboxClass"
        @check-change="onCheckChange"
      >
        <span class="custom-tree-node" slot-scope="{ data }">
          <span>{{ data.label }}</span>
        </span>
      </a-el-tree>
    </div>
  </div>
</template>

<script>
// import AuthTree from '@/components/tree/auth/AuthTree.vue';

import { queryByDeviceCategory, orderGenerateRuleAdd } from '@/api/order';
import { mapGetters } from 'vuex';

export default {
  name: 'org',
  components: {},
  computed: {
    CheckboxClass() {
      return [`checkbox-` + this.actionType];
    },
    // allCheckboxClass() {
    //   return this.getAllCheckboxClass();
    // },
    ...mapGetters(['GlobalActionType']),
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
  data() {
    return {
      checked: false,
      allCheckboxClass: '',
      treeData: [],
      treeList: [],
      defaultCheckedKeys: [],
      actionType: 'edit',
      currentNode: {}, // 当前选中的树节点
      size: 50,
      primaryKey: 'id'
    };
  },
  watch: {
    actionType() {},
    defaultCheckedKeys() {
      this.allCheckboxClass = this.getAllCheckboxClass();
      console.log(this.allCheckboxClass);
    },
    initId() {
      this.queryByDeviceCategory();
    }
  },
  props: ['initId', 'isMessageAuto'],
  created() {
    this.queryByDeviceCategory();
  },
  mounted() {
    // this.loadTreeData();
  },
  methods: {
    saveSet() {
      debugger;
      const saveList = this.getCheckedNodes().map(item => {
        return {
          deviceCategoryId: item.typeId,
          deviceCategoryName: item.typeName,
          deviceTypeId: item.parentId,
          deviceTypeName: item.parentName,
          faultTypeId: item.id,
          faultTypeName: item.label
        };
      });
      console.log(saveList);
      orderGenerateRuleAdd({
        deviceCategoryId: this.initId.id,
        records: saveList
      })
        .then(res => {
          const { code, message } = res;
          if (code == 200) {
            this.$message.success(message || '配置成功');
          } else {
            this.$message.error(message || '配置失败');
          }
        })
        .finally(() => {
          this.$emit('isMessageAuto', 2);
        });
    },
    queryByDeviceCategory() {
      queryByDeviceCategory({
        deviceCategoryId: this.initId.id
      }).then(res => {
        const { object, code } = res;
        if (code == 200) {
          var children = [];
          const list = object.map(item => {
            children = item.deviceFaultTypes.map(it => {
              return {
                id: it.id,
                label: it.name,
                parentId: item.id,
                parentName: item.name,
                checked: it.checked,
                typeId: this.initId.id,
                typeName: this.initId.text
              };
            });
            return {
              id: item.id,
              label: item.name,
              children: children,
              isparent: true
            };
          });
          this.treeData = this.upgrade(list);

          this.treeList = this.getTreeList(list);
          this.defaultCheckedKeys = this.getLastNodes();
        }
      });
    },
    backCancle() {
      this.$emit('backCancle', 1);
    },
    onCheckChange(data, checked) {
      this.allCheckboxClass = this.getAllCheckboxClass();
    },
    upgrade(array) {
      const fn = (arr, grade) => {
        for (let i = 0; i < arr.length; i++) {
          const it = arr[i];
          it.grade = grade + 1;
          it.disabled = this.isViews;
          if (it.children) {
            fn(it.children, it.grade);
          }
        }
      };
      for (let i = 0; i < array.length; i++) {
        const td = array[i];
        td.grade = 1;
        td.disabled = this.isViews;
        if (td.children && td.children.length) {
          fn(td.children, td.grade);
        }
      }
      return array;
    },
    getAllCheckboxClass() {
      debugger;
      const editable = true;
      const sl = this.defaultCheckedKeys.length;
      if (editable) {
        const checkedNodes =
          this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes() : this.defaultCheckedKeys;
        if (!checkedNodes.length || !this.treeList.length) return [`${this.actionType}-unchecked`];
        if (this.treeList.length > checkedNodes.length) {
          return [`${this.actionType}-half`];
        }
        return [`${this.actionType}-checked`];
      }
      if (this.$refs.tree) {
        const checkedNodes = this.$refs.tree.getCheckedNodes() || this.defaultCheckedKeys;
        const half = this.$refs.tree.getHalfCheckedKeys();
        if (!half.length && !checkedNodes.length) return [`${this.actionType}-unchecked`];
        return [`${this.actionType}-checked`];
      }
      if (!sl) return [`${this.actionType}-unchecked`];
      return [`${this.actionType}-half`];
    },
    checkAll() {
      this.defaultCheckedKeys = this.defaultCheckedKeys.length ? [] : this.getLastNodesALL();
      this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
    },

    getTreeList(tree) {
      const list = [];
      for (const i in tree) {
        const node = tree[i];
        list.push(node.id);
        if (node.children && node.children.length !== 0) {
          this.toListDF(node.children, list); // 遍历子树,并加入到list中.
        }
      }
      return list;
    },
    toListDF(tree, list) {
      for (const i in tree) {
        const node = tree[i];
        list.push(node.id);
        if (node.children && node.children.length !== 0) {
          this.toListDF(node.children, list);
        }
      }
    },
    getLastNodes() {
      // 默认是否选中 用数据内enable判断
      const res = [];
      const fn = arr => {
        for (let i = 0; i < arr.length; i++) {
          const ii = arr[i];
          if (Array.isArray(ii.children)) {
            if (ii.children.length > 0) {
              for (let j = 0; j < ii.children.length; j++) {
                if (ii.children[j].checked) {
                  res.push(ii.children[j].id);
                }
              }
            }
            // fn(ii.children);
          }
        }
      };
      fn(this.treeData.concat());
      console.log(res);
      return res;
    },
    getLastNodesALL() {
      const res = [];
      const fn = arr => {
        for (let i = 0; i < arr.length; i++) {
          const ii = arr[i];
          if (Array.isArray(ii.children)) {
            fn(ii.children);
          } else {
            res.push(ii[this.primaryKey]);
          }
        }
      };
      fn(this.treeData.concat());
      return res;
    },
    getCheckedNodes() {
      const nodes = this.$refs.tree.getCheckedNodes();
      const keys = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node.children) {
          keys.push(node);
        }
      }
      return keys;
    }
  }
};
</script>

<style lang="scss" scope>
@import '@/styles/ui-theme';
.treeBox {
  padding: 0 30px;
  .a-el-tree {
    .a-el-tree-node {
      &.level-1-node {
        margin-left: 30px;
        position: relative;
        box-shadow: 0px 10px 20px -4px rgba(16, 25, 74, 0.18);
        border-radius: 6px;
        margin-bottom: 20px;
        border: 1px solid rgba(210, 218, 234, 0.56);
        min-width: 98%;
        .a-el-tree-node__content {
          background: #f6f8fc;
          border-radius: 0px 0px 4px 4px;
          height: 68px;
          line-height: 68px;
          .a-el-checkbox {
            margin-left: 30px;
          }
          .custom-tree-node {
            color: #3045b1;
            font-size: 16px;
            font-weight: 600;
            margin-left: 16px;
          }
        }

        .a-el-tree-node__expand-icon {
          position: absolute;
          right: 30px;
          top: 23px;
          width: 24px;
          height: 24px;
          background: url(../../../../../assets/select/select-bottom.png) center no-repeat;
          cursor: pointer;
          &.expanded {
            background: url(../../../../../assets/select/select-top.png) center no-repeat;
            transform: rotate(0deg);
          }
          &::before {
            content: '';
          }
        }
      }

      .a-el-tree-node__children {
        width: 100%;
        background: #fff;
        .a-el-tree-node {
          width: 180px;
          height: 30px;
          margin-top: 14px;
          margin-bottom: 14px;
          margin-right: 20px;
          .a-el-tree-node__content {
            padding: 0 !important;
            line-height: 1;
          }
        }
        .level-2-node {
          .a-el-tree-node__content {
            background: #fff;
            height: 30px;
            .custom-tree-node {
              font-size: 14px;
              font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
              font-weight: 400;
              color: #0f1736;
            }
          }
          .a-el-tree-node__expand-icon {
            display: none;
          }
        }
      }
    }
  }
}
.ckall {
  padding: 5px 86px;
  position: relative;
  .el-checkbox {
    margin-top: 40px;
  }
  .chooseAll {
    display: flex;
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
    span {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .all-checked-box {
    width: 18px;
    height: 18px;
    background-repeat: no-repeat;
    border: 1px solid #ccc;
    margin-top: 16px;
  }
  .all-checked-box.edit-unchecked {
    background-image: url($--unchecked-edit);
    border: none;
  }
  .all-checked-box.edit-checked {
    background-image: url($--checked-edit);
    border: none;
  }
  .all-checked-box.edit-half {
    background-image: url($--half);
    border: none;
  }
  .all-checked-box.views-unchecked {
    background-image: url($--unchecked-views);
  }
  .all-checked-box.views-checked {
    background-image: url($--checked-views);
    border: none;
  }
  .all-checked-box.views-half {
    background-image: url($--half);
    border: none;
  }
}
.dialog-footer-auto {
  height: 100px;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0px;
  right: 40px;
  margin-top: 20px;
  .cancleDialog {
    width: 100px;
    height: 42px;
    border-radius: 24px;
    border: 1px solid #b4b9cf;
    margin-right: 20px !important;

    span {
      width: 34px;
      height: 16px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #b4b9cf;
      letter-spacing: 1px;
    }
  }

  .confimDialog {
    width: 100px;
    height: 42px;
    background: #3045b1;
    border-radius: 24px;

    span {
      width: 34px;
      height: 16px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #ffffff;
      letter-spacing: 1px;
    }
  }
}
</style>

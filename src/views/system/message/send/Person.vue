<template>
  <el-dialog
    class="send-person-dialog"
    :close-on-click-modal="false"
    width="1064px"
    title="自定义发送（选择人员）"
    :visible="visible"
    :before-close="cancel"
  >
    <div class="person-tree scrollbar scrollbar-y scrollbar-light">
      <el-tree
        ref="pTree"
        highlight-current
        @node-click="nodeClick"
        :data="treeNodes"
        :props="defaultProps"
        node-key="value"
        default-expand-all
        :expand-on-click-node="false"
      >
        <div
          class="person-tree-node"
          :class="{ 'checked-node': currentNodeId === data.id }"
          slot-scope="{ node, data }"
          style="width: 100%"
        >
          <div class="person-name" v-if="data.nodes">{{ data.name }}</div>
          <div v-else class="a-toolbar-between">
            <div class="person-name">{{ data.name }}</div>
            <div
              v-if="!data.authCode"
              style="height: 30px; line-height: 30px"
              :class="{ 'unchecked-person': currentNodeId !== data.id, 'checked-person': currentNodeId === data.id }"
            ></div>
          </div>
        </div>
      </el-tree>
    </div>
    <div class="staff-wrapper checkbox-edit">
      <div class="float-container staff-header" style="margin-right: 46px;">
        <div class="float-left">
          <el-tooltip class="show-dot" effect="dark" :content="currentNode && currentNode.name" placement="top">
            <div class="node-name">{{ currentNode.name }}</div>
          </el-tooltip>
        </div>
        <div class="float-right">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            全选
          </el-checkbox>
        </div>
      </div>
      <div class="staff-checkbox-wrapper scrollbar scrollbar-y scrollbar-light">
        <el-checkbox-group @change="handleItemChange" class="staff-checkbox-list" v-model="checkedIds">
          <el-tooltip
            v-for="(val, index) in nodeMap[currentNodeId]"
            :key="index"
            effect="dark"
            :content="val.name"
            placement="top"
          >
            <el-checkbox :label="val.id" name="named">
              <div style="max-width: 70px" class="show-dot">{{ val.name }}</div>
            </el-checkbox>
          </el-tooltip>
        </el-checkbox-group>
      </div>
    </div>
    <div class="selected-container">
      <div class="staff-header"><div class="node-name">已选人员</div></div>
      <div class="selected-list scrollbar scrollbar-y scrollbar-light">
        <div class="selected-list-item" v-for="item in checkedList" :key="item.id">
          <div class="selected-list-item-text text-center">{{ item.name }}</div>
          <div class="selected-close el-icon-close text-center" @click="delItem(item)"></div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <PrimaryButton @click="submit">确认发送</PrimaryButton>
    </div>
  </el-dialog>
</template>

<script>
import { organizeQueryFuncTree, organizeQueryNodeContainStaff } from '@/api/rbac';

import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';

import { uniqueArray } from '@/utils/utils';

// import Message from '@/classes/Message';

export default {
  name: 'person',
  components: {
    CancelButton,
    PrimaryButton
  },
  props: {
    visible: Boolean
  },
  data() {
    return {
      checkedList: [],
      nodeMap: {}, // 记录节点数据
      checkAll: false,
      isIndeterminate: false,
      checkedIds: [],
      treeNodes: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      currentNode: {},
      currentNodeId: null
    };
  },
  created() {
    this.load();
  },
  methods: {
    handleItemChange(val) {
      console.log(val);
      // 获取当前节点下的所有人员
      const nodes = this.nodeMap[this.currentNodeId];
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].checked = false;
      }
      // 当前被勾选的所有id
      this.checkedIds = val;
      for (let j = 0; j < val.length; j++) {
        const key = val[j];
        const it = nodes.find(ii => ii.id === key);
        if (it) {
          it.checked = true;
        }
      }
      this.checkAll = val.length === nodes.length;
      this.isIndeterminate = !!(val.length && val.length < nodes.length);
      this.renderCheckedList();
    },
    handleCheckAllChange(val) {
      // 将当前节点下的所有人员反向选中
      const nodes = this.nodeMap[this.currentNodeId];
      for (let i = 0; i < nodes.length; i++) {
        // if (nodes[i].haveAccount) continue;
        nodes[i].checked = this.checkAll;
      }
      // this.checkedIds = val ? nodes.filter(val => !val.haveAccount).map(val => val.id) : [];
      this.checkedIds = val ? nodes.map(val => val.id) : [];
      const len = this.checkedIds.length;
      this.checkAll = len === nodes.length;
      this.isIndeterminate = !!(len && len < nodes.length);
      this.renderCheckedList();
    },
    renderCheckedList() {
      const list = [];
      for (const p in this.nodeMap) {
        const values = this.nodeMap[p];
        const it = values.filter(val => val.checked);
        list.push(...it);
      }
      this.checkedList = list;
    },
    async load() {
      const res = await organizeQueryFuncTree();
      const { code, object } = res;
      if (code === 200) {
        if (Array.isArray(object) && object[0]) {
          this.treeNodes = object;
          await this.nodeClick(object[0]);
        }
      }
    },
    async nodeClick(data) {
      // if (Object.keys(data).includes('haveAccount')) return;
      this.$$ALoading.show();
      const result = await organizeQueryNodeContainStaff({ id: data.id, size: data.staffNum });
      this.$$ALoading.close();
      const { code, object } = result;
      if (code === 200 && object) {
        const records = object.records || [];
        if (Array.isArray(records)) {
          const arr = uniqueArray(records.concat(this.nodeMap[data.id] || []));
          this.currentNodeId = data.id;
          this.currentNode = data;
          this.nodeMap[data.id] = arr;
          this.renderChecked();
          console.log(arr, this.nodeMap);
        }
      }
    },
    renderChecked() {
      // 获取当前节点下的所有人员
      const nodes = this.nodeMap[this.currentNodeId];
      // 获取被勾选的数据
      // this.checkedIds = nodes.filter(val => !val.haveAccount && val.checked).map(val => val.id);
      this.checkedIds = nodes.filter(val => val.checked).map(val => val.id);
      // 是否勾选了全部
      const len = this.checkedIds.length;
      this.checkAll = len && len === nodes.length;
      // 是否半选
      this.isIndeterminate = !!(len && len < nodes.length);
    },
    delItem(data) {
      // 重置
      for (const p in this.nodeMap) {
        const nodes = this.nodeMap[p];
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].id === data.id) {
            nodes[i].checked = false;
          }
        }
      }
      this.renderChecked();
      this.renderCheckedList();
    },
    submit() {
      this.$emit('selected', this.checkedList);
    },
    cancel() {
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.send-person-dialog {
  $tw: 354px;
  .el-dialog {
    position: relative;
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .person-tree {
    width: $tw;
    position: absolute;
    top: 85px;
    bottom: 0;
    background-color: $--color-light;
    z-index: 1;
    border-right: 1px solid rgba(210, 218, 234, 0.6);
  }
  .staff-header {
    height: 16px;
    margin-bottom: 2px;
    padding: 40px 40px 0;
  }
  .node-name {
    font-size: 16px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: $--color-dark;
    line-height: 16px;
    max-width: 280px;
    //-webkit-text-stroke: 1px #979797;
    //text-stroke: 1px #979797;
  }
  .staff-wrapper {
    margin-left: $tw;
    width: 472px;
    height: 500px;
    border-right: 1px solid rgba(210, 218, 234, 0.6);
  }
  .staff-checkbox-wrapper {
    height: 402px;
    width: 426px;
    padding-left: 40px;
    padding-top: 40px;
    .el-checkbox {
      width: 144px;
      margin-bottom: 20px;
      margin-right: 0;
      &:nth-of-type(3n) {
        width: 104px;
      }
    }
  }
  .checked-person {
    width: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAMFBMVEUAAAAyR7EyR7QxRbMwRLIwRrEwRbIvRbEvRbIwRbIvRLEwRbE1SbKeqNrx8vn///9P9ieOAAAAC3RSTlMAJD1DmZq/19ft8nDewtUAAABuSURBVAjXY2BgYHZfVWLAAASM2bt3794mAGRp7gaBSUCh2WDWTgEGtt0QkMBgDWVtZojevfvsuzu7d29l6N69+/7/v7t372BYvXv3+///du/ehcSqhspuh+vYgmQKwmSEbQgXILmKgTliVSvQpQDW0F2zs1A6/QAAAABJRU5ErkJggg==)
      center no-repeat;
  }
  .checked-node {
    .a-toolbar-between {
      .person-name {
        font-size: 12px;
        font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
        font-weight: 400;
        color: $-primary-color;
      }
    }
  }
  .person-name {
    height: 30px;
    line-height: 30px;
  }
  .unchecked-person {
    width: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAPFBMVEUAAADV3PHV2erV3ezS2uvS2+nT2+vS2uvT2uvU2+vS2urT2urY3+3m6vTm6/Ts7/fw8vn09vv19/z2+Pz4gL0aAAAADHRSTlMAJD1DmZq/19ft8vJ3eIQkAAAAcElEQVQY022QWQ7AIAgFse7i7v3v2qppo5b5nMALPIAOFxpRCw4vTPmQS8nBKzbNZWNtgxrtNWZsah/J9jkV20JUT7Kvq6qegwxtI0gweVfZAJZdFQR3Kgf6XNT/eEEdQZxKPUS8TZXTK5QG0chZ4Q0PfhCQbkl/3wAAAABJRU5ErkJggg==)
      center no-repeat;
  }

  .selected-container {
    width: 216px;
    position: absolute;
    top: 85px;
    bottom: 82px;
    right: 0;
  }
  .selected-list {
    margin-right: 40px;
    width: 130px;
    height: 362px;
    padding: 40px;
    &-item {
      width: 130px;
      min-height: 42px;
      background: $--bg-line-selected;
      border-radius: 4px;
      position: relative;
      margin-bottom: 30px;
      &-text {
        line-height: 42px;
        font-size: 14px;
        font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
        font-weight: 400;
        color: $--color-dark;
      }
    }
    .selected-close {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 16px;
      height: 16px;
      background-color: $--color-danger;
      color: $--color-light;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      cursor: pointer;
      line-height: 16px;
    }
  }
  .el-checkbox__input {
    float: left;
    top: 0;
  }
}
.el-tree-node__expand-icon {
  color: $-primary-color;
}
.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 6px 10px;
}
</style>

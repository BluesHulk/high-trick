<template>
  <el-dialog
    class="person-dialog"
    :close-on-click-modal="false"
    width="903px"
    title="选择人员"
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
            >
              <!--<el-radio v-model="radio"></el-radio>-->
            </div>
          </div>
        </div>
      </el-tree>
    </div>
    <!--<div class="person-checkbox-list radio-edit scrollbar scrollbar-y scrollbar-light">
      <div class="person-checkbox-list-title">{{ currentNode.name }}</div>
      <el-tooltip v-for="(val, index) in records" :key="index" :content="val.name" placement="top">
        <el-radio class="show-dot" v-model="radio" :label="val.id" :disabled="val.haveAccount">
          {{ val.name }}
        </el-radio>
      </el-tooltip>
    </div>-->
    <div class="person-checkbox-list checkbox-edit scrollbar scrollbar-y scrollbar-light">
      <div class="person-checkbox-list-title">{{ currentNode.name }}</div>
      <el-checkbox-group v-model="checked">
        <el-checkbox v-for="(val, index) in records" :label="val.id" :disabled="val.haveAccount" :key="index">
          {{ val.name }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <PrimaryButton @click="submit">{{ $$ButtonText.ok }}</PrimaryButton>
    </div>
  </el-dialog>
</template>

<script>
import { organizeQueryFuncTree, organizeQueryNodeContainStaff, createAccount } from '@/api/rbac';

import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';

import Message from '@/classes/Message';

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
      records: [],
      // radio: '',
      checked: [],
      treeNodes: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      currentNode: {},
      currentNodeId: null
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
          this.treeNodes = object;
          // this.$emit('data', this.treeNodes);
          this.selectNode();
        }
      });
    },
    selectNode(node) {
      this.$nextTick(() => {
        node = node || this.treeNodes[0];
        this.currentNode = node;
        this.currentNodeId = node.id;
      });
    },
    async nodeClick(data) {
      // this.radio = '';
      console.log(data);
      this.currentNode = data;
      this.currentNodeId = data.id;
      if (Object.keys(data).includes('haveAccount')) return;
      this.$$ALoading.show();
      const result = await organizeQueryNodeContainStaff({ id: data.id, size: data.staffNum });
      this.$$ALoading.close();
      const { code, object } = result;
      if (code === 200 && object) {
        this.records = object.records || [];
      }
    },
    submit() {
      // const node = this.$refs.pTree.getCurrentNode();
      // if (!node.id.includes('-')) {
      //   Message.info(`请选择一个人员`);
      //   return;
      // }
      // createAccount({ name: node.name })
      // if (!this.radio) {
      //   Message.info(`请选择一个人员`);
      //   return;
      // }
      // const rec = this.records.find(i => i.id === this.radio);
      if (this.checked.length !== 1) {
        Message.info(`请选择一个人员`);
        return;
      }
      const rec = this.records.find(i => i.id === this.checked[0]);
      createAccount({ name: rec.name })
        .then(res => {
          const { code, object } = res;
          if (code === 200) {
            this.$emit('selected', Object.assign({}, rec, { username: object }));
          }
        })
        .finally(() => {
          this.cancel();
        });
    },
    cancel() {
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss" scope>
@import '@/styles/ui-theme';
.person-dialog {
  position: fixed;
  .person-tree {
    width: 392px;
    position: absolute;
    top: 85px;
    bottom: 0;
    background-color: $--color-light;
    z-index: 1;
    border-right: 1px solid rgba(210, 218, 234, 0.6);
  }
  .person-checkbox-list {
    padding-left: 393 + 40px;
    height: 540px;
    &-title {
      margin-bottom: 40px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: $--color-dark;
      line-height: 24px;
      //-webkit-text-stroke: 1px #979797;
      //text-stroke: 1px #979797;
    }
    .el-radio {
      width: 104px;
      margin-bottom: 20px;
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
.el-tree-node__expand-icon {
  color: #3045b1;
}
.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 6px 10px;
}
</style>

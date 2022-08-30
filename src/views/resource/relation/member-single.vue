<template>
  <el-dialog
    :close-on-click-modal="false"
    width="850px"
    class="member-single"
    title="选择项目经理"
    :visible="visible"
    :before-close="cancel"
  >
    <div class="memberSingle scrollbar scrollbar-y scrollbar-light">
      <div class="memberLeft tree-content-wrapper">
        <el-tree
          class="scrollbar scrollbar-y scrollbar-light"
          :data="treeData"
          default-expand-all
          node-key="id"
          ref="tree"
          :highlight-current="true"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="nodeClick"
        >
          <div class="custom-tree-node" slot-scope="{ data }">
            {{ data.name }} <span>{{ data.staffNum }}</span>
          </div>
        </el-tree>
      </div>
      <div class="memberRight scrollbar scrollbar-y scrollbar-light">
        <div class="member">{{ nodeData.name }}</div>
        <el-radio-group v-model="memberValue">
          <el-radio v-for="item in memberChildren" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <PrimaryButton @click="submit">{{ $$ButtonText.ok }}</PrimaryButton>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import { organizeQueryFuncTree, organizeQueryNodeContainStaff } from '@/api/rbac';

export default {
  name: 'space-device',
  components: {
    CancelButton,
    PrimaryButton
  },
  props: {
    visible: Boolean
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      treeData: [],
      memberChildren: [],
      memberValue: '',
      memberId: '',
      nodeData: {}
    };
  },
  watch: {},
  created() {},
  mounted() {
    this.getTree();
  },
  methods: {
    getTree() {
      organizeQueryFuncTree().then(res => {
        if (res.code == 200) {
          // 组织树
          this.treeData = res.object;
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.treeData[0].id);
            this.nodeClick(this.treeData[0]);
          });
        }
      });
    },
    nodeClick(data) {
      this.nodeData = data;
      if (data.id == '0') {
        return;
      } else {
        organizeQueryNodeContainStaff({ id: data.id, size: data.staffNum, current: 1 }).then(res => {
          if (res.code == 200) {
            this.memberChildren = res.object.records;
          }
        });
      }
    },
    cancel() {
      this.$emit('member-data');
    },
    submit() {
      let memberData = {};
      this.memberChildren.forEach(res => {
        if (res.id == this.memberValue) {
          memberData = res;
        }
      });
      this.$emit('member-data', memberData);
    }
  }
};
</script>
<style lang="scss">
@import '@/styles/ui-theme';
.member-single {
  .el-dialog__body {
    padding: 0px 40px;
  }
  .el-tree {
    height: 420px;
    padding-right: 40px;
    overflow: auto;
  }
  .el-radio-group {
    width: 420px;
    margin-top: 15px;
    .el-radio {
      width: 32%;
      margin-right: 2%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 45px;
    }
    .el-radio:nth-of-type(3n) {
      margin-right: 0;
    }
    .el-radio__label {
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss" scope>
@import '@/styles/ui-theme';
.memberSingle {
  height: 500px;
  overflow: auto;
  .memberLeft {
    float: left;
    width: 300px;
    height: 420px;
    border-right: 1px solid #eee;
    padding: 40px 0px;
    overflow: auto;
  }
  .memberRight {
    width: 420px;
    height: 420px;
    padding: 40px 0 40px 40px;
    .member {
      font-size: 16px;
    }
  }
}
</style>

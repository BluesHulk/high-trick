<template>
  <div class="relaton-device">
    <div class="relation-title">
      关联成员
      <div class="float-right">
        <ActionButton :type="$$ActionType.add" v-if="actionType != 'views'" @click="add">
          {{ $$ButtonText.plus }}
        </ActionButton>
      </div>
    </div>
    <el-table
      ref="memberTable"
      :data="tableData.records"
      tooltip-effect="dark"
      class="freestyle-device"
      style="width: 100%"
    >
      <el-table-column align="center" type="index" label="序号" width="200"></el-table-column>
      <el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="电话" prop="phone"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="100" prop="">
        <template slot-scope="scope">
          <el-tooltip class="itemAction" effect="dark" content="解除关联" placement="top" align="center">
            <span class="tooltip-margin" @click="disconnect(scope.row)">
              <img src="../../../assets/button/disconnect.png" />
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" width="1065px" title="选择成员" :visible="visible" :before-close="cancel">
      <div class="memberTree scrollbar scrollbar-y scrollbar-light">
        <el-tree
          :data="treeData"
          default-expand-all
          node-key="id"
          ref="tree"
          show-checkbox
          :highlight-current="true"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="nodeClick"
          @check-change="changeCheck"
        >
        </el-tree>
        <!-- :render-content="renderContent" -->
      </div>
      <div slot="footer" class="dialog-footer text-right">
        <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
        <PrimaryButton @click="submit">{{ $$ButtonText.ok }}</PrimaryButton>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ActionButton from '@/components/button/ActionButton.vue';
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import { organizeQueryFuncTree, organizeQueryNodeContainStaff } from '@/api/rbac';
import { queryRelatePersons } from '@/api/config';

export default {
  name: 'space-device',
  components: {
    ActionButton,
    CancelButton,
    PrimaryButton
  },
  props: {
    actionType: String,
    currentData: Object,
    deviceType: String,
    relatedMember: Array,
    currentItem: Object
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      visible: false,
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      treeData: [],
      checkList: [],
      tableData: {
        records: this.relatedMember
      },
      memberChildren: []
    };
  },
  watch: {
    actionType(newV, oldV) {},
    currentData(newV, oldV) {},
    currentItem(newV, oldV) {
      console.log(newV.name);
      if (JSON.stringify(newV) != '{}') {
        this.getRelationData();
      }
    }
  },
  created() {
    console.log(JSON.parse(localStorage.getItem('member')));
    if (JSON.parse(localStorage.getItem('member')) != null) {
      this.tableData.records = JSON.parse(localStorage.getItem('member'));
    } else {
      this.tableData.records = [];
    }
  },
  mounted() {
    if (this.actionType !== 'add') {
      localStorage.clear('device');
      localStorage.clear('asset');
      localStorage.clear('space');
      localStorage.clear('member');
      this.getRelationData();
    }
  },
  methods: {
    getRelationData() {
      queryRelatePersons({ projectId: this.currentData.id, current: 1, size: 500 }).then(res => {
        if (res.code == 200) {
          this.tableData.records = res.object.records;
        }
      });
    },
    add() {
      this.visible = true;
      organizeQueryFuncTree().then(res => {
        if (res.code == 200) {
          // 组织树
          this.treeData = res.object;
        }
      });
    },
    // renderContent(h, { node, data, store }) {
    //   return (
    //     <span class="custom-tree-node">
    //       <span>{node.label} {node.staffNum}</span>
    //       <span> ---</span>
    //     </span>
    //   );
    // },
    changeCheck(node, data) {
      console.log(node, data);
    },
    nodeClick(data) {
      this.nodeData = data;
      if (data.id == '0') {
        return;
      } else {
        organizeQueryNodeContainStaff({ id: data.id, size: data.staffNum, current: 1 }).then(res => {
          if (res.code == 200) {
            this.memberChildren = res.object.records;
            const tree = this.$refs.tree;
            this.memberChildren.forEach(val => {
              const node = tree.getNode(val.orgId);
              tree.remove(val, node);
              tree.append(val, node);
            });
          }
        });
      }
    },
    disconnect(data) {
      var dataIndex = this.tableData.records.indexOf(data);
      this.tableData.records.splice(dataIndex, 1);
      this.$emit('relation-member', this.tableData.records);
    },
    cancel() {
      this.visible = false;
    },
    submit() {
      this.visible = false;
      this.checkList = this.$refs.tree.getCheckedNodes();
      const checkList = this.checkList.filter(res => res.code);
      this.tableData.records = this.tableData.records.concat(checkList);
      this.$emit('relation-member', this.tableData.records);
      // insertRelationDeviceIds
    }
  }
};
</script>
<style lang="scss" scope>
.relaton-device {
  .relation-title {
    font-size: 16px;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
@import '@/styles/ui-theme';
.memberTree {
  height: 500px;
  overflow: auto;
  .memberLeft {
    float: left;
    width: 300px;
    height: 500px;
    border-right: 1px solid #eee;
    padding: 20px 40px 20px 0px;
    overflow: auto;
  }
  .memberCenter {
    width: 390px;
    height: 500px;
    float: left;
    padding: 20px 40px;
    overflow: auto;
    .el-checkbox {
      width: 33.33%;
      margin-bottom: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 0;
    }
  }
  .memberRight {
    padding: 20px 0px 20px 40px;
    .member {
      width: 150px;
      height: 42px;
      line-height: 42px;
      background: #eff4ff;
      border-radius: 4px;
      margin-bottom: 30px;
      text-align: center;
      font-size: 14px;
      color: #0f1736;
    }
  }
}
</style>

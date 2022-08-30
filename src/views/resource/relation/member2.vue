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
    <el-dialog
      :close-on-click-modal="false"
      width="850px"
      title="选择成员"
      class="member-tree"
      :visible="visible"
      :before-close="cancel"
    >
      <div class="memberTree scrollbar scrollbar-y scrollbar-light">
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
          <el-checkbox-group v-model="memberValue" @change="changeMember">
            <el-checkbox v-for="item in memberChildren" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
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
      memberChildren: [],
      memberValue: [],
      memberId: '',
      nodeData: {}
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
  created() {},
  mounted() {
    if (this.actionType !== 'add') {
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
            const arrIds = [];
            // 已关联的id
            this.tableData.records.forEach(v => {
              arrIds.push(v.id);
            });
            // 筛选已关联的id
            const memberList = [];
            res.object.records.forEach(e => {
              if (arrIds.indexOf(e.id) == -1) {
                memberList.push(e);
              }
            });
            this.memberChildren = memberList;
            this.memberValue = [];
          }
        });
      }
    },
    changeMember(val) {
      console.log(val);
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
      this.memberChildren.forEach(e => {
        if (this.memberValue.indexOf(e.id) > -1) {
          this.tableData.records.push(e);
        }
      });
      this.$emit('relation-member', this.tableData.records);
      this.visible = false;
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
.member-tree {
  .el-dialog__body {
    padding: 0px 40px;
  }
  .el-tree {
    height: 420px;
    padding-right: 40px;
    overflow: auto;
  }
  .el-checkbox-group {
    width: 420px;
    margin-top: 15px;
    .el-checkbox {
      width: 32%;
      margin-right: 2%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 45px;
    }
    .el-checkbox:nth-of-type(3n) {
      margin-right: 0;
    }
    .el-checkbox__label {
      font-size: 14px;
    }
  }
}
.memberTree {
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

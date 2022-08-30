<template>
  <div class="relaton-device">
    <div class="relation-title">
      关联空间
      <div class="float-right">
        <ActionButton :type="$$ActionType.add" v-if="actionType != 'views'" @click="add">
          {{ $$ButtonText.plus }}
        </ActionButton>
      </div>
    </div>
    <el-table
      ref="deviceTable"
      :data="tableData.records"
      tooltip-effect="dark"
      class="freestyle-device"
      style="width: 100%"
    >
      <el-table-column align="center" type="index" width="120" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip label="空间编号" prop="code"></el-table-column>
      <el-table-column show-overflow-tooltip label="空间名称" prop="spaceName"></el-table-column>
      <el-table-column show-overflow-tooltip label="类型" prop="categoryName"></el-table-column>
      <el-table-column v-if="this.actionType !== 'views'" show-overflow-tooltip label="操作" width="100" prop="">
        <template slot-scope="scope">
          <el-tooltip class="itemAction" effect="dark" content="解除关联" placement="top" align="center">
            <span class="tooltip-margin" @click="disconnect(scope.row)">
              <img src="../../../assets/button/disconnect.png" />
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" width="650px" title="选择空间" :visible="visible" :before-close="cancel">
      <div class="spaceTree">
        <el-tree
          :data="treeData"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          :props="defaultProps"
          @node-click="checkDevices"
        >
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer text-right">
        <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
        <PrimaryButton @click="submit">{{ $$ButtonText.ok }}</PrimaryButton>
      </div>
    </el-dialog>
    <del-confirm
      v-if="delVisible"
      :del-visible="delVisible"
      :del-text="delText"
      @del-concel="delConcel"
      @del-submit="delSubmit"
    ></del-confirm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ActionButton from '@/components/button/ActionButton.vue';
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import delConfirm from '@/views/resource/relation/delConfirm';
import { querySpaceUnbound, queryRelationSpace } from '@/api/config';
// import { nextTick } from 'vue/types/umd';

export default {
  name: 'space-device',
  components: {
    ActionButton,
    CancelButton,
    PrimaryButton,
    delConfirm
  },
  props: {
    actionType: String,
    currentData: Object,
    deviceType: String,
    relatedSpace: Array,
    currentItem: Object
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      visible: false,
      defaultProps: {
        children: 'children',
        label: 'spaceName'
      },
      treeData: [],
      checkList: [],
      tableData: {
        records: this.relatedSpace
      },
      spaceChildren: [],
      delVisible: false,
      delText: '',
      delObject: {}
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
    if (JSON.parse(localStorage.getItem('space')) != null) {
      this.tableData.records = JSON.parse(localStorage.getItem('space'));
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
      console.log('device');
      queryRelationSpace({ id: this.currentData.id, current: 1, size: 500 }).then(res => {
        if (res.code == 200) {
          this.tableData.records = res.object.records;
        }
      });
    },
    add() {
      this.visible = true;
      querySpaceUnbound().then(res => {
        if (res.code == 200) {
          const arr = this.tableData.records.map(e => e.id);
          const newArr = res.object.filter(e => !arr.includes(e.id));
          this.treeData = JSON.parse(JSON.stringify(newArr).replace(/name/g, 'spaceName'));
        }
      });
    },
    checkDevices(data) {
      querySpaceUnbound({ parentId: data.id }).then(res => {
        if (res.code == 200) {
          const arr = this.tableData.records.map(e => e.id);
          const newArr = res.object.filter(e => !arr.includes(e.id));
          this.spaceChildren = JSON.parse(JSON.stringify(newArr).replace(/name/g, 'spaceName'));
          const tree = this.$refs.tree;
          this.spaceChildren.forEach(val => {
            const node = tree.getNode(val.parentId);
            tree.remove(val, node);
            tree.append(val, node);
          });
        }
      });
    },
    disconnect(data) {
      this.delVisible = true;
      this.delText = data.name;
      this.delObject = data;
    },
    delConcel() {
      this.delVisible = false;
    },
    delSubmit() {
      var dataIndex = this.tableData.records.indexOf(this.delObject);
      this.tableData.records.splice(dataIndex, 1);
      // this.filterIds(this.tableData.records);
      this.$emit('relation-space', this.tableData.records);
      this.delVisible = false;
    },
    cancel() {
      this.visible = false;
    },
    submit() {
      this.visible = false;
      this.checkList = this.$refs.tree.getCheckedNodes();
      const checkList = this.checkList.filter(res => res.code);
      this.tableData.records = this.tableData.records.concat(checkList);
      this.$emit('relation-space', this.tableData.records);
      // insertRelationDeviceIds
    }
  }
};
</script>
<style lang="scss">
@import '@/styles/ui-theme';
.deviceTree {
  .el-checkbox__inner::after {
    height: 9px;
    left: 7px;
    top: 2px;
  }
  .el-tree-node__content {
    padding: 10px 0;
    line-height: 26px;
    label.el-checkbox {
      margin-right: 10px;
    }
  }
  .el-tree-node__label {
    font-size: 16px;
    color: #0f1736;
  }
  // .el-tree-node__children {
  //   .el-tree-node__children {
  //     width: 100%;
  //     .el-tree-node {
  //       width: 20%;
  //       float: left;
  //       .el-tree-node__content {
  //         padding-left: 18px !important;
  //         label.el-checkbox {
  //           margin-right: 8px;
  //           position: relative;
  //         }
  //       }
  //       .el-tree-node__label {
  //         font-size: 14px;
  //         overflow: hidden;
  //         text-overflow: ellipsis;
  //       }
  //     }
  //   }
  // }
}
</style>

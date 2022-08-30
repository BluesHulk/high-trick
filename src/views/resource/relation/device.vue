<template>
  <div class="relaton-device">
    <div class="relation-title">
      关联设备
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
      <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip label="编号" width="210" prop="code"></el-table-column>
      <el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="类型" prop="categoryName">
        <template slot-scope="scope">
          <span v-if="scope.row.categoryName">{{ scope.row.categoryName }}</span>
          <span v-else>{{ getCategoryName(scope.row.categoryId) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="this.actionType !== 'views'" show-overflow-tooltip label="操作" width="60" prop="">
        <template slot-scope="scope">
          <el-tooltip class="itemAction" effect="dark" content="解除关联" placement="top" align="center">
            <span class="tooltip-margin" @click="disconnect(scope.row)">
              <img src="../../../assets/button/disconnect.png" />
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" width="1150px" title="选择设备" :visible="visible" :before-close="cancel">
      <div class="deviceTree scrollbar scrollbar-y scrollbar-light">
        <div class="search">
          <el-input
            type="text"
            v-model="treeValue"
            placeholder="请输入编号或名称"
            @keyup.enter.native="search"
          ></el-input>
          <i class="el-icon-search searchColor" @click="search"></i>
        </div>
        <div class="relation_Device">
          <div class="relation_Title">设备目录</div>
          <div class="relation_Collapse">
            <el-collapse v-model="relationName">
              <el-collapse-item title="挂载" name="allowMount">
                <el-tree
                  :data="treeData"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  ref="tree"
                  class="collapseTree"
                  :props="defaultProps"
                  @check="checkDevices"
                >
                </el-tree>
              </el-collapse-item>
              <el-collapse-item title="控制" name="allowControl">
                <div class="relation_Control">
                  <div class="C_left float-left">左</div>
                  <div class="C_center float-left">中</div>
                  <div class="C_right float-left">右</div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
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
import { queryDeviceWithTree, queryRelationDevice } from '@/api/config';

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
    relatedDevice: Array,
    currentItem: Object
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      visible: false,
      defaultProps: {
        label: 'name'
      },
      treeData: [],
      checkList: [],
      tableData: {
        records: []
      },
      treeValue: '',
      categoryList: [],
      ids: [],
      delVisible: false,
      delText: '',
      delObject: {},
      relationName: 'allowMount'
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
    if (JSON.parse(localStorage.getItem('device')) != null) {
      this.tableData.records = JSON.parse(localStorage.getItem('device'));
      this.categoryList = JSON.parse(localStorage.getItem('deviceCategory'));
    } else {
      this.tableData.records = [];
      this.categoryList = [];
    }
  },
  mounted() {
    if (this.actionType !== 'add') {
      localStorage.clear('device');
      localStorage.clear('asset');
      localStorage.clear('space');
      localStorage.clear('member');
      localStorage.clear('deviceCategory');
      this.getRelationData();
    }
  },
  methods: {
    getRelationData() {
      queryRelationDevice({ type: this.deviceType, id: this.currentData.id, current: 1, size: 500 }).then(res => {
        if (res.code == 200) {
          this.tableData.records = res.object.records;
        }
      });
    },
    search() {
      this.getTreeList();
    },
    add() {
      this.visible = true;
      this.categoryList = [];
      this.getTreeList();
    },
    getTreeList() {
      const data = {
        type: this.deviceType
      };
      if (this.treeValue != '') {
        data.nameOrId = this.treeValue;
      }
      if (this.deviceType != 'SPACE' && this.deviceType != 'PROJECT') {
        if (this.actionType !== 'add') {
          data.id = this.currentData.id;
        }
      }
      queryDeviceWithTree(data).then(res => {
        if (res.code == 200) {
          this.treeData = JSON.parse(
            JSON.stringify(res.object)
              .replace(/deviceDatas/g, 'children')
              .replace(/categoryWithDeviceVO/g, 'children')
          );
          // 获取类型
          if (res.object.length) {
            res.object.forEach(v => {
              if (v.categoryWithDeviceVO.length) {
                v.categoryWithDeviceVO.forEach(e => {
                  this.categoryList.push(e);
                });
              }
            });
          }
          localStorage.setItem('deviceCategory', JSON.stringify(this.categoryList));
          // 已关联
          this.$nextTick(() => {
            if (this.tableData.records.length) {
              this.filterData(this.treeData);
            }
          });
        }
      });
    },
    // 递归筛选已关联数据
    filterData(arr) {
      arr.forEach(res => {
        if (res.children.length) {
          res.children.forEach(child => {
            if (child.children.length) {
              child.children = child.children.filter(v => !this.ids.includes(v.id));
            }
          });
        }
      });
      this.treeData = arr;
    },
    getCategoryName(val) {
      let name = '';
      this.categoryList.forEach(v => {
        if (val == v.id) {
          name = v.name;
        }
      });
      return name;
    },
    checkDevices(data) {},
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
      this.filterIds(this.tableData.records);
      this.$emit('relation-asset', this.tableData.records);
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
      this.filterIds(this.tableData.records);
      this.$emit('relation-device', this.tableData.records);
    },
    filterIds(arr) {
      this.ids = [];
      arr.forEach(v => {
        this.ids.push(v.id);
      });
    }
  }
};
</script>
<style lang="scss" scope>
.relaton-device {
  .relation-title {
    font-size: 16px;
    overflow: hidden;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
@import '@/styles/ui-theme';
.deviceTree {
  height: 500px;
  overflow: auto;
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
      position: absolute;
      right: 0;
    }
  }
  .el-tree-node__label {
    font-size: 16px;
    color: #0f1736;
  }
  .el-tree-node__children {
    .el-tree-node__children {
      width: 100%;
      .el-tree-node {
        width: 20%;
        float: left;
        .el-tree-node__content {
          padding-left: 18px !important;
          label.el-checkbox {
            margin-right: 8px;
            position: relative;
          }
        }
        .el-tree-node__label {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .search {
    width: 320px;
    height: 42px;
    position: absolute;
    top: 22px;
    left: 135px;
    .searchColor {
      font-size: 23px;
      color: rgb(48, 69, 177);
      font-weight: bold;
      position: relative;
      margin: 8px 0 0 -35px;
    }
  }
}
</style>

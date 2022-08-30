<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between">
        <div>
          <div class="tree-title page-title">项目目录</div>
        </div>
        <CircleButton :type="$$ActionType.add" @click="add">{{ $$ButtonText.plus }}</CircleButton>
      </div>
      <div class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light">
        <List
          ref="projectTree"
          padding="20px 50px"
          height="16px"
          @selected="onSelect"
          :loader="getCategoryQuery"
          @data="getGroupsList"
        >
          <div class="float-left" slot-scope="{ data }" slot="left">
            <div class="project-name" :style="{ backgroundImage: `url(${treeIcon})` }">
              {{ data.name }}
            </div>
          </div>
          <div class="float-right" slot-scope="{ data }" slot="right">
            <ImageButton
              v-if="groupTypeEn != 'DEVICE'"
              :src="ButtonImage[data.enable]"
              @click.native.stop="enabled(data)"
            ></ImageButton>
            <div class="edit" @click.stop="edit(data)"></div>
            <div class="delete" @click.stop="del(data)"></div>
          </div>
        </List>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <template v-if="GlobalActionType === $$ActionType.add || GlobalActionType === $$ActionType.edit">
          <div class="page-title">{{ $$ButtonText[GlobalActionType] }}项目</div>
          <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
        </template>
        <div v-else class="page-title">查看</div>
      </div>
      <div class="page-title-wrapper a-toolbar-between">
        <el-form ref="form" :model="form" :rules="ruleForm" class="formFreeStyle">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="类别名称" prop="name">
                <el-input v-model="form.name" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="form.desc" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="horizontal-line"></div>
      <div class="page-title-wrapper a-toolbar-between">
        <div class="page-subtitle">配置属性</div>
        <template v-if="GlobalActionType === $$ActionType.add || GlobalActionType === $$ActionType.edit">
          <ActionButton @click="set" :type="$$ActionType.add">{{ $$ButtonText.plus }}</ActionButton>
        </template>
      </div>
      <div class="table-page-wrapper">
        <el-table :data="tableData">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="字段名称">
            <template slot-scope="scope">{{ scope.row.name || '--' }}</template>
          </el-table-column>
          <el-table-column prop="identify" label="字段标识">
            <template slot-scope="scope">{{ scope.row.identify || '--' }}</template>
          </el-table-column>
          <el-table-column prop="groupName" label="属性分组">
            <template slot-scope="scope">{{ scope.row.groupName || '--' }}</template>
          </el-table-column>
          <el-table-column prop="dataType" label="字段类型">
            <template slot-scope="scope">{{ scope.row.dataType || '--' }}</template>
          </el-table-column>
          <el-table-column prop="required" label="是否必填" width="150">
            <template slot-scope="scope">
              <el-radio
                v-for="(item, index) in requiredList"
                :key="index"
                v-model="scope.row.required"
                :label="item.value"
                :disabled="GlobalActionType == $$ActionType.views"
                @change="changeRadio(scope.row)"
              >
                {{ item.name }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column v-if="GlobalActionType != $$ActionType.views" prop="" label="操作" width="70">
            <template slot-scope="scope">
              <el-tooltip class="itemAction" effect="dark" content="删除" placement="top" align="center">
                <span class="tooltip-margin" @click="attrDel(scope.row)">
                  <img src="../../../../assets/button/del-active.png" />
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <config v-if="visible" :visible="visible" :group-type-en="groupTypeEn" @reset="formReset"></config>
    </template>
    <del-confirm
      v-if="delVisible"
      :del-visible="delVisible"
      :del-text="delText"
      @del-concel="delConcel"
      @del-submit="delSubmit"
    ></del-confirm>
  </TreeContent>
</template>

<script>
import { mapGetters } from 'vuex';
import TreeContent from '@/components/layout/TreeContent.vue';
import List from '@/components/list/List.vue';
import ActionButton from '@/components/button/ActionButton.vue';
import CircleButton from '@/components/button/CircleButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import ImageButton from '@/components/button/ImageButton.vue';
import config from '@/views/resource/config/project/add';

import ButtonImage from '@/constants/ButtonImage';
import treeIcon from '../../../../assets/config/tree-project.png';
import delConfirm from '@/views/resource/delConfirm';
import { getCategoryQuery, categoryAdd, categoryUpdate, queryByCategoryId } from '@/api/config';

export default {
  name: 'config-project',
  components: {
    TreeContent,
    List,
    ActionButton,
    CircleButton,
    ImageButton,
    PrimaryButton,
    config,
    delConfirm
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      ButtonImage,
      treeIcon: treeIcon,
      projectList: [],
      parentList: [],
      clickArr: [],
      groupTypeEn: 'PROJECT',
      form: {
        name: '',
        desc: ''
      },
      ruleForm: {
        name: [
          { required: true, message: '请输入类别名称', trigger: 'blur' },
          { min: 1, max: 60, message: '最多只能输入60个字符', trigger: 'blur' }
        ],
        desc: [{ min: 1, max: 300, message: '最多只能输入300个字符', trigger: 'blur' }]
      },
      requiredList: [
        { name: '是', value: true },
        { name: '否', value: false }
      ],
      tableData: [],
      currentData: {},
      visible: false,
      disabled: false,
      parentDisabled: false,
      enumList: [],
      configString: [],
      groupDataList: [],
      delVisible: false,
      delText: '',
      delObject: {}
    };
  },
  mounted() {},
  methods: {
    getCategoryQuery() {
      return getCategoryQuery({ type: this.groupTypeEn });
    },
    onSelect(data) {
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.views);
      this.actionType = this.$$ActionType.views;
      this.currentData = data;
      this.tableData = [];
      if (data) {
        this.disabled = true;
        this.form.name = data.name;
        this.form.desc = data.desc;
      } else {
        this.form.name = '';
        this.form.desc = '';
      }
      this.getCategoryataById(data);
    },
    getCategoryataById(node) {
      // 获取配置属性
      queryByCategoryId({ categoryId: node.id }).then(res => {
        if (res.code == 200) {
          this.getTableData(res.object);
        }
      });
    },
    // 配置属性
    getTableData(data) {
      this.tableData = [];
      data.map(arr => {
        arr.categoryAttributes.map(child => {
          child['groupName'] = arr.name;
          child['attrId'] = arr.id;
          this.tableData.push(child);
        });
      });
    },
    getGroupsList(data) {
      console.log(data);
      this.groupDataList = data;
    },
    add() {
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.add);
      this.actionType = this.$$ActionType.add;
      this.disabled = false;
      this.form.name = '';
      this.form.desc = '';
      this.tableData = [];
    },
    edit(data, node) {
      const idx = this.groupDataList.indexOf(data);
      this.$refs.projectTree.select(idx, data);
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.edit);
      this.actionType = this.$$ActionType.edit;
      this.disabled = false;
      this.currentData = data;
    },
    enabled(data) {
      const idx = this.groupDataList.indexOf(data);
      this.$refs.projectTree.select(idx, data);
      this.currentData = data;
      categoryUpdate({ id: data.id, enable: !data.enable }).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message);
          this.$refs.projectTree.load();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    del(data, node) {
      this.delVisible = true;
      this.delText = data.name;
      this.delObject = data;
    },
    delConcel() {
      this.delVisible = false;
    },
    delSubmit() {
      if (!this.delObject.dataType) {
        categoryUpdate({ id: this.delObject.id, deleted: true }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.$refs.projectTree.load();
            this.delVisible = false;
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        var dataIndex = this.tableData.indexOf(this.delObject);
        this.tableData.splice(dataIndex, 1);
        this.delVisible = false;
      }
    },
    attrDel(data) {
      this.delVisible = true;
      this.delText = data.name;
      this.delObject = data;
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const data = {
            type: this.groupTypeEn,
            name: this.form.name,
            desc: this.form.desc
          };
          if (this.tableData.length) {
            var attrArr = [];
            var attrObject = {};
            this.tableData.forEach(res => {
              attrObject = {
                groupId: res.groupId,
                name: res.name,
                identify: res.identify,
                unit: res.unit,
                dataType: res.dataType,
                required: res.required,
                desc: res.desc
              };
              if (res.id) {
                attrObject = { ...attrObject, id: res.id };
              }
              if (res.dataType == 'ENUM' || res.dataType == 'INT' || res.dataType == 'FLOAT') {
                attrObject = { ...attrObject, dataParam: res.dataParam };
              }
              attrArr.push(attrObject);
            });
            data.categoryAttributes = attrArr;
          }
          if (this.actionType === this.$$ActionType.add) {
            categoryAdd(data).then(res => {
              if (res.code == 200) {
                this.$message.success(res.message);
                this.$refs.projectTree.load();
              } else {
                this.$message.error(res.message);
              }
            });
          } else if (this.actionType === this.$$ActionType.edit) {
            data.id = this.currentData.id;
            categoryUpdate(data).then(res => {
              if (res.code == 200) {
                this.$message.success(res.message);
                this.$refs.projectTree.load();
              } else {
                this.$message.error(res.message);
              }
            });
          }
        }
      });
    },
    set() {
      this.visible = true;
    },
    formReset(val) {
      console.log(val);
      if (val.length) {
        if (val[0].dataType == 'ENUM') {
          val[0].dataParam.forEach(res => {
            this.configString.push(res.name);
          });
          val[0].dataParam = this.configString.toString();
          this.tableData = this.tableData.concat(val);
        } else if (val[0].dataType == 'INT' || val[0].dataType == 'FLOAT') {
          if (val[0].dataParam) {
            val[0].dataParam = val[0].dataParam.toString();
          }
          this.tableData = this.tableData.concat(val);
        } else {
          this.tableData = this.tableData.concat(val);
        }
      }
      this.visible = false;
    },
    changeRadio(val) {
      const dataIndex = this.tableData.indexOf(val);
      this.tableData[dataIndex].required = val.required;
    }
  }
};
</script>
<style lang="scss">
.table-page-wrapper {
  .el-table tr:hover > td {
    background-color: rgba(239, 244, 255, 1);
  }
  .el-table__body {
    border-collapse: separate;
    border-spacing: 0 10px;
  }
}
</style>
<style lang="scss" scoped>
@import '@/styles/ui-theme';
.project-name {
  padding-left: 36px;
  height: 16px;
  font-size: 16px;
  font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
  font-weight: 500;
  color: $--color-dark;
  line-height: 16px;
  background-repeat: no-repeat;
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.formFreeStyle {
  width: 670px;
  margin: 0px auto;
}
.table-page-wrapper {
  margin: 30px;
}
.enable-container {
  position: relative;
  .enableStyle {
    top: 6px;
    position: absolute;
    right: 42px;
  }
}
.tooltip-margin {
  padding: 0px 9px;
}
</style>

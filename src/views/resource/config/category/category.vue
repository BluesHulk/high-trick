<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between category-container">
        <div>
          <div class="tree-title page-title">
            <div class="category-margin clearfix">
              <span class="category-title" :class="{ active: groupTypeEn == 'DEVICE' }" @click="getGroupType('DEVICE')">
                设备<i v-if="groupTypeEn == 'DEVICE'"></i>
              </span>
            </div>
            <div class="category-margin clearfix">
              <span class="category-title" :class="{ active: groupTypeEn == 'SPACE' }" @click="getGroupType('SPACE')">
                空间<i v-if="groupTypeEn == 'SPACE'"></i>
              </span>
            </div>
            <div class="category-margin clearfix">
              <span class="category-title" :class="{ active: groupTypeEn == 'XASSET' }" @click="getGroupType('XASSET')">
                其他资产<i v-if="groupTypeEn == 'XASSET'"></i>
              </span>
            </div>
          </div>
        </div>
        <CircleButton v-if="groupTypeEn != 'DEVICE'" :type="$$ActionType.add" @click="add">
          {{ $$ButtonText.plus }}
        </CircleButton>
      </div>
      <div
        class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light category-container"
        style="padding: 0px 30px;"
      >
        <el-tree
          ref="categoryTree"
          highlight-current
          :data="categoryList"
          node-key="id"
          default-expand-all
          :class="getClassName()"
          :expand-on-click-node="false"
          @node-click="nodeClick"
        >
          <div class="custom-tree-node float-container" slot-scope="{ node, data }">
            <div class="float-left">
              <span>{{ data.name }}</span>
            </div>
            <div class="float-right enable-container">
              <span class="enableStyle" v-if="groupTypeEn != 'DEVICE'">
                <ImageButton :src="ButtonImage[data.enable]" @click.native.stop="enabled(data)"></ImageButton>
              </span>
              <TreeButton
                v-if="groupTypeEn == 'DEVICE' && data.factoryId"
                :type="$$ActionType.edit"
                @click.native.stop="edit(data, node)"
              ></TreeButton>
              <TreeButton
                v-if="groupTypeEn != 'DEVICE'"
                :type="$$ActionType.edit"
                @click.native.stop="edit(data, node)"
              ></TreeButton>
              <TreeButton
                v-if="groupTypeEn != 'DEVICE'"
                :type="$$ActionType.delete"
                @click.native.stop="del(data, node)"
              ></TreeButton>
            </div>
          </div>
        </el-tree>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <template v-if="GlobalActionType === $$ActionType.add || GlobalActionType === $$ActionType.edit">
          <div class="page-title">{{ $$ButtonText[GlobalActionType] }}{{ groupTypeCn }}</div>
          <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
        </template>
        <div v-else class="page-title">查看{{ groupTypeCn }}</div>
      </div>
      <div class="page-title-wrapper a-toolbar-between category-container">
        <device-form v-if="groupTypeEn == 'DEVICE'" :current-data="currentData" @form-data="formData"></device-form>
        <space-form
          ref="form"
          v-if="groupTypeEn == 'SPACE'"
          :current-data="currentData"
          @form-data="formData"
        ></space-form>
        <asset-form
          ref="form"
          v-if="groupTypeEn == 'XASSET'"
          :current-data="currentData"
          @form-data="formData"
        ></asset-form>
      </div>
      <div class="horizontal-line"></div>
      <div v-if="groupTypeEn == 'DEVICE' && currentData.factoryId" class="configTabStyle">
        <span class="float-left" :class="{ 'config-active': configTab == 'set' }" @click="configTabs('set')">
          配置属性
        </span>
        <span class="float-left" :class="{ 'config-active': configTab == 'category' }" @click="configTabs('category')">
          类别属性
        </span>
      </div>
      <div v-if="groupTypeEn == 'DEVICE' && configTab == 'set'">
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
      </div>
      <div v-if="groupTypeEn == 'DEVICE' && configTab == 'category'">
        <div class="page-title-wrapper a-toolbar-between">
          <div class="page-subtitle">类别属性</div>
        </div>
        <div class="table-page-wrapper">
          <el-table :data="categoryData">
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
            <el-table-column prop="dataType" label="字段类型" width="100">
              <template slot-scope="scope">{{ scope.row.dataType || '--' }}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="groupTypeEn != 'DEVICE'">
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
import ActionButton from '@/components/button/ActionButton.vue';
import CircleButton from '@/components/button/CircleButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import ImageButton from '@/components/button/ImageButton.vue';
import TreeButton from '@/components/button/TreeButton.vue';
import deviceForm from '@/views/resource/config/category/deviceForm.vue';
import spaceForm from '@/views/resource/config/category/spaceForm.vue';
import assetForm from '@/views/resource/config/category/assetForm.vue';
import config from '@/views/resource/config/project/add';
import delConfirm from '@/views/resource/delConfirm';
import ButtonImage from '@/constants/ButtonImage';
import { getCategoryQuery, queryByCategoryId, categoryAdd, categoryUpdate } from '@/api/config';

export default {
  name: 'config-group',
  components: {
    TreeContent,
    TreeButton,
    ActionButton,
    CircleButton,
    PrimaryButton,
    ImageButton,
    deviceForm,
    spaceForm,
    assetForm,
    config,
    delConfirm
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      ButtonImage,
      categoryList: [],
      groupTypeEn: '',
      groupTypeCn: '',
      disabled: false,
      tableData: [],
      currentData: {},
      visible: false,
      clickArr: [],
      requiredList: [
        { name: '是', value: true },
        { name: '否', value: false }
      ],
      form: {},
      categoryData: [],
      configTab: 'set',
      configString: [],
      delVisible: false,
      delText: '',
      delObject: {}
    };
  },
  mounted() {
    this.getGroupType('DEVICE');
  },
  methods: {
    getGroupType(val) {
      this.currentData = {};
      this.categoryData = [];
      this.tableData = [];
      this.form = {};
      this.groupTypeEn = val;
      switch (val) {
        case 'DEVICE':
          this.groupTypeCn = '设备';
          break;
        case 'SPACE':
          this.groupTypeCn = '空间';
          break;
        case 'XASSET':
          this.groupTypeCn = '其他资产';
          break;
      }
      // 获取列表
      getCategoryQuery({ type: val }).then(res => {
        if (res.code == 200) {
          if (res.object.length) {
            this.categoryList = res.object;
            this.$nextTick(() => {
              this.$refs.categoryTree.setCurrentKey(this.categoryList[0].id);
              this.nodeClick(this.categoryList[0]);
            });
          }
        }
      });
    },
    getClassName() {
      return this.groupTypeEn == 'SPACE' ? 'cateGoryTreeSpace' : 'cateGoryTreeOnly';
    },
    nodeClick(node) {
      this.form = {};
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.views);
      this.actionType = this.$$ActionType.views;
      this.currentData = node;
      // 获取节点的子集
      getCategoryQuery({ type: this.groupTypeEn, parentId: node.id }).then(res => {
        if (res.code == 200) {
          this.projectChildren = res.object;
          const tree = this.$refs.categoryTree;
          this.projectChildren.forEach(val => {
            const node = tree.getNode(val.parentId);
            tree.remove(val, node);
            tree.append(val, node);
          });
        }
      });
      // 设备配置类别/类型处理
      if (this.groupTypeEn == 'DEVICE') {
        if (node.factoryId) {
          this.configTab = 'set';
        } else {
          this.configTab = 'category';
        }
      }
      this.getCategoryataById(node);
    },
    getCategoryataById(node) {
      // 获取配置属性
      queryByCategoryId({ categoryId: node.id }).then(res => {
        if (res.code == 200) {
          if (this.groupTypeEn == 'DEVICE') {
            if (node.factoryId) {
              this.getTableData(res.object);
            } else {
              this.getCategoryData(res.object);
            }
          } else {
            this.getTableData(res.object);
          }
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
    // 类别属性
    getCategoryData(data) {
      this.categoryData = [];
      data.map(arr => {
        arr.categoryAttributes.map(child => {
          child['groupName'] = arr.name;
          child['attrId'] = arr.id;
          this.categoryData.push(child);
        });
      });
    },
    configTabs(val) {
      this.configTab = val;
    },
    add() {
      if (this.groupTypeEn == 'XASSET') {
        if (this.categoryList.length) {
          if (this.currentData.parentId != '0') {
            this.$message.warning('二级节点不允许新增');
            return;
          }
        }
      }
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.add);
      this.actionType = this.$$ActionType.add;
      this.tableData = [];
    },
    enabled(data) {
      this.$refs.categoryTree.setCurrentKey(data.id);
      categoryUpdate({ id: data.id, enable: !data.enable }).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message || '设置成功');
          this.changeNodeData(data);
        } else {
          this.$message.error(res.message || '设置失败');
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
            const tree = this.$refs.categoryTree;
            const node = tree.getNode(this.delObject.parentId);
            tree.remove(this.delObject, node);
            this.$message.success(res.message || '删除成功');
            this.delVisible = false;
          } else {
            this.$message.error(res.message || '删除失败');
          }
        });
      } else {
        var dataIndex = this.tableData.indexOf(this.delObject);
        this.tableData.splice(dataIndex, 1);
        this.delVisible = false;
      }
    },
    edit(data) {
      this.$refs.categoryTree.setCurrentKey(data.id);
      this.currentData = data;
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.edit);
      this.actionType = this.$$ActionType.edit;
      this.disabled = false;
    },
    save() {
      // 验证form必填项
      const flag = this.$refs['form'].validateForm();
      if (flag) {
        var data = {};
        if (this.groupTypeEn == 'DEVICE') {
          data = {
            type: this.groupTypeEn,
            name: this.form.name,
            identify: this.form.identify,
            parentId: this.currentData.parentId,
            factoryId: this.currentData.factoryId,
            desc: this.form.desc
          };
        } else if (this.groupTypeEn == 'XASSET') {
          data.type = this.groupTypeEn;
          data.name = this.form.name;
          data.parentId = this.form.parentId;
          data.desc = this.form.desc;
          if (this.form.parentId == '0') {
            data.allowMount = this.form.allowMount;
          }
        } else {
          data = { ...this.form, type: this.groupTypeEn };
        }
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
          // if (this.currentData.parentId != '0') {
          //   data.parentId = this.currentData.id;
          // }
          categoryAdd(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message || '新增成功');
              this.getNodeData(data);
            } else {
              this.$message.error(res.message || '新增失败');
            }
          });
        } else if (this.actionType === this.$$ActionType.edit) {
          data.id = this.currentData.id;
          // data.parentId = this.currentData.parentId;
          categoryUpdate(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message || '编辑成功');
              this.getNodeData(data);
            } else {
              this.$message.error(res.message || '编辑失败');
            }
          });
        }
      }
    },
    getNodeData(data) {
      if (data.parentId == '0') {
        this.getGroupType(this.groupTypeEn);
      } else {
        const tree = this.$refs.categoryTree;
        this.projectChildren.forEach(val => {
          const node = tree.getNode(val.parentId);
          tree.remove(val, node);
        });
        if (this.actionType === this.$$ActionType.add) {
          // 重新请求当前节点
          this.nodeClick(this.currentData);
        } else if (this.actionType === this.$$ActionType.edit) {
          // 重新请求父级节点
          getCategoryQuery({ type: this.groupTypeEn, parentId: this.currentData.parentId }).then(res => {
            if (res.code == 200) {
              this.$store.dispatch('SetGlobalActionType', this.$$ActionType.views);
              this.actionType = this.$$ActionType.views;
              this.projectChildren = res.object;
              const tree = this.$refs.categoryTree;
              this.projectChildren.forEach(val => {
                const node = tree.getNode(val.parentId);
                tree.remove(val, node);
                tree.append(val, node);
              });
              this.$refs.categoryTree.setCurrentKey(data.id);
            }
          });
        }
      }
    },
    changeNodeData(data) {
      const tree = this.$refs.categoryTree;
      const node = tree.getNode(data.id);
      console.log(data, node);
      node.data = { ...data, enable: !data.enable };
    },
    formData(val) {
      this.form = val;
    },
    attrDel(data) {
      this.delVisible = true;
      this.delText = data.name;
      this.delObject = data;
    },
    set() {
      this.visible = true;
    },
    formReset(val) {
      if (val.length) {
        if (val[0].dataType == 'ENUM') {
          val[0].dataParam.forEach(res => {
            this.configString.push(res.name);
          });
          val[0].dataParam = this.configString.toString();
          this.tableData = this.tableData.concat(val);
        } else if (val[0].dataType == 'INT' || val[0].dataType == 'FLOAT') {
          if (val[0].dataParam != null) {
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
.itemAction {
  margin-left: 10px;
}
.cateGoryTreeOnly {
  .el-tree-node__expand-icon.is-leaf {
    color: #3045b1;
  }
  .el-tree-node__children {
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }
  }
  .custom-tree-node {
    // width: 100%;
    .float-left {
      width: calc(100% - 180px);
      position: absolute;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.cateGoryTreeSpace {
  .el-tree-node__expand-icon.is-leaf {
    color: #3045b1;
  }
  .custom-tree-node {
    // width: 100%;
    .float-left {
      width: calc(100% - 180px);
      position: absolute;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
<style lang="scss" scope>
@import '@/styles/ui-theme';
.category-container {
  .category-margin {
    margin-right: 50px;
    float: left;
  }
  .category-margin:last-child {
    margin-right: 0;
  }
  .category-title {
    position: relative;
    display: block;
    float: left;
    min-width: 40px;
    color: $--color-username;
    cursor: pointer;
  }
  .category-title.active {
    color: $-primary-color;
    i {
      background: #3045b1;
      width: 40px;
      height: 3px;
      position: absolute;
      bottom: -21px;
      left: 50%;
      margin-left: -20px;
    }
  }
  .category-name {
    padding-left: 36px;
    height: 16px;
    font-size: 16px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: $--color-dark;
    line-height: 16px;
    background-repeat: no-repeat;
  }
  .enable-container {
    position: relative;
    .enableStyle {
      top: 6px;
      position: absolute;
      right: 42px;
    }
  }
  .formFreeStyle {
    width: 670px;
    margin: 0px auto;
  }
}
.table-page-wrapper {
  margin: 30px;
}
.configTabStyle {
  width: 260px;
  margin: 30px auto 0;
  text-align: center;
  background: $--bg-main;
  border-radius: 21px;
  line-height: 42px;
  overflow: hidden;
  span {
    padding: 0 30px;
    font-size: 16px;
    color: rgba(174, 180, 198, 1);
    display: block;
  }
  span.config-active {
    background: $-primary-color;
    color: $--color-light;
    border-radius: 21px;
  }
}
</style>

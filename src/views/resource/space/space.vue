<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between space-container">
        <div class="space-search">
          <el-input
            type="text"
            v-model="spaceSearch"
            placeholder="请输入空间编号/名称"
            @keyup.enter.native="search"
          ></el-input>
          <i class="el-icon-search searchColor" @click="search"></i>
        </div>
        <CircleButton :type="$$ActionType.add" @click="add">
          {{ $$ButtonText.plus }}
        </CircleButton>
      </div>
      <div class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light" style="padding: 0px 30px;">
        <el-tree
          ref="spaceTree"
          highlight-current
          :data="spaceData"
          node-key="id"
          :default-expanded-keys="levelArr"
          :expand-on-click-node="false"
          @node-click="nodeClick"
        >
          <div class="custom-tree-node float-container" slot-scope="{ node, data }">
            <div class="float-left">
              <span>{{ data.name }}</span>
            </div>
            <div class="float-right enable-container">
              <TreeButton :type="$$ActionType.edit" @click.native.stop="edit(data, node)"></TreeButton>
              <TreeButton :type="$$ActionType.delete" @click.native.stop="del(data, node)"></TreeButton>
            </div>
          </div>
        </el-tree>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <!-- <template v-if="this.spaceData.length">
          <div class="page-title">{{ currentData.name }}</div>
          <PrimaryButton v-if="actionType != 'views' || !saveStatus" @click="save">
            {{ $$ButtonText.save }}
          </PrimaryButton>
        </template> -->
        <template v-if="this.actionType == 'add' || this.actionType == 'edit'">
          <div class="page-title">{{ currentData.name }}</div>
          <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
        </template>
        <div v-else class="page-title">查看</div>
      </div>
      <div v-if="this.actionType != ''" class="page-title-wrapper a-toolbar-between">
        <el-form ref="form" :model="form" :rules="ruleForm" class="formFreeStyle">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="空间名称" prop="name">
                <el-input
                  v-model="form.name"
                  :disabled="this.actionType == 'views'"
                  @input="onInput"
                  @change="changeName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="空间编号">
                <el-input v-model="code" disabled @input="onInput"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类别" prop="parentId">
                <el-select
                  v-model="form.parentId"
                  :disabled="this.actionType != 'add'"
                  @change="changeParent"
                  @input="onInput"
                >
                  <el-option label="无" value="0"></el-option>
                  <el-option v-for="item in parentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类别类型" prop="categoryId">
                <el-cascader
                  ref="cascaderHandle"
                  v-if="this.actionType == 'add' && (this.form.parentId != '0' || '')"
                  v-model="form.categoryId"
                  :options="deviceList"
                  :props="deviceProps"
                  :show-all-levels="false"
                  :disabled="this.actionType != 'add'"
                  @change="changeCategory"
                  @input="onInput"
                  clearable
                ></el-cascader>
                <el-select
                  v-if="this.actionType != 'add'"
                  v-model="form.categoryId"
                  :disabled="this.actionType != 'add'"
                  @input="onInput"
                >
                  <el-option
                    :key="item.id"
                    v-for="item in editCategoryList"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  v-if="this.actionType == 'add' && (this.form.parentId == '0' || '')"
                  v-model="form.categoryId"
                  :disabled="this.actionType != 'add'"
                  @change="changeCategory"
                  @input="onInput"
                >
                  <el-option :key="item.id" v-for="item in deviceList" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述" prop="desc">
                <el-input
                  type="textarea"
                  v-model="form.desc"
                  :disabled="this.actionType == 'views'"
                  @input="onInput"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="horizontal-line" style="margin-bottom: 30px;"></div>
      <config-group
        :action-type="actionType"
        :device-type="deviceType"
        :current-data="currentData"
        :group-list="groupList"
        @attr-object="attrObject"
        @device-ids="deviceIds"
        @asset-ids="assetIds"
      ></config-group>
      <del-confirm
        v-if="delVisible"
        :del-visible="delVisible"
        :del-text="delText"
        @del-concel="delConcel"
        @del-submit="delSubmit"
      ></del-confirm>
    </template>
  </TreeContent>
</template>

<script>
import { mapGetters } from 'vuex';
import TreeContent from '@/components/layout/TreeContent.vue';
import CircleButton from '@/components/button/CircleButton.vue';
import TreeButton from '@/components/button/TreeButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import configGroup from '@/views/resource/configGroup';
import delConfirm from '@/views/resource/delConfirm';

import { getSpaceData, spaceAdd, spaceUpdate, getCategoryQuery, queryByCategoryId, getSpaceDetail } from '@/api/config';

export default {
  name: 'res-space',
  components: {
    TreeContent,
    CircleButton,
    TreeButton,
    PrimaryButton,
    configGroup,
    delConfirm
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      actionType: '',
      spaceData: [],
      currentData: {},
      form: {},
      ruleForm: {
        name: [
          { required: true, message: '请输入空间名称', trigger: 'change' },
          { max: 60, message: '最多只能输入60个字符' }
        ],
        parentId: [{ required: true, message: '请选择上级类别', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择类别类型', trigger: 'blur' }],
        desc: [{ max: 300, message: '最多只能输入300个字符', trigger: 'change' }]
      },
      code: '',
      deviceList: [],
      editCategoryList: [],
      deviceProps: {
        checkStrictly: true,
        lazy: true,
        label: 'name',
        value: 'id',
        lazyLoad: this.getQueryById
      },
      parentList: [],
      spaceSearch: '',
      saveStatus: false,
      groupList: [],
      attributes: {},
      deviceType: 'SPACE',
      relatedDevice: [],
      relatedAsset: [],
      levelArr: [],
      delVisible: false,
      delText: '',
      delObject: {}
    };
  },
  mounted() {
    this.getSpaceList();
    this.spaceCategory();
    localStorage.clear('device');
    localStorage.clear('asset');
    localStorage.clear('space');
    localStorage.clear('member');
  },
  methods: {
    onInput() {
      this.$forceUpdate();
    },
    changeName(val) {
      // if (val != '') {
      //   this.$forceUpdate();
      // }
    },
    getSpaceList() {
      const data = {};
      if (this.spaceSearch != '') {
        data.nameOrCode = this.spaceSearch;
      }
      getSpaceData(data).then(res => {
        if (res.code == 200) {
          this.spaceData = res.object;
          res.object.forEach(res => {
            this.levelArr.push(res.id);
          });
          if (this.spaceData.length) {
            this.$nextTick(() => {
              this.$refs.spaceTree.setCurrentKey(this.spaceData[0].id);
              this.nodeClick(this.spaceData[0]);
            });
          }
        }
      });
    },
    search() {
      this.spaceData = [];
      this.getSpaceList();
    },
    nodeClick(data) {
      // this.$refs['form'].resetFields();
      this.actionType = '';
      this.actionType = 'views';
      this.currentData = data;
      this.form.name = data.name;
      this.code = data.code;
      this.form.parentId = data.parentId;
      this.form.categoryId = data.categoryId;
      this.form.desc = data.desc;
      this.getParent(this.spaceData);
      this.levelArr.push(data.id);
      // 获取分组和所属分类
      getSpaceDetail({ id: data.id }).then(res => {
        if (res.code == 200) {
          this.editCategoryList = [res.object.category];
          const groupList = [
            { name: '关联设备', related: 'SPACE', categoryId: data.categoryId, visible: true },
            { name: '关联其他资产', related: 'SPACE', categoryId: data.categoryId, visible: true }
          ];
          const attrGroup = res.object.category.attributeGroups;
          this.groupList = groupList.concat(attrGroup);
        }
      });
    },
    // 类别树
    spaceCategory(val) {
      getCategoryQuery({ type: 'SPACE' }).then(res => {
        if (res.code == 200) {
          this.deviceList = res.object.filter(v => v.enable);
        }
      });
    },
    // 类型树
    getQueryById(node, resolve) {
      if (node.data) {
        getCategoryQuery({ type: 'SPACE', parentId: node.data.id }).then(res => {
          if (res.code == 200) {
            this.categoryList = res.object;
            // const { level } = node;
            const nodes = res.object.map(item => ({
              name: item.name,
              id: item.id,
              leaf: item.children
            }));
            resolve(nodes);
          }
        });
      }
    },
    getParent(Arr) {
      Arr.forEach(item => {
        if (item.id == this.currentData.parentId) {
          this.parentList = [item];
        } else {
          if (item.children.length) {
            this.getParent(item.children);
          }
        }
      });
    },
    changeParent(val) {
      if (val == '0') {
        this.form.categoryId = '';
        this.form.parentId = '0';
        this.$emit('form-data', this.form);
      } else {
        this.form.categoryId = [];
      }
    },
    changeCategory(val) {
      this.attributes = [];
      if (typeof this.form.categoryId != 'string') {
        this.$refs.cascaderHandle.dropDownVisible = false;
      }
      // 根据类型获取动态分组属性（添加时）
      queryByCategoryId({ type: 'SPACE', categoryId: val[val.length - 1] }).then(res => {
        if (res.code == 200) {
          const groupList = [
            { name: '关联设备', related: 'SPACE', categoryId: val[val.length - 1], visible: true },
            { name: '关联其他资产', related: 'SPACE', categoryId: val[val.length - 1], visible: true }
          ];
          this.groupList = res.object.concat(groupList);
        }
      });
    },
    // attributrs入参
    attrObject(object) {
      if (!object.length) {
        this.saveStatus = true;
      } else {
        this.saveStatus = false;
        this.attributes = object;
      }
      console.log(this.attributes);
    },
    add() {
      this.actionType = '';
      this.code = '';
      this.actionType = 'add';
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
      });
      this.saveStatus = false;
      this.parentList = [this.currentData];
      this.groupList = [];
      this.attributes = [];
    },
    edit(data, node) {
      this.currentData = data;
      this.nodeClick(data);
      this.$refs.spaceTree.setCurrentKey(data.id);
      this.actionType = 'edit';
      this.attributes = [];
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
      spaceUpdate({ id: this.delObject.id, deleted: true }).then(res => {
        if (res.code == 200) {
          const tree = this.$refs.spaceTree;
          const node = tree.getNode(this.delObject.parentId);
          tree.remove(this.delObject, node);
          this.$message.success(res.message);
          this.delVisible = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    deviceIds(val) {
      this.relatedDevice = val;
    },
    assetIds(val) {
      this.relatedAsset = val;
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.actionType == 'add') {
            const data = {
              ...this.form,
              attributeInfos: this.attributes,
              insertRelationDeviceIds: this.relatedDevice,
              insertRelationXassetIds: this.relatedAsset
            };
            if (typeof this.form.categoryId != 'string') {
              data.categoryId = this.form.categoryId[this.form.categoryId.length - 1];
            } else {
              data.categoryId = this.form.categoryId;
            }
            spaceAdd(data).then(res => {
              if (res.code == 200) {
                this.$message.success(res.message);
                this.getSpaceList();
              } else {
                this.$message.error(res.message);
              }
            });
          } else if (this.actionType == 'edit') {
            // console.log(this.form);
            spaceUpdate({
              ...this.form,
              categoryId: this.currentData.categoryId,
              id: this.currentData.id,
              attributeInfos: this.attributes.filter(v => v.attributeValue),
              insertRelationDeviceIds: this.relatedDevice,
              insertRelationXassetIds: this.relatedAsset
            }).then(res => {
              if (res.code == 200) {
                this.$message.success(res.message);
                this.getSpaceList();
              } else {
                this.$message.error(res.message);
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scope>
@import '@/styles/ui-theme';
.formFreeStyle {
  width: 670px;
  margin: 0px auto;
}
.space-search {
  width: 320px;
  position: relative;
  .searchColor {
    position: absolute;
    right: 10px;
    top: 0px;
    font-size: 22px;
    font-weight: bold;
    cursor: pointer;
    padding: 10px;
    color: $-primary-color;
  }
}
</style>
<style lang="scss">
// .space-search {
//   .el-input__inner {
//     border-color: rgb(210, 218, 234, 0.59);
//   }
// }
</style>

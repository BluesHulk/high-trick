<template>
  <div>
    <div class="action-title">
      基本属性
      <span
        v-if="typeFrom != 'views'"
        class="action-save"
        :class="{ cursor: typeFrom == 'add' && saveStatus }"
        @click="save"
      >
        保存
      </span>
      <span class="action-back" @click="back">返回</span>
    </div>
    <div class="horizontal-line"></div>
    <div class="pr-30 pl-30 pt-30">
      <div class="resource-formStyle">
        <el-form ref="form" :model="formData" :rules="formRule">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="项目名称" prop="name">
                <el-input
                  v-model="formData.name"
                  placeholder="请输入项目名称"
                  :disabled="typeFrom == 'views'"
                  @input="onInput()"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目编号">
                <el-input v-model="code" placeholder="请输入项目编号" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目位置" prop="positionDesc">
                <el-input
                  v-model="formData.positionDesc"
                  placeholder="请输入设备位置"
                  :disabled="typeFrom == 'views'"
                  @input="onInput()"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类别类型" prop="categoryId">
                <el-select v-model="formData.categoryId" :disabled="typeFrom != 'add'" @change="categoryChange">
                  <el-option :key="item.id" v-for="item in deviceList" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目日期" prop="projectTime">
                <el-date-picker
                  v-model="formData.projectTime"
                  type="date"
                  placeholder="请选择项目日期"
                  value-format="yyyy-MM-dd"
                  :editable="false"
                  :disabled="typeFrom == 'views'"
                  @input="onInput()"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目经理">
                <el-input
                  clearable
                  v-model="memberName"
                  placeholder="请选择项目经理"
                  :disabled="typeFrom == 'views'"
                  @focus="getMember"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="horizontal-line" style="margin-bottom: 30px"></div>
    <config-group
      :action-type="actionType"
      :type-state="typeState"
      :device-type="deviceType"
      :current-id="currentId"
      :current-data="currentData"
      :group-list="groupList"
      @attr-object="attrObject"
      @device-ids="deviceIds"
      @asset-ids="assetIds"
      @space-ids="spaceIds"
      @person-ids="personIds"
      @person-name="personName"
    ></config-group>
    <member v-if="visible" :visible="visible" @member-data="memberData"></member>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import configGroup from '@/views/resource/configGroup';
import member from '@/views/resource/relation/member-single';
import { projectAdd, projectUpdate, getCategoryQuery, queryByCategoryId } from '@/api/config';

export default {
  name: 'res-device-form',
  components: { configGroup, member },
  props: {
    currentData: {
      type: Object
    },
    typeFrom: {
      type: String
    },
    actionType: String
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      formData: {},
      formRule: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'change' },
          { max: 60, message: '最多输入60个字符', trigger: 'change' }
        ],
        positionDesc: [{ max: 60, message: '最多输入60个字符', trigger: 'change' }],
        categoryId: [{ required: true, message: '请选择类别类型', trigger: 'blur' }],
        projectTime: [{ required: true, message: '请选择项目日期', trigger: 'blur' }]
      },
      deviceList: [],
      managerList: [],
      code: '',
      groupList: [],
      attributes: [],
      saveStatus: false,
      typeState: false,
      currentId: '',
      deviceType: 'PROJECT',
      relatedDevice: [],
      relatedAsset: [],
      relatedPerson: [],
      relatedSpace: [],
      visible: false,
      memberName: '',
      memberNode: {}
    };
  },
  mounted() {
    this.deviceCategory();
    if (this.typeFrom != 'add') {
      this.showBack();
    } else {
      this.groupList = [];
    }
  },
  methods: {
    onInput() {
      this.$forceUpdate();
    },
    showBack() {
      this.typeState = true;
      this.currentId = this.currentData.id;
      this.formData.name = this.currentData.name;
      this.code = this.currentData.code;
      this.formData.positionDesc = this.currentData.positionDesc;
      this.formData.categoryId = this.currentData.categoryId;
      this.formData.projectTime = this.currentData.projectTime;
      this.formData.longitude = this.currentData.longitude;
      this.formData.latitude = this.currentData.latitude;
      this.groupList = [
        { name: '关联空间', related: 'PROJECT', categoryId: this.currentData.categoryId },
        { name: '关联设备', related: 'PROJECT', categoryId: this.currentData.categoryId },
        { name: '关联其他资产', related: 'PROJECT', categoryId: this.currentData.categoryId },
        { name: '关联成员', related: 'PROJECT', categoryId: this.currentData.categoryId },
        { name: '项目资料', related: 'PROJECT', categoryId: this.currentData.categoryId }
      ];
    },
    // 类别树
    deviceCategory(val) {
      getCategoryQuery({ type: 'PROJECT' }).then(res => {
        if (res.code == 200) {
          this.deviceList = res.object.filter(res => res.enable);
          if (this.currentData.code) {
            this.code = this.currentData.code;
          }
        }
      });
    },
    categoryChange(val) {
      this.attributes = [];
      const groupList = [
        { name: '关联空间', related: 'PROJECT', categoryId: this.currentData.categoryId },
        { name: '关联设备', related: 'PROJECT', categoryId: this.currentData.categoryId },
        { name: '关联其他资产', related: 'PROJECT', categoryId: this.currentData.categoryId },
        { name: '关联成员', related: 'PROJECT', categoryId: this.currentData.categoryId },
        { name: '项目资料', related: 'PROJECT', categoryId: this.currentData.categoryId }
      ];
      // 根据类型获取动态分组属性
      queryByCategoryId({ type: 'PROJECT', categoryId: val }).then(res => {
        if (res.code == 200) {
          this.groupList = groupList.concat(res.object);
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
    },
    memberData(val) {
      this.visible = false;
      if (val) {
        this.memberNode = val;
        this.memberName = val.name;
      }
    },
    getMember() {
      this.visible = true;
    },
    personName(val) {
      console.log(val);
      this.memberName = val;
    },
    deviceIds(val) {
      this.relatedDevice = val;
    },
    assetIds(val) {
      this.relatedAsset = val;
    },
    spaceIds(val) {
      this.relatedSpace = val;
    },
    personIds(val) {
      console.log(val);
      this.relatedPerson = val;
    },
    save() {
      if (this.typeFrom == 'add') {
        this.$refs['form'].validate(valid => {
          if (valid) {
            const data = {
              ...this.formData,
              attributeInfos: this.attributes,
              insertRelationDeviceIds: this.relatedDevice,
              insertRelationXassetIds: this.relatedAsset,
              insertRelationSpaceIds: this.relatedSpace,
              insertRelationPersonIds: this.relatedPerson
            };
            if (JSON.stringify(this.memberNode) != '{}') {
              data.personId = this.memberNode.id;
            }
            projectAdd(data).then(res => {
              if (res.code == 200) {
                this.$message.success('项目添加成功');
                this.$emit('submit-add');
              } else {
                this.$message.error(res.message || '项目添加失败');
              }
            });
          }
        });
      } else if (this.typeFrom == 'edit') {
        const data = {
          ...this.formData,
          id: this.currentData.id,
          insertRelationDeviceIds: this.relatedDevice,
          insertRelationXassetIds: this.relatedAsset,
          insertRelationSpaceIds: this.relatedSpace,
          insertRelationPersonIds: this.relatedPerson
        };
        if (JSON.stringify(this.attributes) != '{}') {
          data.attributeInfos = this.attributes;
        }
        if (JSON.stringify(this.memberNode) != '{}') {
          data.personId = this.memberNode.id;
        }
        projectUpdate(data).then(res => {
          if (res.code == 200) {
            this.$message.success('项目编辑成功');
            this.$emit('submit-add');
          } else {
            this.$message.error(res.message || '项目编辑失败');
          }
        });
      }
    },
    back() {
      if (this.typeFrom != 'views') {
        this.$confirm('尚未保存，确定返回吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$refs['form'].resetFields();
            this.$emit('submit-add');
          })
          .catch(() => this.$message({ type: 'info', message: '已取消' }));
      } else {
        this.$refs['form'].resetFields();
        this.$emit('submit-add');
      }
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.resource-formStyle {
  width: 1370px;
  margin: 0px auto;
  .el-form-item {
    width: 100%;
    .codeStyle {
      overflow: hidden;
      width: 100%;
    }
    .el-input,
    .el-select {
      width: 100% !important;
    }
  }
}
</style>

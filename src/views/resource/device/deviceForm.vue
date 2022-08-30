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
              <el-form-item label="设备名称" prop="name">
                <el-input
                  v-model="formData.name"
                  placeholder="请输入设备名称"
                  :disabled="typeFrom == 'views'"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备编号" prop="code">
                <div class="codeStyle">
                  <div class="float-left" style="width:30%;"><el-input v-model="cgbCode" disabled></el-input></div>
                  <div class="float-right" style="width:65%;">
                    <el-input
                      v-model="formData.code"
                      placeholder="请输入设备编号"
                      :disabled="typeFrom != 'add'"
                    ></el-input>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备位置" prop="positionDesc">
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
                <el-cascader
                  v-if="typeFrom == 'add'"
                  v-model="formData.categoryId"
                  ref="cascader"
                  :options="deviceList"
                  :props="deviceProps"
                  :show-all-levels="false"
                  :disabled="typeFrom != 'add'"
                  @change="changeCategory"
                  clearable
                ></el-cascader>
                <el-select v-if="typeFrom != 'add'" v-model="formData.categoryId" :disabled="typeFrom != 'add'">
                  <el-option
                    :key="item.id"
                    v-for="item in editCategoryList"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入库日期" prop="storageTime">
                <el-date-picker
                  v-model="formData.storageTime"
                  type="date"
                  placeholder="请选择入库日期"
                  value-format="yyyy-MM-dd"
                  :editable="false"
                  :disabled="typeFrom == 'views'"
                  @input="onInput()"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属空间" prop="spaceId">
                <el-cascader
                  ref="cascaderHandle"
                  v-model="formData.spaceId"
                  :options="spaceList"
                  :props="{ checkStrictly: true, label: 'name', value: 'id' }"
                  :show-all-levels="false"
                  :disabled="typeFrom == 'views'"
                  @change="changeSpace"
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="经度" prop="longitude">
                <el-input
                  v-model="formData.longitude"
                  placeholder="请输入经度"
                  :disabled="typeFrom == 'views'"
                  @input="onInput()"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="纬度" prop="latitude">
                <el-input
                  v-model="formData.latitude"
                  placeholder="请输入纬度"
                  :disabled="typeFrom == 'views'"
                  @input="onInput()"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="维护周期（天）" prop="maintainCycle">
                <el-input
                  v-model="formData.maintainCycle"
                  placeholder="请输入维护周期 如：12"
                  :disabled="typeFrom == 'views'"
                  @input="onInput()"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="厂家信息">
                <el-input v-model="factoryName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="协议">
                <el-input v-model="protocol" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item v-if="isSmart" label="设备通讯码" prop="communicateCode">
                <el-input
                  v-model="communicateCode"
                  placeholder="请输入设备通讯码"
                  :disabled="typeFrom == 'views'"
                  @input="onInput()"
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
    ></config-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import configGroup from '@/views/resource/configGroup';
import { deviceAdd, deviceUpdate, getCategoryQuery, getSpaceData, queryByCategoryId } from '@/api/config';

export default {
  name: 'res-device-form',
  components: {
    configGroup
  },
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
          { required: true, message: '请输入设备名称', trigger: 'change' },
          { max: 60, message: '最多输入60个字符', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入设备编号', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]+$/, message: '请输入数字或字母', trigger: 'blur' },
          { max: 56, message: '最多输入56个字符', trigger: 'blur' }
        ],
        positionDesc: [{ max: 60, message: '最多输入60个字符', trigger: 'change' }],
        categoryId: [{ required: true, message: '请选择类别类型', trigger: 'blur' }],
        storageTime: [{ required: true, message: '请选择入库时间', trigger: 'change' }],
        // communicateCode: [{ required: true, message: '请输入设备通讯码', trigger: 'blur' }],
        maintainCycle: [{ pattern: /^[1-9]+[0-9]*]*$/, message: '请输入非0正整数', trigger: 'change' }],
        longitude: [
          {
            pattern: /^-?((([0-9]\d?|1[0-7]\d)(\.\d{1,6})?)|180)$/,
            message: '请输入正确的经度范围',
            trigger: 'change'
          }
        ],
        latitude: [
          {
            pattern: /^-?((([0-9]|[1-8]\d)(\.\d{1,6})?)|90)$/,
            message: '请输入正确的纬度范围',
            trigger: 'change'
          }
        ]
      },
      cgbCode: '',
      communicateCode: '',
      spaceList: [],
      deviceList: [],
      editCategoryList: [],
      deviceProps: {
        lazy: true,
        label: 'name',
        value: 'id',
        lazyLoad: this.getQueryById
      },
      protocol: '',
      factoryName: '',
      categoryList: [],
      categoryInfo: {},
      groupList: [],
      attributes: {},
      saveStatus: false,
      typeState: false,
      currentId: '',
      deviceType: 'DEVICE',
      relatedDevice: [],
      relatedAsset: [],
      isSmart: false
    };
  },
  watch: {},
  mounted() {
    this.deviceCategory();
    this.spaceCategory();
    if (this.typeFrom != 'add') {
      // this.$refs['form'].resetFields();
      this.showBack();
      this.onInput();
    } else {
      this.groupList = [];
    }
  },
  methods: {
    onInput() {
      // this.$forceUpdate();
    },
    showBack() {
      this.typeState = true;
      this.currentId = this.currentData.id;
      this.formData.name = this.currentData.name;
      this.formData.code = this.currentData.code.replace(this.cgbCode, '');
      this.formData.positionDesc = this.currentData.positionDesc;
      this.formData.storageTime = this.currentData.storageTime;
      // this.formData.communicateCode = this.currentData.communicateCode;
      this.formData.maintainCycle = this.currentData.maintainCycle;
      this.formData.longitude = this.currentData.longitude;
      this.formData.latitude = this.currentData.latitude;
      if (this.currentData.spaceData) {
        this.formData.spaceId = this.currentData.spaceData.id;
      } else {
        this.formData.spaceId = '';
      }
      if (this.currentData.category.isSmart) {
        this.isSmart = true;
        this.communicateCode = this.currentData.communicateCode;
      } else {
        this.isSmart = false;
      }
      getCategoryQuery({ type: 'DEVICE', parentId: this.currentData.category.parentId }).then(res => {
        if (res.code == 200) {
          this.editCategoryList = res.object;
          this.formData.categoryId = this.currentData.category.id;
          this.editCategoryList.find(item => {
            if (this.currentData.category.id == item.id) {
              this.protocol = item.deviceFactory.protocol;
              this.factoryName = item.deviceFactory.name;
            }
          });
        }
      });
      this.groupList = [
        { name: '关联设备', related: 'DEVICE', categoryId: this.currentData.category.id },
        { name: '关联其他资产', related: 'DEVICE', categoryId: this.currentData.category.id },
        { name: '关联项目', related: 'DEVICE', categoryId: this.currentData.category.id }
      ];
    },
    // 类别树
    deviceCategory(val) {
      getCategoryQuery({ type: 'DEVICE' }).then(res => {
        if (res.code == 200) {
          this.deviceList = res.object;
          this.cgbCode = res.object[0].cgbCode;
          if (this.currentData.code) {
            this.formData.code = this.currentData.code.replace(this.cgbCode, '');
          }
        }
      });
    },
    // 类型树
    getQueryById(node, resolve) {
      if (node.data) {
        getCategoryQuery({ type: 'DEVICE', parentId: node.data.id }).then(res => {
          if (res.code == 200) {
            this.categoryList = res.object;
            const { level } = node;
            const nodes = res.object.map(item => ({
              name: item.name,
              id: item.id,
              leaf: level < 2
            }));
            resolve(nodes);
          }
        });
      }
    },
    // 空间树
    spaceCategory(val) {
      getSpaceData().then(res => {
        if (res.code == 200) {
          this.spaceList = this.getTreeData(res.object);
        }
      });
    },
    // 递归判断列表，把最后空数组的children设为undefined
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    // 获取厂商信息
    changeCategory(val) {
      this.attributes = [];
      // 获取编号前四位
      this.deviceList.find(item => {
        if (val[0] == item.id) {
          this.cgbCode = item.cgbCode;
        }
      });
      // 协议，厂家
      this.categoryList.find(item => {
        if (val[val.length - 1] == item.id) {
          this.protocol = item.deviceFactory.protocol;
          this.factoryName = item.deviceFactory.name;
          if (item.isSmart) {
            this.isSmart = true;
          } else {
            this.isSmart = false;
          }
        }
      });
      // 是否能挂载
      // let allowMounts = false;
      // this.deviceList.forEach(v => {
      //   if (val[0] == v.id) {
      //     allowMounts = v.allowMount;
      //   }
      // });
      // if (allowMounts) {
      //   this.groupList = [
      //     { name: '关联设备', related: 'DEVICE', categoryId: val[val.length - 1] },
      //     { name: '关联其他资产', related: 'DEVICE', categoryId: val[val.length - 1] }
      //   ];
      // } else {
      //   this.groupList = [];
      // }
      // 根据类型获取动态分组属性
      queryByCategoryId({ type: 'DEVICE', categoryId: val[val.length - 1] }).then(res => {
        if (res.code == 200) {
          const groupList = [
            { name: '关联设备', related: 'DEVICE', categoryId: val[val.length - 1] },
            { name: '关联其他资产', related: 'DEVICE', categoryId: val[val.length - 1] },
            { name: '关联项目', related: 'DEVICE', categoryId: val[val.length - 1] }
          ];
          this.groupList = groupList.concat(res.object);
        }
      });
    },
    changeSpace() {
      this.$refs.cascaderHandle.dropDownVisible = false;
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
    deviceIds(val) {
      this.relatedDevice = val;
    },
    assetIds(val) {
      this.relatedAsset = val;
    },
    save() {
      // this.$refs['form'].validate(valid => {
      //   if (valid) {
      if (this.typeFrom == 'add') {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let data = { ...this.formData, attributeInfos: this.attributes };
            if (this.formData.spaceId) {
              const spaceLen = this.formData.spaceId.length;
              data = {
                ...this.formData,
                spaceId: this.formData.spaceId[spaceLen - 1].toString()
              };
            }
            if (this.isSmart) {
              if (this.communicateCode == '') {
                this.$message.warning('该类型的设备通讯码必填！');
                return;
              }
              data = {
                ...this.formData,
                communicateCode: this.communicateCode
              };
            }
            deviceAdd({
              ...data,
              code: this.cgbCode + this.formData.code,
              categoryId: this.formData.categoryId[1].toString(),
              insertRelationDeviceIds: this.relatedDevice,
              insertRelationXassetIds: this.relatedAsset
            }).then(res => {
              if (res.code == 200) {
                this.$refs['form'].resetFields();
                this.$message.success('设备添加成功');
                this.$emit('submit-add');
              } else {
                this.$message.error(res.message || '设备添加失败');
              }
            });
          }
        });
      } else if (this.typeFrom == 'edit') {
        let data = { ...this.formData };
        if (JSON.stringify(this.attributes) != '{}') {
          data = { ...this.formData, attributeInfos: this.attributes };
        }
        if (this.formData.spaceId) {
          // console.log(this.formData.spaceId);
          if (Array.isArray(this.formData.spaceId)) {
            const spaceLen = this.formData.spaceId.length;
            data = {
              ...this.formData,
              spaceId: this.formData.spaceId[spaceLen - 1].toString()
            };
          } else {
            data = {
              ...this.formData,
              spaceId: this.formData.spaceId
            };
          }
        }
        if (this.isSmart) {
          if (this.communicateCode == '') {
            this.$message.warning('该类型的设备通讯码必填！');
            return;
          }
          data = {
            ...this.formData,
            communicateCode: this.communicateCode
          };
        }
        deviceUpdate({
          ...data,
          code: this.cgbCode + this.formData.code,
          categoryId: this.formData.categoryId,
          id: this.currentData.id,
          insertRelationDeviceIds: this.relatedDevice,
          insertRelationXassetIds: this.relatedAsset
        }).then(res => {
          if (res.code == 200) {
            this.$refs['form'].resetFields();
            this.$message.success('设备编辑成功');
            this.$emit('submit-add');
          } else {
            this.$message.error(res.message || '设备编辑失败');
          }
        });
      }
      //   }
      // });
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

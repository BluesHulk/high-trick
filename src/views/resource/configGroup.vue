<template>
  <div class="configBox">
    <div class="config-group">
      <span
        v-for="(item, index) in groupDatas"
        :key="index"
        :class="{ active: item.name == currentName }"
        @click="getGroupData(item)"
      >
        {{ item.name }}
      </span>
    </div>
    <div class="config-attritude">
      <div class="resource-formStyle">
        <el-form v-if="!related" ref="form" :model="form" class="scrollbar scrollbar-y scrollbar-light">
          <el-row :gutter="24">
            <el-col :span="6" v-for="(item, index) in form.groupAttribute" :key="item.id">
              <el-form-item
                :label="form.groupAttribute[index].name"
                :prop="'groupAttribute.' + index + '.value'"
                :rules="getRules(item)"
              >
                <!-- INT & FLOAT -->
                <el-slider
                  v-if="(item.dataType == 'INT' || item.dataType == 'FLOAT') && item.dataParam"
                  v-model="item.value"
                  show-input
                  :min="Number(paramToRange(item.dataParam).min)"
                  :max="Number(paramToRange(item.dataParam).max)"
                  :step="Number(paramToRange(item.dataParam).step)"
                  :disabled="item.upReport || actionType == 'views'"
                  @change="changeValue(item)"
                ></el-slider>
                <!-- BOOLEAN -->
                <el-radio-group
                  v-if="item.dataType == 'BOOLEAN'"
                  v-model="item.value"
                  :disabled="item.upReport || actionType == 'views'"
                  @change="changeValue(item)"
                >
                  <el-radio v-for="(item, index) in booleanList" :key="index" :label="item.label">
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
                <!-- ENUM -->
                <el-select
                  v-if="item.dataType == 'ENUM'"
                  v-model="item.value"
                  :disabled="item.upReport || actionType == 'views'"
                  @change="changeValue(item)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in paramToArr(item.dataParam)"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <!-- DATETIME -->
                <el-date-picker
                  v-if="item.dataType == 'DATETIME'"
                  v-model="item.value"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :editable="false"
                  :disabled="item.upReport || actionType == 'views'"
                  @change="changeValue(item)"
                  placeholder="请选择日期时间"
                >
                </el-date-picker>
                <!-- STRING -->
                <el-input
                  v-if="
                    (item.dataType == 'INT' || item.dataType == 'FLOAT' || item.dataType == 'STRING') && !item.dataParam
                  "
                  v-model="item.value"
                  :disabled="item.upReport || actionType == 'views'"
                  @change="changeValue(item)"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <device
        v-if="currentName == '关联设备'"
        :action-type="actionType"
        :device-type="deviceType"
        :current-data="currentData"
        :current-item="currentItem"
        :related-device="relatedDevice"
        @relation-device="relationDevice"
      ></device>
      <asset
        v-if="currentName == '关联其他资产'"
        :action-type="actionType"
        :device-type="deviceType"
        :current-data="currentData"
        :current-item="currentItem"
        :related-asset="relatedAsset"
        @relation-asset="relationAsset"
      ></asset>
      <space
        v-if="currentName == '关联空间'"
        :action-type="actionType"
        :device-type="deviceType"
        :current-data="currentData"
        :current-item="currentItem"
        :related-space="relatedSpace"
        @relation-space="relationSpace"
      ></space>
      <project
        v-if="currentName == '项目资料'"
        :action-type="actionType"
        :device-type="deviceType"
        :current-data="currentData"
        :current-item="currentItem"
      ></project>
      <member
        v-if="currentName == '关联成员'"
        :action-type="actionType"
        :device-type="deviceType"
        :current-data="currentData"
        :current-item="currentItem"
        :related-member="relatedMember"
        @relation-member="relationMember"
      ></member>
    </div>
  </div>
</template>

<script>
import { getDeviceData, getProjectDetail, getXAssetData } from '@/api/config';
import device from '@/views/resource/relation/device';
import asset from '@/views/resource/relation/asset';
import space from '@/views/resource/relation/space';
import project from '@/views/resource/relation/project';
import member from '@/views/resource/relation/member2';

export default {
  name: 'pro-add',
  components: {
    device,
    asset,
    space,
    project,
    member
  },
  props: {
    currentData: Object,
    groupList: Array,
    typeState: Boolean,
    currentId: String,
    deviceType: String,
    actionType: String
  },
  data() {
    return {
      groupDatas: [],
      form: {
        groupAttribute: []
      },
      attributeRule: {
        REQUIRED: [{ required: true, message: '请完善必填项', trigger: 'blur' }],
        INT: [{ pattern: /^-?\d+$/, message: '请输入INT类型', trigger: 'blur' }],
        STRING: [{ min: 1, max: 256, message: '请在256个字符以内', trigger: 'blur' }],
        FLOAT: [{ pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入FLOAT类型', trigger: 'blur' }]
      },
      booleanList: [
        { name: '是', label: true },
        { name: '否', label: false }
      ],
      currentName: '',
      currentItem: {},
      attrObject: [],
      related: false,
      relatedDevice: [],
      relatedAsset: [],
      relatedSpace: [],
      relatedMember: []
    };
  },
  watch: {
    groupList(newV, oldV) {
      if (!newV.length) {
        this.currentName = '';
        this.currentItem = {};
      }
      this.attrObject = [];
      // this.groupDatas = newV;
      // 生成入参的对象
      // this.attributeToObject(newV);
      // 选中第一个分组
      this.getGroupData(newV[0]);
    },
    typeState(newV, oldV) {
      this.getAttrDataBack();
    },
    currentData(newV, oldV) {
      console.log(newV);
    },
    deviceType(newV, oldV) {
      console.log(newV);
    }
  },
  created() {},
  mounted() {},
  methods: {
    getGroupData(val) {
      if (val) {
        if (val.attrType) {
          this.related = true;
        } else {
          this.related = false;
          if (val.categoryAttributes) {
            val.categoryAttributes.forEach(v => {
              if (v.dataType == 'BOOLEAN') {
                v.value = v.value != 'false';
              }
            });
          }
          this.form.groupAttribute = val.categoryAttributes;
        }
        this.currentItem = val;
        this.currentName = val.name;
      } else {
        this.form.groupAttribute = [];
      }
    },
    attributeToObject(arr) {
      arr.forEach(item => {
        if (item.categoryAttributes) {
          const categoryAttributes = item.categoryAttributes;
          categoryAttributes.forEach(val => {
            this.attrObject.push({ attributeId: val.id, attributeValue: val.value });
          });
        }
      });
      this.$emit('attr-object', this.attrObject);
    },
    paramToRange(val) {
      const newArr = val.split(',');
      const arrList = { min: newArr[1], max: newArr[0], step: newArr[2] };
      return arrList;
    },
    paramToArr(val) {
      const newArr = val.split(',');
      const arrList = [];
      newArr.forEach((element, index) => {
        var j = {};
        j.name = element;
        j.value = element;
        arrList.push(j);
      });
      return arrList;
    },
    getRules(item) {
      if (item.required) {
        if (item.dataType == 'INT') {
          return this.attributeRule.INT.concat(this.attributeRule.REQUIRED);
        } else if (item.dataType == 'STRING') {
          return this.attributeRule.STRING.concat(this.attributeRule.REQUIRED);
        } else if (item.dataType == 'FLOAT') {
          return this.attributeRule.FLOAT.concat(this.attributeRule.REQUIRED);
        } else {
          return this.attributeRule.REQUIRED;
        }
      } else {
        if (item.dataType == 'INT') {
          return this.attributeRule.INT;
        } else if (item.dataType == 'STRING') {
          return this.attributeRule.STRING;
        } else if (item.dataType == 'FLOAT') {
          return this.attributeRule.FLOAT;
        }
      }
    },
    changeValue(event) {
      console.log(this.attrObject);
      const idx = this.attrObject.findIndex(i => i.id == event.id);
      idx < 0
        ? this.attrObject.push({ attributeId: event.id, attributeValue: event.value })
        : this.attrObject.splice(idx, 1, { attributeId: event.id, attributeValue: event.value });
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit(
            'attr-object',
            this.attrObject.filter(v => v.attributeValue != null)
          );
        } else {
          this.$emit('attr-object', []);
        }
      });
    },
    getAttrDataBack() {
      if (this.deviceType == 'DEVICE') {
        getDeviceData({ id: this.currentId }).then(res => {
          if (res.code == 200) {
            const group = res.object.records[0].category.attributeGroups;
            this.groupDatas = this.groupList.concat(group);
            // 生成入参的对象
            // this.attributeToObject(this.groupDatas);
            // 选中第一个分组
            this.getGroupData(this.groupDatas[0]);
          }
        });
      } else if (this.deviceType == 'PROJECT') {
        getProjectDetail({ id: this.currentId }).then(res => {
          if (res.code == 200) {
            const group = res.object.category.attributeGroups;
            this.groupDatas = this.groupList.concat(group);
            // 生成入参的对象
            // this.attributeToObject(this.groupDatas);
            // 选中第一个分组
            this.getGroupData(this.groupDatas[0]);
            this.$emit('person-name', res.object.personName);
          }
        });
      } else if (this.deviceType == 'XASSET') {
        getXAssetData({ id: this.currentId }).then(res => {
          if (res.code == 200) {
            const group = res.object.records[0].category.attributeGroups;
            this.groupDatas = this.groupList.concat(group);
            // 生成入参的对象
            // this.attributeToObject(this.groupDatas);
            // 选中第一个分组
            this.getGroupData(this.groupDatas[0]);
          }
        });
      }
    },
    relationDevice(val) {
      this.relatedDevice = val;
      localStorage.setItem('device', JSON.stringify(val));
      const arrIds = [];
      val.forEach(res => {
        arrIds.push(res.id);
      });
      console.log(arrIds);
      this.$emit('device-ids', arrIds);
    },
    relationAsset(val) {
      this.relatedAsset = val;
      localStorage.setItem('asset', JSON.stringify(val));
      const arrIds = [];
      val.forEach(res => {
        arrIds.push(res.id);
      });
      console.log(arrIds);
      this.$emit('asset-ids', arrIds);
    },
    relationSpace(val) {
      this.relatedSpace = val;
      localStorage.setItem('space', JSON.stringify(val));
      const arrIds = [];
      val.forEach(res => {
        arrIds.push(res.id);
      });
      console.log(arrIds);
      this.$emit('space-ids', arrIds);
    },
    relationMember(val) {
      this.relatedMember = val;
      localStorage.setItem('member', JSON.stringify(val));
      const arrIds = [];
      val.forEach(res => {
        arrIds.push(res.id);
      });
      console.log(arrIds);
      this.$emit('person-ids', arrIds);
    }
  }
};
</script>

<style lang="scss" scope>
@import '@/styles/ui-theme';
.config-attritude {
  padding: 30px;
}
.config-group {
  background: $--bg-main;
  border-radius: 21px;
  height: 42px;
  display: table;
  text-align: center;
  margin: 0px auto;
  span {
    padding: 0px 31px;
    line-height: 42px;
    display: table-cell;
    cursor: pointer;
  }
  span.active {
    background: $-primary-color;
    border-radius: 21px;
    color: $--color-light;
  }
}
</style>
<style lang="scss">
.resource-formStyle {
  .el-slider {
    width: calc(100% - 15px);
    overflow: hidden;
    padding-left: 15px;
    .el-slider__input {
      width: 110px;
    }
    .el-slider__runway.show-input {
      margin-right: 125px;
    }
    .el-input-number--small {
      line-height: 36px;
    }
    .el-input--small .el-input__inner {
      height: 38px;
      line-height: 38px;
    }
  }
}
</style>

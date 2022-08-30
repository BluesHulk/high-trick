<template>
  <el-dialog :close-on-click-modal="false" width="520px" title="添加配置属性" :visible="visible" :before-close="cancel">
    <el-form ref="form" :model="form" :rules="rules" class="formFreeStyles scrollbar scrollbar-y scrollbar-light">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="字段分组" prop="groupId">
            <el-select v-model="form.groupId">
              <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段标识" prop="identify">
            <el-input v-model="form.identify"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段单位" prop="unit">
            <el-input v-model="form.unit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字段类型" prop="dataType">
            <el-select v-model="form.dataType">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <div v-if="form.dataType == 'ENUM'" class="enumType">
              <div class="enumItem" v-for="(item, index) in form.dataParam" :key="index">
                <div class="item-left float-left"><el-input v-model="item.name"></el-input></div>
                <div class="item-right float-right" @click="enumDel(item)">
                  <img src="../../../../assets/config/del.png" />
                </div>
              </div>
              <div class="enumItem">
                <div class="enumAdd item-left float-left" @click="enumAdd">新增枚举项</div>
              </div>
            </div>
            <div v-if="form.dataType == 'INT' || form.dataType == 'FLOAT'" class="enumType">
              <div class="range">
                <div>范围填写</div>
                <el-input v-model="min" class="range-min" placeholder="最小值" @change="changeRangeMin"></el-input>
                <el-input v-model="max" class="range-max" placeholder="最大值" @change="changeRangeMax"></el-input>
                <el-input v-model="step" class="range-step" placeholder="步长" @change="changeRangeStep"></el-input>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否必填" prop="required">
            <el-radio-group v-model="form.required">
              <el-radio v-for="(item, index) in requiredList" :key="index" :label="item.value">
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" :rows="2" v-model="form.desc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <PrimaryButton @click="submit">{{ $$ButtonText.ok }}</PrimaryButton>
    </div>
  </el-dialog>
</template>

<script>
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import { getGroupQuery } from '@/api/config';

export default {
  name: 'pro-add',
  components: {
    CancelButton,
    PrimaryButton
  },
  props: {
    visible: Boolean,
    groupTypeEn: String
  },
  data() {
    return {
      form: {
        groupId: '',
        name: '',
        identify: '',
        unit: '',
        dataType: 'INT',
        dataParam: [{ name: '' }],
        required: true,
        desc: ''
      },
      rules: {
        groupId: [{ required: true, message: '请选择属性分组', trigger: 'change' }],
        name: [
          { required: true, message: '请输入字段名称', trigger: 'blur' },
          { min: 1, max: 60, message: '最多只能输入60个字符', trigger: 'blur' }
        ],
        identify: [
          { required: true, message: '请输入字段标识', trigger: 'blur' },
          { pattern: /^[a-zA-Z]+$/, message: '请输入字母', trigger: 'blur' }
        ],
        unit: [{ required: true, message: '请输入字段单位', trigger: 'blur' }],
        dataType: [{ required: true, message: '请选择字段类型', trigger: 'change' }],
        desc: [{ min: 1, max: 300, message: '最多只能输入300个字符', trigger: 'blur' }]
      },
      groupList: [],
      requiredList: [
        { name: '是', value: true },
        { name: '否', value: false }
      ],
      typeList: [
        { label: '整数类型', value: 'INT' },
        { label: '文本类型', value: 'STRING' },
        { label: '布尔类型', value: 'BOOLEAN' },
        { label: '枚举类型', value: 'ENUM' },
        { label: '浮点类型', value: 'FLOAT' },
        { label: '日期类型', value: 'DATETIME' }
      ],
      attrList: [],
      groupName: '',
      max: '',
      min: '',
      step: ''
    };
  },
  watch: {
    groupTypeEn(newV, oldV) {
      console.log(newV);
      this.getGroupList(newV);
    }
  },
  created() {},
  mounted() {
    this.getGroupList(this.groupTypeEn);
  },
  methods: {
    getGroupList(val) {
      getGroupQuery({ type: val }).then(res => {
        if (res.code == 200) {
          this.groupList = res.object.filter(res => res.enable);
        }
      });
    },
    enumAdd() {
      this.form.dataParam.push({ name: '' });
    },
    enumDel(val) {
      this.form.dataParam.splice(val, 1);
    },
    changeRangeMax(val) {
      if (this.form.dataType == 'INT' && val) {
        if (!/^-?\d+$/.test(val)) {
          this.$message.error('请输入INT类型');
          this.max = '';
        }
      } else if (this.form.dataType == 'FLOAT' && val) {
        if (!/^\d+$|^\d+[.]?\d+$/.test(val)) {
          this.$message.error('请输入FLOAT类型');
          this.max = '';
        }
      }
    },
    changeRangeMin(val) {
      if (this.form.dataType == 'INT' && val) {
        if (!/^-?\d+$/.test(val)) {
          this.$message.error('请输入INT类型');
          this.min = '';
        }
      } else if (this.form.dataType == 'FLOAT' && val) {
        if (!/^\d+$|^\d+[.]?\d+$/.test(val)) {
          this.$message.error('请输入FLOAT类型');
          this.min = '';
        }
      }
    },
    changeRangeStep(val) {
      // if (this.form.dataType == 'INT' && val) {
      //   if (!/^-?\d+$/.test(val)) {
      //     this.$message.error('请输入INT类型');
      //     this.step = '';
      //   }
      // } else if (this.form.dataType == 'FLOAT' && val) {
      //   if (!/^(([0-9]{1,4})\.([0-9]{1,4}))$/.test(val)) {
      //     this.$message.error('请输入FLOAT类型');
      //     this.step = '';
      //   }
      // }
    },
    submit() {
      if (this.form.dataType == 'INT' || this.form.dataType == 'FLOAT') {
        if (this.max != '' && this.min != '' && this.step != '') {
          this.form.dataParam = [this.max, this.min, this.step];
        } else if (this.max == '' && this.min == '' && this.step == '') {
          this.form.dataParam = null;
        } else {
          this.$message.error('请完善范围填写');
          return;
        }
      }
      if (this.form.dataType != 'INT' && this.form.dataType != 'FLOAT' && this.form.dataType != 'ENUM') {
        this.form.dataParam = null;
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.groupList.forEach(res => {
            if (res.id == this.form.groupId) {
              this.groupName = res.name;
            }
          });
          console.log(this.form);
          this.attrList.push({ ...this.form, groupName: this.groupName });
          console.log(this.attrList);
          this.$emit('reset', this.attrList);
        }
      });
    },
    cancel() {
      this.$emit('reset', []);
    }
  }
};
</script>

<style lang="scss" scope>
@import '@/styles/ui-theme';
.formFreeStyles {
  max-height: 520px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: -30px;
}
.enumType {
  margin-top: 15px;
  .enumItem {
    width: 100%;
    display: inline-block;
    .item-left {
      width: calc(100% - 38px);
    }
    .item-right {
      width: 24px;
      margin-top: 8px;
    }
    .enumAdd {
      border-radius: 4px;
      border: 1px dashed #d2daea;
      margin: -5px 0 0 0;
      cursor: pointer;
      color: rgba(198, 202, 218, 1);
      text-indent: 20px;
    }
  }
  .range {
    .el-input__inner {
      padding: 0px 10px;
      font-size: 14px;
    }
    .range-max {
      width: 30%;
      float: left;
      margin-right: 5%;
    }
    .range-min {
      width: 30%;
      float: left;
      margin-right: 5%;
    }
    .range-step {
      width: 30%;
      float: left;
    }
  }
}
</style>

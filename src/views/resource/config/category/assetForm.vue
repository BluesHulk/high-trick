<template>
  <div class="formBox">
    <el-form ref="form" :model="form" :rules="formRule" class="formFreeStyle">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="类别名称" prop="name">
            <el-input v-model="form.name" :disabled="this.GlobalActionType == 'views'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级类别" prop="parentId">
            <el-select v-model="form.parentId" :disabled="this.GlobalActionType != 'add'" @change="changeParent">
              <el-option label="无" value="0"></el-option>
              <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="allowStatus">
          <el-form-item label="是否挂载属性" prop="allowMount">
            <el-radio-group v-model="form.allowMount" :disabled="this.GlobalActionType == 'views'">
              <el-radio v-for="(item, index) in requiredList" :key="index" :label="item.value">
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" v-model="form.desc" :disabled="this.GlobalActionType == 'views'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'pro-add',
  components: {},
  props: {
    currentData: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        name: '',
        parentId: '0',
        allowMount: false,
        desc: ''
      },
      formRule: {
        name: [
          { required: true, message: '请输入类别名称', trigger: 'blur' },
          { min: 1, max: 60, message: '最多只能输入60个字符', trigger: 'blur' }
        ],
        parentId: [{ required: true, message: '请选择上级类别', trigger: 'change' }],
        desc: [{ min: 1, max: 300, message: '最多只能输入300个字符', trigger: 'blur' }]
      },
      requiredList: [
        { name: '是', value: true },
        { name: '否', value: false }
      ],
      categoryList: [],
      parentList: [],
      allowStatus: true
    };
  },
  watch: {
    form: {
      handler(newV, oldV) {
        this.$emit('form-data', this.form);
      },
      deep: true
    },
    currentData(newV, oldV) {
      if (JSON.stringify(newV) != '{}') {
        this.showBack(newV);
      }
      this.parentList.push(newV);
    },
    GlobalActionType(newV, oldV) {
      if (newV == 'add') {
        this.$refs['form'].resetFields();
        this.allowStatus = false;
        this.categoryList = [{ name: this.currentData.name, id: this.currentData.id }];
        this.form.parentId = this.currentData.id;
      }
    }
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  beforeDestroy() {
    this.$refs['form'].resetFields();
  },
  created() {},
  mounted() {},
  methods: {
    validateForm() {
      let flag = null;
      this.$refs['form'].validate(valid => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    },
    showBack(val) {
      if (this.GlobalActionType != 'add') {
        if (val.parentId == '0') {
          this.allowStatus = true;
          this.categoryList = [];
          this.form.parentId = '0';
        } else {
          this.allowStatus = false;
          this.getParent(val);
        }
      } else {
        this.categoryList = [{ name: val.name, id: val.id }];
        this.form.parentId = val.id;
      }
      this.form.name = val.name;
      this.form.allowMount = val.allowMount;
      this.form.desc = val.desc;
      this.$emit('form-data', this.form);
      console.log(this.allowStatus);
    },
    getParent(node) {
      this.parentList.find(res => {
        if (node.parentId == res.id) {
          this.categoryList = [{ name: res.name, id: res.id }];
          this.form.parentId = res.id;
        }
      });
    },
    changeParent(val) {
      if (val == '0') {
        this.form.parentId = '0';
        this.allowStatus = true;
        this.$emit('form-data', this.form);
      } else {
        this.allowStatus = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
.formBox {
  width: 670px;
  margin: 0px auto;
}
</style>

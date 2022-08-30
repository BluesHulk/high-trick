<template>
  <div class="formBox">
    <el-form ref="form" :model="form" :rules="formRule" class="formFreeStyle">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="类型名称" prop="name">
            <el-input v-model="form.name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型标识" prop="identify">
            <el-input v-model="form.identify" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="currentData.factoryId">
          <el-form-item label="厂家" prop="factoryName">
            <el-input v-model="form.factoryName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="currentData.factoryId">
          <el-form-item label="协议" prop="protocol">
            <el-input v-model="form.protocol" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!currentData.factoryId">
          <el-form-item label="是否挂载属性" prop="allowMount">
            <el-radio-group v-model="form.allowMount" disabled>
              <el-radio v-for="(item, index) in requiredList" :key="index" :label="item.value">
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" v-model="form.desc" disabled></el-input>
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
        identify: '',
        factoryName: '',
        protocol: '',
        allowMount: false,
        desc: ''
      },
      formRule: {},
      requiredList: [
        { name: '是', value: true },
        { name: '否', value: false }
      ]
    };
  },
  watch: {
    currentData(newV, oldV) {
      if (JSON.stringify(newV) != '{}') {
        this.showBack(newV);
      }
    },
    GlobalActionType(newV, oldV) {
      if (newV == 'add') {
        this.$refs['form'].resetFields();
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
    showBack(val) {
      if (val.parentId == '0') {
        this.form.name = val.name;
        this.form.identify = val.identify;
        this.form.allowMount = val.allowMount || false;
        this.form.desc = val.desc;
      } else {
        this.form.name = val.name;
        this.form.identify = val.identify;
        this.form.allowMount = val.allowMount || false;
        this.form.desc = val.desc;
        this.form.factoryName = val.deviceFactory.name;
        this.form.protocol = val.deviceFactory.protocol;
      }
      this.$emit('form-data', this.form);
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

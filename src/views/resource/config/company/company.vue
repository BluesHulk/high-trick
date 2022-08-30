<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between">
        <div>
          <div class="tree-title page-title">高铁新城厂商目录</div>
        </div>
      </div>
      <div class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light">
        <List
          ref="companyData"
          padding="20px 50px"
          height="16px"
          @selected="onSelect"
          :loader="getFactoryQuery"
          @data="getCompanyList"
        >
          <div class="float-left" slot-scope="{ data }" slot="left">
            <div class="company-name" :style="{ backgroundImage: `url(${treeIcon})` }">
              {{ data.name }}
            </div>
          </div>
        </List>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <div class="page-title">查看</div>
      </div>
      <div class="page-title-wrapper a-toolbar-between">
        <el-form ref="form" :model="form" class="formFreeStyle">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="厂商名称" prop="name">
                <el-input v-model="form.name" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述" prop="description">
                <el-input type="textarea" v-model="form.description" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="horizontal-line"></div>
      <div class="page-title-wrapper a-toolbar-between">
        <div class="page-subtitle">产品协议</div>
        <el-select v-model="categoryName" @change="changeCategory">
          <el-option label="全部" value="all"></el-option>
          <el-option
            v-for="(item, index) in categoryList"
            :key="index"
            :label="item.categoryName"
            :value="item.categoryName"
          ></el-option>
        </el-select>
      </div>
      <div class="table-page-wrapper">
        <el-table :data="tableData">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="categoryName" label="设备类型"></el-table-column>
          <el-table-column prop="model" label="型号"></el-table-column>
          <el-table-column prop="protocol" label="协议"></el-table-column>
        </el-table>
      </div>
    </template>
  </TreeContent>
</template>

<script>
import { mapGetters } from 'vuex';
import TreeContent from '@/components/layout/TreeContent.vue';
import List from '@/components/list/List.vue';
import { getFactoryQuery } from '@/api/config';
import treeIcon from '../../../../assets/config/tree-company.png';

export default {
  name: 'config-company',
  components: {
    TreeContent,
    List
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      companyList: [],
      treeIcon: treeIcon,
      form: {
        name: '',
        description: ''
      },
      tableData: [],
      categoryList: [],
      categoryName: 'all',
      currentData: {}
    };
  },
  mounted() {
    // this.$refs.companyData.load();
  },
  methods: {
    getFactoryQuery,
    getCompanyList(data) {
      this.companyList = data;
    },
    onSelect(data) {
      this.categoryName = 'all';
      this.currentData = data;
      this.form.name = data.name;
      this.form.description = data.description;
      this.categoryList = this.filterArr(data.deviceFactories);
      this.tableData = data.deviceFactories;
    },
    filterArr(arr) {
      const res = new Map();
      return arr.filter(arr => !res.has(arr.categoryName) && res.set(arr.categoryName, 1));
    },
    changeCategory(data) {
      this.tableData = this.currentData.deviceFactories;
      if (data == 'all') {
        this.tableData = this.currentData.deviceFactories;
      } else {
        this.tableData = this.tableData.filter(res => res.categoryName == data);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
.company-name {
  padding-left: 36px;
  height: 16px;
  font-size: 16px;
  font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
  font-weight: 500;
  color: $--color-dark;
  line-height: 16px;
  background-repeat: no-repeat;
}
.formFreeStyle {
  width: 630px;
  margin: 0px auto;
}
.table-page-wrapper {
  margin: 30px;
}
</style>

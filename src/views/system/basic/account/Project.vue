<template>
  <el-table
    highlight-current-row
    ref="Table"
    :data="isViews ? records.filter(v => v.renderChecked) : records"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column align="center" type="index" width="260" label="序号">
      <template slot-scope="scope">
        <span>{{ formatNumber(scope.$index + 1) }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" show-overflow-tooltip label="角色名称" prop="name"></el-table-column>
    <el-table-column align="center" show-overflow-tooltip label="操作" width="260px">
      <template slot-scope="scope">
        <!--{{ scope.row.renderChecked }}-->
        <a-el-checkbox
          :class="getCheckboxClass(scope.row)"
          :disabled="isViews"
          :id="scope.row.id"
          @change="changeCheckbox(scope.row)"
          v-model="scope.row.renderChecked"
        ></a-el-checkbox>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { resourceProjectDataQueryProjectList } from '@/api/resource';

export default {
  name: 'project',
  props: {
    currentNode: Object,
    actionType: String
  },
  data() {
    return {
      recordsBak: [],
      records: [],
      selection: []
    };
  },
  computed: {
    isViews() {
      return this.actionType === this.$$ActionType.views;
    },
    isAdd() {
      return this.actionType === this.$$ActionType.add;
    },
    isEdit() {
      return this.actionType === this.$$ActionType.edit;
    }
  },
  methods: {
    changeCheckbox(row) {
      console.log(row);
    },
    getCheckboxClass(model) {
      // console.log(model);
      return [`checkbox-${this.actionType}`];
    },
    formatNumber(number) {
      return number < 10 ? '0' + number : number;
    },
    handleSelectionChange(val) {
      this.selection = val;
    },
    loadData() {
      return resourceProjectDataQueryProjectList().then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.records = object;
          this.recordsBak = [].concat(object);
        }
      });
    }
  }
};
</script>

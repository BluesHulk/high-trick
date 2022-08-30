<template>
  <el-table
    highlight-current-row
    ref="roleTable"
    :data="records"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <!--<el-table-column align="center" label="序号" type="index" width="260px"></el-table-column>-->

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
import { roleQueryPage } from '@/api/rbac';

export default {
  name: 'role',
  props: {
    currentNode: Object,
    actionType: String
  },
  data() {
    return {
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
      this.$$ALoading.show();
      this.records = [];
      this.selection = [];
      const params = {
        enable: true,
        params: 'enable'
      };
      params.whetherPage = true;
      roleQueryPage(params)
        .then(res => {
          const { code, object } = res;

          if (code === 200 && this.$$util.isObject(object)) {
            const { records } = object;
            if (Array.isArray(records)) {
              // this.roleLoaded = true;
              // this.roleSize = object.size;
              // this.roleTotal = total;
              const rec = records.map(value => ({
                ...value,
                renderChecked: (this.currentNode.roleId || '').includes(value.id)
              }));
              this.records = this.isViews ? rec.filter(v => v.renderChecked) : rec;
            }
          }
        })
        .finally(() => {
          this.$$ALoading.close();
        });
    }
  }
};
</script>

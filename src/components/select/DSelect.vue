<template>
  <div class="my-select">
    <el-select
      v-for="(arrItem, key) in selectList"
      :key="key"
      v-model="selectArr[key]"
      filterable
      placeholder="请选择"
      value-key="value"
      @change="selected"
      @focus="position = key"
      style="margin: 0 10px"
    >
      <el-option v-for="item in arrItem" :key="item.value" :label="item.label" :value="item"> </el-option>
    </el-select>
  </div>
</template>

<script>
import { resourceCategoryList } from '@/api/resource';

export default {
  name: 'd-select',
  props: {
    parentId: [String, Number],
    type: String, // 空间或资产
    assetType: String
  },
  data() {
    return {
      position: null,
      selectArr: [],
      selectList: []
    };
  },
  created() {
    this.getCateList(this.parentId);
  },
  methods: {
    reload() {
      this.position = null;
      this.selectArr = [];
      this.selectList = [];
      this.getCateList(this.parentId);
    },
    async getCateList(parentId) {
      const res = await resourceCategoryList({
        parentId,
        type: this.type,
        assetType: this.assetType
      });
      const { success, object } = res;
      if (success && Array.isArray(object)) {
        if (parentId == null) {
          this.selectList.push(object.map(val => ({ ...val, label: val.name, value: val.id })));
        }
      }
      return res;
    },
    async addSelectList(index, item) {
      const res = await this.getCateList(item.id);
      const { success, object } = res;
      if (success && Array.isArray(object)) {
        return object.map(val => ({ ...val, label: val.name, value: val.id }));
      }
      return [];
    },
    async selected(item) {
      const nextSelect = await this.addSelectList(this.position, item);
      if (nextSelect.length) {
        this.selectList.splice(this.position + 1, this.selectList.length, nextSelect);
      } else {
        this.selectList.splice(this.position + 1, this.selectList.length);
      }
      this.selectArr.splice(this.position + 1, this.selectArr.length);
      const ids = this.selectArr.map(value => value.id);
      this.$emit('change', ids);
    }
  }
};
</script>

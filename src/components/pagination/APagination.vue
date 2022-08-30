<template>
  <div class="text-right">
    <el-pagination
      background
      :current-page.sync="tableData.current"
      :page-size="pageSize"
      :page-sizes="$store.state.pageSizes || pageSizes"
      :layout="layout"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="$emit('current-change', tableData.current)"
      :hide-on-single-page="hideOnSinglePage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'a-pagination',
  props: {
    hideOnSinglePage: {
      type: Boolean,
      required: false,
      default: false
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50, 100, 200]
    },
    tableData: {
      type: Object,
      default: () => ({
        current: 1,
        pages: 0,
        records: [],
        size: 10,
        total: 0
      })
    },
    layout: String
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('size-change', val);
    }
  }
};
</script>

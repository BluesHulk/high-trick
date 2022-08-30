<template>
  <el-table
    ref="multipleTable"
    :data="records"
    :row-key="rowKey"
    :tooltip-effect="tooltipEffect"
    style="width: 100%"
    v-bind="$attrs"
    :size="size"
    :width="width"
    :height="height"
    :max-height="maxHeight"
    :fit="fit"
    :stripe="stripe"
    :border="border"
    :show-header="showHeader"
    :show-summary="showSummary"
    :sum-text="sumText"
    :summary-method="summaryMethod"
    :row-class-name="rowClassName"
    :row-style="rowStyle"
    :cell-class-name="cellClassName"
    :cell-style="cellStyle"
    :header-row-class-name="headerRowClassName"
    :header-row-style="headerRowStyle"
    :header-cell-class-name="headerCellClassName"
    :header-cell-style="headerCellStyle"
    :highlight-current-row="highlightCurrentRow"
    :current-row-key="currentRowKey"
    :empty-text="emptyText"
    :expand-row-keys="expandRowKeys"
    :default-expand-all="defaultExpandAll"
    :default-sort="defaultSort"
    :span-method="spanMethod"
    :select-on-indeterminate="selectOnIndeterminate"
    :indent="indent"
    :tree-props="treeProps"
    :lazy="lazy"
    :load="load"
    @select="select"
    @select-all="selectAll"
    @selection-change="selectionChange"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
    @cell-click="cellClick"
    @cell-dblclick="cellDblclick"
    @row-click="rowClick"
    @row-contextmenu="rowContextmenu"
    @row-dblclick="rowDblclick"
    @header-click="headerClick"
    @header-contextmenu="headerContextmenu"
    @filter-change="filterChange"
    @current-change="currentChange"
    @header-dragend="headerDragend"
    @expand-change="expandChange"
    @sort-change="sortChange"
  >
    <el-table-column
      v-for="(item, index) in columns"
      :key="index"
      :label="item.label"
      :type="item.type"
      :class-name="item.className"
      :label-class-name="item.labelClassName"
      :prop="item.prop"
      :width="item.width"
      :min-width="item.minWidth"
      :render-header="item.renderHeader"
      :sortable="item.sortable"
      :sort-method="item.sortMethod"
      :sort-by="item.sortBy"
      :resizable="item.resizable"
      :column-key="item.columnKey"
      :align="item.align"
      :header-align="item.headerAlign"
      :show-overflow-tooltip="true"
      :fixed="item.fixed"
      :formatter="item.formatter"
      :selectable="item.selectable"
      :reserve-selection="item.reserveSelection"
      :filter-method="item.filterMethod"
      :filtered-value="item.filteredValue"
      :filters="item.filters"
      :filter-placement="item.filterPlacement"
      :filter-multiple="item.filterMultiple"
      :index="item.index"
      :sort-orders="item.sortOrders"
    >
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'a-table',
  props: {
    records: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    size: String,
    width: [String, Number],
    height: [String, Number],
    maxHeight: [String, Number],
    fit: {
      type: Boolean,
      default: true
    },
    stripe: Boolean,
    border: Boolean,
    rowKey: [String, Function],
    showHeader: {
      type: Boolean,
      default: true
    },
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    highlightCurrentRow: Boolean,
    currentRowKey: [String, Number],
    emptyText: String,
    expandRowKeys: Array,
    defaultExpandAll: Boolean,
    defaultSort: Object,
    tooltipEffect: String,
    spanMethod: Function,
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    },
    treeProps: {
      type: Object,
      default() {
        return {
          hasChildren: 'hasChildren',
          children: 'children'
        };
      }
    },
    lazy: Boolean,
    load: Function
  },
  mounted() {
    this.$emit('table', this.$refs.multipleTable);
  },
  methods: {
    select(selection, row) {
      this.$emit('select', selection, row);
    },
    selectAll(selection) {
      this.$emit('select-all', selection);
    },
    selectionChange(val) {
      this.$emit('selection-change', val);
    },
    cellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event);
    },
    cellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event);
    },
    cellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event);
    },
    cellDblclick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event);
    },
    rowClick(row, column, event) {
      this.$emit('row-click', row, column, event);
    },
    rowContextmenu(row, column, event) {
      this.$emit('row-contextmenu', row, column, event);
    },
    rowDblclick(row, column, event) {
      this.$emit('row-dblclick', row, column, event);
    },
    headerClick(column, event) {
      this.$emit('header-click', column, event);
    },
    headerContextmenu(column, event) {
      this.$emit('header-contextmenu', column, event);
    },
    filterChange(filters) {
      this.$emit('filter-change', filters);
    },
    currentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow);
    },
    headerDragend(newWidth, oldWidth, column, event) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event);
    },
    expandChange(row, expandedRows) {
      this.$emit('expand-change', row, expandedRows);
    },
    sortChange(val) {
      this.$emit('sort-change', val);
    }
    // props
    // rowKey(row) {
    //   let fn = this.$parent.getRowKey;
    //   const name = this.$parent.$options.name;
    //   if (name === 'ElDialog') {
    //     fn = this.$parent.$parent.getRowKey;
    //   }
    //   if (typeof fn === 'function') return fn(row);
    //   if (typeof fn !== 'string' || typeof fn !== 'function') return null;
    // }
  }
};
</script>

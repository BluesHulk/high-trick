<template>
  <div class="box">
    <tree-transfer
      ref="wl-tree-transfer"
      filter
      draggable
      high-light
      check-strictly
      :mode="mode"
      :title="title"
      :placeholder="placeholder"
      :to_data="toData"
      :from_data="initfromData"
      :filterNode="filterNode"
      :defaultProps="defaultProps"
      :defaultCheckedKeys="defaultCheckedKeys"
      :defaultExpandedKeys="[2, 3]"
      @right-check-change="rightCheckChange"
      @left-check-change="leftCheckChange"
      @remove-btn="remove"
      @add-btn="add"
      node_key="id"
    >
    </tree-transfer>
  </div>
</template>

<script>
import treeTransfer from 'el-tree-transfer'; // 引入
export default {
  name: 'el-tree-transfer',
  data() {
    return {
      mode: 'transfer', // transfer addressList
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    };
  },
  props: ['initfromData', 'toData', 'defaultCheckedKeys', 'title', 'placeholder'], // 左侧数据 右侧数据 左侧默认选中数据
  created() {
    this.$nextTick(() => {
      // this.defaultCheckedKeys = [1];
    });
  },
  mounted() {
    setTimeout(() => {}, 1000);
  },
  methods: {
    // 设置选中
    setChecked() {
      this.$refs['wl-tree-transfer'].setChecked([3], [2]);
    },
    // 清除选中
    clearChecked() {
      this.$refs['wl-tree-transfer'].clearChecked();
    },
    // 自定义筛选函数
    filterNode(value, data, where) {
      console.log(value, data, where);
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },

    // 添加按钮
    add(initfromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('initfromData:', initfromData);
      console.log('toData:', toData);
      console.log('obj:', obj);
    },
    // 移除按钮
    remove(initfromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('initfromData:', initfromData);
      console.log('toData:', toData);
      console.log('obj:', obj);
    },
    // 左侧源数据选中事件
    leftCheckChange(nodeObj, treeObj, checkAll) {
      console.log(nodeObj);
      console.log(treeObj);
      console.log(checkAll);
    },
    // 右侧目标数据选中事件
    rightCheckChange(nodeObj, treeObj, checkAll) {
      console.log(nodeObj);
      console.log(treeObj);
      console.log(checkAll);
    },

    // 标题自定义区点击事件
    handleTitleRight() {
      alert('标题自定义区点击事件');
    }
  },
  components: { treeTransfer }
};
</script>

<style>
.btn {
  border: 1px solid #ebeef5;
  padding: 5px 10px;
  background-color: #f5f7fa;
  outline: none;
}

.my-title-right {
  float: right;
  font-size: 12px;
  cursor: pointer;
}
</style>

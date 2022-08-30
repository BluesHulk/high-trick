<template>
  <div class="tree-menu">
    <TreeItem
      v-for="(item, index) in data"
      :key="index"
      :model="item"
      :step="20"
      :default-props="defaultProps"
      :index="index"
    ></TreeItem>
  </div>
</template>

<script>
import TreeItem from './TreeItem';

export default {
  props: {
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'nodes',
        label: 'name'
      })
    },
    data: Array
  },
  components: {
    TreeItem
  },
  data() {
    return {
      open: false
      // treeData: [
      //   {
      //     createdUser: null,
      //     updatedUser: null,
      //     createdTime: null,
      //     updatedTime: null,
      //     id: '1336656142432071681',
      //     code: 'F001',
      //     name: '系统权限管理',
      //     path: '/',
      //     parentId: '0',
      //     enable: true,
      //     deleted: false,
      //     nodes: [
      //       {
      //         createdUser: null,
      //         updatedUser: null,
      //         createdTime: null,
      //         updatedTime: null,
      //         id: '1336656142604038145',
      //         code: 'F001001',
      //         name: '组织管理',
      //         path: '/update',
      //         parentId: '0',
      //         enable: true,
      //         deleted: false,
      //         nodes: [
      //           {
      //             createdUser: null,
      //             updatedUser: null,
      //             createdTime: null,
      //             updatedTime: null,
      //             id: '1336656142750838785',
      //             code: 'F001001001',
      //             name: '查询组织',
      //             path: '/organize/add',
      //             parentId: '0',
      //             enable: true,
      //             deleted: false,
      //             nodes: null,
      //             checked: false
      //           },
      //           {
      //             createdUser: null,
      //             updatedUser: null,
      //             createdTime: null,
      //             updatedTime: null,
      //             id: '1336656143191240705',
      //             code: 'F001001002',
      //             name: '修改组织',
      //             path: '/organize/update',
      //             parentId: '0',
      //             enable: true,
      //             deleted: false,
      //             nodes: null,
      //             checked: false
      //           },
      //           {
      //             createdUser: null,
      //             updatedUser: null,
      //             createdTime: null,
      //             updatedTime: null,
      //             id: '1336656143258349569',
      //             code: 'F001001003',
      //             name: '删除组织',
      //             path: '/organize/query',
      //             parentId: '0',
      //             enable: true,
      //             deleted: false,
      //             nodes: null,
      //             checked: false
      //           },
      //           {
      //             createdUser: null,
      //             updatedUser: null,
      //             createdTime: null,
      //             updatedTime: null,
      //             id: '1336656143581310978',
      //             code: 'F001001004',
      //             name: '新增组织',
      //             path: '/organize/add',
      //             parentId: '0',
      //             enable: true,
      //             deleted: false,
      //             nodes: null,
      //             checked: false
      //           }
      //         ],
      //         checked: false
      //       }
      //     ],
      //     checked: false
      //   }
      // ]
    };
  }
};
</script>

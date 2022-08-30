<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between">
        <div>
          <div class="tree-title page-title">高铁新城组织架构</div>
          <div class="count-people">
            <div class="people">{{ count }}</div>
          </div>
        </div>
        <CircleButton :type="$$ActionType.add" @click="addOrg">{{ $$ButtonText.plus }}</CircleButton>
      </div>
      <div class="tree-content-wrapper has-import pl-30 scrollbar scrollbar-y scrollbar-light">
        <!--<Tree
          ref="orgTree"
          :current-node="currentNode"
          @data="getTreeData"
          @selected="onNodeSelected"
          @init="initTree"
          class="pr-30"
          @node-click="nodeClick"
          @edit="editTree"
          @del="delTree"
          :loader="organizeQueryFuncTree"
          :default-expanded-keys="defaultExpandedKeys"
        ></Tree>-->
        <el-tree
          ref="pTree"
          highlight-current
          :data="treeNodes"
          node-key="value"
          :default-expanded-keys="defaultExpandedKeys"
          :expand-on-click-node="false"
        >
          <div
            @click="onClick(node, data, $event)"
            class="custom-tree-node float-container"
            slot-scope="{ node, data }"
          >
            <div class="float-left">
              <div class="float-left" style="max-width: 280px">
                <el-tooltip class="show-dot" effect="dark" :content="data && data.label" placement="top">
                  <div>{{ data && data.label }}</div>
                </el-tooltip>
              </div>
              <div class="float-left node-count">{{ data.staffNum }}</div>
            </div>
            <div class="float-right">
              <TreeButton data-id="edit" :type="$$ActionType.edit"></TreeButton>
              <TreeButton data-id="delete" :type="$$ActionType.delete"></TreeButton>
            </div>
          </div>
        </el-tree>
      </div>
      <div class="tree-import" @click="showImport">
        <div class="horizontal-line"></div>
        <div class="import text-center">导入数据</div>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <template v-if="actionType === $$ActionType.add || actionType === $$ActionType.edit">
          <div class="page-title">{{ $$ButtonText[actionType] }}部门</div>
          <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
        </template>
        <div v-else class="page-title">查看</div>
      </div>
      <!--<AForm
        class="centered mb-14"
        gutter="30"
        width="670"
        ref="autoForm"
        v-model="formData"
        :col="2"
        :elements="elements"
        :rules="rules"
        inline
        stretch
      ></AForm>-->
      <OrgAdd v-if="isAdd" ref="OrgAdd" :tree-nodes="treeNodes" class="mb-30"></OrgAdd>
      <OrgForm
        v-if="isViews || isEdit"
        ref="OrgForm"
        :tree-nodes="treeNodes"
        class="mb-30"
        :action-type="actionType"
        :node-data="currentNode"
      ></OrgForm>
      <div class="horizontal-line"></div>
      <div class="page-title-wrapper a-toolbar-between">
        <div class="page-subtitle">所属人员</div>
        <template v-if="actionType === $$ActionType.add || actionType === $$ActionType.edit">
          <ActionButton @click="addMember" :type="$$ActionType.add">{{ $$ButtonText.plus }}</ActionButton>
        </template>
      </div>
      <div class="pl-30 pr-30">
        <ATable
          highlight-current-row
          ref="tableRef"
          :records="records.filter(val => !val.deleted)"
          :columns="columns"
          @table="getTable"
          @sort-change="sort"
          @selection-change="handleSelectionChange"
        ></ATable>
        <div class="lazy-org-member"></div>
      </div>
    </template>
    <Import @reset="dialogReset" :title="dialogTitle" :visible="dialogVisible"></Import>
    <Member
      v-if="memberAction === $$ActionType.add || memberAction === $$ActionType.edit"
      :action-type="memberAction"
      :row-data="rowData"
      :members="treeNodes"
      @reset="memberReset"
      @data="getMemberData"
      :title="memberTitle"
      :org-id="orgId"
    ></Member>
    <DeleteModal
      :data="rowData"
      :display-key="delDisplayKey"
      :visible="visibleDel"
      @reset="resetDelModal"
      @submit="deleteSubmit"
    ></DeleteModal>
  </TreeContent>
</template>

<script>
import ActionButton from '@/components/button/ActionButton.vue';
import CircleButton from '@/components/button/CircleButton.vue';
import ATable from '@/components/table/ATable';
import DeleteModal from '@/components/modal/DelModal.vue';

import TreeContent from '@/components/layout/TreeContent.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';

import Import from './org/Import';
import Member from './org/Member';

import OrgAdd from './org/Add';
import OrgForm from './org/Form';
import TreeButton from '@/components/button/TreeButton.vue';

import {
  staffQueryPage,
  organizeQueryFuncTree,
  organizeQueryNodeContainStaff,
  // organizeUpdate,
  // staffDelete,
  organizeDelete,
  // organizeAdd,
  organizeSaveOrgAndStaff
} from '@/api/rbac';

const columns = vm => [
  {
    label: '标记',
    prop: 'key_person',
    align: 'center',
    showOverflowTooltip: true,
    formatter(row) {
      const h = vm.$createElement;
      const staticClass = !vm.isViews ? 'img-pointer' : '';
      return h('img', {
        attrs: {
          src: row.keyPerson
            ? require('../../../assets/basic/key_person.png')
            : require('../../../assets/basic/key_person-n.png')
        },
        on: {
          click() {
            if (!vm.isViews) vm.toggleTag(row);
          }
        },
        staticClass
      });
    }
  },
  {
    label: '名称',
    prop: 'name',
    showOverflowTooltip: true
  },
  {
    label: '照片',
    prop: 'photoUrl',
    showOverflowTooltip: true,
    formatter(row) {
      if (!row.photoUrl) return null;
      const h = vm.$createElement;
      const src = row.photoUrl;
      return h('div', { staticClass: 'cell-img-wrapper' }, [
        h('img', {
          attrs: { src }
        })
      ]);
    }
  },
  {
    label: '手机号码',
    prop: 'phone',
    showOverflowTooltip: true
  },
  {
    label: '邮箱',
    prop: 'email',
    showOverflowTooltip: true
  },
  {
    label: '操作',
    formatter(row, column, cellValue, index) {
      const h = vm.$createElement;
      const edit = h(
        'span',
        {
          on: {
            click() {
              vm.onCellEdit(row, index);
            }
          },
          staticClass: 'cell-btn primary-underline'
        },
        '编辑'
      );
      const del = h(
        'span',
        {
          on: {
            click() {
              vm.delDisplayKey = 'name';
              vm.onCellDel(row, index);
            }
          },
          staticClass: 'cell-btn delete-underline'
        },
        '删除'
      );
      return vm.isViews ? null : h('span', { staticClass: 'cell-buttons' }, [edit, del]);
    }
  }
];

export default {
  name: 'org',
  components: {
    // AForm,
    OrgAdd,
    OrgForm,
    ATable,
    ActionButton,
    CircleButton,
    PrimaryButton,
    DeleteModal,
    Import,
    TreeButton,
    Member,
    TreeContent
  },
  computed: {
    isAdd() {
      return this.actionType === this.$$ActionType.add;
    },
    isViews() {
      return this.actionType === this.$$ActionType.views;
    },
    isEdit() {
      return this.actionType === this.$$ActionType.edit;
    }
  },
  data() {
    return {
      // elements: [],
      // formData: {
      //   parentId: '',
      //   name: '',
      //   desc: ''
      // },
      // rules: {
      //   // spaceName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      //   // name: [{ validator: validName, required: true, message: '请输入中文或英文或数字', trigger: 'change' }]
      // },
      // dialog
      dialogTitle: '',
      dialogVisible: false,
      orgId: '',
      memberTitle: '',
      memberAction: '',
      // tree
      currentNode: null,
      treeNodes: [],
      defaultExpandedKeys: [],
      // table
      tableRef: null,
      columns: columns(this),
      records: [
        // { key_person: true, email: '1@1.com', phone: 13312345678, name: 'nameisname', photoUrl: 'data:image/png;base64,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' },
        // { key_person: false, email: '1@1.com', phone: 13312345678, name: 'name', photoUrl: 'data:image/png;base64,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' }
      ],
      recordsBak: [],
      // recordsIds: [],
      addData: {},
      modifyIndex: null,
      modifyId: null,
      multipleSelection: [],
      rowData: {},
      visibleDel: false,
      delDisplayKey: '',
      deleteSubmit: () => {}, // Function
      count: 0,
      // 分页请求
      // size: 50,
      // loaded: false,
      current: 1,
      // actionType
      actionType: this.$$ActionType.views
    };
  },
  // watch: {
  //   actionType() {
  //     this.setRules();
  //   }
  // },
  created() {
    this.staffQueryPage();
  },
  mounted() {
    this.organizeQueryFuncTree().then(() => {
      this.selectNode();
    });
  },
  methods: {
    // loadPage() {
    //   const intersectionObserver = new IntersectionObserver(entries => {
    //     if (entries[0].intersectionRatio <= 0) return;
    //     if (this.total && this.total < this.size) return;
    //     if (!this.loaded) {
    //       this.size += 50;
    //     } else {
    //       this.size = 50;
    //     }
    //     this.loaded = this.total < this.size;
    //     this.loadOrgNode();
    //   });
    //   intersectionObserver.observe(document.querySelector('.lazy-org-member'));
    // },
    // setRules() {
    //   const validName = (rule, value, callback) => {
    //     const re = /[\u4e00-\u9fa5A-Za-z\d]/g;
    //     if (re.test(value)) {
    //       callback();
    //     } else {
    //       callback(new Error('请输入中文或英文或数字或部分字符'));
    //     }
    //   };
    //   const validDesc = (rule, value, callback) => {
    //     if (value === '') {
    //       this.$refs.autoForm.clearValidate('desc');
    //       callback();
    //     } else {
    //       if (value && value.length > 50) {
    //         callback(new Error(`字符索不能超过50个`));
    //       } else {
    //         callback();
    //       }
    //     }
    //   };
    //   switch (this.actionType) {
    //     case this.$$ActionType.add:
    //     case this.$$ActionType.edit:
    //       this.rules = {
    //         name: [{ validator: validName, required: true, message: '请输入中文或英文或数字', trigger: 'blur' }],
    //         desc: [{ validator: validDesc, message: '描述字数在50字内', trigger: 'blur' }]
    //       };
    //       break;
    //     case this.$$ActionType.views:
    //       this.rules = {};
    //       this.$nextTick(() => {
    //         this.$refs.autoForm && this.$refs.autoForm.clearValidate(['name', 'desc']);
    //       });
    //       break;
    //   }
    // },
    staffQueryPage() {
      staffQueryPage().then(res => {
        const { code, object } = res;
        if (code === 200 && this.$$util.isObject(object)) {
          this.count = object.total;
        }
      });
    },
    organizeQueryFuncTree() {
      return organizeQueryFuncTree().then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.treeNodes = JSON.parse(
            JSON.stringify(object)
              .replace(/"name":/g, '"label":')
              .replace(/"id":/g, '"value":')
              .replace(/"nodes":/g, '"children":')
          );
        }
      });
    },
    selectNode(node) {
      this.$nextTick(() => {
        if (node) {
          node.label = node.name;
          node.value = node.id;
        }
        node = node || this.currentNode || this.treeNodes[0];
        this.$refs.pTree && this.$refs.pTree.setCurrentKey(node.value);
        this.onNodeSelected(node || this.$refs.pTree.getCurrentNode());
      });
    },
    onClick(node, data, event) {
      const { target } = event;
      const { dataset } = target;
      switch (dataset.id) {
        case 'edit':
          this.editTree(data, node);
          break;
        case 'delete':
          this.delTree(data, node);
          break;
        default:
          this.nodeClick(data);
      }
    },
    // button
    addOrg() {
      // this.formData.parentId = '';
      // this.formData.name = '';
      // this.formData.desc = '';
      this.records = [];
      this.actionType = this.$$ActionType.add;
      // this.setElements();
    },
    // getDiffData() {
    //   const list = [];
    //   for (let i = 0; i < this.recordsBak.length; i++) {
    //     const rb = this.recordsBak[i];
    //     for (let j = 0; j < this.records.length; j++) {
    //       const r = this.records[j];
    //       if (JSON.stringify(rb) === JSON.stringify(r)) continue;
    //       const exists = list.find(ii => ii.id === r.id);
    //       if (!exists) list.push(r);
    //     }
    //   }
    //   return list;
    // },
    add() {
      const formData = this.$refs.OrgAdd.formData;
      const organize = { name: formData.name, desc: formData.desc };
      if (Array.isArray(formData.parentId)) {
        organize.parentId = formData.parentId[formData.parentId.length - 1];
      }
      const staff = this.records.concat();
      const data = { organize };
      for (let i = 0; i < staff.length; i++) {
        const sta = staff[i];
        if (!sta.id) {
          sta.keyPerson = false;
          sta.deleted = false;
        }
        // GT20201103-151
        // sta.headPortraitUrl = sta.photoUrl;
      }
      data.staff = staff;
      this.$$ALoading.show();
      organizeSaveOrgAndStaff(data)
        .then(res => {
          const { code, message, object } = res;
          if (code === 200) {
            this.addData = object;
            this.$message.success(message || '添加成功');
            this.records = [];
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.organizeQueryFuncTree().then(() => {
            this.selectNode(this.addData);
          });
          this.$$ALoading.close();
          this.staffQueryPage();
          this.actionType = this.$$ActionType.views;
          // this.currentNode && this.orgTree && this.orgTree.setCurrentKey(this.currentNode.value);
          // this.loadOrgNode();
          // this.records = [];
          // this.$refs.orgTree.load();
        });
    },
    edit() {
      const formData = this.$refs.OrgForm.formData;
      const organize = { name: formData.name, desc: formData.desc };
      if (Array.isArray(formData.parentId)) {
        organize.parentId = formData.parentId[formData.parentId.length - 1];
      }
      const staff = this.records.concat();
      const data = { organize };
      for (let i = 0; i < staff.length; i++) {
        const sta = staff[i];
        if (!sta.id) {
          sta.keyPerson = false;
          sta.deleted = false;
        }
        // GT20201103-151
        // sta.headPortraitUrl = sta.photoUrl;
      }
      data.staff = staff;
      data.organize.id = this.currentNode.value;
      data.id = this.currentNode.value;
      data.organize.parentId = this.currentNode.parentId;
      this.$$ALoading.show();
      // organizeUpdate(data)
      organizeSaveOrgAndStaff(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '添加成功');
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.organizeQueryFuncTree().then(() => {
            this.$$ALoading.close();
            this.staffQueryPage();
            this.actionType = this.$$ActionType.views;
            // this.setElements();
            this.$refs.pTree.setCurrentKey(this.currentNode.value);
            this.currentNode = this.$refs.pTree.getCurrentNode();
            // this.setFormData();
            this.loadOrgNode();
            this.$store.dispatch('refreshUserInfo');
            // this.$refs.orgTree.load();
          });
        });
    },
    save() {
      if (this.actionType === this.$$ActionType.add) {
        this.add();
      } else if (this.actionType === this.$$ActionType.edit) {
        this.edit();
      }
    },
    addMember() {
      this.modifyIndex = null;
      this.modifyId = null;
      this.memberAction = this.$$ActionType.add;
      this.memberTitle = '添加人员';
    },
    orgChange(node) {
      this.orgId = node[node.length - 1];
      // this.$refs.orgTree.selectNode(node);
    },
    // setElements() {
    //   this.elements = [
    //     {
    //       label: '上级组织架构',
    //       prop: 'parentId',
    //       type: this.$$FormItem.Cascader,
    //       labelPosition: 'top',
    //       placeholder: '请选择上级组织架构',
    //       clearable: true,
    //       disabled: !this.isAdd,
    //       change: value => {
    //         this.orgChange(value);
    //       },
    //       props: { checkStrictly: true },
    //       options: this.treeNodes
    //     },
    //     {
    //       label: '组织架构名称',
    //       placeholder: '组织架构名称',
    //       prop: 'name',
    //       type: this.$$FormItem.Input,
    //       labelPosition: 'top',
    //       disabled: this.isViews
    //     },
    //     {
    //       label: '描述',
    //       prop: 'desc',
    //       type: this.$$FormItem.Textarea,
    //       placeholder: '请输入描述',
    //       labelPosition: 'top',
    //       resize: 'none',
    //       disabled: this.isViews
    //     }
    //   ];
    // },
    // dialog
    showImport() {
      this.dialogTitle = '组织架构人员信息导入';
      this.dialogVisible = true;
    },
    dialogReset() {
      this.dialogTitle = '';
      this.dialogVisible = false;
      this.$refs.orgTree.load();
    },
    filter(arr = []) {
      const o = {};
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const key = i + '-' + item.orgId + '-' + item.name + '-' + item.phone + '-' + item.email;
        // if (item.id) {
        //   if (!this.recordsIds.includes(item.id)) {
        //     o[JSON.stringify(item)] = item;
        //   } else {
        //     for (const p in o) {
        //       if (o[p].id === item.id) {
        //         delete o[p];
        //         o[JSON.stringify(item)] = item;
        //       }
        //     }
        //   }
        // } else {
        //   o[JSON.stringify(item)] = item;
        // }
        o[key] = item;
      }
      return Object.values(o);
    },
    getMemberData(data) {
      if (this.modifyIndex != null) {
        const len = this.records.length;
        let index = this.modifyIndex;
        for (let i = 0; i < len; i++) {
          if (data.id && data.id === this.records[i].id) {
            index = i;
            break;
          }
        }
        this.$set(this.records, index, data);
      } else {
        this.records = this.filter(this.records.concat(data));
      }
    },
    memberReset() {
      this.memberTitle = '';
      this.memberAction = '';
      // this.$refs.orgTree.load();
    },
    // tree
    loadOrgNode() {
      if (!this.currentNode) return;
      const id = this.currentNode.value;
      this.$$ALoading.show();
      // organizeQueryNodeContainStaff({ id, size: this.size })
      organizeQueryNodeContainStaff({ id, size: this.currentNode.staffNum })
        .then(res => {
          const { code, object } = res;
          if (code === 200 && this.$$util.isObject(object)) {
            const { records } = object;
            if (Array.isArray(records)) {
              // this.size = size;
              // this.total = total;
              // this.loaded = this.total < this.size;
              this.records = records;
              this.recordsBak = [].concat(records);
            }
          }
        })
        .finally(() => {
          this.$$ALoading.close();
        });
    },
    getTreeData(nodes) {
      this.treeNodes = nodes;
      this.defaultExpandedKeys = nodes.map(val => val.value);
    },
    nodeClick(node) {
      this.actionType = this.$$ActionType.views;
      this.currentNode = node;
      // this.loaded = false;
      // this.total = 0;
      // this.setFormData();
      // this.setElements();
      this.loadOrgNode();
    },
    onNodeSelected(node) {
      // this.actionType = this.$$ActionType.views;
      this.currentNode = node;
      // this.loaded = false;
      // this.total = 0;
      // this.setFormData();
      // this.setElements();
      this.loadOrgNode();
      // this.loadPage();
    },
    // setFormData() {
    //   this.formData.parentId = this.currentNode.parentId;
    //   this.formData.name = this.currentNode.label;
    //   this.formData.desc = this.currentNode.desc;
    //   this.formData.id = this.currentNode.value;
    // },
    // initTree(tree) {
    //   this.orgTree = tree;
    // },
    editTree(data, node) {
      this.currentNode = data;
      this.actionType = this.$$ActionType.edit;
      // this.formData.parentId = data.parentId;
      // this.formData.name = data.label;
      // this.formData.desc = data.desc;
      // this.formData.id = data.value;
      // this.setFormData();
      // this.setElements();
      this.loadOrgNode();
      return false;
    },
    delTree(data, node) {
      if (data.children) {
        this.$message.info(`当前节点有子节点，不可删除`);
        return;
      }
      this.visibleDel = true;
      this.rowData = data;
      this.delDisplayKey = 'label';
      this.deleteSubmit = this.deleteOrg;
    },
    deleteOrg() {
      if (!this.rowData) {
        this.$message.info('数据不完整');
        return;
      }
      if (!this.rowData.value) {
        this.$message.info('数据不完整');
        return;
      }
      organizeDelete(this.rowData.value)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '删除成功');
          } else {
            this.$message.error(message || '删除失败');
          }
        })
        .finally(() => {
          this.visibleDel = false;
          this.staffQueryPage();
          this.currentNode = null;
          this.organizeQueryFuncTree().then(() => {
            this.rowData = {};
            this.selectNode();
          });
        });
    },
    // table
    getTable(tab) {
      this.tableRef = tab;
    },
    sort(val) {
      this.tableRef.clearSelection();
      this.loadOrgNode();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    toggleTag(row) {
      row.keyPerson = !row.keyPerson;
    },
    // row
    onCellEdit(row, index) {
      this.modifyIndex = index;
      this.memberAction = this.$$ActionType.edit;
      this.memberTitle = '编辑人员';
      this.rowData = row;
    },
    // del staff
    onCellDel(row, index) {
      // GT20201103-173
      // row.deleted = true;
      this.modifyIndex = index;
      this.modifyId = row.id;
      this.rowData = row;
      this.visibleDel = true;
      this.deleteSubmit = this.delStaff;
    },
    resetDelModal() {
      if (this.rowData) {
        this.rowData.deleted = false;
        for (let i = 0; i < this.records.length; i++) {
          if (this.rowData.id === this.records[i].id) {
            this.$set(this.records, i, this.rowData);
          }
        }
      }
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    delStaff() {
      // GT20201103-173
      let index = this.modifyIndex;
      for (let i = 0; i < this.records.length; i++) {
        const r = this.records[i];
        if (r.id === this.modifyId) {
          index = i;
          break;
        }
      }
      const data = this.records[index];
      if (data.id) {
        this.$set(this.records[index], 'deleted', true);
      } else {
        this.records.splice(this.modifyIndex, 1);
      }
      this.visibleDel = false;
      // if (!this.rowData) {
      //   this.$message.info('数据不完整');
      //   return;
      // }
      // if (!this.rowData.id) {
      //   this.$message.info('数据不完整');
      //   return;
      // }
      // staffDelete(this.rowData.id)
      //   .then(res => {
      //     const { code, message } = res;
      //     if (code === 200) {
      //       this.$message.success(message || '删除成功');
      //     } else {
      //       this.$message.error(message || '删除失败');
      //     }
      //   })
      //   .finally(() => {
      //     this.rowData = null;
      //     this.$refs.orgTree.load();
      //   });
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.tree-title {
  margin-bottom: 6px;
}
.count-people {
  display: inline-block;
  padding: 7px 10px;
  height: 16px;
  background: rgba(0, 220, 195, 0.06);
  border-radius: 4px;
  .people {
    color: $--color-regular;
    padding-left: 25px;
    background: url(../../../assets/people.png) 0 center no-repeat;
  }
}
.img-pointer {
  cursor: pointer;
}
</style>

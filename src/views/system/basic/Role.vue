<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between">
        <div>
          <div class="tree-title page-title">高铁新城角色管理</div>
        </div>
        <CircleButton :type="$$ActionType.add" @click="addRole">{{ $$ButtonText.plus }}</CircleButton>
      </div>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loaded"
        infinite-scroll-distance="10"
        class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light"
      >
        <div class="list-wrapper" ref="DataList">
          <div
            style="padding: 20px 50px; height: 16px"
            class="float-container list-item"
            :class="{ selected: index === currentIndex }"
            v-for="(item, index) in roleList"
            :key="index"
            @click="onSelect(index, item, $event)"
          >
            <div class="float-left">
              <div
                class="role-name"
                :style="{
                  backgroundImage: `url(${
                    !item.selected
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABR0lEQVQ4T6WSvUrEUBCFz0S20kp8AQXtxCyxVbcw0SaJgu9gY2OjpBIsRMXCzgewFMG7drn+oK1mc9cyvVotNnayGQmykr+NAaece+abOTOX8M+gfH3TFA4zjkGYBPAExFtKrqthfTKAptleYuZ7ENL5D+5rs907+1U3RQRgOgWLMoA586pNIDvfjUB7oXT2y6bIAizxSIyFgpBwqnx3+0+AbgkPjIO8kEErXen4ST5nI2vBMJ4b8fjbJYN/bDCYNDoKfcertcSBqGmJRWaa0mLudG7dl6pLF85Y51ukbERktK4n+o34DMAqgLEKQA9E5yO9950g2Pwa6Eg3xQWAjWKhNgPEyd0zQcxeeLN2mAZ8AhjNC5V0EzgXwfSgpNNKA0pEyXP5BAAFSjrzNQBDD5cDWEKCsVxn+wzEBO1ESXv3d4I6hVWab2mqdA76/OavAAAAAElFTkSuQmCC'
                      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABPklEQVQ4T6WSvUoDURCFv1kSELT0BZJNoo1dumSjoKCNVj6GjY2SSrAQFQs7H8BSbCy1CGajjT+InfmzspQ0gmCSHTGQrMndNQtOOZz57pwzV/hniTHfrKzh6SFIAtE7LGuDRO4p7J1hwOvtPN1uCfD7QovO1xwzi2/U3SqQHsCE6jCg4V6grBqviexg53eDthgBVMqoOgGAY+z85nhArVJEdM8QWtYyydxlr//bhmFB7+PUP8+RgQ1FOMB2itFC7KuaNwW8bpIOj8wWnv+6tHnGKP+ib6Nn4aU0TSx2grICTIXOq75jWae0JrbIZtt9ndBwz1DWzeS9DGr93H24lCJpZ98H1MofiEwawpQj1F0N2OialLPgA4JFIPEM2jY3gAdSTnY8IDzMEUDDvUJZihI+4CEcYTvb/gYRJ8Nk34q4ZHzgHum1AAAAAElFTkSuQmCC'
                  })`
                }"
              >
                <el-tooltip effect="dark" :content="item.name" placement="top">
                  <div class="role-text show-dot">{{ item.name }}</div>
                </el-tooltip>
              </div>
            </div>
            <div class="float-right">
              <ImageButton :src="ButtonImage[item.enable]" data-id="enabled"></ImageButton>
              <div class="edit" data-id="edit"></div>
              <div class="delete" @click.stop="del(item)"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <template v-if="actionType === $$ActionType.add || actionType === $$ActionType.edit">
          <div class="page-title">{{ $$ButtonText[actionType] }}角色</div>
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
        :elements="elements"
        :rules="rules"
      ></AForm>-->
      <RoleAdd v-if="isAdd" ref="RoleAdd" class="mb-30"></RoleAdd>
      <RoleForm
        v-if="isViews || isEdit"
        ref="RoleForm"
        class="mb-30"
        :action-type="actionType"
        :node-data="currentNode"
      ></RoleForm>
      <div class="horizontal-line"></div>
      <ActionWrapper class="page-title-wrapper a-toolbar-between" style="margin-bottom: 40px; padding-right: 60px">
        <div class="page-subtitle">功能权限目录</div>
        <div class="all-checked-box" :class="allCheckboxClass" v-if="isViews"></div>
        <div class="all-checked-box" :class="allCheckboxClass" v-else @click="checkAll"></div>
      </ActionWrapper>
      <div style="padding-left: 80px; padding-right: 60px">
        <a-el-tree
          :indent="30"
          inline
          level
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="authCode"
          default-expand-all
          :default-checked-keys="defaultCheckedKeys"
          :expand-on-click-node="false"
          :class="CheckboxClass"
          @check-change="onCheckChange"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <span>{{ data.name }}</span>
          </span>
        </a-el-tree>
      </div>
    </template>
    <DeleteModal
      :data="currentNode"
      :display-key="delDisplayKey"
      :visible="visibleDel"
      @reset="resetDelModal"
      @submit="deleteSubmit"
    ></DeleteModal>
  </TreeContent>
</template>

<script>
import TreeContent from '@/components/layout/TreeContent.vue';
import CircleButton from '@/components/button/CircleButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import ImageButton from '@/components/button/ImageButton.vue';
// import AForm from '@/components/form/AForm';
import DeleteModal from '@/components/modal/DelModal.vue';
// import AuthTree from '@/components/tree/auth/AuthTree.vue';

import ButtonImage from '@/constants/ButtonImage';

import { roleQueryPage, frontQueryFrontTree, roleAdd, roleUpdate, roleDelete } from '@/api/rbac';
import ActionWrapper from '@/components/action/ActionWrapper.vue';

import { mapGetters } from 'vuex';

// import RoleAdd from './role/Add';
// import RoleForm from './role/Form';

export default {
  name: 'org',
  components: {
    // RoleTree,
    // RTree,
    ActionWrapper,
    DeleteModal,
    // AuthTree,
    // AForm,
    CircleButton,
    PrimaryButton,
    ImageButton,
    // ListPage,
    TreeContent
  },
  computed: {
    CheckboxClass() {
      return [`checkbox-` + this.actionType];
    },
    // allCheckboxClass() {
    //   return this.getAllCheckboxClass();
    // },
    ...mapGetters(['GlobalActionType']),
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
  data() {
    return {
      allCheckboxClass: '',
      currentIndex: 0,
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      treeData: [],
      treeList: [],
      defaultCheckedKeys: [],
      actionType: 'views',
      currentNode: {}, // 当前选中的树节点
      ButtonImage,
      roleList: [],
      // elements: [],
      // formData: {
      //   name: '',
      //   desc: ''
      // },
      // rules: {
      //   // spaceName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      //   // name: [{ required: true, message: '请输入名称', trigger: 'change' }]
      // },
      // 分页请求
      size: 0,
      total: 0,
      loaded: false,
      current: 1,
      deleteSubmit: () => {}, // Function
      primaryKey: 'authCode',
      delDisplayKey: 'name',
      visibleDel: false
    };
  },
  watch: {
    actionType() {
      this.setElements();
      this.setRules();
    },
    defaultCheckedKeys() {
      this.allCheckboxClass = this.getAllCheckboxClass();
      console.log(this.allCheckboxClass);
    }
  },
  created() {
    this.setElements();
  },
  methods: {
    async loadMore() {
      if (this.total < this.size) return;
      this.loaded = true;
      this.size += 50;
      this.$$ALoading.show();
      const res = await roleQueryPage({ size: this.size });
      const { code, object } = res;
      if (code === 200 && this.$$util.isObject(object)) {
        const { records, total } = object;
        if (Array.isArray(records)) {
          this.loaded = false;
          this.size = object.size;
          this.total = total;
          this.roleList = records;
        }
      }
      this.$$ALoading.close();
      this.onSelect(this.currentIndex);
    },
    onCheckChange(data, checked) {
      this.allCheckboxClass = this.getAllCheckboxClass();
    },
    upgrade(array) {
      const fn = (arr, grade) => {
        for (let i = 0; i < arr.length; i++) {
          const it = arr[i];
          it.grade = grade + 1;
          it.disabled = this.isViews;
          if (it.children) {
            fn(it.children, it.grade);
          }
        }
      };
      for (let i = 0; i < array.length; i++) {
        const td = array[i];
        td.grade = 1;
        td.disabled = this.isViews;
        if (td.children && td.children.length) {
          fn(td.children, td.grade);
        }
      }
      return array;
    },
    setRules() {
      const validName = (rule, value, callback) => {
        const re = /[\u4e00-\u9fa5A-Za-z\d]/g;
        if (re.test(value)) {
          callback();
        } else {
          callback(new Error('请输入中文或英文或数字或部分字符'));
        }
      };
      const validDesc = (rule, value, callback) => {
        if (value === '') {
          this.$refs.autoForm.clearValidate('desc');
          callback();
        } else {
          if (value.length > 50) {
            callback(new Error(`字符索不能超过50个`));
          } else {
            callback();
          }
        }
      };
      switch (this.actionType) {
        case this.$$ActionType.add:
        case this.$$ActionType.edit:
          this.rules = {
            name: [{ validator: validName, required: true, message: '请输入中文或英文或数字', trigger: 'blur' }],
            desc: [{ validator: validDesc, message: '描述字数在50字内', trigger: 'blur' }]
          };
          break;
        case this.$$ActionType.views:
          this.rules = {};
          this.$nextTick(() => {
            this.$refs.autoForm && this.$refs.autoForm.clearValidate(['name', 'desc']);
          });
          break;
      }
    },
    getAllCheckboxClass() {
      const editable = this.isAdd || this.isEdit;
      const sl = this.defaultCheckedKeys.length;
      if (editable) {
        const checkedNodes = this.$refs.tree.getCheckedNodes();
        if (!checkedNodes.length || !this.treeList.length) return [`${this.actionType}-unchecked`];
        if (this.treeList.length > checkedNodes.length) {
          return [`${this.actionType}-half`];
        }
        return [`${this.actionType}-checked`];
      }
      if (this.$refs.tree) {
        const checkedNodes = this.$refs.tree.getCheckedNodes();
        const half = this.$refs.tree.getHalfCheckedKeys();
        if (!half.length && !checkedNodes.length) return [`${this.actionType}-unchecked`];
        return [`${this.actionType}-checked`];
      }
      if (!sl) return [`${this.actionType}-unchecked`];
      return [`${this.actionType}-half`];
    },
    checkAll() {
      this.defaultCheckedKeys = this.defaultCheckedKeys.length ? [] : this.getLastNodes();
      this.$refs.tree.setCheckedKeys(this.defaultCheckedKeys);
    },
    loadTreeData() {
      const ids = (!this.isAdd ? this.currentNode.functionAuthCode || [] : []).join(',');
      const params = {};
      switch (this.actionType) {
        case this.$$ActionType.views:
          ids.length && (params.nodes = ids);
          break;
        case this.$$ActionType.edit:
          params.check = true;
          params.nodes = ids;
          break;
        case this.$$ActionType.add:
          break;
      }
      this.$$ALoading.show();
      // funcQueryFuncTree(params, true)
      frontQueryFrontTree(params)
        .then(res => {
          const { code, object } = res;
          if (code === 200 && Array.isArray(object)) {
            const data = JSON.parse(JSON.stringify(object).replace(/"nodes":/g, '"children":'));
            this.treeData = this.upgrade(data);
            this.treeList = this.getTreeList(data);
            if (this.isAdd) {
              this.defaultCheckedKeys = this.getLastNodes();
            }
          }
        })
        .finally(() => {
          this.$$ALoading.close();
          this.allCheckboxClass = this.getAllCheckboxClass();
        });
    },
    getTreeList(tree) {
      const list = [];
      for (const i in tree) {
        const node = tree[i];
        list.push(node.authCode);
        if (node.children && node.children.length !== 0) {
          this.toListDF(node.children, list); // 遍历子树,并加入到list中.
        }
      }
      return list;
    },
    toListDF(tree, list) {
      for (const i in tree) {
        const node = tree[i];
        list.push(node.authCode);
        if (node.children && node.children.length !== 0) {
          this.toListDF(node.children, list);
        }
      }
    },
    getLastNodes() {
      const res = [];
      const fn = arr => {
        for (let i = 0; i < arr.length; i++) {
          const ii = arr[i];
          if (Array.isArray(ii.children)) {
            fn(ii.children);
          } else {
            res.push(ii[this.primaryKey]);
          }
        }
      };
      fn(this.treeData.concat());
      return res;
    },
    // button
    addRole() {
      // this.resetFormData();
      this.actionType = this.$$ActionType.add;
      this.$store.dispatch('SetGlobalActionType', this.actionType);
      this.treeData = [];
      this.treeList = [];
      this.defaultCheckedKeys = [];
      this.loadTreeData();
    },
    save() {
      switch (this.actionType) {
        case this.$$ActionType.add:
          this.addRoleFunc();
          break;
        case this.$$ActionType.edit:
          this.editRoleFunc();
          break;
      }
    },
    addRoleFunc() {
      const functionAuthCode = this.getCheckedNodes();
      this.$$ALoading.show();
      roleAdd({ ...this.$refs.RoleAdd.formData, functionAuthCode: functionAuthCode.join(',') })
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '添加成功');
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.$$ALoading.close();
          this.roleList = [];
          this.actionType = this.$$ActionType.views;
          this.size = 0;
          this.currentIndex = 0;
          this.loadMore();
        });
    },
    getCheckedNodes() {
      const nodes = this.$refs.tree.getCheckedNodes();
      const keys = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.children == null) {
          keys.push(node.authCode);
        }
      }
      return keys;
    },
    editRoleFunc() {
      const keys = this.getCheckedNodes();
      this.$$ALoading.show();
      roleUpdate({ ...this.$refs.RoleForm.formData, functionAuthCode: keys.join(','), id: this.currentNode.id })
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '修改成功');
          } else {
            this.$message.error(message || '修改失败');
          }
        })
        .finally(() => {
          this.roleList = [];
          this.$$ALoading.close();
          this.actionType = this.$$ActionType.views;
          this.size = 0;
          this.loadMore();
          this.onSelect(this.currentIndex);
        });
    },
    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    delRole() {
      if (!this.currentNode) {
        this.$message.info('数据不完整');
        return;
      }
      if (!this.currentNode.id) {
        this.$message.info('数据不完整');
        return;
      }
      roleDelete(this.currentNode.id)
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
          this.roleList = [];
          this.currentNode = {};
          this.size = 0;
          this.currentIndex = 0;
          this.loadMore();
        });
    },
    setElements() {
      this.elements = [
        {
          label: '角色名称',
          placeholder: '请输入角色名称',
          prop: 'name',
          type: this.$$FormItem.Input,
          labelPosition: 'top',
          style: `width: 320px`,
          disabled: this.isViews
        },
        {
          label: '描述',
          prop: 'desc',
          type: this.$$FormItem.Textarea,
          placeholder: '请输入描述',
          labelPosition: 'top',
          resize: 'none',
          disabled: this.isViews
        }
      ];
    },
    // select node
    enabled(data) {
      roleUpdate({ enable: !data.enable, id: data.id })
        .then(res => {
          this.roleList = [];
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '更新成功');
          } else {
            this.$message.error(message || '更新失败');
          }
        })
        .finally(() => {
          this.size = 0;
          this.currentIndex = 0;
          this.loadMore();
        });
    },
    // resetFormData() {
    //   this.formData.name = '';
    //   this.formData.desc = '';
    // },
    // setFormData() {
    //   this.formData.name = this.currentNode.name;
    //   this.formData.desc = this.currentNode.desc;
    // },
    edit(data) {
      this.currentNode = data;
      this.actionType = this.$$ActionType.edit;
      this.$store.dispatch('SetGlobalActionType', this.actionType);
      // this.formData.name = this.currentNode.name;
      // this.formData.desc = this.currentNode.desc;
      this.loadTreeData();
    },
    del(data) {
      this.currentNode = data;
      this.visibleDel = true;
      this.deleteSubmit = this.delRole;
    },
    onSelect(index, item, event) {
      this.currentIndex = index;
      if (!item) item = this.roleList[index || 0];
      if (!item) return;
      for (let i = 0; i < this.roleList.length; i++) {
        const d = this.roleList[i];
        if (d.id !== item.id) {
          this.$set(d, 'selected', false);
        }
      }
      item.selected = true;
      this.currentNode = item;
      const { target } = event || {};
      const { dataset } = target || {};
      switch ((dataset || {}).id) {
        case 'enabled':
          this.enabled(item);
          this.actionType = this.$$ActionType.views;
          // this.setFormData();
          break;
        case 'edit':
          this.edit(item);
          this.actionType = this.$$ActionType.edit;
          break;
        default:
          this.actionType = this.$$ActionType.views;
          // this.setFormData();
          this.loadTreeData();
      }
      this.defaultCheckedKeys = item.functionAuthCode;
      this.$store.dispatch('SetGlobalActionType', this.actionType);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
.role-name {
  padding-left: 36px;
  height: 16px;
  font-size: 16px;
  font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
  font-weight: 500;
  color: $--color-dark;
  //line-height: 24px;
  background-repeat: no-repeat;
}
.role-text {
  max-width: 280px;
}
.all-checked-box {
  width: 18px;
  height: 18px;
  background-repeat: no-repeat;
}
.all-checked-box.edit-unchecked {
  background-image: url($--unchecked-edit);
}
.all-checked-box.edit-checked {
  background-image: url($--checked-edit);
}
.all-checked-box.edit-half {
  background-image: url($--half);
}
.all-checked-box.views-unchecked {
  background-image: url($--unchecked-views);
}
.all-checked-box.views-checked {
  background-image: url($--checked-views);
}
.all-checked-box.views-half {
  background-image: url($--half);
}
</style>
<style lang="scss">
@import '@/styles/ui-theme';
.level-1-node {
  position: relative;
  .a-el-tree-node__expand-icon {
    color: $-primary-color;
    margin-right: 6px;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
    .custom-tree-node {
      margin-left: 10px;
    }
  }
  .expanded.a-el-tree-node__expand-icon {
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  > .a-el-tree-node__content {
    margin-bottom: 40px;
    .a-el-checkbox {
      position: absolute;
      right: 0;
    }
  }
  /*.a-el-checkbox__input.is-checked,
  .is-checked {
    .a-el-checkbox__inner {
      background: url($--checked-edit) center no-repeat;
    }
  }*/
}
.level-2-node {
  position: relative;
  margin-bottom: 10px;
  > .a-el-tree-node__content {
    padding-left: 56px !important;
    margin-bottom: 40px;
    position: relative;
    &:after {
      display: block;
      content: '';
      position: absolute;
      top: 36px;
      height: 1px;
      background-color: rgba(229, 233, 243, 0.49);
      width: calc(100% - 56px);
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
    }
    .a-el-tree-node__expand-icon {
      display: none;
    }
    .a-el-checkbox {
      position: absolute;
      right: 0;
    }
  }
  /*.a-el-checkbox__input.is-checked,
  .is-checked {
    .a-el-checkbox__inner {
      background: url($--checked-edit) center no-repeat;
    }
  }*/
}
.level-3-node {
  margin-bottom: 20px;
  > .a-el-tree-node__content {
    padding-left: 56px !important;
    // float: left;
    display: flex;
    .a-el-checkbox {
      position: relative;
    }
    .a-el-checkbox__input {
      position: absolute;
    }
    .custom-tree-node {
      margin-left: 34px;
      // float: right;
      margin-top: 4px;
    }
    .a-el-tree-node__expand-icon {
      display: none;
    }
  }
  /*.a-el-checkbox__input.is-checked,
  .is-checked {
    .a-el-checkbox__inner {
      background: url($--checked-edit) center no-repeat;
    }
  }*/
}
.level-3-node + .level-3-node {
  margin-right: 24px;
}
.level-4-node {
  padding-top: 20px;
  .is-leaf {
    display: none;
  }
  .a-el-checkbox {
    margin-right: 20px;
    position: relative;
    top: 3px;
  }
}
</style>

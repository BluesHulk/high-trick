<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between">
        <el-select
          clearable
          @clear="queryByType"
          v-model="templateType"
          placeholder="请选择模板类型"
          class="input-container float-left mr-20"
          style="width: 320px"
          @change="queryByType"
        >
          <el-option v-for="key in Object.keys(types)" :key="key" :label="types[key]" :value="key"></el-option>
        </el-select>
        <CircleButton :type="$$ActionType.add" @click="add">{{ $$ButtonText.add }}</CircleButton>
      </div>
      <div class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light">
        <div class="list-wrapper" ref="DataList">
          <div
            style="padding: 20px 50px; height: 46px"
            class="float-container list-item"
            :class="{ selected: index === currentIndex }"
            v-for="(item, index) in templateList"
            :key="index"
            @click="onSelect(index, item, $event)"
          >
            <div class="message-template-item float-left">
              <el-tooltip class="show-dot" effect="dark" :content="item.name" placement="top">
                <div class="message-template-name">{{ item.name }}</div>
              </el-tooltip>
              <div class="message-type">{{ types[item.type] }}</div>
            </div>
            <div class="float-right">
              <el-tooltip effect="dark" content="启用" placement="top">
                <ImageButton :src="ButtonImage[item.enabled]" data-id="enabled"></ImageButton>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <div class="edit" data-id="edit"></div>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top">
                <div class="delete" @click.stop="del(item)"></div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="lazy-loader"></div>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <template v-if="isAdd || isEdit">
          <div class="page-title">{{ $$ButtonText[actionType] }}</div>
          <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
        </template>
        <div v-else class="page-title">查看</div>
      </div>
      <Views v-if="isViews" :form-data="formData" :types="types"></Views>
      <Edit ref="editTemp" v-if="isEdit" :form-data="formData" :types="types" :rules="rules"></Edit>
      <Add ref="addTemp" v-if="isAdd" :form-data="formData" :types="types" :rules="rules"></Add>
    </template>
    <DeleteModal
      :data="currentNode"
      display-key="name"
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
import DeleteModal from '@/components/modal/DelModal.vue';
import Views from './template/Views';
import Edit from './template/Edit';
import Add from './template/Add';

import ButtonImage from '@/constants/ButtonImage';

import {
  queryByType,
  templateTypes,
  templateAdd,
  templateUpdate,
  templateDelete,
  templateEnableFlag
} from '@/api/message';

import rules from './template/rules';

export default {
  name: 'message-template',
  components: {
    Add,
    Edit,
    Views,
    DeleteModal,
    CircleButton,
    PrimaryButton,
    ImageButton,
    TreeContent
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
  data() {
    return {
      types: {},
      templateType: '',
      currentIndex: 0,
      actionType: 'views',
      currentNode: {}, // 当前选中的树节点
      ButtonImage,
      templateList: [],
      formData: {
        name: '',
        type: '',
        distribution: ['WEB'],
        title: '',
        content: ''
      },
      rules: {
        // spaceName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        // name: [{ required: true, message: '请输入名称', trigger: 'change' }]
      },
      // 分页请求
      current: 1,
      deleteSubmit: () => {}, // Function
      visibleDel: false
    };
  },
  mixins: [rules],
  watch: {
    actionType() {
      this.setRules();
    }
  },
  mounted() {
    this.templateTypes().then(() => {
      this.queryByType();
    });
  },
  methods: {
    // setRules() {
    //   const validName = (rule, value, callback) => {
    //     const re = /[\u4e00-\u9fa5A-Za-z\d]/g;
    //     if (re.test(value)) {
    //       callback();
    //     } else {
    //       callback(new Error('请输入中文或英文或数字或部分字符'));
    //     }
    //   };
    //   const validType = (rule, value, callback) => {
    //     if (value) {
    //       callback();
    //     } else {
    //       callback(new Error('请选择类别'));
    //     }
    //   };
    //   const validTitle = (rule, value, callback) => {
    //     value = value.replace(/(^\s+)|(\s+$)/g, '');
    //     if (value) {
    //       callback();
    //     } else {
    //       callback(new Error('请输入标题'));
    //     }
    //   };
    //   const validCont = (rule, value, callback) => {
    //     const len = value.replace(/(^\s+)|(\s+$)/g, '').length;
    //     if (len && value.length && value.length < 60) {
    //       callback();
    //     } else {
    //       callback(new Error('请消息内容字符个数在1~60个字'));
    //     }
    //   };
    //   // const validDesc = (rule, value, callback) => {
    //   //   if (value === '') {
    //   //     this.$refs.autoForm.clearValidate('content');
    //   //     callback();
    //   //   } else {
    //   //     if (value.length > 50) {
    //   //       callback(new Error(`字符索不能超过50个`));
    //   //     } else {
    //   //       callback();
    //   //     }
    //   //   }
    //   // };
    //   switch (this.actionType) {
    //     case this.$$ActionType.add:
    //     case this.$$ActionType.edit:
    //       this.rules = {
    //         name: [{ validator: validName, required: true, message: '请输入中文或英文或数字', trigger: 'blur' }],
    //         type: [{ validator: validType, required: true, message: '请选择类别', trigger: 'blur' }],
    //         title: [{ validator: validTitle, required: true, message: '请输入标题', trigger: 'blur' }],
    //         content: [{ validator: validCont, message: '请填写消息内容', trigger: 'blur' }]
    //       };
    //       break;
    //     case this.$$ActionType.views:
    //       this.rules = {};
    //       // this.$nextTick(() => {
    //       //   this.$refs.autoForm && this.$refs.autoForm.clearValidate(['name', 'content']);
    //       // });
    //       break;
    //   }
    // },
    // onTypeChange(val) {
    //   console.log(val);
    // },
    templateTypes() {
      return templateTypes().then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.types = object;
        }
      });
    },
    queryByType() {
      this.$$ALoading.show();
      const data = {};
      if (this.templateType) data.type = this.templateType;
      queryByType(data)
        .then(res => {
          const { code, object } = res;

          if (code === 200 && Array.isArray(object)) {
            this.templateList = object;
            this.onSelect(0 || this.currentIndex);
          }
        })
        .finally(() => {
          this.$$ALoading.close();
        });
    },
    // button
    add() {
      this.formData = {
        name: '',
        type: '',
        distribution: ['WEB'],
        title: '',
        content: ''
      };
      this.actionType = this.$$ActionType.add;
    },
    save() {
      // this.$refs.autoForm.submitForm().then(valid => {
      //   if (!valid) return;
      //   switch (this.actionType) {
      //     case this.$$ActionType.add:
      //       this.addTemplate();
      //       break;
      //     case this.$$ActionType.edit:
      //       this.editTemplate();
      //       break;
      //   }
      // });
      switch (this.actionType) {
        case this.$$ActionType.add:
          this.$refs.addTemp.$refs.form.validate(valid => {
            if (!valid) return;
            this.addTemplate();
          });
          break;
        case this.$$ActionType.edit:
          this.$refs.editTemp.$refs.form.validate(valid => {
            if (!valid) return;
            this.editTemplate();
          });
          break;
      }
    },
    addTemplate() {
      this.$$ALoading.show();
      const { distribution, ...rest } = this.$refs.addTemp.formData;
      const data = { ...rest };
      data.distribution = distribution.join('_');
      templateAdd(data)
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
          this.templateList = [];
          this.actionType = this.$$ActionType.views;
          this.queryByType();
        });
    },
    editTemplate() {
      this.$$ALoading.show();
      const { distribution, ...rest } = this.formData;
      const data = { ...rest };
      if (Array.isArray(distribution)) data.distribution = distribution.join('_');
      data.id = this.currentNode.id;
      templateUpdate(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '添加成功');
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.templateList = [];
          this.$$ALoading.close();
          this.actionType = this.$$ActionType.views;
          this.queryByType();
        });
    },
    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    delTemplate() {
      if (!this.currentNode) {
        this.$message.info('数据不完整');
        return;
      }
      if (!this.currentNode.id) {
        this.$message.info('数据不完整');
        return;
      }
      templateDelete({ templateId: this.currentNode.id })
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
          this.templateList = [];
          this.currentNode = {};
          this.queryByType();
        });
    },
    // select node
    enabled(data) {
      templateEnableFlag({ enableFlag: !data.enabled }, data.id)
        .then(res => {
          this.templateList = [];
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '更新成功');
          } else {
            this.$message.error(message || '更新失败');
          }
        })
        .finally(() => {
          this.queryByType();
        });
    },
    setFormData() {
      this.formData = {
        name: this.currentNode.name,
        type: this.currentNode.type,
        title: this.currentNode.title,
        content: this.currentNode.content,
        distribution: (this.currentNode.distribution || '').split('_')
      };
      // this.formData.distribution = this.currentNode.distribution;
    },
    del(data) {
      this.currentNode = data;
      this.visibleDel = true;
      this.deleteSubmit = this.delTemplate;
    },
    onSelect(index, item, event) {
      this.currentIndex = index;
      if (!item) item = this.templateList[index || 0] || {};
      for (let i = 0; i < this.templateList.length; i++) {
        const d = this.templateList[i];
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
          this.setFormData();
          this.actionType = this.$$ActionType.edit;
          break;
        default:
          this.setFormData();
          this.actionType = this.$$ActionType.views;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
.message-template-item {
  padding-left: 36px;
  height: 16px;
  //line-height: 24px;
  background: url(../../../assets/message-template.png) 0 center no-repeat;
  -webkit-background-size: 16px;
  background-size: 16px;
  .message-template-name {
    font-size: 16px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: $--color-dark;
    //margin-bottom: 16px;
    max-width: 280px;
    height: 32px;
  }
  .message-type {
    height: 14px;
    font-size: 14px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: $--color-form-label;
    line-height: 21px;
  }
}
</style>

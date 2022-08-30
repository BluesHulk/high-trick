<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between group-container">
        <div>
          <div class="tree-title page-title">
            <div class="group-margin clearfix">
              <span class="group-title" :class="{ active: groupTypeEn == 'DEVICE' }" @click="getGroupType('DEVICE')">
                设备<i v-if="groupTypeEn == 'DEVICE'"></i>
              </span>
            </div>
            <div class="group-margin clearfix">
              <span class="group-title" :class="{ active: groupTypeEn == 'SPACE' }" @click="getGroupType('SPACE')">
                空间<i v-if="groupTypeEn == 'SPACE'"></i>
              </span>
            </div>
            <div class="group-margin clearfix">
              <span class="group-title" :class="{ active: groupTypeEn == 'XASSET' }" @click="getGroupType('XASSET')">
                其他资产<i v-if="groupTypeEn == 'XASSET'"></i>
              </span>
            </div>
            <div class="group-margin clearfix">
              <span class="group-title" :class="{ active: groupTypeEn == 'PROJECT' }" @click="getGroupType('PROJECT')">
                项目<i v-if="groupTypeEn == 'PROJECT'"></i>
              </span>
            </div>
          </div>
        </div>
        <CircleButton :type="$$ActionType.add" @click="add">{{ $$ButtonText.plus }}</CircleButton>
      </div>
      <div class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light group-container">
        <List
          ref="GroupData"
          padding="20px 50px"
          height="16px"
          @selected="onSelect"
          :loader="getGroupQuery"
          @data="getGroupList"
        >
          <div class="float-left" slot-scope="{ data }" slot="left">
            <div class="group-name" :style="{ backgroundImage: `url(${treeIcon})` }">
              {{ data.name }}
            </div>
          </div>
          <div class="float-right" slot-scope="{ data, node }" slot="right">
            <ImageButton
              v-if="groupTypeEn != 'DEVICE'"
              :src="ButtonImage[data.enable]"
              @click.native.stop="enabled(data, node)"
            ></ImageButton>
            <div class="edit" @click.stop="edit(data, node)"></div>
            <div class="delete" @click.stop="del(data)"></div>
          </div>
        </List>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <template v-if="GlobalActionType === $$ActionType.add || GlobalActionType === $$ActionType.edit">
          <div class="page-title">{{ $$ButtonText[GlobalActionType] }}</div>
          <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
        </template>
        <div v-else class="page-title">查看</div>
      </div>
      <div class="page-title-wrapper a-toolbar-between group-container">
        <el-form ref="form" :model="form" :rules="rules" class="formFreeStyle">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="名称" prop="name">
                <el-input type="text" v-model="form.name" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="form.desc" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
    <del-confirm
      v-if="delVisible"
      :del-visible="delVisible"
      :del-text="delText"
      @del-concel="delConcel"
      @del-submit="delSubmit"
    ></del-confirm>
  </TreeContent>
</template>

<script>
import { mapGetters } from 'vuex';
import TreeContent from '@/components/layout/TreeContent.vue';
import List from '@/components/list/List.vue';
import CircleButton from '@/components/button/CircleButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import ImageButton from '@/components/button/ImageButton.vue';

import ButtonImage from '@/constants/ButtonImage';
import treeIcon from '../../../../assets/config/tree-group.png';
import delConfirm from '@/views/resource/delConfirm';
import { getGroupQuery, groupAdd, groupUpdate } from '@/api/config';

export default {
  name: 'config-group',
  components: {
    TreeContent,
    List,
    CircleButton,
    PrimaryButton,
    ImageButton,
    delConfirm
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      ButtonImage,
      treeIcon: treeIcon,
      groupTypeEn: '',
      groupTypeCn: '',
      form: {
        name: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          { max: 60, message: '请在60个字符以内', trigger: 'change' }
        ],
        desc: [{ max: 300, message: '请在300个字符以内', trigger: 'change' }]
      },
      disabled: false,
      updateId: '',
      groupDatas: [],
      delVisible: false,
      delText: '',
      delObject: {}
    };
  },
  mounted() {
    this.getGroupType('DEVICE');
  },
  methods: {
    getGroupQuery() {
      switch (this.groupTypeEn) {
        case 'DEVICE':
          return getGroupQuery({ type: 'DEVICE' });
        case 'SPACE':
          return getGroupQuery({ type: 'SPACE' });
        case 'XASSET':
          return getGroupQuery({ type: 'XASSET' });
        case 'PROJECT':
          return getGroupQuery({ type: 'PROJECT' });
        default:
          return getGroupQuery({ type: 'DEVICE' });
      }
    },
    getGroupType(val) {
      this.groupTypeEn = val;
      switch (val) {
        case 'DEVICE':
          this.groupTypeCn = '设备';
          break;
        case 'SPACE':
          this.groupTypeCn = '空间';
          break;
        case 'XASSET':
          this.groupTypeCn = '其他资产';
          break;
        case 'PROJECT':
          this.groupTypeCn = '项目';
          break;
      }
      this.$refs.GroupData.load();
    },
    onSelect(data, node) {
      console.log(data, node);
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.views);
      this.actionType = this.$$ActionType.views;
      if (data) {
        this.disabled = true;
        this.form.name = data.name;
        this.form.desc = data.desc;
      } else {
        this.$refs['form'].resetFields();
      }
    },
    getGroupList(data) {
      this.groupDatas = data;
    },
    add() {
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.add);
      this.actionType = this.$$ActionType.add;
      this.disabled = false;
      this.$refs['form'].resetFields();
    },
    enabled(data) {
      const idx = this.groupDatas.indexOf(data);
      this.$refs.GroupData.select(idx, data);
      const enableData = {
        id: data.id,
        enable: !data.enable
      };
      groupUpdate(enableData).then(res => {
        if (res.code == '200') {
          this.$message.success(`${this.groupTypeCn} - ` + res.message);
          this.getGroupType(this.groupTypeEn);
        } else {
          this.$message.error(`${this.groupTypeCn} - ` + res.message);
        }
      });
    },
    edit(data) {
      const idx = this.groupDatas.indexOf(data);
      this.$refs.GroupData.select(idx, data);
      this.$store.dispatch('SetGlobalActionType', this.$$ActionType.edit);
      this.actionType = this.$$ActionType.edit;
      this.disabled = false;
      console.log(data);
      this.updateId = data.id;
      this.form.name = data.name;
      this.form.desc = data.desc;
    },
    del(data, node) {
      this.delVisible = true;
      this.delText = data.name;
      this.delObject = data;
    },
    delConcel() {
      this.delVisible = false;
    },
    delSubmit() {
      const delData = {
        id: this.delObject.id,
        deleted: true
      };
      groupUpdate(delData).then(res => {
        if (res.code == '200') {
          this.$message.success(`${this.groupTypeCn}分组 - ` + res.message);
          this.getGroupType(this.groupTypeEn);
          this.delVisible = false;
        } else {
          this.$message.error(`${this.groupTypeCn}分组 - ` + res.message);
        }
      });
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const data = {
            name: this.form.name,
            desc: this.form.desc
          };
          if (this.actionType === this.$$ActionType.add) {
            data.type = this.groupTypeEn;
            groupAdd(data).then(res => {
              if (res.code == '200') {
                this.$message.success(`${this.groupTypeCn} - ` + res.message);
                this.getGroupType(this.groupTypeEn);
              } else {
                this.$message.error(`${this.groupTypeCn} - ` + res.message);
              }
            });
          } else if (this.actionType === this.$$ActionType.edit) {
            data.id = this.updateId;
            groupUpdate(data).then(res => {
              if (res.code == '200') {
                this.$message.success(`${this.groupTypeCn} - ` + res.message);
                this.getGroupType(this.groupTypeEn);
              } else {
                this.$message.error(`${this.groupTypeCn} - ` + res.message);
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scope>
@import '@/styles/ui-theme';
.group-container {
  .group-margin {
    margin-right: 40px;
    float: left;
  }
  .group-margin:last-child {
    margin-right: 0;
  }
  .group-title {
    position: relative;
    display: block;
    float: left;
    min-width: 40px;
    color: $--color-username;
    cursor: pointer;
  }
  .group-title.active {
    color: $-primary-color;
    i {
      background: #3045b1;
      width: 40px;
      height: 3px;
      position: absolute;
      bottom: -21px;
      left: 50%;
      margin-left: -20px;
    }
  }
  .group-name {
    padding-left: 36px;
    height: 16px;
    font-size: 16px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: $--color-dark;
    line-height: 16px;
    background-repeat: no-repeat;
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .formFreeStyle {
    width: 670px;
    margin: 0px auto;
  }
}
</style>

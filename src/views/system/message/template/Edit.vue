<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    class="message-template-form editable-form"
    @submit.native.prevent
  >
    <el-row :gutter="30" style="margin-bottom: 30px">
      <el-col :span="12">
        <el-form-item prop="name">
          <div class="form-label">
            <span class="form-label-text form-item-required">模板名称</span>
          </div>
          <el-input style="width: 320px" v-model="formData.name" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="type">
          <div class="form-label">
            <span class="form-label-text form-item-required">模板类别</span>
          </div>
          <el-select style="width: 320px" clearable v-model="formData.type" placeholder="请选择类别">
            <el-option v-for="key in Object.keys(types)" :key="key" :label="types[key]" :value="key"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="title">
      <div class="form-label">
        <span class="form-label-text form-item-required">模板标题</span>
      </div>
      <el-input resize="none" v-model="formData.title" autocomplete="off" placeholder="请输入标题"></el-input>
    </el-form-item>
    <div class="float-container edit-template-wrapper">
      <div class="float-left" style="width: 446px">
        <el-form-item prop="content">
          <div class="form-label">
            <span class="form-label-text form-item-required">消息内容</span>
          </div>
          <el-input
            style="width: 446px"
            resize="none"
            v-model="formData.content"
            autocomplete="off"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </div>
      <div class="float-left trans">
        <img @click="toLeft" src="./trans.png" alt="" />
      </div>
      <div class="float-left setting">
        <el-form-item>
          <div class="form-label">
            <span class="form-label-text form-item-required">设置模板信息</span>
          </div>
          <div class="setting-list scrollbar scrollbar-y scrollbar-light">
            <div
              @click="onClick(item, index)"
              :title="String(item)"
              class="setting-list-item show-dot"
              :class="{ active: currentIndex === index }"
              v-for="(item, index) in settingList"
              :key="item.id"
            >
              {{ item.description }}
            </div>
          </div>
        </el-form-item>
      </div>
    </div>
    <el-form-item prop="distribution">
      <div class="checkbox-edit">
        <div class="form-label">
          <span class="form-label-text form-item-required">分发方式</span>
        </div>
        <el-checkbox-group v-model="formData.distribution">
          <el-checkbox
            v-for="(val, index) in typeList"
            :key="index"
            :label="val.value"
            name="distribution"
            :disabled="val.value === 'WEB'"
          >
            {{ val.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { templateVariables } from '@/api/message';
import message from '@/mixins/message';

export default {
  name: 'edit',
  props: {
    rules: Object,
    formData: Object,
    types: Object
  },
  data() {
    return {
      recordMap: {},
      keyMap: {},
      currentIndex: 0,
      settingList: []
    };
  },
  mixins: [message],
  created() {
    this.templateVariables();
  },
  methods: {
    toLeft() {
      const data = this.settingList[this.currentIndex];
      // const expression = `\${${data.key}}`;
      const description = data.description;
      const desc = `\${${description}}`;
      // 填写过该字段
      // if (this.formData.content.includes(desc)) {
      //   console.log(this.recordMap);
      //   this.$message.info(`请先填写${description}的内容`);
      //   return;
      // }
      // // 记录用户输入的值
      // this.recordMap[data.key] = '';
      // // 记录键
      // this.keyMap[data.key] = desc;
      // 拼接
      this.formData.content += desc;
      console.log(this.recordMap[data.key]);
      // this.$emit('current', data);
    },
    onClick(data, index) {
      this.currentIndex = index;
    },
    templateVariables() {
      templateVariables().then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.settingList = object;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
@import '@/styles/system/form';
</style>
<style lang="scss">
@import '@/styles/ui-theme';
.message-template-form {
  .el-checkbox__label {
    padding-left: 16px;
  }
  .edit-template-wrapper {
    margin-bottom: 30px;
    .el-textarea__inner {
      height: 240px;
    }
  }
  .float-left {
    height: 264px;
  }
  .trans {
    width: 40px;
    //background: url(./trans.png) center no-repeat;
    //-webkit-background-size: 24px;
    //background-size: 24px;
    position: relative;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }
  .setting {
    width: 180px;
  }
  .setting-list {
    height: 240px;
    width: 180px;
    border-radius: 4px;
    opacity: 0.59;
    border: 1px solid $--color-pink;
    &-item {
      padding: 0 19px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
    }
  }
  .active {
    background-color: $--bg-line-selected;
    font-size: 14px;
    font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
    font-weight: 400;
    color: $-primary-color;
  }
}
</style>

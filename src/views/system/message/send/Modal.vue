<template>
  <el-dialog
    :close-on-click-modal="false"
    width="730px"
    :title="title"
    :visible="isAdd || isEdit"
    :before-close="cancel"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      class="message-modal-form editable-form"
      @submit.native.prevent
    >
      <el-form-item prop="priority" class="message-modal-form-item">
        <div class="form-label">
          <span class="form-label-text form-item-required">优先级</span>
        </div>
        <el-select
          :class="priorityClass"
          style="width: 320px"
          clearable
          v-model="formData.priority"
          placeholder="请选择优先级"
          @change="getPriorityClass"
          popper-class="priority-class"
        >
          <el-option
            :key="item"
            v-for="item in Object.keys(messageLevel)"
            :label="messageLevel[item]"
            :value="item"
            :class="getItemPriorityClass(item)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="title" class="message-modal-form-item">
        <div class="form-label">
          <span class="form-label-text form-item-required">消息标题</span>
        </div>
        <el-input resize="none" v-model="formData.title" autocomplete="off" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item prop="content" class="message-modal-form-item">
        <div class="form-label">
          <span class="form-label-text form-item-required">消息内容</span>
        </div>
        <el-input
          resize="none"
          v-model="formData.content"
          autocomplete="off"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item prop="distribution">
        <div :class="DistributionClass">
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
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <PrimaryButton @click="submit">{{ $$ButtonText.ok }}</PrimaryButton>
    </div>
  </el-dialog>
</template>

<script>
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import message from '@/mixins/message';
import rules from '../send/rules';

export default {
  name: 'modal',
  components: {
    CancelButton,
    PrimaryButton
  },
  props: {
    actionType: String,
    title: String,
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        priority: '',
        title: '',
        content: '',
        type: 'SYSTEM', // 约定写死的
        distribution: ['WEB']
      },
      checkedList: []
    };
  },
  computed: {
    isAdd() {
      return this.actionType === this.$$ActionType.add;
    },
    isEdit() {
      return this.actionType === this.$$ActionType.edit;
    },
    DistributionClass() {
      return [`checkbox-` + this.actionType];
    }
  },
  mixins: [message, rules],
  created() {
    this.setRules();
    this.setFormData();
  },
  methods: {
    setFormData() {
      const add = {
        priority: '',
        title: '',
        content: '',
        type: 'SYSTEM', // 约定写死的
        distribution: ['WEB']
      };
      const edit = {
        priority: this.rowData.priority,
        title: this.rowData.title,
        content: this.rowData.content,
        type: this.rowData.type,
        distribution: (this.rowData.distribution || '').split('_')
      };
      this.formData = this.isAdd ? add : edit;
    },
    submit() {
      const data = { ...this.formData };
      this.$refs.form.validate(valid => {
        if (!valid) return;
        if (Array.isArray(data.distribution)) data.distribution = data.distribution.join('_');
        if (this.isAdd) {
          this.$emit('add', data);
          this.$emit('reset');
        } else if (this.isEdit) {
          data.appCode = this.rowData.appCode;
          data.id = this.rowData.id;
          this.$emit('edit', data);
          this.$emit('reset');
        }
      });
    },
    cancel() {
      this.$confirm('确定取消吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('reset');
        })
        .catch(() => this.$message({ type: 'info', message: '已取消' }));
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
@import '@/styles/system/form';
.message-modal-form {
  width: 670px;
  margin: 0 auto;
  .message-modal-form-item {
    width: 670px;
    .message-modal-form-label {
      height: 14px;
      font-size: 14px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: $--color-form-label;
      line-height: 14px;
      margin-bottom: 10px;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
  .el-checkbox {
    margin-right: 20px;
  }
}
</style>
<style lang="scss">
@import '@/styles/ui-theme';
.message-modal-form {
  .el-checkbox__label {
    padding-left: 16px;
  }
  .el-textarea__inner {
    height: 240px;
  }
}
</style>

<template>
  <el-dialog
    :close-on-click-modal="false"
    width="520px"
    :title="title"
    :visible="actionType === $$ActionType.add || actionType === $$ActionType.edit || actionType === $$ActionType.views"
    :before-close="cancel"
  >
    <AForm
      gutter="30"
      width="470"
      ref="autoForm"
      v-model="formData"
      :col="2"
      :elements="elements"
      :rules="rules"
      inline
      stretch
    ></AForm>
    <el-form ref="photoForm" v-model="photoForm" class="el-form--inline form-inline a-stretch-form a-multi-col-form">
      <el-form-item label="添加照片" prop="photoUrl" label-position="top">
        <div class="photo-cropper">
          <Uploader
            :min="20"
            :max="200"
            @change="handleUpload"
            :message="uploadMsg"
            :file-types="fileTypes"
            class="photo-label text-center"
          >
            <template v-if="!photoForm.photoUrl">
              <span class="photo-tip text-center">{{ uploadMsg }}</span>
              <img class="preview-icon" src="../../../../assets/photo.png" alt="" />
            </template>
            <template v-if="photoForm.photoUrl">
              <div class="preview-photo" :style="{ backgroundImage: `url(${photoForm.photoUrl})` }"></div>
            </template>
          </Uploader>
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
import AForm from '@/components/form/AForm';
import Uploader from '@/components/upload/Uploader.vue';

import { staffUpload /* staffAdd, staffUpdate */ } from '@/api/rbac';

export default {
  name: 'member',
  components: {
    AForm,
    Uploader,
    CancelButton,
    PrimaryButton
  },
  props: {
    // orgId: {
    //   type: String,
    //   required: true
    // },
    actionType: String,
    title: String,
    rowData: Object,
    members: Array
  },
  data() {
    return {
      fileTypes: '.jpg,.png,.jpeg',
      uploadMsg: '请上传.jpg/.png格式',
      photoForm: {
        photoUrl: ''
      },
      elements: [],
      formData: {
        // orgId: '',
        name: '',
        phone: '',
        email: ''
      },
      rules: {
        // name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        // phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        // email: [{ required: true, message: '请输入邮箱地址', trigger: 'change' }]
      }
    };
  },
  created() {
    this.setElements();
    this.initFormData();
  },
  mounted() {
    this.setRules();
  },
  methods: {
    setRules() {
      const validName = (rule, value, callback) => {
        const re = /[\u4e00-\u9fa5A-Za-z\d]/g;
        if (re.test(value)) {
          callback();
        } else {
          callback(new Error('请输入中文或英文或数字或部分字符'));
        }
      };
      switch (this.actionType) {
        case this.$$ActionType.add:
        case this.$$ActionType.edit:
          this.rules = {
            name: [{ validator: validName, required: true, message: '请输入中文或英文或数字', trigger: 'blur' }],
            phone: [{ validator: this.$$Validator.checkPhone(true), required: true, trigger: 'blur' }],
            email: [{ validator: this.$$Validator.email(), required: true, trigger: 'blur' }]
          };
          break;
        case this.$$ActionType.views:
          this.rules = {};
          this.$nextTick(() => {
            this.$refs.autoForm && this.$refs.autoForm.clearValidate(['name', 'phone', 'email']);
          });
          break;
      }
    },
    initFormData() {
      if (this.actionType === this.$$ActionType.views) {
        // this.formData.orgId = this.rowData.orgId;
        this.formData.name = this.rowData.name;
        this.formData.phone = this.rowData.phone;
        this.formData.email = this.rowData.email;
        this.photoForm.photoUrl = this.rowData.photoUrl;
      } else if (this.actionType === this.$$ActionType.edit) {
        // this.formData.orgId = this.orgId;
        this.formData.name = this.rowData.name;
        this.formData.phone = this.rowData.phone;
        this.formData.email = this.rowData.email;
        this.formData.photoUrl = this.rowData.photoUrl;
        this.photoForm.photoUrl = this.rowData.photoUrl;
      }
    },
    setElements() {
      this.elements = [
        // {
        //   label: '所属组织架构',
        //   prop: 'orgId',
        //   type: this.$$FormItem.Cascader,
        //   labelPosition: 'top',
        //   placeholder: '请选择',
        //   disabled: true,
        //   clearable: true,
        //   change: value => {
        //     this.orgChange(value);
        //   },
        //   props: { checkStrictly: true },
        //   options: this.members
        // },
        { label: '姓名', prop: 'name', type: this.$$FormItem.Input },
        { label: '手机号码', prop: 'phone', type: this.$$FormItem.Input },
        { label: '邮箱', prop: 'email', type: this.$$FormItem.Input }
      ];
    },
    orgChange(value) {
      console.log(value);
    },
    async handleUpload(files) {
      const file = files[0];
      console.log(file);
      if (!this.fileTypes.includes(file.name.toLowerCase().substring(file.name.lastIndexOf('.'), file.name.length))) {
        this.$message.error(this.uploadMsg);
        return;
      }
      const data = new FormData();
      data.append('file', file);
      this.photoForm.photoUrl = data;
      this.$$ALoading.show();
      staffUpload(data).then(res => {
        const { object, code, message } = res;
        if (code === 200 && object) {
          this.formData.photoUrl = object.object.path;
        } else {
          this.$message.error(message || '上传失败');
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.$$ALoading.close();
          this.photoForm.photoUrl = reader.result;
        };
      });
    },
    submit() {
      const data = { ...this.formData };
      // if (Array.isArray(data.orgId)) {
      //   data.orgId = data.orgId[data.orgId.length - 1];
      // }
      this.$refs.autoForm.submitForm().then(valid => {
        if (!valid) return;
        if (this.actionType === this.$$ActionType.add) {
          this.$emit('data', data);
          this.$emit('reset');
          // staffAdd(data)
          //   .then(res => {
          //     const { code, message } = res;
          //     if (code === 200) {
          //       this.$message.success(message || '添加成功');
          //     } else {
          //       this.$message.error(message || '添加失败');
          //     }
          //   })
          //   .finally(() => {
          //     this.$emit('reset');
          //     this.cancel();
          //   });
        } else if (this.actionType === this.$$ActionType.edit) {
          data.photoUrl = this.formData.photoUrl;
          data.id = this.rowData.id;
          this.$emit('data', Object.assign({}, this.formData, data));
          this.$emit('reset');
          // data.photo = this.rowData.photo;
          // data.id = this.rowData.id;
          // staffUpdate(data)
          //   .then(res => {
          //     const { code, message } = res;
          //     if (code === 200) {
          //       this.$message.success(message || '编辑成功');
          //     } else {
          //       this.$message.error(message || '编辑失败');
          //     }
          //   })
          //   .finally(() => {
          //     this.$emit('reset');
          //     this.cancel();
          //   });
        }
      });
    },
    cancel() {
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';

.download-wrapper {
  padding: 60px 0;
  .download-static {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: $--color-dark;
    line-height: 22px;
  }
  .download-template-wrapper {
    margin-bottom: 10px;
  }
  .download-template {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: $-primary-color;
    line-height: 22px;
    text-decoration: underline;
    cursor: pointer;
  }
}

.photo-cropper {
  width: 220px;
  height: 220px;
  background: #f6f8fc;
  border-radius: 4px;
  border: 1px dashed #d2daea;
  /*background: url() center 78px no-repeat;*/
  font-size: 12px;
  font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
  font-weight: 400;
  color: $--color-username;
  position: relative;
  .preview-icon {
    margin-top: 78px;
  }
  .preview-photo,
  .photo-preview,
  label,
  .photo-label {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    -webkit-background-size: contain;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .photo-tip {
    position: absolute;
    top: 130px;
    width: 100%;
    display: block;
  }
}
</style>

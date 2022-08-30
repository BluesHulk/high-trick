<template>
  <div class="single-route-page">
    <div class="personal-content scrollbar scrollbar-y scrollbar-light">
      <div class="float-container">
        <div class="personal-avatar float-left">
          <div class="avatar-wrapper">
            <!--<div
              v-if="actionType === $$ActionType.views"
              :class="AvatarClass"
              :style="{ backgroundImage: `url(${headPortraitUrl})` }"
            ></div>
            <div
              :style="{ backgroundImage: `url(${headPortraitUrl})` }"
              @click="showCrop"
              v-if="actionType === $$ActionType.edit"
              :class="AvatarClass"
            >
              <span>修改头像</span>
            </div>-->
            <div :style="{ backgroundImage: `url(${headPortraitUrl})` }" @click="showCrop" :class="AvatarClass">
              <span>修改头像</span>
            </div>
          </div>
          <el-tooltip class="item" effect="dark" :content="user_info.name" placement="top">
            <div class="personal-username text-center show-dot">{{ user_info.name }}</div>
          </el-tooltip>
          <!--<div class="personal-sub-info text-center">
            <span class="personal-gender">
              {{ user_info.gender === 'male' ? '男' : user_info.gender === 'female' ? '女' : '&#45;&#45;' }}
            </span>
            |
            <span class="personal-role">
              {{ user_info.duty }}
            </span>
          </div>-->
        </div>
        <div class="personal-info float-left">
          <el-form :model="formData" :rules="rules" ref="formData">
            <el-form-item label="姓名" prop="name">
              <el-input :disabled="isViews" v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender" :disabled="isViews">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="formData.phone" :disabled="isViews"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" :disabled="isViews"></el-input>
            </el-form-item>
            <el-form-item label="密码" class="password-container">
              <el-input value="********" disabled></el-input>
              <el-input type="password" :value="userInfo.password" disabled style="display: none"></el-input>
              <el-button class="update-pwd-btn" type="primary" @click="visiblePwdModal = true">
                修改密码
              </el-button>
            </el-form-item>
            <el-form-item v-if="actionType === $$ActionType.views">
              <PrimaryButton @click="edit">{{ $$ButtonText.edit }}</PrimaryButton>
            </el-form-item>
            <el-form-item v-else>
              <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
              <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <Pwd :visible="visiblePwdModal" @submit="onPwdSubmit" @reset="visiblePwdModal = false"></Pwd>
    <!-- GT20201103-129 -->
    <ACropper
      :show-modal="true"
      :class="CropBg"
      v-if="visibleCrop"
      :visible="visibleCrop"
      :min="20 * 1024"
      :max="200 * 1024"
      accept=".jpg,.JPG,.jpeg,JPEG,.png,.PNG,bmp,BMP"
      @reset="cropReset"
      @submit="cropSubmit"
      @file="onFile"
      container-class="a-cropper-container"
      :min-container-width="360"
      :min-container-height="360"
      :min-canvas-height="360"
      :crop-box-resizable="true"
      :initial-aspect-ratio="1"
      :aspect-ratio="1"
    ></ACropper>
  </div>
</template>

<script>
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import Pwd from './Pwd';
import { getToken, getUserInfo } from '@/storage/auth';
import { userChangePassword, userQueryById, staffUpdate, staffUpload } from '@/api/rbac';
import ACropper from '@/components/cropper/ACropper.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'center',
  components: {
    ACropper,
    CancelButton,
    PrimaryButton,
    Pwd
  },
  data() {
    return {
      headPortraitUrl: '',
      visibleCrop: false,
      visiblePwdModal: false,
      actionType: this.$$ActionType.views,
      formData: {
        name: '',
        gender: '',
        phone: '',
        email: ''
      },
      rules: {},
      TOKEN: getToken() || {},
      file: {},
      userInfo: {}
    };
  },
  computed: {
    // GT20201103-128
    ...mapGetters(['user_info']),
    isViews() {
      return this.actionType === this.$$ActionType.views;
    },
    CropBg() {
      return [`cropper-image-${this.actionType}`];
    },
    AvatarClass() {
      return ['avatar', `avatar-${this.actionType}`];
    }
  },
  watch: {
    isViews() {
      this.setRules();
    }
  },
  created() {
    this.headPortraitUrl = this.user_info.headPortraitUrl;
    this.setFormData();
    this.init();
  },
  methods: {
    showCrop(event) {
      this.visibleCrop = true;
    },
    onFile(file) {
      this.file = file;
    },
    cropSubmit(result) {
      // console.log(result);
      this.visibleCrop = false;
      this.headPortraitUrl = result;
      this.updateAvatar({ id: this.user_info.id });
    },
    cropReset() {
      this.visibleCrop = false;
    },
    setRules() {
      const rules = {
        name: [{ validator: this.$$Validator.string(), required: true, message: '请输入姓名', trigger: 'blur' }],
        // gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phone: [
          {
            validator: this.$$Validator.checkPhone(true),
            required: true,
            message: '请输入正确的手机号码',
            trigger: 'change'
          }
        ],
        email: [{ validator: this.$$Validator.email(), required: true, message: '请填写邮箱地址', trigger: 'blur' }]
      };
      this.rules = this.isViews ? {} : rules;
    },
    init() {
      const t = this.TOKEN['Authorization'];
      if (!t) return;
      const info = this.TOKEN[t].userInfo || {};
      const user = userQueryById(info.id);
      this.$$ALoading.show();
      Promise.all([user])
        .then(res => {
          const userRes = res[0];
          if (userRes) {
            const { code } = userRes;
            if (code === 200) {
              this.userInfo = userRes.object || {};
            }
          }
        })
        .finally(() => {
          this.$$ALoading.close();
        });
    },
    setFormData() {
      this.formData = {
        name: this.user_info.name,
        gender: this.user_info.gender,
        phone: this.user_info.phone,
        email: this.user_info.email
      };
    },
    edit() {
      this.actionType = this.$$ActionType.edit;
    },
    onPwdSubmit(data) {
      if (!data) {
        this.$message.error(`数据格式错误`);
        return;
      }
      this.$$ALoading.show();
      data.userId = this.userInfo.id;
      userChangePassword(data)
        .then(response => {
          const { message, code } = response;
          if (code !== 200) {
            this.$message.error(message || '修改密码失败');
          } else {
            this.$message.success(message || '修改密码成功');
          }
        })
        .finally(() => {
          this.visiblePwdModal = false;
          this.$$ALoading.close();
        });
    },
    save() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          // 保存成功
          this.actionType = this.$$ActionType.views;
          this.staffUpdate();
        } else {
          return false;
        }
      });
    },
    updateAvatar(data) {
      const img = new Image();
      const w = 360;
      const h = 420;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        this.$$ALoading.show();
        canvas.toBlob(async blob => {
          this.$$ALoading.close();
          const formData = new FormData();
          const filename = this.file.name.substring(
            0,
            this.file.name.length - this.file.name.substring(this.file.name.lastIndexOf('.')).length
          );
          formData.append('file', blob, filename + '.jpg');
          formData.append('id', getUserInfo().staffId);
          this.$$ALoading.show();
          staffUpload(formData)
            .then(resUp => {
              const { object, code, message } = resUp;
              if (code === 200 && object) {
                this.headPortraitUrl = object.object.path;
                data.headPortraitUrl = object.object.path;
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
                //     this.headPortraitUrl = '';
                //     this.file = null;
                //     this.init();
                this.$store.dispatch('refreshUserInfo');
                // });
              } else {
                this.$message.error(message);
              }
            })
            .finally(() => {
              this.$$ALoading.close();
            });
        }, 'image/jpeg' /* this.file.type*/);
      };
      img.src = this.headPortraitUrl;
    },
    staffUpdate() {
      const data = {
        id: this.user_info.id,
        ...this.formData
      };
      if (!data.gender) delete data.gender;
      // if (this.user_info.headPortraitUrl !== this.headPortraitUrl) {
      //   this.updateAvatar(data);
      //   const img = new Image();
      //   const w = 360;
      //   const h = 420;
      //   img.onload = () => {
      //     const canvas = document.createElement('canvas');
      //     canvas.width = w;
      //     canvas.height = h;
      //     const ctx = canvas.getContext('2d');
      //     ctx.drawImage(img, 0, 0, w, h);
      //     canvas.toBlob(async blob => {
      //       const formData = new FormData();
      //       const filename = this.file.name.substring(
      //         0,
      //         this.file.name.length - this.file.name.substring(this.file.name.lastIndexOf('.')).length
      //       );
      //       formData.append('file', blob, filename + '.jpg');
      //       const resUp = await staffUpload(formData);
      //       const { object, code, message } = resUp;
      //       if (code === 200 && object) {
      //         this.headPortraitUrl = 'http://' + object.object.path;
      //         data.headPortraitUrl = 'http://' + object.object.path;
      //         staffUpdate(data)
      //           .then(res => {
      //             const { code, message } = res;
      //             if (code === 200) {
      //               this.$message.success(message || '编辑成功');
      //             } else {
      //               this.$message.error(message || '编辑失败');
      //             }
      //           })
      //           .finally(() => {
      //             this.headPortraitUrl = '';
      //             this.file = null;
      //             this.init();
      //             this.$store.dispatch('refreshUserInfo');
      //           });
      //       } else {
      //         this.$message.error(message);
      //       }
      //     }, 'image/jpeg' /* this.file.type*/);
      //   };
      //   img.src = this.headPortraitUrl;
      // } else {
      // data.headPortraitUrl = this.user_info.headPortraitUrl;
      staffUpdate(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '编辑成功');
          } else {
            this.$message.error(message || '编辑失败');
          }
        })
        .finally(() => {
          this.headPortraitUrl = '';
          this.file = null;
          this.init();
          this.$store.dispatch('refreshUserInfo');
        });
      // }
    },
    cancel() {
      this.actionType = this.$$ActionType.views;
      this.$refs.formData.resetFields();
      this.init();
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
// GT20201103-129
[class*='cropper-image-'] {
  .a-cropper-container {
    width: 360px;
    height: 360px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;

    .cropper-bg {
      overflow: hidden;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
    }
  }
}
.cropper-image-views {
  .a-cropper-container {
    > img {
      opacity: 0;
    }
  }
}
.cropper-image-edit {
  .a-cropper-container {
    > img {
      opacity: 1;
    }
  }
}
.personal-content {
  padding-left: 22.73%;
  padding-top: 120px;
  //min-width: 860px;
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  .personal-avatar {
    width: 240px;
    margin-right: 180px;
    .avatar-wrapper {
      width: 230px;
      height: 230px;
      box-shadow: 0 20px 40px -20px rgba(16, 13, 66, 0.6);
      border: 5px solid $--color-light;
      margin-bottom: 80px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
    }
    .avatar,
    .avatar-views,
    .avatar-edit {
      -webkit-background-size: cover;
      background-size: cover;
      height: 230px;
      width: 230px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
    }
    .avatar-views, // 新+的
      .avatar-edit {
      cursor: pointer;
      line-height: 230px;
      text-align: center;
      font-size: 20px;
      font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
      font-weight: 400;
      color: $--color-light;
      letter-spacing: 2px;
      span {
        display: none;
      }
      &:hover {
        background-color: rgba(1, 4, 15, 0.3);
        span {
          display: inline-block;
        }
      }
    }
    .personal-username {
      height: 46px;
      font-size: 30px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: $--color-dark;
      line-height: 45px;
    }
    .personal-sub-info {
      font-size: 16px;
      font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
      font-weight: 400;
      color: rgba(16, 25, 74, 0.18);
      line-height: 24px;
      letter-spacing: 1px;
    }
  }
  .personal-info {
    width: 440px;
    .el-input,
    .el-select,
    .el-switch,
    .el-radio-group {
      width: 100%;
    }
  }
  .password-container {
    position: relative;
    margin-bottom: 120px;
    button {
      position: absolute;
      right: -120px;
      height: 42px;
    }
  }
}
.update-pwd-btn {
  background-color: rgba(0, 220, 195, 1);
  border-color: transparent;
  &:hover,
  &:focus {
    background-color: rgba(0, 220, 195, 1);
    border-color: transparent;
  }
}
</style>

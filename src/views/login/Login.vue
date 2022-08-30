<template>
  <div class="login">
    <div class="login-bg-container"></div>
    <div class="login-logo"></div>
    <div class="login-container">
      <div class="platform"></div>
      <div class="platform-text"></div>
      <div class="login-tip">{{ isFirst ? '请登录' : '设置新密码' }}</div>
      <el-form v-if="isFirst" ref="form" :model="formData" :rules="rules" class="login-form" @submit.native.prevent>
        <el-form-item prop="username" class="login-form-item username">
          <div class="login-label">用户名</div>
          <el-input
            :class="getClass('usernameFocus')"
            @keyup.native.enter="valid"
            v-model="formData.username"
            autocomplete="off"
            placeholder="请输入账号"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="login-form-item password">
          <div class="login-label">密码</div>
          <el-input
            :class="getClass('passwordFocus')"
            @keyup.native.enter="valid"
            v-model="formData.password"
            autocomplete="off"
            type="password"
            placeholder="请输入密码"
          >
          </el-input>
        </el-form-item>
        <el-button type="primary" class="submit-item text-center" @click="login">登录</el-button>
      </el-form>
      <el-form v-else ref="form" :model="formUpdateData" :rules="updateRules" class="login-form" @submit.native.prevent>
        <el-form-item prop="password" class="login-form-item username">
          <div class="login-label">新密码</div>
          <el-input
            :class="getClass('passwordFocus')"
            @keyup.native.enter="valid"
            v-model="formUpdateData.password"
            autocomplete="off"
            type="password"
            placeholder="请输入新密码"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword" class="login-form-item password">
          <div class="login-label">再次输入</div>
          <el-input
            :class="getClass('passwordFocus')"
            @keyup.native.enter="valid"
            v-model="formUpdateData.confirmPassword"
            autocomplete="off"
            type="password"
            placeholder="请再次输入密码"
          >
          </el-input>
        </el-form-item>
        <el-button type="primary" class="submit-item text-center" @click="login">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, changePassword } from '@/api/rbac';
import { setToken } from '@/storage/auth';
import { remove } from '@/utils/remove';
const md5 = require('md5');

export default {
  name: 'login',
  data() {
    const nameValidator = (rule, value, callback) => {
      value = String(value).replace(/^\s+|\s+$/g, '');
      if (!value) {
        callback(new Error('用户名不能为空'));
      } else {
        callback();
      }
    };
    // const pwdValidator = (rule, value, callback) => {
    //   value = String(value).replace(/^\s+|\s+$/g, '');
    //   if (!value) {
    //     callback(new Error('密码不正确'));
    //   } else if (value.length < 1 || value.length > 18) {
    //     callback(new Error('密码长度为1~18位'));
    //   } else {
    //     callback();
    //   }
    // };
    // const pwdConfValidator = (rule, value, callback) => {
    //   value = String(value).replace(/^\s+|\s+$/g, '');
    //   if (!value) {
    //     callback(new Error('密码不正确'));
    //   } else if (value.length < 6 || value.length > 20) {
    //     callback(new Error('密码长度为6~20位'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      isFirst: true, // 请登录/设置新密码
      canLogin: false,
      loginLoading: false,
      formData: {
        username: '',
        password: ''
      },
      formUpdateData: {
        confirmPassword: '',
        password: ''
      },
      rules: {
        username: [{ validator: nameValidator, required: true, trigger: 'blur' }]
        // password: [{ validator: this.$$Validator.password('', 6, 20), required: true, trigger: 'blur' }]
        // password: [{ validator: pwdValidator, required: true, trigger: 'blur' }]
      },
      updateRules: {
        // confirmPassword: [{ validator: pwdConfValidator, required: true, trigger: 'blur' }],
        // password: [{ validator: pwdConfValidator, required: true, trigger: 'blur' }]
        confirmPassword: [{ validator: this.$$Validator.password('', 6, 20), required: true, trigger: 'blur' }],
        password: [{ validator: this.$$Validator.password('', 6, 20), required: true, trigger: 'blur' }]
      },
      usernameFocus: false,
      passwordFocus: false,
      showModal: false,
      dialogTitle: ''
    };
  },
  watch: {
    formData: {
      handler(newVal) {
        // this.$refs['form'].validate();
        if (newVal.username && newVal.password) {
          this.canLogin = true;
        }
        this.usernameFocus = newVal.username.length;
        this.passwordFocus = newVal.password.length;
      },
      deep: true
    }
  },
  created() {
    remove();
  },
  methods: {
    getClass(prop) {
      return this[prop] ? 'input' : 'no-input';
    },
    valid(e) {
      this.$refs.form.validateField(Reflect.ownKeys(this.formData), () => {
        this.canLogin = this.validName() && this.validPwd();
      });
      e.preventDefault();
      e.returnValue = '';
    },
    validName() {
      const name = this.formData.username.replace(/^\s+|\s+$/g, '');
      return name.length;
    },
    validPwd() {
      const pwd = this.formData.password.replace(/^\s+|\s+$/g, '');
      return pwd.length >= 1 && pwd.length <= 18;
    },
    login() {
      this.$refs['form'].validate(valid => {
        if (!valid) return;
        this.canLogin = false;
        this.loginLoading = true;
        // getPublicKey({ username: this.formData.username.trim() }).then(res => {
        //   if (res.success) {
        //     const encryptor = new JSEncrypt();
        //     encryptor.setPublicKey(res.object);
        if (this.isFirst) {
          this.firstLogin();
        } else {
          this.updateUserInfo();
        }
        // }
        // });
      });
    },
    updateUserInfo() {
      changePassword({
        username: this.formData.username.trim(),
        password: md5(this.formUpdateData.password.trim()),
        confirmPassword: md5(this.formUpdateData.confirmPassword.trim())
      })
        .then(response => {
          const { message, code, object } = response;
          if (code !== 200) {
            this.$message.error(message);
          } else {
            if (object) {
              this.$message.success(message);
              setToken(object);
              this.$router.push('/modules', null, null);
            } else {
              this.$router.push('/login', null, null);
            }
          }
        })
        .catch(() => {
          this.canLogin = true;
          this.loginLoading = false;
          this.$router.push('/login', null, null);
        });
    },
    firstLogin() {
      login({
        username: this.formData.username.trim(),
        password: md5(this.formData.password.trim())
      })
        .then(response => {
          const { object, message } = response;
          if (typeof object === 'boolean') {
            this.isFirst = false;
            this.$message.info(`${message}`);
          } else if (object == null) {
            this.isFirst = true;
            this.$message.info(message);
          } else if (this.$$util.isObject(object)) {
            setToken(object);
            this.$message.info(`登录成功`);
            this.$router.push('/modules', null, null);
          }
        })
        .catch(() => {
          this.$message.error(`登录失败`);
        });
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.login {
  &-container {
    width: 613px;
    height: 594px;
    position: absolute;
    top: 27.59%;
    left: 6.77%;
  }
  .platform {
    width: 613px;
    height: 62px;
    margin-bottom: 39px;
    background: url(img/platform.png) center no-repeat;
  }
  .platform-text {
    width: 493px;
    height: 19px;
    margin-bottom: 71px;
    background: url(img/platform-text.png) center no-repeat;
  }
  &-tip {
    font-size: $--font-size-lg;
    font-weight: 500;
    color: $--color-regular;
    line-height: 27px;
    letter-spacing: 3px;
    margin-bottom: 40px;
  }
  &-logo {
    width: 223px;
    height: 29px;
    background: url(img/logo.png) -46px 0 no-repeat;
    position: fixed;
    left: 6.77%;
    top: 3.7%;
  }
  &-form {
    &-item {
      position: relative;
      margin-right: 0;
      button {
        border: none;
        color: #fff;
        font-size: 16px;
        font-weight: 800;
        cursor: pointer;
        span + span {
          margin-left: 60px;
        }
      }
      button:focus {
        outline: none;
      }
    }
    .login-label {
      margin-bottom: 6px;
      height: 14px;
      font-size: 14px;
      font-family: 'SourceHanSansCN-Normal, SourceHanSansCN';
      font-weight: 400;
      color: $--login-label-color;
      line-height: 21px;
      letter-spacing: 2px;
    }
    .username {
      margin-bottom: 30px;
    }
    .password {
      margin-bottom: 80px;
    }
    .submit-item {
      width: 240px;
      height: 62px;
      font-size: 14px;
      letter-spacing: 2px;
      font-weight: bold;
      color: $--font-color-light;
      cursor: pointer;
      //background: url(img/login-btn.png) center no-repeat;
    }
  }

  input {
    background: transparent !important;
    padding: 14px 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 1px;
    border: none;
    width: 359px;
    height: 54px;
    border-radius: 0;
    border-bottom: 1px solid $--login-input-border-color;
  }

  .no-input {
    color: $--login-label-color;

    input:-webkit-autofill,
    :-webkit-autofill,
    :-webkit-autofill:hover,
    :-webkit-autofill:focus,
    :-webkit-autofill:active {
      background-color: transparent !important;
      background-image: none !important;
      -webkit-box-shadow: 0 0 3px 100px transparent inset !important;
      -webkit-text-fill-color: $--login-label-color !important;
      transition: background-color 50000s ease-in-out 0s;
    }
  }

  .input {
    font-family: 'SourceHanSansCN-Normal, SourceHanSansCN';
    color: $--login-input-color;

    input:-webkit-autofill,
    :-webkit-autofill,
    :-webkit-autofill:hover,
    :-webkit-autofill:focus,
    :-webkit-autofill:active {
      background-color: transparent !important;
      background-image: none !important;
      -webkit-box-shadow: 0 0 3px 100px transparent inset !important;
      -webkit-text-fill-color: $--login-input-color !important;
      transition: background-color 50000s ease-in-out 0s;
    }
  }
}
.login-bg-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  min-height: 660px !important;
  overflow: hidden;
  background: url(img/login-bg.png) center/cover no-repeat;
  //-webkit-background-size: 1920px 1080px;
  //background-size: 1920px 1080px;
}
</style>

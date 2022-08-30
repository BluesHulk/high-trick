<template>
  <el-dialog :close-on-click-modal="false" width="520px" title="修改密码" :visible="visible" :before-close="cancel">
    <el-form ref="form" :model="formUpdateData" :rules="updateRules" class="pwd-form" @submit.native.prevent>
      <el-form-item prop="password">
        <div class="pwd-label">当前密码</div>
        <el-input
          @keyup.native.enter="valid"
          v-model="formUpdateData.password"
          autocomplete="off"
          type="password"
          placeholder="请输入新密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword1" class="update-pwd">
        <div class="pwd-label">新密码</div>
        <el-input
          @keyup.native.enter="valid"
          v-model="formUpdateData.confirmPassword1"
          autocomplete="off"
          :type="pwd1type"
          placeholder="请输入新密码"
        >
        </el-input>
        <img id="pwd1img" class="eye-img" :src="eyeClose" alt="" @click="setType('pwd1type', $event)" />
      </el-form-item>
      <el-form-item prop="confirmPassword2" class="update-pwd">
        <div class="pwd-label">新密码确认</div>
        <el-input
          @keyup.native.enter="valid"
          v-model="formUpdateData.confirmPassword2"
          autocomplete="off"
          :type="pwd2type"
          placeholder="请再次输入密码"
        >
        </el-input>
        <img id="pwd2img" class="eye-img" :src="eyeClose" alt="" @click="setType('pwd2type', $event)" />
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
const md5 = require('md5');
const eye = require('@/assets/eye.png');
const eyeClose = require('@/assets/eye-close.png');

export default {
  name: 'pwd',
  props: {
    visible: Boolean
  },
  components: {
    PrimaryButton,
    CancelButton
  },
  data() {
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
      eye,
      eyeClose,
      pwd1type: 'password',
      pwd2type: 'password',
      formUpdateData: {
        confirmPassword1: '',
        confirmPassword2: '',
        password: ''
      },
      updateRules: {
        // confirmPassword1: [{ validator: pwdConfValidator, required: true, trigger: 'blur' }],
        // confirmPassword2: [{ validator: pwdConfValidator, required: true, trigger: 'blur' }],
        // password: [{ validator: pwdConfValidator, required: true, trigger: 'blur' }]
        confirmPassword1: [{ validator: this.$$Validator.password('', 6, 20), required: true, trigger: 'blur' }],
        confirmPassword2: [{ validator: this.$$Validator.password('', 6, 20), required: true, trigger: 'blur' }],
        password: [{ validator: this.$$Validator.password('', 6, 20), required: true, trigger: 'blur' }]
      }
    };
  },
  methods: {
    resetImg() {
      const pwd1img = document.getElementById('pwd1img');
      const pwd2img = document.getElementById('pwd2img');
      pwd1img.setAttribute('src', eyeClose);
      pwd2img.setAttribute('src', eyeClose);
    },
    setType(type, event) {
      const { target } = event;
      let t;
      let s;
      if (this[type] === 'text') {
        t = 'password';
        s = eyeClose;
      } else {
        t = 'text';
        s = eye;
      }
      this[type] = t;
      target.setAttribute('src', s);
    },
    valid(e) {
      this.$refs.form.validateField(Reflect.ownKeys(this.formUpdateData), () => {
        this.validPwd('confirmPassword1');
        this.validPwd('confirmPassword2');
        this.validPwd('password');
      });
      e.preventDefault();
      e.returnValue = '';
    },
    validPwd(key) {
      const pwd = this.formUpdateData[key].replace(/^\s+|\s+$/g, '');
      return pwd.length > 5 && pwd.length < 21;
    },
    submit() {
      const password = this.formUpdateData.password;
      const confirmPassword1 = this.formUpdateData.confirmPassword1;
      const confirmPassword2 = this.formUpdateData.confirmPassword2;
      if (!password) {
        this.$message.error(`请输入当前密码`);
        return;
      }
      if (!confirmPassword1 || !confirmPassword2) {
        this.$message.error(`请输入新密码`);
        return;
      }
      if (confirmPassword1 !== confirmPassword2) {
        this.$message.error(`新密码两次输入的不一致`);
        return;
      }
      const data = {};
      data.originPassword = md5(password);
      data.newPassword = md5(confirmPassword1);
      data.confirmPassword = md5(confirmPassword1);
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.$emit('submit', data);
        this.cancel();
      });
    },
    cancel() {
      this.pwd1type = 'password';
      this.pwd2type = 'password';
      this.resetImg();
      this.$emit('reset');
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style lang="scss">
.pwd-form {
  .pwd-label {
    height: 22px;
    font-size: 14px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: #747aa5;
    line-height: 21px;
    margin-bottom: 2px;
  }
  .el-input {
    width: 320px;
  }
  .update-pwd {
    position: relative;
    .eye-img {
      width: 16px;
      height: 16px;
      position: absolute;
      top: 38px;
      right: 170px;
    }
  }
}
</style>

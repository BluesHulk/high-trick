<template>
  <el-button :type="type" @click="jump">{{ text }}</el-button>
</template>

<script>
import ButtonType from '@/constants/ButtonType';

export default {
  name: 'a-page-button',
  props: {
    type: String,
    path: String,
    actionType: ButtonType
  },
  computed: {
    text() {
      return this.$$ButtonText[this.actionType];
    }
  },
  methods: {
    jump() {
      this.$router.push(
        this.path,
        () => {
          this.$emit('success', arguments);
        },
        err => this.$emit('error', err)
      );
    }
  }
};
</script>

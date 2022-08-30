<template>
  <el-button :type="type" @click="$router.go(-1)">{{ $$ButtonText.BACK }}</el-button>
</template>

<script>
export default {
  name: 'a-back',
  props: {
    type: String
  }
};
</script>

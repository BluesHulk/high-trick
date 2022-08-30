<template>
  <el-button :type="type" @click="back">{{ $$ButtonText.BACK }}</el-button>
</template>

<script>
export default {
  name: 'a-back-confirm',
  props: {
    type: String
  },
  computed: {
    isViews() {
      return this.$route.path.includes('/views');
    }
  },
  methods: {
    back() {
      if (this.isViews) {
        this.$router.go(-1);
      } else {
        this.$confirm('尚未保存，确定返回吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.go(-1);
          })
          .catch(() => this.$message({ type: 'info', message: '已取消' }));
      }
    }
  }
};
</script>

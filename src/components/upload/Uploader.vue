<template>
  <form style="display: inline-block" ref="uploadForm" name="uploadForm">
    <label>
      <slot></slot>
      <input style="display: none" :accept="fileTypes" type="file" @change="handleUpload" />
    </label>
  </form>
</template>

<script>
export default {
  name: 'uploader',
  props: {
    fileTypes: {
      type: String,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    message: String
  },
  mounted() {
    this.$refs.uploadForm.reset();
  },
  methods: {
    reset() {
      this.$refs.uploadForm.reset();
    },
    handleUpload(e) {
      const files = e.target.files;
      const file = files[0];
      if (!this.fileTypes.includes(file.name.toLowerCase().substring(file.name.lastIndexOf('.'), file.name.length))) {
        this.$message.error(this.message);
        return;
      }
      if (!(file.size / 1024 < this.max && file.size / 1024 > this.min)) {
        this.$message.error(`上传文件大小为${this.min}kb~${this.max}kb`);
        return;
      }
      this.$emit('change', files);
    }
  }
};
</script>

<template>
  <el-dialog :close-on-click-modal="false" width="520px" :title="title" :visible="visible" :before-close="cancel">
    <div class="text-center download-wrapper">
      <div class="download-template-wrapper">
        <span class="download-static">请下载</span>
        <span class="download-template" @click="organizeDownload">人员导入模板</span>
      </div>
      <div class="download-tip">只支持.xlsx或.xls文件</div>
    </div>
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <Uploader
        :min="0"
        :max="20 * 1024"
        ref="uploader"
        @change="handleUpload"
        message="请上传excel文件"
        :file-types="fileTypes"
      >
        <PrimaryButton @click="selectFile">选择文件</PrimaryButton>
      </Uploader>
    </div>
  </el-dialog>
</template>

<script>
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import Uploader from '@/components/upload/Uploader.vue';

import { organizeDownload, organizeUpload } from '@/api/rbac';
import { downloadExcel } from '@/utils/utils';
import { showImportTips } from '@/classes/Message';

export default {
  name: 'import',
  components: {
    CancelButton,
    PrimaryButton,
    Uploader
  },
  props: {
    visible: Boolean,
    title: String
  },
  data() {
    return {
      fileTypes: '.xls,.xlsx'
    };
  },
  methods: {
    handleUpload(files) {
      const data = new FormData();
      data.append('file', files[0]);
      this.$$ALoading.show();
      organizeUpload(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '上传成功');
          } else {
            // this.$message.error(message || '上传失败');
            showImportTips(res);
          }
        })
        .finally(() => {
          this.$$ALoading.close();
          this.$emit('reset');
        });
    },
    organizeDownload() {
      organizeDownload()
        .then(res => {
          downloadExcel(res, '人员导入模板');
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit('reset');
    },
    selectFile() {
      this.$refs.uploader.reset();
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
  .download-tip {
    height: 14px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: $--color-username;
    line-height: 21px;
    letter-spacing: 1px;
  }
}
</style>

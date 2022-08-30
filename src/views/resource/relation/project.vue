<template>
  <div class="relaton-device">
    <div class="relation-title">
      项目资料
      <div class="float-right" v-if="this.actionType == 'edit'">
        <ActionButton :type="$$ActionType.add" v-if="actionType != 'views'" @click="add">
          {{ $$ButtonText.plus }}
        </ActionButton>
      </div>
    </div>
    <el-table
      ref="projectTable"
      :data="tableData.records"
      tooltip-effect="dark"
      class="freestyle-device"
      style="width: 100%"
    >
      <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip label="项目名称" width="210" prop="name"></el-table-column>
      <el-table-column show-overflow-tooltip label="创建日期" prop="createdTime">
        <template slot-scope="scope">{{ getTime(scope.row.createdTime) }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="修改日期" prop="updatedTime">
        <template slot-scope="scope">{{ getTime(scope.row.updatedTime) }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="文件大小" prop="size">
        <template slot-scope="scope">{{ scope.row.size }}kb</template>
      </el-table-column>
      <el-table-column v-if="this.actionType !== 'views'" show-overflow-tooltip label="操作" width="100" prop="">
        <template slot-scope="scope">
          <el-tooltip class="itemAction" effect="dark" content="下载" placement="top" align="center">
            <span class="tooltip-margin" @click="download(scope.row)" style="margin-right: 20px">
              <img src="../../../assets/button/download.png" />
            </span>
          </el-tooltip>
          <el-tooltip class="itemAction" effect="dark" content="删除" placement="top" align="center">
            <span class="tooltip-margin" @click="disconnect(scope.row)">
              <img src="../../../assets/button/del-active.png" />
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" width="1150px" title="上传文件" :visible="visible" :before-close="cancel">
      <div class="projectTree">
        <div class="tip">
          <div class="message">一次最多上传十个文件</div>
          <el-upload
            ref="upload"
            class="upload-demo"
            multiple
            :action="uploadUrl()"
            :limit="limitNum"
            :headers="uploadHeader"
            :data="uploadData()"
            :file-list="fileList"
            :on-exceed="exceedFile"
            :on-success="successFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </div>
    </el-dialog>
    <del-confirm
      v-if="delVisible"
      :del-visible="delVisible"
      :del-text="delText"
      @del-concel="delConcel"
      @del-submit="delSubmit"
    ></del-confirm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getToken } from '@/storage/auth';
import ActionButton from '@/components/button/ActionButton.vue';
import delConfirm from '@/views/resource/relation/delConfirm';
import { attachQuery, attachDelete } from '@/api/config';

export default {
  name: 'space-device',
  components: {
    ActionButton,
    delConfirm
  },
  props: {
    actionType: String,
    currentData: Object,
    deviceType: String,
    relatedDevice: Array,
    currentItem: Object
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      visible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      checkList: [],
      tableData: {
        records: []
      },
      limitNum: 10,
      fileList: [],
      uploadHeader: {
        // Authorization: 'bearer' + this.$store.getters.ACCESS_TOKEN.access_token,
        Authorization: getToken().Authorization,
        Accept: 'application/json, text/plain, */*',
        'client-ip': localStorage.getItem('Ip')
      },
      delVisible: false,
      delText: '',
      delObject: {}
    };
  },
  watch: {
    actionType(newV, oldV) {},
    currentData(newV, oldV) {},
    currentItem(newV, oldV) {
      console.log(newV.name);
      if (JSON.stringify(newV) != '{}') {
        this.getRelationData();
      }
    }
  },
  created() {},
  mounted() {
    if (this.actionType !== 'add') {
      this.getRelationData();
    }
  },
  methods: {
    getRelationData() {
      attachQuery({ resourceType: 'PROJECT', resourceId: this.currentData.id }).then(res => {
        if (res.code == 200) {
          this.tableData.records = res.object;
        }
      });
    },
    add() {
      this.visible = true;
    },
    checkDevices(data) {},
    disconnect(data) {
      this.delVisible = true;
      this.delText = data.name;
      this.delObject = data;
    },
    delConcel() {
      this.delVisible = false;
    },
    delSubmit() {
      attachDelete({ id: this.delObject.id, resourceId: this.delObject.resourceId, resourceType: 'PROJECT' }).then(
        res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.getRelationData();
            this.delVisible = false;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    download(data) {
      // window.open(data.url);
      this.downloadUrlFile(data.url, data.name);
    },
    // 下载含有url的文件
    downloadUrlFile(url, fileName) {
      const url2 = url.replace(/\\/g, '/');
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url2, true);
      xhr.responseType = 'blob';
      // xhr.setRequestHeader('Authorization', 'Basic a2VybWl0Omtlcm1pdA==');
      // 为了避免大文件影响用户体验，建议加loading
      xhr.onload = () => {
        if (xhr.status === 200) {
          // 获取文件blob数据并保存
          this.saveAs(xhr.response, fileName);
        }
      };
      xhr.send();
    },
    saveAs(data, name) {
      const urlObject = window.URL || window.webkitURL || window;
      const export_blob = new Blob([data]);
      const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      save_link.click();
    },
    uploadUrl() {
      return location.origin + `/resource/attach/add`;
    },
    uploadData() {
      // 除file，额外的入参
      return { resourceType: 'PROJECT', resourceId: this.currentData.id };
    },
    exceedFile(files, fileList) {
      // 文件超出个数限制
      this.$message.error(`最多只能上传 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
    },
    successFile(response, file, fileList) {
      // 文件上传成功
      if (response.code == 200) {
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
      }
    },
    cancel() {
      this.visible = false;
      this.getRelationData();
    },
    getTime(date) {
      var dateee = new Date(date).toJSON();
      return new Date(+new Date(dateee) + 0)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');
    }
  }
};
</script>
<style lang="scss" scope>
.relaton-device {
  .relation-title {
    font-size: 16px;
    overflow: hidden;
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
@import '@/styles/ui-theme';
.projectTree {
  .tip {
    position: relative;
  }
  .message {
    position: absolute;
    top: 5px;
  }
  .el-upload {
    float: right;
  }
  .el-upload-list {
    overflow: hidden;
    width: 100%;
    .el-upload-list__item {
      margin-top: 40px;
      float: left;
      width: 47%;
    }
    .el-upload-list__item:nth-of-type(2n) {
      margin-left: 6%;
    }
  }
}
</style>

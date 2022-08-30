<template>
  <div class="currtPro">
    <form action name="fileinfo">
      <p>现场情况</p>
      <div class="img_box">
        <div class="img_size" v-for="(item, index) of imgList" :key="index" v-show="imgList.length != 0">
          <img v-if="item.file.type.indexOf('image') !== -1" :src="item.file.src" />
          <video v-else :src="item.file.src"></video>
          <div class="remove_logo" @click="fileDel(index)">
            <img src="../../assets/button/img-del.png" />
          </div>
        </div>
        <div class="add_img" @click="fileClick" v-show="addState">
          <span>
            <img src="../../assets/button/img-add.png" />
          </span>
        </div>
        <div @click="uploadImage"></div>
        <input
          id="inpu"
          name="files"
          style="display: none;"
          @change="fileChange($event)"
          type="file"
          ref="file"
          accept="'image/*,video/*'"
        />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgList: [],
      addState: true
    };
  },
  watch: {
    imgList() {
      if (this.imgList.length == 14) {
        this.addState = false;
      } else {
        this.addState = true;
      }
      this.$emit('getImgAudioList', this.imgList);
    }
  },
  methods: {
    fileClick() {
      document.getElementById('inpu').click();
    },
    fileChange(el) {
      //   const list = this.$refs.file.files;
      //   if (el.target.files[0].size> 2000)文件大小限制
      if (!el.target.files[0].size) return;
      this.fileList(el.target);
      el.target.value = '';
    },
    fileList(fileList) {
      const files = fileList.files;
      for (let i = 0; i < files.length; i++) {
        // 判断是否为文件夹
        if (files[i].type != '') {
          this.fileAdd(files[i]);
        } else {
          // 文件夹处理
          this.folders(fileList.items[i]);
        }
      }
    },
    // 文件夹处理
    folders(files) {
      const _this = this;
      // 判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry();
      }
      files.createReader().readEntries(function(file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i]);
          } else {
            _this.folders(file[i]);
          }
        }
      });
    },
    foldersAdd(entry) {
      const _this = this;
      entry.file(function(file) {
        _this.fileAdd(file);
      });
    },
    fileAdd(file) {
      // 总大小
      this.size = this.size + file.size;
      const reader = new FileReader();
      reader.vue = this;
      reader.readAsDataURL(file);
      reader.onload = function() {
        file.src = this.result;
        this.vue.imgList.push({
          file
        });
      };
    },
    fileDel(index) {
      console.log(index);
      this.imgList.splice(index, 1);
    },
    bytesToSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1000; // or 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    uploadImage: function() {
      var form = document.forms.namedItem('fileinfo');
      var formData = new FormData(form);
      for (var i = 0; i < this.imgList.length; i++) {
        formData.append('file' + [i + 1], this.imgList[i].file);
      }
    }
  }
};
</script>

<style lang="scss">
.currtPro {
  p {
    font-size: 14px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: #747aa5;
    margin-top: 20px;
  }
}
.img_box {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  .img_size {
    position: relative;
    width: 110px;
    height: 110px;
    margin-right: 20px;
    border-radius: 4px;
    margin-bottom: 25px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
    video {
      width: 110px;
      height: 110px;
      display: inline-block;
    }
    .remove_logo {
      position: absolute;
      top: -11px;
      right: -11px;
      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }
    }
  }
  .add_img {
    width: 110px;
    height: 110px;
    background: #f6f8fc;
    border-radius: 4px;
    border: 1px solid #d2daea;
    span {
      display: inline-block;
      width: 34px;
      height: 34px;
      margin-left: 38px;
      margin-top: 35px;
    }
  }
}
</style>

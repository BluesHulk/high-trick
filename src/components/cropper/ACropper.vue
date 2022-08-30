<template>
  <el-dialog
    :close-on-click-modal="false"
    width="408px"
    title="上传照片"
    :visible="visible"
    :before-close="cancel"
    :modal="showModal"
  >
    <input style="display: none" ref="input" type="file" name="image" :accept="accept" @change="setImage" />
    <ACropper
      ref="aCropper"
      drag-mode="move"
      guides
      :container-class="containerClass"
      img-class="a-img-class"
      :src="imgSrc"
      :auto-crop-area="1"
      :min-container-width="minContainerWidth"
      :min-container-height="minContainerHeight"
      :min-canvas-height="minContainerHeight"
      :crop-box-resizable="cropBoxResizable"
      :initial-aspect-ratio="initialAspectRatio"
      :aspect-ratio="aspectRatio"
      @ready="onCropReady"
    ></ACropper>
    <div class="icon-wrapper a-toolbar-between mb-16">
      <div><span class="font-color-primary" @click="showFileChooser">上传图片</span></div>
      <div>
        <i class="el-icon-minus" @click.prevent="zoom(-0.1)"></i>
        <i class="el-icon-plus" @click.prevent="zoom(0.1)"></i>
        <i class="el-icon-refresh-right" @click.prevent="replace"></i>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ACropper from './ACropper';
import 'cropperjs/dist/cropper.css';
import 'blueimp-canvas-to-blob/js/canvas-to-blob.min';
// import compress from 'compress-base64';

function getImgSize(base64url) {
  const indexBase64 = base64url.indexOf('base64,');
  if (indexBase64 < 0) return -1;
  const str = base64url.substr(indexBase64 + 6);
  return str.length;
}

export default {
  props: {
    showModal: Boolean,
    accept: String,
    min: Number,
    max: Number,
    quality: Number, // 0~1
    containerClass: String,
    minContainerWidth: {
      type: Number,
      default: 360
    },
    minContainerHeight: {
      type: Number,
      default: 360
    },
    cropBoxResizable: Boolean,
    initialAspectRatio: Number,
    aspectRatio: Number,
    visible: Boolean
  },
  components: {
    ACropper
  },
  data() {
    return {
      fileType: '',
      headerImage: '',
      picValue: '',
      cropper: '',
      croppable: false,
      panel: false,
      imgSrc: '',
      cropImg: '',
      cropData: null
    };
  },
  mounted() {
    this.imgSrc = this.createCanvas();
    this.$nextTick(() => {
      this.loading = this.$$ALoading.show({
        target: this.$refs.aCropper.$el,
        lock: true,
        text: '正在加载...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    });
  },
  methods: {
    createCanvas() {
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 420;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgb(240, 242, 245)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/png');
    },
    ok() {
      this.cropImage().then(() => {
        const size = getImgSize(this.cropImg);
        if (this.max != null && this.min != null) {
          if (size < this.min || size > this.max) {
            this.$message.error('图片尺寸应该在20k~200k之间');
            return;
          }
        }
        this.$emit('submit', this.cropImg);
      });
    },
    cancel() {
      this.$emit('reset');
    },
    onCropReady() {
      this.loading.close();
    },
    cropImage() {
      return new Promise(resolve => {
        this.cropImg = this.$refs.aCropper.getCroppedCanvas().toDataURL(this.fileType);
        resolve();
      });
    },
    getCropBoxData() {
      this.cropData = JSON.stringify(this.$refs.aCropper.getCropBoxData(), null, 4);
    },
    move(offsetX, offsetY) {
      this.$refs.aCropper.move(offsetX, offsetY);
    },
    replace() {
      this.$refs.aCropper.replace(this.createCanvas(), true);
    },
    // rotate(deg) {
    //   this.$refs.aCropper.rotate(deg);
    // },
    // getData() {
    //   this.cropData = JSON.stringify(this.$refs.aCropper.getData(), null, 4);
    // },
    // flipX() {
    //   const dom = this.$refs.flipX;
    //   let scale = dom.getAttribute('data-scale');
    //   scale = scale ? -scale : -1;
    //   this.$refs.aCropper.scaleX(scale);
    //   dom.setAttribute('data-scale', scale);
    // },
    // flipY() {
    //   const dom = this.$refs.flipY;
    //   let scale = dom.getAttribute('data-scale');
    //   scale = scale ? -scale : -1;
    //   this.$refs.aCropper.scaleY(scale);
    //   dom.setAttribute('data-scale', scale);
    // },
    // setCropBoxData() {
    //   if (!this.cropData) return;
    //   this.$refs.aCropper.setCropBoxData(JSON.parse(this.cropData));
    // },
    // setData() {
    //   if (!this.cropData) return;
    //   this.$refs.aCropper.setData(JSON.parse(this.cropData));
    // },
    setImage(e) {
      const file = e.target.files[0];
      if (file.type.indexOf('image/') === -1) {
        this.$message.info('请选择一个图片文件');
        return;
      }
      if (this.accept && this.accept.includes(file.type)) {
        this.$message.info('文件类型不符合');
        return;
      }
      // if (file.size < this.min || file.size > this.max) {
      //   this.$message.info('文件尺寸不符合');
      //   return;
      // }
      this.fileType = file.type;
      this.$emit('file', file);
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        this.$$ALoading.show();
        reader.onload = event => {
          this.$$ALoading.close();
          this.$refs.aCropper.replace(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        this.$message.info('当前浏览器不支持');
      }
    },
    showFileChooser() {
      this.$refs.input.click();
    },
    zoom(percent) {
      this.$refs.aCropper.relativeZoom(percent);
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
// GT20201103-129
/*.a-cropper-container {
  width: 360px;
  height: 420px;
}*/
.cropper-dashed {
  border-color: rgba(233, 139, 52, 1);
}
.icon-wrapper {
  line-height: 32px;
  .font-color-primary,
  i {
    cursor: pointer;
  }
  i {
    text-align: center;
    line-height: 16px;
    background-color: $--bg-important;
    color: $--font-color-light;
    width: 16px;
    height: 16px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    &:before {
      margin-left: 2px;
    }
  }
  i + i {
    margin-left: 8px;
  }
}
</style>

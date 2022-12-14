import Cropper from 'cropperjs';

export default {
  render(h) {
    const crossorigin = this.crossorigin || undefined;

    return h('div', { staticClass: this.containerClass }, [
      h('img', {
        ref: 'img',
        attrs: {
          src: this.src,
          alt: this.alt || 'image',
          style: 'max-width: 100%',
          crossorigin
        },
        on: this.$listeners,
        staticClass: this.imgClass
      })
    ]);
  },
  props: {
    containerClass: String,
    src: {
      type: String,
      default: ''
    },
    alt: String,
    imgClass: String,

    viewMode: Number,
    dragMode: String,
    initialAspectRatio: Number,
    aspectRatio: Number,
    data: Object,
    preview: typeof window === 'undefined' ? [String, Array] : [String, Array, Element, NodeList],
    responsive: {
      type: Boolean,
      default: true
    },
    restore: {
      type: Boolean,
      default: true
    },
    checkCrossOrigin: {
      type: Boolean,
      default: true
    },
    checkOrientation: {
      type: Boolean,
      default: true
    },
    crossorigin: {
      type: String
    },
    modal: {
      type: Boolean,
      default: true
    },
    guides: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: true
    },
    highlight: {
      type: Boolean,
      default: true
    },
    background: {
      type: Boolean,
      default: true
    },
    autoCrop: {
      type: Boolean,
      default: true
    },
    autoCropArea: Number,
    movable: {
      type: Boolean,
      default: true
    },
    rotatable: {
      type: Boolean,
      default: true
    },
    scalable: {
      type: Boolean,
      default: true
    },
    zoomable: {
      type: Boolean,
      default: true
    },
    zoomOnTouch: {
      type: Boolean,
      default: true
    },
    zoomOnWheel: {
      type: Boolean,
      default: true
    },
    wheelZoomRatio: {
      type: Number,
      default: 0.1
    },
    cropBoxMovable: {
      type: Boolean,
      default: true
    },
    cropBoxResizable: {
      type: Boolean,
      default: true
    },
    toggleDragModeOnDblclick: {
      type: Boolean,
      default: true
    },

    minCanvasWidth: Number,
    minCanvasHeight: Number,
    minCropBoxWidth: Number,
    minCropBoxHeight: Number,
    minContainerWidth: Number,
    minContainerHeight: Number,

    ready: Function,
    cropstart: Function,
    cropmove: Function,
    cropend: Function,
    crop: Function,
    zoom: Function
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    const { containerClass, src, alt, imgClass, ...data } = this.$options.props;
    const props = {};

    for (const key in data) {
      if (this[key] !== undefined) {
        props[key] = this[key];
      }
    }

    this.cropper = new Cropper(this.$refs.img, props);
  },
  methods: {
    reset() {
      return this.cropper.reset();
    },
    clear() {
      return this.cropper.clear();
    },
    initCrop() {
      return this.cropper.crop();
    },
    replace(url, onlyColorChanged = false) {
      return this.cropper.replace(url, onlyColorChanged);
    },
    enable() {
      return this.cropper.enable();
    },
    disable() {
      return this.cropper.disable();
    },
    destroy() {
      return this.cropper.destroy();
    },
    move(offsetX, offsetY) {
      return this.cropper.move(offsetX, offsetY);
    },
    moveTo(x, y = x) {
      return this.cropper.moveTo(x, y);
    },
    relativeZoom(ratio, _originalEvent) {
      return this.cropper.zoom(ratio, _originalEvent);
    },
    zoomTo(ratio, _originalEvent) {
      return this.cropper.zoomTo(ratio, _originalEvent);
    },
    rotate(degree) {
      return this.cropper.rotate(degree);
    },
    rotateTo(degree) {
      return this.cropper.rotateTo(degree);
    },
    scaleX(scaleX) {
      return this.cropper.scaleX(scaleX);
    },
    scaleY(scaleY) {
      return this.cropper.scaleY(scaleY);
    },
    scale(scaleX, scaleY = scaleX) {
      return this.cropper.scale(scaleX, scaleY);
    },
    getData(rounded = false) {
      return this.cropper.getData(rounded);
    },
    setData(data) {
      return this.cropper.setData(data);
    },
    getContainerData() {
      return this.cropper.getContainerData();
    },
    getImageData() {
      return this.cropper.getImageData();
    },
    getCanvasData() {
      return this.cropper.getCanvasData();
    },
    setCanvasData(data) {
      return this.cropper.setCanvasData(data);
    },
    getCropBoxData() {
      return this.cropper.getCropBoxData();
    },
    setCropBoxData(data) {
      return this.cropper.setCropBoxData(data);
    },
    getCroppedCanvas(options = {}) {
      return this.cropper.getCroppedCanvas(options);
    },
    setAspectRatio(aspectRatio) {
      return this.cropper.setAspectRatio(aspectRatio);
    },
    setDragMode(mode) {
      return this.cropper.setDragMode(mode);
    }
  }
};

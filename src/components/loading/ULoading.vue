<template>
  <div v-if="percentage < 100" class="progress" id="progress">
    <div class="bigCircle wheelAni"></div>
    <div class="smallCircle wheelAlternateAni"></div>
    <div class="font">{{ percentage }}%</div>
    <div class="en">loading</div>
  </div>
</template>

<script>
export default {
  name: 'u-loading',
  props: {
    percentage: Number
  }
};
</script>

<style lang="scss">
.progress {
  position: absolute;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 295px;
  height: 295px;
  .bigCircle {
    position: absolute;
    left: 0;
    top: 0;
    width: 295px;
    height: 295px;
    //background: url('../../assets/data/garden/bigCircle.png') no-repeat center;
    background-size: cover;
  }
  .smallCircle {
    position: absolute;
    left: 58.5px;
    top: 58.5px;
    width: 178px;
    height: 178px;
    transform: rotate(360deg);
    //background: url('../../assets/data/garden/smallCircle.png') no-repeat center;
    background-size: cover;
  }
  .font {
    position: absolute;
    left: 0;
    top: 40px;
    width: 295px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    line-height: 200px;
  }
  .en {
    position: absolute;
    left: 0;
    top: 62px;
    width: 295px;
    text-align: center;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    line-height: 200px;
  }
  @keyframes wheelAnimate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @-moz-keyframes wheelAnimate /* Firefox */ {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes wheelAnimate /* Safari 和 Chrome */ {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes wheelAnimate /* Opera */ {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes wheelAnimate1 {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  @-moz-keyframes wheelAnimate1 /* Firefox */ {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  @-webkit-keyframes wheelAnimate1 /* Safari 和 Chrome */ {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  @-o-keyframes wheelAnimate1 /* Opera */ {
    0% {
      transform: rotate(360deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  .wheelAni {
    animation: wheelAnimate 7s infinite linear;
    -moz-animation: wheelAnimate 7s infinite linear; /* Firefox */
    -webkit-animation: wheelAnimate 7s infinite linear; /* Safari 和 Chrome */
    -o-animation: wheelAnimate 7s infinite linear; /* Opera */
  }
  .wheelAlternateAni {
    animation: wheelAnimate1 7s infinite linear;
    -moz-animation: wheelAnimate1 7s infinite linear; /* Firefox */
    -webkit-animation: wheelAnimate1 7s infinite linear; /* Safari 和 Chrome */
    -o-animation: wheelAnimate1 7s infinite linear; /* Opera */
  }
}
</style>

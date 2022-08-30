<template>
  <el-dialog
    class="add-person-dialog"
    :close-on-click-modal="false"
    width="660px"
    title="选择人员"
    :visible="visible"
    :before-close="cancel"
  >
    <div class="staff-wrapper checkbox-edit">
      <div class="float-container staff-header" style="margin-right: 46px">
        <div class="">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            人员目录
          </el-checkbox>
        </div>
      </div>
      <div class="staff-checkbox-wrapper scrollbar scrollbar-y scrollbar-light">
        <p class="label-header">
          <span class="noneBox"></span>
          <span class="name">姓名</span>
          <span class="phone">
            电话
          </span>
          <span class="duty">身份</span>
        </p>
        <ul class="relFacilityTitcon">
          <li
            v-for="(item, index) in currentNode"
            :key="index"
            :class="{ currentAdd: spanIndex.indexOf(item.id) > -1 }"
          >
            <span @click="changeSpan(item)" class="ckbox"></span>
            <span>
              {{ item.name }}
            </span>
            <span>
              {{ item.phone }}
            </span>
            <span v-if="item.duty == 'MEMBER'">成员</span>
            <span class="manger" v-if="item.duty == 'MANAGER'">
              <i>负责人</i>
              <img style="float:none" src="../../../../../assets/button/star-green.png" alt="" />
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="selected-container">
      <div class="staff-header"><div class="node-name">已选人员</div></div>
      <div class="selected-list scrollbar scrollbar-y scrollbar-light">
        <div class="selected-list-item" v-for="item in checkedList" :key="item.id">
          <div class="selected-list-item-text text-center">{{ item.name }}</div>
          <div class="selected-close el-icon-close text-center" @click="delItem(item)"></div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <PrimaryButton @click="submit">确认</PrimaryButton>
    </div>
  </el-dialog>
</template>

<script>
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import { inspectStaffListForPlan } from '@/api/order';
export default {
  name: 'person',
  components: {
    CancelButton,
    PrimaryButton
  },
  props: {
    visible: Boolean,
    playId: String
  },
  data() {
    return {
      checkedList: [],
      checkAll: false,
      isIndeterminate: false,
      treeNodes: [],
      currentNode: {},
      spanIndex: [],
      comList: [],
      comSelList: []
    };
  },
  created() {
    this.load();
  },
  methods: {
    changeSpan(item) {
      var arrIndex = this.spanIndex.indexOf(item.id);
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1);
        this.checkedList.splice(arrIndex, 1);
      } else {
        this.spanIndex.push(item.id);
        this.checkedList.push(item);
      }
      this.renderChecked();
    },
    handleCheckAllChange(val) {
      // 将当前节点下的所有人员反向选中
      const nodes = this.currentNode;
      for (let i = 0; i < nodes.length; i++) {
        // if (nodes[i].haveAccount) continue;
        nodes[i].selected = this.checkAll;
      }
      this.spanIndex = val ? nodes.map(val => val.id) : [];
      this.checkedList = val ? nodes.map(val => val) : [];
      const len = this.spanIndex.length;
      this.checkAll = len === nodes.length;
      this.isIndeterminate = !!(len && len < nodes.length);
    },
    load() {
      inspectStaffListForPlan({
        planId: this.playId // this.playId
      }).then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.currentNode = object;
          var selected = JSON.parse(window.sessionStorage.getItem('selected'));
          var spanIndex = JSON.parse(window.sessionStorage.getItem('spanIndex'));
          console.log(selected);
          if (selected) {
            this.checkedList = selected;
          } else {
            this.checkedList = object.filter(val => val.selected);
          }
          if (spanIndex) {
            this.spanIndex = spanIndex;
          } else {
            this.spanIndex = object.filter(val => val.selected).map(val => val.id);
          }
          this.renderChecked();
        }
      });
    },
    renderChecked() {
      // 是否勾选了全部
      const len = this.spanIndex.length;
      this.checkAll = len && len === this.currentNode.length;
      // 是否半选
      this.isIndeterminate = !!(len && len < this.currentNode.length);
    },
    delItem(data) {
      // 重置
      for (const p in this.checkedList) {
        const nodes = this.checkedList[p];
        if (nodes.id === data.id) {
          this.checkedList.splice(p, 1);
          this.spanIndex.splice(p, 1);
        }
      }
      this.renderChecked();
    },
    submit() {
      window.sessionStorage.setItem('selected', JSON.stringify(this.checkedList));
      window.sessionStorage.setItem('spanIndex', JSON.stringify(this.spanIndex));
      this.$emit('selected', this.checkedList);
    },
    cancel() {
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/ui-theme';
.add-person-dialog {
  $tw: 354px;
  .el-dialog {
    position: relative;
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .person-tree {
    width: $tw;
    position: absolute;
    top: 85px;
    bottom: 0;
    background-color: $--color-light;
    z-index: 1;
    border-right: 1px solid rgba(210, 218, 234, 0.6);
  }
  .staff-header {
    height: 16px;
    margin-bottom: 2px;
    padding: 20px 0 0 10px;
  }
  .node-name {
    font-size: 16px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: $--color-dark;
    line-height: 16px;
    max-width: 280px;
    //-webkit-text-stroke: 1px #979797;
    //text-stroke: 1px #979797;
  }
  .staff-wrapper {
    width: 416px;
    height: 500px;
    border-right: 1px solid rgba(210, 218, 234, 0.6);
  }
  .staff-checkbox-wrapper {
    height: 402px;
    width: 416px;
    padding-top: 40px;
    .label-header {
      width: 100%;
      height: 20px;
      line-height: 20px;
      span {
        display: inline-block;
        font-size: 14px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #c6cada;
      }
      .noneBox {
        width: 50px;
      }
      .name {
        width: 120px;
      }
      .phone {
        width: 120px;
      }
      .duty {
        width: 118px;
      }
    }
    .relFacilityTitcon {
      li {
        .ckbox {
          display: inline-block;
          width: 50px;
          height: 50px;
          background: url(../../../../../assets/radio/radio-cur.png) no-repeat center center;
          background-size: 18px 18px;
          float: left;
        }
        span {
          display: inline-block;
          height: 50px;
          line-height: 50px;
          float: left;
        }
        span:nth-of-type(2) {
          width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span:nth-of-type(3) {
          width: 120px;
        }
        span:nth-of-type(4) {
          width: 118px;
          img {
            margin-left: 5px;
            margin-top: 17px;
            width: 16px;
            height: 16px;
          }
          i {
            float: left;
            font-style: normal;
          }
        }
        &.currentAdd {
          .ckbox {
            display: inline-block;
            width: 50px;
            height: 50px;
            background: url(../../../../../assets/radio/radio-ck.png) no-repeat center center;
            background-size: 18px 18px;
          }
        }
      }
    }
  }
  .checked-person {
    width: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAMFBMVEUAAAAyR7EyR7QxRbMwRLIwRrEwRbIvRbEvRbIwRbIvRLEwRbE1SbKeqNrx8vn///9P9ieOAAAAC3RSTlMAJD1DmZq/19ft8nDewtUAAABuSURBVAjXY2BgYHZfVWLAAASM2bt3794mAGRp7gaBSUCh2WDWTgEGtt0QkMBgDWVtZojevfvsuzu7d29l6N69+/7/v7t372BYvXv3+///du/ehcSqhspuh+vYgmQKwmSEbQgXILmKgTliVSvQpQDW0F2zs1A6/QAAAABJRU5ErkJggg==)
      center no-repeat;
  }
  .checked-node {
    .a-toolbar-between {
      .person-name {
        font-size: 12px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: $-primary-color;
      }
    }
  }
  .person-name {
    height: 30px;
    line-height: 30px;
  }
  .unchecked-person {
    width: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAPFBMVEUAAADV3PHV2erV3ezS2uvS2+nT2+vS2uvT2uvU2+vS2urT2urY3+3m6vTm6/Ts7/fw8vn09vv19/z2+Pz4gL0aAAAADHRSTlMAJD1DmZq/19ft8vJ3eIQkAAAAcElEQVQY022QWQ7AIAgFse7i7v3v2qppo5b5nMALPIAOFxpRCw4vTPmQS8nBKzbNZWNtgxrtNWZsah/J9jkV20JUT7Kvq6qegwxtI0gweVfZAJZdFQR3Kgf6XNT/eEEdQZxKPUS8TZXTK5QG0chZ4Q0PfhCQbkl/3wAAAABJRU5ErkJggg==)
      center no-repeat;
  }

  .selected-container {
    width: 216px;
    position: absolute;
    top: 85px;
    bottom: 82px;
    right: 0;
  }
  .selected-list {
    margin-right: 40px;
    width: 130px;
    height: 362px;
    padding: 40px;
    &-item {
      width: 130px;
      min-height: 42px;
      background: $--bg-line-selected;
      border-radius: 4px;
      position: relative;
      margin-bottom: 30px;
      &-text {
        line-height: 42px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: $--color-dark;
      }
    }
    .selected-close {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 16px;
      height: 16px;
      background-color: $--color-danger;
      color: $--color-light;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      cursor: pointer;
      line-height: 16px;
    }
  }
  .el-checkbox__input {
    float: left;
    top: 0;
  }
}
.el-tree-node__expand-icon {
  color: $-primary-color;
}
.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 6px 10px;
}
</style>

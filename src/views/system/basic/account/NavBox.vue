<template>
  <div class="nav-box">
    <ul class="nav-ul">
      <li
        class="nav-li"
        :class="{ 'li-activate': navIndex === index }"
        v-for="(item, index) in navList"
        :key="index"
        @click="handleSelect(index, item)"
      >
        <span class="li-text">{{ item.domainName }}</span>
        <div :class="{ 'nav-box-li-line': navIndex === index }"></div>
      </li>
    </ul>
  </div>
</template>

<script>
// import { dataAuthQuery } from '@/api/rbac';
import { dataDomainQueryDomainDetail } from '@/api/rbac';

export default {
  name: 'nav-box',
  props: {
    list: Array
  },
  data() {
    return {
      navList: [
        // 产品设计模块
        // { text: '角色', type: 'role' },
        // { text: '项目', type: 'project' },
        // { text: '场所', type: 'place' },
        // { text: '空间', type: 'space' },
        // { text: '设备', type: 'device' },
        // { text: '其他', type: 'other' }
      ],
      navIndex: 0
    };
  },
  mounted() {
    this.dataDomainQueryDomainDetail();
  },
  methods: {
    dataDomainQueryDomainDetail() {
      dataDomainQueryDomainDetail().then(res => {
        const { code, object } = res;
        if (code === 200 && Array.isArray(object)) {
          this.navList = [{ domain: 'role', domainName: '角色' }].concat(object);
          // if (object.length) {
          //   this.handleSelect(0);
          // }
        }
      });
    },
    handleSelect(index, data) {
      this.$emit('selected', data || this.navList[index]);
      this.navIndex = index;
    }
    // dataAuthQuery() {
    //   dataAuthQuery().then(res => {
    //     const { code, object } = res;
    //     if (code === 200 && Array.isArray(object)) {
    //       this.navList = object;
    //     }
    //   });
    // }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.nav-box {
  width: 100%;
  background: #ffffff;
  .nav-ul {
    background-color: $--bg-main;
    width: 600px;
    height: 42px;
    line-height: 42px;
    margin: 0 auto;
    list-style: none;
    overflow: auto;
    white-space: nowrap;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 21px;
    .nav-li {
      text-align: center;
      width: 100px;
      height: 100%;
      display: inline-block;
      position: relative;
      -webkit-transition: position 0.4s;
      -moz-transition: position 0.4s;
      -o-transition: position 0.4s;
      transition: position 0.4s;
      .li-text {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(174, 180, 198, 1);
        line-height: 22px;
        letter-spacing: 1px;
      }
      .nav-box-li-line {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        //background: $-primary-color;
      }
    }
    .li-activate {
      background-color: $-primary-color;
      border-radius: 21px;
      .li-text {
        height: 22px;
        font-size: 16px;
        font-weight: 500;
        color: $--font-color-light;
        line-height: 22px;
        letter-spacing: 1px;
      }
    }
  }
  // 隐藏滚动条
  .ul::-webkit-scrollbar {
    display: none;
  }
}
</style>

<template>
  <GlobalActionWrapper class="aside">
    <div class="aside-placeholder"></div>
    <div class="aside-buttons scrollbar scrollbar-y scrollbar-light">
      <router-link
        :to="item.path"
        class="aside-btn-item"
        :id="item.id"
        :class="{ [item.module]: item.module, selected: selected(item) }"
        v-for="(item, index) in modules"
        :key="index"
      ></router-link>
    </div>
  </GlobalActionWrapper>
</template>

<script>
import { Store } from '@silen/store';
import { mapGetters } from 'vuex';
import GlobalActionWrapper from '@/components/action/GlobalActionWrapper.vue';

export default {
  name: 'sidebar',
  components: {
    GlobalActionWrapper
  },
  data() {
    return {
      current: JSON.parse(Store.get('SIDEBAR_ID'))
    };
  },
  computed: {
    ...mapGetters(['modules'])
  },
  methods: {
    selected(item) {
      const list = this.$route.path.split('/').filter(Boolean);
      const c = '/' + list[0];
      return this.current === item.module || item.path === c;
    }
    // select(event) {
    //   const { target } = event;
    //   const id = target.id;
    //
    //   // 添加选中样式
    //   const els = document.querySelectorAll('.aside-btn-item');
    //   Array.prototype.forEach.call(els, el => {
    //     el.classList.remove('selected');
    //   });
    //   const tag = document.getElementById(id);
    //   tag && tag.classList.add('selected');
    //
    //   // 缓存数据
    //   Store.set('SIDEBAR_ID', id);
    //
    //   // 导航
    //   // this.$router.push('/' + id, null, null);
    // }
  }
};
</script>

<style lang="scss">
.aside {
  position: relative;
  height: calc(100% - 100px);
  &-buttons {
    position: absolute;
    bottom: 0px;
    width: 100px;
    max-height: 100%;
  }
  &-btn-item {
    display: block;
    width: 70px;
    height: 70px;
    margin: 0 auto;
    cursor: pointer;
    margin-bottom: 20px;
    background-size: 100% !important;
  }
  .resource {
    //资源中心
    background: url(../../assets/layout/resource-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/resource-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/resource-selected.png) center no-repeat;
    }
  }
  .operater {
    //智慧运营
    background: url(../../assets/layout/maintain-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/maintain-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/maintain-selected.png) center no-repeat;
    }
  }
  .data {
    //数据中心
    background: url(../../assets/layout/data-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/data-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/data-selected.png) center no-repeat;
    }
  }
  .system {
    //系统设置
    background: url(../../assets/layout/system-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/system-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/system-selected.png) center no-repeat;
    }
  }
  .operation {
    //运营服务
    background: url(../../assets/layout/operation-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/operation-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/operation-selected.png) center no-repeat;
    }
  }
  .safety {
    //综合安防
    background: url(../../assets/layout/safety-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/safety-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/safety-selected.png) center no-repeat;
    }
  }
  .shadow {
    //智慧光影
    background: url(../../assets/layout/shadow-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/shadow-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/shadow-selected.png) center no-repeat;
    }
  }
  .synthesize {
    //综合杆管理
    background: url(../../assets/layout/synthesize-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/synthesize-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/synthesize-selected.png) center no-repeat;
    }
  }
  .screen {
    //大屏显示
    background: url(../../assets/layout/big-unselected.png) center no-repeat;
    &:hover {
      background: url(../../assets/layout/big-hover.png) center no-repeat;
    }
    &.selected {
      background: url(../../assets/layout/big-selected.png) center no-repeat;
    }
  }
}
</style>

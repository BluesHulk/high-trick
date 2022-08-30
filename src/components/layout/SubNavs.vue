<template>
  <GlobalActionWrapper
    v-if="subRoutes[0].name != '运维态势' && subRoutes[0].name != '总览'"
    class="sub-navs float-container"
  >
    <router-link
      @click.native="select(item)"
      :to="item.path"
      class="float-left sub-navs-btn"
      :id="item.id"
      :class="{ selected: item.id === subNavId }"
      v-for="(item, index) in subRoutes"
      :key="index"
      :style="{ backgroundImage: `url(${item.id === subNavId ? item.iconSelected : item.icon})` }"
    >
      <span>{{ item.name }}</span>
    </router-link>
  </GlobalActionWrapper>
</template>

<script>
import { mapGetters } from 'vuex';
import { getSubNav, setSubNav } from '@/storage/nav';
import GlobalActionWrapper from '@/components/action/GlobalActionWrapper.vue';

export default {
  name: 'sub-navs',
  components: {
    GlobalActionWrapper
  },
  computed: {
    ...mapGetters(['subRoutes', 'subNavId'])
  },
  data() {
    return {
      current: getSubNav()
    };
  },
  created() {
    this.select();
  },
  methods: {
    select(item) {
      const id = (item = item || this.subRoutes.find(i => i.id === this.current) || this.subRoutes[0] || {}).id;
      if (id == null) console.error(`SubNavs.vue`, id);
      setSubNav(id);
      this.$store.dispatch('SetSubId', id);
      // this.$router.push(item.path, null, null);
    }
  },
  mounted() {
    console.log(this.subRoutes[0]);
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.sub-navs {
  padding: 10px 20px;
  height: 48px;
  &-btn {
    cursor: pointer;
    margin-right: 10px;
    min-width: 76px;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: $-primary-color;
    padding: 0 15px 0 58px;
    letter-spacing: 1px;
    position: relative;
    box-shadow: 0 4px 20px -4px rgba(16, 25, 74, 0.18);
    border-radius: 4px;
    background-position: 20px center;
    background-repeat: no-repeat;
    text-decoration: none;
    background-color: $--color-light;
    -webkit-background-size: 20px;
    background-size: 20px;
  }
  .router-link-exact-active,
  .selected {
    background-color: rgba(48, 69, 177, 1);
    box-shadow: 0 4px 20px -4px rgba(48, 69, 177, 0.3);
    border-radius: 4px;
    color: $--color-light;
  }
}
</style>

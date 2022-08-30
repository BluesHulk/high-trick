<template>
  <section class="sidebar-wrapper">
    <el-menu
      class="sidebar-menu"
      unique-opened
      :default-active="defaultActive"
      :collapse="!sidebar.collapsed"
      @select="handleSelect"
    >
      <template v-for="route in routes">
        <template v-if="route.children && route.children.length > 0">
          <el-submenu :index="route.path" :key="route.path">
            <template slot="title">
              <i class="fa mr-16" :class="route.icon || 'el-icon-menu'"></i>
              <span>{{ route.name }}</span>
            </template>
            <template v-for="item in route.children">
              <template v-if="item.children && item.children.length > 0">
                <el-submenu :index="item.path" :key="item.path">
                  <template slot="title">
                    <i class="fa mr-16" :class="item.icon || 'el-icon-menu'"></i>
                    <span>{{ item.name }}</span>
                  </template>
                  <template v-for="(ctor, prop) in item.children">
                    <el-menu-item :index="ctor.path" :key="prop" :class="{ 'is-active': ctor.path === defaultActive }">
                      <i class="fa mr-16" :class="ctor.icon || 'el-icon-menu'"></i>
                      <span>{{ ctor.name }}</span>
                    </el-menu-item>
                  </template>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="item.path" :key="item.path" :class="{ 'is-active': item.path === defaultActive }">
                  <i class="fa mr-16" :class="item.icon || 'el-icon-menu'"></i>
                  <span>{{ item.name }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="route.path" :key="route.path" :class="{ 'is-active': route.path === defaultActive }">
            <i class="fa mr-16" :class="route.icon || 'el-icon-menu'"></i>
            <span>{{ route.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    defaultActive: String,
    routes: Array
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  methods: {
    handleSelect(index) {
      this.$emit('select', index, null);
      if (this.$route.path === index) return;
      this.$router.push(index, null, error => {
        if (error) console.log(error);
      });
    }
  }
};
</script>

<style lang="scss">
.sidebar-wrapper {
  padding-top: 8px;
}
.mr-16 {
  margin-right: 16px;
}
</style>

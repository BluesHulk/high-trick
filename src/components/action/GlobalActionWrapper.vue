<template>
  <!--<div :class="{ 'global-action-cover': GlobalActionType }" @click="onClick">-->
  <div @click="onClick">
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import Message from '@/classes/Message';
// import ActionType from '@/constants/ActionType';

export default {
  name: 'global-action-wrapper',
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  methods: {
    onClick() {
      // const list = [ActionType.add, ActionType.edit];
      // if (list.includes(this.GlobalActionType)) {
      //   Message.message(`请先完成当前的操作`);
      // }
    }
  }
};
</script>

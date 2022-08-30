<template>
  <div :class="{ 'global-action-views': GlobalActionType === this.$$ActionType.views }" @click="onClick">
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import Message from '@/classes/Message';
// import ActionType from '@/constants/ActionType';

export default {
  name: 'action-wrapper',
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  methods: {
    onClick() {
      // const list = [ActionType.add, ActionType.edit];
      // if (list.includes(this.GlobalActionType)) {
      //   Message.message(`请先完成当前的操作`);
      // }
      this.$emit('click');
    }
  }
};
</script>

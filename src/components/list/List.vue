<template>
  <div class="list-wrapper" ref="DataList">
    <div
      :style="{ padding, height }"
      class="float-container list-item"
      :class="{ selected: index === current }"
      v-for="(item, index) in list"
      :key="index"
      @click="select(index, item)"
    >
      <slot name="left" :data="item" :index="index"></slot>
      <slot :data="item" :index="index"></slot>
      <slot name="right" :data="item" :index="index"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  props: {
    loader: {
      type: Function,
      required: true
    },
    height: String,
    padding: String
  },
  data() {
    return {
      list: [],
      current: 0
    };
  },
  async created() {
    await this.load();
    this.$emit('init', this.$refs.DataList);
  },
  methods: {
    async load() {
      const res = await this.loader();
      const { code, object } = res;

      if (code === 200 && Array.isArray(object)) {
        this.list = object;
        this.$emit('data', object);
      }

      this.select(0);
      return res;
    },
    select(index, item) {
      this.current = index;
      this.$emit('selected', item || this.list[0], index);
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';

.list-wrapper {
  .list-item {
    padding-left: 50px;
    padding-right: 50px;
    cursor: pointer;
  }
  .edit,
  .delete {
    display: inline-block;
    width: 16px;
    height: 24px;
    background-repeat: no-repeat;
    background-position: 0 center;
    cursor: pointer;
  }
  .edit {
    margin-right: 10px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAWlBMVEUAAADS4fDX5PLR3OjP3erW3erV3+zV3OzV2erU2evR2erR3OzV3OzS2urU3OvS2urS3OzT2urT2+zS2+vT2urS2uvS3OvS2uvT2+vS2uvT2uvS2urS2urS2urEv+OzAAAAHXRSTlMAERMWJSU3QklYX19gYYKDg4SdpK7CwsrM4ub1/QgEDggAAABhSURBVBjTdY9JEoAgEAPjjivijpr/f9ODTIFa5pTuyhwGylJiFQB4Ji0AMIyIFEAWis/i98SUYxIuTHtyxZO5eNE3J7lFeLMILeyEroTvX3RcHI6hLNlhqIv5Zpdpz127AJnHE80uku2CAAAAAElFTkSuQmCC);
  }
  .delete {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAANlBMVEUAAADV3OrP3erW3erR3OjS2erS3OzT2+vT3OvT2urS2urS2unS2+rS2erS2urS2+rS2urS2urDvoJMAAAAEXRSTlMAJCUlLElsf4qQkrG2y9P1/tzkhe0AAABKSURBVBjTpY47DoAwFMMMbSg8Pm3uf1kWhMpWCW+xPAQAWJo3HrIk7fYpSRmo7qjA9AHg6AqGxewIz53ApZh/IjnCafzH2t59wQ2zWgmxkvFNjwAAAABJRU5ErkJggg==);
  }
  .selected {
    background-color: $--bg-line-selected;
    .edit {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAVFBMVEUAAAAA4cMA5MkA3MUA3cEA3cgA38cA3MUA3MQA3MUA3MQA38UA3cMA3sQA3MMA3sMA3MMA3cUA3cQA3cQA3cQA3MIA3cMA3MMA3cQA3MMA3MMA3MMY60XjAAAAG3RSTlMAERMWJSU3QklYX2BhgoODhJ2krsLKzOLm9f0ZSY9NAAAAYUlEQVQY03WPORKAMAwDxZlwhStgQP//JwXxEGBQpd2RC8MKNWIB4GZSAIBxVOQAilh8Fr8nQzVl8WJoDy54Mv0t+uYg1wRvVuGUg3C18vWLS80eGFbIDmNt/MUh81aGdgLOGxJyxmensQAAAABJRU5ErkJggg==);
    }
    .delete {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAOVBMVEUAAAD/Rwf/RQf/TAf/Rgb/SQf/SQf/SAb/SAf/SQf/SAf/SAf/Rwf/SAb/SQf/SAb/Rwf/SAf/SAdf1ifyAAAAEnRSTlMAJCUlLElsf4qQkrG2y9P1/v5WYErWAAAASklEQVQY06WOOw6AMBTDDG0oPD6F3P+wLAiVrRLeYnkIADCdXnjIkrTauyRloLqhAsMHgK0p6BajIzw2Apdi/onkCKf+H/P17gNu69MKK3CsanwAAAAASUVORK5CYII=);
    }
  }
}
</style>

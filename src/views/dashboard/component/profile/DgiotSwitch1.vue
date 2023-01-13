<template>
  <div class="dgiotswitch1" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script>
export default {
  name: "DgiotSwitch1",
  props: {
    comp: {
      type: Object,
      default: () => ({
        type: "switch",
        width: 400,
        hieght: 72,
      }),
    },
    selectdevice: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style lang="scss" scoped>
.dgiotswitch1 {
}
</style>

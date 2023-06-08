<template>
  <div id="container"></div>
</template>

<script>
export default {
  name: "ScreenSgmap",
  components: {},
  props: {
    comp: {
      type: Object,
      default: () => ({
        type: "line",
        width: 400,
        hieght: 72,
      }),
    },
  },
  emits: ["initScreen"],
  data() {
    return {};
  },
  async created() {},
  mounted() {
    // 初始化思极地图实例
    let map = new sgmap();
    // 在指定DOM元素上创建地图
    map.createMap('container', {
      // 地图默认中心点
      center: [114.059565,22.54286],
      // 地图默认缩放级别
      zoom: 13
    });
  },
};
</script>
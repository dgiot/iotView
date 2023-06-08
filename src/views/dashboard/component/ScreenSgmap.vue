<template>
  <div id="map" style="width: 100%; height: 100%;" />
</template>

<script>
export default {
  name: 'ScreenSgmap',
  components: {},
  props: {
    comp: {
      type: Object,
      default: () => ({
        type: 'line',
        width: 400,
        hieght: 72
      })
    }
  },
  emits: ['initScreen'],
  data() {
    return {
      map: {}
    }
  },
  async created() {},
  mounted() {
    const that = this
    SGMap.tokenTask.login('8a2d9f94f4ae3df2ba80b2f9df8970e5', '1d154b90b347326b9622c510d170e707').then(function() {
      that.initMap()
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    initMap() {
      // 初始化思极地图实例
      this.map = new SGMap.Map(
        {
          // 在指定DOM元素上创建地图
          container: 'map',
          // 地图样式
          style: 'aegis://styles/aegis/Streets-v2',
          // 地图默认中心点
          center: [120.062190, 30.36020],
          // 地图默认缩放级别
          zoom: 16,
          // 地图默认字体
          localIdeographFontFamily: 'Microsoft YoHei'
        })
      console.log('init map', this.map)
    }
  }
}
</script>

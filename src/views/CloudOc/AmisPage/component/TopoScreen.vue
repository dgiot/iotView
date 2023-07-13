<template>
  <div class="topo_content" @mouseenter="enter" @mouseleave="leave">
    <div id="screenTopo" />
    <div v-if="vueFlag">
      <div
        v-for="(comp, index) in vueComponents"
        :key="index"
        class="vue_component"
        :style="{
          left: comp.x + 'px',
          top: comp.y + 'px',
          width: comp.width + 'px',
          height: comp.height + 'px',
        }"
      >
        <!-- 数据卡片/产品数-设备数-在线数-离线数 -->
        <topo-card
          v-if="comp.type == 'counter' && comp.id != 'all_countervalue'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <screen-headcounter
          v-else-if="comp.type == 'count' && comp.id == 'all_countvalue'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <screen-headitem
          v-else-if="comp.type == 'count'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <!-- 直播 -->
        <dgiot-aliplayer
          v-else-if="comp.type == 'liveboard'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <screen-line
          v-else-if="comp.type == 'line'"
          :comp="comp"
          :viewtype="viewtype"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <screen-device-bar
          v-else-if="comp.type == 'devicebar'"
          :comp="comp"
          :viewtype="viewtype"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <screen-device
          v-else-if="comp.type == 'list' && comp.id == 'device_list'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
          @initScreen="initScreen"
        />

        <!-- 告警模板 -->
        <topo-caltable
          v-else-if="comp.type == 'list' && comp.id == 'warning_list'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <dgiot-notification1
          v-else-if="comp.type == 'list' && comp.id == 'warning_list1'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <!-- 设备地图 -->
        <screen-baidumap
          v-else-if="comp.type == 'map' && comp.id == 'baidumap'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
          @initScreen="initScreen"
        />
        <!-- 思极地图  -->

        <screen-sgmap
          v-else-if="comp.type == 'map' && comp.id == 'sgmap'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
          @initScreen="initScreen"
        />
        <!-- 告警模板 -->
        <work-order
          v-else-if="comp.type == 'list' && comp.id == 'workorder_list'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <!-- 设备在线离线图表 -->
        <topo-pie
          v-else-if="comp.type == 'pie'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <!-- 实时时间展示 -->
        <real-time
          v-else-if="comp.type == 'realtime'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <!-- 3d -->
        <dgiot-model-fac
          v-else-if="comp.type == '3d' && comp.id == '3d_fbx'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <!-- node.attrs.src.includes("//") ? node.attrs.src : this.$FileServe +
        node.attrs.src -->

        <img
          v-else-if="comp.type == 'konvaimage'"
          :src="comp.src.includes('//') ? comp.src : $FileServe + comp.src"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        >
      </div>
    </div>
    <div v-if="amisFlag">
      <amis
        v-for="(comp, index) in amisComponents"
        :key="index"
        modal-append-to-body
        class="amis_component"
        :style="{
          left: comp.x + 'px',
          top: comp.y + 'px',
          width: comp.width + 'px',
          height: comp.height + 'px',
        }"
        :schema="comp.viewData"
        :show-help="false"
      />
    </div>
    <el-dialog
      v-if="dialogTopoAmisVisible"
      top="10vh"
      :append-to-body="true"
      width="1240px"
      :visible.sync="dialogTopoAmisVisible"
      @close="handlecloseDevice"
    >
      <amis modal-append-to-body :schema="topoAmisData" :show-help="false" />
    </el-dialog>
  </div>
</template>

<script>
import DgiotAliplayer from '../../../dashboard/component/DgiotAliplayer.vue'
import TopoCard from '../../../dashboard/component/TopoCard.vue' // 卡片
// import TopoCard from "./TopoCard.vue"; //卡片
import TopoPie from '../../../dashboard/component/TopoPie.vue' // 饼图
import TopoCaltable from '../../../dashboard/component/TopoCaltable.vue' // 告警列表
import ScreenDevice from '../../../dashboard/component/ScreenDevice.vue' // 设备列表
import WorkOrder from '../../../dashboard/component/WorkOrder.vue' // 工单列表
import ScreenRealcard from '../../../dashboard/component/ScreenRealcard.vue' // 告警列表
import ScreenLine from '../../../dashboard/component/ScreenLine.vue' // 历史折线图
import ScreenDeviceBar from '../../../dashboard/component/ScreenDeviceBar.vue' // 历史柱状图
import ScreenHeaditem from '../../../dashboard/component/ScreenHeaditem.vue' // 历史柱状图
import ScreenBaidumap from '../../../dashboard/component/ScreenBaidumap.vue' // 百度地图
import ScreenSgmap from '../../../dashboard/component/ScreenSgmap.vue' // 思极地图
// 通用组件
import RealTime from '../../../dashboard/component/commom/RealTime.vue'
import DgiotNotification1 from '../../../dashboard/component/notification/DgiotNotification1.vue' // 告警模板1
import Amis from '@/components/Amis/index.vue' // amis 组件
import { Base64 } from 'js-base64'
import { getDlinkJson, Startdashboard } from '@/api/Dashboard'
import { queryView, getTopo, getView, postAmis } from '@/api/View'
import { isPC } from '@/utils/index'
import { sendTopic } from '@/api/Dashboard'
export default {
  name: 'TopoDevice',
  components: {
    TopoPie,
    TopoCard,
    DgiotAliplayer,
    TopoCaltable,
    ScreenDevice,
    WorkOrder,
    ScreenRealcard,
    ScreenHeaditem,
    ScreenBaidumap,
    ScreenSgmap,
    Amis,
    ScreenLine,
    ScreenDeviceBar,
    RealTime,
    DgiotNotification1
  },
  props: {
    viewInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      vueFlag: false,
      amisFlag: false,
      viewtype: 'Dashboard',
      json: {},
      layer: {},
      stage: {},
      vueComponents: [], // vue 组件
      dialogTopoAmisVisible: false,
      topoAmisData: {},
      width: 1200,
      height: 700,
      dashboardId: '',
      konvatimer: null
    }
  },
  mounted() {
    this.isPC = isPC()
    this.vueComponents = []
    this.amisComponents = []
    console.log('查看konva', this.viewInfo)
    this.dashboardId = this.viewInfo.objectId
    var box1 = document.querySelector('.dialog_wrap')
    console.log(box1.offsetWidth, box1.offsetHeight)
    this.width = box1.offsetWidth
    this.height = box1.offsetHeight
    const resizeObserver = new ResizeObserver((entries) => {
      // console.log('变化',);
      for (const entry of entries) {
        if (entry.target.offsetWidth != this.width) {
          if (this.konvatimer !== null) {
            clearTimeout(this.konvatimer)
          }
          this.konvatimer = setTimeout(() => {
            console.log('变化', entry.target.offsetWidth)
            this.width = entry.target.offsetWidth
            this.height = entry.target.offsetHeight

            this.layer = Konva.Node.create(this.json, 'screenTopo').findOne(
              'Layer'
            )
            this.stage = new Konva.Stage({
              container: 'screenTopo',
              width: this.width,
              height: this.height
            })
            this.stage.add(this.layer)
            this.handleInitKonva()
          }, 100)
        }
        // 打印出entry.target 可以看到此处可以进行元素的各种变化的监听
        // 此处直接写监听变化后要处理的逻辑即可
      }
    })
    resizeObserver.observe(document.querySelector('.dialog_wrap'))
    this.json = this.viewInfo.data?.konva?.Stage
    this.layer = Konva.Node.create(this.json, 'screenTopo').findOne('Layer')
    this.stage = new Konva.Stage({
      container: 'screenTopo',
      width: this.width,
      height: this.height
    })
    this.stage.add(this.layer)
    this.$dgiotBus.$off('$dg/user/allrealdata')
    this.$dgiotBus.$on('$dg/user/allrealdata', (e) => {
      const str = String.fromCharCode.apply(null, new Uint8Array(e))
      const receive = JSON.parse(Base64.decode(str))
       console.log('组态大屏 ', receive)
      receive.forEach((item) => {
      // console.log(item)
      const number = item.number + item.unit
      let color = 'green'
      if (item.hasOwnProperty("color")){
        color = item.color
      }
      var info = this.putNode(this.stage, item.lable, number, color);
      // canvas.stage.find(item.id)[0].setAttrs(item.params)
      });
    })
    // console.log(this.stage);
    this.handleInitKonva()
    // this.handleOpenTopo(this.deviceInfo);
  },
  methods: {
    async initScreen() {
      const Startdashboardid = this.dashboardId // "8263c928d5";
      await Startdashboard(Startdashboardid, {})
    },
    async handleInitKonva() {
      this.clientWidth = document.body.clientWidth
      if (this.clientWidth > 500) {
        var html = document.getElementsByTagName('html')[0]
        html.style.fontSize = (document.body.clientWidth / 1940) * 16 + 'px'
      }
      const list = [] // vuecomponent 组件列表
      const amislist = [] // amiscomponent 组件列表
      this.amisFlag = false
      this.stage.find('Label').forEach((node) => {
        // console.log("label", node);
        // info["Label"] = stage.find("Label");
        this.initSize(node)
        node.setAttrs({
          draggable: false
        })
        // node = this.initScale(node);
      })
      this.stage.find('Tag').forEach((node) => {
        // console.log(node.attrs.text);
        node.setAttrs({
          draggable: false
        })
        node = this.initScale(node)
      })
      this.stage.find('Text').forEach((node) => {
        node.setAttrs({
          draggable: false
        })
        node = this.initScale(node)
      })
      this.stage.find('Image').forEach((node) => {
        // node.setAttrs({
        //   draggable: false,
        // });
        // console.log("node", node);
        this.initSize(node)
        if (node.attrs.id == 'bg') {
          const image = new Image()
          node.setAttrs({
            image: image
          })
          image.src = node.attrs.src.includes('//')
            ? node.attrs.src
            : this.$FileServe + node.attrs.src
          // console.log(node.attrs);
          // this.bgSrc = node.attrs.src.includes("//")
          //   ? node.attrs.src
          //   : this.$FileServe + node.attrs.src;
        }
        if (
          node.attrs.type == 'konvaimage' ||
          node.attrs.name == 'vuecomponent'
        ) {
          const item = node.attrs
          list.push(item)
        } else if (node.attrs.name == 'amiscomponent') {
          const item = node.attrs
          amislist.push(item)
        } else if (
          node.attrs.id.indexOf('不') < 0 &&
          node.attrs.id.indexOf('bg') < 0
        ) {
          // if (node.attrs.type == "staticimage")
          const image = new Image()
          node.setAttrs({
            image: image
          })
          image.src = node.attrs.src.includes('//')
            ? node.attrs.src
            : this.$FileServe + node.attrs.src
          // this.layer.add(node);
          // this.layer.batchDraw();
          // this.stage.add(this.layer);
        }
      })
      this.stage.find('Rect').forEach((node) => {
        // node.setAttrs({
        //   draggable: false,
        // });
        this.initSize(node)
        if (node.attrs.name == 'vuecomponent') {
          const item = node.attrs
          list.push(item)
        } else if (node.attrs.name == 'amiscomponent') {
          const item = node.attrs
          amislist.push(item)
        }
      })
      // this.layer.draw();
      this.layer.batchDraw()
      setTimeout(() => {
        this.layer.batchDraw()
      }, 1500)
      this.vueComponents = list
      this.vueFlag = true
      this.amisComponents = amislist
      // 获取到低代码页面
      for (let index = 0; index < this.amisComponents.length; index++) {
        const res = await getView(this.amisComponents[index].id)
        this.amisComponents[index].viewData = res.data.data
      }
      this.amisFlag = true
    },
    // 按比例初始化大小 -
    initSize(node) {
      const scale = this.width / 1900
      const scaleH = this.height / 940
      // if (this.isPC) {
      // console.log("isPC打开了");
      node.setAttrs({
        draggable: false,
        x: node.attrs.x * scale,
        y: node.attrs.y * scaleH,
        width: node.attrs.width * scale,
        height: node.attrs.height * scaleH,
        fontSize: node.attrs.fontSize * scale
      })
      // } else {
      //   node.setAttrs({
      //     draggable: false,
      //     x: (node.attrs.x * document.body.clientWidth) / this.width,
      //     y: (node.attrs.y * document.body.clientHeight) / this.height,
      //     width: (node.attrs.width * document.body.clientWidth) / this.width,
      //     height:
      //       (node.attrs.height * document.body.clientHeight) / this.height,
      //     fontSize: node.attrs.fontSize * scale,
      //   });
      // }
      //  x: (node.attrs.x * document.body.clientWidth) / 1930,
      // y: (node.attrs.y * document.body.clientHeight) / 940,
      // width: (node.attrs.width * document.body.clientWidth) / 1930,
      // height: (node.attrs.height * document.body.clientHeight) / 940,
      // console.log(node.attrs.height, document.body.clientHeight);

      // node.setAttrs({
      //   draggable: false,
      //   x: node.attrs.x * scale,
      //   y: node.attrs.y * scale,
      //   width: node.attrs.width * scale,
      //   height: node.attrs.height * scale,
      //   fontSize: node.attrs.fontSize * scale,
      // });
    },
    initScale(node) {
      const scale = this.width / 1900
      const scaleH = this.height / 940
      // if (this.isPC) {
      node.attrs.fontSize = node.attrs.fontSize * scale
      node.attrs.x = node.attrs.x * scale
      node.attrs.width = node.attrs.width * scale
      node.attrs.y = node.attrs.y * scaleH
      node.attrs.height = node.attrs.height * scaleH
      // } else {
      //   node.attrs.fontSize = node.attrs.fontSize * scale;
      //   node.attrs.x = (node.attrs.x * document.body.clientWidth) / this.width;
      //   node.attrs.width =
      //     (node.attrs.width * document.body.clientWidth) / this.width;
      //   node.attrs.y =
      //     (node.attrs.y * document.body.clientHeight) / this.height;
      //   node.attrs.height =
      //     (node.attrs.height * document.body.clientHeight) / this.height;
      // }
      // console.log("比例大小", scale);
      return node
    },
    enter() {
      // console.log("enter");
      window.addEventListener('mousewheel', this.handleScroll, true)
    },
    leave() {
      // console.log("leave");
      window.removeEventListener('mousewheel', this.handleScroll, true)
    },
    handleScroll(e) {
      e = e || window.event
      var box1 = document.querySelector('.topo_content')
      // console.log('滚动了', e)
      // 判断滚轮滚动方向
      // wheelDelta获取到鼠标滚动方向，向上滚是正值，向下是负值，但火狐不支持
      // event.detail火狐支持，向上为负值，向下为正值
      // return
      // if (e.wheelDelta > 0 || e.detail < 0) {
      //   box1.style.width = box1.offsetWidth * 1.02 + "px";
      //   box1.style.height = box1.offsetHeight * 1.02 + "px";
      // } else {
      //   box1.style.width = box1.offsetWidth * 0.98 + "px";
      //   box1.style.height = box1.offsetHeight * 0.98 + "px";
      // }
    },
    putNode(node, nodeid, text, color) {
        // if (type != "undefined") {
        node.find(`#${nodeid}`).forEach((item) => {
          item.setAttr('text',text);
        });
        let tagnodeid = `#${nodeid}` + '_tag'
        node.find(tagnodeid).forEach((item) => {
          item.setAttr('fill', color)
        })
        this.layer.batchDraw()
    }
  }
}
</script>
<style lang="scss" scoped>
.topo_content {
  position: relative !important;

  // height: 700px;
  // background-color: #12ae7b;
  // width: 1200px;
  #deviceTopo {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .vue_component {
    position: absolute;
    // z-index: 99;
    // background-color: #0077b8;
  }
  .amis_component {
    position: absolute;
    z-index: 98;
    // background-color: #0077b8;
  }
}
</style>

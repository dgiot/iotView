<template>
  <div
    class="dashboard-container"
    :style="{
      backgroundImage: 'url(' + bgSrc + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
    }"
  >
    <div v-if="isShowDashboard">
      <div id="container" />
      <div v-if="dashboardList.length > 1" class="dashboard_check">
        <div
          v-for="(item, index) in dashboardList"
          :key="item.objectId + index"
          class="screen_check_item"
          style="font-size: 1em"
          :class="
            item.objectId == dashboardId ? 'screen_select' : 'screen_unselect'
          "
          @click="handleToCheckout(item)"
        >
          {{ item.title }}
        </div>
      </div>
      <!-- vue 组件渲染 -->
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
          <!-- 思极地图 -->
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
      <!-- 低代码视图绑定页面渲染 -->
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
          :screen_deviceid="comp.screen_deviceid"
          :screen_productid="comp.screen_productid"
          :show-help="false"
        />
      </div>
    </div>
    <div v-else>
      <!-- :style="{
          left: comp.x + 'px',
          top: comp.y + 'px',
          width: comp.width + 'px',
          height: comp.height + 'px',
        }" -->
      <div v-if="shiftShow">
        <amis
          modal-append-to-body
          class="amis_component"
          :schema="header.data"
          :show-help="false"
        />
      </div>
    </div>
    <el-dialog
      v-if="dialogScreenAmisVisible"
      top="10vh"
      :append-to-body="true"
      width="600px"
      :visible.sync="dialogScreenAmisVisible"
    >
      <amis modal-append-to-body :schema="screenAmisData" :show-help="false" />
    </el-dialog>
  </div>
</template>

<script>
import backgroundImage from '../../assets/bg/pageBg1.png'
// import VueAliplayerV2 from 'vue-aliplayer-v2';
import DgiotAliplayer from './component/DgiotAliplayer.vue'
import TopoCard from './component/TopoCard.vue' // 卡片

import TopoPie from './component/TopoPie.vue' // 饼图
import TopoCaltable from './component/TopoCaltable.vue' // 告警列表
import ScreenDevice from './component/ScreenDevice.vue' // 设备列表
import WorkOrder from './component/WorkOrder.vue' // 工单列表
import ScreenRealcard from './component/ScreenRealcard.vue' // 告警列表
import ScreenBaidumap from './component/ScreenBaidumap.vue' // 百度地图
import ScreenSgmap from './component/ScreenSgmap.vue' // 思极地图
import ScreenLine from './component/ScreenLine.vue' // 历史折线图
import ScreenDeviceBar from './component/ScreenDeviceBar.vue' // 历史柱状图
import ScreenHeaditem from './component/ScreenHeaditem.vue' // 卡片组
// 3d
import DgiotModelFbx from '../../components/model3d/dgiot-model-fbx.vue'
import DgiotModelDemo from '../../components/model3d/dgiot-model-demo.vue'
import DgiotModelDemo3 from '../../components/model3d/dgiot-model-demo3.vue'
import DgiotModelFac from '../../components/model3d/dgiot-model-fac.vue'
// 通用组件
import RealTime from './component/commom/RealTime.vue'
import DgiotNotification1 from './component/notification/DgiotNotification1.vue' // 告警模板1

import { mapGetters } from 'vuex'
import Amis from '@/components/Amis/index.vue' // amis 组件
import { getView, postAmis } from '@/api/View/index'
import { queryRelation } from '@/api/Relation'
import { getDlinkJson, Startdashboard } from '@/api/Dashboard'
import { isPC } from '@/utils/index'
import { getToken } from '@/utils/auth'
export default {
  name: 'Dashboard',
  components: {
    // DgiotAmis:DgiotAmis,
    amis: Amis,
    TopoCard,
    TopoPie,
    TopoCaltable,
    ScreenDevice,
    ScreenRealcard,
    WorkOrder,
    ScreenBaidumap,
    ScreenSgmap,
    // ScreenHeadcounter,
    ScreenHeaditem,
    DgiotAliplayer,
    ScreenLine,
    ScreenDeviceBar,
    RealTime,
    DgiotNotification1,
    // 3d
    DgiotModelFbx,
    DgiotModelDemo,
    DgiotModelDemo3,
    DgiotModelFac
  },
  data() {
    return {
      viewtype: 'Dashboard',
      json: {},
      layer: '',
      stage: '',
      bgSrc: backgroundImage,
      vueComponents: [],
      amisComponents: [],
      vueFlag: false,
      amisFlag: false,
      viewData: {},
      queryParams: [],
      dashboardId: '',
      dashboardList: [],
      isPC: true,
      clientWidth: 1920,
      shiftShow: false,
      isShowDashboard: true,
      dialogScreenAmisVisible: false,
      screenAmisData: {}
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    this.isPC = isPC()
    localStorage.setItem('isPC', this.isPC)
  },
  async mounted() {
    // console.log('localStorage.getItem("isPC")', localStorage.getItem("isPC"));
    this.isPC = localStorage.getItem('isPC') == 'true'
    this.isShowDashboard = document.body.clientWidth > 500
    localStorage.setItem('dgiottopbar', '[]')
    this.$store.dispatch('settings/changeSetting', {
      key: 'treeFlag',
      value: false
    })
    // console.log("layer", this.layer);
    var width = window.innerWidth
    var height = window.innerHeight
    // this.$message(`宽度-${width}高度-${height}`)
    const destId = localStorage.getItem('deptId')
    const { results = [] } = await queryRelation({
      destClass: '_Role',
      destId: destId,
      destField: 'views',
      srcClass: 'View'
    })
    if (_.isEmpty(results)) {
      this.$message('暂未配置组态大屏')
      return false
    } else {
      const dashboardList = []
      const amisScreenList = []
      let flag = true
      results.forEach((item) => {
        if (item.type == 'Dashboard' && flag) {
          dashboardList.push(item)
          flag = false
          this.viewtype = item.type
          this.json = item.data.konva.Stage
          console.log('json', this.json)
          this.dashboardId = item.objectId
        } else if (item.type == 'Dashboard') {
          dashboardList.push(item)
        } else if (item.flag == 'Amis' && item.title.indexOf('移动端') < 0) {
          amisScreenList.push(item)
        } else if (item.title.indexOf('移动端') >= 0) {
          this.header = item
          console.log(this.header)
          this.shiftShow = true
        }
      })
      this.dashboardList = dashboardList
      this.queryData()
      // this.commandInfo.dialog = true;
      // this.loading = false;
      // this.commandInfo.data = results;
    }
    this.layer = Konva.Node.create(this.json, 'container').findOne('Layer')
    this.stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height
    })
    this.stage.add(this.layer)
    this.$dgiotBus.$off('$dg/user/allrealdata')
    this.$dgiotBus.$on('$dg/user/allrealdata', (e) => {
      const str = String.fromCharCode.apply(null, new Uint8Array(e))
      const receive = JSON.parse(Base64.decode(str))
      console.log('allrealdata', receive)
      let red = 0
      let green = 0
      let yellow = 0
      receive.forEach((item) => {
        const number = item.number + item.unit
        let color = 'green'
        if (item.hasOwnProperty('color')) {
          color = item.color
          if (color === 'red') {
            red = red + 1
          } else if (color === 'green') {
            green = green + 1
          } else if (color === 'yellow') {
            yellow = yellow + 1
          }
        }
        var info = this.putNode(this.stage, item.label, number, color)
        // canvas.stage.find(item.id)[0].setAttrs(item.params)
      })
      this.putNode(this.stage, 'status_red_text', red.toString(), 'red')
      this.putNode(this.stage, 'status_green_text', green.toString(), 'green')
      this.putNode(this.stage, 'status_yellow_text', yellow.toString(), 'yellow')

      const sessionToken = getToken()
      const pubTopic = `$dg/user/dashboard/${sessionToken}/ack` // 返回
      const message = {
        ack: 'heartbeat'
      }
      this.$dgiotBus.$emit(`MqttPublish`, {
        pubTopic,
        message: JSON.stringify(message),
        qs: 0,
        status: false
      })
    })
    // console.log(this.stage);
    this.handleInitKonva()
    // 监听界面
    window.onresize = () => {
      return (() => {
        this.layer = Konva.Node.create(this.json, 'container').findOne('Layer')
        this.stage = new Konva.Stage({
          container: 'container',
          width: width,
          height: height
        })
        this.stage.add(this.layer)
        this.handleInitKonva()
      })()
    }
  },
  destroyed() {
    if (this.clientWidth > 736) {
      var html = document.getElementsByTagName('html')[0]
      html.style.fontSize = 16 + 'px'
    }
  },
  methods: {
    putNode(node, nodeid, text, color) {
      // console.log("组态修改", node, nodeid, text, type);
      // if (type != "undefined") {
      node.find(`#${nodeid}`).forEach((item) => {
        item.setAttr('text', text)
        item.setAttr('fill', 'black')
      })
      const tagnodeid = `#${nodeid}` + '_tag'
      node.find(tagnodeid).forEach((item) => {
        item.setAttr('fill', color)
      })
      this.layer.batchDraw()
    },
    handleToCheckout(item) {
      if (item.objectId != this.dashboardId) {
        var width = window.innerWidth
        var height = window.innerHeight
        this.json = item.data.konva.Stage
        console.log('json', this.json)
        this.vueComponents = []
        this.vueFlag = false
        this.dashboardId = item.objectId
        this.queryData()
        this.layer = Konva.Node.create(this.json, 'container').findOne('Layer')
        this.stage = new Konva.Stage({
          container: 'container',
          width: width,
          height: height
        })
        this.stage.add(this.layer)
        this.handleInitKonva()
      }
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
        node.on('touchend', async(e) => {
          console.error('touchend', node)
          if (node.attrs.bind_amis) {
            localStorage.setItem('parse_objectid', node.attrs.screen_deviceid)
            localStorage.setItem(
              'parse_productid',
              node.attrs.screen_productid
            )
            const params = {
              viewid: node.attrs.amis_id
            }
            const data = {
              render: {
                screen_deviceid: node.attrs.screen_deviceid,
                screen_productid: node.attrs.screen_productid
              }
            }
            const res = await postAmis(params, data)
            // console.log("res", res);
            // let res = await getView(node.attrs.amis_id);
            this.screenAmisData = res.data
            this.dialogScreenAmisVisible = true
            // amis_id
          }
        })
        node.on('click', async(e) => {
          console.error('click', node)
          if (node.attrs.bind_amis) {
            localStorage.setItem('parse_objectid', node.attrs.screen_deviceid)
            localStorage.setItem(
              'parse_productid',
              node.attrs.screen_productid
            )
            const params = {
              viewid: node.attrs.amis_id
            }
            const data = {
              render: {
                screen_deviceid: node.attrs.screen_deviceid,
                screen_productid: node.attrs.screen_productid
              }
            }
            const res = await postAmis(params, data)
            // console.log("res", res);
            // let res = await getView(node.attrs.amis_id);
            this.screenAmisData = res.data
            this.dialogScreenAmisVisible = true
            // amis_id
          }
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
          // console.log(node.attrs)
          this.bgSrc = node.attrs.src.includes('//')
            ? node.attrs.src
            : this.$FileServe + node.attrs.src
        }
        if (
          node.attrs.type == 'konvaimage' ||
          node.attrs.name == 'vuecomponent'
        ) {
          const item = node.attrs
          if (item.type == 'count') {
            // console.log("item11111", item);
          }
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
        console.log('%c 获取到低代码页面代码', 'background:#ffff00;')
        console.log(res)
        this.amisComponents[index].viewData = res.data.data
      }
      this.amisFlag = true
    },
    // 按比例初始化大小 -
    initSize(node) {
      const scale = document.body.clientWidth / 1940
      if (this.isPC) {
        // console.log("isPC打开了");
        node.setAttrs({
          draggable: false,
          x: node.attrs.x * scale,
          y: node.attrs.y * scale,
          width: node.attrs.width * scale,
          height: node.attrs.height * scale,
          fontSize: node.attrs.fontSize * scale
        })
      } else {
        node.setAttrs({
          draggable: false,
          x: (node.attrs.x * document.body.clientWidth) / 1920,
          y: (node.attrs.y * document.body.clientHeight) / 960,
          width: (node.attrs.width * document.body.clientWidth) / 1920,
          height: (node.attrs.height * document.body.clientHeight) / 960,
          fontSize: node.attrs.fontSize * scale
        })
      }
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
      const scale = document.body.clientWidth / 1940
      if (this.isPC) {
        node.attrs.fontSize = node.attrs.fontSize * scale
        node.attrs.x = node.attrs.x * scale
        node.attrs.width = node.attrs.width * scale
        node.attrs.y = node.attrs.y * scale
        node.attrs.height = node.attrs.height * scale
      } else {
        node.attrs.fontSize = node.attrs.fontSize * scale
        node.attrs.x = (node.attrs.x * document.body.clientWidth) / 1920
        node.attrs.width =
          (node.attrs.width * document.body.clientWidth) / 1920
        node.attrs.y = (node.attrs.y * document.body.clientHeight) / 960
        node.attrs.height =
          (node.attrs.height * document.body.clientHeight) / 960
      }
      // console.log("比例大小", scale);
      return node
    },
    async initScreen() {
      const Startdashboardid = this.dashboardId // "8263c928d5";
      await Startdashboard(Startdashboardid, {})
    },
    async queryData() {
      const { dashboard = {}} = await getDlinkJson('Dashboard')
      this.queryParams = dashboard
      const Startdashboardid = this.dashboardId // "8263c928d5";
      setTimeout(async() => {
        await Startdashboard(Startdashboardid, {})
      }, 2000)
    }
  }
}
</script>
<style>
/*里面的代码可以根据自己需求去进行更改*/
/* 设置滚动条的样式 */
/* ::-webkit-scrollbar {
  width: 12px;
} */
/* 滚动槽 */
/* ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 10px;
} */
/* 滚动条滑块 */
/* ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(255, 255, 255 0);
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
} */
</style>
<style lang="scss" scoped>
.dashboard-container {
  height: 94vh;
  position: relative;
  // width: 100%;
  margin: 0 !important;
  // background: url("../../assets/bg/pageBg.png") no-repeat 100% 100%;
  background-size: cover;
  .dashboard_check {
    position: absolute;
    z-index: 999;
    top: 4px;
    left: 4px;
    display: flex;
    .screen_check_item {
      box-sizing: border-box;
      width: 10em;
      height: 2.8em;
      line-height: 2.8em;
      margin-right: 0.75em;
      text-align: center;
      color: #fff;
      text-shadow: 2px 3px 1px #000;
      cursor: pointer;
    }
    .screen_select {
      background: url("../../assets/bg/screen_select.png") no-repeat 100% 100%;
      background-size: cover;
    }
    .screen_unselect {
      background: url("../../assets/bg/screen_unselect.png") no-repeat 100% 100%;
      background-size: cover;
    }
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
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.container {
  position: fixed;
  width: 100vh;
  height: 100vh;
}
.dialog_wrap {
  height: 100vh;
  width: 100%;
  overflow: scroll;
}
</style>

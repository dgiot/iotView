<template>
  <div
    class="dashboard-container"
    :style="{
      backgroundImage: 'url(' + bgSrc + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
    }"
  >
    <div id="container"></div>

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
        <!-- <topo-line
              v-if="comp.type == 'line'"
              :comp="comp"
              :style="{
                width: comp.width + 'px',
                height: comp.height + 'px',
              }"
            />
          -->
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
        />
        <!-- 告警列表 -->
        <topo-caltable
          v-else-if="comp.type == 'list' && comp.id == 'warning_list'"
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
          @initScreen="initScreen"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <!-- 告警列表 -->
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
        <!-- node.attrs.src.includes("//") ? node.attrs.src : this.$FileServe +
        node.attrs.src -->
        <img
          v-else-if="comp.type == 'konvaimage'"
          :src="comp.src.includes('//') ? comp.src : $FileServe + comp.src"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
      </div>
    </div>
    <div v-if="amisFlag">
      <amis
        modal-append-to-body
        v-for="(comp, index) in amisComponents"
        :key="index"
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
  </div>
</template>

<script>
import backgroundImage from "../../assets/bg/pageBg1.png";
// import VueAliplayerV2 from 'vue-aliplayer-v2';
import DgiotAliplayer from "./component/DgiotAliplayer.vue";
import TopoCard from "./component/TopoCard.vue"; //卡片

import TopoPie from "./component/TopoPie.vue"; //饼图
import TopoCaltable from "./component/TopoCaltable.vue"; //告警列表
import ScreenDevice from "./component/ScreenDevice.vue"; //设备列表
import WorkOrder from "./component/WorkOrder.vue"; //工单列表
import ScreenRealcard from "./component/ScreenRealcard.vue"; //告警列表
import ScreenBaidumap from "./component/ScreenBaidumap.vue"; //百度地图
import ScreenLine from "./component/ScreenLine.vue"; //历史折线图
import ScreenDeviceBar from "./component/ScreenDeviceBar.vue"; //历史柱状图
// import ScreenHeadcounter from "./component/ScreenHeadcount.vue"; //卡片组
import ScreenHeaditem from "./component/ScreenHeaditem.vue"; //卡片组
import { mapGetters } from "vuex";
import Amis from "@/components/Amis/index.vue"; //amis 组件
import { getView } from "@/api/View/index";
import { queryRelation } from "@/api/Relation";
import { getDlinkJson, Startdashboard } from "@/api/Dashboard";
export default {
  name: "Dashboard",
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
    // ScreenHeadcounter,
    ScreenHeaditem,
    DgiotAliplayer,
    ScreenLine,
    ScreenDeviceBar,
  },
  data() {
    return {
      viewtype: "Dashboard",
      json: {},
      layer: "",
      stage: "",
      bgSrc: backgroundImage,
      vueComponents: [],
      amisComponents: [],
      vueFlag: false,
      amisFlag: false,
      viewData: {},
      queryParams: [],
      dashboardId: "",
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },

  async mounted() {
    localStorage.setItem("dgiottopbar", "[]");
    this.$store.dispatch("settings/changeSetting", {
      key: "treeFlag",
      value: false,
    });
    // console.log("layer", this.layer);
    var width = window.innerWidth;
    var height = window.innerHeight;
    // this.$message(`宽度-${width}高度-${height}`)
    let destId = localStorage.getItem("deptId");
    const { results = [] } = await queryRelation({
      destClass: "_Role",
      destId: destId,
      destField: "views",
      srcClass: "View",
    });
    if (_.isEmpty(results)) {
      this.$message("暂未配置组态大屏");
      return false;
    } else {
      results.forEach((item) => {
        if (item.type == "Dashboard") {
          this.viewtype = item.type;
          this.json = item.data.konva.Stage;
          console.log("json", this.json);
          this.dashboardId = item.objectId;
        }
      });
      this.queryData();
      // this.commandInfo.dialog = true;
      // this.loading = false;
      // this.commandInfo.data = results;
    }
    this.layer = Konva.Node.create(this.json, "container").findOne("Layer");
    this.stage = new Konva.Stage({
      container: "container",
      width: width,
      height: height,
    });
    this.stage.add(this.layer);
    this.$dgiotBus.$on("/konva", () => {
      this.stage.find("Text").forEach((node) => {
        // console.log("node", node);
        node.setAttrs({
          text: "改变",
        });
      });
      this.layer.draw();
    });
    console.log(this.stage);
    this.handleInitKonva();
    // 监听界面
    window.onresize = () => {
      return (() => {
        this.layer = Konva.Node.create(this.json, "container").findOne("Layer");
        this.stage = new Konva.Stage({
          container: "container",
          width: width,
          height: height,
        });
        this.stage.add(this.layer);
        this.handleInitKonva();
      })();
    };
  },
  methods: {
    async handleInitKonva() {
      let list = []; //vuecomponent 组件列表
      let amislist = []; // amiscomponent 组件列表
      this.amisFlag = false;
      this.stage.find("Label").forEach((node) => {
        console.log("label", node);
        // info["Label"] = stage.find("Label");
        this.initSize(node);
        node.setAttrs({
          draggable: false,
        });
        // node = this.initScale(node);
      });
      this.stage.find("Text").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
        node = this.initScale(node);
      });
      this.stage.find("Image").forEach((node) => {
        // node.setAttrs({
        //   draggable: false,
        // });
        // console.log("node", node);
        this.initSize(node);

        if (node.attrs.id == "bg") {
          console.log(node.attrs);
          this.bgSrc = node.attrs.src.includes("//")
            ? node.attrs.src
            : this.$FileServe + node.attrs.src;
        }
        if (
          node.attrs.type == "konvaimage" ||
          node.attrs.name == "vuecomponent"
        ) {
          let item = node.attrs;
          if (item.type == "count") {
            // console.log("item11111", item);
          }
          list.push(item);
        } else if (node.attrs.name == "amiscomponent") {
          let item = node.attrs;
          amislist.push(item);
        } else if (
          node.attrs.id.indexOf("不") < 0 &&
          node.attrs.id.indexOf("bg") < 0
        ) {
          // if (node.attrs.type == "staticimage")
          let image = new Image();
          node.setAttrs({
            image: image,
          });
          image.src = node.attrs.src.includes("//")
            ? node.attrs.src
            : this.$FileServe + node.attrs.src;
          // this.layer.add(node);
          // this.layer.batchDraw();
          // this.stage.add(this.layer);
        }
      });
      this.stage.find("Rect").forEach((node) => {
        // node.setAttrs({
        //   draggable: false,
        // });
        this.initSize(node);
        if (node.attrs.name == "vuecomponent") {
          let item = node.attrs;
          list.push(item);
        } else if (node.attrs.name == "amiscomponent") {
          let item = node.attrs;
          amislist.push(item);
        }
      });
      // this.layer.draw();
      this.layer.batchDraw();
      setTimeout(() => {
        this.layer.batchDraw();
      }, 1500);
      this.vueComponents = list;
      this.vueFlag = true;
      this.amisComponents = amislist;
      // 获取到低代码页面
      for (let index = 0; index < this.amisComponents.length; index++) {
        let res = await getView(this.amisComponents[index].id);
        this.amisComponents[index].viewData = res.data;
      }
      this.amisFlag = true;
    },
    // 按比例初始化大小 -
    initSize(node) {
      // console.log(node.attrs.height, document.body.clientHeight);
      node.setAttrs({
        draggable: false,
        x: (node.attrs.x * document.body.clientWidth) / 1920,
        y: (node.attrs.y * document.body.clientHeight) / 940,
        width: (node.attrs.width * document.body.clientWidth) / 1920,
        height: (node.attrs.height * document.body.clientHeight) / 940,
      });
    },
    initScale(node) {
      node.attrs.x = (node.attrs.x * document.body.clientWidth) / 1920;
      node.attrs.width = (node.attrs.width * document.body.clientWidth) / 1920;
      node.attrs.y = (node.attrs.y * document.body.clientHeight) / 940;
      node.attrs.height =
        (node.attrs.height * document.body.clientHeight) / 940;
      return node;
    },
    async initScreen() {
      let Startdashboardid = this.dashboardId; // "8263c928d5";
      await Startdashboard(Startdashboardid, {});
    },
    async queryData() {
      const { dashboard = {} } = await getDlinkJson("Dashboard");
      this.queryParams = dashboard;
      const Startdashboardid = this.dashboardId; // "8263c928d5";
      await Startdashboard(Startdashboardid, {});
    },
  },
};
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
  // width: 100%;
  margin: 0 !important;
  // background: url("../../assets/bg/pageBg.png") no-repeat 100% 100%;
  background-size: cover;
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

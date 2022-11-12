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
          v-if="comp.type == 'counter'"
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
        <!-- <screen-realcard
          v-else-if="comp.type == 'line'"
          :comp="comp"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        /> -->
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

        <img
          v-else-if="comp.type == 'konvaimage'"
          :src="comp.src"
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
import backgroundImage from "../../assets/bg/pageBg.png";
// import VueAliplayerV2 from 'vue-aliplayer-v2';
import DgiotAliplayer from "./component/DgiotAliplayer.vue";
import TopoCard from "./component/TopoCard.vue"; //卡片
import TopoPie from "./component/TopoPie.vue"; //饼图
import TopoCaltable from "./component/TopoCaltable.vue"; //告警列表
import ScreenDevice from "./component/ScreenDevice.vue"; //设备列表
import WorkOrder from "./component/WorkOrder.vue"; //工单列表
import ScreenRealcard from "./component/ScreenRealcard.vue"; //告警列表
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
    DgiotAliplayer,
  },
  data() {
    return {
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
          this.json = item.data.konva.Stage;
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
        console.log("node", node);
        node.setAttrs({
          text: "改变",
        });
      });
      this.layer.draw();
    });
    this.handleInitKonva();
  },
  methods: {
    async handleInitKonva() {
      let list = []; //vuecomponent 组件列表
      let amislist = []; // amiscomponent 组件列表
      this.stage.find("Label").forEach((node) => {
        // info["Label"] = stage.find("Label");
        node.setAttrs({
          draggable: false,
        });
      });
      this.stage.find("Text").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
      });

      this.stage.find("Image").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
        if (node.attrs.id == "bg") {
          console.log(node.attrs);
          this.bgSrc = node.attrs.src;
        }
        if (
          node.attrs.type == "konvaimage" ||
          node.attrs.name == "vuecomponent"
        ) {
          let item = node.attrs;
          list.push(item);
        } else if (node.attrs.name == "amiscomponent") {
          let item = node.attrs;
          amislist.push(item);
        } else if (node.attrs.id != "bg"&& node.attrs.id != "不删除") {
          // if (node.attrs.type == "staticimage")
          let image = new Image();
          node.setAttrs({
            image: image,
          });
          image.src = node.attrs.src;
          this.layer.add(node);
          this.layer.batchDraw();
          // this.stage.add(this.layer);
        }
      });
      this.stage.find("Rect").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
        if (node.attrs.name == "vuecomponent") {
          let item = node.attrs;
          list.push(item);
        } else if (node.attrs.name == "amiscomponent") {
          let item = node.attrs;
          amislist.push(item);
        }
      });
      // this.layer.draw();
      // this.layer.batchDraw();
      this.vueComponents = list;
      this.vueFlag = true;
      this.amisComponents = amislist;
      for (let index = 0; index < this.amisComponents.length; index++) {
        let res = await getView(this.amisComponents[index].id);
        this.amisComponents[index].viewData = res.data;
      }

      this.amisFlag = true;
      // this.layer.batchDraw();
    },
    async queryData() {
      const { dashboard = {} } = await getDlinkJson("Dashboard");
      this.queryParams = dashboard;
      // setTimeout(() => {
      //   this.queryParams.forEach((e) => {
      //     let key = e.vuekey;
      //     this.loadingConfig[`${key}`] = true;
      //   });
      // }, 1240);
      // if (this.queryParams[0].dataType == "map") {
      //   this.queryParams.splice(0, 5);
      // }
      const Startdashboardid = this.dashboardId; // "8263c928d5";
      await Startdashboard(Startdashboardid, {});
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 94vh;
  // width: 100%;
  margin: 0 !important;
  // background: url("../../assets/bg/pageBg.png") no-repeat 100% 100%;
  background-size: cover;
  .vue_component {
    position: absolute;
    z-index: 99;
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

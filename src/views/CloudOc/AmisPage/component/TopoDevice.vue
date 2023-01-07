<template>
  <div @mouseenter="enter" @mouseleave="leave" class="topo_content">
    <div id="deviceTopo"></div>
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
        <!-- 直播 -->
        <dgiot-aliplayer
          v-if="comp.type == 'liveboard'"
          :comp="comp"
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
        <screen-line
          v-else-if="comp.type == 'line'"
          :comp="comp"
          :selectdevice="deviceInfo"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />
        <screen-device-bar
          v-else-if="comp.type == 'devicebar'"
          :comp="comp"
          :selectdevice="deviceInfo"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
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
          :selectdevice="deviceInfo"
          :style="{
            width: comp.width + 'px',
            height: comp.height + 'px',
          }"
        />

        <!-- 工单模板 -->
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
    <el-dialog
      top="10vh"
      :append-to-body="true"
      width="1240px"
      @close="handlecloseDevice"
      :visible.sync="dialogTopoAmisVisible"
      v-if="dialogTopoAmisVisible"
    >
      <amis modal-append-to-body :schema="topoAmisData" :show-help="false" />
    </el-dialog>
  </div>
</template>

<script>
import DgiotAliplayer from "../../../dashboard/component/DgiotAliplayer.vue";
// import TopoCard from "./TopoCard.vue"; //卡片
// import TopoPie from "./TopoPie.vue"; //饼图
import TopoCaltable from "../../../dashboard/component/TopoCaltable.vue"; //告警列表
import ScreenDevice from "../../../dashboard/component/ScreenDevice.vue"; //设备列表
import WorkOrder from "../../../dashboard/component/WorkOrder.vue"; //工单列表
import ScreenRealcard from "../../../dashboard/component/ScreenRealcard.vue"; //告警列表
import ScreenLine from "../../../dashboard/component/ScreenLine.vue"; //历史折线图
import ScreenDeviceBar from "../../../dashboard/component/ScreenDeviceBar.vue"; //历史柱状图
// 通用组件
import DgiotNotification1 from "../../../dashboard/component/notification/DgiotNotification1.vue"; //告警模板1
import Amis from "@/components/Amis/index.vue"; //amis 组件
import { Base64 } from "js-base64";
import { queryView, getTopo, getView, postAmis } from "@/api/View";
import { sendTopic } from "@/api/Dashboard";
export default {
  name: "TopoDevice",
  props: {
    deviceInfo: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    DgiotAliplayer,
    TopoCaltable,
    ScreenDevice,
    WorkOrder,
    ScreenRealcard,
    Amis,
    ScreenLine,
    ScreenDeviceBar,
    DgiotNotification1,
  },
  data() {
    return {
      vueFlag: false,
      amisFlag: false,
      vueComponents: [], //vue 组件
      devicestage: {}, //组态舞台
      devicelayer: {}, //组态layer
      devicetopo: {}, //设备组态
      dialogTopoAmisVisible: false,
      topoAmisData: {},
    };
  },
  mounted() {
    this.vueComponents = [];
    this.amisComponents = [];
    this.handleOpenTopo(this.deviceInfo);
  },
  methods: {
    enter() {
      console.log("enter");
      window.addEventListener("mousewheel", this.handleScroll, true);
    },
    leave() {
      console.log("leave");
      window.removeEventListener("mousewheel", this.handleScroll, true);
    },
    handleScroll(e) {
      e = e || window.event;
      var box1 = document.querySelector(".topo_content");
      // console.log('滚动了', e)
      //判断滚轮滚动方向
      //wheelDelta获取到鼠标滚动方向，向上滚是正值，向下是负值，但火狐不支持
      //event.detail火狐支持，向上为负值，向下为正值
      // return
      // if (e.wheelDelta > 0 || e.detail < 0) {
      //   box1.style.width = box1.offsetWidth * 1.02 + "px";
      //   box1.style.height = box1.offsetHeight * 1.02 + "px";
      // } else {
      //   box1.style.width = box1.offsetWidth * 0.98 + "px";
      //   box1.style.height = box1.offsetHeight * 0.98 + "px";
      // }
    },
    // 打开组态弹窗
    async handleOpenTopo(deviceInfo) {
      localStorage.setItem("parse_deviceid", deviceInfo.objectId);
      let params = {
        count: "objectId",
        order: "createdAt",
        excludeKeys: "data",
        skip: 0,
        where: {
          class: { $regex: "Product" },
          type: { $regex: "Topo" },
          key: { $regex: deviceInfo.product.objectId },
        },
      };

      const res = await queryView(params);
      console.log("组态", res);
      if (res.results.length == 0) {
        this.$message("暂未配置组态");
        return;
      }
      let param = {
        productid: deviceInfo.product.objectId,
        devaddr: deviceInfo.devaddr,
        viewid: res.results[0]?.objectId || "",
      };
      const result = await getTopo(param);
      // console.log("组态渲染", result);
      this.devicetopo = result.data.Stage;
      let data = {
        topic: `$dg/user/konva/${deviceInfo.objectId}/report`,
      };

      // this.dialogTopoVisible = true;

      console.log("this.deviceInfo", this.deviceInfo);

      setTimeout(() => {
        this.initDeviceKonva();
        this.sendTopic(data);
      }, 500);
    },
    initDeviceKonva() {
      //
      // this.devicelayer = Konva.Node.create(this.devicetopo, "deviceTopo");
      this.devicelayer = Konva.Node.create(
        this.devicetopo,
        "deviceTopo"
      ).findOne("Layer");
      this.devicestage = new Konva.Stage({
        container: "deviceTopo",
        width: 1200,
        height: 700,
      });
      this.devicestage.add(this.devicelayer);
      this.$dgiotBus.$off("$dg/user/konva");
      this.$dgiotBus.$on("$dg/user/konva", (e) => {
        let str = String.fromCharCode.apply(null, new Uint8Array(e));
        let receive = JSON.parse(Base64.decode(str));
        console.log(receive);
        receive.konva.forEach((item) => {
          // console.log(item)
          var info = this.putNode(
            this.devicestage,
            item.id,
            item.text,
            item.type
          );
          // canvas.stage.find(item.id)[0].setAttrs(item.params)
        });
        // this.stage.find(e.id).forEach((node) => {
        //   // console.log("node", node);
        //   node.setAttrs({
        //     text: "改变",
        //   });
        // });
        // this.devicelayer.draw();
      });
      // console.log(this.stage);
      this.handleInitKonva();
    },
    // 实时更新组态内容
    putNode(node, nodeid, text, type) {
      // console.log("组态修改", node, nodeid, text, type);
      if (type != "undefined") {
        let params = {};
        params[type] = text;
        console.log(nodeid, text);
        node.find(`#${nodeid}`).forEach((item) => {
          console.log(item);
          item.setAttrs(params);
          // var change = node.find(`#${nodeid}`)[0]
        });
        this.devicelayer.batchDraw();
      }
      // in nodeid find node
      // in node.name event
      // if thing put text
      // node.setAttrs(params)
    },
    async handleInitKonva() {
      let list = []; //vuecomponent 组件列表
      let amislist = []; // amiscomponent 组件列表
      this.devicestage.find("Label").forEach((node) => {
        // info["Label"] = stage.find("Label");
        // this.initSize(node)
        node.setAttrs({
          draggable: false,
        });
      });
      this.devicestage.find("Text").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
        node.on("touchend", async (e) => {
          console.log("touchend", node);
          if (node.attrs.bind_amis) {
            localStorage.setItem("parse_objectid", this.deviceInfo.objectId);
            localStorage.setItem(
              "parse_productid",
              this.deviceInfo.product.objectId
            );
            let params = {
              viewid: node.attrs.amis_id,
            };
            let data = {
              render: {
                text: node.attrs.text.trim(),
              },
            };
            let res = await postAmis(params, data);
            // let res = await getView(node.attrs.amis_id);
            this.topoAmisData = res.data;
            this.dialogTopoAmisVisible = true;
            // amis_id
          }
          // if (node.getAttr("bind_amis") && node.getAttr("amis_id").length > 0)
          //   dgiotBus.$emit("nodeInfo", node);
        });
        /** */
        node.on("click", async (e) => {
          console.log("click", node);
          if (node.attrs.bind_amis) {
            localStorage.setItem("parse_objectid", this.deviceInfo.objectId);
            localStorage.setItem(
              "parse_productid",
              this.deviceInfo.product.objectId
            );
            let params = {
              viewid: node.attrs.amis_id,
            };
            let data = {
              render: {
                text: node.attrs.text.trim(),
              },
            };
            let res = await postAmis(params, data);
            // console.log("res", res);
            // let res = await getView(node.attrs.amis_id);
            this.topoAmisData = res.data;
            this.dialogTopoAmisVisible = true;
            // amis_id
          }
        });
      });
      this.devicestage.find("Image").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
        if (
          node.attrs.type == "konvaimage" ||
          node.attrs.name == "vuecomponent"
        ) {
          let item = node.attrs;
          list.push(item);
        } else if (node.attrs.name == "amiscomponent") {
          let item = node.attrs;
          amislist.push(item);
        } else if (node.attrs.id.indexOf("不") < 0) {
          // if (node.attrs.type == "staticimage")
          let image = new Image();
          node.setAttrs({
            image: image,
          });
          image.src = node.attrs.src.includes("//")
            ? node.attrs.src
            : this.$FileServe + node.attrs.src;
          // image.src = node.attrs.src;
          // this.devicelayer.add(node);
          // this.devicelayer.batchDraw();
          // this.stage.add(this.layer);
        }
      });
      this.devicestage.find("Rect").forEach((node) => {
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
      this.devicelayer.batchDraw();
      setTimeout(() => {
        console.log("第一次重绘");
        this.devicelayer.batchDraw();
      }, 500);
      setTimeout(() => {
        console.log("第二次重绘");
        this.devicelayer.batchDraw();
      }, 1000);
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
    sendTopic(data) {
      sendTopic(data).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.topo_content {
  position: relative !important;

  height: 700px;
  // background-color: #12ae7b;
  width: 1200px;
  #deviceTopo {
    width: 100%;
    height: 100%;
    position: relative;
  }
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
</style>

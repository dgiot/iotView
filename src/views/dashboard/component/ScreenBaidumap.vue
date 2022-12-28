<template>
  <div class="baidumap" :style="{ width: '100%', height: '100%' }">
    <baidu-map
      v-if="mapFlag"
      id="baidu_map"
      :ak="ak"
      :center="center"
      class="baidu_map"
      :scroll-wheel-zoom="true"
      :zoom="sizeZoom"
      @click="handleMapClick"
    >
      <bm-map-type
        anchor="BMAP_ANCHOR_TOP_LEFT"
        :map-types="['BMAP_HYBRID_MAP', 'BMAP_NORMAL_MAP']"
      />
      <bm-overview-map :is-open="true" />
      <bm-scale :offset="{ width: 260, height: 0 }" />
      <bm-city-list :offset="{ width: 330, height: 0 }" />
      <bml-marker-clusterer :average-center="true">
        <div v-for="(item, index) in deviceList" :key="index">
          <bm-marker
            :ref="'bm_info' + index"
            :position="{
              lng: item.location.longitude,
              lat: item.location.latitude,
            }"
            @click="showDeatils(item, index)"
          >
            <bm-info-window
              :key="index"
              :position="{
                lng: item.location.longitude,
                lat: item.location.latitude,
              }"
              :show="item.show"
              style="display: none"
              @close="closeInfo(item, index)"
            >
              <div v-show="deviceInfo" class="deviceInfo" style="width: 400px">
                <el-row :gutter="24">
                  <!-- <el-col :span="6">
                    <el-image
                      :preview-src-list="[`${productIco}`]"
                      :src="productIco"
                      style="width: 100px; height: 100px"
                    >
                      <div slot="error" class="image-slot">
                        <i
                          class="el-icon-picture-outline empty"
                          style="width: 100px; height: 100px"
                        ></i>
                      </div>
                    </el-image>
                  </el-col> -->

                  <el-col :span="24">
                    <div style="display: flex; justify-content: space-between">
                      <h2 style="font-weight: 600">{{ deviceInfo.name }}</h2>
                      <el-link
                        style="margin-right: 16px"
                        :type="
                          deviceInfo.status === 'ONLINE' ? 'success' : 'danger'
                        "
                        :underline="false"
                      >
                        <span
                          class="circle"
                          :class="
                            deviceInfo.status === 'ONLINE'
                              ? 'success'
                              : 'warning'
                          "
                        ></span>
                        {{ deviceInfo.status === "ONLINE" ? "在线" : "离线" }}
                      </el-link>
                    </div>
                    <div style="color: #ccc">
                      编号：{{ deviceInfo.devaddr }}
                    </div>
                    <div style="color: #ccc">
                      位置：{{ deviceInfo.address }}
                    </div>
                    <p>
                      <el-button
                        type="success"
                        @click="handleOpenRealCard(deviceInfo)"
                      >
                        实时数据
                      </el-button>
                      <el-button @click="handleOpenTopo(deviceInfo)">
                        组态
                      </el-button>
                      <!-- <el-link
                        type="primary"
                        @click="goLink('real-time', item)"
                      >
                       
                      </el-link> -->
                    </p>
                  </el-col>
                </el-row>
              </div>
            </bm-info-window>
          </bm-marker>
        </div>
      </bml-marker-clusterer>
    </baidu-map>
    <el-dialog
      class="device_wrap"
      :title="deviceInfo.name"
      :append-to-body="true"
      top="10vh"
      @close="handlecloseDevice"
      :visible.sync="dialogDeviceVisible"
    >
      <real-card :cardList="cardList" :avator="avator" />
    </el-dialog>
    <!-- 组态渲染 -->
    <!-- <el-dialog
      class="topo_wrap"
      :title="deviceInfo.name"
      top="10vh"
      :append-to-body="true"
      width="1240px"
      @close="handlecloseDevice"
      :visible.sync="dialogTopoVisible"
      v-if="dialogTopoVisible"
    > -->
    <div class="topo_wrap" v-if="dialogTopoVisible">
      <div class="topo_contentwrap">
        <div class="topo_title_top">
          <div>{{ deviceInfo.name }}</div>
          <span style="cursor: pointer" @click="closeTopo">x</span>
        </div>
        <div class="topo_content">
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
                :src="
                  comp.src.includes('//') ? comp.src : $FileServe + comp.src
                "
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
      </div>
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
import {
  BaiduMap,
  BmCityList,
  BmControl,
  BmGeolocation,
  BmInfoWindow,
  BmlMarkerClusterer,
  BmMapType,
  BmMarker,
  BmNavigation,
  BmOverviewMap,
  BmPanorama,
  BmScale,
  BmLabel,
  BmPointCollection,
  BmPolyline,
} from "vue-baidu-map";
import RealCard from "./commom/RealCard.vue";

import DgiotAliplayer from "./DgiotAliplayer.vue";
// import TopoCard from "./TopoCard.vue"; //卡片
// import TopoPie from "./TopoPie.vue"; //饼图
import TopoCaltable from "./TopoCaltable.vue"; //告警列表
import ScreenDevice from "./ScreenDevice.vue"; //设备列表
import WorkOrder from "./WorkOrder.vue"; //工单列表
import ScreenRealcard from "./ScreenRealcard.vue"; //告警列表
import Amis from "@/components/Amis/index.vue"; //amis 组件

import { querycompanyDevice, getDevice, getDeviceRealCard } from "@/api/Device";
import avator from "@/assets/bg/avator.png";
import { Base64 } from "js-base64";
// import { queryProduct } from "@/api/Product";
import { sendTopic } from "@/api/Dashboard";
import { queryView, getTopo, getView, postAmis } from "@/api/View";
export default {
  name: "ScreenBaidumap",
  components: {
    BmPointCollection,
    BmInfoWindow,
    BmScale,
    BmMapType,
    BmOverviewMap,
    BmPanorama,
    BmControl,
    BmLabel,
    BaiduMap,
    BmNavigation,
    BmGeolocation,
    BmCityList,
    BmMarker,
    BmlMarkerClusterer,
    BmPolyline,
    RealCard,
    // 自定义组件
    amis: Amis,
    TopoCaltable,
    ScreenDevice,
    ScreenRealcard,
    WorkOrder,
    DgiotAliplayer,
  },
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
    return {
      avator: avator,
      dialogDeviceVisible: false,
      dialogTopoVisible: false, //组态
      ak: "S7pehghn5BdQeSGZAcpEk4bLQSQ8czvi",
      sizeZoom: 12,
      mapFlag: false,
      center: {
        lng: 120.260545,
        lat: 31.551162,
      },
      deviceList: [],
      cardList: [],
      productIco: "",
      deviceInfo: {},
      devicetopo: {},
      devicelayer: "",
      devicestage: "",
      vueComponents: [],
      amisComponents: [],
      vueFlag: false,
      amisFlag: false,
      dialogTopoAmisVisible: false,
      topoAmisData: {},
    };
  },
  async created() {},
  async mounted() {
    await this.queryDevice();
    this.mapFlag = true;
    this.$dgiotBus.$off("device/transmit");
    this.$dgiotBus.$on("device/transmit", (item) => {
      console.log("接受了", item);
      this.center = {
        lng: item.location.longitude,
        lat: item.location.latitude,
      };
      this.sizeZoom = 15;
      for (let index = 0; index < this.deviceList.length; index++) {
        if (this.deviceList[index].objectId == item.objectId) {
          this.deviceInfo = this.deviceList[index];
          this.deviceList[index].show = true;
        } else {
          this.deviceList[index].show = false;
        }
      }
    });
    this.$dgiotBus.$off("$dg/user/realtimecard");
    this.$dgiotBus.$on("$dg/user/realtimecard", (e) => {
      // console.log(e);
      // let receive = e;
      let str = String.fromCharCode.apply(null, new Uint8Array(e));
      let receive = JSON.parse(Base64.decode(str));
      console.log("转化", receive);
      this.cardList = this.renderCard(receive.data);
    });
  },
  methods: {
    // 关闭组态弹窗
    closeTopo() {
      this.amisFlag = false;
      this.vueFlag = false;
      this.dialogTopoVisible = false;
      this.$emit("initScreen");
    },
    // 打开组态弹窗
    async handleOpenTopo(deviceInfo) {
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
      localStorage.setItem("parse_objectId", deviceInfo.objectId);
      this.vueComponents = [];
      this.amisComponents = [];
      const res = await queryView(params);
      console.log("组态", res);
      // res.results.forEach(ele =>{

      // })
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

      this.dialogTopoVisible = true;

      console.log("this.deviceInfo", this.deviceInfo);
      this.sendTopic(data);
      setTimeout(() => {
        this.initDeviceKonva();
      }, 2000);
    },
    initDeviceKonva() {
      //
      // this.devicelayer = Konva.Node.create(this.devicetopo, "deviceTopo");
      this.devicelayer = Konva.Node.create(
        this.devicetopo,
        "deviceTopo"
      ).findOne("Layer");
      // this.devicestage = new Konva.Stage({
      //   container: "deviceTopo",
      //   width: this.devicetopo.attrs.width,
      //   height: this.devicetopo.attrs.height,
      // });
      // this.devicestage.add(this.devicelayer);

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
            // let res = await getView(node.attrs.amis_id);
            this.topoAmisData = res.data;
            this.dialogTopoAmisVisible = true;
            // amis_id
          }
        });
      });
      this.devicestage.find("Image").forEach((node) => {
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
    handlecloseDevice() {
      console.log("关闭实时数据弹窗");
      this.$emit("initScreen");
    },
    async handleOpenRealCard(deviceInfo) {
      const res = await getDeviceRealCard(deviceInfo.objectId);
      this.cardList = this.renderCard(res.data);
      console.log("thiscardList", this.cardList);
      let data = {
        topic: `$dg/user/realtimecard/${deviceInfo.objectId}/report`,
      };
      this.sendTopic(data);
      this.dialogDeviceVisible = true;
    },
    sendTopic(data) {
      sendTopic(data).then((res) => {
        console.log(res);
      });
    },
    // 数据卡片分类
    renderCard(resData) {
      let array = [];
      resData.forEach((item) => {
        item.devicetype = item.devicetype === "" ? "default" : item.devicetype;
        if (item.devicetype) array.push(item.devicetype);
      });
      array = [...new Set(array)]; //_.uniqBy(array)
      console.log("类别", array);
      let cardlist = [];
      array.forEach((item) => {
        let type = {}; //数据类别分类
        let arr = [];
        resData.forEach((item1) => {
          if (item == item1.devicetype) arr.push(item1);
        });
        type["data"] = arr;
        type["name"] = item;
        cardlist.push(type);
      });
      return cardlist;
    },
    // 关闭弹窗
    closeInfo(item, index) {
      item.show = false;
      // this.$refs[`bm_info${index}`][0].$children[0].show = false
      // this.set_tableData(_.merge([], this._tableData))
      // this.$forceUpdate()
    },
    async showDeatils(row, index) {
      // const loading = this.$baseColorfullLoading(0);
      this.productIco = "";
      this.deviceInfo = await getDevice(row.objectId);
      console.log("this.deviceInfo", this.deviceInfo);
      // const { results = [{ icon: "" }] } = await queryProduct({
      //   count: "objectId",
      //   order: "-updatedAt",
      //   keys: "icon",
      //   where: {
      //     objectId: this.deviceInfo.product.objectId,
      //   },
      // });
      // this.productIco = results[0]?.icon || "";
      // loading.close();
      // row.show = true;
      this.deviceList[index].show = true;
      // this.$refs[`bm_info${index}`][0].$children[0].show = true;
    },
    async queryDevice() {
      let params = {
        skip: 0,
        // excludeKeys: this.queryForm.excludeKeys,
        // include: this.queryForm.include,
        order: "-createdAt",
        count: "objectId",
        where: {},
      };
      // this.queryForm.product
      //   ? (params.where.product = this.queryForm.product)
      //   : ''
      // this.queryForm.search
      //   ? (params.where[this.queryForm.type] = {
      //       $regex: this.queryForm.search,
      //     })
      //   : ''
      // this.queryForm.status
      //   ? (params.where.status = this.queryForm.status)
      //   : ''
      // this.queryForm.isEnable
      //   ? (params.where.isEnable = this.queryForm.isEnable)
      //   : ''
      const { results: list = [], count: total = 0 } = await querycompanyDevice(
        params
      );
      let centerflag = true;
      list.forEach((item) => {
        item.address =
          item.address == "" || item.address == undefined
            ? "---"
            : item.address;
        item.show = false;
        if (centerflag && item.location?.latitude && item.location?.longitude) {
          this.center = {
            lng: item.location?.longitude,
            lat: item.location?.latitude,
          };
        }
      });
      this.deviceList = list;
    },
    async handleMapClick(e) {
      console.log("单击地图事件", e);
      let location = {
        __type: "GeoPoint",
        latitude: e.point.lat,
        longitude: e.point.lng,
      };
      let params = {
        limit: 10,
        where: {
          location: {
            $nearSphere: location,
            $maxDistanceInMiles: 10.0,
          },
        },
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-card__body {
    padding: 4px 2px;
  }
}
.baidu_map {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  .circle {
    display: inline-block;
    margin-top: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
  .success {
    background-color: #12ae7b;
  }
  .warning {
    background-color: #ff0000;
  }
  .device_wrap {
    height: 800px;
    // z-index: 999;
    background-color: #fff;
  }
}
// .device_wrap .wrap_card {
//   height: 800px;
//   width: 100%;
//   overflow: auto;
//   .flex_col {
//     display: flex;
//     flex-wrap: wrap;
//   }
//   .box-card {
//     width: 260px;
//     margin: 15px;
//     display: flex;
//     flex-direction: column;

//     .card_content {
//       padding: 10px 4px 10px 14px;
//       display: flex;
//       line-height: 50px;

//       font-size: 28px;
//       color: #1b89cd;
//       .card_content_number {
//         flex: 1;
//         text-align: center;
//       }
//     }
//     .card_bottom {
//       line-height: 20px;
//       text-align: center;
//       margin-top: 4px;
//     }
//     // margin-left: 10px;
//   }
//   // overflow: scroll;
// }
.topo_wrap {
  position: fixed;
  top: 0%;
  left: 0%;
  // transform: translate(-50%, -50%);
  z-index: 99;
  height: 100%;
  background-color: rgba(114, 118, 122, 0.5);
  width: 100%;
  .topo_contentwrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    height: 700px;
    background-color: #fff;
    width: 1200px;
  }
  .topo_title_top {
    padding: 2px 4px;
    margin-bottom: 10px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    color: #000;
    font-size: 26px;
  }
  // background-color: #fff;
}
.topo_wrap .topo_content {
  position: relative;

  height: 700px;
  // background-color: #12ae7b;
  width: 1200px;
  #deviceTopo {
    width: 100%;
    height: 100%;
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

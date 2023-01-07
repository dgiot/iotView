<template>
  <div class="ScreenRealcard">
    <div class="bg-color-black">
      <div class="pt-2 pl-2">
        <!-- <span>
          <icon name="el-chart-pie" class="text-icon"></icon>
        </span> -->
        <div class="d-flex">
          <span class="fs-xl text mx-2">设备列表</span>
        </div>
      </div>
      <div class="jc-center">
        <div class="flex_left">
          <div class="flex-item">
            <div class="flex_item_2">设备名称</div>
            <div class="flex_item_1">设备状态</div>
          </div>
          <div class="jc-center-content">
            <div
              class="flex-item"
              v-for="(o, index) in deviceList"
              :key="index"
              @click="handleDeviceCheck(o, index)"
              :class="{ deviceActive: index == currentIndex }"
            >
              <div class="flex_item_2" style="z-index: 99999">
                <el-tooltip :content="o.name" effect="dark" placement="top">
                  <span>{{ o.name }}</span>
                </el-tooltip>
                <!-- <input class="ct_right" @keyup.enter="handleChange(o)" v-model="o.detail.address" /> -->
              </div>
              <div class="flex_item_1">
                <span v-if="o.status == 'OFFLINE'" style="color: #f00"
                  >离线</span
                >
                <span v-else style="color: #26db6f">在线</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex_right">
          <!-- cardList.length > 2 ? 'flex_rt_item1' : 'flex_rt_item2' -->
          <div
            class="flex_rt_item1"
            v-for="(item, index) in cardList"
            :key="index"
          >
            <div class="flex_rt_item_ct">
              <div class="flex_rt_item_ct_img">
                <img src="../../../assets/bg/realtime.png" alt />
              </div>
              <div class="flex_rt_item_ct_real">
                <div class="ct_real_name">{{ item.name }}</div>
                <div class="ct_real_number">
                  {{ item.number }}{{ item.unit }}
                </div>
                <div class="ct_real_time">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <CenterLeft2Chart /> -->
      </div>
    </div>
    <select
      class="select_time"
      name="public-choice"
      v-model="productSelected"
      @change="getCouponSelected($event)"
    >
      <option
        class="select_option"
        :value="option.objectId"
        :key="option.objectId"
        v-for="option in productlist"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>
<script>
import { mapState } from "vuex"; //mapMutations，mapGetters

// import { updateDevice, getnowData } from "@/api/datav.js";
export default {
  props: {
    markers: {
      type: Array,
      default: () => [],
    },
    // productlist: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  components: {},
  computed: {
    ...mapState(["realCard"]),
    // ...mapGetters(['showCount']),
    realCard1() {
      return this.realCard;
    },
  },
  watch: {
    realCard1(newData) {
      //oldData
      // if (this.isObjectChanged(oldData, newData)) {
      console.log("newData", newData);
      this.cardList = newData;
      // }
    },
  },
  data() {
    return {
      nowselect: "",
      currentIndex: 0,
      cardList: [
        {
          name:'温度',
          number: "1212121",
          unit: "%",
          time: "2022-11-01 15:40:21",
        },
        {
          name:'温度',
          number: "1",
          unit: "%",
          time: "2022-11-01 15:40:21",
        },
        {
          name:'温度',
          number: "1",
          unit: "%",
          time: "2022-11-01 15:40:21",
        },
        {
          name:'温度',
          number: "1",
          unit: "%",
          time: "2022-11-01 15:40:21",
        },
      ],
      productlist: [
        {
          name: "产品1",
          objectId: "afhaifha",
        },
      ],
      productSelected: "ALL",
      // ak: "fnc5Z92jC7CwfBGz8Dk66E9sXEIYZ6TG",
      isActive: true,
      show: false,
      activeName: "",
      deviceList: [
        {
          name: "设备1",
          status: "OFFLINE",
        },
        {
          name: "设备2",
          status: "ONLINE",
        },
        {
          name: "设备1",
          status: "OFFLINE",
        },
        {
          name: "设备2",
          status: "ONLINE",
        },
        {
          name: "设备1",
          status: "OFFLINE",
        },
        {
          name: "设备2",
          status: "ONLINE",
        },
      ],
      realData: [],
    };
  },
  mounted() {
    console.log("markers", this.markers);
    console.log("产品列表", this.productlist);
    window.addEventListener("mousewheel", this.handleScroll, false);
    // firefox
    window.addEventListener("DOMMouseScroll", this.handleScroll, false);
    // getnowData(this.markers[this.currentIndex].objectId).then(res => {
    //   let list = [];
    //   res.data.forEach(element => {
    //     if (element.name != "温湿度") {
    //       list.push(element);
    //     }
    //   });
    //   this.cardList = list;
    //   // this.$emit("getrealdata", list, this.markers[this.currentIndex].name);
    //   this.$store.commit(
    //     "updateObjectId",
    //     this.markers[this.currentIndex].objectId
    //   );
    // });
  },
  methods: {
    /**
     * 选择产品
     */
    getCouponSelected(event) {
      console.log(event.target.value);
      let objectId = event.target.value;
      this.currentIndex = -1;
      console.log("objectId产品编号", objectId);
      this.$emit("updateDevice", objectId);
    },
    /**
     * 判断对象相等
     * https://blog.csdn.net/weixin_55633731/article/details/119257453
     * https://blog.csdn.net/qq_25742631/article/details/105581625
     */
    isObjectChanged(source, comparison) {
      const _source = JSON.stringify(source);
      // console.log("原数据",_source);
      const _comparison = JSON.stringify({ ...source, ...comparison });
      // console.log("比较数据",_comparison);
      return _source !== _comparison;
    },
    updateAddress(value) {
      console.log("这是value", value);
    },
    handleChange(o) {
      console.log("这是设备", o);
      let params = {
        // ACL:o.ACL,
        // address:o.detail.
        basedata: o.basedata,
        // content:o.content,
        detail: o.detail,
        devaddr: o.devaddr,
        // location:o.location,
        name: o.name,
        // product:o.product
      };
      updateDevice(o.objectId, params).then((res) => {
        console.log("修改成功", res);
      });
    },
    handleSizeOfMap() {
      this.isActive = !this.isActive;
    },
    handleZoom({ type, target }) {
      console.log(type, target);
      this.center = {
        lat: target.re.lat,
        lng: target.re.lng,
      };
    },
    handler({ BMap, map }) {
      let _this = this;
      console.log("百度地图", BMap, map);
      // 监听地图缩放开始事件 lng表示经度，lat表示纬度
      map.addEventListener("zoomstart", function () {
        _this.center.lng = map.getCenter().lng;
        _this.center.lat = map.getCenter().lat;
      });

      map.addEventListener("zoomend", function () {
        map.centerAndZoom(
          new BMap.Point(_this.center.lng, _this.center.lat),
          map.getZoom()
        );
      });
      // this.map.center.lng = 118.802422
      // this.map.center.lat = 32.065631
      // this.map.zoom = 12;
      // this.map.width =
      //   document.getElementById("container").clientWidth - 330 + "px";
      // this.map.height = document.body.clientHeight - 160 + "px";
      // this.getProPositionMap();
    },
    //查看详情
    infoWindowClose() {
      console.log("111");
      this.show = false;
    },
    handleDeviceCheck(o, index) {
      // if (this.show) {
      //   this.show = false;
      // }
      let { name, objectId } = o;
      this.realData = [];
      this.$store.commit("updateObjectId", objectId);
      getnowData(o.objectId).then((res) => {
        // console.log("这是实时数据", res);
        let list = [];
        res.data.forEach((element) => {
          if (element.name != "温湿度") {
            list.push(element);
          }
        });
        list.forEach((item) => {
          if (item.name == "水浸") {
            item.number = item.number == 1 ? "正常" : "异常";
          } else if (item.name == "烟感") {
            item.number = item.number == 0 ? "正常" : "异常";
          }
        });
        this.cardList = list;
        this.$emit("getrealdata", list, name);
      });
      this.currentIndex = index;

      this.$emit("deviceclick", objectId, name);
    },
  },
};
</script>
<style lang="scss" scoped>
/*里面的代码可以根据自己需求去进行更改*/
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 12px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #3d4f8b;
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
/* ::-webkit-scrollbar-thumb:window-inactive {
background-color: #2472ea;
} */
</style>
<style lang="scss" scoped>
.ScreenRealcard {
  // $box-width: 300px;
  // $box-height: 520px;
  width: 100%;
  height: 100%;
  padding: 16px;
  background: url("../../../assets/bg/bg_warning.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  color: #fff;
  // height: $box-height;
  // min-width: $box-width;
  border-radius: 5px;
  .bg-color-black {
    height: calc(100%);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    .jc-center {
      width: 100%;
      height: 90%;
      margin-top: 2%;
      margin-bottom: 2%;
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      // right: -25px;
      // left: 0;
      // top: 0;
      .flex_left {
        width: 40%;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 0.5px solid #6db4f8;
        box-shadow: 1px 1px 4px #32c5e9;
        .jc-center-content {
          height: calc(100% - 50px);
          overflow: scroll;
          // overflow-y: scroll;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .flex-item {
          line-height: 50px;
          width: 100%;
          display: flex;
          cursor: pointer;
          .flex_item_2 {
            flex: 3;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            // width: 140px;
          }
          .flex_item_1 {
            flex: 2;
            text-align: center;
          }
        }
      }
      .flex_right {
        width: 59%;
        // height: 400px;
        height: 100%;
        margin-left: 1%;
        display: flex;
        flex-wrap: wrap;
        justify-content:center;
        // flex-direction: column;
        border: 0.5px solid #6db4f8;
        // box-shadow: 1px 1px 4px #32c5e9;
        overflow: scroll;
        // overflow-y: scroll;
        overflow-x: hidden;
        overflow-y: auto;
        .flex_rt_item1 {
          // width: 47%;
          margin-top: 20px;
          margin-bottom: 0px;
          margin-left: 2%;
          height: 110px;
          box-sizing: border-box;
          border: 0.5px solid #6db4f8;
          box-shadow: 1px 1px 4px #32c5e9;
          .flex_rt_item_ct {
            margin: 15px;
            display: flex;
            // height: 110px;
            .flex_rt_item_ct_img {
              width: 40%;
              height: 80px;
              padding-right: 10px;
              border-right: 2px solid #fff;
              img {
                // display: inline-block;
                width: 100%;
                height: 100%;
              }
            }
            .flex_rt_item_ct_real {
              div {
                padding-left: 20px;
              }
              .ct_real_name {
                font-size: 1.25em;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 140px;
              }
              .ct_real_number {
                margin-top: 5px;
                // padding-top: 15px;
                font-size: 1.5em;
                color: #ffdb5c;
              }
              .ct_real_time {
                margin-top: 2px;
                font-size: 0.625em;
                color: #16c1f3;
              }
            }
          }
        }
        .flex_rt_item2 {
          width: 96%;
          margin-top: 20px;
          margin-bottom: 0px;
          margin-left: 2%;
          height: 200px;
          box-sizing: border-box;
          border: 0.5px solid #6db4f8;
          box-shadow: 1px 1px 4px #32c5e9;
          .flex_rt_item_ct {
            margin: 15px;
            display: flex;
            // height: 110px;
            .flex_rt_item_ct_img {
              width: 200px;
              height: 170px;
              padding-right: 10px;
              border-right: 2px solid #fff;
              img {
                // display: inline-block;
                width: 170px;
                height: 170px;
              }
            }
            .flex_rt_item_ct_real {
              display: flex;
              flex-direction: column;
              div {
                padding-left: 20px;
              }
              .ct_real_name {
                font-size: 1.625em;
                padding-top: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                // width: 140px;
                flex: 2;
              }
              .ct_real_number {
                margin-top: 5px;
                padding-top: 15px;
                font-size: 1.875em;
                color: #ffdb5c;
                flex: 2;
              }
              .ct_real_time {
                margin-top: 10px;
                font-size: 1em;
                color: #16c1f3;
                flex: 1;
              }
            }
          }
        }
      }
      .offline {
        // background-color: #fff100;
        background: conic-gradient(
            from -45deg at 400px 300px,
            rgba(246, 246, 44, 0.981),
            transparent 50%,
            rgba(223, 247, 5, 0.5) 100%
          ),
          linear-gradient(-45deg, #f1ff00, #cdd808);
        color: #000 !important;
        .bd_black {
          border: 2px solid #000;
        }
      }

      .online {
        // background-color: #004098;
        background: conic-gradient(
            from -45deg at 400px 300px,
            hsla(170deg, 100%, 70%, 0.7),
            transparent 50%,
            hsla(219deg, 90%, 80%, 0.5) 100%
          ),
          linear-gradient(-45deg, #32c5e9, #37a2da);
        .bd_white {
          border: 2px solid #fff;
        }
      }
      .deviceActive {
        // background-color: #81e937 !important;
        color: #fff !important;
        background: conic-gradient(
            from -45deg at 400px 300px,
            rgba(50, 197, 233, 0.5),
            transparent 50%,
            rgba(50, 197, 233, 0.5) 100%
          ),
          linear-gradient(-45deg, #5a93cc, #32c5e9);
      }
    }
  }
  .select_time {
    position: absolute;
    left: 100px;
    top: 6px;
    width: 120px;
    height: 30px;
    border-radius: 4px;
    border: 0.5px solid #16c1f3;
    // background-color: #173e56;
    background: -webkit-linear-gradient(left, #0f1428 0%, #0e1427 80%);
    color: #fff;
    .select_option {
      background-color: #0f1428;
      color: #fff;
      width: 60px;
      text-align: center;

      font-size: 0.625em !important;
      option {
        padding: 5px;
      }
    }
  }
  .text {
    color: #c3cbde;
  }
  .dv-dec-1 {
    position: relative;
    width: 100px;
    height: 20px;
    top: -3px;
  }
  .chart-box {
    margin-top: 16px;
    width: 170px;
    height: 170px;
    .active-ring-name {
      padding-top: 10px;
    }
  }
  .map {
    // min-width: 800px;
    // width: 1000px;
    // height: 710px;
    // float: left;
    background: white;
    border-radius: 5px;
    margin-left: 10px;

    .right {
      text-align: left;
    }
    .left {
      width: 100px;
    }
  }
  .active {
    position: relative;
  }
  .unactive {
    position: fixed;
    min-width: 1080px;
    width: 1920px;
    min-height: 860px;
    z-index: 99;
  }
}
</style>

<template>
  <div class="topoCaltable" :style="{ width: '100%', height: '100%' }">
    <!-- <div class="screen_right_bottom_top">设备列表</div> -->
    <div class="table_content">
      <div class="backround">
        <div class="toptitle">
          <div class="item">设备名称</div>
          <!-- <div class="item">设备地址</div> -->
          <div class="item">安装位置</div>
          <div class="item">状态</div>
          <div class="item">更新时间</div>
          <div class="item" v-if="$route.path.indexOf('/dashboard') >= 0">
            操作
          </div>
        </div>
        <!-- <vue-seamless-scroll
          class="seamless-warp"
          :class-option="optionHover"
          :data="deviceList"
        > -->
        <div
          class="table_parent"
          @mouseover="handlemouseOver"
          @mouseleave="handlemouseLeave"
        >
          <table cellpadding="0" cellspacing="0" class="table">
            <tr
              v-for="(item, index) in deviceList"
              :key="index"
              class="table-item"
              :class="
                item.objectId == selectObjectId ? 'table-item-select' : ''
              "
              @click="handleCheckDevice(item)"
            >
              <td class="table-item-content">{{ item.name }}</td>
              <!-- <td class="table-item-content">{{ item.devaddr }}</td> -->
              <td class="table-item-content">
                {{ item.address }}
              </td>
              <td class="table-item-content">
                <el-tag
                  v-if="item.status == 'OFFLINE'"
                  size="medium"
                  type="warning"
                >
                  离线
                </el-tag>
                <el-tag v-else size="medium" type="success">在线</el-tag>
              </td>
              <td class="table-item-content">
                {{ utc2beijing(item.updatedAt) }}
              </td>
              <td
                class="table-item-content"
                v-if="$route.path.indexOf('/dashboard') >= 0"
              >
                <div class="item_btn" @click="handleOpenRealCard(item)">
                  数据
                </div>
              </td>
            </tr>
          </table>
        </div>
        <!-- </vue-seamless-scroll> -->
      </div>
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
    </div>
    <div class="screen_right_bottom">
      <el-pagination
        small
        background
        :current-page="currentPage"
        :pager-count="5"
        @current-change="handlePage"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
      <!-- <div class="previous" @click="handlePage(-1)">&laquo; 上一页</div>
      <div>{{ skip }}/{{ total }}</div>
      <div class="next" @click="handlePage(1)">下一页 &raquo;</div> -->
    </div>
  </div>
</template>

<script>
// 原文链接：https://blog.csdn.net/weixin_55799355/article/details/124740977 自动滚动列表
import { mapGetters } from "vuex";
import avator from "@/assets/bg/avator.png";
import { querycompanyDevice, getDeviceRealCard } from "@/api/Device";
import RealCard from "./commom/RealCard.vue";
import { utc2beijing } from "@/utils/index";
export default {
  name: "ScreenDevice",
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
  components: {
    RealCard,
  },
  data() {
    return {
      isCreated: true,
      avator: avator,
      selectObjectId: "",
      status: false,
      listData: [],
      warnList: [],
      deviceList: [],
      currentPage: 1,
      skip: 0,
      total: 0,
      queryForm: {
        devicename: "",
        statusFlag: false,
        status: "",
        number: "",
        product: "",
        type: "",
        pageNo: 1,
        pageSize: 20,
        searchDate: [],
        limt: 10,
        skip: 0,
        order: "-createdAt",
        keys: "count(*)",
      },
      distance: "",
      timer: {}, //定时器
      cardList: [],
      dialogDeviceVisible: false,
      deviceInfo: {},
    };
  },
  computed: {
    optionHover() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 4, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
    // currentPage() {
    //   return Number(this.skip / 10) + 1;
    // },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    setTimeout(() => {
      this.scroll();
    }, 1000);
  },
  methods: {
    handlePage(e) {
      console.log(e, this.currentPage);
      this.currentPage = e;
      this.skip = (e - 1) * 10;
      this.fetchData();
    },
    handleCheckDevice(item) {
      this.selectObjectId = item.objectId;
      this.$dgiotBus.$emit("device/transmit", item);
      this.$dgiotBus.$emit("device/historylinedata", item);
      this.$dgiotBus.$emit("device/historybardata", item);
    },
    scroll() {
      let _this = this;
      var parent = document.getElementsByClassName("table_parent")[0];
      var child1 = document.getElementsByClassName("table")[0];
      // console.log("滚动", parent.scrollHeight, child1.scrollHeight);
      console.log("盒子高度", parent.clientHeight, child1.scrollHeight);
      // var child2 = document.getElementById("child2");
      // child2.innerHTML = child1.innerHTML;
      if (child1.scrollHeight > parent.clientHeight * 1.5) {
        clearInterval(this.timer);

        this.timer[_this.comp.type] = setInterval(function () {
          if (parent.scrollTop >= child1.scrollHeight) {
            // console.log("滚动", parent.scrollTop, child1.scrollHeight);
            parent.scrollTop = 0;
          } else {
            let item = parent.scrollTop;
            parent.scrollTop++;
            if (item == parent.scrollTop) {
              _this.distance = parent.scrollTop;

              parent.scrollTop = 0;
            }
          }
        }, 20);
      }
    },
    async fetchData() {
      // this.listLoading = true
      let params = {
        skip: this.skip,
        limit: 10,
        // excludeKeys: this.queryForm.excludeKeys,
        // include: this.queryForm.include,
        order: "-updatedAt",
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
        params,
        this.token
      );
      this.total = total;
      list.forEach((item) => {
        item.address =
          item.address == "" || item.address == undefined
            ? "---"
            : item.address;
      });
      if (list.length > 0 && this.isCreated) {
        this.selectObjectId = list[0].objectId;
        this.isCreated = false;
      }
      this.deviceList = list;
      this.total = total;
      this.listLoading = false;
      // 订阅处理所有的设备
      // await this.subAllDevice()
    },
    // 轮播
    handlemouseOver() {
      clearInterval(this.timer[this.comp.type]);
    },
    handlemouseLeave() {
      this.scroll();
    },
    utc2beijing(date) {
      return utc2beijing(date);
    },
    async handleOpenRealCard(deviceInfo) {
      this.deviceInfo = deviceInfo;
      const res = await getDeviceRealCard(deviceInfo.objectId);
      this.cardList = this.renderCard(res.data);
      console.log("thiscardList", this.cardList);
      // let data = {
      //   topic: `$dg/user/realtimecard/${deviceInfo.objectId}/report`,
      // };
      // this.sendTopic(data);
      this.dialogDeviceVisible = true;
      this.$dgiotBus.$off(`$dg/user/realtimecard/${deviceInfo.objectId}`);
      this.$dgiotBus.$on(
        `$dg/user/realtimecard/${deviceInfo.objectId}`,
        (e) => {
          // console.log(e);
          // let receive = e;
          let str = String.fromCharCode.apply(null, new Uint8Array(e));
          let receive = JSON.parse(Base64.decode(str));
          console.log("转化", receive);
          this.cardList = this.renderCard(receive.data);
        }
      );
    },
    handlecloseDevice() {
      console.log("关闭实时数据弹窗");
      this.$emit("initScreen");
    },
    // 数据卡片分类
    renderCard(resData) {
      let array = [];
      resData.forEach((item) => {
        item.devicetype = item.devicetype === "" ? "default" : item.devicetype;
        if (item.devicetype) array.push(item.devicetype);
      });
      array = [...new Set(array)]; //_.uniqBy(array)
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
  },
};
</script>
<style scoped>
/*里面的代码可以根据自己需求去进行更改*/
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 12px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0); */
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /* background: #071753; */
  /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0); */
}
/* ::-webkit-scrollbar-thumb:window-inactive {
background-color: #2472ea;
} */
</style>
<style lang="scss" scoped>
.topoCaltable {
  position: relative;
  width: 100%;
  height: 100%;
  // border: 1px solid #fff;
  // background: url("../../../assets/bg/bg_warning.png") no-repeat;
  background-size: 100% 100%;
  .screen_right_bottom {
    // background: url("../../../assets/bg/bg_title.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 30px;
    margin-top: 10px;
    line-height: 30px;
    padding-left: 10%;
    font-weight: bold;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
    cursor: pointer;
    .previous {
      background-color: #f1f1f1;
      color: black;
      display: inline-block;
      // padding: 8px 16px;
      padding: 0 8px;
    }
    .next {
      margin-left: 10px;
      background-color: #4caf50;
      color: white;
      display: inline-block;
      padding: 0 8px;
      // padding: 8px 16px;
    }
  }
  .table_content {
    // position: absolute;
    width: 96%;
    height: calc(100% - 50px);
    // margin-top: 2px;
    margin-left: 2%;
    // background-color: #0b2266;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    overflow: hidden;
    ::v-deep .toptitle {
      // background-color: #071753;
      width: 99%;
      display: flex;
      // background-color: gainsboro;
      // margin-bottom: 10px;
      border: 0.2px solid #fff;
      // background-color: transparent;
      // color: white;
    }
    .item {
      // width: 25%;
      flex: 1;
      padding: 15px 0;
      // border-right: 2px solid gainsboro;
      text-align: center;
    }
    .backround {
      width: 100%;
      height: 100%;
      margin-top: 6px;
      // background-color: #001833;
    }
    .table_parent {
      height: calc(100% - 50px);
      display: flex;
      overflow-y: scroll;
    }
    .table {
      // height: calc(100% - 50px);
      // display: flex;
      // overflow-y: scroll;
      flex-direction: column;
      width: 100%;
      .table-item-select {
        background-color: #20bfe1 !important;
      }
      .table-item:nth-child(2n) {
        // background-color: #0b1b57;
      }
      .table-item:nth-child(2n + 1) {
        // background-color: #071753;
      }
      .table-item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        // border-bottom: 0.1px solid #ccc;
        // border-top: 0.1px solid #ccc;
        width: 100%;
        cursor: pointer;
        .table-item-content {
          flex: 1;
          height: 100%;
          word-break: break-all;
          // border: 0.1px solid #fff;
          text-align: center;
          padding: 5px;
          .item_btn {
            border: 0.5px solid #fff;
            border-radius: 4px;
          }
          .item_btn:hover {
            background-color: #083e66;
            border: 1px solid #8cdcfe;
          }
        }
      }
    }

    /* 表格内背景颜色 */

    ::v-deep .el-table .tableRowClassName:nth-child(2n) {
      // background-color: #001833 !important;
      // border: 0.1px solid #fff !important;
    }
    ::v-deep .el-table .tableRowClassName:nth-child(2n + 1) {
      // background-color: #08223f !important;
      // border: 0.1px solid #fff !important;
    }
    ::v-deep .el-table {
      border-collapse: collapse;
    }

    // ::v-deep .el-table th,
    // // ::v-deep .el-table tr,
    // ::v-deep .el-table td {
    //   border-collapse: collapse;
    //   color: #fff !important;
    //   // border: 0.2px solid #fff !important;
    //   // border-collapse: collapse !important;
    // }

    // 原文链接：https://blog.csdn.net/weixin_47769562/article/details/119945415
    .seamless-warp {
      overflow: hidden;
      height: 100%;
      -webkit-backface-visibility: hidden;
      -moz-backface-visibility: hidden;
      -ms-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-perspective: 1000;
      -moz-perspective: 1000;
      -ms-perspective: 1000;
      perspective: 1000; /* Other transform properties here */
    }

    // ::v-deep .el-table--enable-row-hover .el-table__body tr:hover {
    //   color: #000 !important;
    // }
    // ::v-deep .el-table .tableRowClassName:hover {
    //   color: #000 !important;
    // }
    ::v-deep .el-table .cell {
      text-align: center;
      color: #fff;
    }
  }
}
</style>

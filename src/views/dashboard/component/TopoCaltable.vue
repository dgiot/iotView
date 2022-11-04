<template>
  <div class="topoCaltable" :style="{ width: '100%', height: '100%' }">
    <div class="screen_right_bottom_top">告警信息列表</div>
    <div class="table_content">
      <div class="backround">
        <div class="toptitle">
          <div class="item">设备编号</div>
          <div class="item">报警时间</div>
          <div class="item">状态</div>
          <div class="item">产品名称</div>
        </div>
        <!-- <vue-seamless-scroll
          class="seamless-warp"
          :class-option="optionHover"
          :data="warnList"
        > -->
        <div
          class="warning_parent"
          @mouseover="handlemouseOver"
          @mouseleave="handlemouseLeave"
        >
          <table cellpadding="0" cellspacing="0" class="table_warning">
            <tr
              v-for="(item, index) in warnList"
              :key="index"
              class="table-item"
            >
              <td class="table-item-content">{{ item.devaddr }}</td>
              <td class="table-item-content">
                {{ utc2beijing(item.createdAt) }}
              </td>
              <td class="table-item-content">
                <el-tag
                  v-if="item.content.alertstatus"
                  size="medium"
                  type="warning"
                >
                  告警产生
                </el-tag>
                <el-tag v-else size="medium" type="success">告警恢复</el-tag>
              </td>
              <td class="table-item-content">{{ item.productname }}</td>
            </tr>
          </table>
        </div>
        <!-- </vue-seamless-scroll> -->
      </div>
    </div>
  </div>
</template>

<script>
// 原文链接：https://blog.csdn.net/weixin_55799355/article/details/124740977 自动滚动列表
import { mapGetters } from "vuex";
import { queryNotification } from "@/api/Notification";
import { utc2beijing } from "@/utils/index";
export default {
  name: "TopoCaltable",
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
  data() {
    return {
      status: false,
      listData: [],
      warnList: [],
      queryPayload: {
        limit: 10,
        order: "-createdAt",
        skip: 0,
        count: "objectId",
      },
      timer: {},
    };
  },
  computed: {
    // ...mapGetters({
    //   _product_count: 'dashboard/_product_count',
    //   _dev_count: 'dashboard/_dev_count', //设备总数
    //   _dev_online_count: 'dashboard/_dev_online_count', //在线
    //   _dev_off_count: 'dashboard/_dev_off_count', //离线
    // }),
    optionHover() {
      return {
        step: 0.5, // 数值越大速度滚动越快
        limitMoveNum: 5, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
      };
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.scroll();
    // id type
    // topic
    // on
  },
  methods: {
    async fetchData(args = {}) {
      // this.$route.query.type
      // if (this.$route.query.productid)
      //   this.queryPayload.where = {
      //     'content._productid': {
      //       $regex: this.$route.query.productid,
      //     },
      //   }
      const { results = [], count = 0 } = await queryNotification(
        this.queryPayload
      );
      console.log("告警列表", results);
      this.warnList = results;
    },
    scroll() {
      let _this = this;
      var parent = document.getElementsByClassName("warning_parent")[0];

      var child1 = document.getElementsByClassName("table_warning")[0];
      // console.log("滚动", parent, parent.scrollTop, child1.scrollHeight);
      // var child2 = document.getElementById("child2");
      // child2.innerHTML = child1.innerHTML;
      clearInterval(this.timer);
      this.timer[_this.comp.id] = setInterval(function () {
        // console.log("滚动", parent.scrollTop, child1.scrollHeight);
        if (parent.scrollTop >= child1.scrollHeight) {
          parent.scrollTop = 0;
        } else {
          // console.log(
          //   "滚动2",
          //   _this.comp.type,
          //   parent.scrollTop,
          //   child1.scrollHeight
          // );
          let item = parent.scrollTop;
          parent.scrollTop++;
          if (item == parent.scrollTop) {
            parent.scrollTop = 0;
          }
        }
      }, 20);
    },
    handlemouseOver() {
      console.log("11111");
      clearInterval(this.timer[this.comp.id]);
    },
    handlemouseLeave() {
      console.log("222");
      this.scroll();
    },
    utc2beijing(date) {
      return utc2beijing(date);
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
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #071753;
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
/* ::-webkit-scrollbar-thumb:window-inactive {
background-color: #2472ea;
} */
</style>
<style lang="scss" scoped>
.topoCaltable {
  background: url("../../../assets/bg/bg_warning.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  .screen_right_bottom_top {
    background: url("../../../assets/bg/bg_title.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-left: 50px;
    font-weight: bold;
    color: #fff;
  }
  .table_content {
    // position: absolute;
    width: 96%;
    height: calc(100% - 50px);
    margin-top: 2px;
    margin-left: 2%;
    background-color: #0b2266;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    overflow: hidden;
    ::v-deep .toptitle {
      background-color: #071753;
      width: 100%;
      display: flex;
      // background-color: gainsboro;
      // margin-bottom: 10px;
      border: 0.2px solid #fff;
      // background-color: transparent;
      // color: white;
    }
    .item {
      width: 25%;
      padding: 15px 0;
      // border-right: 2px solid gainsboro;
      text-align: center;
    }
    .backround {
      width: 100%;
      height: 100%;
      // background-color: #001833;
    }
    .warning_parent {
      height: calc(100% - 50px);
      display: flex;
      overflow-y: scroll;
      width:100%;
    }
    .table_warning {
      height: 80%;
      width: 100%;
      display: flex;
      // overflow-y: auto;
      flex-direction: column;
      // border-left: 0.2px solid #ccc;
      // border-bottom: 0.2px solid #ccc;
      // border-right: 0.2px solid #ccc;
      .table-item:nth-child(2n) {
        background-color: #0b1b57;
      }
      .table-item:nth-child(2n + 1) {
        background-color: #071753;
      }
      .table-item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        // border-bottom: 0.1px solid #ccc;
        // border-top: 0.1px solid #ccc;
        width: 100%;
        // border-bottom: 0.2px solid #fff;
        .table-item-content {
          flex: 1;
          height: 100%;
          // border: 0.1px solid #fff;
          text-align: center;
          padding: 5px;
        }
      }
    }

    /* 表格内背景颜色 */

    ::v-deep .el-table .tableRowClassName:nth-child(2n) {
      background-color: #001833 !important;
      // border: 0.1px solid #fff !important;
    }
    ::v-deep .el-table .tableRowClassName:nth-child(2n + 1) {
      background-color: #08223f !important;
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

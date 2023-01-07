<template>
  <div class="topoCaltable" :style="{ width: '100%', height: '100%' }">
    <div class="screen_right_bottom_top">工单列表</div>
    <div class="table_content">
      <div class="backround">
        <div class="toptitle">
          <div class="item">工单编号</div>
          <div class="item">工单类型</div>
          <div class="item">创建时间</div>
          <div class="item">工单状态</div>
        </div>
        <!-- <vue-seamless-scroll
          class="seamless-warp"
          :class-option="optionHover"
          :data="orderList"
        > -->
        <div
          class="workorder_parent"
          @mouseover="handlemouseOver"
          @mouseleave="handlemouseLeave"
        >
          <table cellpadding="0" cellspacing="0" class="table_workorder">
            <tr
              v-for="(item, index) in orderList"
              :key="index"
              class="table-item"
            >
              <td class="table-item-content">{{ item.number }}</td>
              <td class="table-item-content">{{ item.type }}</td>

              <td class="table-item-content">
                {{ utc2beijing(item.createdAt) }}
              </td>
              <td class="table-item-content">
                <el-tag
                  size="medium"
                  :type="
                    item.status == 0
                      ? 'danger'
                      : item.status == 1
                      ? ''
                      : item.status == 2
                      ? 'success'
                      : 'warning'
                  "
                >
                  {{ getStatus(item.status) }}
                </el-tag>
              </td>
              <!-- <td class="table-item-content">
                <el-tag
                  v-if="item.content.alertstatus"
                  size="medium"
                  type="warning"
                >
                  告警产生
                </el-tag>
                <el-tag v-else size="medium" type="success">告警恢复</el-tag>
              </td> -->
            </tr>
          </table>
        </div>
        <!-- <el-table
            :border="false"
            :cell-style="{ border: '0.2px solid #fff' }"
            :data="listData"
            :highlight-current-row="false"
            row-class-name="tableRowClassName"
            :show-header="status"
          >
            <el-table-column label="日期" prop="date" />
            <el-table-column label="设备" prop="device" />
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.test" size="medium">恢复正常</el-tag>
                <el-tag v-else size="medium" type="warning">发生报警</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="告警内容" prop="title" />
          </el-table> -->
        <!-- </vue-seamless-scroll> -->
      </div>
    </div>
  </div>
</template>

<script>
// 原文链接：https://blog.csdn.net/weixin_55799355/article/details/124740977 自动滚动列表
import { mapGetters } from "vuex";
import { getMaintenance } from "@/api/Maintenance";
import { utc2beijing } from "@/utils/index";
export default {
  name: "WorkOrder",
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
      orderList: [],
      queryPayload: {
        limit: 10,
        order: "-createdAt",
        skip: 0,
        count: "objectId",
      },
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
      timer: {},
      distance: "",
    };
  },
  computed: {},
  mounted() {
    this.fetchData();
    this.scroll();
  },
  methods: {
    async fetchData(args = {}) {
      if (!args.limit) {
        args = this.queryForm;
      }
      this.listLoading = false;
      // const loading = this.$baseColorfullLoading()
      let params = {
        limit: 10,
        order: "-createdAt",
        skip: 0,
        count: "objectId",
        where: {
          user: this.objectid,
          status: {
            $lt: 3,
          },
        },
      };
      // if (String(this.queryForm.status + '').length > 0) {
      //   params.where['status'] = this.queryForm.status
      // }
      // this.queryForm.number
      //   ? (params.where.number = { $regex: this.queryForm.number })
      //   : ''
      // this.queryForm.product
      //   ? (params.where['product'] = this.queryForm.product)
      //   : ''
      // this.queryForm.type
      //   ? (params.where.type = { $regex: this.queryForm.type })
      //   : ''
      // if (this.queryForm.searchDate?.length) {
      //   params.where['info.startdata'] = {
      //     $gt: new Date(this.queryForm.searchDate[0]).getTime(),
      //   }
      //   params.where['info.completiondata'] = {
      //     $lt: new Date(this.queryForm.searchDate[1]).getTime(),
      //   }
      // }
      await getMaintenance(params)
        .then((res) => {
          const { results = [], count = 0 } = res;
          // console.log("工单", results);
          this.orderList = results;
          this.total = count;
          // loading.close()
        })
        .catch((e) => {
          this.$baseMessage(e, "error", "dgiot-hey-message-error");
          // loading.close()
        });
    },
    getStatus(type = 0) {
      // type == 0 ? '' : ''
      switch (type) {
        case 0:
          return "待接收"; //待接收
          break;
        case 1:
          return "处理中"; //处理中
          break;
        case 2:
          return "已处理"; //已处理
          break;
        case 3:
          return "已回退"; //已回退
          break;
        default:
          return type;
      }
    },
    scroll() {
      let _this = this;
      var parent = document.getElementsByClassName("workorder_parent")[0];

      var child1 = document.getElementsByClassName("table_workorder")[0];
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
            _this.distance = parent.scrollTop;
            // console.log("差距", _this.distance);
            if (_this.distance < 20) {
              clearInterval(_this.timer[_this.comp.id]);
            }
            parent.scrollTop = 0;
          }
        }
      }, 20);
    },
    handlemouseOver() {
      // console.log("11111");
      clearInterval(this.timer[this.comp.id]);
    },
    handlemouseLeave() {
      // console.log("222");
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
  /* background: #071753; */
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
/* ::-webkit-scrollbar-thumb:window-inactive {
background-color: #2472ea;
} */
</style>
<style lang="scss" scoped>
.topoCaltable {
  font-size: 1em;
  // border: 1px solid #fff;
  // background: url("../../../assets/bg/bg_warning.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  .screen_right_bottom_top {
    // background: url("../../../assets/bg/bg_title.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-left: 10%;
    font-weight: bold;
    color: #fff;
  }
  .table_content {
    // position: absolute;
    width: 96%;
    height: calc(100% - 50px);
    // margin-top: 35px;
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
      width: 98.5%;
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
    .workorder_parent {
      height: calc(100% - 50px);
      display: flex;
      overflow-y: scroll;
      width: 100%;
    }
    .table_workorder {
      // height: 80%;
      width: 100%;
      display: flex;
      // overflow-y: auto;
      flex-direction: column;
      // border-left: 0.2px solid #ccc;
      // border-bottom: 0.2px solid #ccc;
      // border-right: 0.2px solid #ccc;
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
        // border-bottom: 0.2px solid #fff;
        .table-item-content {
          flex: 1;
          height: 100%;
          word-break: break-all;
          // border: 0.1px solid #fff;
          text-align: center;
          padding: 5px;
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

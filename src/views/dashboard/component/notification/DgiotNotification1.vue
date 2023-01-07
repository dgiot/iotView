<template>
  <div class="dgiotnotification1" :style="{ width: '100%', height: '100%' }">
    <div
      class="noti_wrap"
      @mouseover="handlemouseOver"
      @mouseleave="handlemouseLeave"
    >
      <div class="noti_wrap1">
        <div
          class="noti_wrap_item"
          v-for="(item, index) in warnList"
          :key="index"
        >
          <div class="noti_wrap_item_content">
            报警信息:<span :class="item.status == 0 ? 'warning' : 'success'"
              >&nbsp;&nbsp;{{ item.content.alarm_message }}</span
            >
          </div>
          <div class="noti_wrap_item_content">
            报警时间:&nbsp;&nbsp; {{ utc2beijing(item.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotification } from "@/api/Notification";
import { utc2beijing } from "@/utils/index";
export default {
  name: "DgiotNotification1",
  props: {
    comp: {
      type: Object,
      default: () => ({
        type: "line",
        width: 400,
        hieght: 72,
      }),
    },
    selectdevice: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      warnList: [],
      queryData: {
        skip: 0,
        limit: 10,
        count: "objectId",
        order: "-createdAt",
        where: {},
      },
      timer: {},
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.scroll();
  },
  methods: {
    async fetchData(args = {}) {
      if (this.selectdevice.objectId) {
        this.queryData.where[`content._deviceid`] = {
          $regex: this.selectdevice.objectId,
        };
      }
      const res = await getNotification(this.queryData);
      res.results.forEach((element) => {
        element.devicename =
          element.devicename || element.content?.devicename || "";
        element.desc = element.desc || element.content?.errorname || "";
      });
      this.warnList = res.results;
    },
    scroll() {
      let _this = this;
      var parent = document.getElementsByClassName("noti_wrap")[0];
      var child1 = document.getElementsByClassName("noti_wrap1")[0];
      clearInterval(this.timer[_this.comp.id]);
      this.timer[_this.comp.id] = setInterval(function () {
        if (parent.scrollTop >= child1.scrollHeight) {
          parent.scrollTop = 0;
        } else {
          let item = parent.scrollTop;
          parent.scrollTop++;
          if (item == parent.scrollTop) {
            _this.distance = parent.scrollTop;
            parent.scrollTop = 0;
          }
        }
      }, 50);
    },
    // 轮播
    handlemouseOver() {
      clearInterval(this.timer[this.comp.id]);
    },
    handlemouseLeave() {
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
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
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
.dgiotnotification1 {
  .noti_wrap {
    height: calc(100% - 1px);
    // display: flex;
    overflow-y: scroll;
    width: 100%;
    .noti_wrap_item {
      margin-top: 10px;
      .noti_wrap_item_content {
        padding-left: 30px;
        padding-top: 6px;
        color: #fff;
        .warning {
          color: #ff6666;
        }
        .success {
          color: #5bc648;
        }
      }
    }
  }
}
</style>

<template>
  <div class="topoLine" :style="{ width: '100%', height: '100%' }">
    <div class="title">历史数据</div>
    <div class="line_top">
      <select
        class="select_time"
        name="public-choice"
        v-model="couponSelected"
        @change="getCouponSelected($event)"
      >
        <option
          class="select_option"
          :value="option.value"
          :key="option.id"
          v-for="option in selecttime"
        >
          {{ option.name }}
        </option>
      </select>
    </div>
    <div class="line_name">
      {{ selectItem.name }}
    </div>
    <div class="line_content">
      <ve-line
        :data="chartData"
        :extend="extend"
        height="100%"
        :settings="chartSettings"
        width="100%"
      />
      <!-- <ve-bar
        :data="chartData"
        :extend="extend"
        height="100%"
        :settings="chartSettings"
        width="100%"
      /> -->
    </div>
  </div>
</template>

<script>
import { querycompanyDevice, getEchart } from "@/api/Device/index";
export default {
  name: "ScreenLine",
  props: {
    comp: {
      type: Object,
      default: () => ({
        type: "line",
        width: 200,
        hieght: 120,
      }),
    },
    viewtype: {
      type: String,
      default: () => "",
    },
    selectdevice: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.chartSettings = {
      labelAlias: {
        PV: "访问用户",
        Order: "下单用户",
      },
    };
    this.extend = {
      series: {
        type: "line",
        showAllSymbol: true,
        symbol: "none", //去掉圆点
        smooth: true,

        // center: ['50%', '50%'],
        itemStyle: {
          borderRadius: 2,
          borderColor: "#fff",
          borderWidth: 1,
        },
      },
      legend: {
        textStyle: {
          color: "#fff",
        },
      },
      xAxis: {
        nameTextStyle: {
          color: "#fff",
        },
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
      },
      yAxis: {
        show: true,
        axisLine: {
          lineStyle: {
            color: "#ccc",
          },
          textStyle: {
            color: "#fff",
          },
        },
        axisLabel: {
          color: "#fff",
        },
      },
      grid: {
        left: 10,
        right: 0,
        bottom: 0,
        width: "96%",
        height: "80%",
      },
      dataZoom: [
        {
          type: "inside", //允许鼠标滚动缩放数据,数据为动态时关闭
        },
      ],
    };
    return {
      couponSelected: "h",
      chartData: {
        columns: [],
        rows: [],
      },
      timer: "",
      selecttime: [
        { value: "s", name: "1天", id: "10000001" },
        { value: "m", name: "7天", id: "10000002" },
        { value: "h", name: "30天", id: "10000004" },
        { value: "w", name: "365天", id: "10000005" },
      ],
      queryData: {},
      selectItem: {},
    };
  },
  async mounted() {
    let params = {
      skip: 0,
      limit: 5,
      order: "-updatedAt",
      count: "objectId",
      where: {},
    };
    try {
      if (this.viewtype == "Dashboard") {
        const res = await querycompanyDevice(params);
        console.log("历史数据", res);
        if (res.results && res.results.length >= 1) {
          this.selectItem = res.results[0];
          this.getHistoryData(this.couponSelected);
        }
      } else {
        this.selectItem = this.selectdevice;
        this.getHistoryData(this.couponSelected);
      }
    } catch (error) {}
    this.$dgiotBus.$off("device/historylinedata");
    this.$dgiotBus.$on("device/historylinedata", (item) => {
      console.log("接受", item);
      this.selectItem = item;
      this.getHistoryData(this.couponSelected);
    });
  },
  methods: {
    getDay(type) {
      switch (type) {
        case "s":
          return 1;
        case "m":
          return 7;
        case "h":
          return 30;
        case "w":
          return 365;
      }
    },
    getCouponSelected(event) {
      console.log(event.target.value);
      let time = event.target.value;
      console.log(this.couponSelected);
      this.getHistoryData(this.couponSelected);
    },
    async getHistoryData(type) {
      let day = this.getDay(type);
      let data = {
        starttime: new Date().getTime() - 60 * 60 * 1000 * 24 * day,
        endtime: new Date().getTime(),
        interval: "1" + type,
        keys: "*",
        limit: 100,
        function: "last",
        style: "line",
      };
      await getEchart(this.selectItem.objectId, data).then((res) => {
        if (res?.chartData?.rows.length > 0) {
          const { chartData = {} } = res;
          this.chartData = chartData;
        } else {
          this.chartData = {
            columns: [],
            rows: [],
          };
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
select {
  border: none !important;
  outline: none;
}
.topoLine {
  // background: url("../../../assets/bg/bg_warning.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  .title {
    position: absolute;
    top: 1px;
    left: 50%;
    font-size: 1.25em;
    color: #fff;
    transform: translateX(-50%);
  }
  .line_top {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 2px;
    .select_time {
      // position: absolute;
      // right: 20px;
      // top: 20px;
      width: 70px;
      height: 30px;
      border-radius: 4px;
      border: 0.5px solid #0f1428;
      // background-color: #173e56;
      background: -webkit-linear-gradient(left, #111 0%, #000 80%);
      color: #fff;
      .select_option {
        background-color: #0f1428;
        color: #fff;
        width: 60px;
        font-size: 0.625em !important;
      }
    }
  }
  .line_name {
    width: 100%;
    height: 20px;
    padding-left: 5px;
    color: #fff;
    font-weight: bold;
  }
  .line_content {
    height: calc(100% - 60px);
  }
}
</style>

<template>
  <div class="topoBar" :style="{ width: '100%', height: '100%' }">
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
      <ve-histogram
        :data="chartData"
        :extend="extend"
        height="100%"
        :settings="chartSettings"
        width="100%"
      />
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
    this.chartSettings = {};
    this.extend = {
      series: {
        type: "bar",
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
        type: "category",
        show: true,
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
      },
      yAxis: {
        type: "value",
        // axisLabel: {
        //   formatter: "{value} %",
        // },
        axisLabel: {
          color: "#fff",
        },
      },
      // {
      //   // type: "value",
      //   show: true,
      //   axisLine: {
      //     lineStyle: {
      //       color: "#ccc",
      //     },
      //     textStyle: {
      //       color: "#fff",
      //     },
      //   },

      // },
      grid: {
        left: 10,
        right: 0,
        width: "90%",
        height: "75%",
      },
      dataZoom: [
        {
          type: "inside",//允许鼠标滚动缩放数据,数据为动态时关闭
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
      limit: 10,
      order: "-createdAt",
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
    this.$dgiotBus.$off("device/historybardata");
    this.$dgiotBus.$on("device/historybardata", (item) => {
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
          break;
        case "m":
          return 7;
          break;
        case "h":
          return 30;
          break;
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
          // this.$nextTick(() => {
          //   setTimeout(() => {
          //     this.loading = true
          //     this.toggleChart('line')
          //   }, 1000)
          // })
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
.topoBar {
  background: url("../../../assets/bg/bg_warning.png") no-repeat;
  background-size: 100% 100%;
  .line_top {
    width: 100%;
    height: 40px;
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
        font-size: 10px !important;
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

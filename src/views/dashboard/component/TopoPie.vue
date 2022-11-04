<template>
  <div
    class="topoPie"
    :style="{
      width: comp.width + 'px',
      height: comp.height + 'px',
    }"
  >
    <div class="screen_right_bottom_top">设备开关状况</div>
    <ve-pie
      :data="chartData"
      :extend="extend"
      height="100%"
      :settings="chartSettings"
      width="100%"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
// import { getCardDevice, getDabDevice, getDevice } from '@/api/Device/index.js'
// import { simpleDataConverter } from 'v-charts-v2/lib/converter'
export default {
  name: "TopoPie",
  props: {
    comp: {
      type: Object,
      default: () => ({
        type: "line",
        width: 200,
        hieght: 120,
      }),
    },
  },
  data() {
    this.chartSettings = {
      type: "pie",
      // radius: comp.width * 0.4,
      // labelAlias: {
      //   PV: '访问用户',
      //   Order: '下单用户',
      // },
    };

    this.extend = {
      series: {
        type: "pie",
        radius: ["20%", "50%"],
        center: ["50%", "50%"],
        itemStyle: {
          borderRadius: 2,
          borderColor: "#fff",
          borderWidth: 1,
        },
        // left: 10,
        // right: 0,
        // top: '-30%',
        // offsetY: 10,
        // showAllSymbol: true,
        // symbol: 'none', //去掉圆点
        // smooth: true,
      },
      legend: {
        textStyle: {
          color: "#fff",
        },
      },
      xAxis: {
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
      },
      // grid: {
      //   left: 10,
      //   right: 0,
      //   top: 0,
      //   width: '96%',
      //   height: '90%',
      // },
    };
    return {
      top: 10,
      chartData: {
        columns: ["名称", "数量"],
        rows: [
          { 名称: "产品", 数量: 8 },
          { 名称: "设备", 数量: 0 },
          { 名称: "告警数", 数量: 15 },
        ],
      },
      timer: "",
    };
  },
  computed: {
    ...mapGetters([
      "_dev_online_count", //在线
      "_dev_off_count", //离线
    ]),
  },
  watch: {
    // _dev_online_count: {
    //   handler: function (newVal) {
    //     // console.log('这是在线数量', newVal)
    //     this.chartData.rows[0]["数量"] = newVal;
    //   },
    //   deep: true,
    //   limit: true,
    // },
    // _dev_off_count: {
    //   handler: function (newVal) {
    //     // console.log('这是离线数量', newVal)
    //     this.chartData.rows[1]["数量"] = newVal;
    //   },
    //   deep: true,
    //   limit: true,
    // },
  },
  created() {
    this.chartData = {
      columns: ["名称", "数量"],
      rows: [
        { 名称: "开机数", 数量: 0 },
        { 名称: "关机数", 数量: 0 },
      ],
    };
    // this.top = 100 - this.comp.height * 0.1
  },
  mounted() {
    this.topic = `/${this.comp.type}/${this.comp.id}/report`;
    console.log(this.topic);
    //  this.$dgiotBus.$off(this.topic);
    this.$dgiotBus.$off(this.topic);
    this.$dgiotBus.$on(this.topic, (e) => {
      // console.log("11111");
      let str = String.fromCharCode.apply(null, new Uint8Array(e));

      let receive = JSON.parse(Base64.decode(str));
      console.log("接收到了数据", receive);
      // this.value = e;
      this.chartData = receive;
      // this.receive.lable = receive.lable;
      this.text = receive.lable;
      this.value = receive.value;
    });
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    async queryChart(deviceid) {
      let endtime = new Date().getTime();
      let starttime = endtime - 1000 * 60 * 60 * 24 * 7;
      let params = {
        starttime: starttime,
        endtime: endtime,
        interval: "30m",
        keys: "*",
        limit: 50,
        function: "last",
        style: "line",
      };
      await getDabDevice(deviceid, params)
        .then((res) => {
          // this.$baseColorfullLoading().close()
          console.log(res, "res charts");
          if (res?.chartData?.rows.length > 0) {
            const { chartData = {} } = res;
            this.chartData = chartData;
            this.$nextTick(() => {
              setTimeout(() => {
                this.loading = true;
                this.toggleChart("line");
              }, 1000);
            });
          }
          console.log("this.chartData", this.chartData);
          this.loading = false;
          this.dataEmpty = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
          // this.$baseColorfullLoading().close()
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.topoPie {
  background: url("../../../assets/bg/bg_warning.png") no-repeat;
  background-size: 100% 100%;
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
}
</style>

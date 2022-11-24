<template>
  <div class="screenheadcount" :style="{ width: '100%', height: '100%' }">
    <!-- 11111 -->
    <div class="count_item" v-for="(item, index) in countlist" :key="index">
      <div class="count_item_head">
        <div class="count_item_head_left">
          <div style="font-size: 1.5em">{{ item.name }}</div>
          <div style="font-size: 5em">{{ item.number }}</div>
        </div>
        <div class="count_item_head_right">
          <!-- :format="format(item)" -->
          <el-progress type="circle" :percentage="item.percent" ></el-progress>
        </div>
      </div>
      <div class="count_item_foot">
        <div class="count_item_foot_left">
          <div style="width: 50%">
            <span class="circle success"></span>&nbsp;
            <span>{{ item.finename }}</span>
          </div>
          <div>{{ item.finenumber }}</div>
        </div>
        <div class="count_item_foot_center"></div>
        <div class="count_item_foot_right">
          <div style="width: 50%">
            <span class="circle warning"></span> &nbsp;
            <span>{{ item.badname }}</span>
          </div>
          <div>{{ item.badnumber }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScreenHeadcount",
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
      countlist: [
        {
          name: "产品数量",
          number: 20,
          finename: "正常",
          finenumber: 20,
          badname: "停用",
          badnumber: 0,
        },
        {
          name: "设备数量",
          number: 20,
          finename: "在线",
          finenumber: 15,
          badname: "离线",
          badnumber: 5,
        },
        {
          name: "告警数量",
          number: 35,
          finename: "已处理",
          finenumber: 27,
          badname: "未处理",
          badnumber: 8,
        },
        {
          name: "工单数量",
          number: 18,
          finename: "已处理",
          finenumber: 15,
          badname: "未处理",
          badnumber: 3,
        },
      ],
    };
  },
  created() {
    this.countlist.forEach((item) => {
      item.percent = Number(((item.finenumber / item.number) * 100).toFixed(1));
      // console.log("item.percent", item.percent);
    });
  },
  mounted() {},
  methods:{
    // format(item){
    //   console.log('item',item);
    //   return `${item.percent}%${item.finename}`
    // }
  }
};
</script>
<style lang="scss" scoped>
.screenheadcount {
  display: flex;
  .count_item:nth-child(n + 2) {
    margin-left: 2%;
  }
  .count_item {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1%;
    box-shadow: 1px 1px 2px 1px #ccc;
    .count_item_head {
      flex: 5;
      display: flex;
      // background-color: #dbf4ff;
      .count_item_head_left {
        flex: 3;
      }
      .count_item_head_right {
        flex: 2;
      }
    }
    .count_item_foot {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      // background-color: #ccc;
      padding: 0 10px;
      .count_item_foot_left {
        flex: 1;
        display: flex;
        // justify-content: space-between;
      }
      .count_item_foot_center {
        flex: 1;
        // display: flex;
        // justify-content: space-between;
      }
      .count_item_foot_right {
        flex: 1;
        display: flex;
        // justify-content: space-between;
      }
    }
    .circle {
      display: inline-block;
      margin-top: 1px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .success {
      background-color: #12ae7b;
    }
    .warning {
      background-color: #ff0000;
    }
  }
}
</style>

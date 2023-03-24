<template>
  <div class="screenheaditem" :style="{ width: '100%', height: '100%' }">
    <!-- 11111 -->
    <div
      :style="{ color: comp.color || '#fff' }"
      class="count_item"
      @click="handleTo"
    >
      <div class="count_item_head">
        <div class="count_item_head_left">
          <div style="font-size: 1.5em">{{ item.name }}</div>
          <div style="font-size: 5em">{{ item.number }}</div>
        </div>
        <div class="count_item_head_right">
          <!-- :format="format(item)" -->
          <el-progress
            :color="comp.color || '#409eff'"
            type="circle"
            :stroke-width="10"
            :percentage="item.percent"
          ></el-progress>
        </div>
      </div>
      <div class="count_item_foot">
        <div class="count_item_foot_left">
          <div style="width: 100%">
            <span class="circle success"></span>&nbsp;
            <span>{{ item.finename }}</span>
          </div>
          <div>{{ item.finenumber }}</div>
        </div>
        <div class="count_item_foot_center"></div>
        <div class="count_item_foot_right">
          <div style="width: 100%">
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
import { querycompanyDevice } from "@/api/Device";
import { queryProduct } from "@/api/Product";
import { getNotification } from "@/api/Notification"; // 告警
import { getMaintenance } from "@/api/Maintenance"; //工单
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
      item: {
        name: "产品数量",
        number: 0,
        finename: "正常",
        finenumber: 0,
        badname: "停用",
        badnumber: 0,
      },
    };
  },
  async created() {
    console.log("comp", this.comp);
    if (this.comp.id == "product_count") {
      this.item.name = "产品数量";
      this.item.finename = "正常";
      this.item.badname = "停用";
      this.queryProduct();
    } else if (this.comp.id == "device_count") {
      this.item.name = "设备数量";
      this.item.finename = "在线";
      this.item.badname = "离线";
      this.queryDevice();
    } else if (this.comp.id == "warning_count") {
      this.item.name = "告警数量";
      this.item.finename = "已处理";
      this.item.badname = "未处理";
      this.queryNotification();
    } else if (this.comp.id == "order_count") {
      this.item.name = "工单数量";
      this.item.finename = "已处理";
      this.item.badname = "未处理";
      this.getMaintenance();
    }
    // this.countlist.forEach((item) => {

    // console.log("item.percent", item.percent);
    // });
  },
  mounted() {},
  methods: {
    // 跳转页面
    handleTo() {
      if (this.comp.text)
        this.$router.push({
          path: this.comp.text,
        });
    },
    async getMaintenance() {
      let params = {
        skip: 0,
        // excludeKeys: this.queryForm.excludeKeys,
        // include: this.queryForm.include,
        order: "-createdAt",
        count: "objectId",
        where: {},
      };
      const { results, count } = await getMaintenance(params);
      this.item.number = count;
      let finenumber = 0,
        badnumber = 0;
      results.forEach((element) => {
        if (element.status == "2") {
          finenumber++;
        } else {
          badnumber++;
        }
      });
      this.item.finenumber = finenumber;
      this.item.badnumber = badnumber;
      this.item.percent =
        this.item.number > 0
          ? Number(((this.item.finenumber / this.item.number) * 100).toFixed(1))
          : 0;
    },

    async queryNotification() {
      let params = {
        skip: 0,
        // excludeKeys: this.queryForm.excludeKeys,
        // include: this.queryForm.include,
        order: "-createdAt",
        count: "objectId",
        where: {},
      };
      let { results, count } = await getNotification(params);
      this.item.number = count;
      let finenumber = 0,
        badnumber = 0;
      results.forEach((element) => {
        if (element.status == "0") {
          badnumber++;
        } else {
          finenumber++;
        }
      });
      this.item.finenumber = finenumber;
      this.item.badnumber = badnumber;
      this.item.percent =
        this.item.number > 0
          ? Number(((this.item.finenumber / this.item.number) * 100).toFixed(1))
          : 0;
    },

    async queryProduct() {
      let params = {
        skip: 0,
        // excludeKeys: this.queryForm.excludeKeys,
        // include: this.queryForm.include,
        order: "-createdAt",
        count: "objectId",
        where: {},
      };
      const { results, count } = await queryProduct(params);
      this.item.number = count;
      this.item.finenumber = count;
      this.item.percent =
        this.item.number > 0
          ? Number(((this.item.finenumber / this.item.number) * 100).toFixed(1))
          : 0;
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
      const { results, count } = await querycompanyDevice(params);
      this.item.number = count;
      let finenumber = 0,
        badnumber = 0;
      results.forEach((element) => {
        if (element.status == "ONLINE") {
          finenumber++;
        } else {
          badnumber++;
        }
      });
      this.item.finenumber = finenumber;
      this.item.badnumber = badnumber;
      this.item.percent =
        this.item.number > 0
          ? Number(((this.item.finenumber / this.item.number) * 100).toFixed(1))
          : 0;
    },
    // format(item){
    //   console.log('item',item);
    //   return `${item.percent}%${item.finename}`
    // }
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-progress__text {
    color: #fff !important;
  }
  .el-progress-circle {
    width: 8em !important;
    height: 8em !important;
  }
}
.screenheaditem {
  display: flex;
  // .count_item:nth-child(n + 2) {
  //   margin-left: 2%;
  // }
  .count_item {
    // text-shadow: 1px 1px 1px #fff;
    // color: #52c7fd;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 4%;
    box-shadow: 1px 1px 2px 1px #ccc;
    .count_item_head {
      flex: 4;
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
      font-size: 0.9em;
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

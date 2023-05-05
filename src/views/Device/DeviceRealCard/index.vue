<template>
  <div ref="custom-table" v-loading="loading" class="index-container">
    <div v-show="dialog" v-if="dialog" class="dialog_wrap">
      <!-- 设备组态 -->
      <div
        style="
          text-align: center;
          font-weight: 600;
          line-height: 40px;
          font-size: 26px;
        "
      >
        {{ deviceInfo.name }}
      </div>
      <real-card :cardList="cardList" :height="height" :avator="avator" />
    </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import avator from "@/assets/bg/avator.png";
import RealCard from "@/views/dashboard/component/commom/RealCard.vue";
import { getDeviceRealCard } from "@/api/Device/index";
import { getDevice } from "@/api/Device/index";
export default {
  name: "DeviceRealCard",
  props: {},
  components: {
    RealCard,
  },
  data() {
    return {
      objectId: "",
      dialog: false,
      loading: true,
      deviceInfo: {}, //查询条件
      avator: avator,
      cardList: [],
      height: "800px",
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 600,
        group: "description",
      };
    },
  },
  watch: {},
  async created() {
    console.log("document.body.clientHeight", document.body.clientHeight);
    this.height = document.body.clientHeight * 0.86 + "px";
    this.$store.dispatch("settings/changeSetting", {
      key: "treeFlag",
      value: true,
    });
    // console.log('创建111111');
    // this.isPC = this.$ispc()
    // this.fetchProduct()
    // this.fetchData()
    // console.log('是否是pc端', this.$ispc())
  },
  async mounted() {
    localStorage.setItem("classtype","Product")
    this.objectId = localStorage.getItem("parse_deviceid") || "";
    if (this.objectId == "") {
      this.$message("请选择设备");
      return;
    }
    let deviceInfo = await getDevice(this.objectId);
    this.deviceInfo = deviceInfo;
    const res = await getDeviceRealCard(this.objectId);
    this.cardList = this.renderCard(res.data);
    // console.log(res);
    this.loading = false;
    this.dialog = true;
    window.onresize = () => {
      return (() => {
        this.height = document.body.clientHeight * 0.86 + "px";
      })();
    };
    this.$dgiotBus.$off("$dg/user/realtimecard");
    this.$dgiotBus.$on("$dg/user/realtimecard", (e) => {
      // console.log(e);
      // let receive = e;
      let str = String.fromCharCode.apply(null, new Uint8Array(e));
      let receive = JSON.parse(Base64.decode(str));
      console.log("转化", receive);
      this.cardList = this.renderCard(receive.data);
    });
  },
  methods: {
    renderCard(resData) {
      let array = [];
      resData.forEach((item) => {
        item.devicetype = item.devicetype === "" ? "default" : item.devicetype;
        if (item.devicetype) array.push(item.devicetype);
      });
      array = [...new Set(array)]; //_.uniqBy(array)
      // console.log("类别", array);
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
  destroyed() {},
};
</script>
<style>
/* th{
    background-color: #133950 !important;
    color: #fff  !important;
} */
</style>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: 85vh;
  box-sizing: border-box;
  .dialog_wrap {
    height: 100%;
    // width: 100%;
    padding-bottom: 1%;
    position: relative;
    .wrap_konva {
      margin: 4% auto 0 auto;
    }
    // overflow: scroll;
  }
}
.evidence_body {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .evidence_header {
    height: 50px;
  }
  .evidence_container {
    height: calc(100% - 50px);
  }
}

::v-deep {
  .el-header {
    background-color: #027be3;
    display: flex;
    align-items: center;
  }
  .el-dialog__body {
    padding: 0 !important;
    height: 100%;
  }
}
</style>

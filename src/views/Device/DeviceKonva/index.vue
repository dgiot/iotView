<template>
  <div
    ref="custom-table"
    v-loading="loading"
    class="index-container"
  >
    <div
      v-show="dialog"
      v-if="dialog"
      class="dialog_wrap"
    >
      <!-- 设备组态 -->
      <h2 style="text-align: center; font-weight: 600">
        {{ deviceInfo.name }}
      </h2>
      <topo-device class="wrap_konva" :deviceInfo="deviceInfo" />
      <!-- <dgiot-amis modal-append-to-body :schema="viewData" :show-help="false" /> -->
    </div>
  </div>
</template>

<script>
import TopoDevice from "@/views/CloudOc/AmisPage/component/TopoDevice.vue";
import { getDevice } from "@/api/Device/index";
export default {
  name: "DeviceKonva",
  props: {},
  components: {
    TopoDevice,
  },
  data() {
    return {
      objectId: "",
      dialog: false,
      loading: true,
      deviceInfo: {}, //查询条件
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
    this.objectId = localStorage.getItem("parse_deviceid") || "";
    if (this.objectId == "") {
      this.$message("请选择设备");
      return;
    }
    const res = await getDevice(this.objectId);
    this.deviceInfo = res;
    console.log(res);
    this.loading = false;
    this.dialog = true;
  },
  methods: {
   
  },
  destroyed() {},
};
</script>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: 90vh;
  box-sizing: border-box;
  .dialog_wrap {
    height: calc(100%);
    overflow-y: scroll;
    overflow-x: scroll;
    width: 100%;
    padding-bottom: 1%;
    position: relative;
    .wrap_konva {
      margin: 2% auto 0 auto;
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

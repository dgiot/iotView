<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:43
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:43
* @Description:
* @FilePath: src\views\CloudOc\MetaData\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
https://www.dgiotcloud.cn/wp-content/uploads/2022102808590871.png
-->
<template>
  <div ref="custom-table" v-loading="loading" class="index-container">
    <div v-show="dialog" v-if="dialog" class="dialog_wrap">
      <!-- <amis :schema="viewData" /> -->
      <amis
        v-if="dialog"
        modal-append-to-body
        :schema="viewData"
        :show-help="false"
      />
      <!-- <dgiot-amis modal-append-to-body :schema="viewData" :show-help="false" /> -->
    </div>
    <!-- 检测 -->
    <el-dialog
      class="topo_wrap"
      :title="receiceEvidence.name"
      :fullscreen="true"
      :append-to-body="true"
      @close="handlecloseEvidence"
      :visible.sync="dialogEvidenceVisible"
      v-if="dialogEvidenceVisible"
    >
      <div class="evidence_body">
        <el-header class="evidence_header">
          <el-row class="evidence_header_row" :gutter="24">
            <el-col :lg="1" :md="1" :sm="1" title="检测详情" :xl="1" :xs="1">
              <el-button
                round
                size="mini"
                type="success"
                @click.native="asideShow = !asideShow"
              >
                检测详情
              </el-button>
            </el-col>
          </el-row>
        </el-header>
        <topo-evicence
          class="evidence_container"
          v-if="dialogEvidenceVisible"
          :deviceInfo="receiceEvidence"
          :query="query"
          :asideShow="asideShow"
          @reloadCurrent="reloadCurrent"
        />
      </div>
    </el-dialog>
    <!-- 设备组态 -->
    <div class="topo_wrap" v-if="dialogTopoVisible">
      <div class="topo_contentwrap">
        <div class="topo_title_top">
          <div>{{ deviceInfo.name }}</div>
          <span style="cursor: pointer" @click="closeTopo">x</span>
        </div>
        <topo-device :deviceInfo="deviceInfo" />
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import Amis from "@/components/Amis/index.vue";
import TopoEvicence from "./component/TopoEvicence.vue";
import TopoDevice from "./component/TopoDevice.vue";
// import DgiotAmis from "@/components/DgiotAmis/index.vue"
import { getView } from "@/api/View/index";
export default {
  name: "AmisPage",
  props: {},
  components: {
    // DgiotAmis:DgiotAmis,
    amis: Amis,
    TopoEvicence,
    TopoDevice,
  },
  data() {
    return {
      commandInfo: {
        dialog: false,
      },
      dialog: false,
      loading: true,
      viewData: {},
      dialogEvidenceVisible: false,
      receiceEvidence: {},
      query: {}, //查询条件
      asideShow: true, //侧边页数
      dialogTopoVisible: false,
      // schema:{},
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 600,
        group: "description",
      };
    },
    finallyColumns() {
      return this.columns.filter((item) => this.checkList.includes(item.label));
    },
  },
  watch: {},
  async created() {
    // console.log('创建111111');
    // this.isPC = this.$ispc()
    // this.fetchProduct()
    // this.fetchData()
    // console.log('是否是pc端', this.$ispc())
  },
  async mounted() {
    let viewid = location.hash.split("/")[location.hash.split("/").length - 1];
    const { data = {} } = await getView(viewid);
    this.viewData = data;
    console.log("view表单", data);
    if (JSON.stringify(this.viewData) != "{}") {
      this.dialog = true;
      this.loading = false;
    } else {
      this.$baseMessage(
        "未找到该低代码模板",
        "info",
        "dgiot-hey-message-error"
      );
    }
    // 设备组态
    this.$dgiotBus.$off("review/deviceTopo");
    this.$dgiotBus.$on("review/deviceTopo", (e) => {
      console.log(e);
      this.deviceInfo = e;
      this.dialogTopoVisible = true;
    });
    // 证据检测
    this.$dgiotBus.$off("collect/evidence");
    this.$dgiotBus.$on("collect/evidence", (e) => {
      this.receiceEvidence = e;
      e.profile.step =
        e.profile.step == -1 ? 1 : e.profile.step == 2 ? 3 : e.profile.step;
      let query = {
        taskid: e.objectId,
        suite: 0,
        state: "preview",
        step: e.profile?.step,
        back: e.profile?.step,
        message: e.profile?.message,
      };
      console.log("接收的证据消息", e, query);
      this.query = query;
      this.dialogEvidenceVisible = true;
    });
    // E:\work\project\doc\dgiot_doc\i18n\zh-cn\docusaurus-plugin-content-docs\current\developer_guid\docs\front_end\dgiot_topo.md
    this.$dgiotBus.$off("$dg/user/devicestate");
    this.$dgiotBus.$on("$dg/user/devicestate", (e) => {
      let str = String.fromCharCode.apply(null, new Uint8Array(e));
      console.log("解码接收消息", str);
      let args = {};
      const parseString = JSON.parse(str);
      if (parseString) {
        const topicsKeys = Object.keys(parseString);
        args.key = topicsKeys[0];
        args.parseString = parseString[topicsKeys[0]];
        let currentIndex = 0; //第几行修改定义变量
        let changedeviceid = args.key;
        // 实时修改设备的位置，在线离线状态
        if (document.getElementsByClassName("dgiotobjectId").length > 0) {
          for (
            let index = 1;
            index < document.getElementsByClassName("dgiotobjectId").length - 1;
            index++
          ) {
            // console.log(111);
            let objectId = document
              .getElementsByClassName("dgiotobjectId")
              [index].getElementsByClassName("antd-PlainField")[0].innerHTML;
            if (objectId == changedeviceid) {
              currentIndex = index; //找到是第几行
              break; //退出循环
            }
          }
          document
            .getElementsByClassName(`dgiotaddress`)
            [currentIndex].getElementsByClassName(
              "antd-PlainField"
            )[0].innerHTML = args.parseString.address; //修改地址位置
          let status = document
            .getElementsByClassName(`dgiotstatus`)
            [currentIndex].getElementsByClassName(`label`)[0].parentNode;
          if (args.parseString.status == "ONLINE") {
            status.innerHTML = "<span class='label label-success'>在线</span>";
          } else if (args.parseString.status == "OFFLINE") {
            status.innerHTML = "<span class='label label-danger'>离线</span>";
          }
        }
      }
    });
  },
  methods: {
    closeTopo() {
      this.dialogTopoVisible = false;
    },
    async handlecloseEvidence() {
      this.dialogEvidenceVisible = false;
      this.initAmis();
    },
    async reloadCurrent() {
      this.dialogEvidenceVisible = false;
      this.initAmis();
    },
    async initAmis() {
      this.loading = true;
      this.dialog = false;
      let viewid =
        location.hash.split("/")[location.hash.split("/").length - 1];
      const { data = {} } = await getView(viewid);
      this.viewData = data;
      console.log("view表单", data);
      if (JSON.stringify(this.viewData) != "{}") {
        this.dialog = true;
        this.loading = false;
      }
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
  height: 95vh;
  .dialog_wrap {
    height: 100%;
    width: 100%;
    overflow: scroll;
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
// 设备组态
.topo_wrap {
  position: fixed;
  top: 0%;
  left: 0%;
  // transform: translate(-50%, -50%);
  z-index: 99;
  height: 100%;
  background-color: rgba(114, 118, 122, 0.5);
  width: 100%;
  .topo_contentwrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    height: 730px;
    background-color: #fff;
    width: 1200px;
  }
  .topo_title_top {
    padding: 2px 4px;
    margin-bottom: 10px;
    height: 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    color: #000;
    font-size: 26px;
  }
  // background-color: #fff;
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

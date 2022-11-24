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
    <div v-show="dialog" class="dialog_wrap">
      <!-- <amis :schema="viewData" /> -->
      <amis modal-append-to-body :schema="viewData" :show-help="false" />
      <!-- <dgiot-amis modal-append-to-body :schema="viewData" :show-help="false" /> -->
    </div>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import Amis from "@/components/Amis/index.vue";
// import DgiotAmis from "@/components/DgiotAmis/index.vue"
import { getView } from "@/api/View/index";
export default {
  name: "AmisPage",
  props: {},
  components: {
    // DgiotAmis:DgiotAmis,
    amis: Amis,
  },
  data() {
    return {
      commandInfo: {
        dialog: false,
      },
      dialog: false,
      loading: true,
      viewData: {},
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
      // this.$baseMessage(
      //   '未找到该低代码模板',
      //   'info',
      //   'dgiot-hey-message-error'
      // )
    }
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
</style>

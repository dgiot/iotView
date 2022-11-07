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
    // let destId =
    //   JSON.parse(Base64.decode(localStorage.getItem('role')))?.vuexinfo[0]
    //     ?.objectId || ''
    // let name =
    //   JSON.parse(Base64.decode(localStorage.getItem('username')))?.vuexinfo ||
    //   ''
    // localStorage.setItem('parse_name', name)
    // localStorage.setItem('parse_deptid', destId)
    //        this.$dgiotBus.$on('MqttConnect',(data)=>{
    //   console.log('接收消息amis页面',data);
    //  })
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
  },
  destroyed() {},
};
</script>

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

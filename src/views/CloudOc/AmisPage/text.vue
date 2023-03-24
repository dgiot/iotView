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
      <amis
        v-if="dialog"
        modal-append-to-body
        :schema="viewData"
        :show-help="false"
      />
      <!-- <dgiot-amis modal-append-to-body :schema="viewData" :show-help="false" /> -->
    </div>
 
  </div>
</template>

<script>
import { Base64 } from "js-base64";

import Amis from "@/components/Amis/index.vue";

export default {
  name: "AmisPage",
  props: {},
  components: {
    amis: Amis,
  },
  filters: {
    filterVal(val) {
      if (val || val == 0) {
        return val;
      } else {
        return "--";
      }
    },
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
      deviceInfo: {},
      reportInfo: {},
      reportDialog: false,
      officeapps: "",
      //数据采集
      management: {
        dialog: false,
        data: {},
      },
      managementactiveName: "0",
      avator: avator,
      machinelist: [],
      timer: "",
      nowTime: "",
      activeName1: "first",
      thirdtbKey: new Date().getTime(),
      collectionInfo: {},
      drawxnqxPath: "",
      profiledrawxnqxPath: "",
      thingdata: [],
      realtimedata: [],
      thingcolumns: [],
      historycolumns: [],
      historydata: [],
      historyEvidence: [],
      historyEvidenceid: "",
      visible: false,
      maxheight: "480",
      loadfilepath: "",
      drawdata: {},
      performancefilepath: "",
      loadremark1: "",
      loadremark2: "",
      loadremark3: "",
      performanceremark1: "",
      performanceremark2: "",
      performanceremark3: "",
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
  async created() {},
  async mounted() { },
  methods: {
  },
  destroyed() {},
};
</script>
<style scoped>
/* @import url('../AmisPage/style/themeBlack.css'); */
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
::v-deep {
  .dgiot_flex_15 {
    flex: 0 0 15% !important;
  }
  .dgiottree .antd-Tree {
    height: 600px;
    overflow-y: scroll;
  }
  .antd-Page-body {
    padding: 0;
  }

  .antd-Form .antd-Form-item::after {
    border-bottom: 0;
  }
  // dgiot 列表crud
  .dgiot_list {
    padding: 0;
    border: 0;
    .antd-List-items {
      border-top: 0;
      margin-bottom: 0;
      border-bottom: 0;
    }
    .antd-ListItem:nth-child(2n) {
      background-color: #f8f8f8;
    }
  }
  // 智能客服
  .dgiot_chat {
    ::-webkit-scrollbar {
      width: 12px;
    }
    /*里面的代码可以根据自己需求去进行更改*/
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
      width: 12px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(29, 56, 111, 0.9);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }
    /* ::-webkit-scrollbar-thumb:window-inactive {
      background-color: #2472ea;
    } */
    .antd-TextareaControl > textarea {
      background-color: rgba(255, 255, 255, 0.8);
      color: #000;
    }
    .antd-Panel {
      background-color: rgba(255, 255, 255, 0.8);
      color: #000;
      margin: 10px;
    }
    .antd-Page-title {
      color: #fff;
    }
    .antd-Panel--default {
      border-color: rgba(255, 255, 255,0.8);
    }
    .dgiot_tabs{
      background-color: rgba(255, 255, 255, 0.8);
      height: 80vh;
      margin: 0 10px 0 0;
    }
  }
}
</style>

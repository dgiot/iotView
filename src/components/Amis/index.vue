<!--
* @Author: h7ml
* @Date: 2021-11-09 17:34:04
* @LastEditors: h7ml
* @LastEditTime: 2021-11-09 17:34:04
* @Description:
* @FilePath: src\dgiot\components\DgiotAmis\index.vue
* @DocumentLink:
-->
<template>
  <div class="DgiotAmis" :key="amisKey">
    <amis-render :schema="schema" :screen_deviceid="screen_deviceid" :screen_productid="screen_productid" />
    <!-- <draw-code v-show="showHelp" :code="schema" /> -->
  </div>
</template>
<script>
import "amis/lib/themes/default.css";
import "amis/lib/themes/antd.css";
import 'amis/lib/themes/cxd.css'
import 'amis/lib/themes/ang.css'
import 'amis/lib/helper.css'
import 'amis/sdk/sdk.css'

// import 'amis-editor/dist/style.css'

import AmisRender from "./render.vue";
// import DrawCode from '../DgiotDrawerCode'

const amisdefault = {
  type: "page",
  body: {
    type: "tpl",
    tpl: " ",
  },
};
export default {
  name: "DgiotAmis",
  components: {
    // DrawCode,
    AmisRender,
  },
  props: {
    schema: {
      type: Object,
      required: false,
      default: () => amisdefault,
    },
    screen_deviceid: {
      type: String,
      required: false,
      default: '',
    },
    screen_productid: {
      type: String,
      required: false,
      default: '',
    },
    showHelp: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      amisKey: new Date().getTime().toString() + Math.random().toString(),
    };
  },
  watch: {
    schema: {
      handler(val) {
        this.amisKey = new Date().getTime().toString() + Math.random().toString();
      },
      immediate: true,
      deep: true,
    },
  },
};

</script>
<style lang="scss">
.DgiotAmis {
  height: 100%;

  .box {
    height: 100%;
  }
}

</style>

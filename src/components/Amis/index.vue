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
    <amis-render :schema="schema" />
    <!-- <draw-code v-show="showHelp" :code="schema" /> -->
  </div>
</template>

<script>
import "amis/lib/themes/default.css";
import "amis/lib/themes/antd.css";
import "amis/lib/themes/cxd.css";

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
    showHelp: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      amisKey: new Date().getTime(),
    };
  },
  watch: {
    schema: {
      handler(val) {
        this.amisKey = new Date().getTime();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang="scss">
.DgiotAmis{
  height: 100%;
  .box{
    height: 100%;
  }
}  
</style>

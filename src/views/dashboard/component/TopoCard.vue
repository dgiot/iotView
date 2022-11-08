<template>
  <div
    class="topoCard"
    :style="{ width: comp.width + 'px', height: comp.height + 'px' }"
  >
    <div class="card_content">
      <div style="font-size: 20px; text-shadow: 1px 2px 0.5px #000">
        <span style="font-weight: bold">{{ label }}: </span>
        <span style="color: #efdb64">{{ value }}</span>
        <!-- <span v-if="comp.text == '产品数量'" style="color: #f8a75c">{{
          value
        }}</span>
        <span v-else-if="comp.text == '设备数量'" style="color: #efdb64">{{
          _dev_count
        }}</span>
        <span v-else-if="comp.text == '在线设备'" style="color: #03fcfa">{{
          _dev_online_count
        }}</span>
        <span v-else-if="comp.text == '离线设备'" style="color: #ff684b">{{
          _dev_off_count
        }}</span> -->
        <!-- {{value}} -->
      </div>
    </div>
    <img
      src="@/assets/static/card.png"
      :style="{ width: comp.width + 'px', height: comp.height + 'px' }"
    />
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "TopoCard",
  props: {
    comp: {
      type: Object,
      default: () => ({
        type: "line",
        width: 262,
        hieght: 72,
      }),
    },
  },
  computed: {
    ...mapGetters([
      "_product_count",
      "_dev_count",
      "_dev_online_count",
      "_dev_off_count",
    ]),
  },
  data() {
    return {
      value: 0,
      topic: "",
      label: "",
    };
  },
  created() {},
  mounted() {
    this.label = this.comp.text;
    // $dg/user/konva
    this.topic = `/${this.comp.type}/${this.comp.id}/report`;
    // console.log(this.topic);
    //  this.$dgiotBus.$off(this.topic);
    this.$dgiotBus.$off(this.topic);
    this.$dgiotBus.$on(this.topic, (e) => {
      // console.log("11111");
      let str = String.fromCharCode.apply(null, new Uint8Array(e));

      let receive = JSON.parse(Base64.decode(str));
      console.log("接收到了数据", receive);
      // this.value = e;
      // this.receive.lable = receive.lable;
      this.text = receive.lable;
      this.value = receive.value;
    });
  },
  destroyed() {
    this.$dgiotBus.$off(this.topic);
  },
};
</script>
<style lang="scss" scoped>
.topoCard {
  position: relative;
  .card_content {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
}
</style>

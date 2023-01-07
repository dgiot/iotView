<template>
  <div class="realtime" :style="{ width: '100%', height: '100%' }">
    {{ nowTime }}
  </div>
</template>

<script>
import { getTime } from "@/utils/index";
export default {
  name: "RealTime",
  data() {
    return {
      timer: "",
      nowTime: "",
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      this.datetime();
    }, 1000);
  },
  methods: {
    datetime() {
      this.nowTime = getTime();
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.realtime {
  color: #fff;
  font-weight: bold;
}
</style>

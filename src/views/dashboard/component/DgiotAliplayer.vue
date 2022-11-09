<template>
  <div class="liveapp">
    <!-- <div class="source-box">
      <el-select
        v-model="source"
        placeholder="请选择"
        name="source"
        id="source"
      >
        <el-option
          v-for="item in liveSrc"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div> -->
    <div>
      <span
        style="
          margin-left: 5%;
          padding: 2px 10px;
          margin-top: 10px;
          border-left: 4px solid #5dc7ff;
          display: inline-block;
          color: #00d7ff;
        "
        >现场画面</span
      >
      <span @click="play()" class="custom-btn btn-14">播放</span>
      <span @click="pause()" class="custom-btn btn-14 red">暂停</span>
      <!-- <span @click="getCurrentTime()">刷新</span> -->
    </div>

    <div style="margin: 10px auto; width: 90%; height: calc(100% - 35px)">
      <template v-if="!isShowMultiple && show">
        <vue-aliplayer-v2
          style="height: 90%"
          :source="source"
          ref="VueAliplayerV2"
          :options="options"
          :autoplay="true"
        />
      </template>
    </div>

    <!-- <div v-if="isShowMultiple && show" class="show-multiple">
      <template v-for="x in 5">
        <vue-aliplayer-v2
          class="multiple-player"
          :key="x"
          :source="source"
          ref="VueAliplayerV2"
          :options="options"
        />
      </template>
    </div> -->
    <p class="remove-text" v-if="!show">播放器已销毁!</p>
    <!-- <div class="player-btns"> -->
    <!-- <template v-if="!isShowMultiple && show"> -->
    <!-- <span @click="play()">播放</span> -->
    <!-- <span @click="pause()">暂停</span> -->
    <!-- <span @click="replay()">重播</span> -->
    <!-- <span @click="getStatus()">获取播放器状态</span> -->
    <!-- </template> -->
    <!-- <span @click="show = !show">{{ show ? "销毁" : "重载" }}</span>
      <span @click="options.isLive = !options.isLive">{{
        options.isLive ? "切换普通模式" : "切换直播模式"
      }}</span> -->
    <!-- <span @click="showMultiple()">{{
        isShowMultiple ? "显示1个播放器" : "显示多个播放器"
      }}</span> -->
    <!-- </div> -->

    <!-- <div class="source-box">
      <span class="source-label">输入播放源(支持动态切换):</span>
      <input class="source-input" type="text" v-model="source" />
    </div>
    <link
  rel="stylesheet"
  href="https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/aliplayer-min.css"
/>
     -->
  </div>
</template>

<script
  type="text/javascript"
  charset="utf-8"
  src="https://g.alicdn.com/de/prismplayer/2.9.3/aliplayer-min.js"
></script>
<script>
import VueAliplayerV2 from "vue-aliplayer-v2";

export default {
  name: "Live-Demo",
  components: { VueAliplayerV2: VueAliplayerV2.Player },
  props: {
    comp: {
      type: Object,
      default: () => ({
        type: "videolive",
        width: 400,
        hieght: 72,
      }),
    },
  },
  data() {
    return {
      liveSrc: [
        {
          label: "湖南卫视",
          value:
            "http://219.151.31.38/liveplay-kk.rtxapp.com/live/program/live/hnwshd/4000000/mnf.m3u8",
        },
        {
          label: "播放源1",
          value: "//player.alicdn.com/video/aliyunmedia.mp4",
        },
      ],
      options: {
        // source:'//player.alicdn.com/video/aliyunmedia.mp4',
        isLive: true, //切换为直播流的时候必填（true-直播状态，false-普通模式，播放器普通视频）
        // format: "m3u8",
      },
      source: "",
      show: true,
      isShowMultiple: false,
    };
  },
  mounted() {
    this.source =
      this.comp.text ||
      "http://219.151.31.38/liveplay-kk.rtxapp.com/live/program/live/hnwshd/4000000/mnf.m3u8";

    // setTimeout(() => {
    //   this.play();
    // }, 5000);
  },
  methods: {
    play() {
      this.$refs.VueAliplayerV2.play();
    },
    pause() {
      this.$refs.VueAliplayerV2.pause();
    },
    replay() {
      this.$refs.VueAliplayerV2.replay();
    },
    getCurrentTime() {
      this.$refs.VueAliplayerV2.getCurrentTime();
      // this.source = "http://ivi.bupt.edu.cn/hls/cctv1.m3u8";
    },
    getStatus() {
      const status = this.$refs.VueAliplayerV2.getStatus();
      console.log(`getStatus:`, status);
      alert(`getStatus:${status}`);
    },
    showMultiple() {
      this.isShowMultiple = !this.isShowMultiple;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/aliplayer-min.css";
.liveapp {
  position: relative;
  width: 100%;
  height: 100%;
  background: url("../../../assets/bg/bg_warning.png") no-repeat;
  background-size: 100% 100%;
}
* {
  margin: 0;
  padding: 0;
}
.remove-text {
  text-align: center;
  padding: 20px;
  font-size: 24px;
}
.show-multiple {
  display: flex;
  .multiple-player {
    width: calc(100% / 4);
    margin: 20px;
  }
}
.source-box {
  // padding: 5px 10px;
  // margin-bottom: 20px;
  .source-label {
    margin-right: 20px;
    font-size: 16px;
    display: block;
  }
  #source {
    margin-top: 10px;
  }
  .source-input {
    margin-top: 10px;
    padding: 5px 10px;
    width: 80%;
    border: 1px solid #ccc;
  }
}
/* 14 */
.custom-btn {
  width: 60px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  margin-left: 10px;
  // padding: 10px 25px;
  // font-family: "Lato", sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5);

  outline: none;
}
.btn-14 {
  // background: rgb(14, 22, 56);
  border: none;
  z-index: 1;
}

.red {
  background: rgb(234, 0, 0);
}
.btn-14:after {
  position: absolute;
  content: "";
  width: 100%;
  height: 0;
  top: 0;
  left: 0;
  z-index: -1;
  border-radius: 5px;
  background-color: #bf9204;
  // background-image: linear-gradient(315deg, #0e1638 0%, #304156 74%);
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(255, 0, 0, 0.1);
  // transition: all 0.3s ease;
}
.btn-14:hover {
  color: #0e1638;
}
.btn-14:hover:after {
  top: auto;
  bottom: 0;
  height: 100%;
}
.btn-14:active {
  top: 2px;
}
</style>

<template>
  <div style="width: 100%; height: 100%; background-color: #000">
    <!-- <model-three
      ref="model"
      id="model"
      :controls-options="{
        enableRotate: true, // 是否可旋转
        enableZoom: true, // 是否可缩放
        enablePan: true, // 是否可移动（鼠标右键可以移动模型）
      }"
      :rotation="rotation"
      :src="comp.text"
      @on-click="handleClick"
      @on-load="onLoad"
      @on-mousemove="onMouseMove"
    /> -->
    <!-- <model-obj
      ref="model"
      id="model"
      :controls-options="{
        enableRotate: true, // 是否可旋转
        enableZoom: true, // 是否可缩放
        enablePan: true, // 是否可移动（鼠标右键可以移动模型）
      }"
      :rotation="rotation"
      src="/dgiot_file/3d/tree.obj"
      @on-click="handleClick"
      @on-load="onLoad"
      @on-mousemove="onMouseMove"
    /> -->
    <model-gltf
      ref="model"
      id="model"
      :controls-options="{
        enableRotate: true, // 是否可旋转
        enableZoom: true, // 是否可缩放
        enablePan: true, // 是否可移动（鼠标右键可以移动模型）
      }"
      :rotation="rotation"
      src="/dgiot_file/3d/3dpic.glb"
      @on-click="handleClick"
      @on-load="onLoad"
      @on-mousemove="onMouseMove"
    />
    <!-- <model-ply
      ref="model"
      id="model"
      :controls-options="{
        enableRotate: true, // 是否可旋转
        enableZoom: true, // 是否可缩放
        enablePan: true, // 是否可移动（鼠标右键可以移动模型）
      }"
      src="/dgiot_file/3d/dolphins.ply"
      @on-click="handleClick"
      @on-load="onLoad"
      @on-mousemove="onMouseMove"
    /> -->
    <!-- <model-stl
      ref="model"
      id="model"
      :controls-options="{
        enableRotate: true, // 是否可旋转
        enableZoom: true, // 是否可缩放
        enablePan: false, // 是否可移动（鼠标右键可以移动模型）
      }"
      src="/dgiot_file/3d/gear.stl"
      @on-click="handleClick"
      @on-load="onLoad"
      @on-mousemove="onMouseMove"
    /> -->
  </div>
</template>

<script>
import {
  ModelObj,
  ModelThree,
  modelFbx,
  ModelCollada,
  ModelStl,
  ModelPly,
  ModelGltf,
} from "vue-3d-model";
import { getTime } from "@/utils/index";
export default {
  name: "RealTime",
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
  components: {
    ModelObj,
    ModelThree,
    modelFbx,
    ModelCollada,
    ModelStl,
    ModelPly,
    ModelGltf,
  },
  data() {
    return {
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
    };
  },
  mounted() {
    console.log("这是3d组件");
    // this.timer = setInterval(() => {
    //   this.datetime();
    // }, 1000);
  },
  methods: {
    onLoad() {
      this.rotate();
    },
    rotate() {
      this.rotation.y -= 0.01;
      requestAnimationFrame(this.rotate);
    },
    handleClick(value) {
      //  var geometry = new Three.BoxGeometry(100, 100, 100)
      window.click = value;
      console.log(
        "点击了",
        value,
        this.$refs.model.renderer.getContext("webgl2")
      );
      this.modelRef.material.color.setStyle("#13ce66");
      // let width = Math.random() * 200 + 100;
      // let height = Math.random() * 200 + 200;
      // this.$refs.model.renderer.setSize(width, height);
      // let texts = [
      //   {
      //     name: "北京",
      //     value: 323,
      //   },
      //   {
      //     name: "杭州",
      //     value: 121,
      //   },
      //   {
      //     name: "南京",
      //     value: 56,
      //   },
      // ];
      //  this.$refs.model.renderer.fillStyle = "gray"
      // this.$refs.model.renderer.fillRect(0, 0, 300, 300)
      // let canvas = document.getElementById('model').children[0]
      window.renderer = this.$refs.model.renderer; //.getContext("webgl2");

      //  const texture =  window.ctx.createTexture();
      // console.log("ctx", ctx);
      // ctx.fillStyle = "gray";
      // ctx.fillRect(0, 0, 300, 300);
      // texts.forEach((text, index) => {
      //   ctx.fillText(`${text.name}:${text.value}`, 10, 32 * index + 30);
      // });
    },
    // 鼠标在容器上移动，event为null
    // 鼠标在模型上移动，event为模型对象
    onMouseMove(event) {
      // console.log("模型", event);
      if (event) {
        if (!this.modelRef) {
          this.modelRef = event.object;
        }
        window.modelRef = this.modelRef;
        // console.log("this.modelRef", this.modelRef);
        // this.modelRef.material.color.setStyle("#13ce66");
        return;
      }

      // this.modelRef?.material.color.setStyle("yellow");
    },
    handleOnload() {},
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

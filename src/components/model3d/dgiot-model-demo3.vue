<!--  -->
<template>
  <div
    ref="container"
    style="width: 100%; height: 100%; background-color: #000"
  ></div>
</template>

<script>
import * as THREE from "three";
import gsap from "gsap";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; //加载
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"; //解压缩
// import { DRACOLoader } from "three/examples/jsm/libs/draco/gltf"; //解压缩地址
// import { DMLoader } from "three/examples/jsm/loaders/3DMLoader";
// import {  } from "three/examples/jsm/controls/";
// import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import { gltfloader } from "./utils/load";
let scene = null,
  camera = null,
  renderer = null,
  controls = null,
  mixer = null,
  mesh = null;

const clock = new THREE.Clock();
export default {
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
      model: {
        yuanzhu: null,
        fbx: null,
      },
      rotation: "", //旋转
      timer: "",
    };
  },
  mounted() {
    console.log("111111");
    this.init();
    this.animate();
    // 添加监听事件
    this.addmeth();
  },
  methods: {
    init() {
      // 获取实例
      const container = this.$refs.container;
      // 创造一个场景
      scene = new THREE.Scene();
      // 加载辅助坐标系 实际应用的时候需要注释此代码
      const axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);
      // 创造一个几何体BoxGeometry  球体SphereGeometry

      // 获取材质
      var material = new THREE.MeshLambertMaterial({
        color: 0x1db8df,
        opacity: 0.3,
        transparent: false,
      });
      scene.add(mesh);
      // 正方体
      var geometry = new THREE.BoxGeometry(100, 100, 100);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(100, 100, 100);
      scene.add(mesh);
      /**
       * 光源设置
       */
      // 点光源
      var point = new THREE.PointLight(0xf2f2f2);
      point.position.set(100, 200, 500); // 点光源位置
      scene.add(point); // 点光源添加到场景中
      // 环境光
      var ambient = new THREE.AmbientLight(0x404040);
      scene.add(ambient);
      // 新建相机 PerspectiveCamera是透视相机 OrthographicCamera正射投影相机
      // 第一个参数是视角，第二个参数是横纵比，第三个参数是近面距离，第四个参数是远面距离
      var width = container.clientWidth; // 窗口宽度
      var height = container.clientHeight; // 窗口高度
      var k = width / height; // 窗口宽高比
      var s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      // -s * k, s * k, s, -s, 1, 1000
      camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      // 相机位置
      camera.updateProjectionMatrix();
      camera.position.set(100, 200, 500); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向(指向的场景对象)

      // // 创造一个渲染器

      renderer = new THREE.WebGLRenderer({ antialias: true }); // 去锯齿 { antialias: true }
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0xffffff); // 设置背景颜色
      container.appendChild(renderer.domElement);
      // 控制器
      controls = new OrbitControls(camera, renderer.domElement); //用户交互
      controls.enableDamping = true;
      //设置相机的角度范围
      controls.maxPolarAngle = Math.PI * 0.5;
      //设置相机距离原点的最远距离
      controls.minDistance = 0;
      //设置相机距离原点的最远距离
      controls.maxDistance = 2000;
      // 把canvas挂载到container中

      // 初始化解压模型
      const dracoloader = new DRACOLoader();
      dracoloader.setDecoderPath("./draco/gltf/");
      const gltfloader = new GLTFLoader();
      gltfloader.setDRACOLoader(dracoloader);
      // 加载模型
      gltfloader.load("/dgiot_file/3d/LittlestTokyo.glb", (gltf) => {
        const model = gltf.scene;
        model.position.set(1, 1, 0);
        // model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        // let mixer = new THREE.AnimationMixer(model);
        // mixer.clipAction(gltf.animations[0]).play();

        // this.animate1();
      });
      // let loader = new OBJLoader();
      // loader.load(
      //   // resource URL
      //   "/public/three/model/tree.obj",
      //   // called when resource is loaded
      //   function (object) {
      //     console.log("这是树", object, scene);
      //     scene.add(object);
      //     renderer.render(scene, camera);
      //   },
      //   // called when loading is in progresses
      //   function (xhr) {
      //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      //   },
      //   // called when loading has errors
      //   function (error) {
      //     console.log("An error happened");
      //   }
      // );
    },
    animate() {
      // 浏览器自动渲染下一帧
      // console.log("333333333333");
      controls.update();
      TWEEN.update();
      requestAnimationFrame(this.animate);

      // 渲染到页面
      renderer.render(scene, camera);
    },
    mouseDown(event) {
      console.log("点击", this.yuanzhu, event);
      this.isclick = {
        clientX: event.clientX,
        clientY: event.clientY,
      };

      // let gltfloader = new GLTFLoader();
      // 解压缩
      // const dracoloader = new DRACOLoader();
      // dracoloader.setDecoderPath("three/examples/jsm/libs/draco/gltf");
      // gltloader.setDRACOLoader(dracoloader);
      // gltfloader.load("/dgiot_file/3d/3dpic.glb", (gltf) => {
      //   console.log("这是模型2", gltf);
      //   let bmw = gltf.scene;
      //   // bmw.position.set(100, 100, 100);
      //   scene.add(bmw);
      // });

      if (!this.model.yuanzhu) {
        var material = new THREE.MeshLambertMaterial({
          color: 0x1db8df,
          opacity: 0.3,
          transparent: true,
        });
        let yuanzhu = new THREE.CylinderGeometry(20, 40, 180, 200);
        this.model.yuanzhu = new THREE.Mesh(yuanzhu, material);
        this.model.yuanzhu.position.set(
          (Math.random() - 0.5) * Math.random() * 500,
          Math.random() * 200,
          Math.random() * 100
        );
        scene.add(this.model.yuanzhu);
      } else {
        let list = ["fbx", "yuanzhu"];
        let key = Math.round(Math.random());
        console.log("this.sss", this.timer);
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = "";
        } else {
          this.timer = setInterval(() => {
            this.model.fbx.rotation.y -= 0.1;
            this.model.fbx.position.setX(
              this.model.fbx.position.x + Math.random() - 0.1
            );
            this.model.fbx.position.setY(
              this.model.fbx.position.y + Math.random() - 0.1
            );
          }, 100);
        }

        this.model[list[key]].position.set(
          (Math.random() - 0.5) * Math.random() * 500,
          Math.random() * 200,
          Math.random() * 100
        );
        this.model["yuanzhu"].material.color.setStyle("#ff0000");
      }
    },
    // 添加全局方法
    // https://blog.csdn.net/yangjianxun8888/article/details/123525617
    addmeth() {
      // 监听窗口尺寸变化
      window.addEventListener("resize", this.changeSize, false);
      // 监听鼠标按下
      this.$refs.container.addEventListener("mousedown", this.mouseDown, false);
      //  监听鼠标移动
      window.addEventListener("mousemove", this.mouseMove, false);
      // 监听鼠标弹起
      window.addEventListener("mouseup", this.mouseUp, false);
    },
  },
};
</script>
<style scoped>
#container {
  width: 100vw;
  height: 100vh;
}
</style>

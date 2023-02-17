<!--  -->
<template>
  <div ref="container" style="width: 100%; height: 100%">
    <div style="font-size: 14px; color: #fff; position: absolute">
      <span
        style="
          display: inline-block;
          margin-right: 5px;
          padding: 5px 16px;
          border-radius: 2px;
          cursor: pointer;
          background-color: rgb(35, 78, 98, 0.5);
        "
        @click="handleSwitchScene(index1)"
        :style="{
          color: index1 == index ? '#04e9eb' : '',
        }"
        v-for="(item1, index1) in scenes"
        :key="index1"
        >{{ item1.name }}</span
      >
    </div>
    <!-- <div
      v-for="(item, i) in scenes"
      :key="i"
      style="width: 100%; height: 100%; position: absolute; top: 0; left: 0"
      :style="{
        display: i == index ? '' : 'none',
      }"
    > -->
    <div
      v-for="(item, i) in scenes"
      :key="i"
      style="font-size: 20px; color: #fff; position: absolute"
      :style="{
        display: i == index ? '' : 'none',
        top: item.top,
        left: item.left,
        width: item.width,
        height: item.height,
      }"
    >
      <div
        v-for="(item1, index1) in item.realdata"
        :key="index1"
        style="display: flex"
      >
        <div style="flex: 1">{{ item1.text }}:</div>
        <div style="flex: 2">{{ item1.value }}</div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import * as THREE from "three";
import gsap from "gsap";
import { ref } from "vue";

import Stats from "three/examples/jsm/libs/stats.module";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"; //解压缩
// import { DRACOLoader } from "three/examples/jsm/libs/draco/gltf"; //解压缩地址
// import { DMLoader } from "three/examples/jsm/loaders/3DMLoader";
// import {  } from "three/examples/jsm/controls/";
// import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
// import { gltfloader } from "./utils/load";
let scene = null,
  camera = null,
  renderer = null,
  controls = null,
  mesh = null;
let mixer = new THREE.AnimationMixer();
const clock = new THREE.Clock();
const stats = new Stats();
// let index1 = ref(0);
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
        house: null,
        fbx: null,
        floor: null,
      },
      animations: {},
      rotation: "", //旋转
      timer: "",
      index: 0,
      isAnimate: false, //防抖
      scenes: [],
      timeLine1: "",
      timeLine2: "",
    };
  },
  mounted() {
    console.log("111111");
    this.init();
    this.animate();
    // 添加监听事件
    this.addmeth();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    init() {
      // 初始化场景内容（数据以及视角）
      this.scenes = [
        {
          id: "finished",
          realdata: [
            {
              name: "temp",
              text: "温度",
              value: "15℃",
            },
            {
              name: "humid",
              text: "湿度",
              value: "50%",
            },
          ],
          name: "仓储区",
          width: "30%",
          height: "20%",
          top: "20%",
          left: "70%",
          callback: () => {
            // 执行函数切换位置
            this.translateCamara(
              new THREE.Vector3(-300, 300, -800),
              new THREE.Vector3(0, 0, 0)
            );
          },
        },
        {
          id: "live",
          name: "居住区",
          realdata: [
            {
              name: "people",
              text: "人员数",
              value: "20",
            },
            {
              name: "elec",
              text: "用电量",
              value: "400KW·h",
            },
            {
              name: "water",
              text: "用水量",
              value: "300t",
            },
          ],
          top: "24%",
          left: "60%",
          width: "30%",
          height: "20%",
          callback: () => {
            // 执行函数切换位置
            this.translateCamara(
              new THREE.Vector3(500, 200, 400),
              new THREE.Vector3(400, 100, 150)
            );
          },
        },
      ];
      // 获取实例
      const container = this.$refs.container;
      // container.appendChild(stats.dom);
      // 创造一个场景
      scene = new THREE.Scene();
      // 加载辅助坐标系 实际应用的时候需要注释此代码
      // const axisHelper = new THREE.AxesHelper(250);
      // scene.add(axisHelper);
      // 创造一个几何体BoxGeometry  球体SphereGeometry

      // 获取材质

      let ary2 = [
        this.loadtexture("/dgiot_file/3d/maps/fac1.png"),
        this.loadtexture("/dgiot_file/3d/maps/fac2.png"),
        this.loadtexture("/dgiot_file/3d/maps/fac_grass.jpg"),
        this.loadtexture("/dgiot_file/3d/maps/fac1.png"),
        this.loadtexture("/dgiot_file/3d/maps/fac1.png"),
        this.loadtexture("/dgiot_file/3d/maps/fac1.png"),
      ];
      var geometry2 = new THREE.BoxGeometry(300, 2, 300);
      // 前后上下左右
      let material2 = [
        {},
        {},
        new THREE.MeshDepthMaterial(ary2[2]),
        {},
        {},
        {},
      ];
      var mesh2 = new THREE.Mesh(geometry2, material2); //网格模型对象Mesh
      mesh2.position.set(-100, 1, -100);
      scene.add(mesh2); //网格模型添加到场景中
      // 成品仓库
      let yuanzhus = [
        {
          x: -180,
          y: 50,
          z: -180,
        },
        {
          x: -180,
          y: 50,
          z: -50,
        },
        {
          x: -50,
          y: 50,
          z: -180,
        },
        {
          x: -50,
          y: 50,
          z: -50,
        },
      ];
      yuanzhus.forEach((item) => {
        var yuanzhu = new THREE.CylinderGeometry(50, 50, 100, 100);
        mesh = new THREE.Mesh(yuanzhu, ary2[0]);
        mesh.position.set(item.x, item.y, item.z);
        // mesh.rotation.x = 0.5;
        // mesh.rotation.y = 0.5;
        scene.add(mesh);
      });

      // // 使用补尖函数从0到2Π,使灯泡旋转
      // let options = {
      //   angle: 0,
      // };
      // gsap.to(options, {
      //   angle: Math.PI * 2,
      //   duration: 10,
      //   repeat: -1,
      //   ease: "linear",
      //   onUpdate: () => {
      //     pointLightGroup.rotation.y = options.angle;
      //     pointlightArr.forEach((item, index) => {
      //       item.position.set(
      //         radius * Math.cos((index * 2 * Math.PI) / 3),
      //         Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5) + 5,
      //         radius * Math.sin((index * 2 * Math.PI) / 3)
      //       );
      //     });
      //   },
      // });
      // 初始化解压模型
      const dracoloader = new DRACOLoader();
      dracoloader.setDecoderPath("./draco/gltf/");
      const gltfloader = new GLTFLoader();
      gltfloader.setDRACOLoader(dracoloader);
      gltfloader.load("/dgiot_file/3d/LittlestTokyo.glb", (gltf) => {
        const model = gltf.scene;

        model.position.set(400, 100, 150);
        console.log("这是模型LittlestTokyo", gltf);
        model.scale.x = 0.5;
        model.scale.y = 0.5;
        model.scale.z = 0.5;
        model.traverse((child) => {
          if (child.name === "Plane") {
            child.visiable;
          }
          if (child.isMesh) {
            // child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        this.model.house = model;
        scene.add(model);
        this.animations[`house`] = new THREE.AnimationMixer(model);
        this.animations[`house`].clipAction(gltf.animations[0]).play();
        // mixer = new THREE.AnimationMixer(model);
        // mixer.clipAction(gltf.animations[0]).play();
        this.animate();
      });
      const loader = new FBXLoader();
      // // const loader = new Three.FBXLoader();
      // // walkingman.fbx dancing
      // loader.load(
      //   "/dgiot_file/3d/dancing.fbx",
      //   (fbx) => {
      //     console.log("这是模型1", fbx, fbx.animations, fbx.animations[0].name);
      //     this.model.fbx = fbx;
      //     this.model.fbx.position.set(200, -60, 100);
      //     this.model.fbx.scale.set(0.7, 0.7, 0.7);

      //     scene.add(this.model.fbx);
      //   },
      //   undefined,
      //   function (error) {
      //     console.error(error);
      //   }
      // );

      loader.load(
        "/dgiot_file/3d/3ddemo/floor.fbx",
        (fbx) => {
          console.log("这是模型2", fbx);
          this.model.floor = fbx;
          this.model.floor.position.set(-300, 0, -100);
          this.model.floor.scale.set(0.15, 0.15, 0.15);
          scene.add(this.model.floor);
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
      // var point = new THREE.PointLight(0xffffff, 2);
      // point.position.set(-1000, 300, -500); // 点光源位置
      // // point.castShadow = true; //阴影
      // scene.add(point);
      // loader.load(
      //   "/dgiot_file/3d/3ddemo/factory.fbx",
      //   (fbx) => {
      //     console.log("这是模型2", fbx);
      //     this.model.factory = fbx;
      //     this.model.factory.position.set(-600, 50, -500);
      //     this.model.factory.scale.set(300, 300, 300);
      //     scene.add(this.model.factory);
      //   },
      //   undefined,
      //   function (error) {
      //     console.error(error);
      //   }
      // );

      /**
       * 光源设置
       */
      // 光线的照射
      // var ambiColor = "#f2f2f2";
      // var spotLight = new THREE.SpotLight(ambiColor);
      // spotLight.position.set(100, 200, 500);
      // scene.add(spotLight);
      // var spotLight2 = new THREE.SpotLight(ambiColor);
      // spotLight2.position.set(100, 100, 150);
      // scene.add(spotLight2);
      // 平行光
      // const light = new THREE.DirectionalLight(0xffffff, 1);
      // light.position.set(0, 0, 200);
      // scene.add(light);

      // 点光源
      var point = new THREE.PointLight(0xffffff, 5);
      point.position.set(400, 500, 400); // 点光源位置
      // point.castShadow = true; //阴影
      scene.add(point); // 点光源添加到场景中

      // 环境光
      // var ambient = new THREE.AmbientLight(0x404040);
      // scene.add(ambient);

      // 新建相机 PerspectiveCamera是透视相机 OrthographicCamera正射投影相机
      // 第一个参数是视角，第二个参数是横纵比，第三个参数是近面距离，第四个参数是远面距离
      var width = container.clientWidth; // 窗口宽度
      var height = container.clientHeight; // 窗口高度
      var k = width / height; // 窗口宽高比
      var s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      // -s * k, s * k, s, -s, 1, 1000
      camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 0.1, 10000);
      // 相机位置
      camera.position.set(-300, 300, -800); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向(指向的场景对象)

      // // 创造一个渲染器

      renderer = new THREE.WebGLRenderer({
        antialias: true, // 去锯齿
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true; //允许渲染器阴影
      // renderer.physicallyCorrectLights = false;
      renderer.setClearColor(0x838788); // 设置背景颜色

      controls = new OrbitControls(camera, renderer.domElement); //用户交互
      controls.target.set(0, 0, 0);
      //设置相机的角度范围
      controls.maxPolarAngle = Math.PI * 0.5;
      //设置相机距离原点的最远距离
      controls.minDistance = 0;
      //设置相机距离原点的最远距离
      controls.maxDistance = 5000;
      // 把canvas挂载到container中
      container.appendChild(renderer.domElement);
      // id,name,value

      this.timeLine1 = gsap.timeline();
      this.timeLine2 = gsap.timeline();
      // console.log("ref000", ref(0));
      // this.index = ref(0);

      this.timer = setInterval(() => {
        let realData = ["temp", "humid"];
        this.scenes.forEach((element) => {
          if (element.id == "finished") {
            let data = realData[Math.floor(Math.random() * 2)];
            let value = "";
            if (data == "temp") {
              value = Number(Math.random().toFixed(2)) + 15 + "℃";
            } else {
              value = Number(Math.random().toFixed(2)) + 50 + "%";
            }
            element.realdata.forEach((ele1) => {
              if (ele1.name == data) {
                ele1.value = value;
              }
            });
          }
        });
      }, 3000);
    },
    loadtexture(url) {
      var loder = new THREE.TextureLoader();
      var texture = loder.load(url);
      var basicMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        // 前面FrontSide  背面：BackSide 双面：DoubleSide
      });
      return basicMaterial; //这个就是图片所造的一个面的材料
    },

    // 使用补间动画移动相机
    // 定义相机移动函数
    handleSwitchScene(index) {
      this.index = index;
      this.scenes[this.index].callback();
    },
    translateCamara(position, target) {
      this.timeLine1.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 1,
        ease: "power2.inOut",
      });
      this.timeLine2.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 1,
        ease: "power2.inOut",
      });
    },
    // https://blog.csdn.net/Mr_Bobcp/article/details/125200298
    startAnimation(skinnedMesh, animations, animationName) {
      const m_mixer = new THREE.AnimationMixer(skinnedMesh);
      const clip = THREE.AnimationClip.findByName(animations, animationName);
      console.log("clip", clip);
      if (clip) {
        const action = m_mixer.clipAction(clip);
        action.play();
      }
      return m_mixer;
    },
    animate() {
      // 浏览器自动渲染下一帧
      // console.log("333333333333");
      controls.update();
      const delta = clock.getDelta();
      for (let key in this.animations) {
        this.animations[key].update(delta);
      }
      //  mixer.update(delta);
      TWEEN.update();
      requestAnimationFrame(this.animate);
      stats.update();
      // 渲染到页面
      renderer.render(scene, camera);
    },
    // 鼠标按下
    mouseDown(event) {
      // console.log("点击", this.yuanzhu, event);
      this.isclick = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      return;
      console.log(this.model.fbx);
      if (this.animations["fbx"]) {
        delete this.animations["fbx"];
      } else {
        this.animations["fbx"] = this.startAnimation(
          this.model.fbx,
          this.model.fbx.animations,
          this.model.fbx.animations[0].name // animationName，这里是"Run"
        );
      }

      // this.model.fbx.animations.forEach((item, index) => {

      // });

      // if (this.timer) {
      //   clearInterval(this.timer);
      //   this.timer = "";
      // } else {
      //   this.timer = setInterval(() => {
      //     this.model.fbx.rotation.y -= 0.1;
      //   }, 100);
      // }
    },
    // 鼠标滚动
    mouseWheel(e) {
      console.log("e.deltaY ", e.deltaY);
      return;
      if (this.isAnimate) return;
      this.isAnimate = true;
      if (e.deltaY > 0) {
        this.index++;
        if (this.index > this.scenes.length - 1) {
          this.index = 0;
        }
      }
      this.scenes[this.index].callback();
      setTimeout(() => {
        this.isAnimate = false;
      }, 1000);
    },
    // 添加全局方法
    // https://blog.csdn.net/yangjianxun8888/article/details/123525617
    addmeth() {
      // 监听窗口尺寸变化
      window.addEventListener("resize", this.changeSize, false);
      // 监听鼠标按下
      this.$refs.container.addEventListener("mousedown", this.mouseDown, false);
      // 监听鼠标滚轮事件
      this.$refs.container.addEventListener("wheel", this.mouseWheel, false);
      //  监听鼠标移动
      window.addEventListener("mousemove", this.mouseMove, false);
      // 监听鼠标弹起
      window.addEventListener("mouseup", this.mouseUp, false);
    },
  },
};
</script>
<style scoped>
/* #container {
  width: 100vw;
  height: 100vh;
} */
</style>

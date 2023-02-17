<!--  -->
<template>
  <div ref="container" style="width: 100%; height: 100%">
    <div style="font-size: 14px; color: #fff; position: absolute">
      <span
        style="
          display: inline-block;
          margin-right: 20px;
          padding: 2px 4px;
          border: 1px solid #fff;
          border-radius: 2px;
          cursor: pointer;
        "
        @click="handleSwitchScene(index1)"
        :style="{
          'background-color': index1 == index ? '#56a0e3' : '',
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
    <h1
      v-for="(item, i) in scenes"
      :key="i"
      style="font-size: 28px; color: #fff; position: absolute"
      :style="{
        display: i == index ? '' : 'none',
        top: item.top,
        left: item.left,
      }"
    >
      {{ item.text }}
    </h1>
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
  methods: {
    init() {
      // 获取实例
      const container = this.$refs.container;
      // container.appendChild(stats.dom);
      // 创造一个场景
      scene = new THREE.Scene();
      // 加载辅助坐标系 实际应用的时候需要注释此代码
      const axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);
      // 创造一个几何体BoxGeometry  球体SphereGeometry

      // 获取材质

      var geometry2 = new THREE.BoxGeometry(100, 100, 100);
      let ary2 = [
        this.loadtexture(
          "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7184a2f2-3b0b-407a-adc8-4d450f35c1e7/f3790b7e-485e-4ceb-bda7-7e3b44462357.jpg"
        ),
        this.loadtexture(
          "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7184a2f2-3b0b-407a-adc8-4d450f35c1e7/f3790b7e-485e-4ceb-bda7-7e3b44462357.jpg"
        ),
        this.loadtexture(
          "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7184a2f2-3b0b-407a-adc8-4d450f35c1e7/f3790b7e-485e-4ceb-bda7-7e3b44462357.jpg"
        ),
        this.loadtexture(
          "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7184a2f2-3b0b-407a-adc8-4d450f35c1e7/f3790b7e-485e-4ceb-bda7-7e3b44462357.jpg"
        ),
        this.loadtexture(
          "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7184a2f2-3b0b-407a-adc8-4d450f35c1e7/f3790b7e-485e-4ceb-bda7-7e3b44462357.jpg"
        ),
        this.loadtexture(
          "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7184a2f2-3b0b-407a-adc8-4d450f35c1e7/f3790b7e-485e-4ceb-bda7-7e3b44462357.jpg"
        ),
      ];
      let material2 = [];
      ary2.forEach((item) => {
        let mater = new THREE.MeshDepthMaterial(item);
        material2.push(mater);
      });
      // var material2 = new THREE.MultiMaterial(ary2); //因为每个面都贴图片，所以参数是一个数组

      var mesh2 = new THREE.Mesh(geometry2, material2); //网格模型对象Mesh
      mesh2.position.set(200, 200, 0);
      scene.add(mesh2); //网格模型添加到场景中
      // var geometry = new THREE.BoxGeometry(10000, 30, 10000);
      // mesh = new THREE.Mesh(geometry, material);
      // mesh.position.set(0, -60, 0);
      // scene.add(mesh);

      // 球
      var cicle = new THREE.SphereGeometry(60, 60, 60);
      var material = new THREE.MeshDepthMaterial(ary2[0]);
      mesh = new THREE.Mesh(cicle, material);
      mesh.position.set(300, 350, 100);
      scene.add(mesh);
      //  圆柱
      var yuanzhu = new THREE.CylinderGeometry(20, 20, 180, 200);
      mesh = new THREE.Mesh(yuanzhu, material);
      mesh.position.set(100, 100, 100);
      // mesh.rotation.x = 0.5;
      // mesh.rotation.y = 0.5;
      scene.add(mesh);
      // 正方体
      // var geometry = new THREE.BoxGeometry(100, 100, 100);
      // mesh = new THREE.Mesh(geometry, material);
      // mesh.position.set(100, 100, 100);
      // scene.add(mesh);

      //  创建点光源组
      const pointLightGroup = new THREE.Group();
      pointLightGroup.position.set(300, 150, 90);
      let radius = 80; //围绕半径
      let pointlightArr = [];
      for (let i = 0; i < 3; i++) {
        // 创建球体当灯泡
        const SphereGeometry = new THREE.SphereGeometry(8, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiiveIntensity: 10,
        });
        // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sphere = new THREE.Mesh(SphereGeometry, sphereMaterial); //球
        pointlightArr.push(sphere);
        sphere.position.set(
          radius * Math.cos((i * 2 * Math.PI) / 3),
          Math.cos((i * 2 * Math.PI) / 3),
          radius * Math.sin((i * 2 * Math.PI) / 3)
        );

        let pointLight = new THREE.PointLight(0xffffff, 2);
        sphere.add(pointLight); //添加点光源

        // pointLight.castShadow = true;
        // pointLightArr.push(pointLight);
        pointLightGroup.add(sphere);
      }
      scene.add(pointLightGroup);

      // 使用补尖函数从0到2Π,使灯泡旋转
      let options = {
        angle: 0,
      };
      gsap.to(options, {
        angle: Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "linear",
        onUpdate: () => {
          pointLightGroup.rotation.y = options.angle;
          pointlightArr.forEach((item, index) => {
            item.position.set(
              radius * Math.cos((index * 2 * Math.PI) / 3),
              Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5) + 5,
              radius * Math.sin((index * 2 * Math.PI) / 3)
            );
          });
        },
      });

      // 精灵对象文字
      let canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 100;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.font = "100px 黑体";
      ctx.lineWidth = 4;
      ctx.fillText("精灵中文字体", 4, 104);
      let texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      let material1 = new THREE.SpriteMaterial({ map: texture });
      let text = new THREE.Sprite(material1);
      text.scale.set(0.5 * 100, 0.25 * 100, 0.75 * 100);
      text.position.set(200, 200, 200);
      scene.add(text);
      // 初始化解压模型
      const dracoloader = new DRACOLoader();
      dracoloader.setDecoderPath("./draco/gltf/");
      const gltfloader = new GLTFLoader();
      gltfloader.setDRACOLoader(dracoloader);
      gltfloader.load("/dgiot_file/3d/LittlestTokyo.glb", (gltf) => {
        const model = gltf.scene;

        model.position.set(1, 100, 0);
        console.log("这是模型LittlestTokyo", gltf);
        model.scale.x = 0.8;
        model.scale.y = 0.8;
        model.scale.z = 0.8;
        model.traverse((child) => {
          if (child.name === "Plane") {
            child.visiable;
          }
          if (child.isMesh) {
            child.castShadow = true;
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

      //
      const loader = new FBXLoader();
      // const loader = new Three.FBXLoader();
      // walkingman.fbx dancing
      loader.load(
        "/dgiot_file/3d/dancing.fbx",
        (fbx) => {
          console.log("这是模型1", fbx, fbx.animations, fbx.animations[0].name);
          this.model.fbx = fbx;
          this.model.fbx.position.set(200, -60, 100);
          this.model.fbx.scale.set(0.7, 0.7, 0.7);

          scene.add(this.model.fbx);
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
      loader.load(
        "/dgiot_file/3d/3ddemo/floor.fbx",
        (fbx) => {
          console.log("这是模型2", fbx);
          this.model.floor = fbx;
          this.model.floor.position.set(-300, -60, -100);
          this.model.floor.scale.set(0.1, 0.1, 0.1);
          scene.add(this.model.floor);
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
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
      var point = new THREE.PointLight(0xf2f2f2, 1);
      point.position.set(0, 0, 0); // 点光源位置
      point.castShadow = true; //阴影
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
      camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      // 相机位置
      camera.position.set(200, 300, 500); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向(指向的场景对象)

      // // 创造一个渲染器

      renderer = new THREE.WebGLRenderer({
        antialias: true, // 去锯齿
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true; //允许渲染器阴影
      renderer.physicallyCorrectLights = false;
      renderer.setClearColor(0x333333); // 设置背景颜色

      controls = new OrbitControls(camera, renderer.domElement); //用户交互
      controls.target.set(100, 0, 0);
      //设置相机的角度范围
      controls.maxPolarAngle = Math.PI * 0.5;
      //设置相机距离原点的最远距离
      controls.minDistance = 0;
      //设置相机距离原点的最远距离
      controls.maxDistance = 2000;
      // 把canvas挂载到container中
      container.appendChild(renderer.domElement);
      // id,name,value
      this.scenes = [
        {
          id:"dada",
          realdata:[
            {
              'name':'温度',
              'value':'15'
            }
          ],
          name: "场景1",
          text: "Hello,Threejs",
          top: "10%",
          left: "60%",
          callback: () => {
            // 执行函数切换位置
            this.translateCamara(
              new THREE.Vector3(200, 300, 500),
              new THREE.Vector3(100, 0, 0)
            );
          },
        },
        {
          name: "场景2",
          text: "3D世界环境欢迎你",
          top: "10%",
          left: "80%",
          callback: () => {
            // 执行函数切换位置
            this.translateCamara(
              new THREE.Vector3(180, 300, 200),
              new THREE.Vector3(100, 0, 0)
            );
          },
        },
        {
          name: "场景3",
          text: "探寻世界之秘",
          top: "40%",
          left: "30%",
          callback: () => {
            // 执行函数切换位置
            this.translateCamara(
              new THREE.Vector3(100, 30, 500),
              new THREE.Vector3(5, 2, 0)
            );
          },
        },
        {
          name: "场景4",
          text: "文字标签最常用的方法",
          top: "60%",
          left: "60%",
          callback: () => {
            // 执行函数切换位置
            this.translateCamara(
              new THREE.Vector3(100, 20, 0),
              new THREE.Vector3(5, 2, 0)
            );
          },
        },
        {
          name: "场景5",
          text: "保证能够显示在3D场景之上",
          top: "20%",
          left: "20%",
          callback: () => {
            // 执行函数切换位置
            this.translateCamara(
              new THREE.Vector3(100, 300, 50),
              new THREE.Vector3(100, 200, 0)
            );
          },
        },
      ];
      this.timeLine1 = gsap.timeline();
      this.timeLine2 = gsap.timeline();
      // console.log("ref000", ref(0));
      // this.index = ref(0);
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
#container {
  width: 100vw;
  height: 100vh;
}
</style>

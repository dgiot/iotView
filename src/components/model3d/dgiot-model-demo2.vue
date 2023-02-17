<!--  -->
<template>
  <div
    ref="container"
    id="model1"
    style="width: 100%; height: 100%; background-color: #000"
  ></div>
</template>

<script>
import * as Three from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
let scene = null,
  camera = null,
  renderer = null,
  mesh = null;
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
    return {};
  },
  mounted() {
    console.log("111111");
    this.init();
    this.animate();
  },
  methods: {
    init() {
      // 获取实例
      const container = this.$refs.container;
      // 创造一个场景
      scene = new Three.Scene();
      // 加载辅助坐标系 实际应用的时候需要注释此代码
      const axisHelper = new Three.AxesHelper(250);
      // scene.add(axisHelper)
      // 创造一个几何体BoxGeometry  球体SphereGeometry
      var geometry = new Three.BoxGeometry(100, 100, 100);
      var cicle = new Three.SphereGeometry(60, 60, 60);
      var yuanzhu = new Three.CylinderGeometry(20, 40, 180, 200);
      // 获取材质
      var material = new Three.MeshLambertMaterial({
        color: 0xff0000,
        opacity: 0.3,
        transparent: true,
      });
      // 圆形
      mesh = new Three.Mesh(cicle, material);
      scene.add(mesh);
      // // 圆柱
      mesh = new Three.Mesh(yuanzhu, material);
      scene.add(mesh);
      // var textureTree = new Three.TextureLoader().load("rain.png");
      // this.group = new Three.Group();
      // for (let i = 0; i < 1000; i++) {
      //   var spriteMaterial = new Three.SpriteMaterial({
      //     map: textureTree, //设置精灵纹理贴图
      //   });
      //   // 创建精灵模型对象
      //   mesh = new Three.Sprite(spriteMaterial);
      //   this.group.add(mesh);
      //   // 控制精灵大小,
      //   mesh.scale.set(8, 10, 1); //// 只需要设置x、y两个分量就可以
      //   var k1 = Math.random() - 0.5;
      //   var k2 = Math.random() - 0.5;
      //   var k3 = Math.random() - 0.5;
      //   // 设置精灵模型位置，在整个空间上上随机分布
      //   mesh.position.set(1920 * k1, 1080 * k3, 1500 * k2);
      // }
      // scene.add(this.group);
      // this.render()
      // scene.add(mesh)
      // 几何体和材质结合
      // material = new Three.MeshLambertMaterial({
      //   color: 0x3de4ff,
      //   opacity: 0.7,
      //   transparent: true,
      // });

      // 控制位置
      // mesh.position.set(0, 0, 0)
      // mesh.rotation.x = 0.3
      // mesh.rotation.y = 0.5
      // 把网格放到场景中
      //正方形
      // mesh = new Three.Mesh(geometry, material)
      // scene.add(mesh)

      /**
       * 光源设置
       */
      // 光线的照射
      var ambiColor = "#f2f2f2";
      var spotLight = new Three.SpotLight(ambiColor);
      spotLight.position.set(100, 200, 500);
      scene.add(spotLight);
      var spotLight2 = new Three.SpotLight(ambiColor);
      spotLight2.position.set(100, 100, 150);
      scene.add(spotLight2);
      // 点光源
      var point = new Three.PointLight(0xf2f2f2);
      point.position.set(100, 200, 500); // 点光源位置
      scene.add(point); // 点光源添加到场景中
      // 环境光
      var ambient = new Three.AmbientLight(0xffffff);
      scene.add(ambient);
      // 新建相机 PerspectiveCamera是透视相机 OrthographicCamera正射投影相机
      // 第一个参数是视角，第二个参数是横纵比，第三个参数是近面距离，第四个参数是远面距离
      var width = container.clientWidth; // 窗口宽度
      var height = container.clientHeight; // 窗口高度
      var k = width / height; // 窗口宽高比
      var s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      // -s * k, s * k, s, -s, 1, 1000
      camera = new Three.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      // 相机位置
      camera.position.set(100, 200, 500); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向(指向的场景对象)
      // // 创造一个渲染器
      renderer = new Three.WebGLRenderer({ antialias: true }); // 去锯齿
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0.1); // 设置背景颜色
      // 把canvas挂载到container中
      container.appendChild(renderer.domElement);
    },
    animate() {
      // 浏览器自动渲染下一帧
      requestAnimationFrame(this.animate);

      // 渲染到页面
      renderer.render(scene, camera);
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

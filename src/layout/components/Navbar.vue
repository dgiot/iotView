<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />
    <span class="treeflag_show" @click="handleChangeTree">
      <svg-icon icon-class="deptchange" />
    </span>
    <span class="fullscreen" @click="handleFullScreen">
      <i
        style="fontsize: 20px; cursor: pointer"
        class="el-icon-full-screen"
      ></i>
    </span>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="$FileServe + avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getDlinkJson, Startdashboard } from "@/api/Dashboard/index";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { setToken } from "@/utils/auth";
import Cookies from "js-cookie";
import mqtt from "mqtt";
var client;
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      avatar: "",
      objectId: "",
      client: "",
      option: {},
      queryParams: {},
      fullscreen: false,
      clientcount: 0,
      token:localStorage.getItem('sessionToken') || ''
    };
  },
  watch: {
    $route: {
      handler(route) {
        // console.log("route", route, Cookies.get("sidebarStatus"));
        // this.activeMenu = handleActivePath(route);
        console.log(
          'Cookies.get("sidebarStatus") ',
          Cookies.get("sidebarStatus")
        );
        if (
          route.fullPath.indexOf("/dashboard") >= 0 &&
          (Cookies.get("sidebarStatus") == 1 ||
            Cookies.get("sidebarStatus") == undefined)
        ) {
          this.$store.dispatch("app/toggleSideBar");
        }
        // route.fullPath.indexOf("/index") >= 0
        //   ? (this.isDeptShow = false)
        //   : (this.isDeptShow = true);
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["sidebar", "name", "treeFlag"]),
  },
  created() {
    Vue.prototype.$FileServe = Cookies.get("fileServer") || "";
  },
  async mounted() {
    this.objectId = localStorage.getItem("objectId");
    console.log("用户信息", this.objectId, this.token, this.name);
    this.$nextTick(async () => {
      await this.defaultSet();
    });
    const md5Info = {
      token: this.token,
      username: this.objectId,
      password: this.token,
      router: this.$route.fullPath,
    };
    this.$dgiotBus.$off(`MqttPublish`);
    this.$dgiotBus.$on(`MqttPublish`, (e) => {
      console.log("publish111111", e.pubTopic, e.message);
      client.publish(e.pubTopic, e.message);
    });
    this.$dgiotBus.$on("MqttConnect", (data) => {
      console.log("接收消息", data);
    });
    await this.Mqtt(md5Info);
    // this.queryData();
    // console.log(md5Info);
  },
  beforeDestroy() {
    console.log("关闭了mqtt");
    // client.disconnect();
    client.end();
  },
  methods: {
    //显示隐藏部门树
    handleChangeTree() {
      this.$store.dispatch("settings/changeSetting", {
        key: "treeFlag",
        value: !this.treeFlag,
      });
    },
    // 全屏事件
    //原文链接：https://blog.csdn.net/weixin_39550080/article/details/124823420
    handleFullScreen() {
      let element = document.documentElement;
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        console.log("已还原！");
      } else {
        // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
        console.log("已全屏！");
      }
      // 改变当前全屏状态
      this.fullscreen = !this.fullscreen;
    },
    async queryData() {
      let params = {
        type: "Dashboard",
      };
      const { dashboard = {} } = await getDlinkJson("Dashboard");
      let list = [];
      list.push(dashboard[1]);
      this.queryParams = list;
      // setTimeout(() => {
      //     this.queryParams.forEach((e) => {
      //       let key = e.vuekey
      //       this.loadingConfig[`${key}`] = true
      //     })
      //   }, 1240)
      // const Startdashboardid = "32511dbfe5";
      // await Startdashboard(Startdashboardid, this.queryParams);
    },
    async Mqtt(md5Info) {
      const { VUE_APP_URL, NODE_ENV } = process.env;
      const { hostname, protocol } = location;
      // console.log(location);
      const ip =
        NODE_ENV == "development"
          ? VUE_APP_URL.split("//")[1].split(":")[0]
          : hostname.split(":")[0]; // 修复代理带端口的问题
      console.log("地址", ip);
      this.option = {
        keepalive: 60,
        clientId: md5Info.token, // dlink 协议 user 认证改为user token
        ip,
        isSSL: protocol === "https:" ? true : false,
        port: protocol == "http:" ? 8083 : 8084,
        username: md5Info.username,
        password: md5Info.password,
        connectTimeout: 10 * 1000,
        router: md5Info.router,
      };
      // console.groupEnd();
      let head = this.option.isSSL ? "wss" : "ws";
      client = mqtt.connect(
        `${head}://${ip}:${this.option.port}/mqtt`,
        this.option
      ); //47.118.69.187
      this.mqttMsg();
      await this.$dgiotBus.$emit("MqttConnect", this.option);
      // this.$dgiotBus.$emit('MqttSubscribe', {
      //   router: md5(this.$route.fullPath),
      //   topic: 'h7ml/topic/test/1',
      //   ttl: 1000 * 60 * 60 * 3,
      //   created: Math.round(new Date() / 1000),
      //   qos: 0,
      // })
    },
    mqttMsg() {
      let _this = this;
      client.on("connect", (e) => {
        console.log("连接成功", e);
        // this.clientcount = 0;
      });
      client.on("message", (topic, message) => {
        console.log("收到来自", topic, "的消息", message);
        let sendtopic = topic.split("/");
        console.log(sendtopic);
        let sendTopic = `/${sendtopic[sendtopic.length - 3]}/${
          sendtopic[sendtopic.length - 2]
        }/${sendtopic[sendtopic.length - 1]}`;
        // return
        console.log(sendTopic);
        if (topic.indexOf("$dg/user/devicestate") >= 0) {
          sendTopic = "$dg/user/devicestate";
        } else if (topic.indexOf("$dg/user/realtimecard") >= 0) {
          sendTopic = `$dg/user/realtimecard/${sendtopic[sendtopic.length - 2]}`;
          console.log('实时数据',sendTopic);
        } else if (topic.indexOf("$dg/user/konva") >= 0) {
          sendTopic = "$dg/user/konva";
        }else if (topic.indexOf("realdata") >= 0) {
          sendTopic = "$dg/user/realdata";
        }
        _this.$dgiotBus.$emit(sendTopic, message);
      });
      client.on("reconnect", (error) => {
        console.log("正在重连", client);
        this.clientcount++;
        console.log(this.clientcount);
        if (this.clientcount >= 10) {
          client.end();
        }
        // client.end();
        // mqtt.client.disconnect();
      });
      client.on("error", (error) => {
        console.log("连接失败", error);
      });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      setToken("");
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    async defaultSet() {
      // this.backgroundImage = Cookies.get('startIframe')
      //   ? 'https://s2.loli.net/2021/12/15/ciVTb7w62rxQ3a9.jpg'
      //   : this.backgroundimage
      // console.log("环境", process.env.NODE_ENV, process.env.VUE_APP_BASE_API);
      const url =
        process.env.NODE_ENV === "development"
          ? process.env.VUE_APP_URL
          : location.origin;
      // console.log("url", url);
      Cookies.set("fileServer", url, { expires: 60 * 1000 * 30 });
      this.$FileServe = Cookies.get("fileServer") || "";
      this.avatar = localStorage.getItem("avatar") || "";
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .treeflag_show {
    position: absolute;
    right: 140px;
    top: 14px;
  }
  .fullscreen {
    position: absolute;
    right: 100px;
    top: 14px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

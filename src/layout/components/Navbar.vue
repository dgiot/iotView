<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

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
      queryParams: {},
    };
  },
  computed: {
    ...mapGetters(["sidebar", "token", "name"]),
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
    this.$dgiotBus.$on("MqttConnect", (data) => {
      console.log("接收消息", data);
    });
    await this.Mqtt(md5Info);
    this.queryData();
    // console.log(md5Info);
  },

  methods: {
    async queryData() {
      let params = {
        type:'Dashboard'
      }
      const { dashboard = {} } = await getDlinkJson(params);
      let list = []
      list.push(dashboard[1])
      this.queryParams = list;
      // setTimeout(() => {
      //     this.queryParams.forEach((e) => {
      //       let key = e.vuekey
      //       this.loadingConfig[`${key}`] = true
      //     })
      //   }, 1240)
      const Startdashboardid = "32511dbfe5";
      await Startdashboard(Startdashboardid,this.queryParams );
    },
    async Mqtt(md5Info) {
      const { VUE_APP_URL, NODE_ENV } = process.env;
      const { hostname, protocol } = location;
      console.log(location);
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
      client = mqtt.connect(`ws://${ip}:8083/mqtt`, this.option); //47.118.69.187
      this.mqttMsg();
      // dgiotlogger.info("MqttConnect", this.option);
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
      });
      client.on("message", (topic, message) => {
        console.log("收到来自", topic, "的消息", message);
        _this.$dgiotBus.$emit('send',message)
      });
      client.on("reconnect", (error) => {
        console.log("正在重连", error);
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
      this.$fileServer = Cookies.get("fileServer") || "";
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

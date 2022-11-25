<template>
  <div
    class="login-container"
    :style="{
      backgroundImage: 'url(' + backgroundImage + ')',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
    }"
  >
    <div class="bg_top">
      <div class="btn_back" @click="handleIn">
        <div class="btn_back_in">返回</div>
      </div>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      :class="isPC ? 'login-form' : 'login-move'"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">物联网平台</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入账号"
          name="username"
          clearable
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >

      <div class="tips">
        <a
          style="margin: 0 auto; cursor: pointer"
          href="https://aisuda.bce.baidu.com/amis/zh-CN/docs/index"
          target="_blank"
          >amis</a
        >
        <!-- <span> password: any</span> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { getNavigation } from "@/api/Navigation";
import { isPC } from "@/utils/index";
import { mapMutations } from "vuex"; //mapMutations，mapGetters
import Cookies from "js-cookie";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error("密码不能少于4位"));
      } else {
        callback();
      }
    };
    return {
      isPC: true,
      backgroundImage:
        "/dgiot_dashboard/public/assets/images/platform/assets/login_images/background.jpg",
      url: "",
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: "请输入账号" }],
        password: [
          // validatePassword
          { required: true, trigger: "blur", message: "请输入密码" },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  mounted() {
    this.isPC = isPC();
    console.log("是否为PC端", this.isPC);
    console.log(this.$route);
    if (this.$route.query) {
      this.loginForm.username = this.$route.query.username || "";
      this.loginForm.password = this.$route.query.password || "";
    }
    this.$nextTick(async () => {
      await this.defaultSet();
      this.backgroundImage = this.url + this.backgroundImage;
      // await this.init()
    });
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(async () => {
              console.log("成功");
              Vue.prototype.$FileServe = Cookies.get("fileServer") || "";
              const res = await getNavigation();
              // console.log("路由", res);
              let list = [];
              let item = {
                path: "/",
                url: "/",
                // component: Layout,
                redirect: "/dashboard",
                children: [
                  {
                    path: "dashboard",
                    url: "dashboard",
                    name: "Dashboard",
                    // component: () => import("@/views/dashboard/index"),
                    meta: { title: "首页", icon: "dashboard" },
                  },
                ],
              };
              list.push(item);
              res.results.forEach((item) => {
                if (item.url != "/" && item.url != "/roles") {
                  list.push(item);
                }
              });
              let routes = this.initRoutes(list);
              // console.log("路由", routes);
              localStorage.setItem("routes", JSON.stringify(routes));
              // let
              //  this.$store.commit("setRoutes", res.results);
              //  this.$store.commit("SET_NAME",'111');
              this.$router.push({ path: "/" }); //path: this.redirect ||
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    initRoutes(routes) {
      // console.log('routes',routes);
      routes.forEach((item) => {
        item.path = item.url;
        if (item.children) {
          this.initRoutes(item.children);
        }
        if (item.meta) {
          if (item.meta.title.indexOf("云") >= 0) {
            item.meta.icon = "el-icon-cloudy";
          }
          if (item.meta.title.indexOf("管理") >= 0) {
            item.meta.icon = "el-icon-s-management";
          }

          if (item.meta.title.indexOf("设备") >= 0) {
            item.meta.icon = "el-icon-monitor";
          }
          if (item.meta.title.indexOf("运维") >= 0 || item.meta.title.indexOf("设置") >= 0) {
            item.meta.icon = "el-icon-setting";
          }
          if (item.meta.title.indexOf("工单") >= 0) {
            item.meta.icon = "el-icon-s-order";
          }
          if (item.meta.title.indexOf("系统") >= 0) {
            item.meta.icon = "el-icon-s-help";
          }
          if (item.meta.title.indexOf("告警") >= 0) {
            item.meta.icon = "el-icon-bell";
          }
          if (item.meta.title.indexOf("数据") >= 0) {
            item.meta.icon = "el-icon-s-data";
          }
          if (item.meta.title.indexOf("日志") >= 0) {
            item.meta.icon = "el-icon-notebook-1";
          }
          if (
            item.meta.title.indexOf("园区") >= 0 ||
            item.meta.title.indexOf("建筑") >= 0
          ) {
            item.meta.icon = "el-icon-office-building";
          }

          if (item.meta.title.indexOf("工厂") >= 0) {
            item.meta.icon = "el-icon-school";
          }
          if (
            item.meta.title.indexOf("人") >= 0 ||
            item.meta.title.indexOf("员工") >= 0
          ) {
            item.meta.icon = "el-icon-user-solid";
          } else if (item.meta.title.indexOf("工序") >= 0) {
            item.meta.icon = "el-icon-s-operation";
          } else if (item.meta.title.indexOf("场景") >= 0) {
            item.meta.icon = "el-icon-picture-outline";
          } else if (item.meta.title.indexOf("质检") >= 0) {
            item.meta.icon = "el-icon-circle-check";
          } else if (item.meta.title.indexOf("监控") >= 0) {
            item.meta.icon = "el-icon-camera";
          } else if (item.meta.title.indexOf("票") >= 0) {
            item.meta.icon = "el-icon-s-ticket";
          } else if (item.meta.title.indexOf("信息") >= 0) {
            item.meta.icon = "el-icon-info";
          } else if (item.meta.title.indexOf("系统") >= 0) {
            item.meta.icon = "el-icon-data-analysis";
          } else if (item.meta.title.indexOf("控制") >= 0) {
            item.meta.icon = "el-icon-eleme";
          } else if (item.meta.title.indexOf("光") >= 0) {
            item.meta.icon = "el-icon-cpu";
          } else if (item.meta.title.indexOf("照明") >= 0) {
            item.meta.icon = "el-icon-s-opportunity";
          } else if (item.meta.title.indexOf("环") >= 0) {
            item.meta.icon = "el-icon-help";
          } else if (item.meta.title.indexOf("空调") >= 0) {
            item.meta.icon = "el-icon-receiving";
          } else if (item.meta.title.indexOf("能耗") >= 0) {
            item.meta.icon = "el-icon-magic-stick";
          } else if (item.meta.title.indexOf("机械") >= 0) {
            item.meta.icon = "material";
          } else if (item.meta.title.indexOf("停车") >= 0) {
            item.meta.icon = "stop";
          }
          if(item.meta.title.indexOf("对战") >= 0){
            item.meta.icon = "fight";
          }else if(item.meta.title.indexOf("射击") >= 0){
            item.meta.icon = "shooting";
          }else if(item.meta.title.indexOf("跑") >= 0){
            item.meta.icon = "run";
          }else if(item.meta.title.indexOf("跳") >= 0){
            item.meta.icon = "jump";
          }else if(item.meta.title.indexOf("投") >= 0){
            item.meta.icon = "throw";
          }

          // console.log("mata", item.meta);
          // el-icon-cloudy
        }
      });
      return routes;
    },
    async defaultSet() {
      // this.backgroundImage = Cookies.get('startIframe')
      //   ? 'https://s2.loli.net/2021/12/15/ciVTb7w62rxQ3a9.jpg'
      //   : this.backgroundimage
      console.log("环境", process.env.NODE_ENV, process.env.VUE_APP_BASE_API);
      const url =
        process.env.NODE_ENV === "development"
          ? process.env.VUE_APP_URL
          : location.origin;
      console.log("url", url);
      Cookies.set("fileServer", url, { expires: 60 * 1000 * 30 });
      this.url = url;
      // console.log('这是路径',url);
    },
    handleIn() {
      // console.log(window.location);
      window.location.href = window.location.origin;
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  position: relative;
  .bg_top {
    position: absolute;
    width: 100%;
    height: 60px;
    /* z-index: 100; */
    /* box-sizing: border-box; */
  }
  /* // 新样式 */
  .btn_back {
    width: 150px;
    height: 48px;
    position: absolute;
    right: 20px;
    padding: 4px;
    top: 48px;
    background: url("../../assets/bg/experience-back.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
    font-size: 20px;
    line-height: 48px;
    color: #caf2ff;
    font-weight: 600;
    cursor: pointer;
    box-sizing: border-box;
    /* // margin-top: 48px; */
    /* // margin-left: 20px; */
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100%;
  width: 100%;
  // background-color: $bg;
  // overflow: hidden;
  // /dgiot_dashboard/public/assets/images/platform/assets/login_images/background.jpg
  // background: url("http://flow.hzmctech.com/dgiot_dashboard/public/assets/images/platform/assets/login_images/background.jpg")
  //   no-repeat 100% 100%;
  // background-size: cover;
  // background-repeat: "no-repeat" !important;
  // background-size: "100% 100%" !important;
  .login-form {
    position: absolute;
    right: 10%;
    top: 30%;
    background-color: #002d55;
    width: 375px;
    max-width: 100%;
    padding: 40px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: 1px 1px 12px 2px rgba(5, 106, 190, 0.5);
  }
  .login-move {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #002d55;
    width: 375px;
    max-width: 100%;
    padding: 40px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: 1px 1px 12px 2px rgba(5, 106, 190, 0.5);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

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
    <!--isPC ? 'login-form' : 'login-move' -->
    <el-form
      v-if="isPhone"
      ref="phoneForm"
      :model="phoneForm"
      :rules="phoneRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">物联网平台</h3>
        <div class="login_mode">
          <span
            @click="handleToCheckModel(1)"
            class="login_mode_code"
            :class="{ green: isPhone }"
            >短信登录</span
          >
          <span
            v-if="isPwdShow"
            @click="handleToCheckModel(-1)"
            class="login_mode_pwd"
            :class="{ green: !isPhone }"
            >密码登录</span
          >
        </div>
      </div>

      <!-- clearable -->
      <el-form-item prop="phone" style="position: relative">
        <span class="svg-container">
          <svg-icon icon-class="phone" />
        </span>
        <el-input
          ref="phone"
          v-model="phoneForm.phone"
          placeholder="请输入手机号"
          name="phone"
          @input="handleListenPhone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
        <span class="send" v-if="send" @click="handleSend">发送</span>
        <span v-if="alreadySend" class="send" bindtap="sendMsg">{{
          second + "s"
        }}</span>
      </el-form-item>

      <el-form-item prop="code">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <el-input
          :key="passwordType"
          ref="code"
          v-model="phoneForm.code"
          :type="passwordType"
          placeholder="请输入验证码"
          name="code"
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
      <!-- <el-form-item> -->
      <el-checkbox style="color: #ccc" v-model="checked"
        >我已阅读并同意
        <a
          target="blank"
          href="https://prod.dgiotcloud.cn/dgiot_file/dgiot用户协议.html"
          class="user_intruction"
          >《用户协议》</a
        >和
        <a
          target="blank"
          href="https://prod.dgiotcloud.cn/dgiot_file/dgiot隐私协议.html"
          class="user_intruction"
          >《隐私政策》</a
        >
      </el-checkbox>
      <div>
        <span
          style="
            margin-top: 4px;
            color: #fa8919;
            display: inline-block;
            background-color: rgba(251, 245, 238, 0.8);
            padding: 0 4px;
            border-radius: 4px;
          "
          >请阅读并勾选协议</span
        >
      </div>
      <!-- </el-form-item> -->

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-top: 15px; margin-bottom: 30px"
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
      </div>
    </el-form>
    <el-form
      v-else
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">物联网平台</h3>
        <div class="login_mode">
          <span
            @click="handleToCheckModel(1)"
            class="login_mode_code"
            :class="{ green: isPhone }"
            >短信登录</span
          >
          <span
            @click="handleToCheckModel(-1)"
            class="login_mode_pwd"
            :class="{ green: !isPhone }"
            >密码登录</span
          >
        </div>
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
          @keyup.enter.native="handleLogin1"
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
        @click.native.prevent="handleLogin1"
        >登录</el-button
      >

      <div class="tips">
        <a
          style="margin: 0 auto; cursor: pointer"
          href="https://aisuda.bce.baidu.com/amis/zh-CN/docs/index"
          target="_blank"
          >amis</a
        >
      </div>
    </el-form>
    <div
      style="
        position: absolute;
        bottom: 1px;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
      "
      v-if="isPC"
    >
      <a href="https://beian.miit.gov.cn/" style="color: #fff" target="_blank">
        Copyright © 2022 DGIOT All Rights Reserved 浙ICP备2021037683号-1
      </a>
    </div>
  </div>
</template>

<script>
import { validUsername, isvalidPhone } from "@/utils/validate";
import { getNavigation } from "@/api/Navigation";
import { isPC } from "@/utils/index";
import { Roletree, postCode } from "@/api/User/index";
import { postCookie } from "@/api/Dashboard/index";
import { mapMutations } from "vuex"; //mapMutations，mapGetters
import Cookies from "js-cookie";
import { getToken } from "@/utils/auth";
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
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!isvalidPhone(value)) {
        //判断用户输入的值是否符合规则
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      isPC: true,
      backgroundImage:
        "/dgiot_dashboard/public/assets/images/platform/assets/login_images/background.jpg",
      url: "",
      checked: false,
      loginForm: {
        username: "",
        password: "",
      },
      phoneForm: {
        phone: "",
        code: "",
      },
      phoneRules: {
        phone: [
          {
            required: true,
            trigger: "blur",
            // message: "请输入手机号",
            validator: validPhone,
          },
        ],
        code: [
          // validatePassword
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: "请输入账号" }],
        password: [
          // validatePassword
          { required: true, trigger: "blur", message: "请输入密码" },
        ],
      },
      loading: false,
      passwordType: "",
      redirect: undefined,
      alreadySend: false,
      send: false,
      second: 60,
      setTimer: "",
      isPhone: true,
      isPwdShow: false,
    };
  },
  mounted() {
    console.log("this.$route.query", this.$route.query);
    let isPhone = localStorage.getItem("isPhone") || true;
    if (isPhone == 'false') {
      this.isPhone = false;
      this.isPwdShow = true;
    }
    // if (this.$route.query.isPhone == 'false') {
    //   this.isPhone = false;
    // }
    this.isPC = isPC();
    console.log("是否为PC端", this.isPC, this.$route.query);
    localStorage.setItem("isPC", this.isPC);
    // console.log(this.$route);
    if (this.$route.query.username && this.$route.query.password) {
      this.loginForm.username = this.$route.query.username || "";
      this.loginForm.password = this.$route.query.password || "";
      localStorage.setItem("dgiotusername", this.loginForm.username);
      localStorage.setItem("dgiotpassword", this.loginForm.password);
    } else {
      this.loginForm.username = localStorage.getItem("dgiotusername") || "";
      this.loginForm.password = localStorage.getItem("dgiotpassword") || "";
    }
    console.log("this.loginForm", this.loginForm);
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
    handleSend() {
      // let data = {
      //   account: this.phoneForm.phone,
      // };
      let reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/;
      // console.log();
      if (reg.test(this.phoneForm.phone)) {
        postCode(this.phoneForm.phone)
          .then((res) => {
            this.alreadySend = true;
            this.send = false;
            //     this.setData({
            //   alreadySend: true,
            //   send: false
            // })

            this.timer();
          })
          .catch((err) => {
            console.log("err", err);
            // this.$message({
            //   message: err.msg,
            //   type: "error",
            // });
          });
      }
    },
    handleToCheckModel(value) {
      if (value == 1) {
        this.isPhone = true;
        this.loginForm.username = localStorage.getItem("dgiotusername") || "";
        this.loginForm.password = localStorage.getItem("dgiotpassword") || "";
        this.passwordType = "";
      } else {
        this.isPhone = false;
        // this.loginForm.username = "";
        // this.loginForm.password = "";
        this.passwordType = "password";
      }
    },
    timer() {
      let promise = new Promise((resolve, reject) => {
        this.setTimer = setInterval(() => {
          this.second = this.second - 1;
          // this.setData({
          //   second: this.data.second - 1,
          // });
          if (this.second <= 0) {
            this.second = 60;
            this.alreadySend = false;
            this.send = true;
            // this.setData({
            //   second: 60,
            //   alreadySend: false,
            //   send: true,
            // });
            resolve(this.setTimer);
          }
        }, 1000);
      });
      promise.then(() => {
        if (this.setTimer) {
          clearInterval(this.setTimer);
        }
      });
    },
    handleListenPhone(e) {
      let reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/;
      // console.log();
      if (reg.test(e)) {
        if (!this.alreadySend) {
          this.send = true;
        }
      }
    },
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
    // 密码登录
    handleLogin1() {
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
                meta: {
                  title: "首页",
                  icon: "dashboard",
                  hidden: false,
                },
                children: [
                  {
                    path: "/dashboard",
                    url: "/dashboard",
                    name: "Dashboard",
                    // component: () => import("@/views/dashboard/index"),
                    meta: { title: "首页", icon: "dashboard", hidden: false },
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
              let routelist = [];
              // 过滤admin 中的路由
              routes.forEach((element, index) => {
                if (element.children) {
                  if (
                    element.children[0].url.indexOf("amis") >= 0 ||
                    element.children[0].name.indexOf("Dashboard") >= 0
                  ) {
                    routelist.push(element);
                  }
                } else {
                  routelist.push(element);
                }
              });
              localStorage.setItem("routes", JSON.stringify(routelist)); //路由列表
              let roletree = await Roletree();
              localStorage.setItem(
                "dgiotroletree",
                JSON.stringify(roletree.results)
              );
              // console.log("树", roletree);
              //  this.$store.commit("setRoutes", res.results);
              //  this.$store.commit("SET_NAME",'111');

              // 设置使用什么地图
              let data = {
                UserSession: getToken() || "",
                cookie: {
                  mapType: "baidu",
                },
              };
              await postCookie(data);
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
    handleLogin() {
      if (!this.checked) {
        this.$message("请阅读并勾选协议后进行登录");
        return;
      }
      this.$refs.phoneForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.loading = true;
          let params = Object.assign(this.loginForm, this.phoneForm);
          console.log(params);
          // return;
          if (!params.username || !params.password) {
            this.$message("当前未选择体验场景，将返回选择体验场景");
            this.loading = false;
            setTimeout(() => {
              window.location.href = window.location.origin;
            }, 2000);
            return;
          }

          this.$store
            .dispatch("user/codelogin", params)
            .then(async () => {
              localStorage.setItem("isPhone", false);
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
                meta: {
                  title: "首页",
                  icon: "dashboard",
                  hidden: false,
                },
                children: [
                  {
                    path: "/dashboard",
                    url: "/dashboard",
                    name: "Dashboard",
                    // component: () => import("@/views/dashboard/index"),
                    meta: { title: "首页", icon: "dashboard", hidden: false },
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
              let routelist = [];
              // 过滤admin 中的路由
              routes.forEach((element, index) => {
                if (element.children) {
                  if (
                    element.children[0].url.indexOf("amis") >= 0 ||
                    element.children[0].name.indexOf("Dashboard") >= 0
                  ) {
                    routelist.push(element);
                  }
                } else {
                  routelist.push(element);
                }
              });
              localStorage.setItem("routes", JSON.stringify(routelist)); //路由列表
              let roletree = await Roletree();
              localStorage.setItem(
                "dgiotroletree",
                JSON.stringify(roletree.results)
              );
              // console.log("树", roletree);
              //  this.$store.commit("setRoutes", res.results);
              //  this.$store.commit("SET_NAME",'111');

              // 设置使用什么地图
              let data = {
                UserSession: getToken() || "",
                cookie: {
                  mapType: "baidu",
                },
              };
              await postCookie(data);
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
      routes.forEach((item, i) => {
        item.path = item.url;
        if (item.children) {
          this.initRoutes(item.children);
        }
        if (item.meta && item.meta.icon.indexOf("dgiot_file") < 0) {
          if (item.meta.title.indexOf("云") >= 0) {
            item.meta.icon = "el-icon-cloudy";
          }
          if (item.meta.title.indexOf("管理") >= 0) {
            item.meta.icon = "el-icon-s-management";
          }

          if (item.meta.title.indexOf("设备管理") >= 0) {
            item.meta.icon = "el-icon-monitor";
          }
          if (
            item.meta.title.indexOf("运维") >= 0 ||
            item.meta.title.indexOf("设置") >= 0
          ) {
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
          // if (item.meta.title.indexOf("数据") >= 0) {
          //   item.meta.icon = "el-icon-s-data";
          // }
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
          } else if (
            item.meta.title.indexOf("光") >= 0 ||
            item.meta.title.indexOf("支路") >= 0
          ) {
            item.meta.icon = "el-icon-cpu";
          } else if (item.meta.title.indexOf("照明") >= 0) {
            item.meta.icon = "el-icon-s-opportunity";
          } else if (item.meta.title.indexOf("空调") >= 0) {
            item.meta.icon = "el-icon-receiving";
          } else if (item.meta.title.indexOf("能耗") >= 0) {
            item.meta.icon = "el-icon-magic-stick";
          } else if (item.meta.title.indexOf("机械") >= 0) {
            item.meta.icon = "material";
          } else if (item.meta.title.indexOf("停车") >= 0) {
            item.meta.icon = "stop";
          }
          if (item.meta.title.indexOf("对战") >= 0) {
            item.meta.icon = "fight";
          } else if (item.meta.title.indexOf("射击") >= 0) {
            item.meta.icon = "shooting";
          } else if (item.meta.title.indexOf("跑") >= 0) {
            item.meta.icon = "run";
          } else if (item.meta.title.indexOf("跳") >= 0) {
            item.meta.icon = "jump";
          } else if (item.meta.title.indexOf("投") >= 0) {
            item.meta.icon = "throw";
          }

          // console.log("mata", item.meta);
          // el-icon-cloudy
        }
      });
      return routes;
    },
    async defaultSet() {
      // console.log("环境", process.env.NODE_ENV, process.env.VUE_APP_BASE_API);
      const url =
        process.env.NODE_ENV === "development"
          ? process.env.VUE_APP_URL
          : location.origin;
      Cookies.set("fileServer", url, { expires: 60 * 1000 * 30 });
      this.url = url;
    },
    handleIn() {
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
    .btn_back_in {
      margin-top: -4px;
      text-shadow: 2px 3px 1px #000;
    }
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
  .send {
    position: absolute;
    display: inline-block;
    width: 40px;
    right: 2%;
    top: 10%;
    color: #fff;
    cursor: pointer;
  }
  .user_intruction {
    color: #fff;
  }
  .user_intruction:hover {
    color: #00c6fe;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #bbb !important;
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
  // background: url("http://192.168.1.10/dgiot_dashboard/public/assets/images/platform/assets/login_images/background.jpg")
  //   no-repeat 100% 100%;
  // background-size: cover;
  // background-repeat: "no-repeat" !important;
  // background-size: "100% 100%" !important;
  @media screen and (min-width: 600px) {
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
  }
  @media screen and (max-width: 600px) {
    .login-form {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #002d55;
      width: 325px;
      max-width: 100%;
      padding: 40px 35px 0;
      margin: 0 auto;
      overflow: hidden;
      box-shadow: 1px 1px 12px 2px rgba(5, 106, 190, 0.5);
    }
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
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
    .login_mode {
      display: flex;
      // justify-content: center;
      margin-bottom: 10px;
      color: #fff;
      span {
        display: block;
        cursor: pointer;
      }
      .green {
        color: #00c6fe;
        border-bottom: 2px solid #00c6fe;
      }
      .login_mode_code {
      }
      .login_mode_pwd {
        margin-left: 10px;
      }
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
    // aspect-ratio: 16/9;
  }
}
</style>

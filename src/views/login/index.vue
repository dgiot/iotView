<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
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
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", message: '请输入账号' }],
        password: [
          // validatePassword
          { required: true, trigger: "blur", message: '请输入密码' },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  mounted() {
    console.log(this.$route);
    if(this.$route.query){
      this.loginForm.username = this.$route.query.username || ''
      this.loginForm.password = this.$route.query.password || ''
    }
    this.$nextTick(async () => {
      await this.defaultSet();
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
                url:'/',
                // component: Layout,
                redirect: "/dashboard",
                children: [
                  {
                    path: "dashboard",
                    url:'dashboard',
                    name: "Dashboard",
                    // component: () => import("@/views/dashboard/index"),
                    meta: { title: "首页", icon: "dashboard" },
                  },
                ],
              };
              list.push(item);
              res.results.forEach((item) => {
                if (item.url != "/"&&item.url != "/roles") {
                  list.push(item);
                }
              });
              let routes = this.initRoutes(list);
              // console.log("路由", routes);
              localStorage.setItem("routes", JSON.stringify(routes));
              // let
              //  this.$store.commit("setRoutes", res.results);
              //  this.$store.commit("SET_NAME",'111');
              this.$router.push({ path: this.redirect || "/" });
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
      console.log('routes',routes);
      routes.forEach((item) => {
        item.path = item.url;
        if (item.children) {
          this.initRoutes(item.children);
        }
        if(item.meta&&item.children){
          item.meta.icon = 'el-icon-menu'
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
  background: url("../../assets/static/background.jpg") no-repeat 100% 100%;
  background-size: cover;
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

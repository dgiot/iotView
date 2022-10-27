<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routeslist"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getNavigation } from "@/api/Navigation/index";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import Layout from "@/layout";
export default {
  components: { SidebarItem, Logo },
  mounted() {
    console.log(this.$router.options.routes);
  },
  data() {
    return {
      routeslist: JSON.parse(localStorage.getItem('routes')) || []
    };
  },
  async mounted() {
    // const res = await getNavigation();
    console.log("路由", localStorage.getItem('routes'));
    // localStorage.setItem("routes", res.results);
    return 
    this.routeslist = [
        {
          path: "/",
          // component: Layout,
          redirect: "/dashboard",
          children: [
            {
              path: "dashboard",
              name: "Dashboard",
              // component: () => import("@/views/dashboard/index"),
              meta: { title: "首页", icon: "dashboard" },
            },
          ],
        },
        {
          path: "/amis/View/63aeba715c",
          name: "zz",
          component: () => import("@/views/CloudOc/AmisPage/index"),
          hidden: true,
          meta: {
            title: "职务管理",
            icon: "plus",
            // amisComponent: "/amis/tabs",
          },
        },
        {
          path: "/work",
          component: Layout,
          redirect: "/amis/theme",
          name: "Amis",
          meta: {
            title: "云工厂",
            icon: "form",
            // amisComponent: "/amis/tabs",
          },
          children: [
            {
              path: "/amis/View/63aeba715c",
              name: "zz",
              component: () => import("@/views/CloudOc/AmisPage/index"),
              meta: {
                title: "工人管理",
                icon: "form",
                // amisComponent: "/amis/tabs",
              },
            },

            {
              path: "/amis/View/c13e05f354",
              name: "zz",
              // component: () => import("@/views/CloudOc/AmisPage/index"),
              meta: {
                title: "订单管理",
                icon: "el-icon-eleme",
              },
            },
          ],
        },
        {
          path: "/material",
          component: Layout,
          // redirect: "/amis/theme",
          name: "Amis",
          children: [
            {
              path: "/amis/View/50232b6506",
              name: "zz",
              component: () => import("@/views/CloudOc/AmisPage/index"),
              meta: {
                title: "物料管理",
                icon: "form",
                amisComponent: "/amis/tabs",
              },
            },
          ],
        },
        {
          path: "/data",
          component: Layout,
          name: "Amis",
          children: [
            {
              path: "/amis/View/878d215e79",
              name: "zz",
              component: () => import("@/views/CloudOc/AmisPage/index"),
              meta: {
                title: "数据管理",
                icon: "info",
              },
            },
          ],
        },
        //      {
        //   path: '/amis/View/:id',
        //   name: 'tabs',
        //   component: () => import('@/views/CloudOc/AmisPage/index'),
        //   meta: { title: '测试导航栏', icon: 'form' }
        // },
      ];
  },
  methods: {
    // filterAsyncRoutes(routes, roles) {
    //   const res = [];
    //   routes.forEach((route) => {
    //     const tmp = { ...route };
    //     if (hasPermission(roles, tmp)) {
    //       if (tmp.children) {
    //         tmp.children = filterAsyncRoutes(tmp.children, roles);
    //       }
    //       res.push(tmp);
    //     }
    //   });
    //   return res;
    // },
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
};
</script>

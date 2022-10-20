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
      routeslist: [
        {
          path: "/",
          component: Layout,
          redirect: "/dashboard",
          children: [
            {
              path: "dashboard",
              name: "Dashboard",
              component: () => import("@/views/dashboard/index"),
              meta: { title: "首页", icon: "dashboard" },
            },
          ],
        },
        {
          path: "/order",
          component: Layout,
          redirect: "/amis/theme",
          name: "Amis",
          children: [
            {
              path: "/amis/View/c13e05f354",
              name: "zz",
              component: () => import("@/views/CloudOc/AmisPage/index"),
              meta: {
                title: "订单管理",
                icon: "el-icon-eleme",
              },
            },
          ],
        },
        {
          path: "/work",
          component: Layout,
          redirect: "/amis/theme",
          name: "Amis",
          meta: {
            title: "人员管理",
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
              path: "/amis/View/09f15f657b",
              name: "zz",
              component: () => import("@/views/CloudOc/AmisPage/index"),
              meta: {
                title: "职务管理",
                icon: "plus",
                // amisComponent: "/amis/tabs",
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
      ],
    };
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

<template>
  <div v-if="item.meta && !item.meta.hidden" @click="handleBarClick(item)">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="(child, index) in item.children"
        :key="child.path + index"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {
      isJump: true,
      isPC: localStorage.getItem("isPC") || "",
    };
  },
  methods: {
    handleBarClick(item) {
      if (this.isPC) {
        if (item.children && item.children.length > 1) {
          if (
            JSON.stringify(item.children) != localStorage.getItem("dgiottopbar")
          ) {
            console.log("变化111111", item);
            localStorage.setItem("dgiottopbar", JSON.stringify(item.children));
            this.$dgiotBus.$emit("activePath", item.children[0]);
            let flag = true;
            // 防止多层路由导航栏时无法点击跳转
            item.children.forEach((item) => {
              if (item.children && item.children.length >= 1) {
                flag = false;
              }
            });
            //
            if (!flag) {
              localStorage.setItem("dgiottopbar", "[]");
              this.$dgiotBus.$emit("activePath", {});
            }
            if (flag && item.parent == "0") {
              this.$router.push({
                path: item.children[0].path,
              });
            }
          }
        } else if (item.children && item.children.length == 1) {
          // console.log("变化", item);
          if (
            JSON.stringify(item.children) != localStorage.getItem("dgiottopbar")
          ) {
            localStorage.setItem("dgiottopbar", "[]");
            this.$dgiotBus.$emit("activePath", item.children[0]);
          }
        } else {
          this.$dgiotBus.$emit("activePath", item);
        }
      }
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>

<template>
  <el-container>
    <el-aside
      :style="{
        width: treeFlag ? '15%' : '0',
        minWidth: treeFlag ? '10%' : '0',
        maxWidth: treeFlag ? '30%' : '0%',
      }"
    >
      <dgiot-role-tree />
    </el-aside>
    <el-main style="padding: 0">
      <div class="bar_top">
        <div class="bar_top_right">
          <span
            class="bar_top_item"
            :class="
              item.objectId == activePath.objectId ? 'bar_top_item_active' : ''
            "
            v-for="(item, index) in topBar"
            :key="index"
            >{{ item.meta.title }}</span
          >
        </div>
      </div>
      <section class="app-main">
        <transition name="fade-transform" mode="out-in">
          <div>
            <!-- <amis v-if="isAmis" :schema="schema" /> -->
            <!-- <router-view v-show="!isAmis" :key="key" /> -->
            <router-view v-if="routerView" :key="key" />
          </div>
        </transition>
      </section>
    </el-main>
  </el-container>
</template>

<script>
import DgiotRoleTree from "@/components/DgiotRoleTree/index.vue";
import amis from "@/components/Amis/index.vue";
import { mapGetters } from "vuex";
export default {
  name: "AppMain",
  components: { amis, DgiotRoleTree },
  data() {
    return {
      routerView: true,
      activePath: {},
    };
  },
  computed: {
    ...mapGetters(["treeFlag"]),
    topBar() {
      return JSON.parse(localStorage.getItem("dgiottopbar")) || [];
    },
    key() {
      return this.$route.path;
    },
    isAmis() {
      return !!this.$route.meta.amisComponent;
    },
    schema() {
      return require(`../../views${this.$route.meta.amisComponent}.json`);
    },
  },
  created() {
    this.$dgiotBus.$off("reload-router-view");

    // 单页面情况下重载路由
    this.$dgiotBus.$on("reload-router-view", () => {
      this.routerView = false;
      // if (showProgressBar) DgiotProgress.start()
      this.$nextTick(() => {
        this.routerView = true;
        // setTimeout(() => {
        //   if (showProgressBar) DgiotProgress.done()
        // }, 200)
      });
    });
  },
  mounted() {
    this.$dgiotBus.$off("activePath");
    this.$dgiotBus.$on("activePath", (e) => {
      console.log("activePath", e);
      this.activePath = e;
    });
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
.node-tree {
  height: 85vh;
  margin: 12px 0 auto 12px;
  text-align: center;
}
.bar_top {
  display: flex;
  justify-content: flex-end;
  .bar_top_right {
    // float: right;
    // background-color: aqua;
  }
  .bar_top_item {
    margin-right: 10px;
    display: inline-block;
    font-size: 16px;
    padding: 5px 16px;
  }
}
.bar_top_item_active {
  border-bottom: 4px solid #5fb878;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>

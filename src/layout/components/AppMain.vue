<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <div>
        <amis v-if="isAmis" :schema="schema" />
        <router-view v-show="!isAmis" :key="key" />
      </div>
    </transition>
  </section>
</template>

<script>
import amis from '@/components/Amis/index.vue'
export default {
  name: 'AppMain',
  components: { amis },
  computed: {
    key() {
      return this.$route.path
    },
    isAmis() {
      return !!this.$route.meta.amisComponent
    },
    schema() {
      return require(`../../views${this.$route.meta.amisComponent}.json`)
    }
  }
}

</script>

<style scoped>
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
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>

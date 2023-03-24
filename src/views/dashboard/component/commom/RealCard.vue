<template>
  <div class="wrap_card" :style="{ height: height }" v-infinite-scroll>
    <div v-for="(value, index) in cardList" :key="index" style="height: auto">
      <h2>{{ value.name }}</h2>
      <div class="flex_col">
        <!-- <div > -->
        <el-card
          v-for="(item, index) in value.data"
          :key="index"
          class="box-card"
        >
          <div slot="header" class="clearfix">
            <span>{{ item.name }}</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text"
                    >操作按钮</el-button
                  > -->
          </div>
          <div class="card_content">
            <el-avatar :size="50">
              <img
                :src="
                  item.imgurl
                    ? item.imgurl.indexOf('//') >= 0
                      ? item.imgurl
                      : $FileServe + item.imgurl
                    : avator
                "
              />
            </el-avatar>
            <div
              class="card_content_number"
              :style="{ 'font-size': fontsize || '1em' }"
            >
              {{ item.number }} {{ item.unit }}
            </div>
          </div>
          <div class="card_bottom">
            {{ item.time }}
          </div>
        </el-card>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RealCard",
  props: {
    cardList: {
      type: Array,
      default: () => [],
    },
    avator: {
      type: String,
    },
    fontsize: {
      type: String,
    },
    height: {
      type: String,
      default: () => {
        return "700px";
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap_card {
  // height: 700px;
  // background-color: #12ae7b;
  width: 100%;
  overflow: auto;
  .flex_col {
    display: flex;
    flex-wrap: wrap;
  }
  .box-card {
    width: 260px;
    margin: 15px;
    display: flex;
    flex-direction: column;

    .card_content {
      padding: 10px 4px 10px 14px;
      display: flex;
      line-height: 50px;

      font-size: 1.75em;
      color: #1b89cd;
      .card_content_number {
        flex: 1;
        text-align: center;
      }
    }
    .card_bottom {
      line-height: 20px;
      text-align: center;
      margin-top: 4px;
    }
    // margin-left: 10px;
  }
  // overflow: scroll;
}
</style>

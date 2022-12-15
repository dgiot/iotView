<template>
  <div class="role-tree">
    <h4 v-show="currentDepartment.depname" class="role-tree-header">
      当前部门 {{ currentDepartment.name }}
    </h4>
    <el-tree
      ref="tree"
      accordion
      :highlight-current="highlight"
      :show-checkbox="false"
      class="role-tree-select"
      :data="roleTree"
      node-key="objectId"
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node }" class="span__">
        <i class="el-icon-plus" @click="handleClickAdd(node)"></i>
        <span class="tree-node-span" style="fontsize: 16px">
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import { getToken } from "@/api/User/index";
export default {
  name: "DgiotRoleTree",
  data() {
    return {
      highlight: true,
      department: JSON.parse(localStorage.getItem("dgiotroletree")) || [],
      currentDepartment: {
        depname: "sa",
        name: "saas",
      },
    };
  },
  created() {
    console.log("111111");
  },
  computed: {
    roleTree: () => {
      return JSON.parse(localStorage.getItem("dgiotroletree")) || [];
    },
  },
  methods: {
    handleClickAdd(node) {},
    async getcamera(id, children) {
      // const res = await getDevcamera(id);

      let list = [
        {
          label: "设备1",
          objectId: "dadfafdas",
        },
        {
          label: "设备2",
          objectId: "Saafafs",
        },
      ];
      children.concat(...list);
      console.log(children);
      this.$nextTick(() => {
        //划重点了  $nextTick 不懂得上网查一下
        // this.$refs["tree"].updateKeyChildren(id, children);
        //id 是对应要添加到那个节点的id
        //res.data 是添加的新数据
      });
    },

    async handleNodeClick(data, checked) {
      console.log(data, checked);
      let params = {
        name: data.label,
      };
      this.getcamera(data.objectId, checked.childNodes);
      const res = await getToken(params);
      this.$dgiotBus.$emit("reload-router-view");
    },
  },
};
</script>
<style lang="scss">
/* 点击后的当前节点的样式 */
.el-tree-node.is-current > .el-tree-node__content {
  color: rgb(64, 158, 255);
  background: rgb(48, 65, 86);
}
</style>
<style lang="scss" scoped>
.role-tree-header {
  text-align: center;
  padding: 5px;
}
</style>

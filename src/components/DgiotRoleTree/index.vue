<template>
  <div class="role-tree">
    <h4 class="role-tree-header">当前部门 {{ selectDepart }}</h4>
    <el-tree
      ref="tree"
      v-loading="loading"
      accordion
      :highlight-current="highlight"
      :show-checkbox="false"
      class="role-tree-select"
      :data="roleTree"
      :default-expanded-keys="expandedkeys"
      node-key="objectId"
      @node-click="handleNodeClick"
    >
      <span slot-scope="{ node, data }" class="span__">
        <!-- <svg-icon icon-class="deptchange" /> -->
        <svg-icon
          v-if="data.icon"
          :icon-class="data.icon"
          @click="handleClickAdd(node)"
        />
        <span
          v-if="data.status"
          :class="data.status == 'ONLINE' ? 'online' : 'offline'"
        >
        </span>
        <!-- <i v-show="node.children" class="el-icon-user-solid"></i> -->
        <span class="tree-node-span" style="fontsize: 16px">
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
// import { putUserInfo } from "@/api/User/index";
import { querycompanyDevice } from "@/api/Device/index";
import { getMaintenance } from "@/api/Maintenance/index";
import { queryNotification } from "@/api/Notification/index";
import { getToken, putUserInfo } from "@/api/User/index";
export default {
  name: "DgiotRoleTree",
  data() {
    return {
      loading: false,
      highlight: true,
      department: JSON.parse(localStorage.getItem("dgiotroletree")) || [],
      selectDepart: "",
      roleTree: [],
      expandedkeys: [],
      classtype: localStorage.getItem("classtype") || "",
      skip: 0,
      isSkip: true, //判断是否还有设备未展示
    };
  },
  created() {
    this.roleTree = JSON.parse(localStorage.getItem("dgiotroletree")) || [];
    this.initDepartment(this.roleTree);
    this.$dgiotBus.$off("reloadroletree");
    this.$dgiotBus.$on("reloadroletree", (e) => {
      this.skip = 0; //重置查询列表
      this.roleTree = JSON.parse(localStorage.getItem("dgiotroletree")); //重置部门树
      this.classtype = localStorage.getItem("classtype"); //
    });
  },
  computed: {},
  methods: {
    initDepartment(routes) {
      // console.log('routes',routes);
      routes.forEach((item) => {
        if (item.children) {
          item.icon = "organization";
          this.initDepartment(item.children);
        } else {
          item.icon = "organode";
        }
      });
    },
    async getcamera(id, children) {
      let more = {
        label: "更多",
        objectId: "more",
      };
      console.log("children", children);
      this.$nextTick(() => {
        //划重点了  $nextTick 不懂得上网查一下
        children.forEach((item) => {
          this.$refs["tree"].append(item, id);
        });
        if (this.isSkip) {
          this.skip = (this.skip + 1) * 10;
          this.$refs["tree"].append(more, id);
        }
        // this.expandedkeys = [];
        this.expandedkeys.push(children[0].objectId);
        // this.$refs.tree.store.nodesMap["设备1"].expanded = true;

        //id 是对应要添加到那个节点的id
        //res.data 是添加的新数据
      });
    },

    async handleNodeClick(data, checked) {
      console.log(data, checked);
      if (data.label == "更多") {
        console.log(data, checked, checked.parent.data);
        this.checkoutClass(checked.parent.data);
        this.$refs["tree"].remove(data);
      } else if (data.status) {
        console.log("status", data, checked);
        if (this.classtype == "Product") {
          let params = {
            tag: {
              userinfo: {
                parse_deviceid: data.objectId,
              },
            },
          };
          let objectId = localStorage.getItem("objectId");
          console.log("objectId", objectId);
          putUserInfo(objectId, params);
          localStorage.setItem("parse_deviceid", data.objectId);
        }
        this.$dgiotBus.$emit("reload-router-view");
      } else if (data.label != "更多") {
        this.checkoutTree(data);
      }
    },
    async checkoutTree(data) {
      console.log("checkoutTree", data);
      if (data.children && data.children.length >= 0) {
        let params = {
          name: data.label,
        };
        this.selectDepart = data.label;
        const res = await getToken(params);
        this.$dgiotBus.$emit("reload-router-view");
      } else {
        if (!data.isShow && data.alias) {
          this.checkoutClass(data);
        }
      }
    },
    async checkoutClass(data) {
      try {
        this.loading = true;
        if (this.selectDepart != data.label) {
          this.skip = 0;
          this.selectDepart = data.label;
        }
        let params = {
          name: data.label,
        };
        data.isShow = true;
        await getToken(params);
        let queryData = {
          skip: this.skip,
          limit: 10,
          count: "objectId",
          order: "-createdAt",
        };
        let result = {};
        // let list = [];
        if (this.classtype == "Product") {
          result = await querycompanyDevice(queryData);
          console.log("result设备", result);
          // list = result.results || [];
          this.isSkip = result.results.length < 10 ? false : true;
        }
        let children = [];
        // 循环遍历重新定义结构
        result.results.forEach((item) => {
          let element = {
            label: item.name,
            objectId: item.objectId,
            status: item.status,
          };
          children.push(element);
        });
        this.loading = false;
        this.getcamera(data.objectId, children);
      } catch (error) {
        this.loading = false;
      }
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
.online {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #49cb5f;
}
.offline {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff0000;
}
</style>

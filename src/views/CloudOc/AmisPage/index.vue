<!--
* @Author: dgiot-fe <dgiot@foxmail.com>
* @Date: 2022-03-29 20:02:43
* @LastEditors: 20:02
* @LastEditTime: 2022-03-29 20:02:43
* @Description:
* @FilePath: src\views\CloudOc\MetaData\index.vue
* @DocumentLink: https://dev.iotn2n.com
* @github: https://github.com/dgiot/dgiot-dashboard.git
* @name: index
https://www.dgiotcloud.cn/wp-content/uploads/2022102808590871.png
-->
<template>
  <div ref="custom-table" v-loading="loading" class="index-container">
    <div v-show="dialog" v-if="dialog" class="dialog_wrap">
      <!-- <amis :schema="viewData" /> -->
      <amis
        v-if="dialog"
        modal-append-to-body
        :schema="viewData"
        :show-help="false"
      />
      <!-- <dgiot-amis modal-append-to-body :schema="viewData" :show-help="false" /> -->
    </div>
    <!-- 检测 -->
    <el-dialog
      class="topo_wrap"
      :title="receiceEvidence.name"
      :fullscreen="true"
      :append-to-body="true"
      @close="handlecloseEvidence"
      :visible.sync="dialogEvidenceVisible"
      v-if="dialogEvidenceVisible"
    >
      <div class="evidence_body">
        <el-header class="evidence_header">
          <el-row class="evidence_header_row" :gutter="24">
            <el-col :lg="1" :md="1" :sm="1" title="检测详情" :xl="1" :xs="1">
              <el-button
                round
                size="mini"
                type="success"
                @click.native="asideShow = !asideShow"
              >
                检测详情
              </el-button>
            </el-col>
          </el-row>
        </el-header>
        <topo-evicence
          class="evidence_container"
          v-if="dialogEvidenceVisible"
          :deviceInfo="receiceEvidence"
          :query="query"
          :asideShow="asideShow"
          @reloadCurrent="reloadCurrent"
        />
      </div>
    </el-dialog>
    <!-- 报告 -->
    <el-drawer append-to-body size="90%" :visible.sync="reportDialog">
      <iframe :src="officeapps" style="width: 100%; height: 100%" />
    </el-drawer>

    <!-- 设备组态 -->
    <div class="topo_wrap" v-if="dialogTopoVisible">
      <div class="topo_contentwrap">
        <div class="topo_title_top">
          <div>{{ deviceInfo.name }}</div>
          <span style="cursor: pointer" @click="closeTopo">x</span>
        </div>
        <topo-device :deviceInfo="deviceInfo" />
      </div>
    </div>
    <!-- 采集数据 -->
    <!--  -->
    <el-drawer
      append-to-body
      :visible="visible"
      size="100%"
      @close="saveHistorical(collectionInfo, thingcolumns, thingdata, true)"
    >
      <div
        :style="{
          overflow: 'auto',
          height: maxheight + 'px',
        }"
        v-infinite-scroll="true"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-divider>采集数据</el-divider>
            <el-table
              :key="thingdata.length"
              border
              :data="thingdata"
              style="min-height: 280px"
            >
              <el-table-column
                align="center"
                label="序号"
                show-overflow-tooltip
                width="50"
              >
                <template #default="{ $index }">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in thingcolumns"
                :key="index"
                align="center"
                :label="item.label"
                :prop="item.prop"
                show-overflow-tooltip
                sortable
                width="auto"
              />
            </el-table>
          </el-col>
          <el-col v-if="collectionInfo.name" :span="12">
            <el-divider>检测信息</el-divider>
            <el-card>
              <div class="setting">
                <el-button
                  type="success"
                  @click.native="collection(collectionInfo)"
                >
                  采集数据
                </el-button>
                <!-- :disabled="thingdata.length == 0" -->
                <el-button
                  type="primary"
                  @click.native="drawxnqx(collectionInfo.objectId, thingdata)"
                >
                  存储数据
                </el-button>
                <el-button
                  type="info"
                  @click.native="handleManagement(collectionInfo)"
                >
                  任务配置
                </el-button>
                <el-button @click.native="startOpc(collectionInfo)">
                  任务下发
                </el-button>
                <el-button
                  type="warning"
                  @click.native="
                    saveHistorical(
                      collectionInfo,
                      thingcolumns,
                      thingdata,
                      false
                    )
                  "
                >
                  保存数据
                </el-button>
                <el-button type="danger" @click="visible = false">
                  退出采集
                </el-button>
              </div>
              <div style="margin: 40px auto; width: 90%">
                <div style="display: flex">
                  <div
                    style="
                      flex: 1;
                      background-color: #f1f3f4;
                      padding: 5px 10px;
                      text-align: center;
                      border: 0.5px solid #ccc;
                    "
                  >
                    当前时间
                  </div>
                  <div
                    style="
                      flex: 2;
                      padding: 5px 10px;
                      text-align: center;
                      border: 0.5px solid #ccc;
                    "
                  >
                    {{ nowTime }}
                  </div>
                </div>
                <div style="display: flex">
                  <div
                    style="
                      flex: 1;
                      background-color: #f1f3f4;
                      padding: 5px 10px;
                      text-align: center;
                      border: 0.5px solid #ccc;
                    "
                  >
                    检测台体
                  </div>
                  <div
                    style="
                      flex: 2;
                      padding: 5px 10px;
                      text-align: center;
                      border: 0.5px solid #ccc;
                    "
                  >
                    {{ collectionInfo.profile.testbed }}
                  </div>
                </div>
                <div style="display: flex">
                  <div
                    style="
                      flex: 1;
                      background-color: #f1f3f4;
                      padding: 5px 10px;
                      text-align: center;
                      border: 0.5px solid #ccc;
                    "
                  >
                    检测任务
                  </div>
                  <div
                    style="
                      flex: 2;
                      padding: 5px 10px;
                      text-align: center;
                      border: 0.5px solid #ccc;
                    "
                  >
                    {{ collectionInfo.name }}
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12" style="margin-top: 20px">
            <el-divider>存储的数据</el-divider>
            <el-table
              :key="historyEvidence.length"
              border
              :data="historyEvidence"
              :max-height="maxheight * 0.46"
            >
              <el-table-column
                align="center"
                label="序号"
                show-overflow-tooltip
                width="50"
              >
                <template #default="{ $index }">
                  {{ $index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in historycolumns"
                :key="index"
                align="center"
                :label="item.label"
                :prop="item.prop"
                show-overflow-tooltip
                sortable
                width="auto"
              />
              <el-table-column align="center" label="操作" width="60">
                <template #default="{ row, $index }">
                  <el-button
                    class="el-icon-delete"
                    type="text"
                    @click.native="deleteHistory(row, $index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12" style="margin-top: 20px">
            <el-divider>其他数据</el-divider>
            <el-tabs v-model="activeName1" @tab-click="tabHandleClick">
              <el-tab-pane label="实时数据" name="first">
                <div class="thirdtb">
                  <!--运行状态-->
                  <el-row :key="thirdtbKey">
                    <real-card
                      :height="maxheight * 0.4 + 'px'"
                      :cardList="machinelist"
                      :avator="avator"
                      :fontsize="'20px'"
                    />
                  </el-row>
                </div>
              </el-tab-pane>
              <el-tab-pane label="图表" name="second">
                <div
                  class=""
                  :style="{
                    overflow: 'auto',
                    height: maxheight * 0.4 + 'px',
                  }"
                  v-infinite-scroll="true"
                >
                  <el-card>
                    <!-- drawxnqxPath  /dgiot_file/pump_python/b454c5cf15.png-->
                    <el-image
                      :key="performancefilepath"
                      :preview-src-list="[$FileServe + performancefilepath]"
                      :src="$FileServe + performancefilepath"
                    >
                      <!-- :preview-src-list="[$FileServe + drawxnqxPath]" -->
                      <!-- <div slot="error" class="image-slot"> -->
                      <!-- <el-image
                      class="dgiot-data-empty"
                      :src="
                        require('../../../../public/assets/images/platform/assets/empty_images/data_empty.png')
                      "
                    /> -->
                      <!-- </div> -->
                    </el-image>
                    <!-- 备注 -->
                    <div style="margin: 40px auto; width: 90%">
                      <div style="display: flex">
                        <div
                          style="
                            flex: 1;
                            background-color: #f1f3f4;
                            padding: 5px 10px;
                            text-align: center;
                            border: 0.5px solid #ccc;
                            position: relative;
                          "
                        >
                          <div
                            style="
                              position: absolute;
                              left: 50%;
                              top: 50%;
                              transform: translate(-50%, -50%);
                            "
                          >
                            备注
                          </div>
                        </div>
                        <div
                          style="
                            flex: 2;
                            padding: 5px 10px;
                            text-align: center;
                            border: 0.5px solid #ccc;
                          "
                        >
                          <p>
                            {{ performanceremark1 }}
                          </p>
                          <p>
                            {{ performanceremark2 }}
                          </p>
                          <p>
                            {{ performanceremark3 }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-card>
                  <el-card>
                    <el-image
                      :key="loadfilepath"
                      :preview-src-list="[$FileServe + loadfilepath]"
                      :src="$FileServe + loadfilepath"
                    >
                    </el-image>
                    <!-- 备注 -->
                    <div style="margin: 40px auto; width: 90%">
                      <div style="display: flex">
                        <div
                          style="
                            flex: 1;
                            background-color: #f1f3f4;
                            padding: 5px 10px;
                            text-align: center;
                            border: 0.5px solid #ccc;
                            position: relative;
                          "
                        >
                          <div
                            style="
                              position: absolute;
                              left: 50%;
                              top: 50%;
                              transform: translate(-50%, -50%);
                            "
                          >
                            备注
                          </div>
                        </div>
                        <div
                          style="
                            flex: 2;
                            padding: 5px 10px;
                            text-align: center;
                            border: 0.5px solid #ccc;
                          "
                        >
                          <p>
                            {{ loadremark1 }}
                          </p>
                          <p>
                            {{ loadremark2 }}
                          </p>
                          <p>
                            {{ loadremark3 }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
    <!-- amis 列表弹窗 -->
    <el-dialog
      append-to-body
      :before-close="handleCloseAmis"
      center
      top="5vh"
      :visible.sync="management.dialog"
      width="80%"
    >
      <el-tabs v-model="managementactiveName">
        <el-tab-pane
          v-for="(item, index) in management.data"
          :key="index + 'i'"
          :label="item.title"
          :name="index + ''"
        >
          <!-- v-if="dialog" -->
          <amis modal-append-to-body :schema="item.data" :show-help="false" />
          <!-- <dgiot-amis :schema="item.data" :show-help="false" /> -->
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { Base64 } from "js-base64";

import Amis from "@/components/Amis/index.vue";
import TopoEvicence from "./component/TopoEvicence.vue";
import TopoDevice from "./component/TopoDevice.vue";
// import DgiotAmis from "@/components/DgiotAmis/index.vue"
import { getView, queryView } from "@/api/View/index";

// 数据采集
import RealCard from "../../dashboard/component/commom/RealCard.vue";
import avator from "@/assets/bg/avator.png";
import { getTime } from "@/utils/index";
import { getDeviceRealCard, getDevice, putDevice } from "@/api/Device/index";
import { postHead } from "@/api/Opc";
import {
  generatereport,
  postDrawxnqx,
  queryEvidence,
  postEvidence,
  putEvidence,
} from "@/api/Evidence/index";
export default {
  name: "AmisPage",
  props: {},
  components: {
    // DgiotAmis:DgiotAmis,
    amis: Amis,
    TopoEvicence,
    TopoDevice,
    RealCard,
  },
  filters: {
    filterVal(val) {
      if (val || val == 0) {
        return val;
      } else {
        return "--";
      }
    },
  },
  data() {
    return {
      commandInfo: {
        dialog: false,
      },
      dialog: false,
      loading: true,
      viewData: {},
      dialogEvidenceVisible: false,
      receiceEvidence: {},
      query: {}, //查询条件
      asideShow: true, //侧边页数
      dialogTopoVisible: false,
      deviceInfo: {},
      reportInfo: {},
      reportDialog: false,
      officeapps: "",
      //数据采集
      management: {
        dialog: false,
        data: {},
      },
      managementactiveName: "0",
      avator: avator,
      machinelist: [],
      timer: "",
      nowTime: "",
      activeName1: "first",
      thirdtbKey: new Date().getTime(),
      collectionInfo: {},
      drawxnqxPath: "",
      profiledrawxnqxPath: "",
      thingdata: [],
      realtimedata: [],
      thingcolumns: [],
      historycolumns: [],
      historydata: [],
      historyEvidence: [],
      historyEvidenceid: "",
      visible: false,
      maxheight: "480",
      loadfilepath: "",
      drawdata: {},
      performancefilepath: "",
      loadremark1: "",
      loadremark2: "",
      loadremark3: "",
      performanceremark1: "",
      performanceremark2: "",
      performanceremark3: "",
      // schema:{},
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 600,
        group: "description",
      };
    },
    finallyColumns() {
      return this.columns.filter((item) => this.checkList.includes(item.label));
    },
  },
  watch: {},
  async created() {},
  async mounted() {
    let viewid = location.hash.split("/")[location.hash.split("/").length - 1];
    try {
      const res = await getView(viewid);
      this.viewData = res.data || {};
      console.log("res.class", res);
      // this.$store.dispatch("settings/changeSetting", {
      //   key: "treeFlag",
      //   value: true,
      // });
      let classtype = localStorage.getItem("classtype") || "";
      if (classtype != res.class) {
        localStorage.setItem("classtype", res.class); //缓存当前视图类型
        this.$dgiotBus.$emit("reloadroletree");
      } else {
      }
      if (JSON.stringify(this.viewData) != "{}") {
        this.dialog = true;
        this.loading = false;
      } else {
        this.$message("未找到该低代码模板");
        this.loading = false;
      }
    } catch (error) {
      this.$message("未找到该低代码模板");
      this.loading = false;
    }
    //报告查看
    // review/report
    this.$dgiotBus.$off("review/report");
    this.$dgiotBus.$on("review/report", (e) => {
      const fileUrl = this.$FileServe + e.profile.docx;
      this.reportInfo = e;
      this.reportDialog = true;
      this.officeapps =
        "https://view.officeapps.live.com/op/view.aspx?src=" + fileUrl;
    });
    // 设备组态
    this.$dgiotBus.$off("review/deviceTopo");
    this.$dgiotBus.$on("review/deviceTopo", (e) => {
      this.deviceInfo = e;
      this.dialogTopoVisible = true;
    });
    // 证据检测
    this.$dgiotBus.$off("collect/evidence");
    this.$dgiotBus.$on("collect/evidence", (e) => {
      this.receiceEvidence = e;
      e.profile.step =
        e.profile.step == -1 ? 1 : e.profile.step == 2 ? 3 : e.profile.step;
      let query = {
        taskid: e.objectId,
        suite: 0,
        state: "preview",
        step: e.profile?.step,
        back: e.profile?.step,
        message: e.profile?.message,
      };
      console.log("接收的证据消息", e, query);
      this.query = query;
      this.dialogEvidenceVisible = true;
    });
    // 远程检测数据采集
    this.$dgiotBus.$off("collect/realdata");
    this.$dgiotBus.$on("collect/realdata", (e) => {
      this.visibleInfo(e);
      this.maxheight = document.body.clientHeight;
      console.log(this.maxheight);
      this.timer = setInterval(() => {
        this.datetime();
      }, 1000);
    });

    // E:\work\project\doc\dgiot_doc\i18n\zh-cn\docusaurus-plugin-content-docs\current\developer_guid\docs\front_end\dgiot_topo.md
    // 实时设备状态
    this.$dgiotBus.$off("$dg/user/devicestate");
    this.$dgiotBus.$on("$dg/user/devicestate", (e) => {
      let str = String.fromCharCode.apply(null, new Uint8Array(e));
      console.log("解码接收消息", str);
      let args = {};
      const parseString = JSON.parse(str);
      if (parseString) {
        const topicsKeys = Object.keys(parseString);
        args.key = topicsKeys[0];
        args.parseString = parseString[topicsKeys[0]];
        let currentIndex = 0; //第几行修改定义变量
        let changedeviceid = args.key;
        // 实时修改设备的位置，在线离线状态
        if (document.getElementsByClassName("dgiotobjectId").length > 0) {
          for (
            let index = 1;
            index < document.getElementsByClassName("dgiotobjectId").length - 1;
            index++
          ) {
            // console.log(111);
            let objectId = document
              .getElementsByClassName("dgiotobjectId")
              [index].getElementsByClassName("antd-PlainField")[0].innerHTML;
            if (objectId == changedeviceid) {
              currentIndex = index; //找到是第几行
              break; //退出循环
            }
          }
          document
            .getElementsByClassName(`dgiotaddress`)
            [currentIndex].getElementsByClassName(
              "antd-PlainField"
            )[0].innerHTML = args.parseString.address; //修改地址位置
          let status = document
            .getElementsByClassName(`dgiotstatus`)
            [currentIndex].getElementsByClassName(`label`)[0].parentNode;
          if (args.parseString.status == "ONLINE") {
            status.innerHTML = "<span class='label label-success'>在线</span>";
          } else if (args.parseString.status == "OFFLINE") {
            status.innerHTML = "<span class='label label-danger'>离线</span>";
          }
        }
      }
    });
  },
  methods: {
    closeTopo() {
      this.dialogTopoVisible = false;
    },
    async handlecloseEvidence() {
      this.dialogEvidenceVisible = false;
      this.initAmis();
    },
    async reloadCurrent() {
      this.dialogEvidenceVisible = false;
      this.initAmis();
    },
    async initAmis() {
      this.loading = true;
      this.dialog = false;
      let viewid =
        location.hash.split("/")[location.hash.split("/").length - 1];
      const { data = {} } = await getView(viewid);
      this.viewData = data;
      console.log("view表单", data);
      if (JSON.stringify(this.viewData) != "{}") {
        this.dialog = true;
        this.loading = false;
      }
    },
    // 远程检测数据采集部分
    tabHandleClick(tab) {
      switch (tab.name) {
        case "first":
          break;
        case "second":
          break;
      }
    },
    async visibleInfo(params) {
      let _this = this;
      _this.collectionInfo = params;
      _this.CardDevice(params.parentId.objectId);
      _this.subRealtimedata(params);

      try {
        const thingcolumns = {};
        const items = [];
        _this.thingdata = [];
        _this.realtimedata = [];
        _this.thingcolumns = [];
        if (params.basedata) {
          /**
           * @description 判断下发组态topic的item
           * @description 必须以 标识符 dgiot_testing_equipment_ 开头
           */
          for (let key in params.basedata) {
            if (key.indexOf("dgiot_testing_equipment_") == 0) {
              const splitColumns = key.split("dgiot_testing_equipment_")[1];
              thingcolumns[`${splitColumns}`] = splitColumns;
              items.push(params.basedata[key]);
            }
          }
        }
        const { table = [] } = await postHead({
          items: items,
          productid: params.parentId.product.objectId,
        });
        _this.thingcolumns = table;
        _this.historycolumns = _.filter(table, function (item) {
          return item.prop !== "timestamp";
        });
        if (_this.historycolumns) {
          _this.historycolumns = params.profile.historicaldatacolumns;
        }
        _this.historydata = params.profile.historicaldata;
        _this.drawdata = params.profile.drawdata;
        // _this.profiledrawxnqxPath = params.profile.drawxnqxPath;
        _this.featHistoryEvidence(this.collectionInfo.objectId);
        _this.visible = true;
      } catch (error) {
        console.log(error);
        // _this.$baseMessage(
        //   _this.$translateTitle("alert.Data request error") + `${error}`,
        //   "error",
        //   "dgiot-hey-message-error"
        // );
      }
    },
    async subRealtimedata(params) {
      // this.router = this.$dgiotBus.router(location.href + this.$route.fullPath);
      let subtopic = `$dg/user/realtimecard/${params.parentId.objectId}/report`; // 设备实时数据topic
      try {
        // mqtt 消息回调
        // await this.$nopostsubscribe(subtopic);
        this.$dgiotBus.$off("$dg/user/realtimecard"); // dgiotBus 关闭事件
        this.$dgiotBus.$on("$dg/user/realtimecard", (mqttMsg) => {
          const { data = [] } = JSON.parse(
            Base64.decode(mqttMsg.payloadString)
          );
          this.renderCard(data);
          // 刷新存储数据
          if (params.profile.istcp) {
            getDevice(params.objectId).then((res) => {
              this.historyEvidence = res.profile.historicaldata;
              this.drawdata = res.profile.drawdata;
              // this.drawxnqxPath = res.profile.drawxnqxPath;
            });
          }
          if (data) {
            this.collectiontable(data);
            // this.renderCard(data)
          } else {
            this.CardDevice();
          }
        });
      } catch (error) {
        console.log(error);
        // this.$baseMessage(
        //   this.$translateTitle('alert.Data request error') + `${error}`,
        //   'error',
        //   'dgiot-hey-message-error'
        // )
      }
    },
    collectiontable(resData) {
      let _this = this;
      let thingdata = {};
      resData.forEach((item) => {
        // thingdata[item.identifier] = item.number
        this.$set(thingdata, item.identifier, item.number);
        this.$set(thingdata, "timestamp", item.time);
      });
      // mqtt 消息回调
      if (!_.isEmpty(thingdata) && thingdata?.dgiotcollectflag == 0) {
        _this.thingdata = [];
        console.log(thingdata);
        _this.thingdata[0] = thingdata; // 只显示一条
      } else {
        //实时数据
        _this.realtimedata.unshift(thingdata); // 最新数据放在最前面
      }
      // _this.getSummaries({ columns: [], data: _this.thingdata }) // 计算平均值
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-21 09:34:37
     * @LastEditors:
     * @param
     * @return {Promise<void>}
     * @Description: 查询历史存证
     */
    async featHistoryEvidence(taskid) {
      this.historyEvidence = [];
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        const params = {
          limit: 1,
          where: {
            "original.taskid": taskid,
            "original.type": "avgs",
          },
        };

        const { results = [] } = await queryEvidence(params);
        console.log("queryEvidence", results, this.drawdata);
        if (results?.length) {
          this.historyEvidence = results[0].original.avgs ?? this.historydata;
          this.collectionInfo.profile.historicaldata = this.historyEvidence;
          this.historyInfo = results[0];
          this.loadfilepath =
            results[0].original.drawdata.loadfilepath ??
            this.drawdata.loadfilepath;
          this.performancefilepath =
            results[0].original.drawdata.performancefilepath ??
            this.drawdata.performancefilepath;
          this.performanceremark1 =
            results[0].original.drawdata.performanceremark1;
          this.performanceremark2 =
            results[0].original.drawdata.performanceremark2;
          this.performanceremark3 =
            results[0].original.drawdata.performanceremark3;
          this.loadremark1 = results[0].original.drawdata.loadremark1;
          this.loadremark2 = results[0].original.drawdata.loadremark2;
          this.loadremark3 = results[0].original.drawdata.loadremark3;
          // this.drawxnqxPath =
          //   results[0].original.path ?? this.profiledrawxnqxPath;
        } else {
          this.historyEvidence = this.historydata;
          this.loadfilepath = this.drawdata.loadfilepath;
          // this.drawxnqxPath = this.profiledrawxnqxPath;
          this.performancefilepath = this.drawdata.performancefilepath;
        }
        console.log("this.loadfilepath", this.loadfilepath);
        // await this.drawxnqx(this.collectionInfo.objectId, this.historyEvidence)
        this.$message({ message: "数据请求成功", type: "success" });
        loading.close();
      } catch (error) {
        // console.log(error);
        loading.close();
        // this.$baseMessage(
        //   this.$translateTitle("alert.Data request error") + `${error}`,
        //   "error",
        //   "dgiot-hey-message-error"
        // );
      }
    },
    CardDevice(deviceid) {
      var vm = this;
      getDeviceRealCard(deviceid)
        .then((response) => {
          console.log("实时数据", response);
          vm.machinelist = [];
          if (response?.data) {
            vm.renderCard(response.data);
          }
        })
        .catch((error) => {
          // dgiotlog.log('update error 清除timer', error)
        });
    },
    datetime() {
      this.nowTime = getTime();
    },
    async collection(params) {
      let _this = this;
      _this.collectionInfo = params;
      _this.featHistoryEvidence(this.collectionInfo.objectId);
      try {
        const { basedata = [] } = await getDevice(params.objectId);
        const pubTopic = `$dg/thing/${params.parentId.objectId}/properties/get/request_id=opc_report`; // 读取opc属性topic
        const message = {
          cmd: "opc_report", // 采集条数
          duration: Number(basedata.dgiot_sampling_parametric_frequency) ?? 5, //条数
          groupid: params.objectId,
        };
        // console.groupCollapsed(
        //   `%c 发送采集消息`,
        //   "color:#009a61; font-size: 28px; font-weight: 300"
        // );
        // console.log("message", message);
        // console.log("pubTopic", pubTopic);
        // console.groupEnd();
        _this.$dgiotBus.$emit(`MqttPublish`, {
          pubTopic,
          message: JSON.stringify(message),
          qs: 0,
          status: false,
        }); // 开始采集
      } catch (error) {}
      // _this.subRealtimedata(params)
    },
    /**
     * @Author: dext7r
     * @Date: 2021-12-20 10:51:49
     * @LastEditors: dext7r
     * @param
     * @return {Promise<void>}
     * @Description: 计算平均值
     */
    async drawxnqx(taskid, thingdata) {
      this.drawxnqxPath = "";
      try {
        const data = thingdata; // 要處理下
        const params = {
          data: data,
          taskid: taskid,
        };
        const {
          code,
          error = "",
          original = {},
          evidenceid = "",
        } = await postDrawxnqx(params);
        if (Number(code) == 200) {
          this.historyEvidenceid = evidenceid ?? "";
          this.historyEvidence = original.avgs ?? [];

          this.loadfilepath = `${
            original.drawdata.loadfilepath
          }?t=${new Date().getTime()}`;
          this.performancefilepath = `${
            original.drawdata.performancefilepath
          }?t=${new Date().getTime()}`;
          this.performanceremark1 = original.drawdata.performanceremark1;
          this.performanceremark2 = original.drawdata.performanceremark2;
          this.performanceremark3 = original.drawdata.performanceremark3;
          // this.drawxnqxPath = `${original.path}?t=${new Date().getTime()}`;
          this.original = original ?? {};
          this.drawdata = original.drawdata;
          // https://www.lodashjs.com/docs/lodash.filter
          this.historycolumns = _.filter(this.thingcolumns, function (item) {
            return item.prop !== "timestamp";
          });
        } else {
          this.$message({
            message: "请求出错",
            type: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async startOpc(row) {
      try {
        var items = [];
        const { basedata = [] } = await getDevice(row.objectId);
        if (!_.isEmpty(basedata)) {
          for (let key in basedata) {
            if (key.indexOf("dgiot_testing_equipment_") == 0)
              items.push(basedata[key]);
          }
        }
        const pubTopic = `$dg/thing/${row.parentId.objectId}/properties/get/request_id=opc_items`; // 读取opc属性topic
        const message = {
          cmd: "opc_items",
          groupid: row.objectId, //'任务ID',
          opcserver:
            basedata.dgiot_testing_opcserver ?? "Kepware.KEPServerEX.V6",
          items: items, //要读取到属性列表
        }; // 下发的消息内容
        await this.$dgiotBus.$emit(`MqttPublish`, {
          pubTopic,
          message: JSON.stringify(message),
          qs: 0,
          sattus: false,
        }); // 开始任务
      } catch (error) {}
    },
    async saveHistorical(collectionInfo, thingdata, historyEvidence, type) {
      const _profile = {
        profile: _.merge(collectionInfo.profile, {
          historicaldatacolumns: _.filter(thingdata, function (item) {
            return item.prop !== "timestamp";
          }),
          historicaldata: historyEvidence,
          drawdata: this.drawdata,
          // drawxnqxPath: this.drawxnqxPath,
        }),
      };
      if (type) {
        this.visible = false;
        clearInterval(this.timer);
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        if (!collectionInfo.profile.istcp) {
          await putDevice(collectionInfo.objectId, _profile);
        }
        this.$message({
          message: "请求成功",
          type: "success",
        });
        loading.close();
      } catch (error) {
        console.log(error);
        loading.close();
      }
    },
    renderCard(resData) {
      var vm = this;
      let array = [];
      resData.forEach((item) => {
        if (item.devicetype && item.identifier != "dgiotcollectflag") {
          array.push(item.devicetype);
        }
      });
      array = _.uniqBy(array);
      let machine = {};
      let cardlist = [];
      array.forEach((item) => {
        let type = {}; //数据类别分类
        let arr = [];
        resData.forEach((item1) => {
          if (item == item1.devicetype) arr.push(item1);
        });
        type["data"] = arr;
        type["name"] = item;
        cardlist.push(type);
      });
      // array.forEach((item) => {
      //   let arr = [];
      //   resData.forEach((item1) => {
      //     if (item == item1.devicetype) {
      //       arr.push(item1);
      //     }
      //   });
      //   machine[item] = arr;
      // });
      // console.log("machine", machine);
      vm.machinelist = cardlist;
      vm.thirdtbKey = new Date().getTime();
    },
    handleCloseAmis() {
      // this.coordinate = {
      //   lng: 116.404,
      //   lat: 39.915,
      // };
      // this.dialog_device = false;
      this.management.dialog = false;
    },
    async handleManagement(row) {
      // this.$refs["lowcodeDesign"].withHeader = true;
      localStorage.setItem("parse_objectid", row.objectId);
      localStorage.setItem("product_objectid", row.product.objectId);
      const params = {
        where: { type: "amis", key: row.objectId },
      };
      const { results } = await queryView(params);
      console.log("results", results);

      if (_.isEmpty(results)) {
        this.$message("暂未配置任务表单");
        return false;
      } else {
        this.management.dialog = true;
        this.management.data = results;
      }
      // this.lowcodeId = results[0].objectId
      // this.$dgiotBus.$emit('lowcodePreview', results[0])
    },
    async deleteHistory(row, index) {
      try {
        await this.historyEvidence.splice(index, 1);
        console.log(
          "deleteHistory",
          row,
          index,
          this.historyEvidence,
          this.historyEvidence.length
        );
        await this.saveHistorical(
          this.collectionInfo,
          this.thingdata,
          this.historyEvidence,
          false
        );
        await this.saveThingdata();
        // this.featHistoryEvidence(this.collectionInfo.objectId)
      } catch (error) {
        console.log(error);
        this.$message({
          message: "数据请求出错",
          type: "error",
        });
      }
    },
    async saveThingdata() {
      try {
        const Evidence = {
          original: this.historyInfo.original,
        };
        const res = await putEvidence(this.historyInfo.objectId, Evidence);
      } catch (error) {
        console.log(error);
        this.$message({
          message: "数据请求出错",
          type: "error",
        });
      }
    },
  },
  destroyed() {},
};
</script>
<style lang="scss" scoped>
.index-container {
  width: 100%;
  height: 90vh;
  .dialog_wrap {
    height: 100%;
    width: 100%;
    overflow: scroll;
  }
}
.evidence_body {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .evidence_header {
    height: 50px;
  }
  .evidence_container {
    height: calc(100% - 50px);
  }
}
// 设备组态
.topo_wrap {
  position: fixed;
  top: 0%;
  left: 0%;
  // transform: translate(-50%, -50%);
  z-index: 99;
  height: 100%;
  background-color: rgba(114, 118, 122, 0.5);
  width: 100%;
  .topo_contentwrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    height: 730px;
    background-color: #fff;
    width: 1200px;
  }
  .topo_title_top {
    padding: 2px 4px;
    margin-bottom: 10px;
    height: 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    color: #000;
    font-size: 26px;
  }
  // background-color: #fff;
}
::v-deep {
  .el-header {
    background-color: #027be3;
    display: flex;
    align-items: center;
  }
  .el-dialog__body {
    padding: 0 !important;
    height: 100%;
  }
}
</style>

<template>
  <el-container
    v-loading="loading"
    class="topoEvidence"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-spinner="el-icon-loading"
  >
    <div v-show="asideShow" class="evidence_container_aside">
      <div
        v-for="(btn, index) in evidenceTopoList"
        :key="btn.objectId"
        class="btns"
        :class="currentTopoIndex == index ? 'success' : 'info'"
        @click="activeBtn(btn, index)"
      >
        {{ index + 1 }}
      </div>
    </div>
    <div class="evidence_main">
      <div id="evidencekonva" class="evidence_main_konva"></div>
      <div
        v-for="(item, index) in evidenceList"
        class="evidenceItem"
        :style="{
          position: 'absolute',
          top: item.success.evidence.attrs.y - 5 + 'px',
          left: item.success.evidence.attrs.x - 5 + 'px',
        }"
        :key="new Date().getTime() + index"
      >
        {{ item.count }}
      </div>
    </div>
    <div v-if="deviceInfo.name" class="evidence_footer">
      <el-row :gutter="10">
        <el-col :lg="3" :md="2" :sm="3" :xl="1" :xs="4">
          <el-button
            v-if="Number(query.step) == 1"
            round
            type="success"
            @click.native="auditQuery(1, 'review')"
          >
            预览审核
          </el-button>
          <el-button
            v-if="Number(query.step) == 3"
            round
            type="success"
            @click.native="auditQuery(1, 'evidence')"
          >
            审核意见
          </el-button>
        </el-col>
        <el-col :lg="16" :md="13" :sm="11" :xl="18" :xs="10">
          <el-link
            v-if="query.message && Number(query.step) == 4"
            type="success"
            :underline="false"
          >
            报告审核意见：
            {{ query.message }}
          </el-link>
          <el-link
            v-if="Number(query.step) == 1 || Number(query.step) == 3"
            type="danger"
            :underline="false"
          >
            {{ deviceInfo.profile.message || "" }}
          </el-link>
        </el-col>
        <el-col
          v-if="Number(query.step) != 1"
          :lg="4"
          :md="9"
          :sm="10"
          :xl="4"
          :xs="10"
        >
          <el-badge
            type="warning"
            :value="badge.Unreviewed.length"
            @click.native="evidenceClick(badge.Unreviewed)"
          >
            <el-button circle size="mini" type="warning"> 未审核 </el-button>
          </el-badge>
          <el-badge
            type="primary"
            :value="badge.Approved.length"
            @click.native="evidenceClick(badge.Approved)"
          >
            <el-button circle size="mini" type="primary"> 审核通过 </el-button>
          </el-badge>
          <el-badge
            type="danger"
            :value="badge.notapproved.length"
            @click.native="evidenceClick(badge.notapproved)"
          >
            <el-button circle size="mini" type="danger"> 审核不过 </el-button>
          </el-badge>
        </el-col>
      </el-row>
    </div>
    <div class="evidence_list" v-show="asideShow">
      <el-table
        max-height="700"
        :data="evidenceList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column fixed prop="date" label="类别" width="150">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.type == 'video'
                  ? 'primary'
                  : scope.row.type == 'audio'
                  ? 'success'
                  : scope.row.type == 'image'
                  ? 'warning'
                  : scope.row.type == 'file'
                  ? 'danger'
                  : ''
              "
              disable-transitions
              >{{ getType(scope.row.type) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" width="120">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-show="Number(query.step) == 1"
              title="取证"
              type="primary"
              @click.native="handleUpload(scope.row)"
            >
              上传
            </el-button>
            <el-button
              type="success"
              @click.native="handleEvidenceDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer
      append-to-body
      placement="right"
      size="50%"
      :visible="auditDialog"
      :with-header="false"
      :wrapper-closable="true"
      @close="auditDialog = false"
    >
      <el-form ref="form" label-width="120px" :model="deviceInfo">
        <el-form-item
          v-if="taskType == 'review'"
          label-width="0"
          style="float: left"
        >
          <el-button
            type="primary"
            @click="finishEvidence(deviceInfo, Number(query.step) == 1 ? 2 : 3)"
          >
            提交审核
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="taskType == 'evidence'"
          label-width="0"
          style="float: ; margin-top: 5px"
        >
          <el-button @click="notapproved(deviceInfo, -1)"> 审核不过 </el-button>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="notapproved(deviceInfo, 3)"
          >
            审核通过
          </el-button>
        </el-form-item>
        <el-form-item v-if="Number(query.step) != 1" label="报告审核意见">
          <el-input
            v-model="deviceInfo.profile.message"
            :rows="2"
            style="width: 60%"
            type="textarea"
          />
          <!--            <el-button title="关闭" type="info" @click.native="clouseDraw">-->
          <!--              关闭-->
          <!--            </el-button>-->
        </el-form-item>
      </el-form>
      <span>
        <el-table border :data="auditList" size="mini" stripe>
          <el-table-column
            align="center"
            label="序号"
            prop="original.path"
            show-overflow-tooltip
            width="80"
          >
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="证据"
            prop="row.original.path"
            show-overflow-tooltip
            sortable
            width="auto"
          >
            <template #default="{ row }">
              <!--              <vue-aliplayer-v2-->
              <!--                v-if="types.video.includes(`${row.original.type}`)"-->
              <!--                ref="VueAliplayerV2"-->
              <!--                :options="options"-->
              <!--                :source="$FileServe + row.original.path"-->
              <!--                style="margin: 0 auto"-->
              <!--              />-->
              <!--              <el-image-->
              <!--                v-else-if="types.image.includes(`${row.original.type}`)"-->
              <!--                :preview-src-list="[$FileServe + row.original.path]"-->
              <!--                :src="$FileServe + row.original.path"-->
              <!--                style="width: 50px; height: 50px"-->
              <!--              />-->
              <!--              <av-bars-->
              <!--                v-else-if="types.audio.includes(`${row.original.type}`)"-->
              <!--                :audio-src="$FileServe + row.original.path"-->
              <!--              />-->
              <el-link :href="$FileServe + row.original.path" target="_blank">
                {{
                  row.original.path.split("/")[
                    `${row.original.path.split("/").length - 1}`
                  ]
                }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="类型"
            prop="row.original.type"
            show-overflow-tooltip
            sortable
            width="auto"
          >
            <template #default="{ row }">
              <el-tag effect="plain">
                {{ getType(row.original.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="备注"
            prop="row.original.remarks"
            sortable
            width="auto"
          >
            <template #default="{ row }">
              <el-input
                v-model="row.original.remarks"
                :readonly="Number(query.step) > 2"
                :rows="2"
                type="textarea"
              />
            </template>
          </el-table-column>

          <el-table-column
            v-if="Number(query.step) == 1"
            align="center"
            :label="Number(query.step) == 1 ? '操作' : '单项审核'"
            :width="Number(query.step) == 1 ? '220' : '420'"
          >
            <template #default="{ row, $index }">
              <el-button
                sizes="mini"
                type="danger"
                @click.native="deleteFile(row.objectId, $index, evidences)"
              >
                删除
              </el-button>
              <el-button
                sizes="mini"
                type="success"
                @click.native="saveEvidences(row.objectId, $index, row)"
              >
                保存
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="taskType != 'review'"
            align="center"
            label="当前状态"
            prop="original.status"
            width="100"
          >
            <template #default="{ row }">
              <el-tag
                effect="dark"
                :type="
                  ['success', 'info', 'danger'][
                    row.original.status == '未审核'
                      ? 1
                      : row.original.status == '通过审核'
                      ? 0
                      : 2
                  ]
                "
              >
                {{ row.original.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-if="taskType != 'review'"
            align="center"
            fixed="right"
            label="质检项审核意见"
            prop="original.message"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <el-input
                v-model="row.original.message"
                :rows="2"
                type="textarea"
              />
            </template>
          </el-table-column>
        </el-table>
      </span>
    </el-drawer>
    <el-drawer
      append-to-body
      size="60%"
      :visible="evidenceDialog"
      :with-header="false"
      :wrapper-closable="false"
      @close="evidenceDialog = false"
    >
      <div>
        <el-form style="margin: 10px 20px">
          <!-- v-if="evidenceList.id" -->
          <div style="display: flex; justify-content: space-between">
            <div v-show="Number(query.step) == 1">
              <el-button
                title="取证"
                type="primary"
                @click.native="handleUpload1()"
              >
                上传
              </el-button>
            </div>

            <el-button title="关闭" type="info" @click.native="clouseDraw">
              关闭
            </el-button>
          </div>
        </el-form>
        <!-- <input
          ref="uploader"
          accept="*"
          style="display: none"
          type="file"
          @change="doUpload($event, evidenceList.node.attrs.icon)"
        /> -->
      </div>
      <el-table border :data="evidences" stripe>
        <el-table-column
          align="center"
          label="序号"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="证据"
          prop="row.original.path"
          show-overflow-tooltip
          sortable
          width="auto"
        >
          <template #default="{ row }">
            <!--            <vue-aliplayer-v2-->
            <!--              v-if="types.video.includes(`${row.original.type}`)"-->
            <!--              ref="VueAliplayerV2"-->
            <!--              :options="options"-->
            <!--              :source="$FileServe + row.original.path"-->
            <!--            />-->
            <!--            <el-image-->
            <!--              v-else-if="types.image.includes(`${row.original.type}`)"-->
            <!--              :preview-src-list="[$FileServe + row.original.path]"-->
            <!--              :src="$FileServe + row.original.path"-->
            <!--              style="width: 50px; height: 50px"-->
            <!--            />-->
            <!--            <av-bars-->
            <!--              v-else-if="types.audio.includes(`${row.original.type}`)"-->
            <!--              :audio-src="$FileServe + row.original.path"-->
            <!--            />-->
            <el-link :href="$FileServe + row.original.path" target="_blank">
              {{
                row.original.path.split("/")[
                  `${row.original.path.split("/").length - 1}`
                ]
              }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="备注"
          prop="row.original.remarks"
          sortable
          width="auto"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.original.remarks"
              :rows="2"
              type="textarea"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="类型"
          prop="row.original.type"
          show-overflow-tooltip
          sortable
          width="auto"
        >
          <template #default="{ row }">
            <el-tag effect="plain">
              <!--  $translateTitle(`cloudTest.${row.original.type}`) -->
              {{ getType(row.original.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="Number(query.step) == 1 ? '操作' : '单项审核'"
          :width="Number(query.step) == 1 ? '220' : '420'"
        >
          <template #default="{ row, $index }">
            <el-button
              v-if="Number(query.step) == 1"
              sizes="mini"
              type="danger"
              @click.native="deleteFile(row.objectId, $index, evidences)"
            >
              删除
            </el-button>
            <el-button
              v-if="Number(query.step) == 1"
              sizes="mini"
              type="success"
              @click.native="saveEvidences(row.objectId, $index, row)"
            >
              保存
            </el-button>
            <el-radio-group
              v-if="Number(query.step) !== 1 && Number(query.step) != 4"
              v-model="row.original.status"
              size="mini"
            >
              <el-radio label="未审核"> 未审核 </el-radio>
              <el-radio label="通过审核"> 审核通过 </el-radio>
              <el-radio label="审核不通过"> 审核不通过 </el-radio>
            </el-radio-group>

            <el-tag
              v-if="Number(query.step) !== 1 && Number(query.step) != 3"
              effect="dark"
              :type="
                ['', 'success', 'danger'][
                  ['未审核', '通过审核', '不通过审核'].indexOf(
                    row.original.status
                  )
                ]
              "
            >
              {{ row.original.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          v-if="Number(query.step) == 3"
          align="center"
          label="质检项审核意见"
          width="auto"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.original.message"
              size="mini"
              type="textarea"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="Number(query.step) == 3"
          align="center"
          label="提交"
          width="auto"
        >
          <template #default="{ row }">
            <el-button plain @click.native="changeItem(row)"> 提交 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
    <input
      ref="uploader"
      accept="*"
      style="display: none"
      type="file"
      @change="doUpload($event)"
    />
  </el-container>
</template>

<script>
import { Loading } from "element-ui";
import { queryView } from "@/api/View/index";
import {
  postBatch,
  postEvidence,
  queryEvidence,
  delEvidence,
  putEvidence,
  generatereport,
} from "@/api/Evidence/index";
import { querycompanyDevice, putDevice } from "@/api/Device/index";
import { uppyUpload } from "@/api/Upload/index";
import { getToken } from "@/utils/auth";
export default {
  name: "TopoEvicence",
  props: {
    deviceInfo: {
      type: Object,
      default: () => {},
    },
    cardList: {
      type: Array,
      default: () => [],
    },
    asideShow: {
      type: Boolean,
      default: () => true,
    },
    objectId: {
      type: String,
    },
    avator: {
      type: String,
    },
    query: {
      type: Object,
      default: () => {}, //地址栏条件
    },
  },
  data() {
    return {
      loading: true,
      ukey: "",
      evidenceTopoList: [],
      currentTopoIndex: 0, //当前页面索引
      currentTopo: {}, //当前页的视图详情
      devicelayer: {},
      devicestage: {},
      evidenceList: [], //证据列表
      selectType: {}, //选择上传的证据类型
      evidenceCountShow: true,
      timer: "",
      evidenceid: "", //上传文件生成的证据id
      requests: {}, //请求证据参数
      evidence: {}, //konva 中的证据链
      evidenceDialog: false, //取证列表显隐控制
      evidences: [], //所选的取证列表
      auditDialog: false,
      auditList: [],
      taskType: "", //任务类型
      badge: {
        Unreviewed: [],
        Approved: [],
        notapproved: [],
      },
    };
  },
  async mounted() {
    let params = {
      order: "title",
      skip: 0,
      where: { type: "topo", class: "Device", key: this.deviceInfo.objectId },
    };
    await this.getUkey(this.deviceInfo.parentId.objectId);
    const { results } = await queryView(params);
    this.loading = false;
    this.evidenceTopoList = results;
    this.currentTopo = this.evidenceTopoList[this.currentTopoIndex];
    this.createKonva();
    this.initKonva();
    if (this.query.step != 1) this.auditQuery(2, "review");
  },
  methods: {
    async evidenceClick(params) {
      this.evidences = [];
      try {
        // const loading = this.$baseColorfullLoading()
        // if (params?.length)
        //   params.forEach((item) => {
        //     item.original.path =
        //       '/dgiot_file' + item.original.path.split('/dgiot_file')[1]
        //   })
        this.evidences = params;
        this.evidenceDialog = true;
        // loading.close()
      } catch (error) {
        console.log(error);
        // this.$baseMessage(
        //   this.$translateTitle('alert.Data request error') + `${error}`,
        //   'error',
        //   'dgiot-hey-message-error'
        // )
      }
    },
    //提交
    async changeItem(row) {
      try {
        // const loading = this.$baseColorfullLoading();
        const params = {
          original: _.merge(row.original, {
            status: row.original.status,
            message: row.original.message,
          }),
        };
        const res = await putEvidence(row.objectId, params);
        console.log(res);
        this.auditQuery(0, "init");
        this.$message({
          type: "success",
          message: "提交成功",
          showClose: true,
        });
        // this.$baseMessage(
        //   this.$translateTitle("alert.Data request successfully"),
        //   "success",
        //   "dgiot-hey-message-success"
        // );
        // loading.close();
      } catch (error) {
        console.log(error);
        this.$baseMessage(
          this.$translateTitle("alert.Data request error") + `${error}`,
          "error",
          "dgiot-hey-message-error"
        );
      }
    },
    // 审核是否通过
    async notapproved(params, step) {
      // 判断下未审核任务的个数
      if (this.badge.Unreviewed.length === this.auditList) {
        this.$message("当前任务证据没有被审核");
        return false;
      }
      try {
        // const loading = this.$baseColorfullLoading();
        const finish = {
          profile: _.merge(params.profile, {
            message: params.profile.message,
            step: step,
            endtime: new Date().getTime().toString(),
          }),
        };
        const res = await putDevice(params.objectId, finish);
        this.auditDialog = false;
        // this.$router.push({
        //   path: "/cloudTest/review",
        // });
        // this.$baseMessage(
        //   this.$translateTitle("alert.Data request successfully"),
        //   "success",
        //   "dgiot-hey-message-success"
        // );
        // loading.close();
      } catch (error) {
        this.$message(error);
      }
    },
    async finishEvidence(params, step) {
      this.$confirm("请确认是否提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(async () => {
          try {
            if (this.auditList?.length) {
              let loadingInstance = Loading.service({ fullscreen: true });
              // const loading = this.$baseColorfullLoading();
              const finish = {
                profile: _.merge(params.profile, {
                  step: step,
                }),
              };
              await generatereport(params.objectId);
              const res = await putDevice(params.objectId, finish);

              // this.$router.push({
              //   path: "/cloudTest/Task",
              // });
              loadingInstance.close();
              this.$emit("reloadCurrent");
              // location.reload()
            } else {
              this.$message({
                type: "info",
                message: "未提交任何证据",
              });
              return;
            }
          } catch (error) {
            this.$message({
              type: "error",
              message: error,
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
      // this.$confirm("请确认是否提交", null, async () => {});
    },
    // 预览
    async auditQuery(num, type) {
      this.taskType = type;
      this.badge = {
        Unreviewed: [],
        Approved: [],
        notapproved: [],
      };
      try {
        const params = {
          order: "-createdAt",
          skip: 0,
          where: {
            "original.taskid": this.deviceInfo.objectId,
            reportId: { $ne: this.deviceInfo.objectId },
          },
        };
        // const loading = this.$baseColorfullLoading()
        if (num == 1) this.auditDialog = true;
        const { results } = await queryEvidence(params);
        this.auditList = _.filter(results, function (item) {
          return item.original.type !== "avgs";
        });
        this.auditList.forEach((audit) => {
          if (audit.original.status == "未审核")
            this.badge.Unreviewed.push(audit);
          else if (audit.original.status == "通过审核")
            this.badge.Approved.push(audit);
          else this.badge.notapproved.push(audit);
        });
        // this.$baseMessage(
        //   this.$translateTitle('alert.Data request successfully'),
        //   'success',
        //   'dgiot-hey-message-success'
        // )
        // loading.close()
      } catch (error) {
        this.$message({
          message: error,
          type: "danger",
        });
        // this.$baseMessage(
        //   this.$translateTitle("alert.Data request error") + `${error}`,
        //   "error",
        //   "dgiot-hey-message-error"
        // );
      }
    },
    clouseDraw() {
      this.evidenceDialog = false;
      this.auditDialog = false;
    },
    async deleteFile(objectId, index, evidences) {
      evidences.splice(index, 1);
      try {
        let loadingInstance = Loading.service({ fullscreen: true });
        const res = await delEvidence(objectId);
        this.queryEvidence(this.requests);
        if (this.evidenceDialog) {
          this.handleEvidenceDetail(this.selectType);
        }
        loadingInstance.close();
        this.$message({
          message: "删除成功",
          type: "success",
        });
        // this.$baseMessage(
        //   this.$translateTitle('alert.Data request successfully'),
        //   'success',
        //   'dgiot-hey-message-success'
        // )
      } catch (error) {
        this.$message({
          message: error,
          type: "danger",
        });
        // this.$baseMessage(
        //   this.$translateTitle('alert.Data request error') + `${error}`,
        //   'error',
        //   'dgiot-hey-message-error'
        // )
      }
    },
    //修改保存证据
    async saveEvidences(objectId, index, row) {
      try {
        let loadingInstance = Loading.service({ fullscreen: true });
        const params = {
          original: row.original,
        };
        const res = await putEvidence(objectId, params);
        loadingInstance.close();
        this.$message({
          message: "保存成功",
          type: "success",
        });
      } catch (error) {
        this.$message({
          message: error,
          type: "danger",
        });
      }
    },
    async handleEvidenceDetail(row) {
      // 查看详情列表
      this.selectType = row; //上传类型
      console.log(row, this.selectType);
      const _params = {
        order: "-createdAt",
        skip: 0,
        where: {
          reportId: this.currentTopo.objectId, //view 视图 objectId
          "original.controlid": row.success.evidence.attrs.id,
        },
      };
      const { results = [] } = await queryEvidence(_params);
      console.log(results);
      this.evidences = results;
      this.evidenceDialog = true;
    },
    handleUpload1() {
      this.$refs.uploader.click();
    },
    /**
     *  上传证据
     */
    async doUpload(event) {
      this.timer = new Date();
      this.evidenceid = this.$md5(
        "Evidence" + this.ukey + Math.round(this.timer) + ""
      ).substring(0, 10);
      console.log(this.evidenceid, this.timer);
      const file = event.target.files[0];
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      try {
        const Evidence = {
          auth_token: getToken(),
          scene: "evidence",
          code: "",
          path: `dgiot_file/evidence/${this.selectType.type}`,
          output: "json",
          submit: "upload",
          file: file,
          filename: `${this.evidenceid}${fileType}`,
        };
        var formData = new FormData();
        for (let key in Evidence) {
          formData.append(key, Evidence[key]);
        }
        //  process.env.NODE_ENV === "development"
        //   ? process.env.VUE_APP_URL
        //   : location.origin;
        //  const { NODE_ENV = 'development' } = process.env
        const url = this.$FileServe + "/upload";
        const { data } = await uppyUpload(url, formData);
        if (data?.md5) {
          this.depositEvidence(data);
        }
      } catch (error) {}
      // console.log(file, fileType);
    },
    // 将上传文件与证据链进行关联
    async depositEvidence(params) {
      try {
        const Evidence = {
          objectId: this.evidenceid,
          ukey: this.ukey,
          timestamp: Math.round(this.timer),
          md5: params.md5,
          original: {
            taskid: this.deviceInfo.objectId, //设备objectId
            controlid: this.selectType.id,
            path: params.path,
            type: this.selectType.type,
          },
        };
        console.log(Evidence, this.currentTopo);
        const res = await postEvidence(this.currentTopo.objectId, Evidence);
        // this.getNumberEvidence(this.badgePath)
      } catch (error) {
        console.log(error);
      }
      this.queryEvidence(this.requests);
      if (this.evidenceDialog) {
        this.handleEvidenceDetail(this.selectType);
      }
      // this.queryevidences()
    },
    // 点击上传按钮
    handleUpload(row) {
      console.log(row);
      this.selectType = row; //上传类型
      this.$refs.uploader.click();
    },
    getType(type) {
      switch (type) {
        case "video":
          return "视频";
        case "audio":
          return "音频";
        case "image":
          return "图片";
        case "file":
          return "文件";
      }
    },
    // 创建组态
    async createKonva() {
      this.devicelayer = Konva.Node.create(
        this.currentTopo.data.konva.Stage,
        "evidencekonva"
      ).findOne("Layer");
      this.devicestage = new Konva.Stage({
        container: "evidencekonva",
        width: this.currentTopo.data.konva.Stage.attrs.width,
        height: this.currentTopo.data.konva.Stage.attrs.height,
      });
      this.devicestage.add(this.devicelayer);
    },
    //切换页面
    activeBtn(btn, index) {
      this.evidenceList = [];
      console.log(btn, index);
      this.currentTopoIndex = index;
      this.currentTopo = this.evidenceTopoList[this.currentTopoIndex];
      this.createKonva();
      this.initKonva();
    },
    /**
     * 初始化组态使得图片能进行展示
     */
    async initKonva() {
      this.devicestage.find("Label").forEach((node) => {
        // info["Label"] = stage.find("Label");
        // this.initSize(node)
        node.setAttrs({
          draggable: false,
        });
      });
      this.devicestage.find("Text").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
        node.on("touchend", async (e) => {});
        /** */
        node.on("click", async (e) => {});
      });
      let evidenceList = [];
      this.devicestage.find("Path").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
        evidenceList.push(node);
        node.on("touchend", async (e) => {
          console.log("1111", node);
        });
        /** */
        node.on("click", async (e) => {
          console.log("1111", node);
          let row = {};
          this.evidenceList.forEach((item) => {
            if (node.attrs.id == item.success.evidence.attrs.id) {
              row = item;
            }
            // console.log(item, node);
          });
          // return;
          this.selectType = row; //上传类型
          console.log(row, this.selectType);
          const _params = {
            order: "-createdAt",
            skip: 0,
            where: {
              reportId: this.currentTopo.objectId, //view 视图 objectId
              "original.controlid": row.success.evidence.attrs.id,
            },
          };
          const { results = [] } = await queryEvidence(_params);
          console.log(results);
          this.evidences = results;
          this.evidenceDialog = true;
        });
      });

      this.devicestage.find("Image").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
        let image = new Image();
        node.setAttrs({
          image: image,
        });
        image.src = node.attrs.src.includes("//")
          ? node.attrs.src
          : this.$FileServe + node.attrs.src;
      });
      this.devicestage.find("Rect").forEach((node) => {
        node.setAttrs({
          draggable: false,
        });
      });
      // this.layer.draw();
      this.devicelayer.batchDraw();
      setTimeout(() => {
        this.devicelayer.batchDraw();
      }, 500);
      this.queryBatch(evidenceList);
    },
    /**
     * 生成证据查询条件
     */
    async queryBatch(params) {
      let evidence = {
        batch: [],
        path: [],
      };
      params.forEach((item) => {
        evidence.batch.push({
          body: {
            order: "-createdAt",
            skip: 0,
            count: "objectId",
            where: {
              reportId: this.currentTopo.objectId,
              "original.controlid": item.attrs.id,
            },
          },
          method: "GET",
          evidence: item.attrs.icon,
          path: `/classes/Evidence`,
        });
        evidence.path.push(item);
      });
      this.evidence = evidence;
      this.requests = { requests: evidence.batch };
      this.queryEvidence(this.requests);
    },
    // 查询证据
    async queryEvidence(batch) {
      const res = await postBatch(batch);
      res.forEach((item, index) => {
        item.success.evidence = this.evidence.path[index];
        item.count = item.success.count;
        item.type = item.success.evidence.attrs.type;
        item.id = item.success.evidence.attrs.id;
      });
      this.evidenceList = res;
    },
    // ukey获取
    async getUkey(parentId) {
      this.ukey = "";
      // try {
      try {
        const params = {
          limit: 1,
          order: "-createdAt",
          skip: 0,
          keys: "devaddr",
          where: {
            parentId: parentId,
            product: "3f95880e09",
          },
        };
        const { results = [] } = await querycompanyDevice(params);
        if (results?.[0]?.devaddr) {
          this.ukey = results[0].devaddr;
          console.log("this.ukey", this.ukey);
        }
      } catch (error) {
        console.log("错误", error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.topoEvidence {
  position: relative;
  background-color: #fff;
  display: flex;
  width: 100%;
  height: 100%;
  .evidence_container_aside {
    width: 80px;
    background-color: #027be3;
    display: flex;
    flex-direction: column;
    align-items: center;
    .btns {
      margin-top: 20px;
      width: 40px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      cursor: pointer;
    }
    .success {
      background-color: #00ff00;
    }
    .info {
      background-color: #000;
    }
  }
  .evidence_main {
    position: relative;
    flex: 1;
    .evidenceItem {
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      border-radius: 50%;
      box-sizing: border-box;
      color: #fff;
      background-color: #027be3;
    }
    // background-color: #0088d2;
  }
  .evidence_list {
    position: fixed;
    right: 2%;
    top: 10%;
    width: 500px;
    box-shadow: -1px 1px 1px 1px #ccc;
    // height: 30%;
  }
  .evidence_footer {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #027be3;
  }
}
</style>

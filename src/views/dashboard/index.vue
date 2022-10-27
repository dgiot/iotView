<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <!-- <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 96px 0 8px 0;
      "
    >
      <span style="font-size: 32px; font-weight: bold"
        >浙江保舒康新材料有限公司</span
      >
    </div>
    <div
      style="
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 40;
        font-size: 20px;
      "
    >
      浙江保舒康新材料有限公司经营范围为新型材料的技术开发、技术咨询、技术服务、成果转让；家用纺织制成品制造；产业用纺织制成品制造；非金属矿物制品制造；第一类医疗器械生产；第一类医疗器械销售；产业用纺织制成品销售
      <br />
      <h4>
        我们致力于为客户提供更专业的产品、更具竞争力的价格、更全面完善的服务。我们用我们的行动为地球的环保做出最大的努力。
      </h4>
    </div> -->
    <amis style="height:100%" modal-append-to-body :schema="viewData" :show-help="false" />
    <div id="container"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Amis from "@/components/Amis/index.vue";
export default {
  name: "Dashboard",
  components: {
    // DgiotAmis:DgiotAmis,
    amis: Amis,
  },
  data() {
    return {
      json: {
        attrs: {
          height: 700,
          width: 700,
        },
        children: [
          {
            attrs: {
              id: "Layer_Thing",
            },
            children: [
              {
                attrs: {
                  draggable: true,
                  fontSize: 12,
                  id: "f9dddd0eeb_amisBMK8t",
                  name: "amis",
                  opacity: 0.75,
                  x: 323,
                  y: 84.95900920567532,
                },
                children: [],
                className: "Label",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "",
                  fontFamily: "宋体",
                  fontSize: 15,
                  height: 283,
                  id: "print_paper",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "black",
                  strokeWidth: 4,
                  text: "",
                  type: "paper",
                  width: 408,
                  x: 2,
                  y: 1,
                },
                className: "Rect",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Verdana",
                  fontSize: 16,
                  height: 20,
                  id: "596569e7b3_textmKM3S",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "JEENUO",
                  type: "label",
                  width: 300,
                  x: 13,
                  y: 14,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 16,
                  height: 20,
                  id: "596569e7b3_textGh4pl",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "浙江保舒康新材料有限公司",
                  type: "label",
                  width: 300,
                  x: 34,
                  y: 39,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textizw15",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "单据编号:",
                  type: "label",
                  width: 80,
                  x: 10,
                  y: 70,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textrHEUk",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "班次:",
                  type: "label",
                  width: 300,
                  x: 200,
                  y: 70,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textJHhnI",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "品名:",
                  type: "label",
                  width: 300,
                  x: 10,
                  y: 100,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 12,
                  id: "596569e7b3_textHrVkX",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "生产卷号:",
                  type: "label",
                  width: 100,
                  x: 200,
                  y: 100,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textWi91j",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "品检:",
                  type: "label",
                  width: 300,
                  x: 10,
                  y: 130,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textOJ5M0",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "日期:",
                  type: "label",
                  width: 100,
                  x: 200,
                  y: 130,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textOlIP1",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "长:",
                  type: "label",
                  width: 80,
                  x: 10,
                  y: 160,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textw1qYj",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "宽:",
                  type: "label",
                  width: 80,
                  x: 100,
                  y: 160,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textlZlCp",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "毛重:",
                  type: "label",
                  width: 100,
                  x: 200,
                  y: 160,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textogXlO",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "净重:",
                  type: "label",
                  width: 100,
                  x: 10,
                  y: 185,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textEG6ai",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "接头数:",
                  type: "label",
                  width: 100,
                  x: 200,
                  y: 185,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 10,
                  id: "596569e7b3_textaiToJ",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "去向:",
                  type: "label",
                  width: 300,
                  x: 9,
                  y: 210,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "596569e7b3_textrAfjn",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "原因:",
                  type: "label",
                  width: 300,
                  x: 200,
                  y: 210,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "splunce_banci",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "A1",
                  type: "value",
                  width: 300,
                  x: 250,
                  y: 70,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "spec",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "X6055W-T2170",
                  type: "value",
                  width: 140,
                  x: 70,
                  y: 100,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "rollnum",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "A20221009A01",
                  type: "value",
                  width: 100,
                  x: 280,
                  y: 100,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "people",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "张三",
                  type: "value",
                  width: 100,
                  x: 70,
                  y: 130,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "date",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "2022-10-09",
                  type: "value",
                  width: 300,
                  x: 250,
                  y: 130,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "wide",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "20",
                  type: "value",
                  width: 60,
                  x: 140,
                  y: 160,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "long",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "18",
                  type: "value",
                  width: 40,
                  x: 53,
                  y: 160,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "num",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "22",
                  type: "value",
                  width: 300,
                  x: 250,
                  y: 160,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "fundsuttle",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "12",
                  type: "value",
                  width: 100,
                  x: 70,
                  y: 185,
                },
                className: "Text",
              },
              {
                attrs: {
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  height: 20,
                  id: "joint",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "12",
                  type: "label",
                  width: 100,
                  x: 270,
                  y: 185,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "destination",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "成品仓库",
                  type: "value",
                  width: 100,
                  x: 60,
                  y: 210,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "quality",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "合格",
                  type: "label",
                  width: 150,
                  x: 264,
                  y: 210,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: 4,
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: 29,
                  height: 50,
                  id: "spunlace_id_barcode",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "1234567800jh",
                  type: "scancodetext",
                  width: 150,
                  x: 61,
                  y: 270.00534412955466,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 12,
                  format: "",
                  height: 20,
                  id: "orderid",
                  lineHeight: 0,
                  name: "printer",
                  opacity: 0.75,
                  stroke: "",
                  strokeWidth: 0.1,
                  text: "MO2208300009",
                  type: "value",
                  width: 100,
                  x: 90,
                  y: 70,
                },
                className: "Text",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(170, 234, 213, 1)",
                  fontFamily: "宋体",
                  fontSize: 12,
                  format: "",
                  height: 50,
                  id: "sheetsid",
                  name: "printer",
                  opacity: 0.75,
                  stroke: "black",
                  strokeWidth: 4,
                  text: "1334456456h",
                  type: "scancode",
                  width: 150,
                  x: 25,
                  y: 229,
                },
                className: "Rect",
              },
              {
                attrs: {
                  align: "",
                  draggable: true,
                  fill: "rgba(0, 0, 0, 1)",
                  fontFamily: "Calibri",
                  fontSize: 14,
                  format: "",
                  height: 20,
                  id: "printer",
                  name: "printer",
                  text: "打印机",
                  type: "printer",
                  width: 100,
                  x: 82,
                  y: 344,
                },
                className: "Text",
              },
            ],
            className: "Layer",
          },
        ],
        className: "Stage",
      },
      layer: "",
      stage: "",
      viewData:{
  "type": "crud",
  "api": {
    "url": "/iotapi/amis/Device?orderBy=objectId&orderDir=asc&count=objectId&where=%7B%22objectId%22%3A%22%22%2C%22product%22%3A%22%22%2C%22name%22%3A%22%22%2C%22detail.realstatus%22%3A%22%22%7D&page=1&perPage=12",
    "method": "get",
    "convertKeyToPath": false
  },
  "card": {
    "body": [
      {
        "map": {
          "0": "<span class='label label-default'>未派发</span>",
          "1": "<span class='label label-danger'>未开始</span>",
          "2": "<span class='label label-warning'>加工中</span>",
          "3": "<span class='label  label-danger'>待首检</span>",
          "4": "<span class='label label-success'>首检完成</span>",
          "5": "<span class='label label-danger'>待尾检</span>",
          "6": "<span class='label label-success'>尾检完成</span>",
          "7": "<span class='label label-danger'>待入库</span>",
          "8": "<span class='label label-success'>已出库</span>"
        },
        "mode": "inline",
        "name": "$detail.realstatus",
        "type": "mapping",
        "label": "订单状态"
      },
      {
        "mode": "inline",
        "name": "$content.baseInfo.Number",
        "label": "计划数量"
      },
      {
        "mode": "inline",
        "name": "$basedata.progress",
        "label": "完成数量"
      }
    ],
    "type": "card",
    "header": {
      "title": "$name",
      "subTitle": "$content.baseInfo.DeviceName",
       "avatar": "<%= data.avatar || \"https://internal-amis-res.cdn.bcebos.com/images/2019-12/1575350573496/4873dbfaf6a5.png\" %>",
      "avatarClassName": "pull-left thumb b-3x m-r"
    },
    "actions": [
      {
        "type": "button",
        "label": "查看",
        "drawer": {
          "body": {
            "body": [
              {
                "name": "name",
                "type": "static",
                "label": "单据编号",
                "labelClassName": "font-bold"
              },
              {
                "name": "content.baseInfo.Material_List.Material_code",
                "type": "static",
                "label": "物料编号",
                "searchable": true,
                "extractValue": true,
                "labelClassName": "font-bold"
              },
              {
                "name": "content.baseInfo.Material_List.DeviceName",
                "type": "static",
                "label": "物料名称",
                "required": true,
                "labelField": "label",
                "selectMode": "tree",
                "valueField": "label",
                "labelClassName": "font-bold"
              },
              {
                "name": "content.baseInfo.Number",
                "type": "static",
                "label": "计划生产数量",
                "labelClassName": "font-bold"
              },
              {
                "name": "basedata.progress",
                "type": "static",
                "label": "实际生产数量",
                "labelClassName": "font-bold"
              },
              {
                "name": "detail.realstatus",
                "type": "static",
                "label": "任务状态",
                "labelClassName": "font-bold"
              },
              // {
              //  "type": "date",
              //  "name": "detail.taskstart",
              //  "label": "任务开工时间",
              //  "format": "YYYY-MM-DD HH:mm:ss",
              // //  "disabled": false,
              //  "mode": "horizontal",
              //  "placeholder": "-"
              //  },
              //  {
              //   'type':'static',
              //   'label':""
              //  },
              //  {
              //  "type": "date",
              //  "name": "detail.taskend",
              //  "label": "任务开工时间",
              //  "format": "YYYY-MM-DD HH:mm:ss",
              //  "disabled": false,
              // //  "mode": "horizontal",
              //  "placeholder": "-"
              //  },
              // {
              //   "name": "detail.taskstart",
              //   "type": "static",
              //   "label": "任务开始时间",
              //   "labelClassName": "font-bold"
              // },
              // {
              //   "name": "detail.taskend",
              //   "type": "static",
              //   "label": "任务完工时间",
              //   "labelClassName": "font-bold"
              // }
            ],
            "type": "form"
          },
          "title": "查看"
        },
        "actionType": "drawer"
      }
    ],
    // "className": "m-b-none flex",
    "itemClassName": "flex",
    "itemsClassName": "flex"
  },
  "mode": "cards",
  "name": "curd1",
  "pageField": "skip",
  "perPageField": "limit",
  "syncLocation": false,
  // "defaultParams": {
  //   "skip": 0,
  //   "count": "objectId",
  //   "limit": 12,
  //   "order": "-updatedAt",
  //   "where": {
  //     "product": "21efa507f6"
  //   }
  // },
  "footerToolbar": [
  ],
  "headerToolbar": [
  ],
  "silentPolling": true,
  "stopAutoRefreshWhen": "this.switch ==0",
  "alwaysShowPagination": true
},
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  mounted() {
    // this.layer = Konva.Node.create(this.json, "container").findOne("Layer");
    // console.log("layer", this.layer);
    var width = window.innerWidth;
    var height = window.innerHeight;
    // this.stage = new Konva.Stage({
    //   container: "container",
    //   width: width,
    //   height: height,
    // });
    // this.stage.add(this.layer);
    // this.$dgiotBus.$on("/konva", () => {
    //   this.stage.find("Text").forEach((node) => {
    //     console.log("node", node);
    //     node.setAttrs({
    //       text: "改变",
    //     });
    //   });
    //    this.layer.draw();
    // });
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container{
   height: 90vh;
  //  width: 100%;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.container {
  position: fixed;
  width: 100vh;
  height: 100vh;
}
.dialog_wrap {
    height: 100vh;
    width: 100%;
    overflow: scroll;
  }
</style>

<template>
  <div class="contianer">
    <div class="city city-wap">
      <div class="search">
        <input type="text" placeholder="搜索条件">
      </div>
      <div class="city-list">
        <div class="block-60"></div>
        <div v-for="item in cityListData" class="clearfix">
          <p :id="item.ckey">{{item.ckey}}</p>
          <ul>
            <li v-for="ritem in item.cityList" @click="onClickCity(ritem.cityName)">{{ritem.cityName}}</li>
          </ul>
        </div>
      </div>
      <div class="filter">
        <div v-for="item in cityListKey" @click="switchKey(item)">{{item}}</div>
      </div>
      <div class="active-key" v-if="activeKey">{{activeKey}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CitySelector',
  data () {
    return {
      title: 'web秀 - VUE开发一个组件——Vue PC城市选择',
      showCity: false,
      dataList: [{"airportCode":"YIE","cityInfo":"AES-阿尔山-YIE","cityName":"阿尔山市","airportName":"伊尔施","status":0,"lat":47.3155940318,"lng":119.9293992017},{"airportCode":"AKA","cityInfo":"AK-安康-AKA","cityName":"安康","airportName":"五里铺","status":0,"lat":32.7132899844,"lng":108.9462270884},{"airportCode":"AKU","cityInfo":"AKS-阿克苏-AKU","cityName":"阿克苏地区","airportName":"阿克苏","status":0,"lat":41.2657516858,"lng":80.3049157658},{"airportCode":"NGQ","cityInfo":"AL-阿里-NGQ","cityName":"阿里地区","airportName":"昆莎","status":0,"lat":32.1081287447,"lng":80.0637591367},{"airportCode":"ALA","cityInfo":"ALMT-阿尔玛塔-ALA","cityName":"阿拉木图","airportName":"阿尔玛塔","status":0},{"airportCode":"RHT","cityInfo":"ALSYQ-阿拉善右旗-RHT","cityName":"阿拉善右旗","airportName":"阿拉善右旗","status":0,"lat":39.2338594871,"lng":101.449757309},{"airportCode":"AXF","cityInfo":"ALSZQ-阿拉善左旗-AXF","cityName":"阿拉善左旗","airportName":"阿拉善左旗","status":0,"lat":38.7557982014,"lng":105.6005245992},{"airportCode":"AAT","cityInfo":"ALT-阿勒泰-AAT","cityName":"阿勒泰地区","airportName":"阿勒泰","status":0,"lat":47.7598336237,"lng":88.0980789547},{"airportCode":"MFM","cityInfo":"AM-澳门机场-MFM","cityName":"澳门","airportName":"澳门机场","status":0},{"airportCode":"AQG","cityInfo":"AQ-安庆-AQG","cityName":"安庆","airportName":"天柱山","status":0,"lat":30.588657451,"lng":117.0590404752},{"airportCode":"AVA","cityInfo":"AS-安顺-AVA","cityName":"安顺","airportName":"黄果树","status":0,"lat":26.2597888219,"lng":105.8829846711},{"airportCode":"AOG","cityInfo":"AS-鞍山-AOG","cityName":"鞍山","airportName":"鞍山","status":0,"lat":41.1130080621,"lng":122.8700258677},{"airportCode":"AYN","cityInfo":"AY-安阳-AYN","cityName":"安阳","airportName":"安阳","status":0,"lat":36.1344263165,"lng":114.3589343508},{"airportCode":"BFU","cityInfo":"BB-蚌埠-BFU","cityName":"蚌埠","airportName":"蚌埠","status":0,"lat":32.8739116294,"lng":117.323651187},{"airportCode":"BHY","cityInfo":"BH-北海-BHY","cityName":"北海","airportName":"福城","status":0,"lat":38.9792985799,"lng":121.5611631245},{"airportCode":"PEK","cityInfo":"BJ-北京-PEK","cityName":"北京","airportName":"首都","status":1,"lat":40.0881944004,"lng":116.6033998315},{"airportCode":"BFJ","cityInfo":"BJ-毕节-BFJ","cityName":"毕节地区","airportName":"毕节飞雄","status":0,"lat":27.2679513003,"lng":105.4896355881},{"airportCode":"BPL","cityInfo":"BL-博乐-BPL","cityName":"博乐市","airportName":"博乐","status":0,"lat":44.9063838683,"lng":82.3093832891},{"airportCode":"BSD","cityInfo":"BS-保山-BSD","cityName":"保山","airportName":"保山","status":0,"lat":25.0576729834,"lng":99.1721365383},{"airportCode":"AEB","cityInfo":"BSTY-百色田阳-AEB","cityName":"百色田阳","airportName":"百色","status":0,"lat":23.7220365116,"lng":106.9778613736},{"airportCode":"BAV","cityInfo":"BT-包头-BAV","cityName":"包头","airportName":"二里半","status":0,"lat":40.570825954,"lng":110.01100424},{"airportCode":"RLK","cityInfo":"BYNE-巴彦淖尔-RLK","cityName":"巴彦淖尔","airportName":"天吉泰","status":0,"lat":40.929745798,"lng":107.7517828066},{"airportCode":"NBS","cityInfo":"CBS-长白山-NBS","cityName":"长白山","airportName":"长白山","status":0,"lat":42.0723050773,"lng":127.619712825},{"airportCode":"CGQ","cityInfo":"CC-长春-CGQ","cityName":"长春","airportName":"龙嘉","status":1,"lat":44.0009890376,"lng":125.703457153},{"airportCode":"CGD","cityInfo":"CD-常德-CGD","cityName":"常德","airportName":"桃花源","status":0,"lat":28.9267752417,"lng":111.6503975906},{"airportCode":"CTU","cityInfo":"CD-成都-CTU","cityName":"成都","airportName":"双流","status":1,"lat":30.5803776062,"lng":103.961527938},{"airportCode":"CDE","cityInfo":"CD-承德-CDE","cityName":"承德","airportName":"承德普宁","status":0,"lat":41.1348604606,"lng":118.0851386395},{"airportCode":"BPX","cityInfo":"CDBD-昌都邦达-BPX","cityName":"昌都邦达","airportName":"邦达","status":0,"lat":30.5557140737,"lng":97.1129544556},{"airportCode":"CIF","cityInfo":"CF-赤峰-CIF","cityName":"赤峰","airportName":"玉龙","status":0,"lat":42.1623386478,"lng":118.8459504292},{"airportCode":"CNI","cityInfo":"CH-长海-CNI","cityName":"长海县","airportName":"大长山岛","status":0,"lat":39.2741466702,"lng":122.67618994},{"airportCode":"CKG","cityInfo":"CQ-重庆-CKG","cityName":"重庆","airportName":"江北","status":1,"lat":29.7225273468,"lng":106.6514916108},{"airportCode":"CSX","cityInfo":"CS-长沙-CSX","cityName":"长沙","airportName":"黄花","status":1,"lat":28.1944116398,"lng":113.2278216955},{"airportCode":"CHG","cityInfo":"CY-朝阳-CHG","cityName":"朝阳","airportName":"朝阳","status":0,"lat":41.5527245765,"lng":120.4482282493},{"airportCode":"CZX","cityInfo":"CZ-常州-CZX","cityName":"常州","airportName":"奔牛","status":0,"lat":31.9183316473,"lng":119.7936875435},{"airportCode":"CCC","cityInfo":"CZ-潮州-CCC","cityName":"潮州","airportName":"潮州","status":0,"lat":23.669491,"lng":116.638119},{"airportCode":"CIH","cityInfo":"CZ-长治-CIH","cityName":"长治","airportName":"王村","status":0,"lat":36.249624815,"lng":113.1341828215},{"airportCode":"DCY","cityInfo":"DC-稻城-DCY","cityName":"稻城县","airportName":"稻城亚丁","status":0,"lat":29.3155733731,"lng":100.0725972866},{"airportCode":"DDG","cityInfo":"DD-丹东-DDG","cityName":"丹东","airportName":"浪头","status":0,"lat":40.037496843,"lng":124.2930998322},{"airportCode":"DNH","cityInfo":"DH-敦煌-DNH","cityName":"敦煌市","airportName":"敦煌","status":0,"lat":40.172542119,"lng":94.8111518941},{"airportCode":"DLU","cityInfo":"DL-大理-DLU","cityName":"大理","airportName":"大理","status":0,"lat":25.6540267918,"lng":100.3295414174},{"airportCode":"DLC","cityInfo":"DL-大连-DLC","cityName":"大连","airportName":"周水子","status":1,"lat":38.9704952247,"lng":121.5484655257},{"airportCode":"DQA","cityInfo":"DQ-大庆-DQA","cityName":"大庆","airportName":"大庆萨尔图","status":0,"lat":46.7550483699,"lng":125.1458058793},{"airportCode":"DIG","cityInfo":"DQ-迪庆-DIG","cityName":"迪庆藏族自治州","airportName":"香格里拉","status":0,"lat":27.7986676379,"lng":99.6890110559},{"airportCode":"DAT","cityInfo":"DT-大同-DAT","cityName":"大同","airportName":"大同云冈","status":0,"lat":40.0633674836,"lng":113.4955246715},{"airportCode":"DOY","cityInfo":"DY-东营-DOY","cityName":"东营","airportName":"东营","status":0,"lat":37.5117936666,"lng":118.7957917752},{"airportCode":"DZU","cityInfo":"DZ-大足-DZU","cityName":"大足区","airportName":"大足","status":0},{"airportCode":"DAX","cityInfo":"DZ-达州-DAX","cityName":"达州","airportName":"河市","status":0,"lat":31.1358488691,"lng":107.4380354776},{"airportCode":"DSN","cityInfo":"EEDS-鄂尔多斯-DSN","cityName":"鄂尔多斯","airportName":"鄂尔多斯","status":0,"lat":39.5058347502,"lng":109.8734805566},{"airportCode":"EJN","cityInfo":"EJNQ-额济纳旗-EJN","cityName":"额济纳旗","airportName":"额济纳旗","status":0,"lat":42.019961319,"lng":101.00940593},{"airportCode":"ERL","cityInfo":"ELHT-二连浩特-ERL","cityName":"二连浩特市","airportName":"二连浩特","status":0,"lat":43.4354568233,"lng":112.1110030816},{"airportCode":"ENH","cityInfo":"ES-恩施-ENH","cityName":"恩施自治州","airportName":"许家坪","status":0,"lat":30.325277243,"lng":109.4963366368},{"airportCode":"FUO","cityInfo":"FS-佛山-FUO","cityName":"佛山","airportName":"佛山","status":0,"lat":23.0739424215,"lng":113.0771777828},{"airportCode":"FYN","cityInfo":"FY-富蕴-FYN","cityName":"富蕴县","airportName":"可可托海","status":0},{"airportCode":"FYJ","cityInfo":"FY-抚远-FYJ","cityName":"抚远县","airportName":"抚远东极","status":0,"lat":48.2124195016,"lng":134.3802619396},{"airportCode":"FUG","cityInfo":"FY-阜阳-FUG","cityName":"阜阳","airportName":"西关","status":0,"lat":32.8828914505,"lng":115.7505104646},{"airportCode":"FOC","cityInfo":"FZ-福州-FOC","cityName":"福州","airportName":"长乐","status":1,"lat":25.9344146245,"lng":119.6794580725},{"airportCode":"GOQ","cityInfo":"GEM-格尔木-GOQ","cityName":"格尔木市","airportName":"格尔木","status":0,"lat":36.4085053165,"lng":94.7968091147},{"airportCode":"GHN","cityInfo":"GH-广汉-GHN","cityName":"广汉市","airportName":"广汉","status":0,"lat":30.9514588545,"lng":104.3311758943},{"airportCode":"KWL","cityInfo":"GL-桂林-KWL","cityName":"桂林","airportName":"两江","status":1,"lat":25.2213055014,"lng":110.0581922152},{"airportCode":"KHH","cityInfo":"GX-高雄-KHH","cityName":"高雄 (及邻近地区)","airportName":"小港","status":0},{"airportCode":"GYU","cityInfo":"GY-固原-GYU","cityName":"固原","airportName":"固原","status":0,"lat":36.0825336792,"lng":106.2322904378},{"airportCode":"GYS","cityInfo":"GY-广元-GYS","cityName":"广元","airportName":"广元","status":0,"lat":32.3989284573,"lng":105.7111942358},{"airportCode":"KWE","cityInfo":"GY-贵阳-KWE","cityName":"贵阳","airportName":"龙洞堡","status":1,"lat":26.5474076321,"lng":106.8077624789},{"airportCode":"CAN","cityInfo":"GZ-广州-CAN","cityName":"广州","airportName":"白云","status":1,"lat":23.3923841265,"lng":113.3093955889},{"airportCode":"KOW","cityInfo":"GZ-赣州-KOW","cityName":"赣州","airportName":"黄金","status":0,"lat":25.8514566391,"lng":114.7900010451},{"airportCode":"HIA","cityInfo":"HA-淮安-HIA","cityName":"淮安","airportName":"淮安涟水","status":0,"lat":33.7937755098,"lng":119.141470815},{"airportCode":"HCJ","cityInfo":"HC-河池-HCJ","cityName":"河池","airportName":"河池金城江","status":0,"lat":24.8086247011,"lng":107.7210129972},{"airportCode":"HDG","cityInfo":"HD-邯郸-HDG","cityName":"邯郸","airportName":"邯郸","status":0,"lat":36.5299274427,"lng":114.4414662839},{"airportCode":"HRB","cityInfo":"HEB-哈尔滨-HRB","cityName":"哈尔滨","airportName":"太平","status":1,"lat":45.6288277569,"lng":126.2496007854},{"airportCode":"HFE","cityInfo":"HF-合肥-HFE","cityName":"合肥","airportName":"新桥","status":0,"lat":31.9928267613,"lng":116.9760079527},{"airportCode":"HJJ","cityInfo":"HH-怀化-HJJ","cityName":"怀化","airportName":"芷江","status":0,"lat":27.4474717116,"lng":109.712145144},{"airportCode":"HEK","cityInfo":"HH-黑河-HEK","cityName":"黑河","airportName":"黑河","status":0,"lat":50.1859598952,"lng":127.3266626565},{"airportCode":"HET","cityInfo":"HHHT-呼和浩特-HET","cityName":"呼和浩特","airportName":"白塔","status":0,"lat":40.8616820008,"lng":111.8279956622},{"airportCode":"HAK","cityInfo":"HK-海口-HAK","cityName":"海口","airportName":"美兰","status":1,"lat":19.9426200135,"lng":110.4700107314},{"airportCode":"HUN","cityInfo":"HL-花莲-HUN","cityName":"花莲县","airportName":"花莲","status":0},{"airportCode":"HLD","cityInfo":"HLE-海拉尔-HLD","cityName":"海拉尔区","airportName":"东山","status":0,"lat":49.215810374,"lng":119.8337444867},{"airportCode":"HMI","cityInfo":"HM-哈密-HMI","cityName":"哈密地区","airportName":"哈密","status":0,"lat":42.8465657109,"lng":93.6639432718},{"airportCode":"TXN","cityInfo":"HS-黄山-TXN","cityName":"黄山","airportName":"屯溪","status":0,"lat":29.7338235455,"lng":118.2650741241},{"airportCode":"HTN","cityInfo":"HT-和田-HTN","cityName":"和田地区","airportName":"和田","status":0,"lat":37.0454490082,"lng":79.8806388552},{"airportCode":"HXD","cityInfo":"HX-海西-HXD","cityName":"海西蒙古族藏族自治州","airportName":"德令哈","status":0,"lat":37.1335683185,"lng":97.2735029882},{"airportCode":"AHJ","cityInfo":"HY-红原-AHJ","cityName":"红原县","airportName":"阿坝红原","status":0,"lat":32.5320854734,"lng":102.3658827665},{"airportCode":"HNY","cityInfo":"HY-衡阳-HNY","cityName":"衡阳","airportName":"衡阳","status":0,"lat":26.7270396005,"lng":112.6252983866},{"airportCode":"HUZ","cityInfo":"HZ-惠州-HUZ","cityName":"惠州","airportName":"惠州平潭","status":0,"lat":23.0550684696,"lng":114.6100479613},{"airportCode":"HGH","cityInfo":"HZ-杭州-HGH","cityName":"杭州","airportName":"萧山","status":1,"lat":30.242256372,"lng":120.4449898283},{"airportCode":"HZG","cityInfo":"HZ-汉中-HZG","cityName":"汉中","airportName":"汉中城固","status":0,"lat":33.128124103,"lng":107.2077905276},{"airportCode":"KNC","cityInfo":"JA-吉安-KNC","cityName":"吉安","airportName":"吉安","status":0,"lat":26.85708393,"lng":114.7543546758},{"airportCode":"JIC","cityInfo":"JC-金昌-JIC","cityName":"金昌","airportName":"金昌","status":0,"lat":38.546718615,"lng":102.3528701197},{"airportCode":"JDZ","cityInfo":"JDZ-景德镇-JDZ","cityName":"景德镇","airportName":"罗家","status":0,"lat":29.34017803,"lng":117.1910499252},{"airportCode":"JGD","cityInfo":"JGDQ-加格达奇-JGD","cityName":"加格达奇区","airportName":"加格达奇","status":0,"lat":50.3811008352,"lng":124.1249935993},{"airportCode":"JGS","cityInfo":"JGS-井冈山-JGS","cityName":"井冈山市","airportName":"井冈山","status":0,"lat":26.85708393,"lng":114.7543546758},{"airportCode":"JHG","cityInfo":"JH-景洪-JHG","cityName":"景洪市","airportName":"景洪","status":0,"lat":21.9796404886,"lng":100.773111234},{"airportCode":"JUH","cityInfo":"JHS-九华山-JUH","cityName":"池州","airportName":"九华山","status":0,"lat":30.7420535313,"lng":117.6954488771},{"airportCode":"JIU","cityInfo":"JJ-九江-JIU","cityName":"九江","airportName":"马回岭","status":0,"lat":29.4881186724,"lng":115.8138932391},{"airportCode":"JJN","cityInfo":"JJ-晋江-JJN","cityName":"晋江","airportName":"泉州晋江","status":0,"lat":24.8063216121,"lng":118.5996149337},{"airportCode":"JIL","cityInfo":"JL-吉林-JIL","cityName":"吉林","airportName":"二台子","status":0,"lat":43.999156,"lng":126.408373},{"airportCode":"KNH","cityInfo":"JM-金门-KNH","cityName":"金门县","airportName":"尚义","status":0},{"airportCode":"JMU","cityInfo":"JMS-佳木斯-JMU","cityName":"佳木斯","airportName":"东郊","status":0,"lat":46.8533151516,"lng":130.4706664256},{"airportCode":"TNA","cityInfo":"JN-济南-TNA","cityName":"济南","airportName":"遥墙","status":1,"lat":36.8581736735,"lng":117.2203628885},{"airportCode":"JNG","cityInfo":"JN-济宁-JNG","cityName":"济宁","airportName":"济宁","status":0,"lat":35.3030345697,"lng":116.3632547505},{"airportCode":"UCB","cityInfo":"JN-集宁-UCB","cityName":"集宁区","airportName":"乌兰察布","status":0,"lat":41.1321262461,"lng":113.1238272972},{"airportCode":"CHW","cityInfo":"JQ-酒泉-CHW","cityName":"酒泉","airportName":"酒泉","status":0,"lat":40.172542119,"lng":94.8111518941},{"airportCode":"JXA","cityInfo":"JX-鸡西-JXA","cityName":"鸡西","airportName":"鸡西兴凯湖","status":0,"lat":45.3086500891,"lng":131.1926263762},{"airportCode":"CYI","cityInfo":"JY-嘉义-CYI","cityName":"嘉义(及邻近地区)","airportName":"嘉义","status":0},{"airportCode":"SWA","cityInfo":"JY-揭阳-SWA","cityName":"揭阳","airportName":"揭阳潮汕","status":0,"lat":23.5548066384,"lng":116.5192254387},{"airportCode":"JGN","cityInfo":"JYG-嘉峪关-JGN","cityName":"嘉峪关","airportName":"嘉峪关","status":0,"lat":39.8702797676,"lng":98.3474444917},{"airportCode":"CJU","cityInfo":"JZ-济州-CJU","cityName":"济州岛","airportName":"济州","status":0},{"airportCode":"SHS","cityInfo":"JZ-荆州-SHS","cityName":"荆州","airportName":"沙市","status":0,"lat":30.3255167127,"lng":112.2888815328},{"airportCode":"JNZ","cityInfo":"JZ-锦州-JNZ","cityName":"锦州","airportName":"锦州湾国际机场","status":0,"lat":40.9384455861,"lng":121.2922534134},{"airportCode":"JZH","cityInfo":"JZG-九寨沟-JZH","cityName":"九寨沟县","airportName":"黄龙","status":0,"lat":32.8577078151,"lng":103.6941240201},{"airportCode":"KCA","cityInfo":"KC-库车-KCA","cityName":"库车县","airportName":"库车","status":0,"lat":41.6886254869,"lng":82.8833494174},{"airportCode":"KGT","cityInfo":"KD-康定-KGT","cityName":"康定县","airportName":"康定","status":0,"lat":30.1360667635,"lng":101.7583497895},{"airportCode":"KRL","cityInfo":"KEL-库尔勒-KRL","cityName":"库尔勒市","airportName":"库尔勒","status":0,"lat":41.6289217741,"lng":86.1501827954},{"airportCode":"KJH","cityInfo":"KL-凯里-KJH","cityName":"凯里市","airportName":"凯里黄平","status":0,"lat":26.9786828965,"lng":107.9979072811},{"airportCode":"KRY","cityInfo":"KLMY-克拉玛依-KRY","cityName":"克拉玛依","airportName":"克拉玛依","status":0,"lat":45.4745421387,"lng":84.9658101074},{"airportCode":"KMG","cityInfo":"KM-昆明-KMG","cityName":"昆明","airportName":"长水国际","status":1,"lat":25.1022352246,"lng":102.9350643064},{"airportCode":"KJI","cityInfo":"KNS-喀纳斯-KJI","cityName":"喀纳斯","airportName":"喀纳斯","status":0,"lat":48.2306604884,"lng":87.011762781},{"airportCode":"KHG","cityInfo":"KS-喀什-KHG","cityName":"喀什地区","airportName":"喀什","status":0,"lat":39.5429463133,"lng":76.0203189784},{"airportCode":"LLB","cityInfo":"LB-荔波-LLB","cityName":"荔波县","airportName":"荔波","status":0,"lat":25.4496101406,"lng":107.973909707},{"airportCode":"LNJ","cityInfo":"LC-临沧-LNJ","cityName":"临沧","airportName":"临沧","status":0,"lat":23.7469796828,"lng":100.0331024428},{"airportCode":"LCX","cityInfo":"LC-连城-LCX","cityName":"连城县","airportName":"连城","status":0,"lat":25.6853848622,"lng":116.7655541809},{"airportCode":"LFQ","cityInfo":"LF-临汾-LFQ","cityName":"临汾","airportName":"临汾","status":0,"lat":36.136426054,"lng":111.6503688497},{"airportCode":"LJG","cityInfo":"LJ-丽江-LJG","cityName":"丽江","airportName":"三义机场","status":0,"lat":26.6723830545,"lng":100.2546830558},{"airportCode":"LLV","cityInfo":"LL-吕梁-LLV","cityName":"吕梁","airportName":"吕梁大武","status":0,"lat":37.6915248656,"lng":111.1515738632},{"airportCode":"LIA","cityInfo":"LP-梁平-LIA","cityName":"梁平县","airportName":"梁平","status":0,"lat":30.6750894118,"lng":107.792273171},{"airportCode":"HZH","cityInfo":"LP-黎平-HZH","cityName":"黎平县","airportName":"黎平","status":0,"lat":26.3230437692,"lng":109.1649481005},{"airportCode":"LPF","cityInfo":"LPS-六盘水-LPF","cityName":"六盘水","airportName":"六盘水月照","status":0,"lat":26.6091254931,"lng":104.9799037454},{"airportCode":"LUZ","cityInfo":"LS-庐山-LUZ","cityName":"九江县","airportName":"庐山","status":0,"lat":29.4875886724,"lng":115.8137532391},{"airportCode":"LXA","cityInfo":"LS-拉萨-LXA","cityName":"拉萨","airportName":"贡嘎","status":0,"lat":29.2962830877,"lng":90.9075282537},{"airportCode":"LHN","cityInfo":"LS-梨山-LHN","cityName":"梨山","airportName":"梨山","status":0},{"airportCode":"LXI","cityInfo":"LX-林西-LXI","cityName":"林西县","airportName":"林西","status":0},{"airportCode":"LYI","cityInfo":"LY-临沂-LYI","cityName":"临沂","airportName":"临沂","status":0,"lat":35.0544129416,"lng":118.4196578168},{"airportCode":"KYD","cityInfo":"LY-兰屿-KYD","cityName":"兰屿","airportName":"兰屿","status":0},{"airportCode":"LYA","cityInfo":"LY-洛阳-LYA","cityName":"洛阳","airportName":"北郊","status":0,"lat":34.7416099858,"lng":112.3983650339},{"airportCode":"LYG","cityInfo":"LYG-连云港-LYG","cityName":"连云港","airportName":"白塔埠","status":0,"lat":34.5704766659,"lng":118.8884338416},{"airportCode":"LHW","cityInfo":"LZ-兰州-LHW","cityName":"兰州","airportName":"中川","status":0,"lat":36.5135673539,"lng":103.6246524393},{"airportCode":"LZY","cityInfo":"LZ-林芝-LZY","cityName":"林芝地区","airportName":"林芝","status":0},{"airportCode":"LZH","cityInfo":"LZ-柳州-LZH","cityName":"柳州","airportName":"白莲","status":0,"lat":24.2091516664,"lng":109.4095178684},{"airportCode":"LZO","cityInfo":"LZ-泸州-LZO","cityName":"泸州","airportName":"蓝田","status":0,"lat":28.8481943826,"lng":105.3897914018},{"airportCode":"MDG","cityInfo":"MDJ-牡丹江-MDG","cityName":"牡丹江","airportName":"海浪","status":0,"lat":44.5434931937,"lng":129.5944927789},{"airportCode":"MZG","cityInfo":"MG-马公-MZG","cityName":"马公","airportName":"太武","status":0},{"airportCode":"OHE","cityInfo":"MH-漠河-OHE","cityName":"漠河县","airportName":"漠河","status":0,"lat":52.9319644544,"lng":122.4333319289},{"airportCode":"LUM","cityInfo":"MS-芒市-LUM","cityName":"芒市","airportName":"德宏潞西","status":0,"lat":24.4201117902,"lng":98.5437874525},{"airportCode":"MIG","cityInfo":"MY-绵阳-MIG","cityName":"绵阳","airportName":"南郊","status":0,"lat":31.4318140273,"lng":104.7562738282},{"airportCode":"MXZ","cityInfo":"MZ-梅州-MXZ","cityName":"梅州","airportName":"梅县","status":0,"lat":24.2693757689,"lng":116.1155147442},{"airportCode":"LZN","cityInfo":"MZ-马祖-LZN","cityName":"马祖","airportName":"南竿","status":0},{"airportCode":"NZH","cityInfo":"MZL-满洲里-NZH","cityName":"满洲里市","airportName":"西郊","status":0,"lat":36.1344263165,"lng":114.3589343508},{"airportCode":"NLH","cityInfo":"N?-宁蒗-NLH","cityName":"宁蒗彝族自治县","airportName":"泸沽湖","status":0,"lat":27.5464031819,"lng":100.7655813181},{"airportCode":"NGB","cityInfo":"NB-宁波-NGB","cityName":"宁波","airportName":"栎社","status":0,"lat":29.824687113,"lng":121.4729503374},{"airportCode":"NAO","cityInfo":"NC-南充-NAO","cityName":"南充","airportName":"高坪","status":0,"lat":30.7942975874,"lng":106.1724252307},{"airportCode":"KHN","cityInfo":"NC-南昌-KHN","cityName":"南昌","airportName":"昌北","status":1,"lat":28.8651287175,"lng":115.9202983126},{"airportCode":"NKG","cityInfo":"NJ-南京-NKG","cityName":"南京","airportName":"禄口","status":1,"lat":31.7388636374,"lng":118.877865396},{"airportCode":"NLT","cityInfo":"NLT-那拉提-NLT","cityName":"那拉提瓦","airportName":"那拉提","status":0,"lat":43.4366629594,"lng":83.3859042399},{"airportCode":"NNG","cityInfo":"NN-南宁-NNG","cityName":"南宁","airportName":"吴圩","status":1,"lat":22.6071574576,"lng":108.1921204996},{"airportCode":"NTG","cityInfo":"NT-南通-NTG","cityName":"南通","airportName":"兴东","status":0,"lat":32.0769567594,"lng":120.9872457997},{"airportCode":"NNY","cityInfo":"NY-南阳-NNY","cityName":"南阳","airportName":"姜营","status":0,"lat":32.9878597272,"lng":112.6254100714},{"airportCode":"HCN","cityInfo":"PD-屏东-HCN","cityName":"屏东县","airportName":"恒春","status":0},{"airportCode":"PIF","cityInfo":"PD-屏东-PIF","cityName":"屏东市","airportName":"屏东","status":0,"lat":31.1525686033,"lng":121.8085798905},{"airportCode":"CMJ","cityInfo":"PH-澎湖-CMJ","cityName":"澎湖县","airportName":"七美","status":0},{"airportCode":"PZI","cityInfo":"PZH-攀枝花-PZI","cityName":"攀枝花","airportName":"攀枝花","status":0,"lat":26.5407493254,"lng":101.8021781789},{"airportCode":"TAO","cityInfo":"QD-青岛-TAO","cityName":"青岛","airportName":"流亭","status":1,"lat":6.2721435596,"lng":120.3933779901},{"airportCode":"BAR","cityInfo":"QH-琼海-BAR","cityName":"琼海市","airportName":"博鳌","status":0,"lat":19.1458461477,"lng":110.4694325567},{"airportCode":"SHP","cityInfo":"QHD-秦皇岛-SHP","cityName":"秦皇岛","airportName":"山海关","status":0,"lat":39.9825665128,"lng":119.7374695949},{"airportCode":"IQM","cityInfo":"QM-且末-IQM","cityName":"且末县","airportName":"且末","status":0,"lat":38.1507441039,"lng":85.5424736382},{"airportCode":"NDG","cityInfo":"QQHE-齐齐哈尔-NDG","cityName":"齐齐哈尔","airportName":"三家子","status":0,"lat":47.2597606021,"lng":123.9303378732},{"airportCode":"IQN","cityInfo":"QY-庆阳-IQN","cityName":"庆阳","airportName":"庆阳","status":0,"lat":35.8069597056,"lng":107.6169623023},{"airportCode":"HIN","cityInfo":"QZ-清州-HIN","cityName":"清州","airportName":"清州","status":0},{"airportCode":"JUZ","cityInfo":"QZ-衢州-JUZ","cityName":"衢州","airportName":"衢州","status":0,"lat":28.9742670119,"lng":118.9076412217},{"airportCode":"RKZ","cityInfo":"RKZ-日喀则-RKZ","cityName":"日喀则地区","airportName":"和平","status":0,"lat":29.3525862318,"lng":89.3071636919},{"airportCode":"RIZ","cityInfo":"RZ-日照-RIZ","cityName":"日照","airportName":"日照","status":0,"lat":35.4062425755,"lng":119.3348900123},{"airportCode":"SHA","cityInfo":"SH-上海-SHA","cityName":"上海","airportName":"虹桥","status":1,"lat":31.2017613131,"lng":121.3424493848},{"airportCode":"SHF","cityInfo":"SHZ-石河子-SHF","cityName":"石河子市","airportName":"石河子","status":0,"lat":44.2533601601,"lng":85.9056696327},{"airportCode":"SJW","cityInfo":"SJZ-石家庄-SJW","cityName":"石家庄","airportName":"正定","status":0,"lat":38.2877819573,"lng":114.704410463},{"airportCode":"SQJ","cityInfo":"SM-三明-SQJ","cityName":"三明","airportName":"沙县","status":0,"lat":26.4275103788,"lng":117.851489918},{"airportCode":"SYM","cityInfo":"SM-思茅-SYM","cityName":"思茅","airportName":"思茅","status":0,"lat":22.7993822987,"lng":100.9693952898},{"airportCode":"HPG","cityInfo":"SNJ-神农架-HPG","cityName":"神农架林区","airportName":"神农架","status":0,"lat":31.626004894,"lng":110.3506448433},{"airportCode":"SQD","cityInfo":"SR-上饶-SQD","cityName":"上饶","airportName":"三清山","status":0,"lat":28.3855044168,"lng":117.9752586779},{"airportCode":"SYX","cityInfo":"SY-三亚-SYX","cityName":"三亚","airportName":"凤凰","status":1,"lat":18.31109889,"lng":109.4192440744},{"airportCode":"WDS","cityInfo":"SY-十堰-WDS","cityName":"十堰","airportName":"武当山","status":0,"lat":32.5968157061,"lng":110.9162196296},{"airportCode":"WGN","cityInfo":"SY-武冈机场-WGN","cityName":"邵阳","airportName":"武冈机场","status":0,"lat":26.8016388508,"lng":110.6544915939},{"airportCode":"SHE","cityInfo":"SY-沈阳-SHE","cityName":"沈阳","airportName":"桃仙","status":1,"lat":41.6427282916,"lng":123.4971686025},{"airportCode":"SZX","cityInfo":"SZ-深圳-SZX","cityName":"深圳","airportName":"宝安","status":1,"lat":22.632827438,"lng":113.8185836983},{"airportCode":"SZV","cityInfo":"SZ-苏州-SZV","cityName":"苏州","airportName":"","status":0,"lat":31.3053856841,"lng":120.591694189},{"airportCode":"TSA","cityInfo":"TB-台北-TSA","cityName":"台北(及其周边地区)","airportName":"松山","status":0,"lat":23.5369981754,"lng":113.5217312398},{"airportCode":"TPE","cityInfo":"TB-桃园-TPE","cityName":"桃园县","airportName":"桃园","status":0},{"airportCode":"TCG","cityInfo":"TC-塔城-TCG","cityName":"塔城地区","airportName":"塔城","status":0,"lat":46.6764760275,"lng":83.349279565},{"airportCode":"TCZ","cityInfo":"TC-腾冲-TCZ","cityName":"腾冲县","airportName":"驼峰","status":0,"lat":24.9425694522,"lng":98.4893818288},{"airportCode":"GNI","cityInfo":"TD-台东-GNI","cityName":"台东县","airportName":"绿岛","status":0,"lat":41.628014678,"lng":123.5486063234},{"airportCode":"TTT","cityInfo":"TD-台东-TTT","cityName":"台东市","airportName":"丰年","status":0},{"airportCode":"TNH","cityInfo":"TH-通化-TNH","cityName":"通化","airportName":"通化","status":0,"lat":42.0601317145,"lng":125.7543625807},{"airportCode":"TSN","cityInfo":"TJ-天津-TSN","cityName":"天津","airportName":"滨海","status":1,"lat":39.1372322979,"lng":117.3654477179},{"airportCode":"TGO","cityInfo":"TL-通辽-TGO","cityName":"通辽","airportName":"通辽","status":0,"lat":43.5636167225,"lng":122.2164595948},{"airportCode":"TLQ","cityInfo":"TLF-吐鲁番-TLQ","cityName":"吐鲁番地区","airportName":"吐鲁番","status":0,"lat":43.0343918598,"lng":89.1100159548},{"airportCode":"TNN","cityInfo":"TN-台南-TNN","cityName":"台南(及邻近地区)","airportName":"台南","status":0},{"airportCode":"TEN","cityInfo":"TR-铜仁-TEN","cityName":"铜仁地区","airportName":"大兴","status":0},{"airportCode":"TVS","cityInfo":"TS-唐山-TVS","cityName":"唐山","airportName":"唐山三女河","status":0,"lat":39.7301812448,"lng":118.0064121195},{"airportCode":"THQ","cityInfo":"TS-天水-THQ","cityName":"天水","airportName":"天水","status":0,"lat":34.5610262268,"lng":105.8753233722},{"airportCode":"TYN","cityInfo":"TY-太原-TYN","cityName":"太原","airportName":"武宿","status":1,"lat":37.7578312352,"lng":112.6392246062},{"airportCode":"TXG","cityInfo":"TZ-台中-TXG","cityName":"台中 (及邻近地区)","airportName":"台中","status":0},{"airportCode":"HYN","cityInfo":"TZ-台州-HYN","cityName":"台州","airportName":"路桥","status":0,"lat":28.5613887837,"lng":121.42814537},{"airportCode":"WEF","cityInfo":"WF-潍坊-WEF","cityName":"潍坊","airportName":"潍坊","status":0,"lat":36.6471642214,"lng":119.1269273203},{"airportCode":"WUA","cityInfo":"WH-乌海-WUA","cityName":"乌海","airportName":"乌海","status":0,"lat":39.7977747261,"lng":106.8145834115},{"airportCode":"WEH","cityInfo":"WH-威海-WEH","cityName":"威海","airportName":"威海","status":0,"lat":37.1962139365,"lng":122.2472651938},{"airportCode":"WUH","cityInfo":"WH-武汉-WUH","cityName":"武汉","airportName":"天河","status":1,"lat":30.7808705519,"lng":114.2202667036},{"airportCode":"WHU","cityInfo":"WH-芜湖-WHU","cityName":"芜湖","airportName":"芜湖","status":0,"lat":31.0966891264,"lng":118.6682339632},{"airportCode":"HLH","cityInfo":"WLHT-乌兰浩特-HLH","cityName":"乌兰浩特市","airportName":"乌兰浩特","status":0,"lat":46.201687458,"lng":122.0149919844},{"airportCode":"URC","cityInfo":"WLMQ-乌鲁木齐-URC","cityName":"乌鲁木齐","airportName":"地窝堡","status":1,"lat":43.9137391145,"lng":87.4855044898},{"airportCode":"WNH","cityInfo":"WS-文山-WNH","cityName":"文山壮族苗族自治州","airportName":"文山","status":0,"lat":23.5693279885,"lng":104.3403207192},{"airportCode":"WUX","cityInfo":"WX-无锡-WUX","cityName":"无锡","airportName":"硕放","status":0,"lat":31.5089621454,"lng":120.4394092919},{"airportCode":"WUS","cityInfo":"WYS-武夷山-WUS","cityName":"武夷山市","airportName":"武夷山","status":0,"lat":27.7107774748,"lng":118.0114834785},{"airportCode":"WXN","cityInfo":"WZ-万州-WXN","cityName":"万州区","airportName":"五桥","status":0,"lat":30.804166397,"lng":108.4386633946},{"airportCode":"WUZ","cityInfo":"WZ-梧州-WUZ","cityName":"梧州","airportName":"长州岛","status":0,"lat":23.4597829022,"lng":111.2625832145},{"airportCode":"WNZ","cityInfo":"WZ-温州-WNZ","cityName":"温州","airportName":"龙湾","status":0,"lat":27.9188544652,"lng":120.8595129834},{"airportCode":"XIY","cityInfo":"XA-西安-XIY","cityName":"西安","airportName":"咸阳","status":1,"lat":34.4435547096,"lng":108.7697311657},{"airportCode":"XEN","cityInfo":"XC-兴城-XEN","cityName":"兴城市","airportName":"兴城","status":0,"lat":40.770136,"lng":120.87863},{"airportCode":"XIC","cityInfo":"XC-西昌-XIC","cityName":"西昌市","airportName":"青山","status":0,"lat":27.9822172419,"lng":102.1975736606},{"airportCode":"GXH","cityInfo":"XH-夏河-GXH","cityName":"夏河县","airportName":"夏河","status":0,"lat":34.8277719025,"lng":102.6290884512},{"airportCode":"XIL","cityInfo":"XLHT-锡林浩特-XIL","cityName":"锡林浩特市","airportName":"锡林浩特","status":0,"lat":43.9240173012,"lng":115.9722464559},{"airportCode":"XMN","cityInfo":"XM-厦门-XMN","cityName":"厦门","airportName":"高崎","status":1,"lat":24.5402494703,"lng":118.1382587833},{"airportCode":"XIN","cityInfo":"XN-兴宁-XIN","cityName":"兴宁市","airportName":"兴宁","status":0},{"airportCode":"XNN","cityInfo":"XN-西宁-XNN","cityName":"西宁","airportName":"曹家堡","status":0,"lat":36.5304167353,"lng":102.0492446499},{"airportCode":"XNT","cityInfo":"XT-邢台-XNT","cityName":"邢台","airportName":"邢台","status":0,"lat":36.8753562021,"lng":114.5203304873},{"airportCode":"ACX","cityInfo":"XY-兴义-ACX","cityName":"兴义市","airportName":"兴义","status":0,"lat":25.0870575183,"lng":104.9658589215},{"airportCode":"XFN","cityInfo":"XY-襄阳-XFN","cityName":"襄州区（原襄阳区）","airportName":"襄阳","status":0,"lat":32.1555241823,"lng":112.3015505713},{"airportCode":"XUZ","cityInfo":"XZ-徐州-XUZ","cityName":"徐州","airportName":"观音","status":0,"lat":34.0591197405,"lng":117.566894261},{"airportCode":"WUT","cityInfo":"XZ-忻州-WUT","cityName":"忻州","airportName":"五台山","status":0,"lat":38.6072206136,"lng":113.0014732374},{"airportCode":"ENY","cityInfo":"YA-延安-ENY","cityName":"延安","airportName":"延安","status":0},{"airportCode":"YBP","cityInfo":"YB-宜宾-YBP","cityName":"宜宾","airportName":"菜坝","status":0,"lat":28.8014200939,"lng":104.5621740943},{"airportCode":"LDS","cityInfo":"YC-伊春-LDS","cityName":"伊春","airportName":"伊春","status":0,"lat":47.7579405516,"lng":129.029142673},{"airportCode":"YIH","cityInfo":"YC-宜昌-YIH","cityName":"宜昌","airportName":"三峡","status":0,"lat":0.0,"lng":111.4922610218},{"airportCode":"YIC","cityInfo":"YC-宜春-YIC","cityName":"宜春","airportName":"宜春明月山","status":0,"lat":27.8018134495,"lng":114.3228367078},{"airportCode":"YNZ","cityInfo":"YC-盐城-YNZ","cityName":"盐城","airportName":"南洋","status":0,"lat":33.4362020127,"lng":120.2151681903},{"airportCode":"YCU","cityInfo":"YC-运城-YCU","cityName":"运城","airportName":"关公","status":0,"lat":35.1200687965,"lng":111.0501232963},{"airportCode":"INC","cityInfo":"YC-银川-INC","cityName":"银川","airportName":"河东","status":0,"lat":38.3303163468,"lng":106.3998509717},{"airportCode":"YNJ","cityInfo":"YJ-延吉-YNJ","cityName":"延吉市","airportName":"朝阳川","status":0,"lat":42.8938928517,"lng":129.4537156393},{"airportCode":"YKH","cityInfo":"YK-营口-YKH","cityName":"营口","airportName":"兰旗","status":0,"lat":40.549106498,"lng":122.3626374701},{"airportCode":"UYN","cityInfo":"YL-榆林-UYN","cityName":"榆林","airportName":"榆林榆阳","status":0,"lat":38.3678090448,"lng":109.6082475115},{"airportCode":"YLN","cityInfo":"YL-铱兰-YLN","cityName":"铱兰","airportName":"铱兰","status":0},{"airportCode":"YUA","cityInfo":"YM-元谋-YUA","cityName":"元谋县","airportName":"元谋","status":0,"lat":25.739836,"lng":101.859705},{"airportCode":"YIN","cityInfo":"YN-伊宁-YIN","cityName":"伊宁市","airportName":"伊宁","status":0,"lat":43.9631705065,"lng":81.3423711284},{"airportCode":"YUS","cityInfo":"YS-玉树-YUS","cityName":"玉树藏族自治州","airportName":"玉树","status":0,"lat":32.8438289421,"lng":97.0450360686},{"airportCode":"YNT","cityInfo":"YT-烟台-YNT","cityName":"烟台","airportName":"蓬莱国际","status":0,"lat":37.6642371341,"lng":120.9984173332},{"airportCode":"YIW","cityInfo":"YW-义乌-YIW","cityName":"义乌市","airportName":"义乌","status":0,"lat":29.3464578386,"lng":120.0389750211},{"cityInfo":"YY-益阳-YY","cityName":"益阳","status":0,"lat":28.5601061113,"lng":112.361737793},{"airportCode":"YTY","cityInfo":"YZ-扬州-YTY","cityName":"扬州","airportName":"扬州泰州","status":0,"lat":32.5662816102,"lng":119.7251334598},{"airportCode":"LLF","cityInfo":"YZ-永州-LLF","cityName":"永州","airportName":"永州","status":0,"lat":26.3475387449,"lng":111.6243484335},{"airportCode":"JIQ","cityInfo":"ZB-舟白-JIQ","cityName":"黔江区","airportName":"黔江舟白","status":0,"lat":29.520888506,"lng":108.8399988195},{"airportCode":"ZUH","cityInfo":"ZH-珠海-ZUH","cityName":"珠海","airportName":"三灶","status":0,"lat":22.0151238157,"lng":113.3837603448},{"airportCode":"ZHA","cityInfo":"ZJ-湛江-ZHA","cityName":"湛江","airportName":"湛江","status":0,"lat":21.2183459334,"lng":110.372753934},{"airportCode":"DYG","cityInfo":"ZJJ-张家界-DYG","cityName":"张家界","airportName":"荷花","status":0,"lat":29.1100277126,"lng":110.4575530782},{"airportCode":"ZQZ","cityInfo":"ZJK-张家口-ZQZ","cityName":"张家口","airportName":"张家口","status":0,"lat":40.7461174707,"lng":114.9436254875},{"airportCode":"HSN","cityInfo":"ZS-舟山-HSN","cityName":"舟山","airportName":"普陀山","status":0,"lat":29.9396135515,"lng":122.3683649114},{"airportCode":"ZAT","cityInfo":"ZT-昭通-ZAT","cityName":"昭通","airportName":"昭通","status":0,"lat":27.3301345586,"lng":103.7611551827},{"airportCode":"ZHY","cityInfo":"ZW-中卫-ZHY","cityName":"中卫","airportName":"宁夏中卫香山","status":0,"lat":37.5760017758,"lng":105.1625684635},{"airportCode":"YZY","cityInfo":"ZY-张掖-YZY","cityName":"张掖","airportName":"张掖","status":0,"lat":38.8205463625,"lng":100.6627617679},{"airportCode":"ZYI","cityInfo":"ZY-遵义-ZYI","cityName":"遵义","airportName":"遵义","status":0,"lat":27.806135183,"lng":107.2596504547},{"airportCode":"CGO","cityInfo":"ZZ-郑州-CGO","cityName":"郑州","airportName":"新郑","status":1,"lat":34.5308189222,"lng":113.8526878594}],
      activeKey: '',
      upCityList: ''

    }
  },
  computed: {
    cityListData(){
      let map = {}; // 处理过后的数据对象
      let temps = []; // 临时变量
      this.dataList.map(item=>{
          if(item.airportCode){
              let ekey = item.airportCode.charAt(0).toUpperCase(); // 根据key值的第一个字母分组，并且转换成大写
              temps = map[ekey] || []; // 如果map里面有这个key了，就取，没有就是空数组
              temps.push({
                  airportCode: item.airportCode,
                  cityName: item.cityName
              });
              map[ekey] = temps;
          }
      })
      let list = [];
      for(let gkey in map) {
          list.push({
              ckey: gkey,
              cityList: map[gkey]
          })
      }

      list = list.sort((li1, li2)=> li1.ckey.charCodeAt(0) - li2.ckey.charCodeAt(0));
      return list;
    },
    cityListKey(){
      let cityListKey = [];
      this.cityListData.map(item=>{
          cityListKey.push(item.ckey);
      });

      return cityListKey;
    }
  },
  methods: {
    switchKey(key){
      // 当前选中的字母
      this.activeKey = key;
      // 1秒后清空，让`active-key`隐藏
      setTimeout(()=>{
      this.activeKey = '';
      }, 1000)
      // 获取当前字母来cityList中距离顶部的位置
      let targetTop = document.querySelector('#'+key+'').offsetTop;
      window.scrollTo({ 
        top: targetTop - 60, // 60是search的高度
        behavior: "smooth" 
      });
    },
    onClickCity(cityName) {
      let selItem = null;

      let dataList = this.dataList;
      for (let i=0; i<dataList.length; i++) {
        let item = dataList[i];
        if (item.cityName == cityName) {
          selItem = item;
          break;
        }
      }
      this.$emit('onCitySelected', selItem);
    },
  }
}
</script>
<style lang="scss" scoped>
.contianer{
  position: relative;
  background: #efefef;
  width: 400px;
  height: 250px;
  overflow-y: auto;
  z-index: auto;
}
*{
  margin: 0;
  padding: 0;
}
.city-wap{
  color: #3b4f62;
  
  .clearfix{
    &:after{
      content: '';
      display: block;
      clear: both;
    }
  }
  p{
    background: #fff;
    margin-bottom: 10px;
    padding: 0 12px;
  }
  .search{
    display: none;
    top: 0;
    box-shadow: 0 1px 3px 0 rgba(59,79,98,0.1);
    width: 100%;
    height: 50px;
    input{
      line-height: 50px;
      width: 100%;
      border: none;
      box-shadow: none;
      padding: 0 10px;
      &:focus { 
        outline: none; 
      } 
    }
  }
  .city-list{
    .block-60{
      height: 10px;
    }
    ul{
      padding: 0 10px;
      li{
        list-style: none;
        display: inline-block;
        margin-right: 10px;
        width: 29%;
        margin-bottom: 8px;
        line-height: 35px;
        text-align: center;
        color: #333;
        border-radius: 3px;
        background: #fff;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 2px;
        cursor: pointer;
      }
    }
  }
  .filter{
    display:none;
    position: fixed;
    right: 3px;
    top: 60px;
    font-size: 15px;
    color: #ff0000;
    div{
      margin-top: 2px;
      text-align: center;
    }
  }
  .active-key{
    position: fixed;
    width: 100px;
    height: 100px;
    line-height: 100px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    background: #dedede;
    color: #fff;
    border-radius: 100%;
    text-align: center;
    font-size: 40px;
  }
}
.city{
  position:relative;
  .city-components{
    position: absolute;
    width: 500px;
    box-shadow: 0 0 4px 0 rgba(117,117,117,0.5);
    border-radius: 2px;
    padding: 20px 21px;
    .clearfix{
      &:after{
        content: '';
        display: block;
        clear: both;
      }
    }
    li{
      list-style: none;
    }
    ul{
      padding: 0;
      margin: 0;
    }
    .filter-tabar{
      border-bottom: 1px solid #d7d7d7;
      cursor: pointer;
      li{
        text-align: center;
        padding: 0 14px;
        float: left;
        padding-bottom: 14px;
        font-size: 14px;
        margin: 0 8px;
        margin-bottom: -1px;
        position: relative;
        &.active{
          border-bottom: 1px solid #ff7362;
        }
      }
    }
    .city-content{
      max-height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px 13px 0 13px;
      label{
        display: block;
        margin-bottom: 5px !important;
        font-size: 20px !important;
        margin-left: 0 !important;
        color: #5f5f5f !important;
        margin-top: 5px;
      }
      li{
        padding: 6px 0 6px;
        float: left;
        text-align: left;
        font-size: 14px;
        min-width: 56px;
        margin-right: 24px;
        cursor: pointer;
      }
    }
  }
}
</style>
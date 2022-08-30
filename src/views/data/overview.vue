<template>
  <div class="data-overview scrollbar scrollbar-y scrollbar-light">
    <div class="data-title">数据总览</div>
    <div class="data-view">
      <el-row :gutter="20" class="view-row1">
        <el-col :span="6">
          <div class="row1 view-col1-1">
            <div class="col-title">
              <div class="right">
                <el-date-picker
                  class="date-light"
                  v-model="month1"
                  type="month"
                  placeholder="选择月"
                  format="yyyy年MM月"
                  value-format="yyyy-MM"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box">
              <div class="float-left">
                <div class="circle"><img class="colImg" src="../../assets/data/row1.png" /></div>
              </div>
              <div class="float-right">
                <div class="right-num"><span>252</span>/272</div>
                故障处理及时率
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="row1 view-col1-2">
            <div class="col-title">
              <div class="right">
                <el-date-picker
                  class="date-light"
                  v-model="month2"
                  type="month"
                  placeholder="选择月"
                  format="yyyy年MM月"
                  value-format="yyyy-MM"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box">
              <div class="float-left">
                <div class="circle"><img class="colImg" src="../../assets/data/row2.png" /></div>
              </div>
              <div class="float-right">
                <div class="right-num"><span>233</span>/272</div>
                安防处理及时率
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="row1 view-col1-3">
            <div class="col-title">
              <div class="right">
                <el-date-picker
                  class="date-light"
                  v-model="month3"
                  type="month"
                  placeholder="选择月"
                  format="yyyy年MM月"
                  value-format="yyyy-MM"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box">
              <div class="float-left">
                <div class="circle"><img class="colImg" src="../../assets/data/row3.png" /></div>
              </div>
              <div class="float-right">
                <div class="right-num"><span>262</span>/272</div>
                一键求助处理及时率
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="row1 view-col1-4">
            <div class="col-title">
              <div class="left">停车统计分析</div>
              <div class="right">
                <el-date-picker
                  class="date-dark"
                  v-model="month4"
                  type="month"
                  placeholder="选择月"
                  format="yyyy年MM月"
                  value-format="yyyy-MM"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2">
              <div class="car-num">
                <span class="num">08799</span><span class="unit">辆</span><span class="tip">(累计车辆)</span>
              </div>
              <div class="car-tip">
                <div class="tip float-left"><span class="green">·</span>高峰时段 <b class="blue">10:00-10:59</b></div>
                <div class="tip float-right"><span class="red">·</span>低峰时段 <b class="blue">12:00-12:59</b></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="view-row2">
        <el-col :span="9">
          <div class="row2 view-col2-1">
            <div class="col-title">
              <div class="left">设备故障统计</div>
              <div class="right">
                <el-date-picker
                  class="date-dark"
                  v-model="year1"
                  type="year"
                  placeholder="选择年"
                  format="yyyy年"
                  value-format="yyyy"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2 col-box2-img"><img class="colImg" src="../../assets/data/1.png" /></div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="row2 view-col2-2">
            <div class="col-title">
              <div class="left">客流分析<span>辆</span></div>
              <div class="right">
                <el-date-picker
                  class="date-dark"
                  v-model="year1"
                  type="year"
                  placeholder="选择年"
                  format="yyyy年"
                  value-format="yyyy"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2 col-box2-img"><img class="colImg" src="../../assets/data/2.png" /></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="row2 view-col2-3">
            <div class="col-title">
              <div class="left">运营统计分析<span>万元</span></div>
              <div class="right">
                <el-date-picker
                  class="date-dark"
                  v-model="year3"
                  type="year"
                  placeholder="选择年"
                  format="yyyy年"
                  value-format="yyyy"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2">
              <div class="count">
                <div class="float-left">
                  <div class="count-l">
                    <img class="colImg" src="../../assets/data/3.png" />
                    <div class="count-l-num">总收入<br /><span>￥2531348</span></div>
                  </div>
                </div>
                <div class="float-right">
                  <div class="count-r">
                    <span class="blue">·</span>租金收入<b class="blue">1610593<i>47%</i></b>
                  </div>
                  <div class="count-r">
                    <span class="green">·</span>停车费收入<b class="blue">574901<i>26%</i></b>
                  </div>
                  <div class="count-r">
                    <span class="red">·</span>广告收入<b class="blue">436012<i>24%</i></b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="view-row3">
        <el-col :span="12">
          <div class="row3 view-col3-1">
            <div class="col-title">
              <div class="left">环境监测</div>
              <div class="right">
                <div class="environment">
                  <span
                    :class="{ active: item.name == valueSet }"
                    v-for="(item, index) in envirList"
                    :key="index"
                    @click="getName(item.name)"
                  >
                    {{ item.name }}
                  </span>
                </div>
                <el-date-picker
                  class="date-dark"
                  v-model="date"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy年MM月dd日"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2 col-box2-img"><img class="colImg" src="../../assets/data/4.png" /></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="row3 view-col3-2">
            <div class="col-title">
              <div class="left">安防预警统计</div>
              <div class="right">
                <el-date-picker
                  class="date-dark"
                  v-model="year4"
                  type="year"
                  placeholder="选择年"
                  format="yyyy年"
                  value-format="yyyy"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2 col-box2-img"><img class="colImg" src="../../assets/data/5.png" /></div>
          </div>
        </el-col>
        <el-col :span="6">
          <el-row class="view-row3-3">
            <el-col :span="24">
              <div class="view-col3-3">
                <div class="col-title">
                  <div class="left">能耗统计</div>
                  <div class="right">
                    <el-date-picker
                      class="date-dark"
                      v-model="month5"
                      type="month"
                      placeholder="选择月"
                      format="yyyy年MM月"
                      value-format="yyyy-MM"
                    >
                    </el-date-picker>
                  </div>
                </div>
                <div class="ener-box">
                  <div class="ener-left float-left">电</div>
                  <div class="ener-center float-left">
                    <div class="process"><i class="pcs1" style="width: 80%"></i></div>
                  </div>
                  <div class="ener-right float-right">2000<span class="unit">度</span></div>
                </div>
                <div class="ener-box">
                  <div class="ener-left float-left">水</div>
                  <div class="ener-center float-left">
                    <div class="process"><i class="pcs2" style="width: 50%"></i></div>
                  </div>
                  <div class="ener-right float-right">36580<span class="unit">方</span></div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="view-row3-3">
            <el-col :span="24">
              <div class="view-col3-4">
                <div class="col-title">
                  <div class="left">当前出租率统计</div>
                </div>
                <div class="ener-box" style="margin-top: 15px;">
                  <div class="ener-left float-left">已出租</div>
                  <div class="ener-center float-left">
                    <div class="process"><i class="pcs3" style="width: 95%"></i></div>
                  </div>
                  <div class="ener-right float-right">236<span class="percent">95%</span></div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="data-title">设备数据分析</div>
    <div class="data-view">
      <el-row :gutter="20" class="view-row2">
        <el-col :span="18">
          <div class="row2 view-col2-1">
            <div class="col-title">
              <div class="left">设备状态占比</div>
              <div class="right">
                <div class="fault-tip">
                  <div class="tip"><span class="blue">· </span>正常</div>
                  <div class="tip"><span class="red">· </span>故障</div>
                  <div class="tip"><span class="green">· </span>离线</div>
                </div>
                <el-date-picker
                  class="date-dark"
                  v-model="month6"
                  type="month"
                  placeholder="选择月"
                  format="yyyy年MM月"
                  value-format="yyyy-MM"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2 col-box2-img"><img class="colImg" src="../../assets/data/6.png" /></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="row2 view-col2-3">
            <div class="col-title">
              <div class="left">设备实时状态监测</div>
            </div>
            <div class="col-box2">
              <div class="count">
                <div class="float-left">
                  <div class="count-l"><img class="colImg" src="../../assets/data/7.png" /></div>
                </div>
                <div class="float-right">
                  <div class="count-r">
                    <span class="blue">·</span>在线设备<b class="blue">7683<i>89%</i></b>
                  </div>
                  <div class="count-r">
                    <span class="green">·</span>故障设备<b class="blue">136<i>09%</i></b>
                  </div>
                  <div class="count-r">
                    <span class="red">·</span>离线设备<b class="blue">88<i>06%</i></b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="view-row2">
        <el-col :span="9">
          <div class="row2 view-col2-1">
            <div class="col-title">
              <div class="left">设备增长状态</div>
              <div class="right">
                <div class="fault-tip">
                  <div class="tip"><span class="blue">· </span>灯杆</div>
                  <div class="tip"><span class="red">· </span>监控</div>
                  <div class="tip"><span class="green">· </span>设备控制箱</div>
                  <div class="tip"><span class="yellow">· </span>井盖</div>
                  <div class="tip"><span class="green2">· </span>消防栓</div>
                </div>
                <el-date-picker
                  class="date-dark"
                  v-model="year1"
                  type="year"
                  placeholder="选择年"
                  format="yyyy年"
                  value-format="yyyy"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2 col-box2-img"><img class="colImg" src="../../assets/data/8.png" /></div>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="row2 view-col2-1">
            <div class="col-title">
              <div class="left">设备故障统计</div>
              <div class="right">
                <el-date-picker
                  class="date-dark"
                  v-model="year1"
                  type="year"
                  placeholder="选择年"
                  format="yyyy年"
                  value-format="yyyy"
                >
                </el-date-picker>
              </div>
            </div>
            <div class="col-box2 col-box2-img"><img class="colImg" src="../../assets/data/1.png" /></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="row2 view-col2-1">
            <div class="col-title">
              <div class="left">实时运行数据</div>
              <div class="right">···</div>
            </div>
            <div class="col-box2 col-box2-img">
              <el-table :data="tableData">
                <el-table-column prop="sn" label="序列号"></el-table-column>
                <el-table-column prop="name" label="设备名称"></el-table-column>
                <el-table-column prop="state" label="状态"></el-table-column>
                <el-table-column prop="time" label="时间"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'overview',
  data() {
    return {
      month1: '2021-02',
      month2: '2021-02',
      month3: '2021-02',
      month4: '2021-02',
      month5: '2021-02',
      month6: '2021-02',
      year1: '2021',
      year2: '2021',
      year3: '2021',
      year4: '2021',
      date: '2021-02-22',
      tableData: [
        { sn: '001', name: '摄像头', state: '1', time: '20:31:00' },
        { sn: '002', name: '广告屏交互', state: '1', time: '17:30:00' },
        { sn: '003', name: '智能灯具', state: '1', time: '12:45:00' },
        { sn: '004', name: '井盖', state: '1', time: '10:22:00' }
      ],
      envirList: [
        { name: 'PM2.5' },
        { name: '温度' },
        { name: '湿度' },
        { name: '风速' },
        { name: '噪音' },
        { name: '光照强度' }
      ],
      valueSet: '温度'
    };
  },
  beforeDestroy() {
    var html = document.documentElement;
    html.style.fontSize = '';
  },
  mounted() {
    this.setFontSize();
    window.onresize = () => {
      const that = this;
      that.setFontSize();
    };
  },
  methods: {
    setFontSize() {
      var html = document.documentElement;
      var hWidth = html.getBoundingClientRect().width;
      html.style.fontSize = hWidth / 19.2 + 'px';
    },
    getName(val) {
      this.valueSet = val;
    }
  }
};
</script>

<style lang="scss" s>
@import '@/views/data/data';
</style>

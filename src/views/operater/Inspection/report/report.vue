<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between">
        <div>
          <div class="tree-title page-title">
            <el-date-picker v-model="inspectDate" @change="handeDateChange" type="date" placeholder="选择日期">
            </el-date-picker>
            <el-select clearable v-model="ckType" @change="handelChangeType" class="choose" placeholder="请选择类型">
              <el-option :key="item.name" v-for="item in actionOb" :label="item.desc" :value="item.name"> </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loaded"
        infinite-scroll-distance="10"
        class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light"
      >
        <div class="list-wrapper-reprot" v-show="roleList.length > 0" ref="DataList">
          <div
            class="float-container play-item"
            :class="{ reportselected: index === currentIndex }"
            v-for="(item, index) in roleList"
            :key="index"
            @click="onSelect(index, item, $event)"
          >
            <div class="play-con">
              <div class="float-left" v-if="item.inspectType === 'AUTO'">
                <img src="../../../../assets/button/num-check.png" alt="" />
                <p>数字巡检</p>
              </div>
              <div class="float-left" v-else>
                <img src="../../../../assets/button/people-check.png" alt="" />
                <p>人工巡检</p>
              </div>
              <div class="float-center">
                <el-tooltip
                  v-if="item.reportName != null && item.reportName.length > 15"
                  class="show-dot"
                  effect="dark"
                  :content="item && item.reportName"
                  placement="top"
                >
                  <h4>{{ item.reportName || '——' }}</h4>
                </el-tooltip>
                <h4 v-else>{{ item.reportName || '——' }}</h4>
                <p class="ck-eq">
                  巡检设备<span>{{ item.deviceCount }}</span>
                </p>
                <p class="ck-time">
                  巡检时间<span>{{ item.startTime }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="list-no-data" v-show="roleList.length === 0">
          <span>暂无数据</span>
        </div>
        <div class="lazy-loader"></div>
      </div>
    </template>
    <template slot="content">
      <div class="page-title-wrapper a-toolbar-between">
        <div v-show="roleList.length" class="page-title">
          计划详情
          <!-- {{ roleList[currentIndex].name }} -->
        </div>
      </div>

      <div class="play-detail" v-show="roleList.length > 0">
        <div class="is-number-play" v-show="isNumber !== 'unumber'">
          <div class="number-name">
            <span class="play-name">{{ selectedNode.reportName || '——' }}</span>
            <span class="time-day">{{ selectedNode.inspectDate | dateFormat('YYYY-MM-DD') }}</span>
            <div class="time-end">
              完成时间 <span>{{ selectedNode.endTime || '——' }}</span>
            </div>
            <div class="time-beg">
              巡检时间 <span>{{ selectedNode.startTime || '——' }}</span>
            </div>
          </div>
          <div class="check-con">
            <div class="left-equ">
              <div class="equ-num">
                <div class="text">巡检设备数</div>
                <div class="log-num">{{ selectedNode.deviceTotalCount || '0' }}</div>
              </div>
              <div class="pro-equ">
                <div class="text">故障设备数</div>
                <div class="log-num">{{ selectedNode.faultCount || '0' }}</div>
              </div>
            </div>
            <div class="pro-gress">
              <div class="lit-pro" :style="{ width: percent + '%' }">
                <span><img src="../../../../assets/icon/report.png" alt=""/></span>
              </div>
              <div class="count-per">
                {{ selectedNode.faultCount || '0' }}/{{ selectedNode.deviceTotalCount || '0' }}
              </div>
            </div>
          </div>
          <div class="equip-list" v-show="selectedNode">
            <p><span>载体名称</span><span>设备名称</span><span>上报时间</span><span>状态</span></p>
            <ul>
              <li v-for="(item, index) in selectedNode.inspectReportDeviceList" :key="index">
                <el-tooltip
                  v-if="item.deviceCategoryName.length > 15"
                  class="show-dot"
                  effect="dark"
                  :content="item && item.deviceCategoryName"
                  placement="top"
                >
                  <span class="show-dot">{{ item.deviceCategoryName || '————' }}</span>
                </el-tooltip>
                <span v-else>{{ item.deviceCategoryName || '————' }}</span>
                <el-tooltip
                  v-if="item.deviceTypeName.length > 15"
                  class="show-dot"
                  effect="dark"
                  :content="item && item.deviceTypeName"
                  placement="top"
                >
                  <span>{{ item.deviceTypeName || '————' }}</span>
                </el-tooltip>
                <span v-else>{{ item.deviceTypeName || '————' }}</span>
                <span>{{ item.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
                <span>
                  {{ item.deviceStatus ? (item.deviceStatus === '0' ? '正常' : '故障') : '—' }}/
                  {{ item.onlineStatus ? (item.onlineStatus === '0' ? '在线' : '离线') : '—' }}/
                  {{ item.onOffStatus ? (item.onOffStatus === '0' ? '开' : '关') : '—' }}/
                  {{ item.maintainStatus ? (item.maintainStatus === '0' ? '维护中' : '维修中') : '—' }}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div v-show="isNumber === 'unumber'" class="map-equipment" id="aMap"></div>
        <div v-show="isNumber === 'unumber'" class="pleToast">
          <div class="tapChange" @click="boxshow = !boxshow">
            <img src="../../../../assets/radio/beifen.png" />
            人员轨迹筛选
          </div>
          <transition name="draw">
            <div class="box-list scrollbar scrollbar-y scrollbar-light" v-show="boxshow && allAvatarList.length > 0">
              <ul class="relFacilityTitcon">
                <li
                  v-for="(item, index) in allAvatarList"
                  :key="index"
                  :class="{ currentAdd: spanIndex.indexOf(item.staffId) > -1 }"
                >
                  <span @click="changeSpan(item)" class="ckbox"></span>
                  <span>
                    <img :src="item.photoUrl" />
                  </span>
                  <span>
                    {{ item.staffName }}
                    <span :style="{ backgroundColor: item.color }"></span>
                  </span>
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <div class="model-tool" v-show="isNumber === 'unumber'">
          <div class="item-detail">
            <div class="top-i-recove">
              <ul>
                <li>
                  <span>
                    {{ selectedNode.reportName || '——' }}
                  </span>
                  <a></a>
                </li>
                <li>
                  <span>执行人员</span>
                  <p>
                    <a v-for="(ple, idx) in inspectStaff" :key="idx">{{ ple.staffName }}</a>
                  </p>
                </li>
              </ul>
              <div class="percent">
                {{ coverCent }}%
                <a>巡检覆盖率</a>
              </div>
            </div>
            <p class="base-note">
              <span>
                巡检时间
                <a> {{ selectedNode.startTime || '——' }}</a>
              </span>
              <span>
                巡检结束时间
                <a>{{ selectedNode.endTime || '——' }}</a>
              </span>
            </p>
          </div>

          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
              <template slot="title">
                <span class="t-name">巡检备注</span>
                <span class="rightC">
                  点击收起
                  <span v-if="expend">
                    <img src="../../../../assets/select/select-bottom.png" alt="" />
                  </span>
                  <span v-else>
                    <img src="../../../../assets/select/select-top.png" alt="" />
                  </span>
                </span>
              </template>
              <div v-if="lenDes != '0'" class="img-list-swiper scrollbar scrollbar-y scrollbar-light">
                <div class="wait-flow">
                  <div class="flow-list box flow-path" v-for="(item, index) in flowData" :key="index">
                    <div class="flow-doot">
                      <i></i>
                    </div>

                    <div class="flow-info mb-40 ml-10">
                      <p class="info-time">
                        {{ item.operateTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
                        <span>操作人:{{ item.staffName || '---' }}</span>
                      </p>
                      <!-- <h3>{{ item.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</h3> -->
                      <p class="info-note mb-10">
                        {{ item.remark }}
                      </p>
                      <swiper
                        v-if="item.attachmentList.length > 0"
                        id="left-swiper"
                        class="swiper"
                        style="width: 400px; height: 72px"
                        :options="swiperOption"
                      >
                        <swiper-slide
                          ref="myswiper"
                          @click-slide="handleClickSlide"
                          v-for="(img, id) in item.attachmentList"
                          :key="id"
                        >
                          <img
                            :preview="index"
                            @click="swiperTo(img, id)"
                            v-if="img.attachmentType == 'IMAGE'"
                            :src="img.attachmentUrl"
                            style="width: 72px; height: 72px; display: inline-block"
                          />
                          <div
                            @click="swiperTo(img, id)"
                            class="output"
                            v-if="img.attachmentType == 'VIDEO'"
                            style="width: 72px; height: 72px; display: inline-block"
                          >
                            <video
                              class="video"
                              controls="controls"
                              style="width: 72px; height: 72px; display: inline-block"
                              v-show="false"
                            >
                              <source :src="img.attachmentUrl" type="video/mp4" />
                            </video>
                          </div>
                        </swiper-slide>
                        <div class="swiper-button-next nav-right" slot="button-next">
                          <span>
                            <img src="../../../../assets/button/btn-next.png" />
                          </span>
                        </div>
                      </swiper>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </template>
  </TreeContent>
</template>

<script>
import TreeContent from '@/components/layout/TreeContent.vue';
import { inspectReportPage, inspectReportDetail } from '@/api/order';
import { generateUrlParams } from '@/utils';
import moment from 'moment'; // 时间
let vm = null;
// 轨迹颜色
const colors = ['#FFCB00', '#FF4807', '#00DBC2', '#49EB87', '#4AD2F9', '#6257FF', '#0989FF', '#FF8E46', '#E836CC'];
export default {
  name: 'org',
  components: {
    // PrimaryButton,
    TreeContent
  },
  computed: {},
  data() {
    return {
      boxshow: true,
      coverCent: 0,
      flowData: [],
      inspectDate: '',
      activeNames: ['1'],
      selectedNode: {},
      curIndex: '',
      personList: [],
      mapRouadList: [],
      swiperOption: {
        slidesPerView: 5,
        slidesPerGroup: 5,
        loopFillGroupWithBlank: true,
        pagination: {
          clickable: true
        },
        on: {
          tap() {
            const { realIndex } = this;
            vm.handleClickSlide(realIndex);
          }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      attachmentList: [],
      map: null,
      boundLngLat: {},
      mass: null,
      allCheckboxClass: '',
      currentIndex: 0,
      searchName: '',
      ckType: '',
      actionType: 'views',
      roleList: [],
      formData: {
        name: '',
        desc: ''
      },
      rules: {
        // spaceName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        // name: [{ required: true, message: '请输入名称', trigger: 'change' }]
      },
      // 分页请求
      size: 0,
      total: 0,
      loaded: false,
      current: 1,
      list: [
        {
          check: false,
          label: '周一'
        },
        {
          check: true,
          label: '周二'
        },
        {
          check: false,
          label: '周三'
        },
        {
          check: true,
          label: '周四'
        },
        {
          check: false,
          label: '周五'
        },
        {
          check: true,
          label: '周六'
        },
        {
          check: false,
          label: '周日'
        }
      ],
      actionOb: [
        {
          desc: '人工巡检',
          name: 'MANUAL'
        },
        {
          desc: '数字巡检',
          name: 'AUTO'
        }
      ],
      isNumber: 'number',
      expend: true,
      percent: '',
      inspectStaff: [],
      lenDes: null,
      deviceList: [],
      avatarStarff: [],
      allAvatarList: [],
      hasCheckDevice: [],
      spanIndex: [],
      staffTrackMap: []
    };
  },
  watch: {
    actionType() {},
    curIndex(newval, oldval) {
      if (newval) {
        this.getCurrentAvatar(newval);
      }
    }
  },
  created() {
    vm = this;
  },
  methods: {
    changeSpan(item) {
      var arrIndex = this.spanIndex.indexOf(item.staffId);
      if (arrIndex > -1) {
        this.spanIndex.splice(arrIndex, 1);
        // colors.splice(arrIndex, 1);
        this.mapRouadList = this.mapRouadList.filter(val => val.staffId != item.staffId);
        var avaStarffList = this.avatarStarff; // 人物巡检过的设备集合
        var eachPeopleId = [];
        var newIdDevice = [];
        for (var key in avaStarffList) {
          if (key === item.staffId) {
            eachPeopleId.push(avaStarffList[key]);
          }
          for (let i = 0; i < eachPeopleId.length; i++) {
            for (let j = 0; j < avaStarffList[key].length; j++) {
              if (eachPeopleId[i][j].responseStaffId === key) {
                newIdDevice.push({
                  deviceCode: eachPeopleId[i][j].deviceCode,
                  responseStaffId: eachPeopleId[i][j].responseStaffId,
                  responseStaffName: eachPeopleId[i][j].responseStaffName
                });
              }
            }
          }
        }
        // for (let kk = 0; kk < this.mapRouadList.length; kk++) {
        //   const kkIndex = this.mapRouadList[kk];
        //   kkIndex.color = colors[kk];
        // }
        var set = newIdDevice.map(value => value.responseStaffId);
        this.hasCheckDevice = this.hasCheckDevice.filter(val => !set.includes(val.responseStaffId));
        this.drawMap();
        this.drawPoints();
        this.getCurrentAvatar();
      } else {
        this.spanIndex.push(item.staffId);
        var roadListMap = this.staffTrackMap;
        var roadPath = [];
        var newPath = [];
        for (var key in roadListMap) {
          if (key === item.staffId) {
            roadPath.push(roadListMap[key]);
            newPath.push([]);
          }
          for (let i = 0; i < roadPath.length; i++) {
            for (let j = 0; j < roadListMap[key].length; j++) {
              if (roadPath[i][j].responseStaffId === key) {
                newPath[i].push([roadPath[i][j].longitude, roadPath[i][j].latitude]);
              }
              // newPath[i] = [roadListMap[key][j].longitude, roadListMap[key][j].latitude];
              this.mapRouadList.push({
                name: roadPath[i][j].responseStaffName + '的巡检路线',
                path: newPath[i],
                staffId: roadPath[i][j].responseStaffId,
                color: item.color
              });
            }
          }
        }
        // for (let kk = 0; kk < this.mapRouadList.length; kk++) {
        //   const kkIndex = this.mapRouadList[kk];
        //   kkIndex.color = colors[kk];
        // }
        var avaStarffList = this.avatarStarff; // 人物巡检过的设备集合
        var eachPeopleId = [];
        var newIdDevice = [];
        for (var key in avaStarffList) {
          if (avaStarffList[key].length > 0) {
            eachPeopleId.push(avaStarffList[key]);
          }
          for (let i = 0; i < eachPeopleId.length; i++) {
            for (let j = 0; j < avaStarffList[key].length; j++) {
              if (eachPeopleId[i][j].responseStaffId === key) {
                newIdDevice.push({
                  deviceCode: eachPeopleId[i][j].deviceCode,
                  responseStaffId: eachPeopleId[i][j].responseStaffId,
                  responseStaffName: eachPeopleId[i][j].responseStaffName
                });
              }
            }
          }
        }
        // const setArr = newIdDevice.map(value => value.responseStaffId);
        this.hasCheckDevice = this.hasCheckDevice.concat(newIdDevice);
        this.drawMap();
        this.drawPoints();
        this.getCurrentAvatar();
      }
      const obj = {};
      this.mapRouadList = this.mapRouadList.reduce((cur, next) => {
        obj[next.staffId] ? '' : (obj[next.staffId] = true && cur.push(next));
        return cur;
      }, []);
    },
    swiperTo(item, index) {
      this.hideImg = true;
      // this.mySwiper.slideTo(index - 1, 1000, false);
    },
    weekChecked(idx) {
      var check = this.list[idx].check;
      this.list[idx].check = check !== true;
    },
    handelChangeType(val) {
      this.ckType = val;
      this.size = 0;
      this.loadMore();
    },
    handeDateChange(val) {
      this.size = 0;
      this.inspectDate = val;
      this.loadMore();
    },
    handleChange(val) {
      if (val.length === 0) {
        this.expend = false;
      } else {
        this.expend = true;
      }
    },
    async loadMore() {
      if (this.total < this.size) return;
      this.loaded = true;
      this.size += 50;
      this.$$ALoading.show();
      const params = {
        size: this.size
      };
      const data = {};
      if (this.inspectDate) data.inspectDate = moment(this.inspectDate).format('YYYY-MM-DD');
      //  this.ckType
      if (this.ckType) data.inspectType = this.ckType;
      const query = generateUrlParams('', params);
      const res = await inspectReportPage(query, data);
      const { code, object } = res;
      if (code === 200 && this.$$util.isObject(object)) {
        const { records, total } = object;
        if (Array.isArray(records)) {
          this.loaded = false;
          this.size = object.size;
          this.total = total;
          this.roleList = records;
        }
      }
      this.$$ALoading.close();
      this.onSelect(this.currentIndex, this.roleList[this.currentIndex]);
    },

    onSelect(index, item, event) {
      this.currentIndex = index;
      const ordRes = inspectReportDetail(item.id);
      return Promise.all([ordRes]).then(res => {
        const respon = res[0];
        const { code, object } = respon;
        if (code === 200 && object) {
          this.selectedNode = object;
          var cent = (object.deviceTotalCount / object.faultCount) * 100;
          if (cent) {
            this.percent = cent;
          } else {
            this.percent = 0;
          }
          // 人工巡检
          if (this.selectedNode.inspectType === 'MANUAL') {
            this.flowData = object.inspectReportRemarkList;
            this.coverCent = object.inspectCoverRate * 100;
            if (object.inspectReportRemarkList) {
              this.lenDes = object.inspectReportRemarkList.length;
            } else {
              this.lenDes = 0;
            }
            var plen = [];
            var roadList = [];
            for (const i in object.inspectReportTrackMap) {
              plen.push(i);
              roadList.push(object.inspectReportTrackMap[i]);
            }
            var people = object.inspectReportStaffList;
            if (people) {
              this.inspectStaff = people.filter(item => item.longitude);
              this.allAvatarList = people.filter(item => item);
              this.spanIndex = people.filter(val => val.staffId).map(val => val.staffId);
              for (let index = 0; index < this.allAvatarList.length; index++) {
                const iiNdex = this.allAvatarList[index];
                // iiNdex.color = colors[index];
                iiNdex.color = colors[index % colors.length];
              }
            } else {
              this.inspectStaff = [];
              this.allAvatarList = [];
            }
            console.log(this.spanIndex);
            var deviceStarff = object.inspectReportDeviceStaffMap;
            if (deviceStarff) {
              this.avatarStarff = deviceStarff;
            } else {
              this.avatarStarff = [];
            }
            var device = object.inspectReportDeviceList;
            if (device) {
              this.deviceList = device;
            } else {
              this.deviceList = [];
            }
            var roadListMap = object.staffTrackMap;
            var roadPath = [];
            var newPath = [];
            this.staffTrackMap = object.staffTrackMap;
            for (var key in roadListMap) {
              if (roadListMap[key].length > 0) {
                roadPath.push(roadListMap[key]);
                newPath.push([]);
              }
              for (let i = 0; i < roadPath.length; i++) {
                for (let j = 0; j < roadListMap[key].length; j++) {
                  if (roadPath[i][j].responseStaffId === key) {
                    newPath[i].push([roadPath[i][j].longitude, roadPath[i][j].latitude]);
                  }
                  // newPath[i] = [roadListMap[key][j].longitude, roadListMap[key][j].latitude];
                  this.mapRouadList.push({
                    name: roadPath[i][j].responseStaffName + '的巡检路线',
                    path: newPath[i],
                    staffId: roadPath[i][j].responseStaffId
                  });
                }
              }
            }
            const obj = {};
            this.mapRouadList = this.mapRouadList.reduce((cur, next) => {
              obj[next.staffId] ? '' : (obj[next.staffId] = true && cur.push(next));
              return cur;
            }, []);
            for (let kk = 0; kk < this.mapRouadList.length; kk++) {
              const kkIndex = this.mapRouadList[kk];
              kkIndex.color = colors[kk];
            }
            var avaStarffList = this.avatarStarff; // 人物巡检过的设备集合
            var eachPeopleId = [];
            var newIdDevice = [];
            for (var key in avaStarffList) {
              if (avaStarffList[key].length > 0) {
                eachPeopleId.push(avaStarffList[key]);
              }
              for (let i = 0; i < eachPeopleId.length; i++) {
                for (let j = 0; j < avaStarffList[key].length; j++) {
                  if (eachPeopleId[i][j].responseStaffId === key) {
                    newIdDevice.push({
                      deviceCode: eachPeopleId[i][j].deviceCode,
                      responseStaffId: eachPeopleId[i][j].responseStaffId,
                      responseStaffName: eachPeopleId[i][j].responseStaffName
                    });
                  }
                }
              }
            }
            this.hasCheckDevice = newIdDevice; // 得到人员巡检相对于的设备 集合
          }

          this.isNumber = this.selectedNode.inspectType === 'MANUAL' ? 'unumber' : 'number';
          // if (this.isNumber === 'unumber') this.drawPoints();
          if (this.isNumber === 'unumber') {
            this.drawPoints();
            this.getCurrentAvatar();
          }

          // this.drawMap(object);
        }
      });
      // this.selectedNode = item;
    },
    getDeviceIcon(item) {
      var src;
      // 展示优先级。离线-故障-维护/维修中-正常
      // {{ item.deviceStatus ? (item.deviceStatus === '0' ? '正常' : '故障') : '—' }}/
      // {{ item.onlineStatus ? (item.onlineStatus === '0' ? '在线' : '离线') : '—' }}/
      // {{ item.onOffStatus ? (item.onOffStatus === '0' ? '开' : '关') : '—' }}/
      // {{ item.maintainStatus ? (item.maintainStatus === '0' ? '维护中' : '维修中') : '—' }}
      const deviceCode = this.hasCheckDevice.filter(val => val.deviceCode === item.deviceCode); // 设备编码一致的集合
      console.log(deviceCode);
      // 同一设备 已经巡检的人员集合
      const avater = this.allAvatarList.filter(val => {
        const idList = deviceCode.map(v => v.responseStaffId);
        return idList.includes(val.staffId);
      });
      if (item.inspectStatus === 'INSPECTED') {
        if (avater.length) {
          var photo = avater.map(val => val);
          if (photo.length > 0 && photo) {
            src = photo;
          } else {
            src = require(`../../../../assets/defaults.png`);
          }
        }
      } else {
        if (item.deviceCategoryIdentify === 'LAMP') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/lamp-work.png`);
            } else {
              src = require(`../../../../assets/equip/lamp-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/lamp-warn.png`);
              } else {
                src = require(`../../../../assets/equip/lamp-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/lamp-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'CAMERA') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/camera-work.png`);
            } else {
              src = require(`../../../../assets/equip/camera-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/camera-warn.png`);
              } else {
                src = require(`../../../../assets/equip/camera-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/camera-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'AD_SCREEN') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/led-work.png`);
            } else {
              src = require(`../../../../assets/equip/led-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/led-warn.png`);
              } else {
                src = require(`../../../../assets/equip/led-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/led-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'BROADCAST') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/report-work.png`);
            } else {
              src = require(`../../../../assets/equip/report-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/report-warn.png`);
              } else {
                src = require(`../../../../assets/equip/report-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/report-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'CAMERA_POINT') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/monitoring-work.png`);
            } else {
              src = require(`../../../../assets/equip/monitoring-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/monitoring-warn.png`);
              } else {
                src = require(`../../../../assets/equip/monitoring-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/monitoring-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'DEVICE_BOX') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/synthesis-work.png`);
            } else {
              src = require(`../../../../assets/equip/synthesis-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/synthesis-warn.png`);
              } else {
                src = require(`../../../../assets/equip/synthesis-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/synthesis-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'DEVICE_BOX_PUBLIC_SECURITY') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/equipment-box-work.png`);
            } else {
              src = require(`../../../../assets/equip/equipment-box-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/equipment-box-warn.png`);
              } else {
                src = require(`../../../../assets/equip/equipment-box-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/equipment-box-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'DEVICE_BOX_PUBLIC_SECURITY') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/equipment-box-work.png`);
            } else {
              src = require(`../../../../assets/equip/equipment-box-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/equipment-box-warn.png`);
              } else {
                src = require(`../../../../assets/equip/equipment-box-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/equipment-box-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'ELECTRICITY_METER') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/ammeter-work.png`);
            } else {
              src = require(`../../../../assets/equip/ammeter-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/ammeter-warn.png`);
              } else {
                src = require(`../../../../assets/equip/ammeter-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/ammeter-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'IPC') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/zs-work.png`);
            } else {
              src = require(`../../../../assets/equip/zs-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/zs-warn.png`);
              } else {
                src = require(`../../../../assets/equip/zs-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/zs-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'LAMP_POLE') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/glamp-work.png`);
            } else {
              src = require(`../../../../assets/equip/glamp-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/glamp-warn.png`);
              } else {
                src = require(`../../../../assets/equip/glamp-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/glamp-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'PRESS_TO_ALARM') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/alert-work.png`);
            } else {
              src = require(`../../../../assets/equip/alert-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/alert-warn.png`);
              } else {
                src = require(`../../../../assets/equip/alert-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/alert-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'SINGLE_LAMP_CONTROLLER') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/slamp-work.png`);
            } else {
              src = require(`../../../../assets/equip/slamp-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/slamp-warn.png`);
              } else {
                src = require(`../../../../assets/equip/slamp-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/slamp-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'SMART_COVER') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/lid-work.png`);
            } else {
              src = require(`../../../../assets/equip/lid-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/lid-warn.png`);
              } else {
                src = require(`../../../../assets/equip/lid-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/lid-unline.png`);
          }
        } else if (item.deviceCategoryIdentify === 'SMOKE_DETECTOR') {
          if (item.onlineStatus === '0') {
            if (item.deviceStatus === '0') {
              src = require(`../../../../assets/equip/smoke-work.png`);
            } else {
              src = require(`../../../../assets/equip/smoke-error.png`);
              if (item.maintainStatus === '0') {
                src = require(`../../../../assets/equip/smoke-warn.png`);
              } else {
                src = require(`../../../../assets/equip/smoke-warn.png`);
              }
            }
          } else {
            src = require(`../../../../assets/equip/smoke-unline.png`);
          }
        }
      }
      return src;
    },
    getCurrentAvatar(val) {
      const lineArr = [];
      this.inspectStaff.forEach((item, index) => {
        // let marker = null;
        // let src = require(`${item.url}`);
        lineArr.push({
          name: '',
          lnglat: [item.longitude, item.latitude]
        });

        //  let src = require('../../../assets/basic/person1-1.jpg');
        // var src = '';
        // if (item.photoUrl) {
        //   src = item.photoUrl;
        // } else {
        //   src = require(`../../../../assets/defaults.png`);
        // }
        // marker = new AMap.Marker({
        //   position: new AMap.LngLat(item.longitude, item.latitude),
        //   // 将 html 传给 content
        //   content: `<div class="person-box status current${val}">
        //                       <div class="img-box">
        //                           <img src="${src}" />
        //                       </div>
        //                       <div class="person-direction" style="transform:rotate(180deg)"></div>
        //                   </div>`,
        //   // 以 icon 的 [center bottom] 为原点
        //   size: new AMap.Size(52, 52),
        //   offset: new AMap.Pixel(-24, -60)
        // });
        // 绘制轨迹
        this.map.setFitView();
        // 将 markers 添加到地图
        // this.map.add(marker);
        // AMap.event.addListener(marker, 'click', function (e) {
        //   console.log(index);
        // });
      });
      this.deviceList.forEach((item, index) => {
        let marker = null;
        // let src = require(`${item.url}`);
        lineArr.push({
          name: '',
          lnglat: [item.longitude, item.latitude]
        });
        const src = this.getDeviceIcon(item);
        console.log(src);
        if (src && src.length > 0) {
          var img = '';
          for (let n = 0; n < src.length; n++) {
            img += `<div class="person-box status">
              
              <div class="img-box">
                <img src="${src[n].photoUrl}" />
              </div>
              <div class="person-direction" style="transform:rotate(180deg)"></div>
            </div>`;
          }
        }
        const isDevic =
          item.inspectStatus === 'INSPECTED' && src
            ? `${img}`
            : `<div class="device-box status">
                              <div class="img-box">
                                  <img src="${src}" />
                              </div>
                              <div class="person-direction" style="transform:rotate(180deg)"></div>
                          </div>`;
        marker = new AMap.Marker({
          position: new AMap.LngLat(item.longitude, item.latitude),
          // 将 html 传给 content
          content: isDevic,
          // 以 icon 的 [center bottom] 为原点
          size: new AMap.Size(52, 52),
          offset: new AMap.Pixel(-24, -60)
        });
        // 绘制轨迹
        this.map.setFitView();
        // 将 markers 添加到地图
        this.map.add(marker);
        AMap.event.addListener(marker, 'click', function(e) {
          // console.log(index);
        });
      });
      // console.log(this.inspectStaff);
      // console.log(this.deviceList);
    },
    /** 获取人物头像位置 地图绘制 */
    drawMap() {
      this.map = new AMap.Map('aMap', {
        center: this.projectPoint,
        resizeEnable: true,
        zoom: 12,
        expandZoomRange: true,
        zooms: [12, 20],
        mapStyle: 'amap://styles/whitesmoke'
      });
    },
    drawPoints() {
      const that = this;
      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！');
          return;
        }

        var pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          // autoSetFitView:false,
          map: that.map, // 所属的地图实例

          getPath(pathData, pathIndex) {
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            if (pointIndex >= 0) {
              // point
              return pathData.name;
            }

            return pathData.name;
          },
          renderOptions: {
            pathLineStyle: {
              dirArrowStyle: true
            },
            startPointStyle: {
              radius: 0,
              fillStyle: '',
              lineWidth: 1,
              strokeStyle: ''
            },
            endPointStyle: {
              radius: 0,
              fillStyle: '',
              lineWidth: 1,
              strokeStyle: ''
            },
            getPathStyle: function(pathItem, zoom) {
              // debugger
              // var color = colors[pathItem.pathIndex];
              // var color = colors[pathItem.pathIndex % colors.length];
              // var lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));
              var color = pathItem.pathData.color;
              return {
                pathLineStyle: {
                  strokeStyle: color,
                  lineWidth: 3
                },
                pathLineSelectedStyle: {
                  lineWidth: 3
                },
                pathNavigatorStyle: {
                  fillStyle: color
                }
              };
            }
          }
        });
        window.pathSimplifierIns = pathSimplifierIns;

        that.getCurrentAvatar();
        pathSimplifierIns.setData(that.mapRouadList);
      });
    },
    // 定位项目地址
    toLocation() {
      this.map.setCenter(this.projectPoint);
      this.map.setZoom(16);
    },

    // 放大
    zoomIn() {
      this.map.zoomIn();
    },

    // 缩小
    zoomOut() {
      this.map.zoomOut();
    }
  },
  mounted() {
    this.drawMap();
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.list-no-data {
  text-align: center;
  position: relative;
  height: 100%;
  span {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    font-size: 16px;
    color: #778196;
    width: 100px;
    height: 24px;
  }
}
.list-wrapper-reprot {
  .play-item {
    padding: 20px 30px;

    .play-con {
      height: 130px;
      background: #ffffff;
      box-shadow: 0px 2px 6px 0px rgba(16, 25, 74, 0.12);
      border-radius: 4px;
      border: 1px solid #d2daea;

      .float-center {
        float: left;
        margin-top: 20px;
        margin-left: 30px;

        h4 {
          font-size: 16px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 500;
          color: #0f1736;
          width: 260px;
        }

        p {
          font-size: 14px;
          font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
          font-weight: 400;
          color: #c6cada;
          margin-top: 12px;
        }

        .ck-eq {
          span {
            margin-left: 16px;
            font-size: 24px;
            font-family: DINCond-Black, DINCond;
            font-weight: 900;
            color: #3045b1;
          }
        }

        .ck-time {
          span {
            margin-left: 16px;
            font-size: 14px;
            font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
            font-weight: 400;
            color: #3045b1;
          }
        }
      }

      .float-left {
        margin-top: 20px;
        margin-left: 30px;

        img {
          width: 42px;
          height: 39px;
          display: inline-block;
          margin-left: 19px;
        }

        p {
          width: 80px;
          text-align: center;
          height: 24px;
          background: #f6f8fc;
          border-radius: 12px;
          margin-top: 18px;
          font-size: 12px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 600;
          color: #3045b1;
          line-height: 24px;
        }
      }

      .float-right {
        margin-top: 20px;

        .op-icon {
          margin-top: 30px;
        }
      }
    }
  }

  .reportselected {
    background-color: #fff !important;
    position: relative;

    &::after {
      content: '';
      height: 66px;
      width: 4px;
      background: #3045b1;
      position: absolute;
      right: 30px;
      top: 50px;
    }

    &::before {
      content: '';
      height: 66px;
      width: 4px;
      background: #3045b1;
      position: absolute;
      left: 30px;
      top: 50px;
    }
  }
}
.box {
  display: flex;
}
.play-detail {
  padding: 0 30px;
  position: relative;
  .map-equipment {
    height: 700px;
  }

  .plat-t-n {
    padding: 10px 30px;
    display: flex;

    li {
      flex: 1;
      background: #f6f8fc;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 20px;
        width: 1px;
        height: 50px;
        background: #d2daea;
      }

      p {
        font-size: 16px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #3045b1;
        display: table;
        margin: 0 auto;
        text-align: left;
        padding: 25px 0;

        span {
          font-size: 14px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 500;
          color: #747aa5;
          display: table;
          margin-bottom: 8px;
        }
      }
    }

    li:last-child {
      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 15px;
        width: 0;
        height: 50px;
        background: #d2daea;
      }
    }
  }
  .is-number-play {
    height: 246px;
    background: #f6f8fc;
    border-radius: 4px;
    .number-name {
      padding: 30px;
      .play-name {
        font-size: 16px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #0f1736;
        line-height: 24px;
      }
      .time-day {
        margin-left: 30px;
        font-size: 12px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #747aa5;
        line-height: 18px;
      }
      .time-beg {
        float: right;
        margin-right: 20px;
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #c6cada;
        span {
          margin-left: 20px;
          font-size: 14px;
          font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
          font-weight: 400;
          color: #3045b1;
        }
      }
      .time-end {
        float: right;
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #c6cada;
        span {
          margin-left: 20px;
          font-size: 14px;
          font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
          font-weight: 400;
          color: #3045b1;
        }
      }
    }
    .check-con {
      display: flex;
      padding: 0 30px;
      .left-equ {
        width: 200px;
        .equ-num {
          .text {
            font-size: 14px;
            font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
            font-weight: 500;
            color: #747aa5;
          }
          .log-num {
            font-size: 36px;
            font-family: DINCond-Black, DINCond;
            font-weight: 900;
            color: #00dcc3;
            margin: 6px 0;
          }
        }
        .pro-equ {
          margin-top: 12px;
          .text {
            font-size: 14px;
            font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
            font-weight: 500;
            color: #747aa5;
          }
          .log-num {
            font-size: 36px;
            font-family: DINCond-Black, DINCond;
            font-weight: 900;
            color: #ff4807;
            margin: 6px 0;
          }
        }
      }
      .pro-gress {
        flex: 1;
        height: 20px;
        background: #d2daea;
        border-radius: 30px;
        margin-top: 50px;
        position: relative;
        .lit-pro {
          height: 20px;
          background: linear-gradient(117deg, #70a9ff 0%, #3045b1 100%);
          border-radius: 30px;
          position: relative;
          span {
            position: absolute;
            right: -20px;
            top: -45px;
            img {
              width: 37px;
              height: 32px;
              display: inline-block;
            }
          }
        }
        .count-per {
          width: 80px;
          position: absolute;
          right: 0px;
          top: 40px;
          font-size: 18px;
          font-family: DINCond-Black, DINCond;
          font-weight: 900;
          color: #3045b1;
        }
      }
    }
    .equip-list {
      margin-top: 80px;
      p {
        span {
          width: 200px;
          display: inline-block;
          text-align: left;
          font-size: 14px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 500;
          color: #747aa5;
        }
        span:first-child {
          margin-left: 260px;
        }
      }
      ul {
        padding-bottom: 80px;
        li {
          margin-top: 40px;
          span {
            width: 200px;
            display: inline-block;
            text-align: left;
            font-size: 14px;
            font-family: 'SourceHanSansCN-Normal, SourceHanSansCN';
            font-weight: 400;
            color: #0f1736;
            img {
              width: 16px;
              height: 16px;
              display: inline-block;
              margin-left: 10px;
            }
          }
          span:first-child {
            margin-left: 260px;
          }
        }
      }
    }
  }
  .model-tool {
    position: absolute;
    top: 15px;
    z-index: 9;
    left: 60px;
    width: 520px;
    .el-collapse-item__header {
      position: relative;
      .el-collapse-item__arrow {
        display: none;
      }
      .t-name {
        padding-left: 30px;
        font-size: 14px;
        font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
        font-weight: 500;
        color: #0f1736;
      }
      .rightC {
        position: absolute;
        right: 25px;

        font-size: 16px;
        font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
        font-weight: 400;
        color: #3045b1;
        span {
          img {
            width: 24px;
            height: 24px;
            display: inline-block;
            float: right;
            margin-top: 10px;
            margin-left: 8px;
          }
        }
      }
    }
    .el-collapse-item__content {
      .img-list-swiper {
        padding: 20px 30px;
        height: 280px;
        .wait-flow {
          .flow-path {
            &::after {
              content: '';
              width: 2px;
              height: calc(100% - 10px);
              border-right: 2px dashed rgba(180, 185, 207, 0.4);
              position: absolute;
              left: 5px;
              top: 16px;
            }
          }

          .flow-list {
            position: relative;
            .flow-doot {
              i {
                width: 10px;
                height: 10px;
                border: 3px solid #3045b1;
                border-radius: 10px;
                margin-top: 2px;
                display: inline-block;
                &.null-step {
                  border-color: #ccc;
                }

                &.end-step {
                  border-color: #009cf2;
                }
              }
            }

            .flow-info {
              background: #f6f8fc;
              border-radius: 4px;
              padding: 20px;
              flex: 1;
              .outBox {
                width: 800px;
                height: 100px;
                overflow: hidden;
                position: relative;

                .demo-image__preview {
                  position: relative;
                }
              }
              .nav-right {
                position: absolute;
                right: 0px;
                top: 22px;
                width: 42px;
                height: 72px;
                background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);
                span {
                  width: 20px;
                  height: 72px;
                  background: #ffffff;
                  box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
                  border-radius: 4px;
                  margin-left: 20px;
                  display: inline-block;
                  img {
                    margin-top: 27px;
                    margin-left: 3px;
                  }
                }
              }
              .nav-left {
                position: absolute;
                left: 0px;
                top: 0;
                z-index: 88;
                width: 42px;
                height: 72px;
                background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);
                span {
                  width: 20px;
                  height: 72px;
                  background: #ffffff;
                  box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
                  border-radius: 4px; // margin-left: 20px;
                  display: inline-block;
                  img {
                    margin-top: 27px;
                    margin-left: 3px;
                  }
                }
              }
              p {
                font-size: 14px;
                line-height: 14px;

                span {
                  float: right;
                  font-size: 14px;
                  font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
                  font-weight: 500;
                  color: #aeb4c6;
                }

                .operation-null {
                  color: #999999;
                }

                .operation {
                  color: #3045b1;
                }

                .operation-defeated {
                  color: #eb4132;
                }
              }

              .info-time {
                font-size: 14px;
                font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
                font-weight: 500;
                color: #aeb4c6;
                padding-bottom: 20px;
              }
              h3 {
                font-size: 14px;
                font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
                font-weight: 600;
                color: #0f1736;
                padding-bottom: 10px;
              }
              .info-note,
              .info-reason,
              .info-result {
                font-size: 12px;
                font-family: 'SourceHanSansCN-Normal, SourceHanSansCN';
                font-weight: 400;
                color: #0f1736;
                padding-bottom: 10px;
              }
              .info-status {
                color: #009cf2;
              }
            }
          }
        }
        .nav-right {
          position: absolute;
          right: 0px;
          top: 22px;
          width: 42px;
          height: 72px;
          background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);
          span {
            width: 20px;
            height: 72px;
            // background: #ffffff;
            box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
            border-radius: 4px;
            margin-left: 20px;
            display: inline-block;
            img {
              margin-top: 27px;
              margin-left: 3px;
            }
          }
        }
      }
    }
    .item-detail {
      background: url('../../../../assets/order/bg-one.png') no-repeat center center;
      box-shadow: 0px 10px 20px -4px rgba(16, 25, 74, 0.18);
      border-radius: 4px;
      background-size: 555px;
      position: relative;
      .top-i-recove {
        display: flex;
        ul {
          flex: 1;
          padding: 10px 30px;
          li {
            font-size: 14px;
            font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
            font-weight: 500;
            color: #fff;
            margin-top: 10px;
            span {
              color: #fff;
              margin-right: 30px;
              font-size: 16px;
            }
            a {
              color: #fff;
            }
          }
          li:nth-of-type(2) {
            width: 270px;
            min-height: 170px;
            font-size: 14px;
            p {
              float: right;
              width: 180px;
              a {
                text-align: center;
                margin-top: 8px;
                color: #fff;
                padding: 0 5px;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            span {
              float: left;
              margin-right: 20px;
              margin-top: 8px;
              font-size: 14px;
            }
          }
        }
        .percent {
          height: 55px;
          text-align: center;
          font-size: 36px;
          font-family: DINCond-Black, DINCond;
          font-weight: 900;
          color: #fff;
          padding: 0 30px;
          margin-top: 21px;

          a {
            display: block;

            font-size: 14px;
            font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
            font-weight: 500;
            color: #fff;
            margin-top: 8px;
          }
        }
      }
      .base-note {
        padding: 10px 30px;
        display: flex;
        position: absolute;
        left: 0;
        top: 150px;
        span {
          font-size: 14px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 500;
          color: #c6cada;
          margin-right: 30px;
          display: inline-block;
          padding: 14px;
          background-color: #fff;
          border-radius: 4px;
          margin-left: 70px;
        }
        span:nth-of-type(2) {
          margin-left: 0;
        }
        a {
          flex: 1;
          font-size: 14px;
          font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
          font-weight: 400;
          color: #0f1736;
          margin-left: 8px;
        }
      }
    }
  }
  .pleToast {
    position: absolute;
    top: 15px;
    z-index: 9;
    right: 60px;
    cursor: pointer;
    .box-list {
      height: 280px;
      background: #fff;
      margin-top: 10px;
      border-radius: 8px;
      padding: 20px 10px;
      // width: 240px;
      .relFacilityTitcon {
        li {
          height: 50px;
          .ckbox {
            display: inline-block;
            width: 50px;
            height: 50px;
            background: url(../../../../assets/radio/radio-cur.png) no-repeat center center;
            background-size: 18px 18px;
            float: left;
          }
          span {
            display: inline-block;
            height: 50px;
            line-height: 50px;
            float: left;
          }
          span:nth-of-type(2) {
            bottom: 2px solid #fff;
            margin: 0 10px;
            img {
              width: 40px;
              height: 40px;
              display: inline-block;
              border-radius: 50%;
            }
          }
          span:nth-of-type(3) {
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: 10px;
            text-align: center;
            position: relative;
            line-height: 32px;
            span {
              width: 100px;
              height: 4px;
              position: absolute;
              left: 0;
              top: 37px;
              border-radius: 4px;
            }
          }
          &.currentAdd {
            .ckbox {
              display: inline-block;
              width: 50px;
              height: 50px;
              background: url(../../../../assets/radio/radio-ck.png) no-repeat center center;
              background-size: 18px 18px;
            }
          }
        }
      }
    }
    .tapChange {
      width: 165px;
      height: 40px;
      line-height: 40px;
      background: #fff;
      padding: 10px 20px;
      font-size: 20px;
      border-radius: 6px;
      margin-left: 40px;
      img {
        width: 24px;
        float: left;
        margin-top: 8px;
        margin-right: 10px;
      }
    }
  }
}
.swiper-button-next {
  &:after {
    content: '';
  }
}
#aMap {
  height: calc(100vh - 280px);
  margin: 0 auto;

  .amap-maps {
    .person-box {
      position: absolute;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      // border: 1px solid #009cf2;

      .img-box {
        // position: relative;
        // width: 100%;
        // height: 100%;
        // border-radius: 50%;
        // overflow: hidden;
        width: 45px;
        height: 45px;
        border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
        background-color: #f5f6f7;
        transform: rotate(135deg);
        img {
          position: relative;
          width: 100%;
          position: relative;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          transform: rotate(225deg);
          margin-left: 5px;
          margin-top: 5px;
        }
      }

      .person-direction {
        position: absolute;
        top: -1px;
        left: -1px;
        width: 45px;
        height: 45px;
        border-radius: 50%;

        &::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translate(-50%, 0);
          border: 0px solid transparent;
          border-width: 0 5px 8px 5px;
          border-bottom-color: #3045b1;
        }
      }

      &.status2 {
        border-color: #ff9500;

        & .person-direction {
          -webkit-transform: rotate(40deg);
          transform: rotate(40deg);

          &::before {
            border-bottom-color: #ff9500;
          }
        }
      }

      &.status3 {
        border-color: #00c853;

        .person-direction::before {
          border-bottom-color: #00c853;
        }
      }

      &.status4 {
        border-color: #1ec2d0;

        .person-direction::before {
          border-bottom-color: #1ec2d0;
        }
      }
    }
    .device-box {
      position: relative;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      // border: 1px solid #009cf2;

      .img-box {
        // position: relative;
        // width: 100%;
        // height: 100%;
        // border-radius: 50%;
        // overflow: hidden;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        // background-color: #f5f6f7;
        // transform: rotate(135deg);
        img {
          position: relative;
          width: 100%;
          position: relative;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          // transform: rotate(225deg);
          margin-left: 5px;
          margin-top: 5px;
        }
      }

      .person-direction {
        position: absolute;
        top: -1px;
        left: -1px;
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }

      &.status2 {
        border-color: #ff9500;

        & .person-direction {
          -webkit-transform: rotate(40deg);
          transform: rotate(40deg);

          &::before {
            border-bottom-color: #ff9500;
          }
        }
      }

      &.status3 {
        border-color: #00c853;

        .person-direction::before {
          border-bottom-color: #00c853;
        }
      }

      &.status4 {
        border-color: #1ec2d0;

        .person-direction::before {
          border-bottom-color: #1ec2d0;
        }
      }
    }

    .current {
      background-color: red;
    }
  }
}

.role-name {
  padding-left: 36px;
  height: 16px;
  font-size: 16px;
  font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
  font-weight: 500;
  color: $--color-dark;
  //line-height: 24px;
  background-repeat: no-repeat;
}

.role-text {
  max-width: 280px;
}

.tree-head {
  .tree-title {
    .search-container {
      width: 210px;

      .el-input-group__append {
        border-radius: 2px;
        cursor: pointer;
        background: url(../../../../assets/button/search.png) center no-repeat;
      }

      .el-icon-search {
        display: none;
      }

      .el-input__inner:focus {
        border: 1px solid $--color-pink;
      }

      .el-input__inner {
        border-right: none;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(68, 79, 132, 0.3);
        line-height: 22px;
        letter-spacing: 1px;
      }
    }

    .choose {
      float: right;
      width: 160px;
      margin-left: 10px;
    }
  }
}
</style>

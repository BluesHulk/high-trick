<template>
  <div class="order-view order-content-account order-content" v-if="typeInfo == 2">
    <div class="order-header" v-if="orderDetailData">
      <h1>工单详情</h1>
      <div class="btn-box" v-if="ordersort == 1">
        <!-- 0: {name: "UNALLOCATE", desc: "未派单"}
1: {name: "UNRESPONSE", desc: "未响应"}
2: {name: "RESPONDED", desc: "已响应"}
3: {name: "TRANSFERED", desc: "已转单"}
4: {name: "COMPLETED", desc: "已完成"}
5: {name: "FINISHED", desc: "已结束"} -->
        <template v-if="orderDetailData.orderStatus == 'UNALLOCATE'">
          <el-button type="primary" class="btnc text-center del" @click="delOrder"> 删除</el-button>

          <el-button type="primary" @click="endOrderCorfim" class="btnc text-center end">结束</el-button>

          <el-button type="primary" @click="sendOrder" class="btnc text-center send">派单</el-button>
          <el-button type="primary" @click="backList" class="btnc text-center back">返回</el-button>
        </template>
        <template v-else-if="orderDetailData.orderStatus == 'TRANSFERED'">
          <el-button type="primary" class="btnc text-center del" @click="delOrder"> 删除</el-button>

          <el-button type="primary" @click="endOrderCorfim" class="btnc text-center end">结束</el-button>

          <el-button type="primary" @click="sendOrder" class="btnc text-center send">派单</el-button>
          <el-button type="primary" @click="backList" class="btnc text-center back">返回</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="backList" class="btnc text-center back">返回</el-button>
        </template>
      </div>
      <div class="btn-box" v-if="ordersort == 2">
        <template v-if="orderDetailData.orderStatus == 'COMPLETED'">
          <el-button type="primary" @click="backList" class="btnc text-center back">返回</el-button>
        </template>
        <template v-if="orderDetailData.orderStatus == 'TRANSFERED'">
          <el-button type="primary" @click="backList" class="btnc text-center back">返回</el-button>
        </template>
        <template v-if="orderDetailData.orderStatus == 'RESPONDED'">
          <el-button type="primary" @click="backList" class="btnc text-center back">返回</el-button>
          <el-button type="primary" @click="revertOrder" class="btnc text-center revert">转单</el-button>
          <el-button type="primary" @click="dealOrder" class="btnc text-center deal">处理</el-button>
        </template>
      </div>
    </div>

    <div class="order-detail">
      <div class="order-right">
        <div class="order-code" v-if="orderDetailData">
          <ul>
            <li>
              <div>工单编号</div>
              <h5>{{ orderDetailData.orderCode }}</h5>
            </li>
            <li>
              <div>工单来源</div>
              <h5 v-if="orderDetailData.fault.faultSource == 'SYSTEM'">系统生成</h5>
              <h5 v-if="orderDetailData.fault.faultSource == 'INSPECTION'">巡检生成</h5>
              <h5 v-if="orderDetailData.fault.faultSource == 'OTHER'">其他</h5>
            </li>
            <li>
              <div>创建时间</div>
              <h5>{{ orderDetailData.createTime | dateFormat('YYYY-MM-DD') }}</h5>
            </li>
            <li>
              <div>完成时间</div>
              <h5 v-if="orderDetailData.finishTime">{{ orderDetailData.finishTime | dateFormat('YYYY-MM-DD') }}</h5>
              <h5 v-else>——</h5>
            </li>
            <li>
              <div>故障设备</div>
              <h5>{{ orderDetailData.fault.deviceName }}</h5>
            </li>
            <li>
              <div>故障类型</div>
              <h5>{{ orderDetailData.fault.faultTypeName }}</h5>
            </li>
            <li>
              <div>优先级</div>
              <h5 style="color: #0f1736" v-if="orderDetailData.priorityLevel == 'COMMON'">普通</h5>
              <h5 style="color: #ffad3c" v-if="orderDetailData.priorityLevel == 'URGENT'">紧急</h5>
              <h5 style="color: #ff4807" v-if="orderDetailData.priorityLevel == 'UNUSUALLY_URGENT'">特级</h5>
            </li>
            <li>
              <div>执行人</div>
              <h5 v-if="orderDetailData.repairStaffName">{{ orderDetailData.repairStaffName }}</h5>
              <h5 v-else>——</h5>
            </li>
          </ul>
        </div>

        <div class="order-log scrollbar scrollbar-y scrollbar-light">
          <h5>工单日志</h5>

          <div class="wait-flow mt-30">
            <!-- 工单日志 -->

            <div class="flow-list box flow-path" v-for="(item, index) in flowData" :key="index">
              <div class="flow-doot">
                <i></i>
              </div>

              <div class="flow-info mb-40 ml-10">
                <p class="info-time">
                  {{ item.operateTime | dateFormat('YYYY-MM-DD') }}
                  <span>操作人:{{ item.operateStaffName || '---' }}</span>
                </p>
                <h3>{{ item.operateTypeDesc }}</h3>
                <p class="info-note mb-10">
                  {{ item.operateContent }}
                </p>
                <swiper
                  v-if="item.attachmentList.length > 0"
                  id="left-swiper"
                  class="swiper"
                  style="width: 700px; height: 100px"
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
                      style="width: 100px; height: 100px; display: inline-block"
                    />
                    <div
                      @click="swiperTo(img, id)"
                      class="output"
                      v-if="img.attachmentType == 'VIDEO'"
                      style="width: 100px; height: 100px; display: inline-block"
                    >
                      <video
                        class="video"
                        controls="controls"
                        style="width: 100px; height: 100px; display: inline-block"
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
      </div>
      <div class="order-map">
        <div class="map-equipment" id="aMap"></div>
        <div class="hover-mes" id="map-img">
          <swiper
            v-if="mapFaultList.attachmentList"
            class="swiper swiper-map"
            style="width: 580px; height: 110px"
            :options="swiperOption2"
          >
            <swiper-slide
              ref="myswiper"
              @click-slide="handleClickSlide"
              v-for="(img, id) in mapFaultList.attachmentList"
              :key="id"
            >
              <div
                @click="swiperTo(img, id)"
                class="output"
                v-if="img.attachmentType != 'IMAGE'"
                style="width: 110px; height: 110px; display: inline-block"
              >
                <video
                  class="video"
                  controls="controls"
                  style="width: 110px; height: 110px; display: inline-block"
                  v-show="false"
                >
                  <source :src="img.attachmentUrl" type="video/mp4" />
                </video>
              </div>
              <img
                :preview="9588"
                @click="swiperTo(img, id)"
                v-if="img.attachmentType == 'IMAGE'"
                :src="img.attachmentUrl"
                style="width: 110px; height: 110px; display: inline-block"
              />
            </swiper-slide>
            <div class="swiper-button-next nav-right" slot="button-next">
              <span>
                <img src="../../../../assets/button/btn-next.png" />
              </span>
            </div>
          </swiper>
          <div class="errordes">
            <h5>故障描述</h5>
            <p>{{ mapFaultList.faultDesc }}</p>
          </div>
          <Equiplife :equipmentDetails="orderDetailData"></Equiplife>
        </div>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="titleMes"
      class="dialog-end-order"
      :visible.sync="endOrder"
      width="520px"
    >
      <div class="fixPre">
        <div class="demonstration">{{ tipInputLable }} <img src="../../../../assets/required.png" /></div>
        <el-input type="textarea" class="resizeNone" v-model="fixReason" maxlength="200"></el-input>
      </div>
      <Upload @getImgAudioList="getImgAudioList"></Upload>
      <span slot="footer" class="dialog-footer-upload">
        <el-button class="cancleDialog" @click="endOrder = false">取 消</el-button>
        <el-button class="confimDialog" type="primary" @click="endOrderMethod">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" class="dialog-sel-order" :visible.sync="peopleSel" width="520px">
      <template slot="title" class="fixPre">
        <div class="demonstration">
          <span>选择人员</span>
          <el-input
            clearable
            class="search-container"
            @clear="clearInput"
            @input="autoSearch"
            v-model="searchName"
            placeholder="请输入姓名"
          >
            <el-button slot="append" icon="el-icon-search" @click="userQueryPage">
              <div style="width: 100%; height: 100%"></div>
            </el-button>
          </el-input>
        </div>
      </template>
      <p class="label-p">
        <span class="indexcode">序号</span>
        <span class="name">姓名</span>
        <span class="ticketnumber">工单数</span>
        <span class="local">当前位置</span>
      </p>
      <div class="infinite-list-wrapper scrollbar scrollbar-y scrollbar-light">
        <ul class="list">
          <li
            @click="activeAdd(index, item.staffId)"
            v-for="(item, index) in gridData"
            :key="item.id"
            :class="[active == index ? 'active' : 'list-item']"
          >
            <span class="idx">{{ index + 1 }}</span>
            <span class="name">{{ item.name }}</span>
            <span class="orderCount">{{ item.orderCount }}</span>
            <span class="local">{{ item.staffId }}</span>
          </li>
        </ul>
        <InfiniteLoading :distance="distance" @infinite="onInfinite">
          <div slot="spinner">拼命加载中...</div>
          <div slot="no-more">已加载完毕!</div>
          <div slot="no-results">暂无数据:(</div>
        </InfiniteLoading>
      </div>
      <span slot="footer" class="dialog-footer-peo">
        <el-button class="cancleDialog" @click="peopleSel = false">取 消</el-button>
        <el-button class="confimDialog" type="primary" @click="orderAssignAdd">确 定</el-button>
      </span>
    </el-dialog>
    <DeleteModal
      :data="orderDetailData"
      :visible="visibleDel"
      @reset="resetDelModal"
      @submit="deleteSubmit"
    ></DeleteModal>
  </div>
</template>

<script>
import AMap from 'AMap';
import Equiplife from '@/components/equiplife/equiplife'; // 设备生命树
import DeleteModal from '@/components/modal/delMod.vue';
import Upload from '@/components/uploadImgAudio/upload';
import { mapGetters } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import { generateUrlParams } from '@/utils';
import {
  orderListDetail,
  uploadBatch,
  orderFinish,
  orderRespond,
  orderComplete,
  orderTransfer,
  orderDelete,
  detailOperationStaffList,
  orderAssign
} from '@/api/order';
let vm = null;

export default {
  name: 'opa-project',
  components: {
    // Maincontent,
    Equiplife,
    Upload,
    DeleteModal,
    InfiniteLoading
  },
  watch: {
    typeInfo() {
      if (this.typeInfo == 2) {
        this.fixReason = '';
        this.video();
        const orderId = this.$route.query.id;
        this.orderListDetail(orderId);
      }
    },
    WsMaintain(val, old) {
      console.log(val, old);
      this.listenWsMaintain(val);
    }
  },
  props: ['typeInfo', 'ordersort'],
  computed: {
    noMore() {
      return this.pageCurrent * this.pageSize >= this.total;
    },
    disabled() {
      return this.loading || this.noMore;
    },
    ...mapGetters(['WsMaintain'])
  },
  data() {
    return {
      active: -1,
      pageSize: 10,
      pageCurrent: 1,
      currentRow: null,
      gridData: [],
      peopleSel: false,
      visibleDel: false,
      deleteSubmit: () => {}, // Function
      flieImgAudioList: [],
      orderDetailData: null,
      titleMes: '',
      tipInputLable: '',
      fixReason: '',
      endOrder: false,
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      flowData: [], // 工单日志
      equipmentDetails: [], // 工单流程
      map: null, // 地图
      deviceList: [], // 地图上的点
      mapFaultList: [],
      swiperOption: {
        slidesPerView: 7,
        slidesPerGroup: 7,
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
      swiperOption2: {
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
      count: 10,
      loading: false,
      total: '',
      searchName: '',
      memberId: '',
      distance: 100, // 临界值，距离底部多少距离时触发函数  infiniteHandler
      isLoading: false,
      pages: 0
    };
  },
  methods: {
    onInfinite($state) {
      if (this.isLoading) {
        return;
      } else {
        this.isLoading = true;
        // this.pageSize += 10;
        const params = {
          current: this.pageCurrent,
          size: this.pageSize
        };
        const data = {
          name: ''
        };
        const query = generateUrlParams('', params);
        detailOperationStaffList(query, data).then(res => {
          const { code, object } = res;
          if (code === 200) {
            if (object.records.length) {
              this.pageCurrent++;
              this.gridData = this.gridData.concat(object.records);
              $state.loaded();
              this.isLoading = false;
            } else {
              $state.complete();
              this.isLoading = false;
            }
          }
        });
      }
    },
    listenWsMaintain(data) {
      if (data.orderOperateType) {
        if (data.object.id === this.orderDetailData.id) {
          if (this.typeInfo == 2) {
            if (data.orderOperateType === 'RESPOND') {
              this.$message.success('工单已响应');
            } else {
              // this.$message.success('工单详情有数据更新');
            }
          }
        }
      }
    },
    orderAssignAdd() {
      // 派单
      if (this.memberId === '') {
        return this.$message.error('请选择人员');
      }
      this.$$ALoading.show();
      orderAssign({
        assignerId: this.memberId,
        id: this.$route.query.id
      })
        .then(res => {
          const { message, code } = res;
          if (code == 200) {
            this.$message.success(message || '派单成功');
            this.$$ALoading.close();
            this.orderListDetail(this.$route.query.id);
            this.peopleSel = false;
            this.$router.go(-1);
          } else {
            this.$message.error(message || '派单失败');
            this.$$ALoading.close();
          }
        })
        .finally(() => {});
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    activeAdd(idx, id) {
      this.active = idx;
      this.memberId = id;
    },
    detailOperationStaffList(name) {
      const params = {
        current: this.pageCurrent,
        size: this.pageSize
      };
      const data = {
        name: name
      };
      const query = generateUrlParams('', params);
      detailOperationStaffList(query, data).then(res => {
        const { object, code } = res;
        if (code == 200) {
          this.total = object.total;
          this.pages = object.pages;
          this.gridData = object.records;
        }
      });
    },
    clearInput() {
      this.pageSize = 10;
      this.pageCurrent = 1;
      this.detailOperationStaffList('');
    },
    autoSearch() {
      this.pageSize = 10;
      this.pageCurrent = 1;
      this.detailOperationStaffList(this.searchName);
    },
    userQueryPage() {
      this.detailOperationStaffList(this.searchName);
    },
    load() {
      this.loading = true;
      this.pageSize += 10;
      detailOperationStaffList({
        current: this.pageCurrent,
        size: this.pageSize,
        name: name
      }).then(res => {
        const { code, object } = res;
        if (code === 200) {
          this.pageCurrent++;
          this.gridData = this.gridData.concat(object.records);
          this.loading = false;
        }
      });
    },

    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    delOrder() {
      this.visibleDel = true;
      this.deleteSubmit = this.delItem;
    },
    delItem() {
      const id = this.$route.query.id;
      orderDelete(id)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '删除成功');
            this.$router.go(-1);
            this.visibleDel = false;
          } else {
            this.$message.error(message || '删除失败');
          }
        })
        .finally(() => {});
    },
    async endOrderMethod() {
      // this.endOrder = false;
      console.log(this.titleMes);
      const data = new FormData();
      var attachmentList = [];
      const id = this.$route.query.id;
      for (var i in this.flieImgAudioList) {
        data.append('files', this.flieImgAudioList[i].file);
      }
      if (this.flieImgAudioList.length > 0) {
        const res = await uploadBatch(data);
        const { object, code } = res;
        if (code == '200' && object.length > 0) {
          attachmentList = object.map(item => ({
            target_type: 'ORDER',
            targetId: id,
            attachmentType: item.type != 'mp4' ? 'IMAGE' : 'VIDEO',
            attachmentUrl: item.path,
            attachmentDesc: item.name
          }));
        }
      } else {
        attachmentList = [];
      }

      if (id && this.fixReason.length) {
        if (this.titleMes === '结束工单') {
          this.$$ALoading.show();
          const respon = await orderFinish({
            // 结束工单
            id: id,
            explain: this.fixReason,
            attachmentList: attachmentList || []
          });
          const { code, message } = respon;
          if (code === 200) {
            this.$message.success(message || '成功');
            this.$$ALoading.close();
            this.orderListDetail(id);
            this.endOrder = false;
            this.$router.go(-1);
          } else {
            this.$message.error(message || '失败');
          }
        } else if (this.titleMes === '转单') {
          this.$$ALoading.show();
          const respon = await orderTransfer({
            // 转单
            id: id,
            explain: this.fixReason,
            attachmentList: attachmentList || []
          });
          const { code, message } = respon;
          if (code === 200) {
            this.$message.success(message || '成功');
            this.$$ALoading.close();
            this.orderListDetail(id);
            this.endOrder = false;
            this.$router.go(-1);
          } else {
            this.$message.error(message || '失败');
          }
        } else if (this.titleMes === '处理工单') {
          this.$$ALoading.show();
          const respon = await orderComplete({
            // 转单
            id: id,
            explain: this.fixReason,
            attachmentList: attachmentList || []
          });
          const { code, message } = respon;
          if (code === 200) {
            this.$message.success(message || '成功');
            this.$$ALoading.close();
            this.orderListDetail(id);
            this.endOrder = false;
            this.$router.go(-1);
          } else {
            this.$message.error('请填写描述');
          }
        }
      } else {
        this.$message.error('请输入描述理由');
      }
    },
    orderListDetail(id) {
      const ordRes = orderListDetail(id);
      return Promise.all([ordRes]).then(res => {
        const respon = res[0];
        const { code, object } = respon;
        if (code === 200 && object) {
          this.orderDetailData = object;
          // latitude longitude
          if (this.ordersort == '2' && object.orderStatus == 'UNRESPONSE') {
            orderRespond({
              id: id
            }).then(result => {
              if (result.code == '200') {
                this.orderListDetail(id);
              }
            });
          }

          this.drawMap(this.orderDetailData.latestFault);
          this.flowInfo(this.orderDetailData);
        }
        console.log(this.orderDetailData);
      });
    },
    endOrderCorfim() {
      // 结束工单
      this.endOrder = true;
      this.titleMes = '结束工单';
      this.tipInputLable = '结束原因';
    },
    revertOrder() {
      // 转单工单
      this.endOrder = true;
      this.titleMes = '转单';
      this.tipInputLable = '转单原因';
    },
    sendOrder() {
      // 派单
      this.peopleSel = true;
      // this.pageCurrent = 1;
      // this.pageSize = 10;
      // this.isLoading = false;
      // this.detailOperationStaffList('');
    },
    dealOrder() {
      // 处理工单
      this.endOrder = true;
      this.titleMes = '处理工单';
      this.tipInputLable = '处理结果';
    },
    getImgAudioList(list) {
      this.flieImgAudioList = list;
    },
    backList() {
      this.$router.go(-1);
    },
    swiperTo(item, index) {
      console.log(index, item);
      this.hideImg = true;
      // this.mySwiper.slideTo(index - 1, 1000, false);
    },
    handleClickSlide(index, reallyIndex) {
      console.log('Click slide!', index, reallyIndex);
    },

    getImgList(imgarr, index) {
      const arr = [];
      let i = 0;
      const newarr = imgarr.filter(item => item.type != 'mp4');
      for (i; i < newarr.length; i++) {
        arr.push(newarr[i + index].src);
        if (i + index >= newarr.length - 1) {
          index = 0 - (i + 1);
        }
      }
      return arr;
    },
    flowInfo(data) {
      // 工单流程
      if (data) {
        this.flowData = data.orderOperateRecordList;
        this.mapFaultList = data.fault;
      }
    },
    // filterVideo(item) {
    //   if (item) {
    //   }
    // },
    video(id) {
      this.$nextTick(() => {
        // var pid = document.getElementById(id);
        // var output = pid.getElementsByClassName("output");
        // var video = pid.getElementsByClassName("video");
        // var mapImg = document.getElementById('map-img');
        // var leftSwiper = document.getElementById('left-swiper');
        var output = document.getElementsByClassName('output');
        var video = document.getElementsByClassName('video');

        for (let i = 0; i < video.length; i++) {
          video[i].addEventListener('loadeddata', function(e) {
            console.log(video);
            var canvas = document.createElement('canvas'); // 创建一个画布
            canvas.width = 100;
            canvas.height = 100;
            canvas.getContext('2d').drawImage(video[i], 0, 0, canvas.width, canvas.height); // getContext:设置画布环境；drawImage:画画

            var img = document.createElement('img');
            img.src = canvas.toDataURL('image/jpeg'); // 获取图片的url
            output[i].appendChild(img);
          });
        }
      });
    },
    drawMap(item) {
      const faultTypeIcon = require('../../../../assets/button/smock.png');
      var markerContent =
        '' +
        '<div class="custom-content-marker">' +
        ' <div class="jumper"><div></div><div></div><div></div></div><img  src=' +
        faultTypeIcon +
        '>' +
        '</div>';
      if (item && item.longitude && item.latitude) {
        this.map = new AMap.Map('aMap', {
          center: [item.longitude, item.latitude],
          resizeEnable: true,
          zoom: 14,
          expandZoomRange: true,
          dragEnable: false, // 地图是否可通过鼠标拖拽平移
          zoomEnable: false, // 地图是否可缩放
          zooms: [12, 20],
          mapStyle: 'amap://styles/whitesmoke' // 设置地图的显示样式
        });
        var marker = new AMap.Marker({
          position: [item.longitude, item.latitude],
          // 将 html 传给 content
          content: markerContent,
          // 以 icon 的 [center bottom] 为原点
          offset: new AMap.Pixel(-13, -30)
        });
        // 将 markers 添加到地图
        this.map.add(marker);
        this.map.panBy(0, 200);
      } else {
        const aMap = document.getElementById('aMap');
        const faultTypeIcon = require('../../../../assets/equip/flex.png');
        aMap.style.backgroundImage = 'url(' + faultTypeIcon + ')';
        // this.map = new AMap.Map('aMap', {
        //   center: this.projectPoint,
        //   resizeEnable: true,
        //   zoom: 14,
        //   expandZoomRange: true,
        //   dragEnable: false, // 地图是否可通过鼠标拖拽平移
        //   zoomEnable: false, // 地图是否可缩放
        //   zooms: [12, 20],
        //   mapStyle: 'amap://styles/whitesmoke' // 设置地图的显示样式
        // });
      }
    }
  },
  created() {
    vm = this;
  },
  mounted() {
    // this.flowInfo();
    // 根据浏览器定位
    // AMap.plugin(['AMap.Geolocation'], () => {
    //   const geolocation = new AMap.Geolocation({
    //     enableHighAccuracy: true, // 是否使用高精度定位，默认:true
    //     timeout: 5000, // 超过10秒后停止定位，默认：5s
    //     zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
    //   });
    //   // this.map.addControl(geolocation);
    //   geolocation.getCurrentPosition((status, result) => {
    //     if (status == 'complete') {
    //       this.projectPoint = [result.position.lng, result.position.lat];
    //       this.map.setCenter(this.projectPoint);
    //     } else {
    //       this.projectPoint = [120, 30];
    //     }
    //   });
    // });
    if (this.typeInfo == 2) {
      // this.drawMap();
    }
    this.$nextTick(function() {
      this.video();
    });
  },
  updated: function() {}
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.dialog-sel-order {
  .el-dialog__header {
    padding: 24px;
    .demonstration {
      .search-container {
        .el-input-group__append {
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
      span {
        margin-right: 10px;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #0f1736;
      }
    }
  }
  .label-p {
    width: 100%;
    height: 42px;
    line-height: 42px;
    background: #eff4ff;
    border-radius: 2px;
    span {
      display: inline-block;
      text-align: center;
      &.indexcode {
        width: 100px;
      }
      &.name {
        width: 100px;
      }
      &.ticketnumber {
        width: 100px;
      }
      &.local {
        width: 168px;
      }
    }
  }
  .infinite-list-wrapper {
    height: 450px;
    ul {
      li {
        background: #fff;
        cursor: pointer;
        span {
          display: inline-block;
          text-align: center;
          overflow: hidden;
          height: 42px;
          line-height: 42px;
          &.idx {
            width: 100px;
          }
          &.name {
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &.orderCount {
            width: 100px;
          }
          &.local {
            width: 150px;
          }
        }
        &.active {
          background: #f6f8fc;
        }
      }
    }
  }
}
.resizeNone {
  .el-textarea__inner {
    resize: none;
  }
}
.el-dialog__body {
  padding: 30px 26px 40px 26px;
}
// .el-tooltip__popper {
//   border: none !important;
//   width: 148px;
//   height: 110px;
//   background: #ffffff;
//   box-shadow: 0px 0px 20px -3px rgba(16, 25, 74, 0.18);
//   border-radius: 6px;
//   .popper__arrow {
//     display: none;
//   }
// }

.order-view {
  overflow: hidden;
  .order-header {
    width: 100%;
    height: 100px;
    border-bottom: 1px solid rgba(229, 233, 243, 0.49);
    position: relative;
    h1 {
      font-size: 20px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
      padding: 30px 0 0 30px;
    }
    .btn-box {
      position: absolute;
      right: 30px;
      top: 30px;
      .btnc {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        width: 100px;
        height: 42px;
        border: none;
        border-radius: 24px;
        box-shadow: 0px 10px 20px -4px rgba(16, 25, 74, 0.18);
      }
      .back {
        color: #c6cada;
        border: 1px solid rgba(210, 218, 234, 0.59);
        background: #ffffff;
      }
      .del {
        background: #ff4807;
      }
      .end {
        background: #3045b1;
      }
      .send {
        background: #3045b1;
      }
    }
  }
  .order-detail {
    display: flex;
    height: calc(100% - 101px);
    .order-right {
      flex: 1;
      .order-code {
        width: 100%;
        padding: 10px 30px;
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            width: 120px;
            margin-right: 90px;
            margin-top: 20px;
            overflow: hidden;
            div {
              font-size: 14px;
              font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
              font-weight: 500;
              color: #aeb4c6;
            }
            h5 {
              font-size: 14px;
              font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
              font-weight: 500;
              color: #0f1736;
              margin-top: 12px;
              padding-bottom: 10px;
            }
          }
          li:last-child {
            margin-right: 0;
          }
          li:nth-of-type(1) {
            width: 210px;
            margin-right: 0;
          }
          li:nth-of-type(4) {
            margin-right: 0;
          }
          li:nth-of-type(5) {
            width: 120px;
          }
        }
      }
      .order-log {
        padding: 30px;
        height: calc(100% - 145px);
        h5 {
          font-size: 14px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 500;
          color: #aeb4c6;
        }
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
                height: 100px;
                background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);
                span {
                  width: 20px;
                  height: 100px;
                  background: #ffffff;
                  box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
                  border-radius: 4px;
                  margin-left: 20px;
                  display: inline-block;
                  img {
                    margin-top: 42px;
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
                height: 100px;
                background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);
                span {
                  width: 20px;
                  height: 100px;
                  background: #ffffff;
                  box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
                  border-radius: 4px; // margin-left: 20px;
                  display: inline-block;
                  img {
                    margin-top: 42px;
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
      }
    }
    .order-map {
      width: 970px;
      position: relative;
      .hover-mes {
        width: 682px;
        position: absolute;
        left: 50%;
        bottom: 200px;
        margin-left: -340px;
        background: #ffffff;
        box-shadow: 0px 10px 20px -4px rgba(23, 20, 69, 0.18);
        border-radius: 21px;
        /* overflow: hidden; */
        padding: 0 10px;
        &:after {
          position: absolute;
          left: 50%;
          bottom: -30px;
          content: '';
          width: 0;
          height: 0;
          border-left: 30px solid transparent;
          border-right: 30px solid transparent;
          border-top: 30px solid #ffffff;
          margin-left: -30px;
        }
        .swiper-map {
          margin-top: 20px;
        }
        .nav-right {
          position: absolute;
          right: 0px;
          top: 22px;
          width: 42px;
          height: 110px;
          background: #ffffff;
          span {
            width: 20px;
            height: 110px;
            background: #ffffff;
            box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
            border-radius: 4px;
            margin-left: 20px;
            display: inline-block;
            img {
              margin-top: 42px;
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
          height: 100px;
          background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);
          span {
            width: 20px;
            height: 100px;
            background: #ffffff;
            box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
            border-radius: 4px; // margin-left: 20px;
            display: inline-block;
            img {
              margin-top: 42px;
              margin-left: 3px;
            }
          }
        }
        .errordes {
          padding: 10px 20px;
          h5 {
            font-size: 14px;
            font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
            font-weight: 500;
            color: #aeb4c6;
            padding-bottom: 10px;
          }
          p {
            font-size: 16px;
            font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
            font-weight: 400;
            color: #0f1736;
            line-height: 21px;
          }
        }
        .mapBox {
          height: 100px;
          overflow: hidden;
          position: relative;
          margin-top: 20px;

          .demo-image__preview-map {
            position: relative;
          }
        }
      }
    }
  }
}

// 工单日志的样式
.box {
  display: flex;
}

//map
#aMap {
  width: 100%;
  height: 100%;
}

.custom-content-marker {
  position: relative;
  width: 25px;
  height: 34px;
  img {
    width: 48px;
    height: 48px;
    position: relative;
    z-index: 2;
  }
}

.amap-info-contentContainer {
  width: 39px;
  height: 10px;
  .amap-info-content.amap-info-outer {
    background-color: #666;
    border-radius: 4px;
    padding: 20px 16px;
  }
  .amap-info-content.amap-info-outer > p {
    font-size: 20px;
    color: #fff;
    max-width: 340px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.p-info {
      font-weight: bold;
      padding-bottom: 10px;
      border-bottom: 1px solid #8f8f8f;
    }
  }
  .amap-info-content.amap-info-outer > a.amap-info-close {
    display: none;
  }
  .amap-info-sharp {
    border-right-color: #666;
  }
}

.amap-marker {
  .amap-simple-marker-label {
    top: -32px !important;
    left: 36px !important;
    border: none;
    width: 390px;
    height: 80px;
    background-color: #666;
    border-radius: 4px;
    padding: 14px 20px 16px;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      left: -4px;
      width: 10px;
      height: 10px;
      background-color: #666;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
    p {
      font-size: 14px;
      color: #fff;
      max-width: 340px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &.p-info {
        font-weight: bold;
        padding-bottom: 10px;
        border-bottom: 1px solid #8f8f8f;
      }
    }
  }
}

//设备信息
.swiper-button-next {
  &:after {
    content: '';
  }
}
.dialog-end-order {
  .fixPre {
    .demonstration {
      height: 14px;
      font-size: 14px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #747aa5;
      padding: 0 0 20px 0;
      display: flex;
      img {
        margin-left: 4px;
      }
    }
  }
}
.jumper {
  display: block;
  position: absolute;
  left: -22px;
  top: 12px;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 90px;
  height: 90px;
}
.jumper > div {
  background-color: #dc1d1d;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
  left: 0px;
  top: 0px;
  opacity: 0;
  margin: 0;
  width: 90px;
  height: 90px;
  -webkit-animation: jumper 2s 0s linear infinite;
  animation: jumper 2s 0s linear infinite;
}
.jumper > div:nth-child(2) {
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
.jumper > div:nth-child(3) {
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
@-webkit-keyframes jumper {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
.dialog-footer-peo,
.dialog-footer-upload {
  .cancleDialog {
    width: 100px;
    height: 42px;
    border-radius: 24px;
    border: 1px solid #b4b9cf;
    margin-right: 20px !important;

    span {
      width: 34px;
      height: 16px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #b4b9cf;
      letter-spacing: 1px;
    }
  }

  .confimDialog {
    width: 100px;
    height: 42px;
    background: #3045b1;
    border-radius: 24px;

    span {
      width: 34px;
      height: 16px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #ffffff;
      letter-spacing: 1px;
    }
  }
}
</style>

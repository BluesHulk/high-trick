<template>
  <div class="order-view-fix order-content-account order-content" v-if="typeInfoFix == 2">
    <div class="order-header">
      <h1>上报故障</h1>
      <div class="btn-box">
        <el-button type="primary" @click="backList" class="btnc text-center back">返回</el-button>
        <el-button type="primary" class="btnc text-center end" @click="faultAdd">确认</el-button>
      </div>
    </div>

    <div class="order-detail">
      <div class="order-right scrollbar scrollbar-y scrollbar-light">
        <el-form ref="form" :model="equipFormData" class="fix-equipment" @submit.native.prevent>
          <el-form-item prop="typeEquip">
            <div class="demonstration">设备类别</div>
            <el-select v-model="equipFormData.typeEquip" @change="equipChangeType" placeholder="请选择设备类别">
              <el-option v-for="item in equipSort" :key="item.value" :label="item.label" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="equipTypeModal">
            <div class="demonstration">设备类型</div>
            <el-select v-model="equipFormData.equipTypeModal" @change="equipChangeError" placeholder="请选择设备类型">
              <el-option v-for="item in equipType" :key="item.value" :label="item.label" :value="item"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="equipFault">
            <div class="demonstration">故障设备</div>
            <el-input placeholder="请添加故障设备" v-model="equipFormData.equipFault">
              <i
                slot="suffix"
                class="el-input__icon el-icon-circle-plus-outline"
                v-if="!equipFormData.equipFault"
                @click="addEquip"
              ></i>
              <i
                slot="suffix"
                class="el-input__icon el-icon-refresh-left"
                v-if="equipFormData.equipFault.length"
                @click="returnAddEquip"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="equipValueLevel">
            <div class="demonstration">优先级</div>
            <el-select v-model="equipFormData.equipValueLevel" placeholder="请选择优先级">
              <el-option :key="item.name" v-for="item in levelOb" :label="item.desc" :value="item.name"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="equip-fix">
          <h3>故障类型</h3>
          <div class="type-equip">
            <ul>
              <li v-for="(val, index) in valueType" :key="index">
                {{ val.label }}
                <img src="../../../../../assets/button/img-del.png" alt="" @click="delItem(index)" />
              </li>

              <li>
                <span v-if="!selectShow" class="additem" @click="addType">
                  <img src="../../../../../assets/button/type-add.png" alt="" />
                  添加
                </span>
                <div v-if="selectShow" class="select-type">
                  <el-select
                    v-model="valueType"
                    @change="handleType"
                    ref="fuzzySearch"
                    @focus="focusSelectValue"
                    multiple
                    filterable
                    size="mini"
                    collapse-tags
                    default-first-option
                    placeholder="请选择故障类型"
                  >
                    <el-option v-for="item in totalEquip" :key="item.value" :label="item.label" :value="item">
                    </el-option>
                  </el-select>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="equip-des">
          <div class="demonstration">故障描述</div>
          <el-input
            type="textarea"
            placeholder="请输入故障描述"
            class="resizeNone"
            v-model="equipdes"
            maxlength="500"
          ></el-input>
        </div>
        <div class="upload-equip">
          <Upload @getImgAudioList="getImgAudioList"></Upload>
          <p>
            <span>右侧地图显示故障设备的所在地理位置</span>
            <img src="../../../../../assets/button/double-arrow.png" alt="" />
          </p>
        </div>
      </div>
      <div class="order-map">
        <div class="map-equipment" id="aMap"></div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" class="dialog-equip-select" :visible.sync="showAdd" width="1100px">
      <template slot="title" class="fixPre">
        <div class="demonstration">
          <span>选择设备</span>
          <el-input
            clearable
            class="search-container"
            @clear="clearInput"
            v-model="searchName"
            placeholder="请输入设备编号/名称"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchEquip">
              <div style="width: 100%; height: 100%"></div>
            </el-button>
          </el-input>
        </div>
      </template>
      <p class="equipMenu">设备目录</p>
      <div class="radioList scrollbar scrollbar-y scrollbar-light">
        <el-radio-group v-model="equipRadio" @change="onRadioGroupChange">
          <el-radio v-for="(val, index) in equipList" :label="val" :key="index">{{ val.name }}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer-report">
        <el-button class="cancleDialog" @click="showAdd = false">取 消</el-button>
        <el-button class="confimDialog" type="primary" @click="addEquipCorfim">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AMap from 'AMap';
import AMapUI from 'AMapUI';
// import Upload from './upload/upload'
import Upload from '@/components/uploadImgAudio/upload';
import {
  deviceDataQuery,
  getCategoryQuery,
  commonGetEnum,
  // deviceFaultType,
  uploadBatch,
  queryByCategoryId,
  faultAdd
} from '@/api/order';
export default {
  name: 'opa-project',
  components: {
    // Maincontent,
    Upload
  },
  watch: {
    typeInfoFix() {
      if (this.typeInfoFix == 2) {
        this.equipFormData = {
          equipFault: '',
          equipValueLevel: '',
          equipTypeModal: '',
          typeEquip: '',
          equipFaultId: '',
          equipCode: ''
        };
        this.equipdes = '';
        this.valueType = [];
        this.equipSort = [];
        this.equipType = [];
        this.equipList = [];
        this.$nextTick(function() {
          this.drawMap();
        });
        this.deviceCategory();
        this.getSelects();
      }
    }
  },
  props: ['typeInfoFix', 'fixsort'],
  computed: {},
  data() {
    return {
      searchName: '',
      equipRadio: '',
      showAdd: false,
      equipdes: '', // 故障描述
      titleMes: '',
      tipInputLable: '',
      fixReason: '',
      endOrder: false,
      selectShow: false,
      map: null, // 地图
      projectPoint: [120, 30], // 项目位置
      equipValue: '',
      equipValueLevel: '',
      equipFormData: {
        equipFault: '',
        equipValueLevel: '',
        equipTypeModal: '',
        typeEquip: '',
        equipFaultId: '',
        equipCode: ''
      },
      valueType: [],
      equipSort: [],
      equipType: [],
      equipList: [],
      levelOb: {},
      flieImgAudioList: [],
      mapPoint: {},
      equipError: [], // 故障类型
      typeClick: false,
      equipErrorSort: [],
      totalEquip: []
    };
  },
  methods: {
    onRadioGroupChange(val) {
      // 点击单选框的时候
      this.equipFormData.equipFault = val.name;
      this.equipFormData.equipFaultId = val.id;
      this.equipFormData.equipCode = val.equip.code;
      console.log(val);
      this.mapPoint = {
        longitude: val.equip.longitude,
        latitude: val.equip.latitude
      };
      this.drawMap(val.equip);
    },
    searchEquip() {},
    async faultAdd() {
      // 确认添加
      const data = new FormData();
      var attachmentList = [];
      var params = {};
      if (this.equipFormData.typeEquip) {
        params.deviceCategoryId = this.equipFormData.typeEquip.value; // 设备类别ID
        params.deviceCategoryName = this.equipFormData.typeEquip.label; // 设备类别名称
      } else {
        this.$$ALoading.close();
        return this.$message.error('请选择设备类别');
      }
      if (this.equipFormData.equipTypeModal) {
        params.deviceTypeId = this.equipFormData.equipTypeModal.value; // 设备类型ID
        params.deviceTypeName = this.equipFormData.equipTypeModal.label; // 设备类型名称
      } else {
        this.$$ALoading.close();
        return this.$message.error('请选择设备类型');
      }
      if (this.equipFormData.equipFault.length > 0) {
        params.deviceName = this.equipFormData.equipFault; // 设备名称
        params.deviceCode = this.equipFormData.equipCode; // 设备编号
        params.longitude = this.mapPoint.longitude; // 经度
        params.latitude = this.mapPoint.latitude; // 维度
      } else {
        this.$$ALoading.close();
        return this.$message.error('请选择故障设备');
      }
      if (this.equipFormData.equipValueLevel) {
        params.priorityLevel = this.equipFormData.equipValueLevel;
      } else {
        this.$$ALoading.close();
        return this.$message.error('请选择优先级');
      }
      if (this.valueType.length > 0) {
        // 故障类型
        params.faultTypeList = this.valueType.map(item => ({
          id: item.value,
          name: item.label
        }));
      }
      if (this.flieImgAudioList.length > 0) {
        for (var i in this.flieImgAudioList) {
          data.append('files', this.flieImgAudioList[i].file);
        }

        const res = await uploadBatch(data);
        const { object, code, message } = res;
        if (code == '200' && object.length > 0) {
          attachmentList = object.map(item => ({
            attachmentType: item.type != 'mp4' ? 'IMAGE' : 'VIDEO',
            attachmentUrl: item.path
          }));
        } else {
          return this.$message.error(message || '上传图片失败');
        }
        params.attachmentList = attachmentList || [];
      } else {
        params.attachmentList = [];
      }
      params.faultDesc = this.equipdes;
      params.reportPlatform = 'PC';
      params.faultSource = 'OTHER';
      this.$$ALoading.show();
      faultAdd(params)
        .then(res => {
          const { code, message } = res;
          if (code == 200) {
            this.$message.success(message || '添加成功');
            this.$$ALoading.close();
            this.$nextTick(() => {
              this.$refs.form.resetFields();
            });
            params.attachmentList = [];
            this.equipdes = '';
            this.flieImgAudioList = [];
            this.valueType = [];
          } else {
            this.$message.error(message || '添加失败');
            this.$$ALoading.close();
          }
        })
        .finally(() => {
          this.$$ALoading.close();
          this.$router.go(-1);
          this.$nextTick(() => {
            this.$refs.form.resetFields();
          });
          this.equipdes = '';
          this.flieImgAudioList = [];
          this.valueType = [];
          params.attachmentList = [];
        });
    },
    addEquipCorfim() {
      this.equipRadio = '';
      this.showAdd = false;
    },
    addEquip() {
      if (this.equipFormData.equipTypeModal && this.equipFormData.typeEquip) {
        this.showAdd = true;
      } else {
        this.$message.error('请先选择故障类型/类别');
      }
    },
    returnAddEquip() {
      this.showAdd = true;
    },
    equipChangeType(val) {
      this.equipFormData.typeEquip = val.label;
      this.getQueryById(val.value);
      this.filterDeviceFaultType(val.value);
    },
    equipChangeError(val) {
      this.valueType = [];
      this.equipFormData.equipTypeModal = val.label;
      this.typeClick = true;
      if (val) {
        this.deviceDataQuery(val.value);
        this.filterDeviceFaultTypeSort(val.value);
      }
    },
    deviceCategory(val) {
      // 设备类别
      getCategoryQuery({
        type: 'DEVICE'
      }).then(res => {
        if (res.code == 200) {
          //   this.categoryList = res.object;
          this.equipSort = res.object.map(item => ({
            label: item.name,
            value: item.id
          }));
        }
      });
    },
    // 设备类型
    getQueryById(node, resolve) {
      if (node) {
        getCategoryQuery({
          type: 'DEVICE',
          parentId: node
        }).then(res => {
          if (res.code == 200) {
            this.equipType = res.object.map(item => ({
              label: item.name,
              value: item.id
            }));
          }
        });
      }
    },
    deviceDataQuery(categoryId) {
      const data = {
        current: 1,
        size: 1000000,
        categoryId: categoryId,
        mountable: false
      };
      deviceDataQuery(data).then(res => {
        if (res.code == 200) {
          this.equipList = res.object.records.map(item => ({
            id: item.id,
            name: item.name,
            equip: {
              longitude: item.longitude, // 设备经纬度
              latitude: item.latitude, // 设备经纬度
              state: item.state, // 设备状态
              code: item.code // 设备编号
            }
          }));
        }
      });
    },
    delItem(index) {
      this.valueType.splice(index, 1);
    },
    addType() {
      this.selectShow = true;
    },
    handleType(val) {
      this.selectShow = false;
    },
    focusSelectValue() {
      // filterable添加 失效事件会消失
      this.$refs.fuzzySearch.$refs.input.blur = () => {
        this.selectShow = false;
      };
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
    drawMap(item) {
      // 地图绘制
      if (item) {
        const faultTypeIcon = require('../../../../../assets/button/smock.png');
        var markerContent =
          '' +
          '' +
          '<div class="custom-content-marker">' +
          ' <div class="jumper"><div></div><div></div><div></div></div><img  src=' +
          faultTypeIcon +
          '>' +
          '</div>';
        this.map = new AMap.Map('aMap', {
          center: [item.longitude, item.latitude],
          resizeEnable: true,
          zoom: 14,
          expandZoomRange: true,
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
      } else {
        this.map = new AMap.Map('aMap', {
          resizeEnable: true,
          zoom: 14,
          expandZoomRange: true,
          mapStyle: 'amap://styles/whitesmoke' // 设置地图的显示样式
        });
      }
    },
    drawPointer(item) {
      if (this.map) {
        this.map.clearMap();
      } // 清空所有点
      AMapUI.loadUI(['overlay/SimpleMarker'], SimpleMarker => {
        this.map.setFitView(
          new SimpleMarker({
            map: this.map,
            offset: Number(item.deviceTypeId) === 13 ? new AMap.Pixel(-7, -18) : new AMap.Pixel(-12, -14),
            showPositionPoint: false,
            position: [item.lnglat.lng, item.lnglat.lat],
            clickable: true
          })
        );
      });
    },
    getSelects() {
      const level = commonGetEnum({
        enumName: 'PriorityLevelType'
      });

      return Promise.all([level]).then(res => {
        const lev = res[0];
        if (lev) {
          const { code, object } = lev;
          if (code === 200) {
            this.levelOb = object;
          }
        }
      });
    },
    // 故障类型 类别
    filterDeviceFaultType(id) {
      queryByCategoryId({
        categoryId: id
      })
        .then(res => {
          if (res.code == 200) {
            this.equipError = res.object.map(item => ({
              value: item.id,
              label: item.name,
              desc: item.desc
            }));
          }
        })
        .finally(() => {
          this.totalEquip = this.equipError;
        });
    },
    // 故障类型 类别
    filterDeviceFaultTypeSort(id) {
      queryByCategoryId({
        categoryId: id
      })
        .then(res => {
          if (res.code == 200) {
            this.equipErrorSort = res.object.map(item => ({
              value: item.id,
              label: item.name,
              desc: item.desc
            }));
          }
        })
        .finally(() => {
          this.totalEquip = this.equipError.concat(this.equipErrorSort);
        });
    },
    async endOrderMethod() {
      // this.endOrder = false;
      const data = new FormData();
      const fileArr = [];
      for (const i in this.flieImgAudioList) {
        fileArr.push(this.flieImgAudioList[i].file);
      }

      data.append('file', fileArr);
    }
  },
  created() {
    this.deviceCategory();
    this.getSelects();
  },
  mounted() {
    this.equipdes = '';
    this.valueType = [];
    this.flieImgAudioList = [];
    if (this.typeInfoFix == 2) {
      this.drawMap();
    } else {
      this.typeInfoFix = 1;
    }
  },
  updated: function() {}
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';

.dialog-equip-select {
  .el-dialog__header {
    padding: 24px;

    .demonstration {
      .search-container {
        width: 320px;
        height: 42px;

        .el-input-group__append {
          cursor: pointer;
          background: url(../../../../../assets/button/search.png) center no-repeat;
        }

        .el-icon-search {
          display: none;
        }

        .el-input__inner:focus {
          border: 1px solid $--color-pink;
        }

        .el-input__inner {
          border-right: none;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(68, 79, 132, 0.3);
          line-height: 22px;
          letter-spacing: 1px;
          color: #0f1736 !important;
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

  .el-dialog__body {
    .equipMenu {
      padding-bottom: 30px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
    }

    .radioList {
      height: 420px;

      .el-radio {
        width: 120px;
        margin-bottom: 28px;
        margin-left: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .el-radio__input {
          .el-radio__inner {
            border-radius: 0;
            border: none;
            width: 18px;
            height: 18px;
            border-color: transparent;
            background: transparent url('../../../../../assets/radio/radio-unchecked-edit.png') !important;
            background-size: contain;
          }

          &.is-checked {
            .el-radio__inner {
              border-radius: 0;
              border: none;
              width: 18px;
              height: 18px;
              border-color: transparent;
              background: transparent url('../../../../../assets/radio/radio-checked-edit.png') !important;
              background-size: contain;

              &:after {
                content: '';
                width: 0;
                height: 0;
              }
            }
          }
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

.order-view-fix {
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
    .el-input__inner {
      color: #0f1736;
    }
    .order-right {
      flex: 1;

      .fix-equipment {
        padding: 30px 30px 0 30px;
      }

      .equip-fix {
        padding: 0 30px;

        h3 {
          font-size: 16px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 500;
          color: #0f1736;
        }

        .type-equip {
          ul {
            display: flex;
            flex-wrap: wrap;
            position: relative;
            min-height: 61px;

            li {
              padding: 9px 5px 9px 20px;
              color: #747aa5;
              font-size: 14px;
              font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
              font-weight: 500;
              background: #f6f8fc;
              border-radius: 20px;
              text-align: center;
              line-height: 21px;
              margin-right: 20px;
              margin-top: 20px;

              img {
                float: right;
                width: 18px;
                height: 18px;
                margin-left: 4px;
                margin-top: 3px;
                cursor: pointer;
              }
            }

            li:last-child {
              padding: 0;
              position: relative;

              .additem {
                display: inline-block;
                padding: 10px 20px;
                color: #3045b1;
                font-size: 14px;
                font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
                font-weight: 500;
                background: #f6f8fc;
                border-radius: 20px;
                position: relative;

                img {
                  width: 14px;
                  height: 14px;
                  display: inline-block;
                  float: left;
                  margin-right: 4px;
                  margin-top: 4px;
                }
              }

              .select-type {
                height: 38px;
                /* margin-top: 5px; */
                background: #f6f8fc;
                padding: 0 20px;
                border-radius: 25px;

                .el-select {
                  margin-top: 5px;
                }
              }
            }
          }
        }
      }

      .equip-des {
        padding: 30px 30px 10px 30px;

        .demonstration {
          font-size: 16px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 500;
          color: #0f1736;
          padding-bottom: 10px;
        }
      }

      .upload-equip {
        padding: 0px 30px 10px 30px;

        p {
          margin-top: 30px;

          span {
            float: left;
            font-size: 14px;
            font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
            font-weight: 500;
            color: #3045b1;
          }

          img {
            float: left;
            width: 14px;
            height: 14px;
            margin-left: 10px;
          }
        }
      }
    }

    .order-map {
      width: 970px;
      position: relative;
    }
  }
}

#aMap {
  width: 100%;
  height: 100%;
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

.el-form-item {
  .el-input {
    .el-input__suffix {
      .el-input__icon {
        transition: none;
      }

      .el-icon-refresh-left {
        width: 65px;

        &:before {
          content: '重新选择';
          color: #3045b1;
          font-size: 12px;
          text-decoration: underline;
        }
      }

      .el-icon-circle-plus-outline {
        &:before {
          content: '';
          width: 20px;
          display: inline-block;
          height: 20px;
          margin-top: 11px;
          background: url('../../../../../assets/button/img-add.png') no-repeat center center;
          background-size: contain;
        }
      }
    }
  }
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

.dialog-footer-report {
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

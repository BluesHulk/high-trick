<template>
  <TreeContent>
    <template slot="tree">
      <div class="tree-head a-toolbar-between">
        <div>
          <div class="tree-title page-title">
            <el-input
              @clear="searchInit"
              clearable
              class="search-container-play"
              v-model="searchName"
              placeholder="请输入巡检名称"
            >
              <el-button slot="append" @click="handleSearch" icon="el-icon-search">
                <div style="width: 100%; height: 100%"></div>
              </el-button>
            </el-input>
            <el-select clearable v-model="ckType" @change="handelChangeType" class="choose" placeholder="请选择类型">
              <el-option :key="item.name" v-for="item in actionOb" :label="item.desc" :value="item.name"> </el-option>
            </el-select>
          </div>
        </div>
        <CircleButton :type="$$ActionType.add" @click="addRole">{{ $$ButtonText.plus }}</CircleButton>
      </div>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loaded"
        infinite-scroll-distance="10"
        class="tree-content-wrapper scrollbar scrollbar-y scrollbar-light"
      >
        <div class="list-wrapper-play" ref="DataList">
          <div
            class="float-container play-item"
            :class="{ selected: index === currentIndex }"
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
                  v-if="item.planName != null && item.planName.length > 15"
                  class="show-dot"
                  effect="dark"
                  :content="item && item.planName"
                  placement="top"
                >
                  <h4>{{ item.planName || '——' }}</h4>
                </el-tooltip>
                <h4 v-else>{{ item.planName || '——' }}</h4>
                <p class="ck-eq">
                  巡检设备<span> {{ item.inspectPlanDeviceList.length }} </span>
                </p>
                <p class="ck-time">
                  巡检时间<span>{{ item.startTime }}</span>
                </p>
              </div>
              <div class="float-right">
                <ImageButton :src="ButtonImage[item.opened]" data-id="enabled"></ImageButton>
                <div class="op-icon">
                  <div class="edit" data-id="edit"></div>
                  <div class="delete" @click.stop="del(item)"></div>
                </div>
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
        <template v-if="actionType === $$ActionType.add || actionType === $$ActionType.edit">
          <div class="page-title">{{ $$ButtonText[actionType] }}计划</div>
          <PrimaryButton @click="save">{{ $$ButtonText.save }}</PrimaryButton>
        </template>
        <div v-else class="page-title">计划详情</div>
      </div>

      <div
        class="play-detail-view"
        v-if="actionType !== $$ActionType.add && actionType !== $$ActionType.edit && currentNode.inspectRuleList"
      >
        <ul class="plat-t-n">
          <li>
            <p>
              <span>计划名称</span>
              <el-tooltip class="show-dot" effect="dark" :content="currentNode && currentNode.planName" placement="top">
                <span>{{ currentNode.planName || '——' }}</span>
              </el-tooltip>
            </p>
          </li>
          <li>
            <p><span>巡检时间</span>{{ currentNode.startTime }}</p>
          </li>
          <li v-if="!isNumber">
            <p><span>预计完成时间</span>{{ currentNode.expectEndTime }}</p>
          </li>
        </ul>
        <div class="repeatTime">
          <h3>重复时间</h3>
          <div class="weekitem">
            <!-- @weekChecked="weekChecked" -->
            <WeekList :list="list"></WeekList>
          </div>
        </div>
        <div class="check-con" v-if="currentNode.inspectRuleList.length > 0 && !isNumber">
          <h3>巡检内容</h3>
          <div class="ck-list">
            <span v-for="(val, index) in currentNode.inspectRuleList" :data-key="index" :key="val.id">
              {{ val.inspectContent }}
            </span>
          </div>
        </div>
        <div class="ck-member" v-if="currentNode.inspectStaffList.length > 0 && !isNumber">
          <h3>巡检人员</h3>
          <div class="dl-list">
            <dl v-for="(people, index) in currentNode.inspectStaffList" :data-key="index" :key="people.id">
              <dt v-if="people.photoUrl">
                <img :src="people.photoUrl" alt="" />
              </dt>
              <dt v-else>
                <img src="../../../../assets/defaults.png" alt="" />
              </dt>
              <el-tooltip class="show-dot" effect="dark" :content="people && people.name" placement="top">
                <dd>
                  {{ people.name }}
                </dd>
              </el-tooltip>
            </dl>
            <dl v-for="(useVal, idx) in userIdList" :data-key="idx" :key="useVal.id">
              <dt v-if="useVal.photoUrl">
                <img :src="useVal.photoUrl" alt="" />
              </dt>
              <dt v-else>
                <img src="../../../../assets/defaults.png" alt="" />
              </dt>
              <dd>{{ useVal.name }}</dd>
            </dl>
          </div>
        </div>
        <div class="check-equip" v-if="currentNode.inspectPlanDeviceList.length > 0">
          <h3>巡检设备</h3>
          <div class="ck-list">
            <span v-for="(equip, index) in currentNode.inspectPlanDeviceList" :data-key="index" :key="equip.id">
              {{ equip.deviceName }}
            </span>
          </div>
        </div>
      </div>
      <div class="play-detail-edit" v-if="actionType === $$ActionType.edit">
        <el-form ref="editForm" :model="editForm" class="add-edit-play">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="计划名称" prop="playName">
                <el-input placeholder="请输入计划名称" v-model="editForm.playName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划类型" prop="editPlayType">
                <el-select
                  :disabled="true"
                  clearable
                  v-model="editForm.editPlayType"
                  class="choose"
                  placeholder="请选择类型"
                >
                  <el-option :key="item.name" v-for="item in actionOb" :label="item.desc" :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检时间" prop="timeS">
                <el-time-picker
                  @change="handlEditStartTime"
                  value-format="HH:mm"
                  v-model="editForm.timeS"
                  placeholder="请选择时间"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!isNumber">
              <el-form-item label="预计完成时间" prop="timeE">
                <el-time-picker
                  @change="handlEditEndTime"
                  value-format="HH:mm"
                  v-model="editForm.timeE"
                  placeholder="请选择时间"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="repeatTime">
          <h3>重复时间</h3>
          <div class="weekitem">
            <!-- @weekChecked="weekChecked" -->
            <WeekList :list="listEdit" @weekChecked="weekCheckedEdit"></WeekList>
          </div>
        </div>
        <div class="check-con" v-if="!isNumber">
          <h3>巡检内容</h3>
          <div class="ck-list">
            <span v-for="(val, index) in inspectRuleList" :data-key="index" :key="val.id">
              {{ val.inspectContent }}
            </span>
          </div>
        </div>
        <div class="ck-member" v-if="!isNumber">
          <h3>巡检人员</h3>
          <div class="dl-list">
            <dl v-for="(people, index) in userIdList" :data-key="index" :key="people.id">
              <dt v-if="people.photoUrl">
                <img :src="people.photoUrl" alt="" />
              </dt>
              <dt v-else>
                <img src="../../../../assets/defaults.png" alt="" />
              </dt>
              <dd>{{ people.name }}</dd>
            </dl>
            <a @click="addPerson"><img src="../../../../assets/button/type-add.png" alt=""/></a>
          </div>
        </div>
        <div class="check-equip" v-if="currentNode.inspectPlanDeviceList.length > 0">
          <h3>巡检设备</h3>
          <div class="ck-list">
            <span v-for="(equip, index) in inspectPlanDeviceList" :data-key="index" :key="equip.id">
              {{ equip.deviceName }}
            </span>
            <span @click="addEquip"><img src="../../../../assets/button/type-add.png" alt="" />添加</span>
          </div>
        </div>
      </div>
      <div class="play-detail-add" v-if="actionType === $$ActionType.add">
        <el-form ref="addForm" :model="addForm" class="add-edit-play">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="计划名称" prop="playName">
                <el-input placeholder="请输入计划名称" v-model="addForm.playName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划类型" prop="addPlayType">
                <el-select
                  clearable
                  v-model="addForm.addPlayType"
                  @change="handCheckIsNumber"
                  class="choose"
                  placeholder="请选择类型"
                >
                  <el-option :key="item.name" v-for="item in actionOb" :label="item.desc" :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检时间" prop="timeS">
                <el-time-picker
                  value-format="HH:mm"
                  @change="handlechangStartTime"
                  v-model="addForm.timeS"
                  placeholder="请选择时间"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!isNumber">
              <el-form-item label="预计完成时间" prop="timeE">
                <el-time-picker
                  @change="handlechangEndTime"
                  value-format="HH:mm"
                  v-model="addForm.timeE"
                  placeholder="请选择时间"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="repeatTime">
          <h3>重复时间</h3>
          <div class="weekitem">
            <!-- @weekChecked="weekChecked" -->
            <WeekList :list="listAdd" @weekChecked="weekChecked"></WeekList>
          </div>
        </div>
        <div class="check-con" v-if="!isNumber && selectedEquip.length > 0 && equipRule.length > 0">
          <h3>巡检内容</h3>
          <div class="ck-list">
            <span v-for="(rule, index) in equipRule" :data-key="index" :key="rule.id">{{ rule.inspectContent }}</span>
          </div>
        </div>
        <div class="ck-member" v-if="!isNumber">
          <h3>巡检人员</h3>
          <div class="dl-list">
            <dl v-for="(people, index) in userIdList" :data-key="index" :key="people.id">
              <dt v-if="people.photoUrl">
                <img :src="people.photoUrl" alt="" />
              </dt>
              <dt v-else>
                <img src="../../../../assets/defaults.png" alt="" />
              </dt>
              <dd>{{ people.name }}</dd>
            </dl>
            <a @click="addPerson"><img src="../../../../assets/button/type-add.png" alt=""/></a>
          </div>
        </div>
        <div class="check-equip">
          <h3>巡检设备</h3>
          <div class="ck-list">
            <span v-for="(equip, index) in selectedEquip" :data-key="index" :key="equip.id">{{
              equip.deviceName
            }}</span>
            <span @click="addEquip"><img src="../../../../assets/button/type-add.png" alt="" />添加</span>
          </div>
        </div>
      </div>
    </template>
    <DeleteModal
      :data="currentNode"
      :display-key="delDisplayKey"
      :visible="visibleDel"
      @reset="resetDelModal"
      @submit="deleteSubmit"
    ></DeleteModal>
    <Person
      v-if="visibleSend"
      :playId="playId"
      :visible="visibleSend"
      @selected="onSelectPerson"
      @reset="resetPersonModal"
    ></Person>
    <Zoomdialog
      :playId="playId"
      v-if="visibleSendEquip"
      :visible="visibleSendEquip"
      @selected="onSelectEquip"
      @reset="resetEquipModal"
    ></Zoomdialog>
  </TreeContent>
</template>

<script>
import TreeContent from '@/components/layout/TreeContent.vue';
import CircleButton from '@/components/button/CircleButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';
import ImageButton from '@/components/button/ImageButton.vue';
import DeleteModal from '@/components/modal/DelModal.vue';
import WeekList from './week/week.vue';
import Person from './dialog/Person';
import Zoomdialog from './dialog/zoomEquip';
// import AuthTree from '@/components/tree/auth/AuthTree.vue';
import moment from 'moment'; // 时间
import ButtonImage from '@/constants/ButtonImage';
import { generateUrlParams } from '@/utils';
import {
  inspectPlanPage,
  startupPlan,
  shutdownPlan,
  inspectPlandel,
  inspectPlanListAdd,
  inspectPlanListUpdate,
  queryRuleByDevice
} from '@/api/order';
import { mapGetters } from 'vuex';

export default {
  name: 'org',
  components: {
    Zoomdialog,
    Person,
    DeleteModal,
    // AuthTree,
    CircleButton,
    PrimaryButton,
    ImageButton,
    // ListPage,
    TreeContent,
    WeekList
  },
  computed: {
    // allCheckboxClass() {
    //   return this.getAllCheckboxClass();
    // },
    ...mapGetters(['GlobalActionType']),
    isViews() {
      return this.actionType === this.$$ActionType.views;
    },
    isAdd() {
      return this.actionType === this.$$ActionType.add;
    },
    isEdit() {
      return this.actionType === this.$$ActionType.edit;
    }
  },
  data() {
    return {
      playId: '',
      visibleSend: false,
      visibleSendEquip: false,
      editForm: {
        playName: '',
        editPlayType: '',
        timeS: '',
        timeE: ''
      },
      addForm: {
        playName: '',
        addPlayType: '',
        timeS: '',
        timeE: ''
      },
      form: {
        playName: ''
      },
      currentNode: {}, // 当前选中的树节点
      allCheckboxClass: '',
      currentIndex: 0,
      searchName: '',
      ckType: '',
      actionType: 'views',
      ButtonImage,
      roleList: [],
      elements: [],
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
      deleteSubmit: () => {}, // Function
      primaryKey: 'authCode',
      delDisplayKey: 'name',
      visibleDel: false,
      list: [
        { check: false, label: '周一' },
        { check: false, label: '周二' },
        { check: false, label: '周三' },
        { check: false, label: '周四' },
        { check: false, label: '周五' },
        { check: false, label: '周六' },
        { check: false, label: '周日' }
      ],
      listAdd: [
        { check: false, label: '周一' },
        { check: false, label: '周二' },
        { check: false, label: '周三' },
        { check: false, label: '周四' },
        { check: false, label: '周五' },
        { check: false, label: '周六' },
        { check: false, label: '周日' }
      ],
      listEdit: [
        { check: false, label: '周一' },
        { check: false, label: '周二' },
        { check: false, label: '周三' },
        { check: false, label: '周四' },
        { check: false, label: '周五' },
        { check: false, label: '周六' },
        { check: false, label: '周日' }
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
      userIdList: [],
      filterUseId: [],
      selectUserId: [],
      equipList: [],
      isNumber: false,
      selectedEquip: [],
      equipRule: [],
      ruleId: [],
      inspectRuleList: [],
      inspectPlanDeviceList: []
    };
  },
  watch: {
    actionType() {
      this.setElements();
    }
  },
  created() {
    this.setElements();
  },
  methods: {
    handlechangEndTime(val) {
      const date1 = moment(this.addForm.timeE, 'hh:mm');
      const date2 = moment(this.addForm.timeS, 'hh:mm');
      const date3 = date1.diff(date2, 'minute'); // 计算相差的分钟数
      if (date3 <= 0) {
        return this.$message.error('预计完成时间应大于巡检时间');
      }
    },
    handlechangStartTime() {
      const date1 = moment(this.addForm.timeE, 'hh:mm');
      const date2 = moment(this.addForm.timeS, 'hh:mm');
      const date3 = date1.diff(date2, 'minute'); // 计算相差的分钟数
      if (date3 <= 0) {
        return this.$message.error('巡检时间不应大于预计完成时间');
      }
    },
    handlEditStartTime() {
      const date1 = moment(this.editForm.timeE, 'hh:mm');
      const date2 = moment(this.editForm.timeS, 'hh:mm');
      const date3 = date1.diff(date2, 'minute'); // 计算相差的分钟数
      if (date3 <= 0) {
        return this.$message.error('巡检时间不应大于预计完成时间');
      }
    },
    handlEditEndTime() {
      const date1 = moment(this.editForm.timeE, 'hh:mm');
      const date2 = moment(this.editForm.timeS, 'hh:mm');
      const date3 = date1.diff(date2, 'minute'); // 计算相差的分钟数
      if (date3 <= 0) {
        return this.$message.error('预计完成时间应大于巡检时间');
      }
    },
    queryRuleByDeviceList(list) {
      // this.equipRule
      const params = {
        deviceList: []
      };
      const devId = list.map(item => ({
        deviceCategoryId: item.deviceCategoryId,
        deviceTypeId: item.deviceTypeId
      }));
      params.deviceList = devId;
      console.log(devId);
      queryRuleByDevice(params).then(res => {
        const { message, code, object } = res;
        if (code === 200) {
          this.equipRule = object;
          this.inspectRuleList = object;
        } else {
          console.log(message);
        }
      });
    },
    searchInit() {
      this.size = 0;
      this.loadMore();
    },
    handelChangeType(val) {
      this.ckType = val;
      this.size = 0;
      this.loadMore();
    },
    handleSearch(val) {
      this.size = 0;
      // this.searchName = val;
      this.loadMore();
    },
    handCheckIsNumber(val) {
      console.log(val);
      if (val === 'AUTO') {
        this.isNumber = true;
      } else {
        this.isNumber = false;
      }
    },
    addPerson() {
      if (this.actionType === 'add') {
        this.playId = '';
        this.visibleSend = true;
      } else {
        this.playId = this.currentNode.id;
        this.visibleSend = true;
      }
    },
    addEquip() {
      if (this.actionType === 'add') {
        this.playId = '';
        this.visibleSendEquip = true;
      } else {
        this.playId = this.currentNode.id;
        this.visibleSendEquip = true;
      }
    },
    onSelectPerson(list) {
      if (!Array.isArray(list)) return;
      const tempList = list.map(val => val);
      const cur = this.currentNode;
      this.selectUserId = tempList;
      if (cur.length > 0) {
        this.userIdList = tempList.filter(val => {
          // 将选择人员以后筛选掉原有的人员
          const idList = cur.inspectStaffList.map(v => v.id);
          return !idList.includes(val.id);
        });
      } else {
        this.userIdList = tempList;
      }

      // this.send();
      this.visibleSend = false;
    },
    onSelectEquip(list) {
      if (!Array.isArray(list)) return;
      this.visibleSendEquip = false;
      this.selectedEquip = list;
      this.inspectPlanDeviceList = list;
      switch (this.actionType) {
        case this.$$ActionType.add:
          this.queryRuleByDeviceList(this.selectedEquip);
          break;
        case this.$$ActionType.edit:
          this.queryRuleByDeviceList(this.inspectPlanDeviceList);
          break;
      }
    },
    resetPersonModal() {
      this.visibleSend = false;
    },
    resetEquipModal() {
      this.visibleSendEquip = false;
    },
    weekChecked(idx) {
      var check = this.listAdd[idx].check;
      this.listAdd[idx].check = check !== true;
    },
    weekCheckedEdit(idx) {
      var check = this.listEdit[idx].check;
      this.listEdit[idx].check = check !== true;
    },
    async loadMore() {
      if (this.total < this.size) return;
      const val = this.searchName.replace(/(^\s+)|(\s+$)/g, '');
      this.searchValue = val;
      this.loaded = true;
      this.size += 50;
      this.$$ALoading.show();
      const params = {
        size: this.size
      };
      const data = {};
      if (val) data.planName = val;
      //  this.ckType
      if (this.ckType) data.inspectType = this.ckType;
      const query = generateUrlParams('', params);
      const res = await inspectPlanPage(query, data);
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
      this.onSelect(this.currentIndex);
    },

    // button
    addRole() {
      this.isNumber = false;
      this.resetFormData();
      this.currentNode = [];
      this.actionType = this.$$ActionType.add;
      this.userIdList = [];
      this.selectedEquip = [];
      this.equipRule = [];
      sessionStorage.removeItem('equSelected');
      this.$store.dispatch('SetGlobalActionType', this.actionType);
    },
    save() {
      sessionStorage.removeItem('equSelected');
      switch (this.actionType) {
        case this.$$ActionType.add:
          this.addPlayCheck();
          break;
        case this.$$ActionType.edit:
          this.editPlay();
          break;
      }
    },
    editPlay() {
      console.log(this.userIdList);
      console.log(this.inspectRuleList);
      console.log(this.inspectPlanDeviceList);
      const repeatTimeConf = this.listEdit.map(val => val.check);
      const checkFalg = this.listEdit.filter(item => {
        return item.check === true;
      });
      // 人员列表id
      const inspectPlanStaffList = this.userIdList.map(item => ({
        staffId: item.staffId
      }));
      // 规则id
      const inspectPlanRuleList = this.inspectRuleList.map(item => ({
        ruleId: item.id
      }));
      var params = {
        inspectPlanDeviceList: this.inspectPlanDeviceList
      };
      params.id = this.currentNode.id; // 巡检id
      params.planName = this.editForm.playName; // 巡检名称
      params.inspectType = this.editForm.editPlayType; // 巡检类型
      params.startTime = this.editForm.timeS; // 巡检时间
      params.repeatTimeConf = repeatTimeConf; // 重复日期
      params.expectEndTime = this.editForm.timeE; // 预计完成时间
      params.inspectPlanStaffList = inspectPlanStaffList; // 人员列表id
      params.inspectPlanRuleList = inspectPlanRuleList;
      if (this.isNumber) {
        // 数字巡检
        if (params.planName === '') {
          return this.$message.error('请输入巡检名称');
        }
        // else {
        //   if (params.planName.length > 20) {
        //     return this.$message.error('巡检名称字符超过20');
        //   }
        // }
        if (params.inspectType === '') {
          return this.$message.error('请选择巡检类型');
        }
        if (!params.startTime) {
          return this.$message.error('请选择巡检时间');
        }
        if (checkFalg.length <= 0) {
          return this.$message.error('请选择重复日期');
        }
        if (params.inspectPlanDeviceList.length <= 0) {
          return this.$message.error('请添加巡检设备');
        }
        this.inspectPlanUpdate(params);
      } else {
        if (params.planName === '') {
          return this.$message.error('请输入巡检名称');
        }
        // else {
        //   if (params.planName.length > 20) {
        //     return this.$message.error('巡检名称字符超过20');
        //   }
        // }
        if (params.inspectType === '') {
          return this.$message.error('请选择巡检类型');
        }
        if (!params.startTime) {
          return this.$message.error('请选择巡检时间');
        }
        if (!params.expectEndTime) {
          return this.$message.error('请选择预计完成时间');
        }
        const date1 = moment(params.expectEndTime, 'hh:mm');
        const date2 = moment(params.startTime, 'hh:mm');
        const date3 = date1.diff(date2, 'minute'); // 计算相差的分钟数
        if (date3 <= 0) {
          return this.$message.error('预计完成时间应大于巡检时间');
        }
        if (checkFalg.length <= 0) {
          return this.$message.error('请选择重复日期');
        }
        if (params.inspectPlanStaffList.length <= 0) {
          return this.$message.error('请添加巡检人员');
        }
        if (params.inspectPlanDeviceList.length <= 0) {
          return this.$message.error('请添加巡检设备');
        }
        this.inspectPlanUpdate(params);
      }
    },
    inspectPlanUpdate(params) {
      this.$$ALoading.show();
      inspectPlanListUpdate(params)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success('编辑成功');
          } else {
            this.$message.error(message || '编辑失败');
          }
        })
        .finally(() => {
          this.$$ALoading.close();
          this.size = 0;
          this.currentIndex = 0;
          this.loadMore();
        });
    },
    addPlayCheck() {
      const repeatTimeConf = this.listAdd.map(val => val.check);
      // 人员列表id
      const checkFalg = this.listAdd.filter(item => {
        return item.check === true;
      });
      const inspectPlanStaffList = this.selectUserId.map(item => ({
        staffId: item.staffId
      }));
      // 规则id
      const inspectPlanRuleList = this.equipRule.map(item => ({
        ruleId: item.id
      }));
      var params = {
        inspectPlanDeviceList: this.selectedEquip || []
      };
      params.id = this.currentNode.id; // 巡检id
      params.planName = this.addForm.playName; // 巡检名称
      params.inspectType = this.addForm.addPlayType; // 巡检类型
      params.startTime = this.addForm.timeS; // 巡检时间
      params.repeatTimeConf = repeatTimeConf; // 重复日期
      params.expectEndTime = this.addForm.timeE; // 预计完成时间
      params.inspectPlanStaffList = inspectPlanStaffList; // 人员列表id
      params.inspectPlanRuleList = inspectPlanRuleList;
      if (this.isNumber) {
        // 数字巡检
        if (params.planName === '') {
          return this.$message.error('请输入巡检名称');
        }
        if (params.inspectType === '') {
          return this.$message.error('请选择巡检类型');
        }
        if (!params.startTime) {
          return this.$message.error('请选择巡检时间');
        }
        if (checkFalg.length <= 0) {
          return this.$message.error('请选择重复日期');
        }
        if (params.inspectPlanDeviceList.length <= 0) {
          return this.$message.error('请添加巡检设备');
        }
        this.inspectPlanAdd(params);
      } else {
        if (params.planName === '') {
          return this.$message.error('请输入巡检名称');
        }
        if (params.inspectType === '') {
          return this.$message.error('请选择巡检类型');
        }
        if (!params.startTime) {
          return this.$message.error('请选择巡检时间');
        }
        if (!params.expectEndTime) {
          return this.$message.error('请选择预计完成时间');
        }
        const date1 = moment(params.expectEndTime, 'hh:mm');
        const date2 = moment(params.startTime, 'hh:mm');
        const date3 = date1.diff(date2, 'minute'); // 计算相差的分钟数
        if (date3 <= 0) {
          return this.$message.error('预计完成时间应大于巡检时间');
        }
        if (checkFalg.length <= 0) {
          return this.$message.error('请选择重复日期');
        }
        if (params.inspectPlanStaffList.length <= 0) {
          return this.$message.error('请添加巡检人员');
        }
        if (params.inspectPlanDeviceList.length <= 0) {
          return this.$message.error('请添加巡检设备');
        }
        this.inspectPlanAdd(params);
      }
    },
    inspectPlanAdd(params) {
      this.$$ALoading.show();
      inspectPlanListAdd(params)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '添加成功');
          } else {
            this.$message.error(message || '添加失败');
          }
        })
        .finally(() => {
          this.$$ALoading.close();
          this.roleList = [];
          this.actionType = this.$$ActionType.views;
          this.size = 0;
          this.currentIndex = 0;
          this.loadMore();
        });
    },
    resetDelModal() {
      this.visibleDel = false;
      this.deleteSubmit = () => {};
    },
    delRole() {
      if (!this.currentNode) {
        this.$message.info('数据不完整');
        return;
      }
      if (!this.currentNode.id) {
        this.$message.info('数据不完整');
        return;
      }
      inspectPlandel(this.currentNode.id)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            this.$message.success(message || '删除成功');
          } else {
            this.$message.error(message || '删除失败');
          }
        })
        .finally(() => {
          this.visibleDel = false;
          this.roleList = [];
          this.currentNode = {};
          this.size = 0;
          this.currentIndex = 0;
          this.loadMore();
        });
    },
    setElements() {
      this.elements = [
        {
          label: '角色名称',
          placeholder: '请输入角色名称',
          prop: 'name',
          type: this.$$FormItem.Input,
          labelPosition: 'top',
          style: `width: 320px`,
          disabled: this.isViews
        },
        {
          label: '描述',
          prop: 'desc',
          type: this.$$FormItem.Textarea,
          placeholder: '请输入描述',
          labelPosition: 'top',
          resize: 'none',
          disabled: this.isViews
        }
      ];
    },
    // select node
    enabled(data) {
      // 巡检开启关闭
      if (data.opened) {
        // 巡检关闭
        shutdownPlan({ planId: data.id })
          .then(res => {
            this.roleList = [];
            const { code, message } = res;
            console.log(message);
            if (code === 200) {
              this.$message.success('关闭成功');
            } else {
              this.$message.error(message || '关闭失败');
            }
          })
          .finally(() => {
            this.size = 0;
            this.currentIndex = 0;
            this.loadMore();
          });
      } else {
        startupPlan({ planId: data.id })
          .then(res => {
            // 巡检开启
            this.roleList = [];
            const { code, message } = res;
            console.log(message);
            if (code === 200) {
              this.$message.success('开启成功');
            } else {
              this.$message.error(message || '开启失败');
            }
          })
          .finally(() => {
            this.size = 0;
            this.currentIndex = 0;
            this.loadMore();
          });
      }
    },
    resetFormData() {
      this.addForm.playName = '';
      this.addForm.addPlayType = '';
      this.addForm.timeS = '';
      this.addForm.timeE = '';
      this.userIdList = [];
      this.listAdd = [
        { check: false, label: '周一' },
        { check: false, label: '周二' },
        { check: false, label: '周三' },
        { check: false, label: '周四' },
        { check: false, label: '周五' },
        { check: false, label: '周六' },
        { check: false, label: '周日' }
      ];
    },
    setFormData() {
      this.formData.name = this.currentNode.name;
      this.formData.desc = this.currentNode.desc;
    },
    edit(data) {
      if (data.inspectType === 'AUTO') {
        this.isNumber = true;
      } else {
        this.isNumber = false;
      }
      this.currentNode = data;
      for (let j = 0; j < this.currentNode.repeatTimeConf.length - 1; j++) {
        const it = this.currentNode.repeatTimeConf[j];
        if (it === true) {
          this.listEdit[j].check = true;
        } else {
          this.listEdit[j].check = false;
        }
      }
      this.userIdList = this.currentNode.inspectStaffList;
      this.inspectRuleList = this.currentNode.inspectRuleList;
      this.inspectPlanDeviceList = this.currentNode.inspectPlanDeviceList;
      this.editForm.editPlayType = this.currentNode.inspectType;
      this.editForm.playName = this.currentNode.planName;
      this.editForm.timeE = this.currentNode.expectEndTime;
      this.editForm.timeS = this.currentNode.startTime;
      this.actionType = this.$$ActionType.edit;
      this.$store.dispatch('SetGlobalActionType', this.actionType);
      this.formData.name = this.currentNode.name;
      this.formData.desc = this.currentNode.desc;
    },
    del(data) {
      this.currentNode = data;
      this.visibleDel = true;
      this.deleteSubmit = this.delRole;
    },
    onSelect(index, item, event) {
      this.currentIndex = index;
      this.userIdList = [];
      sessionStorage.removeItem('selected');
      sessionStorage.removeItem('spanIndex');
      sessionStorage.removeItem('equSelected');
      if (!item) item = this.roleList[index || 0];
      for (let i = 0; i < this.roleList.length; i++) {
        const d = this.roleList[i];
        if (d.id !== item.id) {
          this.$set(d, 'selected', false);
        }
      }
      item.selected = true;
      this.currentNode = item;
      if (this.currentNode.inspectType === 'AUTO') {
        this.isNumber = true;
      } else {
        this.isNumber = false;
      }
      // if (item) {
      //   this.currentNode.inspectStaffList = item.inspectStaffList;
      // }
      for (let j = 0; j < this.currentNode.repeatTimeConf.length - 1; j++) {
        const it = this.currentNode.repeatTimeConf[j];
        if (it === true) {
          this.list[j].check = true;
        } else {
          this.list[j].check = false;
        }
      }
      const { target } = event || {};
      const { dataset } = target || {};
      switch ((dataset || {}).id) {
        case 'enabled':
          this.enabled(item);
          this.actionType = this.$$ActionType.views;
          this.setFormData();
          break;
        case 'edit':
          this.edit(item);
          this.actionType = this.$$ActionType.edit;
          break;
        default:
          this.actionType = this.$$ActionType.views;
          this.setFormData();
      }
      this.$store.dispatch('SetGlobalActionType', this.actionType);
    }
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
.list-wrapper-play {
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
  .selected {
    background-color: #fff !important ;
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

.play-detail-edit,
.play-detail-add {
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
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #3045b1;
        display: table;
        margin: 0 auto;
        text-align: left;
        padding: 25px 0;
        span {
          font-size: 14px;
          font-family: SourceHanSansCN-Medium, SourceHanSansCN;
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
  .repeatTime {
    h3 {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #0f1736;
      padding: 20px 30px;
    }
    .weekitem {
      padding: 5px 30px;
    }
  }
  .check-con {
    h3 {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #0f1736;
      padding: 20px 30px 5px 30px;
    }
    .ck-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 30px;
      span {
        padding: 9px 15px 9px 20px;
        color: #747aa5;
        font-size: 14px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        background: #f6f8fc;
        border-radius: 20px;
        text-align: center;
        line-height: 21px;
        margin-right: 20px;
        margin-top: 20px;
      }
      a {
        cursor: pointer;
        display: inline-block;
        width: 50px;
        height: 50px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0px 2px 8px -4px rgba(16, 13, 66, 0.6);
        img {
          width: 14px;
          height: 14px;
          display: inline-block;
          margin-left: 18px;
          margin-top: 18px;
        }
      }
    }
  }
  .check-equip {
    padding-bottom: 30px;
    h3 {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #0f1736;
      padding: 20px 30px 5px 30px;
    }
    .ck-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 30px;
      span {
        padding: 9px 15px 9px 20px;
        color: #747aa5;
        font-size: 14px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        background: #f6f8fc;
        border-radius: 20px;
        text-align: center;
        line-height: 21px;
        margin-right: 20px;
        margin-top: 20px;
        position: relative;
      }
      span:last-child {
        padding: 9px 25px 9px 30px;
        text-indent: 10px;
        color: #3045b1;
        cursor: pointer;
        img {
          position: absolute;
          width: 14px;
          height: 14px;
          display: inline-block;
          left: 20px;
          top: 12px;
        }
      }
    }
  }
  .ck-member {
    h3 {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #0f1736;
      padding: 20px 30px 5px 30px;
    }
    .dl-list {
      display: flex;
      flex-wrap: wrap;
      padding: 20px 30px;
      dl {
        margin-right: 20px;
        width: 55px;
        dt {
          margin-bottom: 8px;
          img {
            width: 50px;
            height: 50px;
            box-shadow: 0px 2px 8px -4px rgba(16, 13, 66, 0.6);
            border-radius: 50%;
          }
        }
        dd {
          font-size: 12px;
          font-family: SourceHanSansCN-Medium, SourceHanSansCN;
          font-weight: 500;
          color: #747aa5;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      dl:last-child {
        margin-right: 0;
      }
      a {
        cursor: pointer;
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0px 2px 8px -4px rgba(16, 13, 66, 0.6);
        img {
          width: 14px;
          height: 14px;
          display: inline-block;
          margin-left: 18px;
          margin-top: 18px;
        }
      }
    }
  }
  .add-edit-play {
    width: 670px;
    padding: 0px 30px;
  }
}
.play-detail-view {
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
        span:nth-of-type(2) {
          color: #3045b1;
          font-size: 16px;
          width: 272px;
          display: inline-block;
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
  .repeatTime {
    h3 {
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
      padding: 20px 30px;
    }
    .weekitem {
      padding: 5px 30px;
    }
  }
  .check-con {
    h3 {
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
      padding: 20px 30px 5px 30px;
    }
    .ck-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 30px;
      span {
        padding: 9px 15px 9px 20px;
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
      }
      a {
        cursor: pointer;
        display: inline-block;
        width: 50px;
        height: 50px;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: 0px 2px 8px -4px rgba(16, 13, 66, 0.6);
        img {
          width: 14px;
          height: 14px;
          display: inline-block;
          margin-left: 18px;
          margin-top: 18px;
        }
      }
    }
  }
  .check-equip {
    padding-bottom: 30px;
    h3 {
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
      padding: 20px 30px 5px 30px;
    }
    .ck-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 30px;
      span {
        padding: 9px 15px 9px 20px;
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
        position: relative;
      }
    }
  }
  .ck-member {
    h3 {
      font-size: 16px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
      padding: 20px 30px 5px 30px;
    }
    .dl-list {
      display: flex;
      flex-wrap: wrap;
      padding: 20px 30px;
      dl {
        margin-right: 20px;
        dt {
          margin-bottom: 8px;
          img {
            width: 50px;
            height: 50px;
            box-shadow: 0px 2px 8px -4px rgba(16, 13, 66, 0.6);
            border-radius: 50%;
          }
        }
        dd {
          font-size: 12px;
          font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
          font-weight: 500;
          color: #747aa5;
          text-align: center;
        }
      }
      dl:last-child {
        margin-right: 0;
      }
      a {
        cursor: pointer;
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0px 2px 8px -4px rgba(16, 13, 66, 0.6);
        img {
          width: 14px;
          height: 14px;
          display: inline-block;
          margin-left: 18px;
          margin-top: 18px;
        }
      }
    }
  }
  .add-edit-play {
    width: 670px;
    padding: 0px 30px;
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
    .search-container-play {
      width: 245px;
      .el-input-group__append {
        border-radius: 2px;
        cursor: pointer;
        background: url(../../../../assets/button/search.png) center no-repeat;
        padding: 0 20px;
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

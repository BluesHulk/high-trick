<template>
  <div class="log-wrapper common-page-wrapper">
    <div
      v-if="typeFrom == 'views' || typeFrom == 'add' || typeFrom == 'edit'"
      class="log-content scrollbar scrollbar-y scrollbar-light resource-manage"
    >
      <project-form
        :current-data="currentData"
        :type-from="typeFrom"
        :action-type="actionType"
        @submit-add="submitAdd"
      ></project-form>
    </div>
    <div v-else class="log-content scrollbar scrollbar-y scrollbar-light resource-manage">
      <div class="pr-30 pl-30 pt-30" style="overflow:hidden;">
        <div class="float-left form-select-left">
          <el-form ref="form" :model="formData" class="log-user-form" @submit.native.prevent>
            <el-form-item prop="categoryId">
              <el-select clearable v-model="formData.categoryId" placeholder="请选择项目类别">
                <el-option :key="item.id" v-for="item in categoryList" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="nameOrCode">
              <el-input
                clearable
                v-model="formData.nameOrCode"
                autocomplete="off"
                placeholder="请输入项目编号/名称"
              ></el-input>
            </el-form-item>
            <el-form-item style="position: relative">
              <el-button type="primary" class="search-button text-center" @click="search"></el-button>
              <el-button type="primary" class="search-button reset-button text-center" @click="reset"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="float-right form-select-right">
          <ActionButton @click="add" :type="$$ActionType.add">{{ $$ButtonText.plus }}</ActionButton>
        </div>
      </div>
      <div class="horizontal-line" style="margin-bottom: 30px"></div>
      <div class="pr-30 pl-30">
        <el-table
          ref="Table"
          :data="tableData.records"
          height="565"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="index" width="120" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip label="编号" prop="code"></el-table-column>
          <el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>
          <el-table-column show-overflow-tooltip label="所属类别" prop="categoryId">
            <template slot-scope="scope">{{ getCategoryName(scope.row.categoryId) }}</template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="位置" prop="positionDesc"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="80" prop="">
            <template slot-scope="scope">
              <el-tooltip popper-class="freestyle-tooltip" effect="light" placement="bottom">
                <div slot="content" class="tooltip-box">
                  <!-- <p @click="view(scope.row)" type="danger">
                    <img src="../../../assets/button/control.png" /><span>测试</span>
                  </p> -->
                  <p @click="view(scope.row)" type="danger">
                    <img src="../../../assets/button/views.png" /><span>查看</span>
                  </p>
                  <p @click="edit(scope.row)" type="danger">
                    <img src="../../../assets/button/edit-active.png" /><span>编辑</span>
                  </p>
                  <p @click="del(scope.row)" type="danger">
                    <img src="../../../assets/button/del-active.png" /><span>删除</span>
                  </p>
                </div>
                <el-button class="idoot"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <APagination
          :table-data="tableData"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
        ></APagination>
      </div>
    </div>
    <del-confirm
      v-if="delVisible"
      :del-visible="delVisible"
      :del-text="delText"
      @del-concel="delConcel"
      @del-submit="delSubmit"
    ></del-confirm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import APagination from '@/components/pagination/APagination';
import projectForm from '@/views/resource/project/projectForm';
import delConfirm from '@/views/resource/delConfirm';
import ActionButton from '@/components/button/ActionButton.vue';
import { getProjectData, projectUpdate, getCategoryQuery } from '@/api/config';

export default {
  name: 'res-project',
  components: {
    APagination,
    projectForm,
    delConfirm,
    ActionButton
  },
  computed: {
    ...mapGetters(['GlobalActionType'])
  },
  data() {
    return {
      actionType: '',
      tableData: {},
      pageSize: 10,
      pageCurrent: 1,
      multipleSelection: [],
      formData: {
        categoryId: '',
        nameOrCode: ''
      },
      categoryList: [],
      props: {
        lazy: true,
        label: 'name',
        value: 'id',
        lazyLoad: this.getQueryById
      },
      currentData: {},
      typeFrom: '',
      delVisible: false,
      delText: '',
      delObject: {}
    };
  },
  mounted() {
    this.getCategory();
    this.getProjectList(this.formData);
    localStorage.clear('device');
    localStorage.clear('asset');
    localStorage.clear('space');
    localStorage.clear('member');
  },
  methods: {
    // 类别树
    getCategory(val) {
      getCategoryQuery({ type: 'PROJECT' }).then(res => {
        if (res.code == 200) {
          this.categoryList = res.object;
        }
      });
    },
    getCategoryName(val) {
      let data = {};
      this.categoryList.find(res => {
        if (val == res.id) {
          data = res;
        }
      });
      return data.name;
    },
    getProjectList(val) {
      const data = {};
      data.current = this.pageCurrent;
      data.size = this.pageSize;
      if (val.categoryId) {
        data.categoryId = val.categoryId;
      }
      if (val.nameOrCode) {
        data.nameOrCode = val.nameOrCode;
      }
      getProjectData(data).then(res => {
        if (res.code == 200) {
          this.tableData = res.object;
        }
      });
    },
    search() {
      this.pageCurrent = 1;
      this.getProjectList(this.formData);
    },
    reset() {
      this.$refs['form'].resetFields();
      this.pageCurrent = 1;
      this.getProjectList(this.formData);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getProjectList(this.formData);
    },
    handleCurrentChange(val) {
      this.pageCurrent = val;
      this.getProjectList(this.formData);
    },
    add() {
      this.typeFrom = 'add';
      this.actionType = 'add';
    },
    view(val) {
      this.currentData = val;
      this.typeFrom = 'views';
      this.actionType = 'views';
    },
    edit(val) {
      this.currentData = val;
      this.typeFrom = 'edit';
      this.actionType = 'edit';
    },
    del(data, node) {
      this.delVisible = true;
      this.delText = data.name;
      this.delObject = data;
    },
    delConcel() {
      this.delVisible = false;
    },
    delSubmit() {
      projectUpdate({ id: this.delObject.id, deleted: true }).then(res => {
        if (res.code == 200) {
          this.$message.success('项目删除成功');
          this.getProjectList(this.formData);
          this.delVisible = false;
        } else {
          this.$message.error(res.message || '项目删除失败');
        }
      });
    },
    submitAdd() {
      this.currentData = {};
      this.typeFrom = '';
      this.getProjectList(this.formData);
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
@import '@/views/system/log/log';
@import '@/views/resource/resource';
</style>

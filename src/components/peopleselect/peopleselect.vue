<template>
  <el-dialog
    class="person-dialog-org"
    :close-on-click-modal="false"
    width="1064px"
    height="80%"
    title="选择人员"
    :visible="visible"
    :before-close="cancel"
  >
    <div class="person-tree scrollbar scrollbar-y scrollbar-light">
      <el-tree
        ref="pTree"
        highlight-current
        @node-click="nodeClick"
        :data="treeNodes"
        :props="defaultProps"
        :default-checked-keys="defaultExpendTree"
        node-key="value"
        default-expand-all
        :expand-on-click-node="false"
      >
        <div
          class="person-tree-node"
          :class="{ 'checked-node': currentNodeId === data.id }"
          slot-scope="{ node, data }"
          style="width: 100%"
        >
          <div class="person-name" v-if="data.nodes">{{ data.name }}</div>
          <div v-else class="a-toolbar-between">
            <div class="person-name">{{ data.name }}</div>
            <div
              v-if="!data.authCode"
              style="height: 30px; line-height: 30px"
              :class="{ 'unchecked-person': currentNodeId !== data.id, 'checked-person': currentNodeId === data.id }"
            >
              <!--<el-radio v-model="radio"></el-radio>-->
            </div>
          </div>
        </div>
      </el-tree>
    </div>
    <div class="person-checkbox-list scrollbar scrollbar-y scrollbar-light">
      <div class="parentNode">
        <span> {{ parentNode }} </span>
        <div class="right-checkbox">
          <el-checkbox
            :disabled="isdisable"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
        </div>
      </div>
      <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
        <!--checkList应存被选中的id -->
        <el-checkbox
          v-model="radio"
          v-for="(val, index) in records"
          :key="index"
          :label="val"
          :disabled="val.operationStaff"
        >
          {{ val.name }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="person-checkbox-list-right scrollbar scrollbar-y scrollbar-light">
      <div class="navtab">
        <span
          class="tab-li"
          :class="{ 'li-activate': navIndex === index }"
          v-for="(item, index) in tabArr"
          :key="index"
          @click="handleSelect(index, item)"
        >
          <span class="li-text">{{ item.text }}</span>
        </span>
      </div>

      <ul>
        <li v-for="(item, idx) in initAdd == 1 ? childrenCheckBox : normalList" :key="idx">
          {{ item.name }}
          <img src="../../assets/radio/delp.png" @click="delPerson(idx, item)" />
        </li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer text-right">
      <CancelButton style="margin-right: 20px" @click="cancel">{{ $$ButtonText.cancel }}</CancelButton>
      <PrimaryButton @click="submit">{{ $$ButtonText.ok }}</PrimaryButton>
    </div>
  </el-dialog>
</template>

<script>
import { operationStaffTree, operationStaffTreePeople, operationStaffListAdd } from '@/api/order';
import CancelButton from '@/components/button/CancelButton.vue';
import PrimaryButton from '@/components/button/PrimaryButton.vue';

import Message from '@/classes/Message';
import { clone } from '@/utils/utils';

// operationStaff 是否是运维人员
export default {
  name: 'person',
  components: {
    CancelButton,
    PrimaryButton
  },
  props: {
    visible: Boolean
  },
  data() {
    return {
      resultMap: {},
      initAdd: 1,
      tabArr: [
        {
          text: '负责人'
        },
        {
          text: '成员'
        }
      ],
      navIndex: 0,
      records: [],
      ischeck: false,
      radio: true,
      treeNodes: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      },
      currentNodeId: null,
      treeId: null,
      checkedMap: {},
      checkList: [],
      defaultExpendTree: [],
      clickParentId: [],
      childrenCheckBox: [], // 最右侧要显示的人员数组
      normalList: [],
      parentNode: '',
      isIndeterminate: false, // 全选
      checkAll: false,
      personTree: {},
      checkState: false,
      isdisable: false
    };
  },
  watch: {
    checkList: {
      handler(newValue, oldValue) {
        if (newValue.length > oldValue.length) {
          // 选中增加
          //   var idCheck = this.treeId.id;

          this.checkedMap = {
            idCheck: newValue
          };
          if (this.initAdd == 2) {
            this.filterMemberMap(newValue, this.childrenCheckBox);
          }
          if (this.initAdd == 1) {
            this.filterDuityMap(newValue, this.normalList);
          }
        } else if (newValue.length < oldValue.length) {
          if (this.initAdd == 1) {
            this.filterRightMap(newValue, oldValue); // 负责人筛选取消选中
          }
          if (this.initAdd == 2) {
            this.filterRightNorMap(newValue, oldValue); // 成员筛选取消选中
          }
        }
      },
      immediate: true,
      deep: false
    }
  },
  mounted() {
    this.load();
    this.$emit('init', this.$refs.pTree);
    // console.log(this.treeNodes)
  },
  methods: {
    filterRightMap(newValue, oldValue) {
      var idCheck = this.treeId.id;
      var isOrgSame = true;
      const oldValueArr = [];
      const oldValueId = [];
      const orgIdItem = [];
      const arrCheck = []; // 右侧数据的id

      this.checkedMap = {
        idCheck: newValue
      };
      this.renderTreeNode(this.treeId);
      //   const currentMap = Object.values(this.checkedMap)[0];
      // 树结构id不相等时

      // 对比新旧数据 筛选出取消选择的id
      if (newValue.length == 0 && oldValue.length == 1 && idCheck == oldValue[0].orgId) {
        oldValueArr.push(oldValue[0].id);
      } else {
        for (let i = 0; i < newValue.length; i++) {
          var item = newValue[i];
          for (let j = 0; j < oldValue.length; j++) {
            var m = oldValue[j];
            oldValueId.push(m.id);
            if (m.id === item.id) {
              oldValueArr.push(m.id);
            }
          }
        }
      }
      // 从选中右侧中的数据去除掉取消选中的名称
      if (this.childrenCheckBox.length > 0) {
        for (var i = 0; i < this.childrenCheckBox.length; i++) {
          var item = this.childrenCheckBox[i];

          arrCheck.push(item.id);
          orgIdItem.push(item.orgId);
        }
      }
      isOrgSame = orgIdItem.every(x => x === idCheck); // 判断组织结构是否一样
      if (isOrgSame) {
        const delArrIndex = arrCheck.filter(item => {
          var idList = oldValueArr.map(v => v);

          return !idList.includes(item);
        });

        console.log(delArrIndex);

        // 在这里过滤掉 不能直接splice
        if (idCheck == oldValue[0].orgId) {
          this.childrenCheckBox = this.childrenCheckBox.filter(item => {
            if (delArrIndex.length == 0 && oldValueArr.length == 1) {
              return item.id != oldValueArr[0];
            } else {
              return item.id != delArrIndex[0];
            }
          });
        }
      } else {
        var del = [];
        if (newValue.length == 0 && oldValue.length == 1) {
          del = arrCheck.filter(item => {
            const idList = oldValueArr.map(v => v);
            return idList.includes(item);
          });
        } else {
          del = oldValueId.filter(item => {
            const idList = oldValueArr.map(v => v);
            return !idList.includes(item);
          });
        }

        if (idCheck == oldValue[0].orgId) {
          this.childrenCheckBox = this.childrenCheckBox.filter(item => {
            if (del.length == 0 && oldValueArr.length == 1) {
              return item.id != oldValueArr[0];
            } else {
              return item.id != del[0];
            }
          });
        }
      }
    },
    filterRightNorMap(newValue, oldValue) {
      const idCheck = this.treeId.id;
      var isOrgSame = true;
      const oldValueArr = [];
      const oldValueId = [];
      const orgIdItem = [];
      const arrCheck = []; // 右侧数据的id

      this.checkedMap = {
        idCheck: newValue
      };
      this.renderTreeNode(this.treeId);
      //   const currentMap = Object.values(this.checkedMap)[0];
      // 树结构id不相等时

      // 对比新旧数据 筛选出取消选择的id
      if (newValue.length == 0 && oldValue.length == 1 && idCheck == oldValue[0].orgId) {
        oldValueArr.push(oldValue[0].id);
      } else {
        for (let i = 0; i < newValue.length; i++) {
          const item = newValue[i];
          for (let j = 0; j < oldValue.length; j++) {
            const m = oldValue[j];
            oldValueId.push(m.id);
            if (m.id === item.id) {
              oldValueArr.push(m.id);
            }
          }
        }
      }
      // 从选中右侧中的数据去除掉取消选中的名称
      if (this.normalList.length > 0) {
        for (var i = 0; i < this.normalList.length; i++) {
          const item = this.normalList[i];

          arrCheck.push(item.id);
          orgIdItem.push(item.orgId);
        }
        isOrgSame = orgIdItem.every(x => x === idCheck); // 判断组织结构是否一样

        if (isOrgSame) {
          const delArrIndex = arrCheck.filter(item => {
            const idList = oldValueArr.map(v => v);

            return !idList.includes(item);
          });

          console.log(delArrIndex);

          // 在这里过滤掉 不能直接splice
          if (idCheck == oldValue[0].orgId) {
            this.normalList = this.normalList.filter(item => {
              if (delArrIndex.length == 0 && oldValueArr.length == 1) {
                return item.id != oldValueArr[0];
              } else {
                return item.id != delArrIndex[0];
              }
            });
          }
        } else {
          var del = [];
          if (newValue.length == 0 && oldValue.length == 1) {
            del = arrCheck.filter(item => {
              const idList = oldValueArr.map(v => v);
              return idList.includes(item);
            });
          } else {
            del = oldValueId.filter(item => {
              const idList = oldValueArr.map(v => v);
              return !idList.includes(item);
            });
          }

          if (idCheck == oldValue[0].orgId) {
            this.normalList = this.normalList.filter(item => {
              if (del.length == 0 && oldValueArr.length == 1) {
                return item.id != oldValueArr[0];
              } else {
                return item.id != del[0];
              }
            });
          }
        }
      }
    },
    filtersArr(arr) {
      // 筛选去除有身份的
      if (arr && arr.length) {
        var temp = [];
        for (var i = 0; i < arr.length; i++) {
          if (!arr[i].operationStaff) {
            // arr[i].ischecked = true;
            temp.push(arr[i]);
          }
        }
        return temp;
      }
    },
    filterEquipe(arr) {
      var map = {};
      var dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.id]) {
          dest.push(arr[i]);
          map[ai.id] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.id == ai.id) {
              break;
            }
          }
        }
      }
      return dest;
    },
    filterSamePeople(newValue, same) {
      newValue.filter(item => {
        const idList = same.map(v => v);
        return !idList.includes(item.id);
      });
    },
    filterMemberMap(newValue, isNormal) {
      // 将负责人身份的筛选去除掉 只留下成员
      const sameArr = []; // 选中的成员身份id
      var normalArr = [];
      if (isNormal.length > 0) {
        for (let i = 0; i < newValue.length; i++) {
          const item = newValue[i];
          for (let j = 0; j < isNormal.length; j++) {
            const filNoraml = isNormal[j];
            // 操作将在右侧没有的 筛选出
            if (item.id === filNoraml.id) {
              sameArr.push(item.id);
            }
          }
        }
        normalArr = newValue.filter(item => {
          const idList = sameArr.map(v => v);
          return !idList.includes(item.id);
        });
      } else {
        for (let j = 0; j < newValue.length; j++) {
          const allItem = newValue[j];
          normalArr.push(allItem);
        }
      }
      console.log(sameArr);
      // 再循环newVlaue  将成员身份添加到普通成员身份的数组内

      this.normalList = this.filterEquipe(this.normalList.concat(normalArr, this.normalList));
    },
    filterDuityMap(newValue, isNormal) {
      // 将负责人身份的筛选去除掉 只留下成员
      const sameArr = []; // 选中的成员身份id
      var normalArr = [];
      if (isNormal.length > 0) {
        for (let i = 0; i < newValue.length; i++) {
          const item = newValue[i];
          for (let j = 0; j < isNormal.length; j++) {
            const filNoraml = isNormal[j];
            // 操作将在右侧没有的 筛选出
            if (item.id === filNoraml.id) {
              sameArr.push(item.id);
            }
          }
        }
        normalArr = newValue.filter(item => {
          const idList = sameArr.map(v => v);
          return !idList.includes(item.id);
        });
        console.log(newValue);
        console.log(isNormal);
      } else {
        for (let j = 0; j < newValue.length; j++) {
          const allItem = newValue[j];
          normalArr.push(allItem);
        }
      }
      // 再循环newVlaue  将成员身份添加到普通成员身份的数组内

      this.childrenCheckBox = this.filterEquipe(this.childrenCheckBox.concat(normalArr, this.childrenCheckBox));
    },
    handleCheckAllChange(val) {
      this.checkList = val ? this.filtersArr(this.records) : [];
      this.isIndeterminate = false;
      this.checkState = val;

      // 全选
      if (val) {
        if (this.initAdd == 1) {
          this.childrenCheckBox = this.filterEquipe(this.childrenCheckBox.concat(clone(this.checkList)));
        }
        if (this.initAdd == 2) {
          this.normalList = this.filterEquipe(this.normalList.concat(clone(this.checkList)));
        }
      } else {
        // 取消全选
        if (this.initAdd == 1) {
          const len = this.childrenCheckBox.length;
          const recordsLen = this.filtersArr(this.records).length;
          this.childrenCheckBox.splice(len - recordsLen, recordsLen);
        } else if (this.initAdd == 2) {
          const len = this.normalList.length;
          const recordsLen = this.filtersArr(this.records).length;
          this.normalList.splice(len - recordsLen, recordsLen);
        }
      }
    },
    handleCheckedChange(item) {
      const checkedCount = item.length;
      this.checkAll = checkedCount === this.filtersArr(this.records).length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.filtersArr(this.records).length;
      if (this.clickParentId.indexOf(item.orgId) == -1) {
        this.clickParentId.push(item.orgId); // 复选框的组织id
      }

      if (this.initAdd == 1) {
        //  this.childrenCheckBox = this.filterEquipe(this.childrenCheckBox.concat(this.checkList));
        this.filterDuityMap(item, this.normalList);
      }
      if (this.initAdd == 2) {
        // this.normalList = this.filterEquipe(this.normalList.concat(item,this.normalList))
        this.filterMemberMap(item, this.childrenCheckBox);
      }
    },
    handleSelect(index) {
      console.log(this.checkAll, this.isIndeterminate);
      if (index == 0) {
        this.initAdd = 1;
        // if(!this.isIndeterminate){  //如果全选中 切换选负责人身份时 禁用取消
        //   this.isdisable = false;
        // }
        this.addHaveCount(false);
        this.addNorAccount(true);
      } else {
        this.initAdd = 2;
        //  if(this.checkAll){  //如果全选中 切换选成员身份时 禁用
        //     this.isdisable = this.checkAll;

        //  }
        // 切换为成员列表时  如果 负责人身份有数据 则禁用被选中的那个checkbox
        this.addHaveCount(true);
        this.addNorAccount(false);
      }
      this.navIndex = index;
    },
    addHaveCount(flag) {
      // 添加身份字段 在禁用checkbox
      // 如果是负责人的身份
      for (let i = 0; i < this.childrenCheckBox.length; i++) {
        const item = this.childrenCheckBox[i].id;
        for (let j = 0; j < this.checkList.length; j++) {
          const ckItem = this.checkList[j].id;
          if (ckItem === item) {
            this.checkList[j].operationStaff = flag;
          }
        }
      }
    },
    addNorAccount(flag) {
      // 取消禁用 删除身份 checkbox
      for (let m = 0; m < this.normalList.length; m++) {
        const item = this.normalList[m].id;
        for (let n = 0; n < this.checkList.length; n++) {
          const ckItem = this.checkList[n].id;
          if (ckItem === item) {
            this.checkList[n].operationStaff = flag;
          }
        }
      }
    },
    delPerson(idx, item) {
      // 最右侧人员删除 复选框选中消失 人员减少
      var index;
      if (this.checkList.length > 0) {
        this.isIndeterminate = true;
        this.checkAll = false;
      }

      for (var i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i].id == item.id) {
          index = i;
        }
      }
      if (this.initAdd == 1) {
        this.childrenCheckBox.splice(idx, 1); // 负责人数组
        this.checkList.splice(index, 1);
        //  this.checkList.splice(index,1);
      }
      if (this.initAdd == 2) {
        var len = this.childrenCheckBox.length;
        this.normalList.splice(idx, 1); // 成员数组
        this.checkList.splice(idx + len, 1);
      }
      //  this.checkList.splice(index,1);
    },

    load() {
      operationStaffTree().then(res => {
        const { code, object } = res;

        if (code === 200) {
          this.treeNodes = object;
          // this.$emit('data', this.treeNodes);
          this.selectNode();
        }
      });
    },
    selectNode(node) {
      this.$nextTick(() => {
        node = node || this.treeNodes[0];
        this.$refs.pTree && this.$refs.pTree.setCurrentKey(node.value);
        this.currentNodeId = node.id;
        this.nodeClick(node);
      });
    },
    renderTreeNode(data) {
      if (data) {
        // const members = this.filtersArr(this.resultMap[data.id]);
      }
    },
    renderChecked(data) {
      // 切换树 重新全选 数据只去除当前树下的数据

      // 获取当前节点下的所有人员数据  并筛选去除有身份的数据
      const members = this.filtersArr(this.resultMap[data.id]) || [];

      // 判断是否全选
      var num = 0;
      var numl = 0; // 计数 当前树下多少与右侧数据 相同

      // 获取右侧选中数据
      const resright = [];
      for (let i = 0; i < this.childrenCheckBox.length; i++) {
        const item = this.childrenCheckBox[i];
        for (let j = 0; j < members.length; j++) {
          const m = members[j];
          if (m.id === item.id) {
            resright.push(m);
            num++;
          }
        }
      }
      // 获取左侧侧选中数据
      const resleft = [];
      for (let i = 0; i < this.normalList.length; i++) {
        const item = this.normalList[i];
        for (let j = 0; j < members.length; j++) {
          const m = members[j];
          if (m.id === item.id) {
            // m.operationStaff = true; //添加身份信息标记
            resleft.push(m);
            numl++;
          }
        }
      }
      if (num === members.length || numl === members.length) {
        this.checkAll = true;
      }
      if (numl === members.length) {
        this.initAdd = 2;
        this.navIndex = 1;
      } else {
        this.initAdd = 1;
        this.navIndex = 0;
      }
      this.checkList = resright.concat(resleft);
    },
    async nodeClick(data) {
      this.radio = '';
      // console.log(data);
      // this.isIndeterminate = false;
      this.isIndeterminate = false;
      this.checkAll = false;
      this.parentNode = data.name;
      this.navIndex = 0;
      this.initAdd = 1;
      this.currentNodeId = data.id;
      this.treeId = data;
      if (Object.keys(data).includes('operationStaff')) return;
      this.$$ALoading.show();
      const result = await operationStaffTreePeople({
        orgId: data.id
      });
      this.$$ALoading.close();
      const { code, object } = result;
      if (code === 200 && object) {
        this.records = object.records || [];
        this.resultMap[data.id] = object.records;
      }
      this.renderChecked(data);
      this.renderTreeNode(data);
    },
    submit() {
      if (this.childrenCheckBox.length || this.normalList.length) {
        console.log(this.childrenCheckBox);
        console.log(this.normalList);

        const mangerList = this.childrenCheckBox.map(item => ({
          staffId: item.id,
          name: item.name,
          phone: item.phone,
          duty: 'MANAGER',
          orgId: item.orgId
        }));
        const memberList = this.normalList.map(item => ({
          staffId: item.id,
          name: item.name,
          phone: item.phone,
          duty: 'MEMBER',
          orgId: item.orgId
        }));
        const addMember = mangerList.concat(memberList);
        operationStaffListAdd({
          operationStaffList: addMember
        })
          .then(res => {
            const { code, message } = res;
            if (code === 200) {
              this.$message.success(message || '添加成功');
              this.$emit('selected', 'succsess');
            } else {
              this.$message.error(message || '添加失败');
            }
          })
          .finally(() => {
            this.cancel();
          });
      } else {
        Message.info(`请选择人员`);
        return;
      }
    },
    cancel() {
      this.$emit('reset');
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';

.person-dialog-org {
  position: fixed;

  .el-dialog__body {
    display: flex;
    padding: 0;

    .person-tree {
      width: 374px;
      height: 500px;
      background-color: $--color-light;
      border-right: 1px solid rgba(210, 218, 234, 0.6);
      padding: 24px;
    }

    .person-checkbox-list {
      width: 473px;
      height: 500px;
      border-right: 1px solid rgba(210, 218, 234, 0.6);
      padding: 24px;

      .el-radio {
        margin-bottom: 20px;
      }

      .parentNode {
        padding-bottom: 25px;
        line-height: 24px;
        font-size: 16px;
      }

      .right-checkbox {
        float: right;
      }
    }

    .person-checkbox-list-right {
      width: 217px;
      height: 500px;
      padding: 24px;

      .navtab {
        .tab-li {
          padding: 5px;
          position: relative;
          cursor: pointer;
          color: #c6cada;
          font-size: 16px;

          &.li-activate {
            font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
            font-weight: 500;
            color: #0f1736;
            line-height: 24px;

            &:after {
              content: '';
              width: 20px;
              height: 3px;
              background: #3045b1;
              border-radius: 2px;
              position: absolute;
              left: 50%;
              top: 32px;
              margin-left: -10px;
            }

            // position:absolute;
          }
        }
      }

      ul {
        margin-top: 30px;
        text-align: center;
        width: 130px;

        li {
          height: 42px;
          background: #eff4ff;
          border-radius: 4px;
          line-height: 42px;
          color: #0f1736;
          font-size: 14px;
          margin-bottom: 25px;
          margin-top: 5px;
          position: relative;

          img {
            position: absolute;
            right: -5px;
            top: -5px;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .checked-person {
    width: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASBAMAAACk4JNkAAAAMFBMVEUAAAAyR7EyR7QxRbMwRLIwRrEwRbIvRbEvRbIwRbIvRLEwRbE1SbKeqNrx8vn///9P9ieOAAAAC3RSTlMAJD1DmZq/19ft8nDewtUAAABuSURBVAjXY2BgYHZfVWLAAASM2bt3794mAGRp7gaBSUCh2WDWTgEGtt0QkMBgDWVtZojevfvsuzu7d29l6N69+/7/v7t372BYvXv3+///du/ehcSqhspuh+vYgmQKwmSEbQgXILmKgTliVSvQpQDW0F2zs1A6/QAAAABJRU5ErkJggg==)
      center no-repeat;
  }

  .checked-node {
    .a-toolbar-between {
      .person-name {
        font-size: 12px;
        font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
        font-weight: 400;
        color: $-primary-color;
      }
    }
  }

  .person-name {
    height: 30px;
    line-height: 30px;
  }

  .unchecked-person {
    width: 30px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAPFBMVEUAAADV3PHV2erV3ezS2uvS2+nT2+vS2uvT2uvU2+vS2urT2urY3+3m6vTm6/Ts7/fw8vn09vv19/z2+Pz4gL0aAAAADHRSTlMAJD1DmZq/19ft8vJ3eIQkAAAAcElEQVQY022QWQ7AIAgFse7i7v3v2qppo5b5nMALPIAOFxpRCw4vTPmQS8nBKzbNZWNtgxrtNWZsah/J9jkV20JUT7Kvq6qegwxtI0gweVfZAJZdFQR3Kgf6XNT/eEEdQZxKPUS8TZXTK5QG0chZ4Q0PfhCQbkl/3wAAAABJRU5ErkJggg==)
      center no-repeat;
  }

  .el-tree-node__expand-icon {
    color: #3045b1;
  }

  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 6px 10px;
  }
}
</style>

import http from '@/utils/http';

export function orderList(query, data) {
  // 工单列表
  return http({
    url: '/maintenance/order/query/page' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function myOrderList(query, data) {
  // 我的工单列表
  return http({
    url: '/maintenance/order/query/myOrder' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function orderListDetail(id) {
  // 工单列表详情
  return http({
    url: '/maintenance/order/query/' + id,
    method: 'post',
    contentType: 'application/json'
  });
}

export function orderFinish(data) {
  // 工单结束
  return http({
    url: '/maintenance/order/finish',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function orderDelete(id) {
  // 工单删除
  return http({
    url: '/maintenance/order/delete/' + id,
    method: 'post',
    contentType: 'application/json'
  });
}

export function staffUpload(data) {
  // 图片上传
  return http({
    url: '/ability/file/upload',
    method: 'post',
    data
  });
}

export function orderAssign(data) {
  // 派单
  return http({
    url: '/maintenance/order/assign',
    method: 'post',
    data
  });
}

export function commonGetEnum(data) {
  // 查询枚举类
  return http({
    url: '/maintenance/common/getEnum',
    method: 'post',
    data
  });
}

export function queryDeviceCategory(data) {
  return http({
    url: '/maintenance/orderGenerateRule/query/queryDeviceCategory',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}
export function orderRuleList(query, data) {
  // 工单规则列表
  return http({
    url: '/maintenance/faultRule/query/page' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}
export function orderRuleListdel(id) {
  // 工单规则列表删除
  return http({
    url: '/maintenance/faultRule/delete/' + id,
    method: 'delete'
  });
}

export function orderRuleListAdd(data) {
  // 工单规则列表新增
  return http({
    url: '/maintenance/faultRule/add',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function orderRuleListupdate(data) {
  // 工单规则列表编辑
  return http({
    url: '/maintenance/faultRule/update',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function inspectRuleupdate(data) {
  // 巡检规则编辑
  return http({
    url: '/maintenance/inspectRule/update',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function inspectRuledel(id) {
  // 巡检规则删除
  return http({
    url: '/maintenance/inspectRule/delete/' + id,
    method: 'delete'
  });
}

export function inspectStaffdel(id) {
  // 巡检人员删除
  return http({
    url: '/maintenance/inspectStaff/delete/' + id,
    method: 'delete'
  });
}

export function operationStaffList(query, data) {
  // 分页查询运维人员列表
  return http({
    url: '/maintenance/operationStaff/query/page' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function inspectStaffList(query, data) {
  // 分页查询巡检人员列表
  return http({
    url: '/maintenance/inspectStaff/query/page' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function inspectRuleList(query, data) {
  // 分页查询巡检规则列表
  return http({
    url: '/maintenance/inspectRule/query/page' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function inspectRuleAdd(data) {
  // 分页查询巡检规则列表新增
  return http({
    url: '/maintenance/inspectRule/add',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function operationStaffListAdd(data) {
  // 分页查询运维人员新增
  return http({
    url: '/maintenance/operationStaff/add',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}
export function operationStaffListdel(id) {
  // 分页查询运维人员删除
  return http({
    url: '/maintenance/operationStaff/delete/' + id,
    method: 'delete'
  });
}

export function operationStaffTree(params) {
  // 运维人员下的树形结构
  return http({
    url: '/maintenance/operationStaff/query/organizationTree',
    method: 'get',
    params
  });
}

export function inspectStaffTree(params) {
  // 巡检人员下的树形结构
  return http({
    url: '/maintenance/inspectStaff/query/organizationTree',
    method: 'get',
    params
  });
}

export function inspectStaffTreePeople(params) {
  // 巡检人员下的树形结构查询人员
  return http({
    url: '/maintenance//inspectStaff/query/organizationUser',
    method: 'get',
    params
  });
}

export function inspectStaffListAdd(data) {
  // 分页查询巡检人员新增
  return http({
    url: '/maintenance/inspectStaff/add',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function operationStaffTreePeople(params) {
  // 运维人员下的树形结构查询人员
  return http({
    url: '/maintenance/operationStaff/query/organizationUser',
    method: 'get',
    params
  });
}

// category
export function getCategoryQuery(params) {
  // 查询类别类型列表
  return http({
    url: '/resource/config/category/query',
    method: 'get',
    params
  });
}

export function deviceFaultType(data) {
  // 筛选查询故障类型
  return http({
    url: '/maintenance/faultRule/query/filteredFaultType',
    method: 'post',
    data
  });
}

export function queryByType(params) {
  // 消息模板 事件 代办
  return http({
    url: '/message/template/queryByType',
    method: 'get',
    params
  });
}

export function messageConfConfig(data) {
  // 消息配置保存
  return http({
    url: '/maintenance/messageConf/config',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function messageConfQuery(data) {
  // 查询消息保存的
  return http({
    url: '/maintenance/messageConf/query',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function orderFaultList(query, data) {
  // 查询消息保存的
  return http({
    url: '/maintenance/fault/query/page' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function generateOrder(id) {
  // 工单生成
  return http({
    url: '/maintenance/fault/generateOrder/' + id,
    method: 'post',
    contentType: 'application/json'
  });
}

// export function faultDetailQuery(id) {
//     // 故障详情
//     return http({
//       url: '/maintenance/fault/query/' + id,
//       method: 'post',
//     });
//   }

export function faultFilter(id) {
  // 工单生成
  return http({
    url: '/maintenance/fault/filter/' + id,
    method: 'post',
    contentType: 'application/json'
  });
}

export function faultDetail(id) {
  // 故障详情
  return http({
    url: '/maintenance/fault/query/' + id,
    method: 'post',
    contentType: 'application/json'
  });
}

export function detailOperationStaffList(query, data) {
  // 工单详情派单  选择人员的列表
  return http({
    url: '/maintenance/order/query/operationStaff' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function queryByDeviceCategory(data) {
  // 工单详情派单  选择人员的列表
  return http({
    url: '/maintenance/orderGenerateRule/query/queryByDeviceCategory',
    method: 'post',
    data
  });
}
//

export function orderGenerateRuleAdd(data) {
  // 工单详情派单  选择人员的列表
  return http({
    url: '/maintenance/orderGenerateRule/add',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function deviceDataQuery(params) {
  // 设备的列表
  return http({
    url: '/resource/deviceData/query',
    method: 'get',
    params
  });
}

export function uploadBatch(data) {
  // 图片批量上传
  return http({
    url: '/ability/file/uploadBatch',
    method: 'post',
    data
  });
}

export function queryByCategoryId(params) {
  // 故障类型
  return http({
    url: '/resource/deviceFaultType/queryByCategoryId',
    method: 'get',
    params
  });
}

export function faultAdd(data) {
  // 故障上报
  return http({
    url: '/maintenance/fault/add',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function orderTransfer(data) {
  // 工单转单
  return http({
    url: '/maintenance/order/transfer',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function orderRespond(data) {
  // 工单接单
  return http({
    url: '/maintenance/order/respond',
    method: 'post',
    data
  });
}

export function orderComplete(data) {
  // 工单处理
  return http({
    url: '/maintenance/order/complete',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function latestFault(data) {
  // 工单 最近十条故障
  return http({
    url: '/maintenance/order/query/latestFault',
    method: 'post',
    data
  });
}

export function latestCompletedFault(data) {
  // 工单处理 最近十条修复的故障
  return http({
    url: '/maintenance/order/query/latestCompletedFault',
    method: 'post',
    data
  });
}

export function inspectPlanPage(query, data) {
  // 巡检计划分页查询
  return http({
    lazy: true,
    url: '/maintenance/inspectPlan/query/page' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function startupPlan(data) {
  // 巡检计划开启
  return http({
    url: '/maintenance/inspectPlan/startupPlan',
    method: 'post',
    data
  });
}

export function shutdownPlan(data) {
  // 巡检计划关闭
  return http({
    url: '/maintenance/inspectPlan/shutdownPlan',
    method: 'post',
    data
  });
}

export function inspectStaffListForPlan(params) {
  // 查询计划可选择的巡检人员
  return http({
    url: '/maintenance/inspectStaff/query/listForPlan',
    method: 'get',
    params
  });
}

export function inspectPlandel(id) {
  // 巡检计划列表删除
  return http({
    url: '/maintenance/inspectPlan/delete/' + id,
    method: 'delete'
  });
}

export function inspectPlanListAdd(data) {
  // 巡检计划新增
  return http({
    url: '/maintenance/inspectPlan/add',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function inspectPlanListUpdate(data) {
  // 巡检计划编辑
  return http({
    url: '/maintenance/inspectPlan/update',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function inspectReportPage(query, data) {
  // 巡检报告分页查询
  return http({
    lazy: true,
    url: '/maintenance/inspectReport/query/page' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

// 空间设备树
export function getSpaceData(params) {
  return http({
    url: '/resource/spaceData/query',
    method: 'get',
    params
  });
}

// 查询设备树下的设备
export function queryDeviceBySpace(params) {
  return http({
    url: '/maintenance/inspectPlan/query/queryDeviceBySpace',
    method: 'get',
    params
  });
}

export function inspectReportDetail(id) {
  // 查询巡检详情
  return http({
    url: '/maintenance/inspectReport/query/detail/' + id,
    method: 'post',
    contentType: 'application/json'
  });
}

export function queryRuleByDevice(data) {
  // 通过设备查询巡检规则
  return http({
    url: '/maintenance/inspectPlan/queryRuleByDevice',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

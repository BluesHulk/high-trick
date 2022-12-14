export default {
  defaultsHeadPortraitUrl: state => state.defaultsHeadPortraitUrl,
  GlobalActionType: state => state.GlobalActionType,
  modules: state => state.modules,
  menus: state => state.menus,
  topRoutes: state => state.topRoutes,
  subRoutes: state => state.subRoutes,
  subNavId: state => state.subNavId,
  sideMenu: state => state.permission.sideMenu,
  buttons: state => state.permission.buttons,
  permissionButtons: state => state.permission.permissionButtons,
  access_token: state => state.user.access_token,
  user_info: state => state.user.user_info,
  sidebar: state => state.sidebar.sidebar,
  WsMessage: state => state.message.WsMessage,
  WsMaintain: state => state.maintain.WsMaintain,
  messageCount: state => state.message.messageCount,
  DeviceCtrl: state => state.DeviceCtrl,
  DeviceMessage: state => state.DeviceCtrl.DeviceMessage,
  MonitorMessage: state => state.DeviceCtrl.MonitorMessage
};

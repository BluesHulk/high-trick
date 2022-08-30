import Vue from 'vue';

import '@silen/global/dist';
import * as utils from '@silen/utils';
import request from '@silen/http';

import moment from 'moment';
import ButtonText from '../classes/ButtonText';
import ProxyForm from '../classes/ProxyForm';
import Validator from '../classes/Validator';
import Enable from '../classes/Enable';
import ALoading from '../classes/ALoading';
import DyForm from '../classes/DyForm';
import DyCtrlForm from '../classes/DyCtrlForm';
import Online from '../classes/Online';

import FormItem from '../constants/FormItem';
import ButtonType from '../constants/ButtonType';
import PageType from '../constants/PageType';
import ActionType from '../constants/ActionType';

import * as util from '../utils';

Vue.prototype.$$util = utils;
Vue.prototype.$$moment = moment;
Vue.prototype.$$FormItem = FormItem;
Vue.prototype.$$ButtonType = ButtonType;
Vue.prototype.$$PageType = PageType;
Vue.prototype.$$ActionType = ActionType;
Vue.prototype.$$ProxyForm = ProxyForm;
Vue.prototype.$$ButtonText = ButtonText;
Vue.prototype.$$Validator = Validator;
Vue.prototype.$$Enable = Enable;
Vue.prototype.$$ALoading = ALoading;
Vue.prototype.$$DyForm = DyForm;
Vue.prototype.$$DyCtrlForm = DyCtrlForm;
Vue.prototype.$$Online = Online;

utils.extend(Vue.prototype, request, '$$');
utils.extend(Vue.prototype, util, '$$');

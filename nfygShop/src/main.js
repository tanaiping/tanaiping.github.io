import Vue from 'vue'
import axios from 'axios';
import App from './App.vue'
import {
  router
} from './router'

import VueCookies from 'vue-cookies'

import {
  Row,
  Col,
  Cell,
  CellGroup,
  Icon,
  Swipe,
  SwipeItem,
  Search,
  Switch,
  Area,
  Popup,
  Tag,
  Stepper,
  RadioGroup,
  Radio,
  Toast,
  Tab,
  Tabs,
  PullRefresh,
  ImagePreview,
  Loading,
  Lazyload
} from 'vant';

import './rem'

import 'vant/lib/index.css';
import './base.css';
import './fonts.css';

import {
  regFenToYuan,
  onlineService
} from './config/public';

Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.prototype.regFenToYuan = regFenToYuan
Vue.prototype.onlineService = onlineService

Vue.use(VueCookies)

Vue.use(Row).use(Col).use(Cell).use(CellGroup).use(Icon).use(Swipe).use(SwipeItem).use(Search).use(Switch).use(Area).use(Popup).use(Tag).use(Stepper).use(RadioGroup).use(Radio).use(Toast).use(Tab).use(Tabs).use(PullRefresh).use(ImagePreview).use(Loading).use(Lazyload);

new Vue({
  router,
  el: '#app',
  render: h => h(App)
})

// const name = "shopUserInfo"
// const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
// const arr = document.cookie.match(reg)
// // const shopUserInfo = ""
// const shopUserInfo = arr ? JSON.parse(unescape(decodeURI(arr[2]))) : ""
// window.console.log("请求客服");
// window.console.log(shopUserInfo);
// const NTKF_PARAM = {
//   siteid: "kf_9500", //企业ID，为固定值，必填
//   settingid: "kf_9500_1578019276868", //接待组ID，为固定值，必填
//   uid: "242366258138736640193622366", //用户ID，支持字母、数字、下划线。未登录可以为空，但不能给null，uid赋予的值在显示到小能客户端上
//   uname: "这个固定值昵称试一下", //未登录可以为空，但不能给null，uname赋予的值显示到小能客户端上
//   isvip: shopUserInfo ? shopUserInfo.vipType : "0", //是否为vip用户，0代表非会员，1代表会员，取值显示到小能客户端上
//   userlevel: "0", //网站自定义会员级别，0-N，可根据选择判断，取值显示到小能客户端上
//   erpparam: "erp" //erpparam为erp功能的扩展字段，可选，购买erp功能后用于erp功能集成
// }

// Vue.prototype.NTKF_PARAM = NTKF_PARAM
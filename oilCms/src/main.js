// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import axios from 'axios'  //npm i axios --save 安装插件的命令
// import echarts from 'echarts'
import * as echarts from 'echarts'

Vue.use(ElementUI)
Vue.config.productionTip = false
// 修改 el-dialog 默认点击遮照为不关闭
ElementUI.Dialog.props.closeOnClickModal.default = false

Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
//axios.defaults.baseURL = "http://192.168.3.70:5566"


import {
  regFenToYuan,
  confirm
} from './config/public';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

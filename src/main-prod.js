import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入nprogress
import NProgress from 'nprogress'
// 生产环境中不需要按需导入element-ui
// import './plugins/element.js'

import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 因为一些api只有登陆后才可以访问即，发送的请求的请求头中必须带有相应的token
// 例如这个api需要带一个Authorization的键值对
// 在request拦截器 中展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal)

  const year = dt.getFullYear()
  const month = (dt.getMonth() + '').padStart(2, '0')
  const day = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

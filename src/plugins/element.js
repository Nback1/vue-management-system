import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Aside, Main, Header, Col, Menu, Submenu, MenuItem } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// 全局挂再到vue上，这样每一个都可以使用this访问
Vue.prototype.$message = Message

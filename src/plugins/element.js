import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Aside,
  Main,
  Header,
  Row,
  Col,
  Menu,
  Submenu,
  MenuItem,
  Table,
  TableColumn,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Pagination,
  Switch,
  Tooltip
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Tooltip)
// 全局挂再到vue上，这样每一个都可以使用this访问
Vue.prototype.$message = Message

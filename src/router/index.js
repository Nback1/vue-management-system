import Vue from 'vue'
import VueRouter from 'vue-router'
// import Orders from '../views/order/Orders'
// import Reports from '../views/report/Reports'

const Reports = () => import(/* webpackChunkName: "orders_reports" */ '../views/report/Reports')

const Orders = () => import(/* webpackChunkName: "orders_reports" */ '../views/order/Orders')
// import Goods from '../views/goods/Goods'
// import Add from '../views/goods/Add'

const Goods = () => import(/* webpackChunkName: "good_add" */ '../views/goods/Goods')
const Add = () => import(/* webpackChunkName: "good_add" */ '../views/goods/Add')

// import Categories from '../views/goods/Categories'
// import Params from '../views/goods/Params'

const Categories = () => import(/* webpackChunkName: "cate_params" */ '../views/goods/Params')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../views/goods/Params')

// import Users from '../views/user/users'
// import Rights from '../views/power/Rights'
// import Roles from '../views/power/Roles'

const Users = () => import(/* webpackChunkName: "users-rights-roles" */ '../views/user/users')
const Rights = () => import(/* webpackChunkName: "users-rights-roles" */ '../views/power/Rights')
const Roles = () => import(/* webpackChunkName: "users-rights-roles" */ '../views/power/Roles')

// import Home from '../components/Home'
// import Welcome from '../views/Welcome'

const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Home')

const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../views/Welcome')

// import Login from '../views/Login'
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../views/Login')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载一个导航守卫
// to表示将要访问的路径
// form表示从哪个路径跳转而来
// next 是一个函数，表示放行
// next（）表示放行
// next（'/login'）表示强制到login页面
router.beforeEach((to, from, next) => {
  // 如果访问的是登陆页面直接放行
  if (to.path === '/login') return next()
  // 如果访问的是特殊页面则需要判断
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

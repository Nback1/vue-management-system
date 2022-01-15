import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../components/Home'
import Welcome from '../views/Welcome'
import Users from '../views/user/users'
import Rights from '../views/power/Rights'
import Roles from '../views/power/Roles'
import Categories from '../views/goods/Categories'
import Params from '../views/goods/Params'
import Goods from '../views/goods/Goods'
import Add from '../views/goods/Add'

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
      { path: '/goods/add', component: Add }
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

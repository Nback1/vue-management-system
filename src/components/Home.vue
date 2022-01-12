<template>
<!--  主体-->
  <el-container class="home_container">
<!--    头部-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="logo" />
        <span>电商后台管理系统</span>
      </div>
    </el-header>
    <el-container>
<!--      侧边栏-->
      <el-aside :width="getWidth">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false" router
          >
<!--            一级菜单-->
<!--            1.index和key的动态绑定-->
          <el-submenu :index="'/' + item.path" v-for="item in menuList" :key="item.id">
<!--              一级菜单模版区-->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
<!--              二级菜单-->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
<!--              二级菜单模版区-->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="toggle-button" :style="'width:' + getWidth" @click="toggleCollapse">&nbsp;&nbsp;&lt;&nbsp;&nbsp;</div>
      </el-aside>
<!--      内容-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      // 侧边栏功能菜单项
      menuList: [],
      // 用于展开和收起菜单项
      isCollapse: false
    }
  },
  computed: {
    getWidth () {
      return this.isCollapse ? '64px' : '200px'
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    async getMenuList () {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) this.$message.error('请求菜单列表失败' + res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    // 点击按钮将菜单折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  padding-left: 10px;
  font-size: 20px;
  align-items: center;
}
.el-header > div {
  display: flex;
}
.el-header > div > img {
  padding-top: 5px;
  height: 44px;
}
.el-header > div > span {
  padding: 15px;
}
.el-aside {
  background-color: #545c64;
}
.el-aside > .el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #ccc;
  text-align: center;
  cursor: pointer;
  position: absolute;
  bottom: 0;
}
</style>

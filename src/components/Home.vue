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
      <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-menu>
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
  name: 'home'
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

</style>

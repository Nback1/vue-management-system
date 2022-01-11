<template>
    <div class="login_container">
        <div class="login_box">
<!--      头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="logo">
            </div>
<!--          登陆表单区域-->
          <el-form label-width="80px" class="login_form">
            <el-form-item label="用户名：">
              <el-input v-model="form.name" prefix-icon="iconfont icon-user"></el-input>
            </el-form-item>
            <el-form-item label="密 码：">
              <el-input v-model="form.password" prefix-icon="iconfont icon-3702mima"></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary">登陆</el-button>
              <el-button type="info">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      form: {}
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);/* 位移使其居中*/
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;//阴影
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.btns {
  float: right;
}
.login_form {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;//盒子模型：设置border-box，为了解决超出的部分
}
</style>

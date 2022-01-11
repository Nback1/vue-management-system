<template>
    <div class="login_container">
        <div class="login_box">
<!--      头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="logo">
            </div>
<!--          登陆表单区域-->
          <el-form ref="loginFromRef" :model="loginForm" :rules="loginFormRules" label-width="80px" class="login_form">
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="loginForm.username" prefix-icon="iconfont iconuser"></el-input>
            </el-form-item>
            <el-form-item label="密 码：" prop="password">
              <el-input v-model="loginForm.password" prefix-icon="iconfont iconi-pwd" show-password></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" @click="login">登陆</el-button>
              <el-button type="info" @click="resetLoginForm">重置</el-button>
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
      // 登陆表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        // 定义用户名和密码的验证规则
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登陆表单
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFromRef.resetFields()
    },
    // 登陆
    login () {
      this.$refs.loginFromRef.validate(async (valid) => {
        // 点 击登陆按钮的校验
        // console.log(valid)
        if (!valid) return false
        // 这个意思是将data 重构为res
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('用户名或密码错误，登陆失败！')
        this.$message.success('登陆成功！')
        // 1.将token保存在sessionStorage中
        // 2.生效时间，关闭浏览器后就没有了
        window.sessionStorage.setItem('token', res.data.token)
        // 3.路由跳转
        this.$router.push('/home')
      })
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

<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
<!--      搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input  placeholder="请输入内容" v-model="queryUserInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
<!--      用户列表区-->
      <el-table
        :data="userList"
        border
        stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
<!--            修改-->
            <el-tooltip class="item" effect="dark" content="修改用户信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!--          删除-->
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-popconfirm title="确认删除此用户吗！" @confirm="deleteUserById(scope.row.id)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </el-tooltip>
            <!--          分配角色-->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryUserInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryUserInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
<!--      添加用户对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        @close="addDialogVisibleClosed"
        width="30%">
<!--        内容主体-->
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="addUserForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
<!--        内容底部-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
<!--      修改用户对话框-->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        @close="editDialogVisibleClosed">
<!--        内容主体-->
        <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
<!--        底部按钮-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    // 验证邮箱的自定义规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value) || !value) {
        return callback()
      }
      return callback(new Error('请输入合法的邮箱格式'))
    }
    // 验证手机号的自定以规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
      if (regMobile.test(value) || !value) {
        return callback()
      }
      return callback(new Error('请输入合法的手机号'))
    }
    return {
      // 查询用户列表请求的参数
      queryUserInfo: {
        query: '',
        // 当前页号
        pagenum: 1,
        // 当前页大小
        pagesize: 10
      },
      // 用户列表
      userList: [],
      total: 0,
      // 对话框是否显示
      addDialogVisible: false,
      // 添加用户的表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3～10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 15, message: '密码的长度在8～15个字符之间', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 对话框的是否显示
      editDialogVisible: false,
      // 修改用户信息的表单
      editUserForm: {},
      // 修改用户信息验证规则
      editUserFormRules: {
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      async showEditDialog (id) {
        const { data: res } = await this.$http.get(`/users/${id}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('获取用户信息失败！' + res.mets.msg)
        this.editUserForm = res.data
        this.editDialogVisible = true
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.queryUserInfo })
      if (res.meta.status !== 200) return this.$message.error('获取管理员列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听pageSize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryUserInfo.pagesize = newPageSize
      this.getUserList()
    },
    // 监听当前页(更改页码)
    handleCurrentChange (newPageNum) {
      this.queryUserInfo.pagenum = newPageNum
      // 再次请求
      this.getUserList()
    },
    // 修改用户状态
    async userStateChange (userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听隐藏对话框后清空数据，对话框被隐藏就会执行
    addDialogVisibleClosed () {
      this.$refs.addUserFormRef.resetFields()
    },
    // 添加新用户
    addUser () {
      // 1.先表单的预校验
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return false
        // 2.校验成功就可以发起请求了
        const { data: res } = await this.$http.post('/users', this.addUserForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！' + res.meta.msg)
        } else {
          this.$message.success('添加用户成功！')
          // 重新获取用户列表
          this.getUserList()
        }
        // 关闭对话框
        this.addDialogVisible = false
      })
    },
    // 监听隐藏对话框后清空数据
    editDialogVisibleClosed () {
      this.$refs.editUserFormRef.resetFields()
    },
    // 修改用户信息
    editUserInfo () {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } =
          await this.$http.put(`/users/${this.editUserForm.id}`, {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          })
        // console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('修改用户信息失败！' + res.meta.msg)
        } else {
          this.$message.success('修改用户信息成功')
        }
        // 刷新数据
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    // 删除用户
    async deleteUserById (id) {
      const { data: res } = await this.$http.delete(`/users/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败' + res.meta.msg)
      } else {
        this.$message.success('删除用户成功！')
        this.getUserList()
      }
    }
  }
}
</script>

<style scoped>
</style>

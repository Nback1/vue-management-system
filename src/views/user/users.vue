<template>
  <div>
<!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
<!--      搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input  placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
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
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
<!--          修改-->
          <el-tooltip class="item" effect="dark" content="修改用户信息" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          </el-tooltip>
<!--          删除-->
          <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </el-tooltip>
<!--          分配角色-->
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
<!--      分页-->
<!--      layout表示当前展示哪些操作和数据-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryUsersInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryUsersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    return {
      // 查询用户列表请求的参数
      queryUsersInfo: {
        query: '',
        // 当前页号
        pagenum: 1,
        // 当前页大小
        pagesize: 10
      },
      // 用户列表
      userList: [],
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('/users', { params: this.queryUsersInfo })
      if (res.meta.status !== 200) return this.$message.error('获取管理员列表失败！')
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听pageSize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryUsersInfo.pagesize = newPageSize
      this.getUserList()
    },
    // 监听当前页(更改页码)
    handleCurrentChange (newPageNum) {
      this.queryUsersInfo.pagenum = newPageNum
      // 再次请求
      this.getUserList()
    }
  }
}
</script>

<style scoped>
</style>

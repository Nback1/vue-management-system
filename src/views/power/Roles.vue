<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
<!--      添加角色-->
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
<!--      主体内容：角色列表-->
      <el-table
        :data="roleList"
        border stripe>
<!--        展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', 'vcenter', index1 === 0 ? 'bdtop' : '']"
                    v-for="(item1, index1) in scope.row.children" :key="item1.id">
<!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="dialogVisible = true;rightId = item1.id">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二级权限-->
              <el-col :span="19">
                <el-row :class="['vcenter', index2 === 0 ? '' : 'bdtop']"
                        v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable @close="dialogVisible = true;rightId = item2.id">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                            v-for="item3 in item2.children"
                            :key="item3.id" closable @close="dialogVisible = true;rightId = item3.id">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%">
              <span>确认删除此权限！</span>
              <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="removeRightsById(scope.row)">确 定</el-button>
                      </span>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--            修改-->
            <el-tooltip class="item" effect="dark" content="修改权限" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <!--          删除-->
            <el-tooltip class="item" effect="dark" content="删除权限" placement="top" :enterable="false">
              <el-popconfirm title="确认删除此角色吗！" @confirm="deleteRoleById(scope.row.id)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </el-tooltip>
            <!--          分配角色-->
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加角色" :visible.sync="addDialogVisible">
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef"
                 label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--        内容底部-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 角色列表
      roleList: [],
      // 对话框开关
      addDialogVisible: false,
      // 添加角色表单
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '请输入3～5个字符', trigger: 'blur' }
        ]
      },
      // 是否打开弹出框
      dialogVisible: false,
      // 要删除的权限id
      rightId: ''
    }
  },
  created () {
    this.getrolesList()
  },
  methods: {
    // 获取角色树
    async getrolesList () {
      const { data: res } = await this.$http.get('/roles')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.roleList = res.data
    },
    // 添加角色
    addRole () {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        const { data: res } = await this.$http.post('/roles', this.addRoleForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功！')
        this.getrolesList()
        this.addDialogVisible = false
      })
    },
    // 删除角色
    async deleteRoleById (id) {
      const { data: res } = await this.$http.delete('/roles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败' + res.meta.msg)
      this.$message.success('删除成功！')
      this.getrolesList()
    },
    // 根据id删除权限
    async removeRightsById (role) {
      // console.log(roleId, this.rightId)
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${this.rightId}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败' + res.meta.msg)
      this.$message.success('删除权限成功！')

      // 难以置信这样的方式
      role.children = res.data
      // 会导致页面的刷新
      // this.getrolesList()
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

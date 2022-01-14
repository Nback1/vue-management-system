<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
<!--    主体内容-->
    <el-card>
<!--      信息提示区-->
      <el-alert
        title="注意只允许为第三级分类设置相关参数！"
        type="warning" :closable="false" show-icon>
      </el-alert>
<!--      等级级联选择器：选择商品分类区-->
      <el-row class="params_row">
        <el-col>
          <span>选择商品分类： </span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
<!--      tabs 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
<!--        添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
<!--          添加参数按钮-->
          <el-button type="primary" size="mini"
                     :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
<!--          动态参数表格-->
          <el-table :data="manyParamsData" stripe border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                           @click="showEidtDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-popconfirm @confirm="removeParamsByid(scope.row.attr_id)"
                               title="确认删除此参数吗">
                  <el-button size="mini" type="danger" icon="el-icon-delete"
                             slot="reference">
                    删除
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
<!--        添加静态属性的面板-->
        <el-tab-pane label="静态属性" name="only">
<!--          添加属性按钮-->
          <el-button type="primary" size="mini"
                     :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!--          静态属性表格-->
          <el-table :data="onlyParamsData" stripe border>
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                           @click="showEidtDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-popconfirm @confirm="removeParamsByid(scope.row.attr_id)"
                            title="确认删除此参数吗">
                  <el-button size="mini" type="danger" icon="el-icon-delete"
                             slot="reference">
                    删除
                  </el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--    添加参数或属性的对话框-->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="30%"
      :before-close="addDialogClose">
<!--      表单-->
      <el-form :model="addForm" status-icon :rules="addFormRules"
               ref="addFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input type="text" v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--    修改参数或属性的对话框-->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="30%"
      :before-close="editDialogClose">
      <!--      表单-->
      <el-form :model="editForm" status-icon :rules="editFormRules"
               ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input type="text" v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 所有商品分类
      cateList: [],
      // 级联选择器选中的值
      selectedKeys: [],
      // 级联选择器设置
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
        // 因为只允许为设置三级分类设置参数
        // checkStrictly: true
      },
      // 当前展示的标签页
      activeName: 'many',
      // （动态 静态）参数列表
      manyParamsData: [],
      onlyParamsData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入' + this.titleText, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isBtnDisabled () {
      // if (this.selectedKeys.length !== 3) return true
      // else return false
      // 用下面一行代替上面的ifelse，记的优化代码
      return this.selectedKeys.length !== 3
    },
    cateId () {
      if (this.selectedKeys.length === 3) return this.selectedKeys[2]
      return null
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') return '动态参数'
      else return '静态属性'
    }
  },
  methods: {
    // 获取所有商品分类
    async getCateList () {
      const { data: res } = await this.$http.get('/categories', { type: 2 })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.cateList = res.data
      // console.log(res.data)
    },
    // 监听级联选择器选中的值
    // 并在这这里发起请求
    async handleChange () {
      this.getParamsById()
    },
    // 标签页点击事件
    handleTabClick () {
      this.getParamsById()
    },
    // 根据id查询属性
    async getParamsById () {
      // 如果选中的不是三级分类自动清空，这里我不理解，
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
      } else {
        // 根据所选id，获取商品的动态参数
        const { data: res } = await this.$http.get(`/categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName }
        })
        // console.log(res.data)
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！' + res.meta.msg)
        if (this.activeName === 'many') {
          this.manyParamsData = res.data
        } else {
          this.onlyParamsData = res.data
        }
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClose () {
      this.addDialogVisible = false
      this.addForm.attr_name = ''
    },
    // 添加新的参数
    addParams () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          // console.log(this.addForm)
          const { data: res } =
           await this.$http.post(`categories/${this.cateId}/attributes`, {
             attr_name: this.addForm.attr_name,
             attr_sel: this.activeName
           })
          if (res.meta.status !== 201) return this.$message.error('添加失败！' + res.meta.msg)
          this.$message.success('添加参数成功！')
          this.getParamsById()
          this.addDialogVisible = false
        }
      })
    },
    // 监听编辑对话框的关闭
    editDialogClose () {
      // 感觉不许要重置，因为每次打开对话框都会获取新的信息，
      // 但是如果请求失败就会显示之前的，所以清空一下也可以
      this.$refs.editFormRef.resetFields()
    },
    // 打开编辑对话框
    async showEidtDialog (attrId) {
      // 查询当前参数的最新信息
      this.editDialogVisible = true
      const { data: res } =
        await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
          params: {
            attr_sel: this.activeName
          }
        })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败！' + res.meta.msg)
      this.editForm = res.data
    },
    // 修改参数名称
    editParams () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel
          })
          if (res.meta.status !== 200) return this.$message.error('更新参数失败！' + res.meta.msg)
          this.$message.success('更新参数成功！')
          this.getParamsById()
          this.editDialogVisible = false
        }
      })
    },
    // 根据id删除参数
    async removeParamsByid (attrId) {
      const { data: res } =
        await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('删除参数成功！')
      this.getParamsById()
    }
  }
}
</script>

<style scoped>
.params_row {
  margin: 15px 0px;
}
</style>

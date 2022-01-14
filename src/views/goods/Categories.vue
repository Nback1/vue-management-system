<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
<!--      表格数据-->
      <tree-table :data="cateList" :columns="columns"
                  :selection-type="false" :expand-type="false"
                  :show-index="true" index-text="#"
                  :border="true" class="treeTable">
<!--        是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted"
              style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else
             style="color: lightgreen;"></i>
        </template>
<!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" type="primary">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
<!--        操作-->
        <template slot="options" slot-scope="scope">
          <el-button size="mini" type="primary" class="el-icon-edit"
                      >编辑</el-button>
          <el-button v-if="scope" size="mini" type="danger" class="el-icon-delete"
                      >删除</el-button>
        </template>
      </tree-table>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCatForm.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryCatForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
<!--    添加商品分类的对话框-->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialogVisible"
      @close="addCateDialogClose">
<!--      添加分类表单-->
      <el-form :model="addCateForm" :rules="cateRules"
               ref="addCateFormRef"
               label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
<!--        级联选择器 options绑定数据源 change-on-select:可以选择任意一级的选项-->
        <el-form-item label="父级分类">
          <el-cascader
            :options="parentCateList"
            :props="cateListProps"
            v-model="selectKeys"
            @change="parentCateChange"
            clearable filterable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return {
      // 商品分类列表
      cateList: [],
      // 商品分类列表表单 与分页进行绑定
      queryCatForm: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品总数
      total: 0,
      // table 列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'options'
        }
      ],
      // 添加分类的对话框
      addDialogVisible: false,
      // 添加商品分类表单
      addCateForm: {
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类等级默认是一级分类
        cat_level: 0
      },
      // 商品分类表单校验规则
      cateRules: {
        cat_name: [
          { required: true, message: '请输入商品分类名称', trigger: 'blur' }
        ]
      },
      // 获取全部商品列表，与cateList不一样
      parentCateList: [],
      // 商品分类的级联选择器设置
      cateListProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 获取选中的父级分类key
      selectKeys: []
    }
  },
  created () {
    this.getcateList()
  },
  methods: {
    // 获取商品分类列表
    async getcateList () {
      const { data: res } = await this.$http.get('/categories', { params: this.queryCatForm })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      this.cateList = res.data.result
      this.total = res.data.total
      // console.log(res.data.result)
    },
    // 监听当前页号
    handleCurrentChange (newPageNum) {
      this.queryCatForm.pagenum = newPageNum
      this.getcateList()
    },
    // 监听当前页大小
    handleSizeChange (newSize) {
      this.queryCatForm.pagenum = newSize
      this.getcateList()
    },
    showAddDialog () {
      // 先获取数据
      this.getParentCateList()
      // 再打开对话框
      this.addDialogVisible = true
    },
    // 添加商品分类
    addCate () {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('/categories', this.addCateForm)
          if (res.meta.status !== 201) return this.$message.error('添加商品分类失败！！！')
          this.$message.success('添加商品分类成功！')
          this.getcateList()
          this.addDialogVisible = false
        }
      })
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('/categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级分类失败！')
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 监听级联选择器的选择项
    parentCateChange () {
      // console.log(this.selectKeys)
      if (this.selectKeys.length >= 1) {
        // 父级分类id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 分类等级
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 对话框关闭之前,进行数据清空
    addCateDialogClose () {
      // 只能清空分类名称
      this.$refs.addCateFormRef.resetFields()
      // 重置表单项为默认
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      // 清空cascader
      this.selectKeys = []
    }

  }
}
</script>

<style scoped>
.treeTable {
  margin-top: 10px;
}
</style>

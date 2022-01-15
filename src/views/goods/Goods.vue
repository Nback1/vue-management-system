<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    主体内容-->
    <el-card>
<!--      搜索区-->
      <el-row :gutter="20">
        <el-col :span="10">
            <el-input v-model="queryGoodsForm.query" size="medium"
                      type="text" placeholder="请输入商品名称"
                      prefix-icon="el-icon-search" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="goAddPage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
<!--      数据展示区-->
      <el-table
        :data="goodsList"
        stripe border
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="添加时间" prop="add_time" width="120px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
<!--        通过设置固定的width，使得两个按钮在一行上-->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
<!--            修改-->
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
<!--            删除-->
            <el-popconfirm title="确认删除此商品？" @confirm="removeGoodsById(scope.row.goods_id)">
              <el-button type="danger" slot="reference" icon="el-icon-delete" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryGoodsForm.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryGoodsForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
<!--    添加商品-->
<!--    修改商品-->
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      // 获取商品列表表单
      queryGoodsForm: {
        // 搜索商品名称
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 商品列表
      goodsList: []
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } =
        await this.$http.get('/goods', { params: this.queryGoodsForm })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败' + res.meta.msg)
      // console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 跳转添加商品页面
    goAddPage () {
      this.$router.push('/goods/add')
    },
    // 根据id删除商品
    async removeGoodsById (id) {
      const { data: res } =
        await this.$http.delete(`/goods/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败！')
      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },
    // 监听页大小的改变
    handleSizeChange (newSize) {
      this.queryGoodsForm.pagesize = newSize
      this.getGoodsList()
    },
    // 监听当前页码的改变
    handleCurrentChange (newPageNum) {
      this.queryGoodsForm.pagenum = newPageNum
      this.getGoodsList()
    }
  }
}
</script>

<style scoped>

</style>

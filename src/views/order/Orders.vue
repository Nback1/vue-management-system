<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图区-->
    <el-card>
<!--      搜索search-->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入待搜索内容" class="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
<!--      数据展示-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag :type="scope.row.order_status === 0 ?
             'success' : 'danger' ">
              {{ scope.row.order_status ? '已付款' : '未付款'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit"
                     size="mini" @click="showEdit"></el-button>
          <el-button type="success" icon="el-icon-location"
                     size="mini" @click="showProgress"></el-button>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryOrdersForm.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryOrdersForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
<!--    修改订单对话框-->
    <el-dialog
      title="提示"
      :visible.sync="addressDialogVisible"
      width="50%"
      @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules"
               ref="editFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="editForm.address1"
                       ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
<!--    展示物流进度对话框-->
    <el-dialog
      title="提示"
      :visible.sync="progressDialogVisible"
      width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  name: 'Order',
  data () {
    return {
      queryOrdersForm: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      addressDialogVisible: false,
      editForm: {
        address1: [],
        address2: ''
      },
      editFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县！', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址！', trigger: 'blur' }
        ]
      },
      cityData,
      progressInfo: [],
      progressDialogVisible: false
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    search () {},
    async getOrdersList () {
      const { data: res } =
        await this.$http.get('/orders', { params: this.queryOrdersForm })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryOrdersForm.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange (newPageNum) {
      this.queryOrdersForm.pagenum = newPageNum
      this.getOrdersList()
    },
    showEdit () {
      this.addressDialogVisible = true
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
      this.editForm.address1 = []
      this.editForm.address2 = ''
    },
    async showProgress () {
      this.progressDialogVisible = true
      const { data: res } =
        await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.progressInfo = res.data
    }
  }
}
</script>

<style scoped>
.search {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>

<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图区-->
    <el-card>
<!--      警告提示区-->
      <el-alert title="添加商品信息" :closable="false" type="info" center show-icon></el-alert>
<!--      步骤条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
<!--          tabs 栏： 左侧-->
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules"
               ref="addGoodsFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'"
                 :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
<!--            渲染tag-->
            <el-form-item :label="item.attr_name"
                          v-for="item in manyParamsList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1, i) in item.attr_vals"
                             :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyParamsList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :headers="uploadHeaders"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
<!--            富文本编辑器-->
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addGoods" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
<!--      图片预览对话框-->
      <el-dialog
        title="提示"
        :visible.sync="uploadDialogVisible"
        width="50%">
        <img :src="previewPath" class="priviewImg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'Add',
  data () {
    return {
      // 激活状态(步骤条和tabs栏)
      activeIndex: 0,
      // 添加商品的表单
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 表单验证规则
      addGoodsFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称！',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格！',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量！',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量！',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类！',
            trigger: 'blur'
          }
        ]
      },
      // 商品分类列表
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyParamsList: [],
      onlyParamsList: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      uploadDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId () {
      if (this.addGoodsForm.goods_cat.length === 3) return this.addGoodsForm.goods_cat[2]
      else return null
    }
  },
  methods: {
    async getCateList () {
      const { data: res } =
        await this.$http.get('/categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败！')
      this.cateList = res.data
    },
    handleChange () {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
        this.$message.error('只能选择三级分类')
      }
    },
    beforeTabLeave (newTab, oldTab) {
      // console.log(11111)
      //  暂时不写了，因为还没想到比较合适的方法
    },
    async tabClicked () {
      if (this.activeIndex === '1') {
        const { data: res } =
          await this.$http.get(`/categories/${this.cateId}/attributes`, {
            params: {
              sel: 'many'
            }
          })
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败！' + res.meta.msg)
        this.manyParamsList = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } =
          await this.$http.get(`/categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only'
            }
          })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败！' + res.meta.msg)
        this.onlyParamsList = res.data
      }
    },
    // 处理图片预览
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.uploadDialogVisible = true
    },
    // 处理移除文件
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index =
        this.addGoodsForm.pics.findIndex(x => filePath === x)
      this.addGoodsForm.pics.splice(index, 1)
    },
    handleSuccess (res) {
      const picInfo = { pic: res.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
    },
    // 添加商品  未验证
    addGoods () {
      // 1。表单预校验
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (valid) {
          // 2。对表单进行处理
          this.manyParamsList.forEach(item => {
            const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals.join(' ') }
            this.addGoodsForm.attrs.push(newInfo)
          })
          this.onlyParamsList.forEach(item => {
            const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
            this.addGoodsForm.attrs.push(newInfo)
          })
          // 3。发送请求
          const { data: res } =
            await this.$http.post('/goods', {
              goods_name: this.addGoodsForm.goods_name,
              goods_price: this.addGoodsForm.goods_price,
              goods_weight: this.addGoodsForm.goods_weight,
              goods_number: this.addGoodsForm.goods_number,
              goods_cat: this.addGoodsForm.goods_cat.join(' '),
              pics: this.addGoodsForm.pics,
              goods_introduce: this.addGoodsForm.goods_introduce,
              attrs: this.addGoodsForm.attrs
            })
          if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
          this.$message.success('添加商品成功！')
        }
        this.$message.error('请填写相应的表单项！')
        // 应该先不急这跳转我认为
        this.$router.push('/goods')
      })
    }
  },
  components: {
    quillEditor
  }
}
</script>

<style scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.priviewImg {
  width: 100%;
}
.addGoods {
  margin-top: 15px;
}
</style>

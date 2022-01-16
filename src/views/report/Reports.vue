<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
<!--      2.为echarts准备一个具有宽高的Demo-->
      <div id="main" style="width: 700px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.引入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'Reports',
  data () {
    return {
      // 需要合并的数据
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          boundaryGap: false
        }],
        yAxis: [{
          type: 'value'
        }]
      }
    }
  },
  created () {
  },
  // 此时页面上的元素已经被渲染完毕了
  async mounted () {
    // 3。初始化echarts
    var myEcharts = echarts.init(document.getElementById('main'))
    // 4。指定图表的配置项和数据
    const { data: res } =
      await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
    // 合并数据项
    const result = _.merge(res.data, this.option)
    // 5.展示数据
    myEcharts.setOption(result)
  },
  methods: {}
}
</script>

<style scoped>

</style>

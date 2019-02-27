<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click="downloadExcel">导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="datas" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="tradeDate" label="产生日期">
      </el-table-column>
      <el-table-column prop="deposited" label="流入">
      </el-table-column>
      <el-table-column prop="expenditure" label="流出">
      </el-table-column>
      <el-table-column prop="currencyNumber" label="产生总额">
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">-->
      <!--</el-pagination>-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="nowPage"
        :page-sizes="[5, 10, 20, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="dataTotal">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { totalTransactionForYear, outTransactionForYearExcel } from '../../api/api';
export default {
  name: 'FinancialForYear',
  data()  {
    return  {
      // 返回的单元格数据
      datas: [],
      // 总数据行数
      dataTotal: 0,
      // 当前页
      nowPage: 1,
      // 页面宽度
      pageSize: 10,
      // 是否显示加载
      listLoading: false,
    }
  },
  methods:  {
    // 表格页数改变事件
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getData();
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getData();
    },
    //获取列表数据
    getData() {
      let para = {
        nowPage: this.nowPage,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      totalTransactionForYear(para).then((datas) => {
        this.listLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 总数据量
          this.dataTotal = data.dateSum;
          // 表格数据
          this.datas = data.grid;
        }else if (code === -7) {
          // 未登录或登录失效
          sessionStorage.removeItem('user');
          this.$router.push('/login');
        } else {
          this.$message({
            message: msg,
            type: 'error'
          });
        }
      });
    },
    reloadPage (){
      // 重置查询条件
      this.filters.selectType = null
      this.nowPage = 1
      this.filters.beginTime = ''
      this.filters.endTime = ''
      this.getData()
    },
    // 导出文件
    downloadExcel() {
      const form = document.createElement('form')
      form.id = 'form'
      form.name = 'form'
      document.body.appendChild(form);
      form.method = "GET";//请求方式
      form.action = outTransactionForYearExcel ;
      form.submit();
      document.body.removeChild(form);
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<style scoped>

</style>

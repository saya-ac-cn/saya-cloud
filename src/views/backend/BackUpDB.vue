<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-date-picker v-model="filters.date" @change="(value) => dataChangeHandler(value)" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"  :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="reloadPage">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="dats" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="archiveDate" label="归档日期">
      </el-table-column>
      <el-table-column prop="url" label="存放路径">
      </el-table-column>
      <el-table-column prop="createtime" label="备份时间">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-download" size="small" title="下载" @click="downloadFile(scope.$index,scope.row)" circle></el-button>
        </template>
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
import { getBackUpDBList, downloadBackUpDB } from '../../api/api';
export default {
  name: 'BackUpDB',
  data()  {
    return  {
      filters: {
        // 查询的日期
        date: [],
        beginTime:'',// 搜索表单的开始时间
        endTime:'',// 搜索表单的结束时间
      },
      downloadUrl: downloadBackUpDB,
      // 返回的单元格数据
      dats: [],
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
    // 日期控件改变事件
    dataChangeHandler(value) {
      if (JSON.stringify(value) === null || JSON.stringify(value) === 'null'){
        this.filters.beginTime = '';
        this.filters.endTime = '';
      } else {
        this.filters.beginTime = value[0];
        this.filters.endTime = value[1];
      }
      this.getData()
    },
    //获取日志列表
    getData() {
      let para = {
        nowPage: this.nowPage,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      getBackUpDBList(para).then((datas) => {
        this.listLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 总数据量
          this.dataTotal = data.dateSum;
          // 表格数据
          this.dats = data.grid;
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
      this.nowPage = 1
      this.filters.beginTime = ''
      this.filters.endTime = ''
      this.getData()
    },
    downloadFile(index, row){
      let para = {
        archiveDate: row.archiveDate
      };
      // 下载文件
      const form = document.createElement('form')
      form.id = 'form'
      form.name = 'form'
      document.body.appendChild(form);
      for(var obj in para) {
        if(para.hasOwnProperty(obj)) {
          var input = document.createElement('input');
          input.tpye='hidden';
          input.name = obj;
          input.value = para[obj];
          form.appendChild(input)
        }
      }
      form.method = "GET";//请求方式
      form.action = this.downloadUrl ;
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

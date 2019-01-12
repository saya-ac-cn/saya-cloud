<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input type="text" v-model="filters.topic" placeholder="按主题检索" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.date" @change="(value) => dataChangeHandler(value)" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"  :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getNews">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="reloadPage">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="publishNews()">发布</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="news" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="source" label="作者">
      </el-table-column>
      <el-table-column prop="topic" label="标题">
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间">
      </el-table-column>
      <el-table-column prop="updatetime" label="修改时间">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" title="编辑" @click="handleEdit(scope.row.id)" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" title="删除" @click="handleDel(scope.$index,scope.row.id)" circle></el-button>
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
import { getNewsList, deleteNews } from '../../api/api';
export default {
  name: 'GuestBook',
  data()  {
    return  {
      filters: {
        // 查询的日期
        date: [],
        beginTime:'',// 搜索表单的开始时间
        endTime:'',// 搜索表单的结束时间
        topic:'' // 主题
      },
      // 返回的单元格数据
      news: [],
      // 总数据行数
      dataTotal: 0,
      // 当前页
      nowPage: 1,
      // 页面宽度
      pageSize: 10,
      // 是否显示加载
      listLoading: false
    }
  },
  methods:  {
    // 表格页数改变事件
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getNews();
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getNews();
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
      this.getNews()
    },
    // 发布动态
    publishNews(){
      this.$router.push('/message/news/publish');
    },
    //获取动态列表
    getNews() {
      let para = {
        nowPage: this.nowPage,
        topic:this.filters.topic,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      getNewsList(para).then((datas) => {
        this.listLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 总数据量
          this.dataTotal = data.dateSum;
          // 表格数据
          this.news = data.grid;
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
      this.filters.topic = ''
      this.filters.beginTime = ''
      this.filters.endTime = ''
      this.getNews()
    },
    handleEdit (id) {
      this.$router.push({
        path:'/message/news/edit',
        query:{
          id:id
        },
      })
    },
    handleDel (index, id) {
      this.$confirm('确认删除序号为：'+ (index+1) +'的动态吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { id: id };
        deleteNews(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.getNews()
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
      }).catch(() => {

      });
    }
  },
  mounted() {
    this.getNews();
  }
}
</script>

<style scoped>

</style>

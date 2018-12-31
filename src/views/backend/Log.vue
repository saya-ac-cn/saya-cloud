<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.type" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.date" @change="(value) => dataChangeHandler(value)" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"  :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getLogs">查询</el-button>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="logs.slice((nowPage-1)*pageSize,nowPage*pageSize)" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="user" label="用户">
      </el-table-column>
      <el-table-column prop="logType.describe" label="操作详情">
      </el-table-column>
      <el-table-column prop="ip" label="IP">
      </el-table-column>
      <el-table-column prop="city" label="城市">
      </el-table-column>
      <el-table-column prop="date" label="日期">
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
import { getLogList } from '../../api/api';
export default {
  name: 'Log',
  data()  {
    return  {
      filters: {
        // 查询的日期
        date: [],
        beginTime:'',// 搜索表单的开始时间
        endTime:'',// 搜索表单的结束时间
        type: ''
      },
      // 返回的单元格数据
      logs: [],
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
      this.getLogs();
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getLogs();
    },
    // 日期控件改变事件
    dataChangeHandler(value) {
      console.log(Object.keys(value).length)
      if (value === null || value.length <= 0){
        this.filters.beginTime = '';
        this.filters.endTime = '';
      } else {
        this.filters.beginTime = value[0];
        this.filters.endTime = value[1];
      }
      console.log(value[0])
      console.log(value[1])
      console.log(this.filters)
      this.getLogs()
    },
    //获取日志列表
    getLogs() {
      let para = {
        nowPage: this.nowPage,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
      };
      this.listLoading = true;
      //NProgress.start();
      getLogList(para).then((datas) => {
        this.listLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 总数据量
          this.dataTotal = data.dateSum;
          // 表格数据
          this.logs = data.grid;
        }
        else
        {
          this.$message({
            message: '暂无日志',
            type: 'error'
          });
        }
      });
    }
  },
  mounted() {
    this.getLogs();
  }
}
</script>

<style scoped>

</style>

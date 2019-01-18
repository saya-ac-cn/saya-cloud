<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input type="text" v-model="filters.filename" placeholder="按文件名检索" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.date" @change="(value) => dataChangeHandler(value)" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"  :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getFiles">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="reloadPage">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">上传</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="files" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="filename" label="文件名">
      </el-table-column>
      <el-table-column prop="source" label="上传者">
      </el-table-column>
      <el-table-column prop="status" :formatter="formatStatus" label="状态">
      </el-table-column>
      <el-table-column prop="date" label="日期">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-download" size="small" title="下载" circle></el-button>
          <el-button type="primary" icon="el-icon-edit" size="small" title="显示&屏蔽" @click="handleEdit(scope.$index,scope.row)" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" title="删除" @click="handleDel(scope.$index,scope.row)" circle></el-button>
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
    <!--编辑界面-->
    <el-dialog title="上传壁纸" v-model="addFormVisible" :close-on-click-modal="false" :visible.sync="addFormVisible" :append-to-body="true">
      <el-form :model="addForm" label-width="80px" ref="addForm">
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="uploadUrl"
          :file-list="addForm.fileList"
          :auto-upload="false"
          :on-preview="handlePreview"
          :on-change="handleInsert"
          :on-remove="handleRemove"
          drag
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5M</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="addLoading">上传</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
import { getFileList, deleteFile, editFile, uploadFile } from '../../api/api';
export default {
  name: 'filemana',
  data()  {
    return  {
      filters: {
        // 查询的日期
        date: [],
        beginTime:'',// 搜索表单的开始时间
        endTime:'',// 搜索表单的结束时间
        filename: '' // 文件名
      },
      // 返回的单元格数据
      files: [],
      // 总数据行数
      dataTotal: 0,
      // 当前页
      nowPage: 1,
      // 页面宽度
      pageSize: 10,
      // 是否显示加载
      listLoading: false,
      uploadUrl: uploadFile,
      addLoading: false,
      addFormVisible: false,//上传界面是否显示
      //上传界面数据
      addForm: {
        fileList:[]
      }
    }
  },
  methods:  {
    // 状态显示转换
    formatStatus: function (row, column) {
      if (row.status === '1'){
        return '正常显示'
      } else if (row.status === '2') {
        return '已屏蔽'
      } else {
        return '未知'
      }
    },
    handleRemove(file, fileList) {
      // 删除文件时事件
      console.log(fileList);
    },
    handlePreview(file) {
      // 单击文件事件
      console.log(file);
    },
    handleInsert(file){
      /*
      * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用,由于此处上传是手动上传，所以只监听添加时的事件
      */
      console.log(file)
      //this.addForm.fileList.push(file)
    },
    handleAdd () {
      this.addFormVisible = true;
    },
    // 表格页数改变事件
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getFiles();
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getFiles();
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
      this.getFiles()
    },
    // select框改变事件
    selectChange(ele){
      if(ele == null ||ele == 'null') {
        this.filters.selectType = null;
      } else {
        this.filters.selectType = ele;
      }
    },
    //获取日志列表
    getFiles() {
      let para = {
        nowPage: this.nowPage,
        filename:this.filters.filename,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      getFileList(para).then((datas) => {
        this.listLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 总数据量
          this.dataTotal = data.dateSum;
          // 表格数据
          this.files = data.grid;
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
    handleEdit (index,row) {
      var message = ''
      var sendStatus = null
      if (row.status === '1')
      {
        // 屏蔽
        sendStatus = 2
        message = '您确定要屏蔽文件名为："' + row.filename + '"的文件吗？'
      } else {
        // 显示
        sendStatus = 1
        message = '您确定要显示文件名为："' + row.filename + '"的文件吗？'
      }
      this.$confirm(message, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { id: row.id, status: sendStatus };
        editFile(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
            this.getFiles()
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
    },
    handleDel (index, row) {
      this.$confirm('确认文件名为："'+ row.filename +'"的文件吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { id: row.id };
        deleteFile(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.getFiles()
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
    },
    reloadPage (){
      // 重置查询条件
      this.filters.filename = null
      this.nowPage = 1
      this.filters.beginTime = ''
      this.filters.endTime = ''
      this.getFiles()
    },
  },
  mounted() {
    this.getFiles();
  }
}
</script>

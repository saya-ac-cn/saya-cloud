<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input type="text" v-model="filters.name" placeholder="按用户名检索" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.selectType" placeholder="请选择" @change="(value) =>selectChange(value)">
            <el-option value="null" label="请选择" selected></el-option>
            <el-option
              v-for="item in filters.type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.date" @change="(value) => dataChangeHandler(value)" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"  :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getGuestBook">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="reloadPage">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="guestboot" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="phone" label="Phone">
      </el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus">
      </el-table-column>
      <el-table-column prop="source" label="回复者">
      </el-table-column>
      <el-table-column prop="createtime" label="留言时间">
      </el-table-column>
      <el-table-column prop="updatetime" label="审核时间">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" title="审核" @click="handleEdit(scope.$index,scope.row)" circle></el-button>
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
    <el-dialog title="回复留言" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" :append-to-body="true">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="editForm.phone" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="editForm.email" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="留言时间">
          <el-input type="textarea" :disabled="true" v-model="editForm.createtime"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :disabled="true" v-model="editForm.content"></el-input>
        </el-form-item>
        <el-form-item label="审核">
          <el-radio-group v-model="editForm.status" prop="status">
            <el-radio class="radio" :label="2">通过</el-radio>
            <el-radio class="radio" :label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="回复内容" prop="reply">
          <el-input type="textarea" v-model="editForm.reply"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getGuestBookList, checkGuestBook } from '../../api/api';
export default {
  name: 'GuestBook',
  data()  {
    return  {
      filters: {
        // 查询的日期
        date: [],
        beginTime:'',// 搜索表单的开始时间
        endTime:'',// 搜索表单的结束时间
        name:'', // 姓名
        type: [{value:1,label:'未审核'},{value:2,label:'已通过'},{value:3,label:'已屏蔽'}],// 系统返回的日志类别
        selectType: ''//用户选择的日志类别
      },
      editFormRules: {
        reply: [
          { required: true, message: '请输入回复内容', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择审核状态', trigger: 'blur' }
        ]
      },
      // 返回的单元格数据
      guestboot: [],
      // 总数据行数
      dataTotal: 0,
      // 当前页
      nowPage: 1,
      // 页面宽度
      pageSize: 10,
      // 是否显示加载
      listLoading: false,
      editLoading: false,
      editFormVisible: false,//编辑界面是否显示
      //编辑界面数据
      editForm: {
        id: null,
        name: '',
        phone: '',
        email: '',
        content: '',
        reply: '',
        status:null,
        createtime: ''
      }
    }
  },
  methods:  {
    // 状态显示转换
    formatStatus: function (row, column) {
      if (row.status === 1){
        return '未审核'
      } else if (row.status === 2) {
        return '已通过'
      } else if (row.status === 3) {
        return '已屏蔽'
      } else {
        return '未知'
      }
    },
    // 表格页数改变事件
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getGuestBook();
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getGuestBook();
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
      this.getGuestBook()
    },
    // select框改变事件
    selectChange(ele){
      if(ele == null ||ele == 'null') {
        this.filters.selectType = null;
      } else {
        this.filters.selectType = ele;
      }
    },
    //获取留言列表
    getGuestBook() {
      let para = {
        nowPage: this.nowPage,
        name:this.filters.name,
        status:this.filters.selectType,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      getGuestBookList(para).then((datas) => {
        this.listLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 总数据量
          this.dataTotal = data.dateSum;
          // 表格数据
          this.guestboot = data.grid;
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
      this.filters.name = ''
      this.filters.beginTime = ''
      this.filters.endTime = ''
      this.nowPage = 1
      this.filters.selectType = null
      this.getGuestBook()
    },
    handleEdit (index,row) {
      console.log(row)
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = {
              id: this.editForm.id,
              status:this.editForm.status,
              reply: this.editForm.reply
            };
            checkGuestBook(para).then((datas) => {
              this.editLoading = false;
              //NProgress.done();
              let { msg, code, data } = datas;
              if(code === 0)
              {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getGuestBook();
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
          });
        }
      });
    },
  },
  mounted() {
    this.getGuestBook();
  }
}
</script>

<style scoped>

</style>

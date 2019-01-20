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
          <el-button type="primary" v-on:click="getToteBookData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="reloadPage">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addFormVisible = true">创建</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="datas" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="name" label="笔记簿名">
      </el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus">
      </el-table-column>
      <el-table-column prop="source" label="创建者">
      </el-table-column>
      <el-table-column prop="notesCount" label="笔记总数">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" title="修改" @click="handleEdit(scope.$index,scope.row)" circle></el-button>
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
    <!--新增界面-->
    <el-dialog title="创建笔记簿" v-model="addFormVisible" :close-on-click-modal="false" :visible.sync="addFormVisible" :append-to-body="true">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="笔记簿名" prop="name">
          <el-input type="text" v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否公开">
          <el-radio-group v-model="addForm.status" prop="status">
            <el-radio class="radio" :label="1">公开</el-radio>
            <el-radio class="radio" :label="2">私有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明描述" prop="descript">
          <el-input type="textarea" v-model="addForm.descript"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="修改笔记簿" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" :append-to-body="true">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="笔记簿名" prop="name">
          <el-input type="text" v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否公开">
          <el-radio-group v-model="editForm.status" prop="status">
            <el-radio class="radio" :label="1">公开</el-radio>
            <el-radio class="radio" :label="2">私有</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明描述" prop="descript">
          <el-input type="textarea" v-model="editForm.descript"></el-input>
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
import { createNoteBook, updateNoteBook, deleteNoteBook, getNoteBookList, getNoteBook } from '../../api/api';
export default {
  name: 'NoteBook',
  data()  {
    return  {
      filters: {
        name:'', // 笔记簿名
        type: [{value:1,label:'已公开'},{value:2,label:'已屏蔽'}],
        selectType: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入笔记簿名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择公开状态', trigger: 'blur' }
        ],
        descript: [
          { required: true, message: '请输入笔记簿说明', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
      },
      editFormRules: {
        name: [
          { required: true, message: '请输入笔记簿名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择公开状态', trigger: 'blur' }
        ],
        descript: [
          { required: true, message: '请输入笔记簿说明', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
      },
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
      addLoading: false,
      addFormVisible: false,//新增界面是否显示
      //新增界面数据
      addForm: {
        name: '',
        status:1,
        descript: ''
      },
      editLoading: false,
      editFormVisible: false,//编辑界面是否显示
      //编辑界面数据
      editForm: {
        id: null,
        name: '',
        status:null,
        descript: ''
      }
    }
  },
  methods:  {
    // 状态显示转换
    formatStatus: function (row, column) {
      if (row.status === 1){
        return '已公开'
      } else if (row.status === 2) {
        return '已屏蔽'
      } else {
        return '未知'
      }
    },
    // 表格页数改变事件
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getToteBookData();
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.getToteBookData();
    },
    // select框改变事件
    selectChange(ele){
      if(ele == null ||ele == 'null') {
        this.filters.selectType = null;
      } else {
        this.filters.selectType = ele;
      }
    },
    //笔记簿
    getToteBookData() {
      let para = {
        nowPage: this.nowPage,
        name:this.filters.name,
        status:this.filters.selectType,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      getNoteBookList(para).then((datas) => {
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
      this.filters.name = ''
      this.nowPage = 1
      this.filters.selectType = null
      this.getToteBookData()
    },
    handleEdit (index,row) {
      console.log(row)
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    handleDel (index, row) {
      var tips = '';
      if (row.notesCount > 0){
        tips = '“' + row.name + '”笔记簿下还有：' + row.notesCount + '条笔记，您确认删除该笔记簿及该笔记簿下的所有笔记？'
      }else{
        tips = '您确认删除“' + row.name + '”空笔记簿？'
      }


      this.$confirm(tips, '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { id: row.id };
        deleteNoteBook(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.getToteBookData();
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
    //新增
    addSubmit () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认创建吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = {
              name: this.addForm.name,
              status:this.addForm.status,
              descript: this.addForm.descript
            };
            createNoteBook(para).then((datas) => {
              this.editLoading = false;
              //NProgress.done();
              let { msg, code, data } = datas;
              if(code === 0)
              {
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getToteBookData();
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
        }else{
          this.$message({
            message: '您的表单填写有误，请重新填写',
            type: 'error'
          });
        }
      });
    },
    //编辑
    editSubmit () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = {
              id: this.editForm.id,
              name: this.editForm.name,
              status:this.editForm.status,
              descript: this.editForm.descript
            };
            updateNoteBook(para).then((datas) => {
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
                this.getToteBookData();
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
    this.getToteBookData();
  }
}
</script>

<style scoped>

</style>

<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.selectType" placeholder="请选择" @change="(value) =>selectChange(value)">
            <el-option value="null" label="请选择" selected></el-option>
            <el-option
              v-for="item in filters.type"
              :key="item.id"
              :label="item.transactionType"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="filters.date" @change="(value) => dataChangeHandler(value)" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"  :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="transactionList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="reloadPage">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addFormVisible = true">流水申报</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="downloadListExcel">流水.xls</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="downloadInfoExcel">明细.xls</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="datas" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="tradeId" label="流水号">
      </el-table-column>
      <el-table-column prop="deposited" label="存入">
      </el-table-column>
      <el-table-column prop="expenditure" label="取出">
      </el-table-column>
      <el-table-column prop="tradeTypeEntity.transactionType" label="交易方式">
      </el-table-column>
      <el-table-column prop="currencyNumber" label="产生总额">
      </el-table-column>
      <el-table-column prop="transactionAmount" label="摘要">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-view" size="small" @click="handleView(scope.$index,scope.row)" title="详情" circle></el-button>
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.$index,scope.row)" title="编辑" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDel(scope.$index,scope.row)" title="删除" circle></el-button>
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
    <!--新增流水-->
    <el-dialog width="70%" title="流水申报" v-model="addFormVisible" :close-on-click-modal="false" :visible.sync="addFormVisible" :append-to-body="true">
      <div class="mytips" style="margin: 0px 0px 20px 0px !important">
        <p>财政申报<a href="javascript:void(0)">约定</a>：</p>
        <blockquote>
          <p>
            <i>1、同一天可以申报多次。</i>
          </p>
          <p>
            <i>2、同一笔流水申请只能对应一种支付方式。</i>
          </p>
          <p>
            <i>3、一笔流水下面必须有一条流水明细。</i>
          </p>
        </blockquote>
      </div>
      <el-form :model="addForm" label-width="80px" ref="addForm">
        <el-form-item label="交易方式" prop="tradeType">
          <el-select v-model="addForm.tradeType">
            <el-option
              v-for="item in filters.type"
              :key="item.id"
              :label="item.transactionType"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="transactionAmount">
          <el-input v-model="addForm.transactionAmount"></el-input>
        </el-form-item>
        <div v-for="(list,index) in addForm.infoList">
          <el-card class="box-card" style="margin-bottom: 10px">
            <div class="demo-input-suffix">
              流水明细 - {{ index+1 }}：
              <el-select v-model="list.flog" placeholder="出入方式" suffix-icon="el-icon-date">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input
                type="number"
                placeholder="金额"
                prefix-icon="el-icon-edit-outline"
                v-model="list.currencyNumber">
              </el-input>
              <el-input
                placeholder="说明"
                prefix-icon="el-icon-edit-outline"
                v-model="list.currencyDetails">
              </el-input>
              <el-button type="primary" @click="deleteLine(index)">删除</el-button>
            </div>
          </el-card>
        </div>
        <el-form-item>
          <el-button type="primary" @click="continueAdd">继续添加</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveApply" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="修改流水" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" :append-to-body="true">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="交易方式" prop="tradeType">
          <el-select v-model="editForm.tradeType">
            <el-option
              v-for="item in filters.type"
              :key="item.id"
              :label="item.transactionType"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="transactionAmount">
          <el-input type="textarea" v-model="editForm.transactionAmount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editTransaction" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--浏览流水子页面-->
    <el-dialog width="80%" title="流水明细" v-model="viewFormVisible" :close-on-click-modal="false" :visible.sync="viewFormVisible" :append-to-body="true">
      <el-form :inline="true" :model="addItem" class="demo-form-inline">
        <el-form-item label="出入方式">
          <el-select v-model="addItem.flog" suffix-icon="el-icon-date">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input
            type="number"
            prefix-icon="el-icon-edit-outline"
            v-model="addItem.currencyNumber">
          </el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            prefix-icon="el-icon-edit-outline"
            v-model="addItem.currencyDetails">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAddItem">确认添加</el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table :data="items" highlight-current-row v-loading="itemLoading" style="width: 100%;">
        <el-table-column prop="id" label="编号">
        </el-table-column>
        <el-table-column prop="tradeId" label="流水号">
        </el-table-column>
        <el-table-column prop="flog" :formatter="formatSex" label="出入方式">
        </el-table-column>
        <el-table-column prop="currencyNumber" label="金额">
        </el-table-column>
        <el-table-column prop="currencyDetails" label="说明">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleViewItem(scope.$index,scope.row)" size="small" title="编辑" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDeleteItem(scope.$index,scope.row)" size="small" title="删除" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <div>
        <el-pagination layout="prev, pager, next" @current-change="itemHandleCurrentChange" :page-size="10" :total="itemDataTotal">
        </el-pagination>
      </div>
      <el-form :inline="true" :model="editItem" class="demo-form-inline">
        <el-form-item label="出入方式">
          <el-select v-model="editItem.flog" suffix-icon="el-icon-date">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input
            type="number"
            prefix-icon="el-icon-edit-outline"
            v-model="editItem.currencyNumber">
          </el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            prefix-icon="el-icon-edit-outline"
            v-model="editItem.currencyDetails">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleEditItem">提交修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import { getTransactionList, getFinancialType, applyTransaction,updateTransaction,deleteTransaction,getTransactionInfo,insertTransactioninfo,updateTransactioninfo,deleteTransactioninfo,downTransaction,outTransactionInfoExcel } from '../../api/api';
export default {
  name: 'TransactionList',
  data()  {
    return  {
      filters: {
        // 查询的日期
        date: [],
        beginTime:'',// 搜索表单的开始时间
        endTime:'',// 搜索表单的结束时间
        type: [],// 系统返回的交易类别
        selectType: ''//用户选择的交易类别
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
      addFormVisible:false,
      addLoading:false,
      options: [{
        value: 1,
        label: '存入'
      }, {
        value: 2,
        label: '取出'
      }],
      // 添加界面数据
      addForm: {
        tradeType:1,
        transactionAmount:'',
        infoList:[{
          flog:2,
          currencyNumber:0,
          currencyDetails:''
        }]
      },
      editLoading: false,
      editFormVisible: false,//编辑界面是否显示
      //编辑界面数据
      editForm: {
        tradeId:1,
        tradeType:1,
        transactionAmount:'',
      },
      editFormRules: {
        transactionAmount: [
          { required: true, message: '请输入摘要', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        tradeType: [
          { required: true, message: '请选择交易方式', trigger: 'blur' }
        ]
      },
      // 是否显示流水子页面
      viewFormVisible: false,
      viewTradeId: 1,
      itemLoading: false,
      // 添加明细
      addItem:{
        tradeId:1,
        flog:2,
        currencyNumber:0,
        currencyDetails:''
      },
      // 修改明细
      editItem:{
        id:1,
        tradeId:1,
        flog:2,
        currencyNumber:0,
        currencyDetails:''
      },
      // 返回的流水单元格数据
      items: [],
      // 流水总数据行数
      itemDataTotal: 0,
      // 当前页
      itemNowPage: 1,
    }
  },
  methods:  {
    //出入转换显示转换
    formatSex: function (row, column) {
      return row.flog == 1 ? '存入' : row.flog == 2 ? '取出' : '未知';
    },
    // 表格页数改变事件
    handleCurrentChange(val) {
      this.nowPage = val;
      this.transactionList();
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.pageSize = size;
      this.transactionList();
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
      this.transactionList()
    },
    // select框改变事件
    selectChange(ele){
      if(ele == null ||ele == 'null') {
        this.filters.selectType = null;
      } else {
        this.filters.selectType = ele;
      }
    },
    //获取交易类别
    financialType() {
      getFinancialType('').then((datas) => {
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 交易类别
          this.filters.type = data;
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
    //获取流水列表
    transactionList() {
      let para = {
        nowPage: this.nowPage,
        tradeType:this.filters.selectType,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      getTransactionList(para).then((datas) => {
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
      this.transactionList()
    },
    // 导出流水
    downloadListExcel() {
      let para = {
        tradeType:this.filters.selectType,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
      };
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
      form.action = downTransaction ;
      form.submit();
      document.body.removeChild(form);
    },
    // 导出流水明细
    downloadInfoExcel() {
      let para = {
        tradeType:this.filters.selectType,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
      };
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
      form.action = outTransactionInfoExcel ;
      form.submit();
      document.body.removeChild(form);
    },
    // 继续添加财政明细
    continueAdd:function(){
      var item = {
        flog:2,
        currencyNumber:0,
        currencyDetails:''
      }
      this.addForm.infoList.push(item);
      return false;
    },
    // 删除明细添加行
    deleteLine:function(index){
      if(this.addForm.infoList.length <= 1){
        this.$message({
          message: '每一笔流水申请下边必须要有一条详情记录',
          type: 'error'
        });
      }else{
        this.addForm.infoList.splice(index,1);
        return false;
      }
    },
    // 保存申请
    saveApply(){
      // 判断流水记录是否正常
      if(this.addForm.tradeType == null || this.addForm.tradeType == ''){
        this.$message({
          message: '请选择支付方式',
          type: 'error'
        });
        return false;
      }
      if(this.addForm.transactionAmount == null || this.addForm.transactionAmount == ''){
        this.$message({
          message: '请填写摘要',
          type: 'error'
        });
        return false;
      }
      // 遍历流水子记录
      var item;//遍历专用
      var currencyNumber,flog;
      for(var i = 0;i < this.addForm.infoList.length;i++)
      {
        item = this.addForm.infoList[i];
        currencyNumber = item.currencyNumber;
        flog = parseInt(item.flog);
        if(flog == '' || item.flog < 0 || currencyNumber < 0 || currencyNumber == '' || item.currencyDetails == ''){
          this.$message({
            message: '金额必须大于等于0，必须选择出入方式,说明必须填写。',
            type: 'error'
          });
          return false;
        }
      }
      this.addLoading = true;
      // 提交申请
      applyTransaction(this.addForm).then((datas) => {
        this.addLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 刷新
          this.addForm = {
            tradeType: 1,
            transactionAmount: '',
            infoList: [{
              flog: 2,
              currencyNumber: 0,
              currencyDetails: ''
            }]
          }
          this.transactionList()
          this.$message({
            showClose: true,
            message: '申报成功',
            type: 'success'
          });
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
      console.log(row)
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    // 修改流水
    editTransaction(){
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            updateTransaction(this.editForm).then((datas) => {
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
                this.transactionList();
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
    // 删除流水
    handleDel (index, row) {
      this.$confirm("您确定删除该流水及该流水下的所有明细？", '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { tradeId: row.tradeId };
        deleteTransaction(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.transactionList();
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
    // 打开流水明细子页面
    handleView(index,row){
      this.viewTradeId = row.tradeId;
      this.addItem.tradeId = row.tradeId;
      this.transactionInfo();
      this.viewFormVisible = true;
    },
    //获取流水列表
    transactionInfo() {
      this.itemLoading = true;
      let para = {
        nowPage: this.itemNowPage,
        tradeId:this.viewTradeId
      };
      //NProgress.start();
      getTransactionInfo(para).then((datas) => {
        this.itemLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 总数据量
          this.itemDataTotal = data.dateSum;
          // 表格数据
          this.items = data.grid;
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
    // 表格页数改变事件
    itemHandleCurrentChange(val) {
      this.itemNowPage = val;
      this.transactionInfo();
    },
    // 流水明细添加
    handleAddItem(){
      // 判断所填的数据是否合法
      if(this.addItem.flog == '' || this.addItem.flog < 0 || this.addItem.currencyNumber < 0 || this.addItem.currencyNumber == '' || this.addItem.currencyDetails == ''){
        this.$message({
          message: '金额必须大于等于0，必须选择出入方式,说明必须填写。',
          type: 'error'
        });
        return false;
      }else {
        this.itemLoading = true;
        insertTransactioninfo(this.addItem).then((datas) => {
          this.itemLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            });
            this.addItem = {
              tradeId:1,
                flog:2,
                currencyNumber:0,
                currencyDetails:''
            };
            this.transactionList();
            this.transactionInfo();
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
      }
    },
    // 显示要修改的明细
    handleViewItem(index,row){
      this.editItem = Object.assign({}, row);
    },
    // 修改流水明细
    handleEditItem(){
      // 判断所填的数据是否合法
      if(this.editItem.flog == '' || this.editItem.flog < 0 || this.editItem.currencyNumber < 0 || this.editItem.currencyNumber == '' || this.editItem.currencyDetails == ''){
        this.$message({
          message: '金额必须大于等于0，必须选择出入方式,说明必须填写。',
          type: 'error'
        });
        return false;
      }else {
        this.itemLoading = true;
        updateTransactioninfo(this.editItem).then((datas) => {
          this.itemLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
            this.editItem = {
              id:1,
              tradeId:1,
              flog:2,
              currencyNumber:0,
              currencyDetails:''
            }
            this.transactionList();
            this.transactionInfo();
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
      }
    },
    // 删除流水明细
    handleDeleteItem(index, row){
      this.$confirm("您确定删除该流水明细？", '提示', {
        type: 'warning'
      }).then(() => {
        this.itemLoading = true;
        //NProgress.start();
        let para = {
          id: row.id,
          tradeId: row.tradeId
        };
        deleteTransactioninfo(para).then((datas) => {
          this.itemLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            if(data === 'End'){
              // 子记录已经删除干净了，关闭弹框
              this.viewFormVisible = false;
            }else{
              // 还存在子记录，刷新当前弹框表格的数据
              this.transactionInfo();
            }
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.transactionList();
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
  },
  mounted() {
    this.transactionList();
  },
  created() {
    this.financialType();
  }
}
</script>

<style scoped>
  .demo-input-suffix {
    margin-bottom: 15px;
  }
  .el-input {
    width: 180px;
  }
  .demo-input-suffix .el-input {
    margin-right: 15px;
  }
</style>

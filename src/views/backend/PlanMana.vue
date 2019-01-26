<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-date-picker
            v-model="filters.date"
            type="month"
            value-format="yyyy-MM-dd"
            @change="(value) => dataChangeHandler(value)"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="reloadPage">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24" id="topmenu">
       <div style="float: left;width: 30%;height: 100%;text-align: left;line-height: 45px;cursor: pointer;"><span v-on:click="buttonQuery(-1)" ><i class="el-icon-arrow-left"></i></span></div>
       <div style="float: left;width: 40%;height: 100%;text-align: center;font-size: 20px;line-height: 45px">{{ this.filters.date }}</div>';
       <div style="float: right;width: 28%;height: 100%;text-align: right;line-height: 45px;cursor: pointer;"><span v-on:click="buttonQuery(+1)"><i class="el-icon-arrow-right"></i></span></div>
    </el-col>
    <el-col :span="24">
      <table id="plantanle" border="1px" cellpadding="0" cellspacing="0" :loading="listLoading">
        <thead>
        <tr>
          <td>星期日</td>
          <td>星期一</td>
          <td>星期二</td>
          <td>星期三</td>
          <td>星期四</td>
          <td>星期五</td>
          <td>星期六</td>
        </tr>
        </thead>
        <tbody id="Tdhaoshu" v-html="outhtml" @click="planClick($event)">
        </tbody>
      </table>
    </el-col>
    <!--新增界面-->
    <el-dialog title="新建日程计划" v-model="addFormVisible" :close-on-click-modal="false" :visible.sync="addFormVisible" :append-to-body="true">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="执行时间">
          <el-input type="text" :disabled="true" v-model="addForm.planDate"></el-input>
        </el-form-item>
        <el-form-item label="计划安排" prop="planContent">
          <el-input type="textarea" v-model="addForm.planContent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="编辑日程计划" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" :append-to-body="true">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="执行时间">
          <el-input type="text" :disabled="true" v-model="editForm.planDate"></el-input>
        </el-form-item>
        <el-form-item label="计划安排" prop="planContent">
          <el-input type="textarea" v-model="editForm.planContent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
        <el-button @click.native="deleteSubmit" :loading="deleteLoading">删除</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getPlanList, createPlan, updatePlan, deletePlan } from '../../api/api';
export default {
  name: 'PlanMana',
  data()  {
    return  {
      filters: {
        date:'' // 用户筛选的日期
      },
      topmenu: '',//输出顶部的按钮
      // 返回的单元格数据
      datas: [],
      outhtml: '',
      // 是否显示加载
      listLoading: false,
      addFormVisible:false,
      addLoading:false,
      // 添加界面数据
      addForm: {
        planDate: '',
        planContent: '',
      },
      addFormRules: {
        planContent: [
          { required: true, message: '请输入计划内容', trigger: 'blur' },
          { max: 30, message: '不能超过30 个字符', trigger: 'blur' }
        ],
      },
      editFormVisible:false,
      editLoading:false,
      //编辑界面数据
      editForm: {
        id: '',
        planDate: '',
        planContent: '',
      },
      editFormRules: {
        planContent: [
          { required: true, message: '请输入计划内容', trigger: 'blur' },
          { max: 30, message: '不能超过30 个字符', trigger: 'blur' }
        ],
      },
      deleteLoading:false
    }
  },
  methods:  {
    // 日期控件改变事件
    dataChangeHandler(value) {
      if (JSON.stringify(value) === null || JSON.stringify(value) === 'null'){
        this.filters.date = this.getNowFormatDate()
      } else {
        this.filters.date = value
      }
      this.getPlanData();
    },
    // 获取计划
    getPlanData() {
      let para = {
        date: this.filters.date
      };
      this.listLoading = true;
      //NProgress.start();
      getPlanList(para).then((datas) => {
        this.listLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 表格数据
          this.datas = data;
          this.rendering();
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
    rendering(){
      var isNowMonth = true;
      // 判断是否是本月
      var nowDate = new Date(this.getNowFormatDate());
      var nowYear = nowDate.getFullYear()//获取年
      var nowMonth = nowDate.getMonth();//获取月
      var nowday = nowDate.getDate();//获取天数

      var localDate = new Date(this.filters.date);
      var localYear = localDate.getFullYear()//获取年
      var localMonth = localDate.getMonth();//获取月
      var editDate = localYear + '-' + (localMonth+1) + '-'
      if((nowYear === localYear)&&(nowMonth === localMonth)){
        isNowMonth = true
      } else {
        isNowMonth = false
      }
      // 开始渲染
      var outhtml = '';//输出具体的日历
      for(var i = 0;i < this.datas.length;i++){
        const item = this.datas[i]
        if(i % 7 === 0){
          // 行开始
          outhtml += '<tr>';
        }
        if(item.flog === 1){
          // 需要渲染日历
          // 判断该天有无安排计划
          if(item.value === 0){
            // 没有安排计划
            // 判断当前单元格是否是今天
            if(isNowMonth === true && nowday === item.number){
              outhtml += '<td id-key="'+ item.id +'" date-key="'+ (editDate+item.number) +'" class="today">'+ item.number+'</td>';
            }else {
              outhtml += '<td id-key="'+ item.id +'" date-key="'+ (editDate+item.number) +'">'+ item.number+'</td>';
            }
          }else{
            // 有计划
            outhtml += '<td class="havetoday" id-key="'+ item.id +'" data-key="'+ item.value +'" date-key="'+ (editDate+item.number) +'" v-on:click="showDialog(1)">'+ item.number+'</td>';
          }
        }else{
          // 显示1号前和月尾的空白单元格
          outhtml += '<td></td>';
        }
        if(i % 7 === 6){
          // 行结尾
          outhtml += '</tr>';
        }
      }
      this.outhtml = outhtml;
    },
    reloadPage (){
      // 重置查询条件
      this.filters.data = ''
      this.getPlanData()
    },
    getNowFormatDate() {
      // 获取当前日期
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate
    },
    getOperationData(_dateObject,x){
      //运算日期
      if( _dateObject == null || undefined == _dateObject || _dateObject == ''){
        _dateObject = new Date();
      }
      _dateObject.setMonth(_dateObject.getMonth() + x);
      var nd = _dateObject.valueOf() ;
      nd = new Date(nd);

      var y = nd.getFullYear();
      var m = nd.getMonth() + 1;
      var d = nd.getDate();

      if(m <= 9) m = '0' + m;
      if(d <= 9) d = '0'+ d;
      var cdate = y + '-' + m + '-01' ;

      return cdate;
    },
    buttonQuery(flog){
      // 通过上一个月，下一个月进行日期查询
      this.filters.date = this.getOperationData(new Date(this.filters.date),flog)
      this.getPlanData();
    },
    planClick: function(e){
      // 处罚单元格的单击事件
      if(e.target.nodeName === 'TD'){
        // 获取触发事件对象的属性
        var date = e.target.getAttribute('date-key');
        if(date === null || date === ''){
          console.log('Please do not click in the blank area')
        }else{
          var id = e.target.getAttribute('id-key')
          if(id === -1 || id === '-1'){
            // 处理新建事件
            this.addFormVisible = true
            this.addForm.planDate = date
          }else{
            // 显示计划
            this.editFormVisible = true
            this.editForm.id = id
            this.editForm.planDate = date
            this.editForm.planContent = e.target.getAttribute('data-key')
          }
        }
      }else{
        console.log('Invalid click event')
      }
    },
    //新建计划
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = {
              describe:this.addForm.planContent,
              plandate: this.addForm.planDate
            };
            createPlan(para).then((datas) => {
              this.addLoading = false;
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
                this.getPlanData();
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
    //修改计划
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = {
              id:this.editForm.id,
              describe:this.editForm.planContent,
              plandate: this.editForm.planDate
            };
            updatePlan(para).then((datas) => {
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
                this.getPlanData();
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
    //删除计划
    deleteSubmit: function () {
      this.$confirm('您确认删除吗？', '提示', {}).then(() => {
            this.deleteLoading = true;
            //NProgress.start();
            let para = {
              id:this.editForm.id
            };
            deletePlan(para).then((datas) => {
              this.deleteLoading = false;
              //NProgress.done();
              let { msg, code, data } = datas;
              if(code === 0)
              {
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getPlanData();
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
    },
  },
  mounted() {
    // 初始化当前时间
    this.filters.date = this.getNowFormatDate()
    this.getPlanData();
  }
}
</script>

<style lang="scss">
  table {
    width: 100%;
    border: 1px;
    border-collapse: collapse;
  }

  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: #b1e0dd;
  }

  #plantanle td {
    border: 1px solid #752b7d;
    text-align: center;
    padding: 1em;
  }

  #plantanle thead tr td {
    text-align: center;
    color: #19a97b;
    /*距离顶部底部和字体大小已在媒体查询中定义*/
  }

  #topmenu{
    width: 98%;height:50px;margin: 0 auto
  }

  .today{/*今天*/
    background-color:#ddf3ff;
  }

  .havetoday{/*今天有安排*/
    background-color:#f1ffbf;
    cursor: pointer;
  }
</style>

<template>
  <div class="base-content">
    <div class="container">
      <div class="menu-title">
        <div class="menu-name">
          <i class="el-icon-caret-right"></i>计划安排
        </div>
      </div>
      <el-col :span="24" id="topmenu">
        <div style="float: left;width: 30%;height: 100%;text-align: left;line-height: 45px;cursor: pointer;"><span v-on:click="buttonQuery(-1)" ><i class="el-icon-arrow-left"></i></span></div>
        <div style="float: left;width: 40%;height: 100%;text-align: center;font-size: 20px;line-height: 45px">{{ this.filters.date }}</div>
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
      <!--编辑界面-->
      <el-dialog title="详情" v-model="editFormVisible" :close-on-click-modal="false" :visible.sync="editFormVisible" :append-to-body="true">
        <el-form :model="editForm" label-width="80px" ref="editForm">
          <el-form-item label="执行时间">
            <el-input type="text" :disabled="true" v-model="editForm.planDate"></el-input>
          </el-form-item>
          <el-form-item label="计划安排" prop="planContent">
            <el-input type="textarea" :disabled="true" v-model="editForm.planContent"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click.native="editFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { queryPlan } from '../../api/api';
  export default {
    name: 'plan',
    data (){
      return{
        filters: {
          date:'' // 用户筛选的日期
        },
        topmenu: '',//输出顶部的按钮
        // 返回的单元格数据
        datas: [],
        outhtml: '',
        // 是否显示加载
        listLoading: false,
        editFormVisible:false,
        editLoading:false,
        //编辑界面数据
        editForm: {
          id: '',
          planDate: '',
          planContent: '',
        },
      }
    },
    methods:{
      // 获取计划
      getPlanData() {
        let para = {
          date: this.filters.date
        };
        this.listLoading = true;
        //NProgress.start();
        queryPlan(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            // 表格数据
            this.datas = data;
            this.rendering();
          }else {
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
      planClick: function(e){
        // 处罚单元格的单击事件
        if(e.target.nodeName === 'TD'){
          // 获取触发事件对象的属性
          var date = e.target.getAttribute('date-key');
          if(date === null || date === ''){
            console.log('Please do not click in the blank area')
            return false
          }else{
            var id = e.target.getAttribute('id-key')
            if(id === -1 || id === '-1'){
              // 该天无安排
              return false
            }else{
              // 显示计划
              this.editFormVisible = true
              this.editForm.id = id
              this.editForm.planDate = date
              this.editForm.planContent = e.target.getAttribute('data-key')
              return false
            }
          }
        }else{
          console.log('Invalid click event')
          return false
        }
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
    },
    mounted() {
      // 初始化当前时间
      this.filters.date = this.getNowFormatDate()
      this.getPlanData();
    }
  }
</script>

<style lang="scss" scoped>
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

  #plantanle thead tr td {
    text-align: center;
    color: #19a97b;
    /*距离顶部底部和字体大小已在媒体查询中定义*/
  }

  #topmenu{
    width: 98%;height:50px;margin: 0 auto
  }

</style>

<style lang="scss">
  #plantanle td {
    border: 1px solid #752b7d;
    text-align: center;
    padding: 1em;
  }

  .today{/*今天*/
    background-color:#ddf3ff;
  }

  .havetoday{/*今天有安排*/
    background-color:#f1ffbf;
    cursor: pointer;
  }
</style>

<template>
  <div class="base-content">
    <div class="container">
      <div class="menu-title">
        <div class="menu-name">
          <i class="el-icon-caret-right"></i>随笔记录
        </div>
      </div>
      <div id="datagrid" v-loading="listLoading">
        <div class="note-lable">
          <el-badge :value="dataTotal" class="item" type="primary">
            <el-button v-if="dataTotal > 0" v-on:click="switchNoteBook(null)" size="small">全部</el-button>
            <el-button v-else size="small">全部</el-button>
          </el-badge>
          <el-badge v-if="notes !='null'" v-for="(data,index) in notes" :value="data.notesCount" :type="badgeType[(index+1)%5]" :key="data.id" class="item">
            <el-button v-if="data.notesCount > 0" v-on:click="switchNoteBook(data.id)" size="small">{{data.name}}</el-button>
            <el-button v-else size="small">{{data.name}}</el-button>
          </el-badge>
        </div>
        <div v-if="datas !='null'" v-for="data in datas" class="newsitem">
          <el-col :xs="2" :sm="1" :md="1" :lg="1" :xl="1">
            <div class="yearmonthday"><span>{{data.day}}</span> {{data.year}}.{{data.month}}</div>
          </el-col>
          <el-col :offset="1" class="newstitle">
            <a class="news_content_tiele" v-bind:href="['/notes/info?id='+data.id]" target="_blank">{{data.topic}}</a>
          </el-col>
        </div>
        <div v-else class="newsitem" style="justify-content:center;">
          笔记好像没有了诶
        </div>
        <div v-if="nextpage != null" class="row newsitem" style="justify-content:center;">
          <a v-on:click="loadMore(nextpage)" title="加载下一页" style="font-size: 2em"><i class="el-icon-view"></i></a>
        </div>
        <div v-else class="newsitem" style="justify-content:center;">
          加载完笔记了
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryNotebook,queryNote } from '../../api/api';
  export default {
    name: 'note',
    data () {
      return {
        // 下一页
        nextpage: '',
        // 笔记簿数据
        notes:'',
        // 笔记数据
        datas: '',
        // 笔记数
        dataTotal:'',
        listLoading: false,
        // 用户切换选择的笔记簿
        notebookId: null,
        badgeType: ["primary","success","warning","danger","info"]
      }
    },
    methods:{
      //获取笔记簿数据
      getNoteBooks() {
        queryNotebook(null).then((datas) => {
          let { msg, code, data } = datas;
          if(code === 0)
          {
            // 总数据
            this.notes = data;
          }else {
            this.$message({
              message: msg,
              type: 'error'
            });
          }
        });
      },
      switchNoteBook(value){
        this.notebookId = value;
        this.loadData();
      },
      loadMore:function(nextpage){
        this.loadData(nextpage);
      },
      //获取列表数据
      loadData(nowpage) {
        let para = {
          nowPage: nowpage,
          pageSize: 10,
          notebookId: this.notebookId
        };
        this.listLoading = true;
        //NProgress.start();
        queryNote(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            // 总数据量
            this.dataTotal = data.dateSum;
            this.rendering(data);
            console.log(data)
          } else {
            this.$message({
              message: msg,
              type: 'error'
            });
          }
        });
      },
      //渲染动态
      rendering(data) {
        if(JSON.stringify(data) !== '{}')
        {
          //对新闻动态进行二次处理
          for(var i in data.grid) {
            var obj = data.grid[i];
            data.grid[i].topic=obj.topic;
            var b = (obj.createtime).substr(0,10).split("-");//分割日期，先把空格后的分钟切开
            data.grid[i].month=b[1];
            data.grid[i].year=b[0];
            data.grid[i].day=b[2];
          }
          console.log(data)
          //第一页采用直接覆盖的显示方式
          if(data.pageNow == 1 || data.pageNow == '1')
          {
            this.datas = data.grid;//绑定到Vue
          }
          else
          {
            this.datas= this.datas.concat(data.grid);//追加，合并
          }
        }
        else
        {
          console.log('-----')
          this.datas = null;
        }
        //显示是否加载下一页(当前页是最后一页)
        if(data.pageNow == data.totalPage)
        {
          this.nextpage = null;
        }
        else
        {
          this.nextpage = data.pageNow + 1;
        }
      }
    },
    mounted() {
      // 获取笔记簿
      this.getNoteBooks();
      this.loadData();
    }
  }
</script>

<style lang="scss" scoped>
  .container{
    .menu-title{
      border-bottom: 2px solid #edeaf1;
    }
    #datagrid{
      padding-top: 1.5em;
      .note-lable{
        margin: 1em;
        .item{
          z-index: -1;
          margin-right: 2em;
          margin-bottom: 1em;
        }
      }
      /*在动态页引入新的样式*/
      .yearmonthday {
        border: 1px solid #edeaf1;
        color: #5b317d;
        background: #edeaf1;
        width: 58px;
        text-align: center;
        font-size: 12px;
        float: left;
        _display: inline;
        padding-bottom: 5px;

        span {
          display: block;
          font-size: 24px;
          line-height: 24px;
          padding: 8px 0 2px 0;
          zoom: 1;
        }
      }
      .newstitle{
        font-size: 1.2em;
        vertical-align: middle;
        display: inline-block;
        a{
          color: #5b317d;
          text-decoration: none;
        }
      }
      .newsitem
      {
        border-bottom: 1px dotted #e8e6e6;
        align-items:center;
        display:flex;/*Flex布局*/
        display:-webkit-flex;
        padding-top: 1em;
        padding-bottom: 1em;
      }
    }
  }
</style>

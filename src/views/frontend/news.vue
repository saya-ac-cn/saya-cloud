<template>
  <div class="base-content">
    <div class="container">
      <div class="menu-title">
        <div class="menu-name">
          <i class="el-icon-caret-right"></i>消息动态
        </div>
      </div>
      <div id="datagrid">
        <div v-if="datas !='null'" v-for="data in datas" class="row newsitem">
          <div class="col-xs-1">
            <div class="yearmonthday"><span>@{{data.day}}</span> @{{data.year}}.@{{data.month}}</div>
          </div>
          <div class="col-xs-offset-1 col-xs-10 newstitle">
            <a class="news_content_tiele" v-bind:href="['/news/view/'+data.id+'.html']" target="_blank">@{{data.topic}}</a>
          </div>
          <div class="clearfix visible-xs"></div>
        </div>
        <div v-else class="row newsitem" style="justify-content:center;">
          动态好像没有了诶
        </div>
        <div v-if="nextpage != null" class="row newsitem" style="justify-content:center;">
          <a v-on:click="loadMore(nextpage)" title="加载下一页" style="font-size: 2em"><i class="glyphicon glyphicon-eye-open"></i></a>
        </div>
        <div v-else class="row newsitem" style="justify-content:center;">
          已经加载完动态了
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data: {
      nextpage: '',
      datas: '',
    },
    methods: {
      loadData(nowpage) {
        $(".loader").fadeIn();
        $.ajax({
          type: "GET",//规定请求的类型
          url: "/api/frontend/news/"+nowpage,//请求地址
          dataType:"json",//预期服务器返回的数据类型
          success:function(data){//收到后台的响应
            if(data.code == 0)
            {
              rendering(data.data);
              $(".loader").fadeOut(2000);
            }
            else
            {
              _error('没有数据');
              $(".loader").fadeOut(2000);
            }
          },
          error: function (data) {//没有收到请求
            _error('数据获取失败');
            $(".loader").fadeOut(2000);
            return false;
          }
        });
      },
      //渲染动态
      rendering(data) {
        if(!$.isEmptyObject(data))
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
          //第一页采用直接覆盖的显示方式
          if(data.pageNow == 1 || data.pageNow == '1')
          {
            NewsVue.datas = data.grid;//绑定到Vue
          }
          else
          {
            NewsVue.datas= NewsVue.datas.concat(data.grid);//追加，合并
          }
        }
        else
        {
          NewsVue.datas = null;
        }
        //显示是否加载下一页(当前页是最后一页)
        if(data.pageNow == data.maxPage)
        {
          NewsVue.nextpage = null;
        }
        else
        {
          NewsVue.nextpage = data.nextPage;
        }
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style scoped>

</style>

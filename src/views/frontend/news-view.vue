<template>
  <div class="base-content">
    <div class="container">
      <div id="print-area" v-loading="listLoading">
        <div class="menu-title">
          <div class="menu-name">
            <i class="el-icon-caret-right"></i>消息动态
          </div>
        </div>
        <div v-if="datas != null" class="news-name">{{datas.now.topic}}</div>
        <div v-if="datas != null" class="news-tool">
          <div class="subtitle">
            {{datas.now.createtime}} &nbsp;&nbsp;来源：{{datas.now.source}}
          </div>
          <div class="tools-share">
            <el-tag v-for="(tag,index) in datas.now.label" :key="tag" :type="badgeType[(index+1)%5]">{{tag}}</el-tag>
          </div>
        </div>
        <div v-if="datas != null" class="news-wrap">
          <div class="news-content">
            <vue-markdown v-highlight :source="datas.now.content"></vue-markdown>
          </div>
          <div class="news-footer">
            <ul>
              <li class="pre-li">
                <span>上一篇</span>
                <a v-if="datas.pre != null" v-bind:href="['/news/info?id='+datas.pre.id]">{{datas.pre.topic}}</a>
                <a v-else>已是第一篇了</a>
              </li>
              <li class="next-li">
                <span>下一篇</span>
                <a v-if="datas.next != null" v-bind:href="['/news/info?id='+datas.next.id]">{{datas.next.topic}}</a>
                <a v-else>已是最后一篇了</a>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="datas == null" class="empty-news">该动态不存在</div>
      </div>
    </div>
  </div>
</template>

<script>
  //直接组件引入
  import VueMarkdown from 'vue-markdown'
  import { queryNewsInfo } from '../../api/api';
  export default {
    name: 'news-view',
    components: {
      VueMarkdown
    },
    data(){
      return {
        datas: '',
        // 动态编号
        id:null,
        listLoading: false,
        badgeType: ["primary","success","warning","danger","info"],
      }
    },
    created:function(){
      this.getParams();
    },
    methods: {
      // 打印
      printdiv() {
        var print_div = document.getElementById("print-area");
        var news = print_div.innerHTML;//获取要打印的内容
        var body = document.body.innerHTML;//原来body中的内容
        document.body.innerHTML = news;//new，用将要打印的内容替换原来body中的内容
        window.print();//开始打印
        document.body.innerHTML = body;//再将原来body中的内容还原
        return false;
      },
      initData(){
        this.listLoading = true;
        let para = {
          id: this.id
        };
        queryNewsInfo(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            var thisNews = data.now;
            this.datas = data
            this.datas.now.topic = thisNews.topic
            document.title = thisNews.topic
            this.datas.now.label = (thisNews.label).split(';')
            this.datas.now.content = thisNews.content
            //console.log(data.now)
          }else {
            this.$message({
              message: msg,
              type: 'error'
            });
            this.data = null
          }
        });
      },
      changeData(value, render) {
        console.log(render);
      },
      getParams:function(){
        // 取到路由带过来的参数
        this.id = this.$route.query.id
      },
    },
    mounted() {
      this.initData()
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    #print-area{
      .news-name {
        line-height: 50px;
        height: 50px;
        color: #000;
        text-align: center;
        font-size: 22px;
      }
      .news-tool {
        line-height: 40px;
        height: 40px;
        color: #969696;
        font-size: 14px;
        padding: 0px 65px;
        .subtitle{
          float: left;
          width: auto;
        }
        .tools-share{
          float: right;
          width: auto;
          .font-size{
            width: auto;
            float: left;
            margin-right: 15px;
            span{
              cursor: pointer;
              padding: 0 3px;
            }
          }
          .print-div{
            width: auto;
            float: left;
            margin-right: 15px;
            span{
              cursor: pointer;
              margin: 0 10px;
            }
          }
          .share{
            width: auto;
            float: left;
          }
        }
      }
      .news-wrap {
        /*padding: 0px 65px;*/
        .news-content{
          padding-top: 20px;
          padding-bottom: 20px;
          border-top: 1px solid #dedede;
          p {
            line-height: 30px;
            color: #000;
            font-size: 14px;
            margin-top: 40px;
          }
        }
        .news-footer {
          margin-top: 2em;
          border-top: 1px solid #dedede;
          height: auto;
          padding-top: 1em;
          padding-bottom: 1em;

          ul {
            list-style: none;
            .pre-li {
              margin-bottom: 3px;
            }
            li{
              span{
                width: 60px;
                text-align: center;
                height: 26px;
                line-height: 26px;
                display: inline-block;
                color: #fff;
                margin-right: 7px;
                background: #e3c6e6;
              }
              a{
                text-decoration: none;
              }
            }
          }
        }
      }
      .empty-news{
        padding: 0px 65px
      }
    }
  }
</style>

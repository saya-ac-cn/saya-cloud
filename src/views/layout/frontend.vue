<template>
    <section>
      <!--页头区域开始-->
      <header>
        <!--顶部菜单开始-->
        <nav style="border: 0px">
          开头
        </nav>
        <!--顶部菜单结束-->
        <!--网站欢迎部分开始-->
        <div class="banner">
        </div>
        <!--网站欢迎部分结束-->
      </header>
      <!--页头区域结束-->

      <!--主体部分开始-->
      <section>
        @yield('content')
      </section>
      <!--主体部分结束-->

      <!--版权区域-->
      <footer>
        <!--版权区域图片-->
        <div class="copyright-img"></div>
        <!--版权区域主体-->
        <div class="copyright-content">
          <div class="container">
            <div class="row">
              <div class="col-md-4 col-sm-4 col-xs-12 ">
                <i class="glyphicon glyphicon-map-marker map-marker"></i>
                <p>
                  地址：四川省宜宾市五粮液大道酒圣路8号<br/>
                  邮编：644000
                </p>
              </div>
              <div class="col-md-4 col-sm-4 col-xs-12 ">
                <i class="glyphicon glyphicon-envelope map-marker"></i>
                <p>saya@saya.ac.cn</p>
              </div>
              <div class="col-md-4 col-sm-4 col-xs-12 ">
                <i class="map-marker"></i>
                <p>
                  国家工信部域名备案信息：[www.saya.ac.cn/蜀ICP备16013222-2号]<br/>
                  Copyright &copy; 2019.Saya.ac.cn All rights reserved
                </p>
              </div>
              <div class="clearfix"></div>
            </div>
          </div>
        </div>
      </footer>
    </section>
</template>

<script>
  export default {
    name: 'frontend'
  }
</script>

<style scoped>
  /*定义字体*/
  @font-face {
    font-family: minijianqiti;
    font-weight: bold;
    src: url('../../assets/fonts/minijianqiti.ttf');
  }
  /*用于应用母版下base-content的样式，注意：在主页中不能应用*/
  .base-content{
    background: #e3c6e6;
    padding: 5em 0px;
    min-height: 350px;
    height: auto;
    width: 100%;
  }
  /*栏目的样式*/
  .menu-name{
    font-size: 25px;
    color: #752b7d;
  }

  body{
    margin: 0;
    margin-left: 0;
    margin-top: 0;
    padding-top: 50px;/*因为菜单是绝对定位的，这里必须设置*/
    font-family: minijianqiti;
    background-color: #f0Daf2;
  }

  /*菜单背景*/
  header>nav,.navbar-inverse {
    background-image: -webkit-linear-gradient(top,#752b7d 0,#752b7f 100%);
  }

  /*logo引导部分文字颜色*/
  .navbar-inverse .navbar-brand{
    font-size: 19px;
    color: #eabbef;
  }

  .navbar-inverse .navbar-toggle {
    border-color: #eabbef;
  }

  .navbar-toggle:focus, .navbar-inverse .navbar-toggle:hover{
    background-color: #9842a1;
  }

  /*欢迎部分div*/
  .banner{
    background:url('../../assets/picture/layout/banner.png') no-repeat;
    background-size:cover;
    -webkit-background-size:cover;
    -moz-background-size:cover;
    -o-background-size:cover;
    -ms-background-size:cover;
    min-height:500px;
  }

  /*栏目标题*/
  .menu-title{
    padding: 1em 0px;
  }

  .news_time {
    color:#5c307d;
    background: #edeaf1;
    width: 20%;
    height: auto;
    border: 1px solid #d8d8d8;
    text-align: center;
    font-size: 12px;
    float: left;
    _display: inline;
    padding: 5px 5px;
  }

  .news_time span {
    display: block;
    font-size: 24px;
    line-height: 24px;
    padding: 8px 0 2px 0;
  }

  .news_content {
    margin-left: 25%;
  }

  .news_content div{
    width: 100%;
    height: auto
  }

  .news_content .news_content_tiele{
    color: #22132D;
    line-height: 22px;
    font-size: 18px;
  }

  .news_content .news_content_value{
    color: #777;
    font-size:13px;
    padding-top: 8px;
    font-family: inherit;
  }

  /*版权区域*/
  footer{

  }

  /*版权区域图片*/
  footer .copyright-img{
    background: url('../../assets/picture/layout/copyright.png') no-repeat;
    background-size:cover;
    -webkit-background-size:cover;
    -moz-background-size:cover;
    -o-background-size:cover;
    -ms-background-size:cover;
    min-height:177px;
  }

  /*版权区域内容*/
  footer .copyright-content{
    width: 100%;
    min-height: 200px;
    background-color: #752b7d;
    padding:3em 0px;
  }

  /*版权区域文字图标*/
  .map-marker {
    width:10%;
    display: inline-block;
    vertical-align: middle;
    color: #fff;
    font-size: 30px;
    padding: 0 !important;
    margin-right: 12px;
    border: none;
    float: left;
  }

  /*版权区域文本*/
  .copyright-content p {
    float: left;
    margin-left: 5%;
    height:auto;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    vertical-align: middle;
    display: inline-block;
    font-family: 'Play-Regular';
  }


  @media (max-width: 1366px){
    /*欢迎div*/
    .banner {
      min-height: 426px;
    }
    /*版权区域图片*/
    footer .copyright-img{
      min-height: 151px;
    }
    /*版权区域内容*/
    footer .copyright-content{
      padding:3em 0px;
    }
    /*版权区域文本*/
    .copyright-content p{
      font-size: 14px;
    }
  }

  @media (max-width: 1280px){
    /*欢迎div*/
    .banner {
      min-height: 400px;
    }
    /*版权区域图片*/
    footer .copyright-img{
      min-height: 141px;
    }
    /*版权区域内容*/
    footer .copyright-content{
      padding:2.6em 0px;
    }
    /*版权区域文本*/
    .copyright-content p{
      font-size: 12px;
    }
    /*栏目的样式*/
    .menu-name{
      font-size: 25px;
      color: #752b7d;
    }
  }

  @media (max-width: 1024px){
    /*欢迎div*/
    .banner {
      min-height: 320px;
    }
    /*版权区域图片*/
    footer .copyright-img{
      min-height: 113px;
    }
    /*版权区域内容*/
    footer .copyright-content{
      padding:2.5em 0px;
    }
    /*版权区域文本*/
    .copyright-content p{
      font-size: 0.5em;
    }
    /*栏目的样式*/
    .menu-name{
      font-size: 22px;
      color: #752b7d;
    }
  }

  @media (max-width: 768px){
    /*欢迎div*/
    .banner {
      min-height: 240px;
    }
    /*版权区域图片*/
    footer .copyright-img{
      min-height: 85px;
    }
    /*版权区域内容*/
    footer .copyright-content{
      padding:2em 0px;
    }
    /*版权区域文本*/
    .copyright-content p{
      font-size: 1em;
    }
    /*栏目的样式*/
    .menu-name{
      font-size: 20px;
      color: #752b7d;
    }
  }

  @media (max-width: 640px) {
    /*欢迎div*/
    .banner {
      min-height: 200px;
    }
    /*版权区域图片*/
    footer .copyright-img{
      min-height: 71px;
    }
    /*版权区域内容*/
    footer .copyright-content{
      padding:2em 0px;
    }
    /*版权区域文本*/
    .copyright-content p{
      font-size: 1em;
    }
    /*栏目的样式*/
    .menu-name{
      font-size: 19px;
      color: #752b7d;
    }
  }

  @media (max-width: 480px) {
    /*欢迎div*/
    .banner {
      min-height: 150px;
    }
    /*版权区域图片*/
    footer .copyright-img{
      min-height: 53px;
    }
    /*版权区域内容*/
    footer .copyright-content{
      padding:2em 0px;
    }
    /*版权区域文本*/
    .copyright-content p{
      font-size: 1em;
    }
    /*栏目的样式*/
    .menu-name{
      font-size: 18px;
      color: #752b7d;
    }
  }

</style>

<template>
  <el-container class="this-container">
    <div class="background"></div>
    <el-header class="this-header"></el-header>
    <el-main class="this-main"> Main</el-main>
    <el-footer class="this-copright">Footer</el-footer>
  </el-container>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        activeIndex: '1'
      };
    },
  }
</script>

<style lang="scss" scoped>
  .this-container::-webkit-scrollbar {
    display: none;
  }
  .this-container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100vw;
    overflow-x: hidden;
    overflow-y: hidden;
    .background{
      position: absolute;
      z-index: -999;
      width: 100vw;
      top: 0px;
      bottom: 0px;
      /* 加载背景图 */
      background-image: url('../../assets/picture/login/login_background1.jpg');
      /* 背景图垂直、水平均居中 */
      background-position: center center;
      /* 背景图不平铺 */
      background-repeat: no-repeat;
      /* 当内容高度大于图片高度时，背景图像的位置相对于viewport固定 */
      background-attachment: fixed;
      /* 让背景图基于容器大小伸缩 */
      background-size: cover;
      background-attachment: fixed;
    }
    .this-header{
      height: 70px;
      opacity: 0.8;
      filter: alpha(opacity=70);
      width: 100vw;
      background-color: #000;
    }
    .this-main{
      width: 100vw;
      height: 200px;
      overflow-x: hidden;
      overflow-y: hidden;
    }
    .this-main::-webkit-scrollbar {
      display: none;
    }
    .this-copright{
      width: 100vw;
      height: 100px;
      opacity: 0.8;
      filter: alpha(opacity=70);
      background-color: #000;
    }
  }
</style>

<template>
  <el-container class="this-container">
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
    overflow-x: hidden;
    overflow-y: hidden;
    .this-header{
      height: 200px;
      width: 100vw;
      background-color: #752B7D;
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
      background-color: #3399ff;
    }
  }
</style>

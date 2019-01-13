<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input type="text" v-model="filters.filename" placeholder="按文件名检索" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="filters.date" @change="(value) => dataChangeHandler(value)" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"  :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getWallpaper">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="reloadPage">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-loading="listLoading">
      <el-col :span="24">
        <el-col :span="6" v-if="wallpaper !='null'" :key="data.id" v-for="data in wallpaper" class="album-div-imgdiv">
          <div class="tools">
            <el-button type="primary" size="mini" icon="el-icon-delete" v-on:click="deleteData(data.id)" title="删除" circle></el-button>
          </div>
          <a href="javascript:void(0)" target="_blank">
            <img v-bind:src="data.weburl" class="img-responsive">
          </a>
        </el-col>
        <el-col :span="6" v-else class="album-div-imgdiv">
          好像并没有照片诶
        </el-col>
        <el-col :span="6" v-if="nextpage !='null'" class="album-div-imgdiv">
          <el-button type="primary" size="mini" icon="el-icon-more" v-on:click="loadMore" title="加载更多" circle></el-button>
        </el-col>
        <el-col :span="6" v-else class="album-div-imgdiv">
          已经加载完相册了
        </el-col>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { getPictureList, deletePicture } from '../../api/api';
export default {
  name: 'illustration',
  data()  {
    return  {
      filters: {
        // 查询的日期
        date: [],
        beginTime:'',// 搜索表单的开始时间
        endTime:'',// 搜索表单的结束时间
        filename: ''
      },
      // 返回的单元格数据
      wallpaper: [],
      // 下一页
      nextpage: 1,
      // 是否显示加载
      listLoading: false,
      // 页面宽度
      pageSize: 10,
    }
  },
  methods:  {
    // 日期控件改变事件
    dataChangeHandler(value) {
      if (JSON.stringify(value) === null || JSON.stringify(value) === 'null'){
        this.filters.beginTime = '';
        this.filters.endTime = '';
      } else {
        this.filters.beginTime = value[0];
        this.filters.endTime = value[1];
      }
      this.getWallpaper()
    },
    // select框改变事件
    selectChange(ele){
      if(ele == null ||ele == 'null') {
        this.filters.selectType = null;
      } else {
        this.filters.selectType = ele;
      }
    },
    handleRemove(file, fileList) {
      // 删除文件时事件
      console.log(fileList);
    },
    handlePreview(file) {
      // 单击文件事件
      console.log(file);
    },
    handleInsert(file){
      /*
      * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用,由于此处上传是手动上传，所以只监听添加时的事件
      */
      console.log(file)
      //this.addForm.fileList.push(file)
    },
    handleAdd () {
      this.addFormVisible = true;
    },
    uploadWallpaper () {
      this.$refs.upload.submit();
      // this.$refs.upload.clearFiles()
    },
    //获取壁纸列表
    getWallpaper() {
      let para = {
        type:2,
        nowPage: this.nextpage,
        filename:this.filters.filename,
        beginTime: this.filters.beginTime,
        endTime: this.filters.endTime,
        pageSize: this.pageSize
      };
      this.listLoading = true;
      //NProgress.start();
      getPictureList(para).then((datas) => {
        this.listLoading = false;
        let { msg, code, data } = datas;
        if(code === 0)
        {
          // 表格数据
          this.rendering(data);
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
    loadMore (){
      this.getWallpaper();
    },
    rendering (data){
      // 渲染数据
      if(!(this.isEmptyObject(data.grid))){
        //第一页采用直接覆盖的显示方式
        if(data.pageNow == 1) {
          this.wallpaper = data.grid;//绑定到Vue
        } else {
          this.wallpaper= (this.wallpaper).concat(data.grid);//追加，合并
        }
      } else {
        this.wallpaper = 'null';
      }
      //显示是否加载下一页(当前页是最后一页)
      if(data.pageNow === data.totalPage){
        this.nextpage = 'null';
      }else{
        this.nextpage = data.pageNow + 1;
      }
    },
    reloadPage (){
      // 重置查询条件
      this.filters.filename = ''
      this.filters.beginTime = ''
      this.filters.endTime = ''
      this.nextpage = 1
      this.getWallpaper()
    },
    deleteData (id) {
      this.$confirm('确认删除编号为：'+ id +'的壁纸吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = { id: id };
        deletePicture(para).then((datas) => {
          this.listLoading = false;
          let { msg, code, data } = datas;
          if(code === 0)
          {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.nextpage = 1
            this.getWallpaper();
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
    isEmptyObject (data){
      // 手写实现的判断一个对象{}是否为空对象，没有任何属性 非空返回false
      var item;
      for (item in data)
        return false;
      return true
    },
  },
  mounted() {
    this.getWallpaper();
  },
}
</script>

<style scoped>
  .album-div-imgdiv {
    padding-top: 1em;
    padding-bottom: 1em;
  }
  .img-responsive{
    z-index: 8;
    position:relative;/*相对定位*/
  }
  .tools{
    /*display: none;*/
    z-index: 10;
    position:absolute;/*绝对定位*/
    padding-top: 1em;
    padding-bottom: 1em;
    padding-left: 1em;
  }

  .tools>a{
    position:relative;/*相对定位*/
    margin-right: 1em;
  }

  .album-div-imgdiv a {
    display: block;
    width: 100%;
    overflow: hidden;
  }

  .album-div a {
    outline: none;
    blr: expression(this.onFocus=this.blur());
    text-decoration: none;
    color: #323232;
  }
  .album-div-imgdiv a:hover img {
    filter: alpha(opacity=85);
    -moz-opacity: 0.85;
    opacity: 0.85;
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
  }
  .album-div-imgdiv a img {
    display: block;
    width: 100%;
    overflow: hidden;
    transition: 1s;
  }
  img, object {
    max-width: 100%;
    /* height: auto; */
    width: auto\9;
    -ms-interpolation-mode: bicubic;
  }
</style>

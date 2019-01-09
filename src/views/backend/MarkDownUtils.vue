<template>
  <div id="editor">
    <mavon-editor style="height: 100%" ref="md" @imgAdd="$imgAdd"></mavon-editor>
  </div>
</template>
<script>
  import { updateNewsPicture } from '../../api/api';
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  export default {
    name: 'MarkDownUtils',
    components: {
      mavonEditor
      // or 'mavon-editor': mavonEditor
    },
    data(){
      return {
      }
    },
    methods:{
      // 绑定@imgAdd event
      $imgAdd(pos, $file){
        //这边写图片的上传
        let para = {
          'filename': $file.name,
          'fileurl':$file.miniurl
        };
        updateNewsPicture(para).then((datas) => {
          let {msg, code, data} = datas;
          if (code === 0) {
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
            // $vm.$img2Url 详情见本页末尾
            console.log(data)
            // replace(/\\/g,"/") 将url中\替换为/
            // this.$refs.md.$img2Url(pos, data.replace(/\\/g,"/"));
            this.$refs.md.$img2Url(pos, data);
          } else if (code === -7) {
            // 未登录或登录失效
            sessionStorage.removeItem('user');
            this.$router.push('/login');
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: 'error'
            });
          }
        })
      }
    }
  }
</script>
<style>
  #editor {
    margin: auto;
    width: 80%;
    height: 580px;
  }
</style>

<template>
    <section v-loading="listLoading">
      <div class="mytips">
        <p>平台发布动态<a href="javascript:void(0)">约定</a>：</p>
        <blockquote>
          <p>
            <i>1、动态标题必须填写。</i>
          </p>
          <p>
            <i>2、动态可以填写也可以不填写，最多不超过3个标签。</i>
          </p>
          <p>
            <i>3、动态内容必须填写，书写采用MarkDown语法。书写完毕后，建议到前台页面查看实际效果，以便造成格式不兼容。</i>
          </p>
        </blockquote>
      </div>
      <el-row>
        <el-form ref="form" :model="news" status-icon :rules="rules1" label-width="80px">
          <el-form-item label="标题" prop="topic">
            <el-input type="text" v-model="news.topic" autocomplete="off" class="info-input-simpl"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-tag
              :key="tag"
              v-for="tag in news.label"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="news.label"
              v-model="news.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </el-form-item>
          <el-form-item label="正文" prop="content">
            <mavon-editor style="height: 100%" ref="md" v-model="news.content" @imgAdd="$imgAdd"></mavon-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </section>
</template>

<script>
import { updateNewsPicture, publishNews } from '../../api/api';
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  name: 'PublishNews',
  components: {
    mavonEditor
  },
  data () {
    return {
      // 是否显示加载
      listLoading: false,
      news:{
        topic: '',//标题
        label: [],//标签
        content: '',//正文
        inputVisible: false,
        inputValue: ''
      },
      rules1:{
        topic: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入要发布的正文', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    handleClose(tag) {
      this.news.label.splice(this.news.label.indexOf(tag), 1);
    },
    showInput() {
      this.news.inputVisible = true;
      this.$nextTick(_ => {
        console.log(this.$refs)
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.news.inputValue;
      if (inputValue) {
        this.news.label.push(inputValue);
      }
      this.news.inputVisible = false;
      this.news.inputValue = '';
    },
    submitForm(formName) {
      if(formName === 'form'){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 允许修改
            var _thisTag = null
            if (this.news.label.length > 1){
              _thisTag = (this.news.label).join(';')
            } else if(this.news.label.length = 1){
              _thisTag = (this.news.label)[0]
            } else {
              _thisTag = null
            }
            this.listLoading = true;
            let para = {
              topic: this.news.topic,
              label: _thisTag,//标签
              content: this.news.content
            };
            publishNews(para).then((datas) => {
              this.listLoading = false;
              let { msg, code, data } = datas;
              if(code === 0)
              {
                this.$message({
                  showClose: true,
                  message: '发布成功',
                  type: 'success'
                });
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
          } else {
            this.$message({
              message: '您发布的内容有误，请重新填写',
              type: 'error'
            });
            return false;
          }
        });
      }
    },
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
          // replace(/\\/g,"/") 将url中\替换为/ 后台已处理
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

<style lang="scss" scoped>
  .info-input-simpl{
    width: 40vw;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    /*margin-left: 10px;*/
    vertical-align: bottom;
  }
</style>

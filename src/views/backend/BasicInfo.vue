<template>
  <el-row>
    <el-tabs v-model="activeName" :tab-position="tabPosition" @tab-click="handleClick">
      <el-tab-pane label="查看资料" name="first">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>查看资料</span>
          </div>
          <div>
            <el-form ref="form" :model="form1" label-position="left" label-width="80px">
              <el-form-item label="用户名">
                <el-input v-model="form1.name" disabled disabled class="info-input-simpl"></el-input>
              </el-form-item>
              <el-form-item label="性别">
                <el-input v-model="form1.name" disabled class="info-input-simpl"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="form1.name" disabled class="info-input-simpl"></el-input>
              </el-form-item>
              <el-form-item label="qq">
                <el-input v-model="form1.name" disabled class="info-input-simpl"></el-input>
              </el-form-item>
              <el-form-item label="生日">
                <el-input v-model="form1.name" disabled class="info-input-simpl"></el-input>
              </el-form-item>
              <el-form-item label="故乡">
                <el-input v-model="form1.name" disabled class="info-input-simpl"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="修改签名" name="second">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>修改签名</span>
          </div>
          <div>
            <el-form ref="form2" :model="form2" status-icon :rules="rules2" label-width="80px">
              <el-form-item label="个性签名" prop="autograph">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model="form2.autograph"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('form2')">提交</el-button>
                <el-button @click="resetForm('form2')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="修改头像" name="third">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>修改头像</span>
          </div>
          <div>
            <UploadLogo></UploadLogo>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="fourth">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>查看资料</span>
          </div>
          <div>
            <el-form :model="form4" status-icon :rules="rules4" ref="form4" label-width="80px" >
              <el-form-item label="密码" prop="pwd1">
                <el-input type="password" v-model="form4.pwd1" class="info-input-simpl" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="pwd2">
                <el-input type="password" v-model="form4.pwd2" class="info-input-simpl" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('form4')">提交</el-button>
                <el-button @click="resetForm('form4')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import UploadLogo from './UploadLogo'
export default {
  name: 'BasicInfo',
  components: {
    UploadLogo
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form4.pwd2 !== '') {
          console.log(this.$refs)
          this.$refs.form4.validateField('pwd2');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form4.pwd1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      tabPosition: 'top', // 位置
      activeName: 'first', // 默认打开的标签页
      form1: {
        name: '',
        pwd1: '',
        pwd2: ''
      },
      form2: {
        autograph: '',
      },
      form3: {
        img: '',                         //裁剪图片的地址
        info: true,                      //裁剪框的大小信息
        outputSize: 1,                   // 裁剪生成图片的质量
        outputType: 'jpeg',              //裁剪生成图片的格式
        canScale: false,                 // 图片是否允许滚轮缩放
        autoCrop: true,                  // 是否默认生成截图框
        autoCropWidth: 150,              // 默认生成截图框宽度
        autoCropHeight: 150,             // 默认生成截图框高度
        fixed: false,                    //是否开启截图框宽高固定比例
        fixedNumber: [4, 4]              //截图框的宽高比例
      },
      form4: {
        pwd1: '',
        pwd2: ''
      },
      rules2:{
        autograph: [
          { required: true, message: '请输入个性签名', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 140 个字符', trigger: 'blur' }
        ]
      },
      rules4: {
        pwd1: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        pwd2: [
          { validator: validatePass2, trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    submitForm(formName) {
      if(formName === 'form2'){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit2!');
          } else {
            console.log('error submit2!!');
            return false;
          }
        });
      }
      if(formName === 'form4'){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style lang="scss" scoped>
.info-input-simpl{
  width: 30vw;
}
</style>

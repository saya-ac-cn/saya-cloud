<template>
  <div class="base-content">
    <div class="container">
      <div class="menu-title">
        <div class="menu-name">
          <i class="el-icon-caret-right"></i>留言反馈
        </div>
      </div>
      <el-form :model="addForm" label-position="top" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-col :span="11">
            <el-input class="input-item" v-model="addForm.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-col :span="11">
            <el-input class="input-item" v-model="addForm.phone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-col :span="11">
            <el-input class="input-item" v-model="addForm.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-col :span="11">
            <el-input class="input-item" type="textarea" v-model="addForm.content"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="input-item" type="primary" @click="submitForm('addForm')" :loading="addLoading">提交</el-button>
          <el-button class="input-item" @click="resetForm('addForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {validater} from '../../vars/validater'
  import { writeboard } from '../../api/api';
  export default {
    name: 'board',
    data(){
      return{
        // 添加界面数据
        addForm: {
          name: '',
          phone: '',
          email:'',
          content:''
        },
        addLoading: false,
        addFormRules: {
          name:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { max: 20, message: '您的姓名太长了吧', trigger: 'blur' }
          ],
          phone:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validater.telephoneNumber, trigger: 'blur' }
          ],
          email:[
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validater.emailValue, trigger: 'blur' }
          ],
          content: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { max: 140, message: '不能超过140 个字符', trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              writeboard(this.addForm).then((datas) => {
                this.addLoading = false;
                //NProgress.done();
                let { msg, code, data } = datas;
                if(code === 0)
                {
                  this.$message({
                    showClose: true,
                    message: '感谢您的留言，我们收到后将及时回复您。',
                    type: 'success'
                  });
                  this.$refs['addForm'].resetFields();
                } else {
                  this.$message({
                    message: msg,
                    type: 'error'
                  });
                }
              });
            });
          } else {
            this.$message({
              message: '您填写的表单有误喔~',
              type: 'error'
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
.input-item{
  z-index: -1;
}
</style>

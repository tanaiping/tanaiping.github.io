<template>
  <div class="login" :style="{backgroundImage:'url('+bgImg+')'}">
    <div class="login-box">
      <div class="title">微智行加油管理平台</div>
      <el-form ref="loginForm" :model="login" label-width="0px" :rules="rules"
      @keyup.enter.native="submitForm('loginForm')">
        <el-form-item label="" prop="userName"><el-input type="text" v-model="login.userName" placeholder="请输入账号" ></el-input></el-form-item>
        <el-form-item label="" prop="password"><el-input type="password" v-model="login.password" placeholder="请输入密码"></el-input></el-form-item>
        <el-form-item label=""><el-button type="primary" style="width: 100%;" @click="submitForm('loginForm')" >登录</el-button></el-form-item>
        <!-- <el-checkbox label="三天内自动登录" v-model="login.isChecked"></el-checkbox> -->
      </el-form>

    </div>

  </div>
</template>

<script>
 import {Login} from '@/config/url'
  export default {
    name:"login",
    data() {
      return {
        login:{
          userName: '',
          password: '',
        },
        rules:{
          userName:[{required:true,message:'请输入账号',trigger:'blur'}],
          password:[{required:true,message:'请输入密码',trigger:'blur'}],
        },
        bgImg:require('@/assets/login-background.jpg')
      };
    },
    mounted:function(){
      let isLogin = localStorage.getItem("token");
      if(isLogin){
        this.$router.push('/home');
      }
    },
    methods: {
      submitForm(ruleForm) {
        const _this = this;
        this.$refs[ruleForm].validate((valid) => {  //开启校验
          if (valid) {   // 如果校验通过，请求接口，允许提交表单

            const formData = JSON.stringify(_this.login);
            _this.$axios.post(Login.login, formData,{headers: {'Content-Type': 'application/json'}})
              .then((res) => {
                // console.log(res)
                if (res.data.resultCode == 0) {
                  localStorage.setItem("token",res.data.data.token)
                  localStorage.setItem("userName",_this.login.userName)
                  localStorage.setItem("pwd1",_this.login.password);
                  _this.$router.push('/home');
                }else{
                  _this.$message(res.data.resultMsg);
                }
              })
              .catch((error) => {
                window.console.log(error);
              })

          } else {   //校验不通过
            return false;
          }
        });

      }
    }
  }
</script>

<style scoped>
.title{
  line-height: 60px;
  color: #333;
  text-align: center;
  font-weight: bold;

}
.login{
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;
  width: 100%;
  height: 100%;
}
.login-box{
  width: 350px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin: -90px 0 0 -205px;
  background: #FFF;
  border-radius: 10px;
  padding: 10px 30px 10px 30px;
}
/* .el-input,.el-checkbox{
  margin-bottom: 30px;
} */
</style>

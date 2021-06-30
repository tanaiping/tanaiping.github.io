<template>
  <div class="login" :style="{backgroundImage:'url('+bgImg+')'}">
    <div class="login-box">
      <div class="title">智能停车</div>
      <el-input v-model="name" placeholder="请输入账号" style="width: 100%;margin-bottom: 30px;"></el-input>
      <el-input v-model="pwd" placeholder="请输入密码" style="width: 100%;margin-bottom: 30px;"></el-input>
      <el-button type="primary" style="width: 100%;margin-bottom: 30px;" @click="submitForm">登录</el-button>
    </div>

  </div>
</template>

<script>
  export default {
    name:"login",
    data() {
      return {
        name: '',
        pwd: '',
        bgImg:require('@/assets/login-background.jpg')
      };
    },
    mounted:function(){
      let isLogin = localStorage.getItem("userName");
      if(isLogin){
        this.$router.push('/home');
      }
    },
    methods: {
      submitForm() {
        localStorage.setItem("userName","logined")
        this.$router.push('/home');

      }
    }
  }
</script>

<style scoped>
.title{
  line-height: 50px;
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
  width: 300px;
  height: 230px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin: -90px 0 0 -150px;
  background: #FFF;
  border-radius: 10px;
  padding: 10px 30px 30px 30px;
}
input,button{
  margin-bottom: 30px;
}
</style>

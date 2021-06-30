<template>
  <div class="login">
    <button class="close" @click="closeThisPage">X</button>
    <!-- <router-link :to="{name: 'home'}"><button class="close" @click="this.$router.go(-1)">X</button></router-link> -->
    <h5 class="title">请登录花花特权</h5>
    <input class="msg mobile" type="number" v-model="mobile" placeholder="请输入手机号" />
    <div class="msg code">
      <input class="input" type="text" v-model="code" placeholder="请输入验证码" />
      <button :class="countdown > 0 ? 'get-code countdown' : 'get-code'"
        @click="getCode">{{countdown > 0 ? countdown + ' s' : '获取验证码' }}</button>
    </div>
    <button class="btn-public btn-login" @click="submitLogin">确认登录</button>
  </div>
</template>

<script>
  import {
    UserUrl
  } from '../../config/url';
  export default {
    name: '',
    data() {
      return {
        mobile: "",
        code: "",
        countdown: 0
      }
    },
    mounted() {},
    methods: {
      // 提交登录
      submitLogin() {
        const _this = this
        if (!_this.mobile || !_this.code) {
          _this.$toast('手机号码和验证码不能为空')
          return
        } else if (!/^1(1|2|3|4|5|6|7|8|9|0)\d{9}$/.test(_this.mobile)) {
          _this.$toast('请正确填写手机号码')
          return
        }
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "mobile": this.mobile,
          "thirdUid": "",
          "type": 1,
          "verifyCode": this.code
        }
        _this.$axios.post(UserUrl.login, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              this.$toast('登录成功')
              this.$cookies.set("shopUserInfo", res.data.data, "30d")
              const backType = this.$route.query.backType
              if (backType == "goback") {
                this.$router.go(-1);
              } else {
                this.$router.push({
                  name: "home"
                })
              }
            } else {
              this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取验证码
      getCode() {
        const _this = this
        if (_this.countdown > 0) {
          return
        }
        if (!_this.mobile) {
          _this.$toast('手机号码不能为空')
          return
        } else if (!/^1(1|2|3|4|5|6|7|8|9|0)\d{9}$/.test(_this.mobile)) {
          _this.$toast('请正确填写手机号码')
          return
        }
        const formData = {
          "mobile": _this.mobile
        }
        _this.$axios.post(UserUrl.getCode, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.countdown = 60
              _this.countDown(60)
              _this.$toast('验证码发送成功')
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      countDown(time) {
        if (this.countdown > 0) {
          setTimeout(() => {
            this.countdown = time - 1
            this.countDown(time - 1)
          }, 1000);
        } else {
          this.countdown = 0
        }
      },
      closeThisPage() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .close {
    position: absolute;
    top: 1rem;
    right: 0.3rem;
    font-size: 0.24rem;
    color: #666;
    border: none;
    background: none;
  }

  .title {
    font-size: 0.48rem;
    margin-top: 1.8rem;
    margin-left: 0.3rem;
  }

  .msg {
    display: flex;
    width: 6.9rem;
    height: 0.88rem;
    margin: auto;
    margin-top: 0.2rem;
    padding: 0.2rem 0;
    border: none;
    border-bottom: solid 1px #eee;

    .input {
      margin: auto;
      margin-left: 0;
      border: none;
    }

    .get-code {
      margin: auto;
      margin-right: 0;
      font-size: 0.28rem;
      color: #333;
      border: none;
      background: no-repeat;
    }

    .get-code.countdown {
      color: #999;
    }
  }

  .mobile {
    margin-top: 0.8rem;
  }

  .btn-login {
    width: 6.9rem;
    height: 0.88rem;
    margin: auto;
    margin-top: 0.6rem;
    font-size: 0.36rem;
    border-radius: 0.44rem;
  }
</style>
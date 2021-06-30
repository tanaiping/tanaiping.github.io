<template>
  <div class="activation">
    <div class="tc">
      <img :src="require('@/assets/default_tx.png')" alt="" class="tx">
      <div class="activation-txt">激活账号</div>
      <div class="activation-acc">{{mobile}}</div>
      <div class="input-box"><input type="number" placeholder="会员卡号" v-model="cardNo"></div>
      <div class="input-box"><input type="number" placeholder="激活码" v-model="cardPwd"></div>
      <button class="btn-public activation-btn" @click="submitactivation">确认激活</button>
    </div>
  </div>
</template>

<script>
  import {
    UserUrl
  } from '../../config/url';

  export default {
    name: "activation",
    data() {
      return {
        "mobile": "",
        "uid": "",
        "cardNo": "",
        "cardPwd": "",
      };
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo");
      if (shopUserInfo) {
        this.uid = shopUserInfo.uid;
        this.mobile = shopUserInfo.mobile;
      } else {
        this.$toast("请先登录")
        this.$router.push({
          name: "login",
          query: {
            backType: "goback"
          }
        })
      }
    },
    methods: {
      submitactivation() {

        const _this = this
        // var uid = this.$route.query.uid;
        if (!_this.cardNo || !_this.cardPwd) {
          _this.$toast('卡号或密码不能为空')
          return false
        }
        const formData = {
          "cardNo": _this.cardNo,
          "cardPwd": _this.cardPwd,
          "uid": _this.uid //'242366258138736640193622366'
        }
        _this.$axios.post(UserUrl.activateCard, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              this.$router.push({
                name: "actsuccess",
              })
            } else {
              this.$toast(res.data.resultMsg);
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },


    },

  }
</script>

<style scoped>
  .activation {
    padding-top: 0.6rem;
    width: 5.8rem;
    margin: 0 auto;
  }

  .tc {
    text-align: center;
  }

  .tx {
    width: 1.8rem;
    height: 1.8rem;
  }

  .activation-txt {
    height: 0.42rem;
    color: #333;
    font-size: 0.3rem;
    margin: 0.2rem 0;
  }

  .activation-acc {
    font-size: 0.4rem;
    color: #333;
    height: 0.56rem;
    margin-bottom: 0.4rem;
  }

  .input-box {
    background-color: #f8f8f8;
    border-radius: 0.5rem;
    width: 100%;
    height: 1rem;
    overflow: hidden;
    margin-bottom: 0.3rem;
  }

  .input-box input {
    border: none;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    color: #333;
    background-color: #f8f8f8;
    text-align: center;
    font-size: 0.32rem;
  }

  .activation-btn {
    width: 5.8rem;
    height: 0.94rem;
    line-height: 0.94rem;
    border-radius: 0.4rem;
  }
</style>
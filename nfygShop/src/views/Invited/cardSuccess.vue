<template>
  <div class="pay-wrap">
    <div class="black-formsbg"
         v-show="isShow"></div>
    <div class="form-box pay-success"
         v-show="paySuccess">
      <div class="title">支付成功</div>
      <!--送您7天特权体验有效期至2019年12月19日收到实体卡后记得激活哦~-->
      <div class="con">送您7天特权体验，收到实体卡后记得激活哦~</div>
      <div class="tc"><img :src="require('@/assets/card_img.png')"
             alt=""
             class="promp-img1"></div>
      <div class="flex-btnbox">
        <div class="btn-public onload-btn"
             @click="goIndex">去逛逛</div>
      </div>
    </div>
    <div class="form-box pay-lose"
         v-show="payLose">
      <div class="title">支付失败</div>
      <div class="con">很可惜，与100+种特权擦肩而过</div>
      <div class="flex-btnbox">
        <div class="giveUp-btn"
             @click="goBuy">关闭</div>
        <div class="btn-public contitue-btn"
             @click="goBuy">重新购买</div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  UserUrl
} from '../../config/url'
export default {
  name: "",
  data () {
    return {
      "isShow": true, //为true 弹窗遮罩层显示
      "paySuccess": false, //为true 支付成功弹窗
      "payLose": false,
      "orderNo": "",
    };
  },
  mounted () {
    this.getOrder();
  },
  methods: {
    //查询订单信息
    getOrder () {
      const _this = this
      const orderNo = _this.$route.query.orderNo;
      const shopUserInfo = _this.$cookies.get("shopUserInfo")
      const formData = {
        "goodsType": "CARD", //COUPON-卡券 RIGHT-权益 CARD-会员卡 GOODS-商品
        "orderNo": orderNo,
        "payType": 1,
        "uid": shopUserInfo.uid //  shopUserInfo.uid
      }
      _this.$axios.post(UserUrl.payCardQuery, formData)
        .then((res) => {
          // window.console.log(res);
          if (res.data.resultCode == 0) {
            if (res.data.data == 'success') {
              _this.isShow = true;
              _this.paySuccess = true;
            } else {
              _this.isShow = true;
              _this.payLose = true;
            }
          } else {
            this.$toast(res.data.resultMsg);
          }
        })
        .catch((error) => {
          window.console.log(error);
        })
    },
    goIndex () {
      this.$router.push({
        name: "home",
      })
    },
    goBuy () {
      this.$router.push({
        name: "perfectinfo",
      })
    }


  }
}
</script>

<style scoped>
body {
  background-color: #f8f8f8;
}

.tc {
  text-align: center;
}

.black-formsbg {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 101;
  background-color: #000;
  opacity: 0.7;
}

.form-box {
  position: fixed;
  left: 50%;
  top: 50%;
  border-radius: 0.08rem;
  background-color: #fff;
  width: 5.4rem;
  padding: 0.4rem;
  margin: -2.5rem 0 0 -2.7rem;
  z-index: 1000;
}

.form-box .title {
  font-size: 0.32rem;
  color: #333;
  text-align: center;
}

.form-box .con {
  padding: 0.5rem 0;
  font-size: 0.28rem;
  line-height: 0.32rem;
  text-align: center;
  color: #333;
}

.flex-btnbox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.giveUp-btn {
  width: 2.2rem;
  height: 0.88rem;
  line-height: 0.88rem;
  text-align: center;
  border-radius: 0.4rem;
  color: #ffffff;
  background-color: #d3d3d3;
}

.contitue-btn {
  width: 2.2rem;
  height: 0.88rem;
  line-height: 0.88rem;
  text-align: center;
  border-radius: 0.4rem;
}

.onload-btn {
  width: 100%;
  border-radius: 0.4rem;
  height: 0.88rem;
  line-height: 0.88rem;
  text-align: center;
}

.promp-img1 {
  width: 100%;
  padding-bottom: 0.3rem;
}
</style>
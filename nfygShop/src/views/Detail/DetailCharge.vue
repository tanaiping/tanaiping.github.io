<template>
  <!-- 卡券详情页面和权益详情页面，公用样式 -->
  <!-- 通过路径参数detailType区分 -->
  <!-- detailType == 'coupon' 是卡券详情 -->
  <!-- detailType == 'right' 是权益详情 -->
  <div class="detail-right bg-public" :style="rightBgImg">
    <div class="goods">
      <div class="img">
        <img class="img" :src="detailCharge.imageUrl || require('@/assets/nfyg_180_180.png')" alt="花生地铁">
      </div>
      <div class="info">
        <h5 class="name">{{detailCharge.chargeName}}</h5>
      </div>
    </div>
    <div class="content">
      <div class="row">
        <h5 class="mid-title">直充账号</h5>
        <div class="acc-input"><input type="text" placeholder="请输入充值账号" v-model="chargeAccount" maxlength="30" />
        </div>
      </div>
      <div class="red-tips">*购买须知：请确保账号无误，充值成功后不支持退换</div>
      <div v-if="!(typeList.length==1&&typeList[0]=='默认类型')">
        <div class="row">
          <h5 class="mid-title">直充类型</h5>
          <div class="typebox">
            <div :class="i==typeIndex?'act':''" v-for="(item, i) in typeList" :key="i" @click="changeType(i,item)"
              :type="item">{{item}}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <h5 class="mid-title">直充规格</h5>
        <div class="productbox">
          <div class="product-elem" v-for="(item, x) in initProductList" :key="x">
            <div :class="x==productIndex?'act':''" @click="changeProduct(x,item.productId)" :productId="item.productId">
              <span class="t1">{{item.productName}}</span>
              <span class="t2"><em>{{(item.salePrice)/100}}</em>元</span>
              <span class="t3">官方价{{(item.price)/100}}元</span>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-show="tips">
        <h5 class="min-title">充值说明</h5>
        <p class="desc" v-html="tips"></p>
      </div>
    </div>
    <div class="foot">
      <div class="call" @click="onlineService"><span class="icon-call"></span><br />联系客服</div>
      <button class="btn-public pay" @click="payCoupon">立即充值</button>
    </div>

    <!-- 确认充值提示 -->
    <van-popup v-model="isSubmitPopup" class="popup-public popup-down">
      <h5 class="title">充值提示</h5>
      <p class="tips">
        请确认账号无误，充值后将无法退换<br />
        {{chargeAccount}}<br />
        {{detailCharge.chargeName}}({{type}})
      </p>
      <div class="button">
        <button class="cancel" @click="isSubmitPopup = false">取消</button>
        <button class="back" @click="goCharge">立即充值</button>

      </div>
    </van-popup>
    <!-- 绑定用户弹窗 -->
    <van-popup v-model="isAuthPopup" class="popup-public popup-auth">
      <h5 class="title">绑定手机号</h5>
      <van-radio-group :border='false' class="contain">
        <input class="row mobile" type="number" v-model="mobile" placeholder="请输入手机号" />
        <div class="row code">
          <input class="input" type="text" v-model="code" placeholder="请输入验证码" />
          <button :class="countdown > 0 ? 'get-code countdown' : 'get-code'"
            @click="getCode">{{countdown > 0 ? countdown + ' s' : '获取验证码' }}</button>
        </div>
      </van-radio-group>
      <button class="btn-public btn" @click="submitLogon">确认</button>
      <p class="tips">为了您有更好的用户体验，请绑定已激活的手机号码。如未激活，请绑定常用手机号码。</p>
    </van-popup>
  </div>
</template>

<script>
  import {
    ChargeUrl,
    UserUrl
  } from '../../config/url'
  import {
    browser,
    getUserInfo,
    pushToLoginView
  } from '../../server/nfygCommon'

  export default {
    name: '',
    data() {
      return {
        shopUserInfo: {
          "vipType": 0
        },
        rightBgImg: {
          background: '#F8F8F8 url(' + require("@/assets/nfyg_750_312.png") + ') no-repeat center top / 100%'
        },
        detailCharge: {},
        productList: [],
        initProductList: [],
        typeList: [],
        isAuthPopup: false,
        countdown: 0,
        mobile: "",
        code: "",
        price: "-",
        salePrice: "-",
        disPrice: "-",
        panicPrice: "-",
        tips: "",
        chargeAccount: "",
        type: "",
        typeIndex: 0,
        productId: "",
        productIndex: 0,
        isSubmitPopup: false,
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      this.getDataDetailCharge()
      const chargeAccount = this.$cookies.get("chargeAccount");
      if (chargeAccount) {
        this.chargeAccount = chargeAccount;
      }

    },
    watch: {
      $route: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.getDataDetailCharge(); //重新调用加载函数
        }
      }
    },
    methods: {
      // 获取初始化数据 --- 卡券详情
      getDataDetailCharge() {
        const _this = this
        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "chargeId": query.chargeId,
        }
        _this.$axios.post(ChargeUrl.chargeDetail, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.detailCharge = res.data.data
              _this.tips = res.data.data.typeList[0].productList[0].tips
              _this.type = res.data.data.typeList[0].type
              _this.productId = res.data.data.typeList[0].productList[0].productId

              _this.detailCharge.typeList.forEach((item, i) => {
                _this.typeList.push(item.type);
                _this.productList.push(item.productList);
              });
              _this.initProductList = _this.productList[0];
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },

      // 直充支付 - 去提交订单页
      payCoupon() {
        let nfygUser = JSON.parse(getUserInfo())
        if (this.chargeAccount == "") {
          this.$toast('请输入充值账号')
          return
        }
        // window.console.log(nfygUser);
        if (browser.isNfyg && !nfygUser.userId) {
          pushToLoginView()
          return
        }
        if (this.shopUserInfo.uid) {
          this.isSubmitPopup = true;
        } else {
          if (browser.isNfyg) {
            if (nfygUser.userId) {
              // this.$toast("请先绑定手机号码")
              this.isAuthPopup = true
            } else {
              pushToLoginView()
            }
          } else {
            this.$toast("请先登录")
            setTimeout(() => {
              this.$router.push({
                name: "login"
              })
            }, 2000);
          }
        }
      },
      goCharge() {
        this.$cookies.set("chargeAccount", this.chargeAccount);
        this.$router.push({
          name: 'ordercharge',
          query: {
            chargeId: this.detailCharge.chargeId,
            type: this.type,
            chargeAccount: this.chargeAccount,
            productId: this.productId,
          }
        })
      },
      // 切换直充类型
      backToUpLevel() {
        this.$router.go(-1);
      },
      // 切换直充规格
      changeType(i, type) {
        const _this = this
        _this.typeIndex = i;
        _this.type = type;
        _this.initProductList = _this.productList[i]
        // _this.type = _this.$refs.type;
      },
      // 返回上一层
      changeProduct(i, productId) {
        const _this = this
        _this.productIndex = i;
        _this.productId = productId;
      },
      // 获取验证码
      getCode() {
        const _this = this
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
      // 提交登录（绑定花生地铁用户信息）
      submitLogon() {
        const _this = this
        if (!_this.mobile || !_this.code) {
          _this.$toast('手机号码和验证码不能为空')
          return
        } else if (!/^1(1|2|3|4|5|6|7|8|9|0)\d{9}$/.test(_this.mobile)) {
          _this.$toast('请正确填写手机号码')
          return
        }
        let nfygUser = JSON.parse(getUserInfo())
        // window.console.log(nfygUser);
        if (!nfygUser.userId) {
          pushToLoginView()
          return
        }
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "mobile": _this.mobile,
          "thirdUid": nfygUser.userId,
          "type": 2,
          "verifyCode": _this.code
        }
        _this.$axios.post(UserUrl.login, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              this.isAuthPopup = false;
              _this.shopUserInfo = res.data.data
              _this.$cookies.set("shopUserInfo", res.data.data, "30d")
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 倒计时
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
      equityCard() {
        this.$router.push({
          name: "equity",
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .detail-right {
    min-height: 100%;
    background: #f8f8f8 url(../../assets/nfyg_750_312.png) no-repeat center top / 100%;
  }

  .bg {
    position: absolute;
  }

  .cell {
    position: absolute;
    width: 100%;
    top: 1.78rem;
  }

  .goods {
    display: flex;
    width: 6.9rem;
    margin: auto;
    margin-top: 1.2rem;
    padding: 0.3rem 0.2rem;
    background: #fff;
    border-radius: 0.16rem;

    .img {
      position: relative;
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 0.04rem;

      .countdown {
        position: absolute;
        width: 1.5rem;
        height: 0.6rem;
        background: linear-gradient(90deg,
            rgba(255, 240, 211, 1) 0%,
            rgba(255, 240, 194, 1) 100%);
        border-radius: 0px 0.32rem 0px 0.04rem;
        bottom: 0;
        font-size: 0.18rem;
        font-weight: 500;
        color: #916b3a;
        text-align: center;
        margin: auto;
      }
    }

    .info {
      margin-left: 0.3rem;
      line-height: 1.5;

      .name {
        font-size: 0.3rem;
        font-weight: 500;
        color: #333;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: normal;
      }

      .value {
        font-size: 0.26rem;
        color: #999;
        margin-top: 0.05rem;

        .value-1 {
          text-decoration: line-through;
        }

        .value-2 {
          color: #333;
          margin-left: 0.2rem;
        }
      }

      .member {
        display: flex;

        .price {
          font-size: 0.4rem;
          color: #ff3b30;
        }

        .tag-s {
          width: 0.72rem;
          // height: 0.3rem;
          margin: auto;
          margin-left: 0.1rem;
        }
      }

      .return {
        padding: 0.07rem 0.1rem;
        font-size: 0.24rem;
        color: #916b3a;
        border-radius: 0.06rem;
        background: linear-gradient(90deg,
            rgba(255, 240, 211, 0.5) 0%,
            rgba(255, 240, 194, 0.5) 100%);

        span {
          padding: 0.05rem;
          margin-right: 0.1rem;
          border: solid 1px #916b3a;
          border-radius: 0.1rem;
        }
      }
    }
  }

  .content {
    width: 6.9rem;
    margin: auto;
    margin-top: 0.2rem;
    margin-bottom: 1.55rem;
    padding: 0.3rem;
    background: #fff;
    border-radius: 0.16rem;

    .row {
      margin-top: 0.4rem;

      .title {
        font-size: 0.28rem;
        padding-left: 0.1rem;
        color: #333;
        border-left: solid 0.06rem #ff5656;
        line-height: 1.2;
      }

      .desc {
        font-size: 0.28rem;
        color: #666;
        margin-top: 0.1rem;
      }
    }

    .row:first-child {
      margin-top: 0.1rem;
    }
  }

  .foot {
    position: fixed;
    bottom: 0;
    padding: 0.22rem 0.3rem;
    display: flex;
    margin: auto;
    width: 100%;
    background: #fff;

    .call {
      font-size: 0.24rem;
      text-align: center;
      margin: auto;

      span {
        font-size: 0.5rem;
      }
    }

    .pay {
      width: 4.8rem;
      height: 0.8rem;
      background: linear-gradient(270deg,
          rgba(255, 86, 86, 1) 0%,
          rgba(249, 46, 46, 1) 100%);
      border-radius: 0.4rem;
      font-size: 0.32rem;
      font-weight: bold;
      color: #fff;
      line-height: 0.8rem;
      text-align: center;
      margin: auto;
      margin-right: 0.1rem;
    }
  }

  .popup-auth {
    .contain {
      .row {
        display: flex;
        width: 4.8rem;
        height: 0.88rem;
        margin: auto;
        margin-top: 0.4rem;
        border-radius: 0.44rem;
        background: #f8f8f8;
      }

      input {
        padding: 0.2rem 0.3rem;
        border: none;
        border-radius: 0.44rem;
        background: #f8f8f8;
      }

      .code {
        display: flex;

        .input {
          flex: 1;
          width: 3rem;
        }

        .get-code {
          border: none;
          background: none;
          color: #ff5656;
          font-size: 0.24rem;
          flex: 1;
        }

        .get-code.countdown {
          color: #999;
        }
      }
    }

    .btn {
      width: 4.6rem;
      height: 0.88rem;
      margin: auto;
      margin-top: 0.6rem;
      border-radius: 0.44rem;
    }

    .tips {
      margin-top: 0.4rem;
      font-size: 0.24rem;
      color: #999;
    }
  }

  .mid-title {
    line-height: .4rem;
    color: #333;
    margin-bottom: .2rem;
    font-size: .28rem;
  }

  .acc-input {
    border-bottom: 1px solid #eee;
    width: 100%;
    padding: .12rem;
    font-size: .44rem;
  }

  .acc-input input {
    width: 100%;
    line-height: .62rem;
    height: .62rem;
    border: none;
  }

  .typebox {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

  }

  .typebox div {
    white-space: nowrap;
    padding: .17rem .45rem;
    border: 1px solid #DFDFDF;
    margin-right: .32rem;
    margin-bottom: .2rem;
    border-radius: .1rem;

  }

  .typebox div.act {
    border-color: #FF5656;
    background-color: #ffeeee;
  }

  .productbox {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
  }

  .productbox .product-elem {
    width: calc((100% - .3rem)/3);
    white-space: nowrap;
    margin-bottom: .2rem;
  }

  .productbox .product-elem:nth-child(3n+2) {
    margin-left: .15rem;
    margin-right: .15rem;
  }

  .productbox .product-elem div {
    border: 1px solid #DFDFDF;
    border-radius: .1rem;
    display: flex;
    flex-direction: column;

  }

  .productbox .product-elem div.act {
    border-color: #FF5656;
    background-color: #ffeeee;
  }

  .productbox div .t1 {
    line-height: .7rem;
    font-size: .26rem;
  }

  .productbox div .t2 {
    line-height: .5rem;
    font-size: .32rem;
  }

  .productbox div .t2 em {
    font-weight: bold;
  }

  .productbox div .t3 {
    line-height: .8rem;
    font-size: .26rem;
    text-decoration: line-through;
    color: #666;
  }

  .red-tips {
    color: #FF3B30;
    font-size: .24rem;
    padding: .2rem 0 .56rem 0;
    line-height: .32rem;
  }
</style>
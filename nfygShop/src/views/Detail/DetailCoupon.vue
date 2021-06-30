<template>
  <!-- 卡券详情页面和权益详情页面，公用样式 -->
  <!-- 通过路径参数detailType区分 -->
  <!-- detailType == 'coupon' 是卡券详情 -->
  <!-- detailType == 'right' 是权益详情 -->
  <div class="detail-right bg-public" :style="rightBgImg">
    <div class="goods">
      <div class="img">
        <img class="img" :src="detailCoupon.logo || require('@/assets/nfyg_180_180.png')" alt="花生地铁">
        <div v-if="$route.query.entryType == 3" class="countdown">
          距结束:{{day}}天<br />{{hour}}:{{minute}}:{{seconds}}</div>
      </div>
      <div class="info">
        <h5 class="name">{{detailCoupon.couponName}}</h5>
        <p class="value"><span class="value-1">市场价 ¥{{regFenToYuan(price) || '--'}}</span><span class="value-2">优惠价
            ¥{{regFenToYuan(salePrice) || '--'}}</span></p>
        <!-- 花生权益和花花推荐 -->
        <div class="member" v-if="$route.query.entryType == 1 || $route.query.entryType == 5">
          <h5 class="price">￥{{regFenToYuan(disPrice) || '--'}}</h5>
          <img class="tag-s" :src="require('@/assets/tag_s.png')" @click="equityCard" alt="花花权益价">
        </div>
        <!-- 兑换专区 -->
        <div class="member" v-if="$route.query.entryType == 2 && detailCoupon.excPrice > 0">
          <h5 class="price">
            ￥{{regFenToYuan(detailCoupon.excPrice) || '--'}}<span class="add"> +
            </span><span class="icon-coin"><span class="path1"></span><span class="path2"></span><span
                class="path3"></span></span>
            {{detailCoupon.excPoint}}</h5>
          <img class="tag-s" :src="require('@/assets/tag_s.png')" @click="equityCard" alt="花花权益价">
        </div>
        <div class="member" v-if="$route.query.entryType == 2 && detailCoupon.excPrice == 0">
          <h5 class="price"><span class="icon-coin"><span class="path1"></span><span class="path2"></span><span
                class="path3"></span></span>
            {{detailCoupon.excPoint}}</h5>
          <img class="tag-s" :src="require('@/assets/tag_s.png')" @click="equityCard" alt="花花权益价">
        </div>
        <!-- 限时抢购 -->
        <div class="member" v-if="$route.query.entryType == 3">
          <h5 class="price">￥{{regFenToYuan(panicPrice) || '--'}}</h5>
          <img class="tag-s" :src="require('@/assets/tag_s.png')" @click="equityCard" alt="花花权益价">
        </div>
        <p class="return" v-show="detailCoupon.returnPoint"><span>返</span>会员每件可返{{detailCoupon.returnPoint}}花花币
        </p>
      </div>
    </div>
    <div class="content">
      <div class="row" v-show="detailCoupon.remark">
        <h5 class="title">购买须知</h5>
        <p class="desc" v-html="detailCoupon.remark"></p>
      </div>
      <div class="row" v-show="detailCoupon.shop">
        <h5 class="title">适用门店</h5>
        <p class="desc" v-html="detailCoupon.shop"></p>
      </div>
      <div class="row" v-show="detailCoupon.deadline">
        <h5 class="title">有效期</h5>
        <p class="desc">{{detailCoupon.deadline}}</p>
      </div>
      <div class="row" v-show="detailCoupon.phone">
        <h5 class="title">商家电话</h5>
        <a :href="'tel:' + detailCoupon.phone">
          <p class="desc">{{detailCoupon.phone}}</p>
        </a>
      </div>
    </div>
    <div class="foot">
      <div class="call" @click="onlineService"><span class="icon-call"></span><br />联系客服</div>
      <button class="btn-public pay" @click="payCoupon">{{detailCoupon.stockNum > 0 ? '立即购买' : '已售空'}}</button>
    </div>
    <!-- 商品下架提示 -->
    <van-popup v-model="isDownPopup" class="popup-public popup-down">
      <h5 class="title">下架提示</h5>
      <p class="tips">该商品已不存在，换个商品看看</p>
      <div class="button">
        <button class="cancel" @click="backToUpLevel">取消</button>
        <button class="back" @click="backToUpLevel">返回</button>
      </div>
    </van-popup>
    <!-- 非会员办理会员卡提示 -->
    <van-popup v-model="isVipPopup" class="popup-public popup-down">
      <h5 class="title">温馨提示</h5>
      <p class="tips">您还不是花花卡会员，办理才享有优惠哦~</p>
      <div class="button">
        <button class="cancel" @click="isVipPopup = false">取消</button>
        <button class="back" @click="$router.push({name:'perfectinfo'})">免费办理</button>
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
    CouponUrl,
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
        detailCoupon: {},
        day: "0",
        hour: "00",
        minute: "00",
        seconds: "00",
        isDownPopup: false,
        isVipPopup: false,
        isAuthPopup: false,
        countdown: 0,
        mobile: "",
        code: "",
        price: "-",
        salePrice: "-",
        disPrice: "-",
        panicPrice: "-",
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      if (this.$route.query.isAgain == 1) {
        this.getDataDetailCouponAgain()
      } else {
        this.getDataDetailCoupon()
      }
    },
    watch: {
      $route: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.getDataDetailCoupon(); //重新调用加载函数
        }
      }
    },
    methods: {
      // 获取初始化数据 --- 卡券详情
      getDataDetailCoupon() {
        const _this = this
        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "couponId": query.couponId,
          "entryType": query.entryType,
          "activeId": query.activeId || ""
        }
        _this.$axios.post(CouponUrl.couponDetail, formData)
          .then((res) => {
            //window.console.log(res.data.data);
            if (res.data.resultCode == 0) {
              _this.detailCoupon = res.data.data
              _this.price = res.data.data.price
              _this.salePrice = res.data.data.salePrice
              _this.disPrice = res.data.data.disPrice
              _this.panicPrice = res.data.data.panicPrice
              this.rightBgImg = {
                background: '#F8F8F8 url(' + res.data.data.detailLogoList[0] +
                  ') no-repeat center top / 100%'
              }
              if (res.data.data.overSeconds > 0) {
                _this.aniCountdown(res.data.data.overSeconds)
              }
			  const shareDetailGoods = {
			    imageUrl: res.data.data.detailLogoList[0],
			    title: res.data.data.couponName,
			  }
			  _this.$cookies.set("shareDetailGoods", shareDetailGoods)
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 卡券再次购买
      getDataDetailCouponAgain() {
        const _this = this
        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "couponId": query.couponId,
          "entryType": query.entryType,
          "activeId": query.activeId || ""
        }
        _this.$axios.post(CouponUrl.couponBuyAgain, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.detailCoupon = res.data.data
              _this.price = res.data.data.price
              _this.salePrice = res.data.data.salePrice
              _this.disPrice = res.data.data.disPrice
              _this.panicPrice = res.data.data.panicPrice
              this.rightBgImg = {
                background: '#F8F8F8 url(' + res.data.data.detailLogoList[0] +
                  ') no-repeat center top / 100%'
              }
              if (res.data.data.overSeconds > 0) {
                _this.aniCountdown(res.data.data.overSeconds)

              }
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 卡券支付 - 去提交订单页
      payCoupon() {
        let nfygUser = JSON.parse(getUserInfo())
        // window.console.log(nfygUser);
        if (browser.isNfyg && !nfygUser.userId) {
          pushToLoginView()
          return
        }
        if (this.shopUserInfo.uid) {
          if ((this.$route.query.entryType == 3 || this.$route.query.entryType == 2) && this.shopUserInfo
            .vipType == 0) {
            // this.$toast("只有花花会员才可以参与活动哦！")
            this.isVipPopup = true
            return
          } else {
            this.$router.push({
              name: 'ordercoupon',
              query: {
                orderType: 'coupon',
                couponId: this.detailCoupon.id,
                entryType: this.$route.query.entryType,
                activeId: this.$route.query.activeId
              }
            })
          }
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
      // 返回上一层
      backToUpLevel() {
        this.$router.go(-1);
      },
      // 倒计时时间
      aniCountdown(t) {
        let time_day, time_hour, time_minute, time_second;
        if (t > 0) {
          time_day = Math.floor(t / 60 / 60 / 24);
          time_hour = Math.floor(t / 60 / 60 % 24);
          time_minute = Math.floor(t / 60 % 60);
          time_second = Math.floor(t % 60);
          if (time_hour < 10) {
            time_hour = "0" + time_hour;
          }
          if (time_minute < 10) {
            time_minute = "0" + time_minute;
          }
          if (time_second < 10) {
            time_second = "0" + time_second;
          }
          if (time_hour > 0) {
            this.day = time_day
            this.hour = time_hour
            this.minute = time_minute
            this.seconds = time_second
          } else if (time_minute > 0) {
            this.day = time_day
            this.hour = "00"
            this.minute = time_minute
            this.seconds = time_second
          } else if (time_second > 0) {
            this.day = time_day
            this.hour = "00"
            this.minute = "00"
            this.seconds = time_second
          }
          setTimeout(() => {
            t--
            this.aniCountdown(t)
          }, 1000);
        } else {
          if (this.$route.query.isAgain == 1) {
            this.getDataDetailCouponAgain()
          } else {
            this.getDataDetailCoupon()
          }
          // 商品下架提示
          this.isDownPopup = true
        }
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
    margin-top: 1.78rem;
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
</style>
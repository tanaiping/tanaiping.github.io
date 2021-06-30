<template>
  <!-- 卡券详情页面和权益详情页面，公用样式 -->
  <!-- 通过路径参数detailType区分 -->
  <!-- detailType == 'coupon' 是卡券详情 -->
  <!-- detailType == 'right' 是权益详情 -->
  <div class="detail-right bg-public" :style="rightBgImg">
    <div class="goods">
      <img class="img" :src="detailRight.rightLogo || require('@/assets/nfyg_180_180.png')" alt="花生地铁">
      <div class="info">
        <h5 class="name">{{detailRight.rightName}}</h5>
        <p class="value"><span class="value-1">市场价 ¥{{regFenToYuan(detailRight.price) || '--'}}</span><span
            class="value-2">优惠价 ¥{{regFenToYuan(detailRight.salePrice) || '--'}}</span></p>
        <div class="member">
          <h5 class="price">￥{{regFenToYuan(detailRight.disPrice) || '--'}}</h5>
          <img class="tag-s" :src="require('@/assets/tag_s.png')" @click="equityCard" alt="花花权益价">
        </div>
      </div>
    </div>
    <div class="content">
      <div class="row" v-show="detailRight.remark">
        <h5 class="title">购买须知</h5>
        <p class="desc" v-html="detailRight.remark"></p>
      </div>
    </div>
    <div class="foot">
      <div class="call" @click="onlineService"><span class="icon-call"></span><br />联系客服</div>
      <button class="btn-public pay" @click="payRight">立即购买</button>
    </div>
  </div>
</template>

<script>
  import {
    RightUrl
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
        detailRight: {}
      }
    },
    watch: {
      $route: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.getDataDetailRight();
        }
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      this.getDataDetailRight()
    },
    methods: {
      // 获取初始化数据 --- 权益详情
      getDataDetailRight() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "rightId": _this.$route.query.rightId,
        }
        _this.$axios.post(RightUrl.rightDetail, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.detailRight = res.data.data
              if (_this.detailRight.detailLogoList && _this.detailRight.detailLogoList.length > 0) {
                _this.rightBgImg = {
                  background: '#F8F8F8 url(' + _this.detailRight.detailLogoList[0] +
                    ') no-repeat center top / 100%'
                }
              }
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 权益支付 - 去提交订单页
      payRight() {
        let nfygUser = JSON.parse(getUserInfo())
        // window.console.log(nfygUser);
        if (browser.isNfyg && !nfygUser.userId) {
          pushToLoginView()
          return
        }
        if (this.shopUserInfo.uid) {
          this.$router.push({
            name: 'orderright',
            query: {
              orderType: 'right',
              rightId: this.detailRight.id
            }
          })
        } else {
          if (browser.isNfyg) {
            if (nfygUser.userId) {
              this.$toast("请先绑定手机号码")
              // this.isAuthPopup = true
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
</style>
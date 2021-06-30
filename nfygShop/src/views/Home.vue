<template>
  <div class="home">
    <div class="search">
      <img class="head-img" @click="linkToUserHome"
        :src="shopUserInfo ? shopUserInfo.headUrl : '' || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head_default.png'"
        alt="">
      <p class="nick-name" @click="linkToUserHome">{{shopUserInfo ? shopUserInfo.nickName : '' || '登录/注册>'}}</p>
      <!-- <form class="input" action="/">
              <van-search
                class="input-col"
                v-model="searchValue"
                placeholder="搜索你需要的商品热门关键词"
                shape="round"               
              />
            </form> -->
    </div>
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" class="bg-public" :style="{background: '#fff'}"
      @refresh="onRefresh">
      <!-- 初始化获取数据，加载中... -->
      <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '1.5rem'}" vertical>加载中...
      </van-loading>
      <!-- <van-cell-group class="hot" :border='false'>
        <van-row class="hot-row" type="flex" justify="wrap">
          <template v-for="(item, i) in chargeData">
            <div class="col" v-if="i < 10"  @click = 'linkToCharge(item,i)'> 
              <div class="icon">
                <img :src="item.imageUrl" alt="">
              </div>
              <p class="name">{{item.title.length>6?item.title.substring(0,6):item.title}}</p>
              <p class="subtitle">{{item.subTitle.length>8?item.subTitle.substring(0,8):item.subTitle}}</p>
            </div>
          </template>
        </van-row>
      </van-cell-group> -->
      <!-- 轮播图banner位置 -->
      <van-swipe class="banner" :autoplay="3000">
        <van-swipe-item v-for="(banner, index) in bannerData" :key="index">
          <img v-lazy="banner.bannerUrl" alt="banner" @click="linkToBanner(banner, index)" />
        </van-swipe-item>
      </van-swipe>
      <!-- 花花专区和花花推荐 -->
      <van-cell-group class="column" :border='false'>
        <!-- <div class="column-row">
          <h3 class="title">花花专区</h3>
          <div class="special">
            <div class="col exchange" @click="linkTospecial2">
            </div>
            <div class="col rushtobuy" @click="linkTospecial3">
            </div>
          </div>
        </div> -->
        <div class="column-row">
          <h3 class="title" :style="{paddingBottom: 0}">花花推荐</h3>
          <!--<van-pull-refresh  @refresh="getDataActivity">-->
          <Goods v-for="(item, i) in recommendList" :key="i" :goods="item"
            :detailType="item.type == 1 ? 'goods' : 'coupon'" :special="1" />
          <!--</van-pull-refresh>-->
        </div>
      </van-cell-group>
    </van-pull-refresh>
    <!-- 去办理会员弹窗 -->
    <div class="free-member" v-if="shopUserInfo ? (shopUserInfo.vipType == 0 ? true : false): false"
      @click="isVipPopup = true"></div>
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
    <!-- 去办理会员弹窗 -->
    <van-popup v-model="isVipPopup" closeable class="popup-public popup-vip">
      <div class="line">
        <p class="title">我已办理花花卡</p>
        <router-link :to="{name:'activation'}"><button class="btn-public-2 btn">激活花花卡</button>
        </router-link>
      </div>
      <div class="line next">
        <p class="title">我尚未办理花花卡</p>
        <router-link :to="{name:'perfectinfo'}"><button class="btn-public btn">立即免费办理</button>
        </router-link>
      </div>
    </van-popup>
  </div>
</template>


<script>
  const _czc = window._czc || []

  import Goods from '../components/Goods'

  import {
    GoodsUrl,
    RightUrl,
    ChargeUrl,
    UserUrl
  } from '../config/url'

  import {
    browser,
    getUserInfo,
    pushToLoginView
  } from '../server/nfygCommon'

  export default {
    name: '',
    data() {
      return {
        countdown: 0,
        shopUserInfo: "",
        nfygUserInfo: "",
        searchValue: "",
        isAuthPopup: false,
        isVipPopup: false,
        mobile: "",
        code: "",
        hotData: [],
        chargeData: [],
        bannerData: [],
        recommendList: [],
        isLoading: false,
        isFirstLoading: true
      }
    },
	watch: {
	  $route: function (newVal, oldVal) {
	    if (newVal != oldVal) {
	      this.loadHome(); //重新调用加载首页
	    }
	  }
	},
    mounted() {
      this.loadHome();//封闭首页加载的方法 
      
    },
    methods: {
	  loadHome() {
		  const _this = this
		  const query = _this.$route.query
		  const agentKey = this.$route.query.agentKey
		  if (agentKey) {
		    _this.$cookies.set("shopAgentKey", this.$route.query.agentKey, "30d")
		  }
		  _this.shopUserInfo = _this.$cookies.get("shopUserInfo")
		  _this.getDataBanner()
		  _this.getDataActivity()
		  _this.getDataHot()
		  _this.getDataCharge()
		  this.$cookies.remove('chargeAccount') //清除直充账号cookie
		  const fromAppTodetail = (window.location.href.indexOf("#/detailgoods")!=-1) || (window.location.href.indexOf(
		    "#/detailcoupon")!=-1)
		  if (fromAppTodetail) {
		    const url = window.location.href.replace("#", "")
		    const search = url.substring(url.indexOf("?"))
		  		console.log(_this.getQueryString(search, "fromApp") == 1)
		    if (_this.getQueryString(search, "fromApp") == 1) {
		      _this.$router.push({
		        name: _this.getQueryString(search, "detailType") == 'goods' ? 'detailgoods' : 'detailcoupon',
		        query: {
		          fromApp: 1,
		          detailType: _this.getQueryString(search, "detailType") == 'goods' ? 'goods' : 'coupon',
		          goodsId: _this.getQueryString(search, "goodsId"),
		          couponId: _this.getQueryString(search, "couponId"),
		          activeId: _this.getQueryString(search, "activeId"),
		          checkSkuId: _this.getQueryString(search, "checkSkuId"),
		          entryType: _this.getQueryString(search, "entryType"),
		          cityName: _this.$cookies.get("ipPositionCity")
		        }
		      })
		    }
		  }
		  if (query.fromApp == 1) {
		    _this.$router.push({
		      name: query.detailType == 'goods' ? 'detailgoods' : 'detailcoupon',
		      query: {
		        fromApp: 1,
		        detailType: query.detailType == 'goods' ? 'goods' : 'coupon',
		        goodsId: query.goodsId,
		        couponId: query.couponId,
		        activeId: query.activeId,
		        checkSkuId: query.checkSkuId,
		        entryType: query.entryType,
		        cityName: _this.$cookies.get("ipPositionCity")
		      }
		    })
		  }
		  _czc.push(['_trackEvent', 'appcommerce_01', '曝光', '花生特权首页曝光']);
	  },
      // 下拉刷新
      onRefresh() {
        // this.$router.go(0);
        this.shopUserInfo = this.$cookies.get("shopUserInfo")
        this.getDataBanner()
        this.getDataActivity()
        this.getDataHot()
        this.getDataCharge()
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      // 获取热门权益
      getDataHot() {
        const _this = this
        const cityName = _this.$cookies.get("ipPositionCity")
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "cityName": cityName,
          "sign": "fdfc57a94fc480d3a872c9"
        }
        _this.$axios.post(RightUrl.hotIndex, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.hotData = res.data.data
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取直充列表
      getDataCharge() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9"
        }
        _this.$axios.post(ChargeUrl.chargeList, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.chargeData = res.data.data
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取banner信息
      getDataBanner() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo ? _this.shopUserInfo.uid : ""
        }
        _this.$axios.post(GoodsUrl.bannerList, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.bannerData = res.data.data
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取花花推荐
      getDataActivity() {
        const _this = this
		const cityName = _this.$cookies.get("ipPositionCity")
		window.console.log("cityName====="+cityName); 
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "entryType": 1,
		  "cityName":cityName,
        }
        _this.$axios.post(GoodsUrl.activityList, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.recommendList = res.data.data
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 跳转到用户主页（APP内区分是否已绑定手机号，APP外区分是否登录）
      linkToUserHome() {
        if (browser.isNfyg) {
          let nfygUser = JSON.parse(getUserInfo())
          this.nfygUserInfo = nfygUser
          if (!nfygUser.userId) {
            this.$cookies.remove("shopAuthData")
            this.$cookies.remove("shopUserInfo")
            pushToLoginView()
          } else {
            const authData = this.$cookies.get("shopAuthData")
            if (!authData) {
              this.isAuthPopup = true;
              this.mobile = ""
              this.code = ""
            } else {
              this.$router.push({
                name: "myhome"
              })
            }
          }
        } else {
          if (!this.shopUserInfo) {
            this.$router.push({
              name: "login"
            })
          } else {
            this.$router.push({
              name: "myhome"
            })
          }
        }
      },
      // 点击banner
      linkToBanner(banner, i) {
        _czc.push(['_trackEvent', 'appcommerce_20', '点击', 'banner进入详情页{site:' + i + ',bannerId:' + banner.bannerId +
          ',title:' + banner.title + '}'
        ]);
        window.location.href = banner.linkUrl
        // window.location.href = '/#/couponpage'
      },
      linkTospecial2() {
        _czc.push(['_trackEvent', 'appcommerce_21', '点击', '首页点击兑换专区']);
        this.$router.push({
          name: "special",
          query: {
            specialType: 2
          }
        })
      },
      linkTospecial3() {
        _czc.push(['_trackEvent', 'appcommerce_22', '点击', '首页点击限时抢购']);
        this.$router.push({
          name: "special",
          query: {
            specialType: 3
          }
        })
      },
	  // 点击直充icon
	  linkToCharge(item,i){
		  _czc.push(['_trackEvent', 'appinterest_0101', '点击', '首页运营位icon{site:' + (i+1) + ',name:' + item.title+'}'
		  ]);
		  window.location.href = item.linkUrl
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
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "mobile": _this.mobile,
          "thirdUid": _this.nfygUserInfo.userId,
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
              _this.authLogin()
            }
            this.$toast(res.data.resultMsg)
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
      // 获取路径参数信息
      getQueryString(url, name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = decodeURIComponent(url).substr(1).match(reg);
        if (r != null) {
          return decodeURI(r[2])
        }
        return null
      }
    },
    components: {
      Goods
    },
    beforeRouteLeave(to, from, next) {
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      next()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        document.body.scrollTop = vm.scrollTop
      })
    }
  }
</script>

<style lang="less" scoped>
  .search {
    display: flex;
    padding: 0.2rem 0.3rem 0 0.3rem;

    .head-img {
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      border: solid 1px #eee;
    }

    .nick-name {
      margin: auto;
      margin-left: 0.2rem;
      font-size: 0.3rem;
    }

    .input {
      width: 5.9rem;
      height: 0.7rem;
      margin: auto;
      margin-right: 0;

      .input-col {
        padding: 0;
      }
    }
  }

  .hot-row {
    width: 7.1rem;
    margin: .1rem auto 0 auto;
    display: flex;
    flex-flow: row wrap;

    .col {
      min-width: 1.42rem;
      margin-top: 0.12rem;
      width: 20%;
    }

    .icon {
      margin: auto;
      width: 0.8rem;
      height: 0.8rem;
      // background: #efefef;
      // background: linear-gradient(180deg, rgba(248, 214, 140, 1) 0%, rgba(225, 191, 135, 1) 100%);
      // opacity:0.2;
      border-radius: 50%;
      overflow: hidden;
    }

    .name {
      margin-top: 0.08rem;
      font-size: 0.24rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      text-align: center;
    }

    .subtitle {
      font-size: .2rem;
      color: #999;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .banner {
    width: 6.9rem;
    height: 2rem;
    margin: auto;
    margin-top: 0.3rem;
    border-radius: 0.08rem;
    overflow: hidden;
  }

  .column-row {
    .title {
      font-size: 0.36rem;
      color: #333;
      line-height: 1;
      margin: 0.3rem auto 0;
      padding: 0.2rem 0.3rem 0.3rem 0.3rem;
    }

    .special {
      display: flex;
      margin: auto;
      padding: 0 0.3rem;

      .col {
        width: 3.36rem;
        height: 1.62rem;
        flex: 1;
        background: url(../assets/special_2.png) no-repeat center / contain;
        border-radius: 0.04rem;
        margin: auto 0.2rem;
        margin-left: 0;
        padding: 0.2rem 0.3rem;

        h5 {
          font-size: 0.3rem;
          color: #333;
          line-height: 1.5;
        }

        p {
          font-size: 0.24rem;
          color: #999;
          line-height: 1.5;
          margin-top: 0.1rem;
        }

        .btn {
          width: 1.2rem;
          height: 0.36rem;
          background: linear-gradient(90deg,
              rgba(245, 127, 80, 1) 0%,
              rgba(253, 150, 109, 1) 100%);
          border-radius: 0.2rem;
          font-size: 0.2rem;
          font-weight: bold;
          color: #fff;
          line-height: 0.36rem;
          text-align: center;
          margin-top: 0.2rem;
        }
      }

      .rushtobuy {
        background: url(../assets/special_3.png) no-repeat center / contain;
        margin-right: 0;

        .btn {
          background: linear-gradient(90deg,
              rgba(119, 177, 246, 1) 0%,
              rgba(132, 196, 253, 1) 100%);
        }
      }
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

  .popup-vip {
    padding: 0.3rem;

    .line {
      margin: 0.3rem;
    }

    .btn {
      display: block;
      width: 4rem;
      height: 0.88rem;
      border-radius: 0.44rem;
      margin: auto;
      margin-top: 0.25rem;
      font-size: 0.32rem;
    }

    .next {
      padding-top: 0.3rem;
      border-top: dotted 1px #ccc;
    }
  }

  .free-member {
    position: fixed;
    top: 6rem;
    right: 0.1rem;
    width: 1.32rem;
    height: 1.34rem;
    background: url(../assets/member_02.png) no-repeat center / contain;
    animation: aniIcon 1.2s ease infinite;
    -webkit-animation: aniIcon 1.2s ease infinite;
  }
</style>
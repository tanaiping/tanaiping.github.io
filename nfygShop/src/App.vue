<template>
  <div id="app">
    <div class="open-app" @click="onClickOpenNFYGApp" v-if="$route.query.isShare == 1">
      <img :src="require('@/assets/nfyg_logo.png')" alt="花生地铁" />
      <p>打开花生地铁APP，购物更方便</p>
      <button class="btn-public-2">立即打开</button>
    </div>
    <NavBar :class="navType == 2 ? 'nav-2' : 'nav'" v-show="navType == 1 ? false : true" :title="title"
      :navType="navType" :navScroll="navScroll" :navScrollTarget="navScrollTarget" />
    <div class="main" :style="$route.query.isShare == 1 ? {paddingTop: '1.02rem'} : ''">
      <!-- <router-view /> -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
  import NavBar from './components/NavBar'
  import {
    UserUrl
  } from './config/url'
  import {
    browser,
    getUserInfo,
    pushToLoginView
  } from './server/nfygCommon'
  export default {
    data: function () {
      return {
        navShow: true,
        title: '',
        transitionName: "fade",
        navType: 0,
        navScroll: false,
        navScrollTarget: 0,
        navScrollName: "",
        isGuide: false
      }
    },
    mounted() {
      if (browser.isNfyg) {
        this.authLogin()
      } else {
        this.getShopUserInfo()
      }
      this.getipPositionCity()

      this.title = this.$route.meta.title;
      this.navType = this.$route.meta.navType;
      // 事件监听滚动条
      window.addEventListener('scroll', this.watchScroll)
    },
    methods: { // 事件监听滚动条
      // 获取ip定位
      getipPositionCity() {
        const _this = this
        window.AMap.plugin('AMap.CitySearch', function () {
          var citySearch = new AMap.CitySearch()
          citySearch.getLocalCity(function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              // 查询成功，result即为当前所在城市信息
              console.log("城市定位:");
              console.log(result);
              _this.$cookies.set("ipPositionCity", result.city)
            }
          })
        })

        window.AMap.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            // timeout: 10000, //超过10秒后停止定位，默认：5s
          });
          geolocation.isSupported()
          geolocation.getCurrentPosition(function (status, result) {
            console.log("精确定位:");
            console.log(result);
            if (status === 'complete' && result.info === 'SUCCESS') {
              // 查询成功，result即为当前所在城市信息
              // _this.$cookies.set("ipPositionCity", result.addressComponent.city)
              _this.$cookies.set("ipPositionCityAdCode", result.addressComponent.adcode)
            }
          });
        });
      },
      // APP内默认授权登录
      authLogin() {
        const _this = this
        let nfygUser = JSON.parse(getUserInfo())
        // window.console.log(nfygUser);
        const agentKey = _this.$cookies.get("shopAgentKey")
        if (nfygUser.userId) {
          const formData = {
            "agentKey": agentKey || "peanut_subway",
            "thirdUid": nfygUser.userId
          }
          _this.$axios.post(UserUrl.authLogin, formData)
            .then((res) => {
              // window.console.log(res);
              if (res.data.resultCode == 0) {
                _this.$cookies.set("shopAuthData", true)
                _this.$cookies.set("shopUserInfo", res.data.data, "30d")
              } else {
                _this.$cookies.remove("shopAuthData")
                _this.$cookies.remove("shopUserInfo")
              }
            })
            .catch((error) => {
              window.console.log(error);
            })
        } else {
          _this.$cookies.remove("shopAuthData")
          _this.$cookies.remove("shopUserInfo")
          //pushToLoginView()
        }
      },
      // 获取商城用户信息并更新用户信息到cookies
      getShopUserInfo() {
        const _this = this
        const shopUserInfo = _this.$cookies.get("shopUserInfo")
        const formData = {
          "uid": shopUserInfo ? shopUserInfo.uid : "",
        }
        _this.$axios.post(UserUrl.getUserInfo, formData)
          .then((res) => {
            if (res.data.resultCode == 0) {
              _this.shopUserInfo = res.data.data
              _this.$cookies.set("shopUserInfo", res.data.data, "30d")
            } else if (res.data.resultCode == 1112) {
              // 登录过期，需要重新登录
              _this.$toast(res.data.resultMsg)
              _this.$router.push({
                name: "login"
              })
            } else if (res.data.resultCode == 2) {
              // 登录过期，需要重新登录
              // _this.$toast("请先登录")
              // _this.$router.push({
              //   name: "login",
              //   query: {
              //     backType: "goback"
              //   }
              // })
            } else {
              _this.shopUserInfo = shopUserInfo
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      watchScroll() {
        if (this.$route.query.detailType === "goods") {
          this.navScrollName = "goods"
        } else {
          this.navScrollName = ""
        }
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (this.navScrollName == "goods") {
          if (scrollTop >= 329) {
            this.navScroll = true
            const target1 = document.getElementById("detail-nav-1").offsetTop - 55
            const target2 = document.getElementById("detail-nav-2").offsetTop - 55
            const target3 = document.getElementById("detail-nav-3").offsetTop - 55
            if (scrollTop >= target1 && scrollTop < target2) {
              this.navScrollTarget = 1
            } else if (scrollTop >= target2 && scrollTop < target3) {
              this.navScrollTarget = 2
            } else if (scrollTop >= target3) {
              this.navScrollTarget = 3
            }
          } else {
            this.navScroll = false
          }
        }
        if (this.navScrollName == "copponAndRight") {
          if (scrollTop >= 50) {
            this.navScroll = true
          } else {
            this.navScroll = false
          }
        }
      },
      // 打开花生地铁APP
      onClickOpenNFYGApp() {
        if (browser.ios) {
          window.location.href = "https://itunes.apple.com/cn/app/id1128289794"
        } else {
          window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb&ckey=CK1360001376091"
        }
      }
    },
    watch: {
      $route(to) {
        this.title = to.meta.title;
        this.navType = to.meta.navType;
        if (to.name == "special") {
          if (to.query.specialType == 2) {
            this.title = '兑换专区'
          } else {
            this.title = '限时抢购'
          }
        }
        if (to.name == "homebranch") {
          if (to.query.type == 1) {
            this.title = '邀请奖励'
          } else if (to.query.type == 2) {
            this.title = '我的花花币'
          } else {
            this.title = '已节省'
          }
        }
        if (to.name == "myorderlist") {
          if (to.query.listType == 1) {
            this.title = '商品订单'
          } else if (to.query.listType == 2) {
            this.title = '卡券订单'
          } else {
            this.title = '直充订单'
          }
        }
        if (to.name == 'homebranch') {
          if (to.query.type == 2) {
            this.navType = 4
          }
        }
        if (to.name == 'cash') {
          this.navType = 5
        }
      }
    },
    components: {
      NavBar
    }
  }
</script>

<style lang="less">
  #app {
    font-family: "PingFang-SC-Medium", "PingFang-SC", "Avenir", Helvetica, Arial,
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
    font-size: 0.32rem;
    line-height: 1.5;
  }

  .nav {
    position: relative;
    margin-bottom: 0.92rem;
    z-index: 9999;
  }

  .nav-2 {
    margin-bottom: 0;
  }

  .popup-del {
    padding: 0.3rem;

    .title {
      font-size: 0.32rem;
      color: #999;
      text-align: center;
    }

    .btn {
      width: 5.8rem;
      height: 0.88rem;
      margin: auto;
      margin-top: 0.25rem;
      font-size: 0.32rem;
      border-radius: 0.44rem;
    }

    .cancel {
      color: #666;
      border-color: #bbb;
    }
  }

  .guide-popup {
    position: fixed;
    z-index: 999;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.65);

    img {
      position: absolute;
      right: 0.35rem;
      top: 0.25rem;
      width: 2.09rem;
    }
  }
</style>
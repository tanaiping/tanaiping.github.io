<template>
  <div>
    <van-nav-bar v-if="navType == 1" :border="false" fixed />
    <!-- 商品详情页 情况1 -->
    <van-nav-bar v-else-if="navType == 2 && !navScroll" class="nav-type-2" left-arrow sticky :border="false" fixed
      @click-left="onClickLeft" :style="$route.query.isShare == 1 ? {top: '1.02rem'} : ''">
      <van-icon slot="left">
        <i data-v-4295d220="" class="van-icon van-icon-arrow-left van-nav-bar__arrow"
          :style="{width: '0.56rem',height: '0.56rem',padding: '0.105rem',background: 'rgba(0,0,0,0.5)', borderRadius: '50%'}"></i>
      </van-icon>
      <van-icon slot="right">
        <img :src="require('@/assets/icon_home.png')" alt="" @click="onClickToHome"
          :style="{width: '0.56rem',background: 'rgba(0,0,0,0.5)', borderRadius: '50%', marginRight: '0.2rem'}">
        <img :src="require('@/assets/icon_share.png')" alt="" @click="onClickToShareDetailGoods"
          :style="{width: '0.56rem',background: 'rgba(0,0,0,0.5)', borderRadius: '50%'}">
      </van-icon>
    </van-nav-bar>
    <!-- 商品详情页 情况2 -->
    <van-nav-bar v-else-if="navType == 2 && navScroll" class="nav-type-2 nav-scroll" left-arrow sticky fixed
      @click-left="onClickLeft" @click-right="onClickShowMore"
      :style="$route.query.isShare == 1 ? {top: '1.02rem'} : ''">
      <!-- 商品详情顶部导航栏 -->
      <van-icon slot="title">
        <span class="title-tab tab-detail" @click="onClickToGoods">商品</span>
        <span :class="navScrollTarget === 1 ? 'title-tab tab-detail active' : 'title-tab tab-detail'"
          @click="onClickToDetail">详情</span>
        <span :class="navScrollTarget === 2 ? 'title-tab tab-detail active' : 'title-tab tab-detail'"
          @click="onClickToRemark">购买须知</span>
        <!-- <span :class="navScrollTarget === 3 ? 'title-tab tab-detail active' : 'title-tab tab-detail'"
          @click="onClickToEvaluate">评价</span> -->
      </van-icon>
      <van-icon slot="right">
        <img :src="require('@/assets/icon_more.png')" alt="" :style="{width: '0.44rem'}">
        <!-- <img :src="require('@/assets/icon_share_1.png')" alt="" :style="{width: '0.56rem'}"> -->
        <div class="more" v-show="isShowMore">
          <div class="more-line" @click="onClickToHome">
            <img :src="require('@/assets/icon_home_1.png')" alt="">
            <p>首页</p>
          </div>
          <div class="more-line" @click="onClickToShareDetailGoods" :style="{borderTop: 'solid 1px #eee'}">
            <img :src="require('@/assets/icon_share_1.png')" alt="">
            <p>分享</p>
          </div>
        </div>
      </van-icon>

    </van-nav-bar>
    <!--<van-nav-bar v-else :title="title" left-arrow fixed @click-left="onClickLeft" />-->
    <div v-else-if="navType == 3" class="nav-defined">
      <div class="back-ico" @click="onClickLeft"></div>
      <div class="close" @click="onClickToHome">关闭</div>{{title}}
    </div>
    <van-nav-bar v-else-if="navType == 4" :title="title" left-arrow fixed @click-left="onClickLeft"
      @click-right="onClickRight('rules')">
      <span slot="right">规则说明</span>
    </van-nav-bar>
    <van-nav-bar v-else-if="navType == 5" :title="title" left-arrow fixed @click-left="onClickLeft"
      @click-right="onClickRight('cash')">
      <span slot="right">提现明细</span>
    </van-nav-bar>
    <van-nav-bar v-else :title="title" left-arrow fixed @click-left="onClickLeft" />

  </div>
</template>

<script>
  const _czc = window._czc || []
  import Vue from 'vue';
  import {
    NavBar
  } from 'vant';
  import {
    browser,
    openSharePanel
  } from '../server/nfygCommon'

  Vue.use(NavBar);

  export default {
    // title用来显示导航栏的title，isleftarrow用来显示导航栏的左侧返回箭头，navType用来区分导航栏类型
    props: ["title", "navType", "navScroll", "navScrollTarget", "navRightType"],
    data() {
      return {
        isShowMore: false
      }
    },
    methods: {
      onClickLeft() {
        // 点击回退的时候当做地址回退
        let fromApp = this.$route.query.fromApp; //判断是不是从app进来的页面 fromApp
        //this.$toast(fromApp);
        if (fromApp == "" || fromApp == undefined) {
          this.$router.go(-1);
        } else {
          this.$router.push({
            name: "home",
          })
        }
      },
      // 点击跳到首页
      onClickToHome() {
        this.isShowMore = false
        _czc.push(['_trackEvent', 'appproduct_04', '点击', '详情页点击首页图标回到首页'])
        this.$router.push({
          name: "home"
        })
      },
      // 定位到商品图
      onClickToGoods() {
        window.scrollTo(0, 0)
      },
      // 定位到详情
      onClickToDetail() {
        const target = document.getElementById("detail-nav-1").offsetTop - 55
        window.scrollTo(0, target)
      },
      // 定位到购买须知
      onClickToRemark() {
        const target = document.getElementById("detail-nav-2").offsetTop - 55
        window.scrollTo(0, target)
      },
      // 定位到评价
      onClickToEvaluate() {
        const target = document.getElementById("detail-nav-3").offsetTop - 55
        window.scrollTo(0, target)
      },
      // 点击右边
      onClickRight(type) {
        if (type == 'rules') {
          this.$router.push({
            name: "hsrules"
          })
        } else {
          _czc.push(['_trackEvent', 'appencourage_34', '点击', '提现页-提现明细'])
          this.$router.push({
            name: "cashlist"
          })
        }
      },
      // 点击商品详情页右边，展示更多
      onClickShowMore() {
        this.isShowMore = !this.isShowMore
      },
      // 点击分享当前商品详情页
      onClickToShareDetailGoods() {
        const cook = this.$cookies.get("shareDetailGoods")
        let shareData = {
          url: window.location.href + "&isShare=1",
          imageUrl: cook.imageUrl,//cook.imageUrl
          title: cook.title,
          text: "我在花生商城发现了很不错的商品，赶快来瞅瞅吧~"
        }
        if (this.$route.query.isShare == 1) {
          shareData = {
            url: window.location.href,
            imageUrl: cook.imageUrl,//cook.imageUrl
            title: cook.title,
            text: "我在花生商城发现了很不错的商品，赶快来瞅瞅吧~"
          }
        }
        if (browser.isNfyg) {
          openSharePanel(shareData.url, shareData.imageUrl, shareData.title, shareData.text)
        } else {
          this.$toast("点击右上角分享")
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .van-nav-bar {
    height: 0.92rem;
    line-height: 0.92rem;
  }

  .van-nav-bar__title {
    max-width: 70%;
    font-size: 0.32rem;
    color: #333;

    .title-tab {
      padding: 0 0.25rem;
    }
  }

  .van-nav-bar .van-icon {
    font-size: 0.35rem;
    color: #838488;
  }

  .nav-type-2 {
    background: none;

    .van-icon-arrow-left {
      color: #fff;
    }
  }

  .nav-type-2.nav-scroll {
    background: #fff;

    .van-icon-arrow-left {
      color: #1e1e1e;
    }
  }

  .nav-defined {
    text-align: center;
    line-height: 0.92rem;
    height: 0.92rem;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
  }

  .back-ico {
    color: #1e1e1e;
    width: 0.6rem;
    text-align: center;
    position: absolute;
    left: 0.3rem;
    top: 0;
    background: url(../assets/back.png) center center no-repeat;
    background-size: 60% auto;
    height: 0.92rem;
  }

  .close {
    color: #1e1e1e;
    width: 1rem;
    text-align: center;
    position: absolute;
    left: 0.8rem;
    top: 0;
    cursor: pointer;
  }

  .tab-detail {
    font-size: 0.26rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 400;
    color: #333;
  }

  .tab-detail.active {
    color: #ff5656;
  }

  .more {
    position: absolute;
    padding: 0 0.3rem;
    margin-top: 0.2rem;
    width: 2rem;
    right: -0.02rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.04rem;
    box-shadow: 0px 5px 16px 0px rgba(0, 0, 0, 0.09);
    opacity: 0.95;

    .more-line {
      display: flex;
      padding: 0.2rem 0;

      img {
        width: 0.44rem;
        height: 0.44rem;
      }

      p {
        margin-left: 0.24rem;
        font-size: 0.28rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333;
        line-height: 0.44rem;
      }
    }
  }
</style>
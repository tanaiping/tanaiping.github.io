<template>
  <div class="home-branch bg-public">
    <!-- type = 1 邀请返现 -->
    <div v-if="$route.query.type == 1">
      <!-- 初始化获取数据，加载中... -->
      <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '1.5rem'}" vertical>加载中...
      </van-loading>
      <van-tabs v-model="active" animated color="#ff5656" title-active-color="#ff5656" line-width="30"
        @click="onClickTabs">
        <van-tab title="分享排行榜">
          <van-cell-group :border='false'>
            <div class="row" v-for="(item, i) in cardRankingList" :key="i">
              <div class="left">
                <span class="number">{{i + 1}}</span>
                <img class="head-img"
                  :src="item.headUrl || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head_girl.png'" alt="">
                <span class="nick-name">{{item.nickName}}</span>
              </div>
              <div class="right">
                <p class="value">奖金：<span>{{item.amount}}元</span></p>
                <p class="time">邀请人数：{{item.cnt}}人</p>
              </div>
            </div>
          </van-cell-group>
          <NfygEmpth v-if="isNfygEmpth11" type="save" text="一大波数据正在赶来~" />
        </van-tab>
        <van-tab title="我的收益">
          <van-cell-group :border='false'>
            <div class="row" v-for="(item, i) in inviteUserList" :key="i">
              <div :class="item.status == 2 ? 'left refund' : 'left'">
                <span class="number">{{i + 1}}</span>
                <img class="head-img"
                  :src="item.headUrl || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head_girl.png'" alt="">
                <span class="nick-name">{{item.nickName}}</span>
              </div>
              <div class="right">
                <p :class="item.status == 2 ? 'value refund' : 'value'">奖金：<span>{{item.amount}}元</span></p>
                <p class="time">邀请日期：{{item.createTime.substring(0,10)}}</p>
                <p class="time">{{item.status == 2 ? "该用户已退款" : (item.status == 1 ? "已生效" : "待生效")}}</p>
              </div>
              <img v-if="item.status == 2" :src="require('@/assets/status_0.png')" alt="" class="icon-refund">
            </div>
          </van-cell-group>
          <NfygEmpth v-if="isNfygEmpth12" type="save" text="你还没有邀请奖励~" />
        </van-tab>
      </van-tabs>
    </div>
    <!-- type = 2 我的花花币 -->
    <van-cell-group v-else-if="$route.query.type == 2" class="branch branch-2" :border='false'>
      <div class="header">
        <p class="name">当前花花币(个)</p>
        <p class="value">{{userInfo.currency == 0 ? '0' : (userInfo.currency || '--')}}</p>
        <router-link :to="{name:'special', query: {specialType: 2}}"><button class="btn-public-2 btn">去使用</button>
        </router-link>
      </div>
      <!-- 初始化获取数据，加载中... -->
      <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '1.5rem'}" vertical>加载中...
      </van-loading>
      <van-cell v-for="(item, i) in detailList2" :key="i" :title="item.remark"
        :label="'订单号：' + item.orderNum + ' ' + item.createTime"
        :value="item.currency > 0 ? ('+' + item.currency) : item.currency" :border='false' />
      <NfygEmpth v-if="isNfygEmpth2" type="save" text="你还没有花花币明细~" />
    </van-cell-group>
    <!-- type = 3 已节省 -->
    <van-cell-group v-else class="branch branch-3" :border='false'>
      <!-- 初始化获取数据，加载中... -->
      <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '1.5rem'}" vertical>加载中...
      </van-loading>
      <van-cell v-for="(item, i) in detailList3" :key="i" :title="i == 0 ? '购物返利' : '专享优惠'" :label="item.remark"
        :value="(regFenToYuan(item.money) || '--') + '元'" :border='false' />
      <NfygEmpth v-if="isNfygEmpth3" type="save" text="马上购物省钱啦，成为会员折扣更多~" />
      <div v-if="isNfygEmpth3" class="branch-3-btn">
        <button class="btn-public-2 btn" @click="linkToHome">我是会员去逛逛</button>
        <button class="btn-public btn" @click="linkToPerfectinfo">我要成为会员</button>
      </div>
    </van-cell-group>
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
  import {
    UserUrl
  } from '../../config/url'

  import NfygEmpth from '../../components/NfygEmpty';
  export default {
    name: '',
    data() {
      return {
        active: 0,
        rewardTab: 1,
        userInfo: "",
        shopUserInfo: "",
        isVipPopup: false,
        isFirstLoading: true,
        isNfygEmpth11: false,
        isNfygEmpth12: false,
        isNfygEmpth2: false,
        isNfygEmpth3: false,
        cardRankingList: [],
        inviteUserList: [],
        detailList2: [],
        detailList3: []
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      this.shopUserInfo = shopUserInfo
      const type = this.$route.query.type
      if (type == 1) {
        this.getData1()
      } else if (type == 2) {
        this.getUserInfo()
        this.getData2()
      } else {
        this.getData3()
        _czc.push(['_trackEvent', 'apporder_18', '曝光', '已节省页面']);
      }
    },
    methods: {
      getUserInfo() {
        const _this = this
        const formData = {
          "uid": this.shopUserInfo.uid,
        }
        _this.$axios.post(UserUrl.getUserInfo, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.userInfo = res.data.data
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      getData1() {
        const _this = this
        const formData = {
          "uid": _this.shopUserInfo.uid,
        }
        _this.$axios.post(UserUrl.detailShare, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.cardRankingList = res.data.data.cardRankingList
              _this.inviteUserList = res.data.data.inviteUserList
              if (_this.cardRankingList.length > 0) {
                _this.isNfygEmpth11 = false
              } else {
                _this.isNfygEmpth11 = true
              }
              if (_this.inviteUserList.length > 0) {
                _this.isNfygEmpth12 = false
              } else {
                _this.isNfygEmpth12 = true
              }
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      getData2() {
        const _this = this
        const formData = {
          "uid": _this.shopUserInfo.uid,
        }
        _this.$axios.post(UserUrl.detailCurrency, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.detailList2 = res.data.data
              if (_this.detailList2.length > 0) {
                _this.isNfygEmpth2 = false
              } else {
                _this.isNfygEmpth2 = true
              }
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      getData3() {
        const _this = this
        const formData = {
          "uid": _this.shopUserInfo.uid,
        }
        _this.$axios.post(UserUrl.detailSave, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.detailList3 = res.data.data
              if (_this.detailList3.length > 0) {
                _this.isNfygEmpth3 = false
              } else {
                _this.isNfygEmpth3 = true
              }
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      onClickTabs(name, title) {
        if (name == 0) {
          _czc.push(['_trackEvent', 'appencourage_02', '点击', '邀请奖励-分享排行榜']);
        } else {
          _czc.push(['_trackEvent', 'appencourage_03', '点击', '邀请奖励-我的收益']);
        }
      },
      linkToHome() {
        _czc.push(['_trackEvent', 'apporder_19', '点击', '已节省页面{button:0}']);
        this.$router.push({
          name: 'home'
        })
      },
      linkToPerfectinfo() {
        _czc.push(['_trackEvent', 'apporder_19', '点击', '已节省页面{button:1}']);
        this.isVipPopup = true
      }
    },
    components: {
      NfygEmpth
    }
  }
</script>

<style lang="less" scoped>
  .van-cell-group {
    background: none;
  }

  .top {
    display: flex;
    background: #fff;
    margin: auto;
    padding: 0.1rem 0.3rem;

    p {
      flex: 1;
      font-size: 0.3rem;
      color: #333;
      text-align: center;
    }

    p.active {
      font-weight: bold;
      color: #ff5656;
    }
  }

  .row {
    position: relative;
    display: flex;
    padding: 0.2rem 0.3rem;
    border-bottom: solid 1px #eee;
    background: #fff;

    .left {
      margin: auto;
      margin-left: 0;

      .number {
        font-size: 0.2rem;
      }

      .head-img {
        width: 0.68rem;
        height: 0.68rem;
        border-radius: 50%;
        margin: auto;
        margin-left: 0.15rem;
      }

      .nick-name {
        font-size: 0.26rem;
        margin: auto;
        margin-left: 0.15rem;
      }
    }

    .left.refund {
      color: #999;
    }

    .right {
      margin: auto;
      margin-right: 0;
      font-size: 0.26rem;
      color: #999;
      text-align: right;

      .value {
        color: #333;

        span {
          // margin-left: 0.15rem;
          color: #ff5656;
          font-weight: bold;
        }
      }

      .value.refund {
        color: #999;
      }
    }

    .icon-refund {
      position: absolute;
      width: 2.24rem;
      right: 0.7rem;
      top: 0.3rem;
    }
  }

  .branch {
    .header {
      width: 100%;
      height: 2.48rem;
      padding: 0.3rem;
      font-size: 0.3rem;
      color: #fff;
      text-align: center;
      background: url(../../assets/state_bg.png) no-repeat center / 100% 100%;

      .value {
        margin-top: 0.15rem;
        font-size: 0.44rem;
      }

      .btn {
        margin: auto;
        margin-top: 0.15rem;
        width: 2.48rem;
        height: 0.5rem;
        font-weight: 500;
        border-radius: 0.25rem;
        background: none;
        border-color: #fff;
        color: #fff;
      }
    }

    .van-cell {
      border-bottom: solid 1px #eee;
    }

    .van-cell__title,
    .van-cell__value {
      margin: auto;
      font-size: 0.3rem;
      color: #333;
    }

    .van-cell__label {
      font-size: 0.28rem;
      line-height: 1.65;
      color: #999;
    }
  }

  .branch-2 {
    .van-cell__value {
      font-weight: bold;
      color: #ff5656;
    }
  }

  .branch-3 {
    margin-top: 0.2rem;
  }

  .branch-3-btn {
    margin-top: 1.9rem;

    .btn {
      margin: auto;
      margin-top: 0.4rem;
      width: 5.8rem;
      height: 0.88rem;
      border-radius: 0.44rem;
      font-size: 0.32rem;
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
</style>
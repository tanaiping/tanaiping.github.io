<template>
  <div class="my-home bg-public">
    <div class="header">
      <div class="bg">
        <img class="head-img"
          :src="shopUserInfo.headUrl || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head_default.png'" alt="">
        <h5 class="nick-name">{{shopUserInfo.nickName}}</h5>
        <button v-if="shopUserInfo.vipType == 0" class="card-code btn-public-2 card-btn"
          @click="isVipPopup = true">成为会员</button>
        <div v-if="shopUserInfo.vipType == 1" class="card-code">
          <p>体验会员</p>
          <p>{{shopUserInfo.vipValidTime.substring(0,10)}}到期</p>
          <button class="btn-public-2 card-btn" @click="$router.push({name: 'activation'})">激活</button>
        </div>
        <div v-if="shopUserInfo.vipType == 2" class="card-code">
          <p>卡号：{{shopUserInfo.cardNo}}</p>
        </div>
      </div>
    </div>
    <van-cell-group class="group-public content" :border='false'>
      <van-row>
        <!-- <van-col span="8" @click="onClickToBranch(1)">
          <p class="key">邀请返现(元)</p>
          <p class="value">{{shopUserInfo.inviteMoney}}</p>
        </van-col> -->
        <van-col span="12" @click="onClickToBranch(2)">
          <p class="key">花花币(个)</p>
          <p class="value">{{shopUserInfo.currency}}</p>
        </van-col>
        <van-col span="12" @click="onClickToBranch(3)">
          <p class="key">已节省(元)</p>
          <p class="value">{{shopUserInfo.cutMoney}}</p>
        </van-col>
      </van-row>
    </van-cell-group>
    <van-cell-group class="group-public column" :border='false'>
      <van-cell :icon="require('@/assets/icon_i1.png')" title="我的订单" value="" :border='false' is-link to="myorder"
        @click="onClickCellMyOrderList" />
      <!-- <van-cell :icon="require('@/assets/icon_i5.png')" title="我的优惠券" value="" :border='false' is-link to="mycourtesycard"
        @click="onClickCellMyOrderList" /> -->
      <van-cell :icon="require('@/assets/icon_i2.png')" title="收货地址" value="" :border='false' is-link to="addresslist"
        @click="onClickCellMyAddressList" />
      <!-- <van-cell :icon="require('@/assets/icon_i3.png')" title="邀请返现" value="马上邀请赚钱" :border='false' is-link
        to="invitation" @click="onClickCellInvitation" /> -->
      <van-cell :icon="require('@/assets/icon_i4.png')" title="客服中心" value="" :border='false' is-link
        @click="onlineService(), onClickCellLine" />
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
  export default {
    name: '',
    data() {
      return {
        shopUserInfo: "",
        isVipPopup: false
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      this.shopUserInfo = shopUserInfo
      this.getShopUserInfo()
    },
    methods: {
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
            } else {
              _this.shopUserInfo = shopUserInfo
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      onClickToBranch(type) {
        if (type == 1) {
          _czc.push(['_trackEvent', 'appencourage_01', '点击', '花花会员页-邀请返现(元)']);
        } else if (type == 3) {
          _czc.push(['_trackEvent', 'apporder_02', '点击', '花花会员页-已节省(元)']);
        }
        this.$router.push({
          name: "homebranch",
          query: {
            type: type
          }
        })
      },
      onClickCellMyOrderList() {
        _czc.push(['_trackEvent', 'apporder_01', '点击', '花花会员页-我的订单']);
      },
      onClickCellMyAddressList() {
        _czc.push(['_trackEvent', 'apporder_03', '点击', '花花会员页-收货地址']);
      },
      onClickCellInvitation() {
        _czc.push(['_trackEvent', 'appencourage_05', '点击', '花花会员页-邀请返现-马上邀请赚钱']);
      },
      onClickCellLine() {
        _czc.push(['_trackEvent', 'apporder_04', '点击', '花花会员页-客服中心']);
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    position: relative;
    height: 2.48rem;
    background: linear-gradient(318deg,
        rgba(91, 88, 82, 1) 0%,
        rgba(47, 46, 43, 1) 100%);

    .bg {
      position: absolute;
      display: flex;
      padding: 0.1rem 0.25rem;
      margin: auto;
      bottom: 0;
      left: 0;
      right: 0;
      width: 6.9rem;
      height: 1.92rem;
      background: url("../../assets/bg_card.png") no-repeat center / 100%;

      .head-img {
        width: 0.94rem;
        height: 0.94rem;
        margin: auto;
        margin-left: 0;
        border-radius: 50%;
        border: solid 1px #fff;
        background: #fff;
      }

      .nick-name {
        font-size: 0.36rem;
        color: #985500;
        flex: 1;
        margin: auto;
        margin-left: 0.15rem;
      }

      .card-code {
        font-size: 0.28rem;
        color: #985500;
        margin: auto;
        margin-right: 0;

        p {
          margin-bottom: 0.05rem;
          text-align: right;
        }
      }

      .card-btn {
        margin: auto;
        margin-right: 0;
        height: 0.56rem;
        padding: 0 0.3rem;
        font-size: 0.28rem;
        color: #985500;
        background: rgba(255, 247, 229, 1);
        border: none;
        border-radius: 0.3rem;
      }
    }
  }

  .content {
    padding: 0.3rem;

    p {
      text-align: center;
    }

    .key {
      font-size: 0.24rem;
    }

    .value {
      margin-top: 0.2rem;
      font-size: 0.4rem;
      font-weight: bold;
    }
  }

  .column {
    .van-cell {
      padding: 0.25rem 0.3rem;
    }

    .van-cell__left-icon {
      font-size: 0.45rem;
    }

    .van-cell__value {
      color: #ff5656;
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
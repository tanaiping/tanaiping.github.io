<template>
  <div class="my-order-list bg-public">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" class="bg-public" @refresh="onRefresh">
      <van-tabs v-model="goodsTab" v-if="$route.query.listType == 1" sticky animated swipeable @click="onChangeTabGoods"
        @change="onChangeTabGoods" class="order-header" color="#FF5656" title-active-color="#FF5656">
        <van-tab v-for="(item, i) in goodsTabsName" :title="goodsTabsName[i]" :key="i" class="order-contain">
          <!-- 初始化获取数据，加载中... -->
          <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '2.25rem'}" vertical>
            加载中...
          </van-loading>
          <!-- 商品订单 -->
          <div v-if="$route.query.listType == 1 && orderList && orderList.length > 0" class="order-list">
            <OrderItemGoods v-for="(item, i) in orderList" :key="i" :orderType="'goods'" :orderData="item"
              v-on:update="changeThisOrder" />
          </div>
          <!-- 空数据状态 -->
          <NfygEmpth v-if="isNfygEmpth" type="order" text="您还没有此类型订单哦～" />
        </van-tab>
      </van-tabs>
      <van-tabs v-model="couponTab" v-if="$route.query.listType == 2" sticky animated swipeable
        @click="onChangeTabCoupon" @change="onChangeTabCoupon" class="order-header" color="#FF5656"
        title-active-color="#FF5656">
        <van-tab v-for="(item, i) in couponTabsName" :title="couponTabsName[i]" :key="i" class="order-contain">
          <!-- 初始化获取数据，加载中... -->
          <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '2.25rem'}" vertical>
            加载中...
          </van-loading>
          <!-- 卡券订单 -->
          <div v-if="$route.query.listType == 2 && orderList && orderList.length > 0" class="order-list">
            <OrderItemCoupon v-for="(item, i) in orderList" :key="i" :orderType="(item.type == 0 ? 'coupon' : 'right')"
              :orderData="item" />
          </div>
          <!-- 空数据状态 -->
          <NfygEmpth v-if="isNfygEmpth" type="order" text="您还没有此类型订单哦～" />
        </van-tab>
      </van-tabs>
      <van-tabs v-model="chargeTab" v-if="$route.query.listType == 3" sticky animated swipeable
        @click="onChangeTabCharge" @change="onChangeTabCharge" class="order-header" color="#FF5656"
        title-active-color="#FF5656">
        <van-tab v-for="(item, i) in couponTabsName" :title="couponTabsName[i]" :key="i" class="order-contain">
          <!-- 初始化获取数据，加载中... -->
          <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '2.25rem'}" vertical>
            加载中...
          </van-loading>
          <!-- 直充订单 -->
          <div v-if="$route.query.listType == 3 && orderList && orderList.length > 0" class="order-list">
            <OrderItemCharge v-for="(item, i) in orderList" :key="i" :orderType="'charge'" :orderData="item"
              v-on:update="changeThisOrderCharge" />
          </div>
          <!-- 空数据状态 -->
          <NfygEmpth v-if="isNfygEmpth" type="order" text="您还没有此类型订单哦～" />
        </van-tab>
      </van-tabs>
    </van-pull-refresh>
    <!-- <van-pull-refresh v-model="isLoading" success-text="刷新成功" class="bg-public" @refresh="onRefresh">
      <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '2.25rem'}" vertical>加载中...
      </van-loading>
      <div v-if="$route.query.listType == 1 && orderList && orderList.length > 0" class="order-list">
        <OrderItemGoods v-for="(item, i) in orderList" :key="i" :orderType="'goods'" :orderData="item"
          v-on:update="changeThisOrder" />
      </div>
      <div v-if="$route.query.listType == 2 && orderList && orderList.length > 0" class="order-list">
        <OrderItemCoupon v-for="(item, i) in orderList" :key="i" :orderType="(item.type == 0 ? 'coupon' : 'right')"
          :orderData="item" />
      </div>
      <div v-if="$route.query.listType == 3 && orderList && orderList.length > 0" class="order-list">
        <OrderItemCharge v-for="(item, i) in orderList" :key="i" :orderType="'charge'" :orderData="item"
          v-on:update="changeThisOrderCharge" />
      </div>
      <NfygEmpth v-if="isNfygEmpth" type="order" text="您还没有此类型订单哦～" />
    </van-pull-refresh> -->

    <!-- 是否删除商品订单 -->
    <van-popup v-model="isDelPopup" position="bottom" class="popup-del">
      <p class="title">是否删除该订单？</p>
      <button class="btn-public-2 btn del" @click="delThisOrder()">删除</button>
      <button class="btn-public-2 btn cancel" @click="isDelPopup = false">取消</button>
    </van-popup>
    <!-- 是否删除直充订单 -->
    <van-popup v-model="isDelPopup2" position="bottom" class="popup-del">
      <p class="title">是否删除该订单？</p>
      <button class="btn-public-2 btn del" @click="delThisOrderCharge()">删除</button>
      <button class="btn-public-2 btn cancel" @click="isDelPopup2 = false">取消</button>
    </van-popup>
    <!-- 是否确认收货 -->
    <van-popup v-model="isFinishPopup" position="bottom" class="popup-del">
      <p class="title">是否确认收货？</p>
      <button class="btn-public-2 btn del" @click="finishThisOrder()">确认</button>
      <button class="btn-public-2 btn cancel" @click="isFinishPopup = false">取消</button>
    </van-popup>
    <!-- 物流弹窗 -->
    <van-popup v-model="isLogisticsPopup" class="popup-logistics" closeable close-icon="close">
      <div class="name">
        <!-- <img class="img" :src="require('@/assets/nfyg_180_180.png')" alt="花生地铁"> -->
        <div>
          <p>物流公司：{{LogisticData.length > 0 ? LogisticData[0].logisticName : ''}}</p>
          <p class="number">运单编号：{{LogisticData.length > 0 ? LogisticData[0].logisticNo : ''}}</p>
        </div>
      </div>
      <div class="info">
        <div class="cell" v-for="(item, i) in LogisticData" :key="i">
          <div :class="'circle circle-' + i"></div>
          <div class="col">
            <p class="content">{{item.content}}</p>
            <p class="time">{{item.time}}</p>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  const _czc = window._czc || []
  import {
    CouponUrl,
    GoodsUrl,
    ChargeUrl,
  } from '../../config/url'

  import OrderItemCoupon from '../../components/OrderItemCoupon'
  import OrderItemGoods from '../../components/OrderItemGoods'
  import OrderItemCharge from '../../components/OrderItemCharge'
  import NfygEmpth from '../../components/NfygEmpty';

  export default {
    name: '',
    data() {
      return {
        shopUserInfo: {
          "vipType": 0
        },
        isDelPopup: false,
        isDelPopup2: false,
        isFinishPopup: false,
        isLogisticsPopup: false,
        isNfygEmpth: false,
        LogisticData: [],
        rightTab: 0,
        couponTab: 0,
        couponState: -1,
        goodsTab: 0,
        goodsState: -1,
        chargeTab: 0,
        chargeState: -1,
        rightState: 0,
        orderList: [],
        isLoading: false,
        isFirstLoading: true,
        goodsTabsName: ["全部", "待付款", "待发货", "待收货", "已完成", "已取消"],
        couponTabsName: ["全部", "待付款", "已支付", "已取消"],
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      // listType == 2 卡券订单
      if (this.$route.query.listType == 2) {
        const cCouponState = parseInt(this.$cookies.get("onChangeTabCouponState"))
        const qCouponState = parseInt(this.$route.query.couponState)
        // 优先cookie里面的点击
        if (cCouponState != null) {
          // cookie 存的是tab的序号，0-全部，1-待付款，2-已支付，3-已取消
          this.couponTab = cCouponState
          this.couponState = -1
          switch (cCouponState) {
            case 1:
            case 2:
              this.couponState = cCouponState - 1
              break;
            case 3:
              this.couponState = 4
              break;
            default:
              this.couponState = -1
              break;
          }
          // this.$cookies.remove('onChangeTabCouponState')
        }
        if (qCouponState != null && !cCouponState) {
          // 没有cookie的时候优先query
          // 参数传过来的是前一页的tab的序号, 1-待付款，2-已支付，3-已取消
          this.couponTab = qCouponState
          switch (qCouponState) {
            case 1:
            case 2:
              this.couponState = qCouponState - 1
              break;
            case 3:
              this.couponState = 4
              break;
            default:
              this.couponState = -1
              break;
          }
        }
        this.getDataCouponOrderList(this.couponState)
      } else if (this.$route.query.listType == 3) {
        const cChargeState = parseInt(this.$cookies.get("onChangeTabChargeState"))
        const qChargeState = parseInt(this.$route.query.chargeState)
        // 优先cookie里面的点击
        if (cChargeState != null) {
          // cookie 存的是tab的序号，0-全部，1-待付款，2-已支付，3-已取消
          this.chargeTab = cChargeState
          this.chargeState = -1
          switch (cChargeState) {
            case 1:
            case 2:
              this.chargeState = cChargeState - 1
              break;
            case 3:
              this.chargeState = 4
              break;
            default:
              this.chargeState = -1
              break;
          }
          // this.$cookies.remove('onChangeTabChargeState')
        }
        if (qChargeState != null && !cChargeState) {
          // 没有cookie的时候优先query
          // 参数传过来的是前一页的tab的序号, 1-待付款，2-已支付，3-已取消
          this.chargeTab = qChargeState
          switch (qChargeState) {
            case 1:
            case 2:
              this.chargeState = qChargeState - 1
              break;
            case 3:
              this.chargeState = 4
              break;
            default:
              this.chargeState = -1
              break;
          }
        }
        this.getDataChargeOrderList(this.chargeState)
      } else {
        // listType == 1 商品订单
        const cGoodsState = parseInt(this.$cookies.get("onChangeTabGoodsState"))
        const qGoodsState = parseInt(this.$route.query.goodsState)
		console.log(qGoodsState)
        // 优先cookie里面的点击
        if (cGoodsState != null) {
          // cookie 存的是tab的序号，0-全部，1-待付款，2-待发货，3-待收货，4-已完成
          this.goodsTab = cGoodsState
          this.goodsState = cGoodsState == 0 ? -1 : cGoodsState
          // this.$cookies.remove('onChangeTabGoodsState')
        }
        if (qGoodsState != null && !cGoodsState && cGoodsState != 0) {
          // 没有cookie的时候优先query
          // 参数传过来的是前一页的tab的序号, 1-待付款，2-待发货，3-待收货，4-已完成
          this.goodsTab = qGoodsState
          this.goodsState = qGoodsState
        }
        this.getDataGoodsOrderList(this.goodsState)
      }
      _czc.push(['_trackEvent', 'apporder_06', '曝光', '订单列表页{type:' + (this.$route.query.listType == 2 ? 0 : 1) + '}']);
    },
    methods: {
      // 下拉刷新
      onRefresh() {
        if (this.$route.query.listType == 2) {
          this.getDataCouponOrderList(this.couponState)
        } else if (this.$route.query.listType == 3) {
          this.getDataChargeOrderList(this.chargeState)
        } else {
          this.getDataGoodsOrderList(this.goodsState)
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      // 获取商品订单列表数据
      getDataGoodsOrderList(state) {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "statue": parseInt(state)
        }
        _this.$axios.post(GoodsUrl.goodsOrderList, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.orderList = res.data.data
              if (!_this.orderList || !(_this.orderList.length > 0)) {
                _this.isNfygEmpth = true
              } else {
                _this.isNfygEmpth = false
              }
            } else {
              this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取卡券订单列表数据
      getDataCouponOrderList(state) {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "statue": parseInt(state)
        }
        _this.$axios.post(CouponUrl.couponOrderList, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.orderList = res.data.data
              if (!_this.orderList || !(_this.orderList.length > 0)) {
                _this.isNfygEmpth = true
              } else {
                _this.isNfygEmpth = false
              }
            } else {
              this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取直充订单列表数据
      getDataChargeOrderList(state) {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "statue": parseInt(state)
        }
        _this.$axios.post(ChargeUrl.chargeOrderList, formData)
          .then((res) => {
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.orderList = res.data.data
              if (!_this.orderList || !(_this.orderList.length > 0)) {
                _this.isNfygEmpth = true
              } else {
                _this.isNfygEmpth = false
              }
            } else {
              this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 切换商品订单状态
      onChangeTabGoods(name) {
        const state = name == 0 ? -1 : name
        this.goodsState = state
        this.getDataGoodsOrderList(this.goodsState)
        this.$cookies.set("onChangeTabGoodsState", name)
      },
      // 切换卡券订单状态
      onChangeTabCoupon(name) {
        let state = -1
        switch (name) {
          case 1:
          case 2:
            state = name - 1
            break;
          case 3:
            state = 4
            break;
          default:
            state = -1
            break;
        }
        this.couponState = state
        this.getDataCouponOrderList(state)
        this.$cookies.set("onChangeTabCouponState", name)
      },
      // 切换直充订单状态
      onChangeTabCharge(name) {
        let state = -1
        switch (name) {
          case 1:
          case 2:
            state = name - 1
            break;
          case 3:
            state = 4
            break;
          default:
            state = -1
            break;
        }
        this.chargeState = state
        this.getDataChargeOrderList(state)
        this.$cookies.set("onChangeTabChargeState", name)
      },
      // 直充订单 - 子组件传过来的操作订单
      changeThisOrderCharge(val) {
        const name = val.name
        this.chargeOrderCode = val.code
        if (name == 'cancel') {
          // 取消订单不需要二次确认，直接取消并刷新页面
          this.cancelThisOrderCharge()
        } else if (name == 'delete') {
          // this.delThisOrder()
          // 删除订单需要二次确认，打开确认弹窗
          this.isDelPopup2 = true
        }
      },

      // 商品订单 - 子组件传过来的操作订单
      changeThisOrder(val) {
        const name = val.name
        this.changeOrderNo = val.code
        if (name == 'finish') {
          // this.finishThisOrder()
          // 确认收货需要二次确认，打开确认弹窗
          this.isFinishPopup = true
        } else if (name == 'cancel') {
          // 取消订单不需要二次确认，直接取消并刷新页面
          this.cancelThisOrder()
        } else if (name == 'delete') {
          // this.delThisOrder()
          // 删除订单需要二次确认，打开确认弹窗
          this.isDelPopup = true
        } else if (name == 'logistic') {
          this.getDataLogisticDetail()
          this.isLogisticsPopup = true
        } else if (name == 'aniTimeOut') {
          // 倒计时结束，刷新列表
          if (this.$route.query.listType == 2) {
            this.getDataCouponOrderList(this.couponState)
          } else {
            this.getDataGoodsOrderList(this.goodsState)
          }
        }
      },
      // 商品订单 - 确认收货-确认收货需要二次确认，打开确认弹窗
      finishThisOrder() {
        const _this = this
        const shopUserInfo = _this.$cookies.get("shopUserInfo")
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderNo": _this.changeOrderNo,
          "uid": shopUserInfo ? shopUserInfo.uid : "",
          "type": 1
        }
        _this.$axios.post(GoodsUrl.goodsOrderDelete, formData)
          .then((res) => {
            // window.console.log(res)
            if (res.data.resultCode == 0) {
              _this.$toast("确认收货成功！")
              // 确认收货成功之后刷新页面
              _this.getDataGoodsOrderList(_this.goodsState)
              _this.isFinishPopup = false
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 商品订单 - 取消订单-取消订单不需要二次确认，直接取消并刷新页面
      cancelThisOrder() {
        const _this = this
        const shopUserInfo = _this.$cookies.get("shopUserInfo")
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderNo": _this.changeOrderNo,
          "uid": shopUserInfo ? shopUserInfo.uid : "",
          "type": 2
        }
        _this.$axios.post(GoodsUrl.goodsOrderDelete, formData)
          .then((res) => {
            // window.console.log(res)
            if (res.data.resultCode == 0) {
              _this.$toast("取消成功")
              // 取消成功之后刷新页面
              _this.getDataGoodsOrderList(_this.goodsState)
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 商品订单 - 删除订单-删除订单需要二次确认，打开确认弹窗
      delThisOrder() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderNo": _this.changeOrderNo,
          "uid": _this.shopUserInfo.uid || "",
          "type": 3
        }
        _this.$axios.post(GoodsUrl.goodsOrderDelete, formData)
          .then((res) => {
            // window.console.log(res)
            if (res.data.resultCode == 0) {
              _this.$toast("删除成功")
              // 删除成功之后刷新页面
              _this.getDataGoodsOrderList(_this.goodsState)
              _this.isDelPopup = false
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取物流信息
      getDataLogisticDetail() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderNo": _this.changeOrderNo
        }
        _this.$axios.post(GoodsUrl.goodsLogisticDetail, formData)
          .then((res) => {
            if (res.data.resultCode == 0) {
              if (res.data.data) {
                _this.LogisticData = res.data.data
              }
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 直充订单 - 取消订单-取消订单不需要二次确认，直接取消并刷新页面
      cancelThisOrderCharge() {
        const _this = this
        // const shopUserInfo = _this.$cookies.get("shopUserInfo")
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderCode": _this.chargeOrderCode,
        }
        _this.$axios.post(ChargeUrl.chargeOrderCancel, formData)
          .then((res) => {
            // window.console.log(res)
            if (res.data.resultCode == 0) {
              _this.$toast("取消成功")
              // 取消成功之后刷新页面
              _this.getDataChargeOrderList(_this.chargeState)
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 商品订单 - 删除订单-删除订单需要二次确认，打开确认弹窗
      delThisOrderCharge() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderCode": _this.chargeOrderCode,
        }
        _this.$axios.post(ChargeUrl.chargeOrderDelete, formData)
          .then((res) => {
            // window.console.log(res)
            if (res.data.resultCode == 0) {
              _this.$toast("删除成功")
              // 删除成功之后刷新页面
              _this.getDataChargeOrderList(_this.chargeState)
              _this.isDelPopup2 = false
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
    },
    components: {
      OrderItemCoupon,
      OrderItemCharge,
      OrderItemGoods,
      NfygEmpth
    }
  }
</script>

<style lang="less" scoped>
  .order-contain {
    max-height: calc(100vh - 0.92rem - 44px);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .active {
    color: #ff5656;
    font-weight: bold;
  }

  .popup-logistics {
    width: 6.4rem;
    height: 9.3rem;
    border-radius: 0.16rem;

    .name {
      display: flex;
      padding: 0.3rem;

      img {
        width: 1.44rem;
        height: 1.44rem;
        border-radius: 0.02rem;
      }

      div {
        margin: auto;
        margin-left: 0.2rem;
        margin-bottom: 0;
        font-size: 0.28rem;
        color: #333;

        .number {
          margin-top: 0.15rem;
        }
      }
    }

    .info {
      padding: 0.2rem 0.3rem;
      height: 7.51rem;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      border-top: solid 0.2rem #f8f8f8;

      .cell {
        display: flex;
        margin-top: 0.5rem;

        .circle {
          margin: auto;
          margin-left: 0;
          width: 0.17rem;
          height: 0.17rem;
          background: #ccc;
          border-radius: 50%;
        }

        .circle-0 {
          background: #ff5656;
        }

        .col {
          margin: auto;
          margin-left: 0.5rem;
          width: 5.2rem;

          .content {
            font-size: 0.28rem;
            color: #333;
          }

          .time {
            font-size: 0.24rem;
            color: #999;
            margin-top: 0.16rem;
          }
        }
      }
    }
  }
</style>
<template>
  <!-- 卡券订单 -->
  <div class="order-item">
    <div class="state">
      <p>{{stateName[orderData.status]}}</p>
    </div>
    <!-- <router-link :to="{name: (orderType == 'coupon' ? 'mydetailcoupon' : 'mydetailright'), query: {orderCode: orderData.orderCode}}"> -->
    <div class="goods-cell" @click="onClickCellGoods">
      <img class="img" v-lazy="orderData.logo || require('@/assets/nfyg_160_160.png')" alt="花生地铁">
      <div class="info">
        <div class="row">
          <p class="name">{{orderData.goodName}}</p>
          <p class="number">x {{orderData.amount}}</p>
        </div>
        <div class="row">
          <!-- <p class="desc">3层75g10卷*3提</p> -->
          <p class="price">￥{{regFenToYuan(orderData.price) || '--'}}</p>
        </div>
      </div>
    </div>
    <!-- </router-link> -->
    <div class="operate">
      <van-row type="flex" justify="end">
        <van-col v-if="orderData.status == 1" @click="onlineService(); onClickLine()"><button
            class="btn-public-2 no">申请售后</button></van-col>
        <van-col v-if="orderData.type == 2"><button class="btn-public-2 no">查看物流</button></van-col>
        <van-col v-if="orderData.type == 2"><button class="btn-public-2">确认收货</button></van-col>
        <router-link
          :to="{name: (orderType == 'coupon' ? 'mydetailcoupon' : 'mydetailright'), query: {orderCode: orderData.orderCode}}">
          <van-col v-if="orderData.status == 1"><button class="btn-public-2">使用凭证</button></van-col>
        </router-link>
        <van-col v-if="orderData.status == 1 || orderData.status == 4" @click="buyAgain"><button
            class="btn-public-2">再次购买</button></van-col>
        <van-col v-if="orderData.status == 0" @click="payOrderAgain"><button
            class="btn-public-2">付款￥{{regFenToYuan(orderData.price) || '--'}}</button></van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
  const _czc = window._czc || []
  import '../assets/css/goods.less'
  export default {
    name: '',
    props: ['orderType', 'orderData'],
    data() {
      return {
        stateName: {
          0: "待付款",
          1: "已支付",
          4: "已取消",
          5: "等待下单",
          6: "下单成功",
          7: "下单失败",
          8: "已删除",
        }
      }
    },
    mounted() {},
    methods: {
      // 再次提交付款
      payOrderAgain() {
        // this.$toast("去支付 orderCode = " + orderCode)
        if (this.orderData.type == 0) {
          _czc.push(['_trackEvent', 'apporder_07', '点击', '订单列表页-卡券-去支付{orderNo:' + this.orderData.orderCode +
            ',couponId:' + this.orderData.couponId + ',couponName:' + this.orderData.goodName + '}'
          ]);
        } else if (this.orderData.type == 1) {
          _czc.push(['_trackEvent', 'apporder_07', '点击', '订单列表页-权益-去支付{orderNo:' + this.orderData.orderCode +
            ',rightId:' + this.orderData.rightId + ',rightName:' + this.orderData.goodName + '}'
          ]);
        }
        if (this.orderData.mwebUrl && this.orderData.overSeconds > 5) {
          window.location.href = this.orderData.mwebUrl
        } else {
          this.$toast("支付倒计时小于5秒,建议重新下单")
        }
      },
      // 再次购买
      buyAgain() {
        if (this.orderData.type == 0) {
          _czc.push(['_trackEvent', 'apporder_08', '点击', '订单列表页-卡券-再次购买{couponId:' + this.orderData.couponId +
            ',couponName:' + this.orderData.goodName + '}'
          ]);
          this.$router.push({
            name: "detailcoupon",
            query: {
              isAgain: 1,
              detailType: "coupon",
              couponId: this.orderData.couponId,
              activeId: this.orderData.activeId,
              entryType: this.orderData.entryType
            }
          })
        } else if (this.orderData.type == 1) {
          _czc.push(['_trackEvent', 'apporder_08', '点击', '订单列表页-权益-再次购买{rightId:' + this.orderData.rightId +
            ',rightName:' + this.orderData.goodName + '}'
          ]);
          this.$router.push({
            name: "detailright",
            query: {
              isAgain: 1,
              detailType: "right",
              rightId: this.orderData.rightId,
              activeId: this.orderData.activeId,
              entryType: this.orderData.entryType
            }
          })
        }
      },
      // 跳转到详情页
      onClickCellGoods() {
        _czc.push(['_trackEvent', 'apporder_13', '点击', '订单列表页-卡券权益-进入详情页{orderNo:' + this.orderData.orderCode + '}']);
        this.$router.push({
          name: this.orderType == 'coupon' ? 'mydetailcoupon' : 'mydetailright',
          query: {
            orderCode: this.orderData.orderCode
          }
        })
      },
      onClickLine() {
        _czc.push(['_trackEvent', 'apporder_09', '点击', '订单列表页-卡券权益-申请售后']);
      },
    }
  }
</script>

<style lang="less" scoped>
  .order-item {
    margin-top: 0.2rem;
    background: #fff;

    .state {
      padding: 0 0.3rem;
      font-size: 0.28rem;
      line-height: 0.76rem;
      font-weight: 500;
      color: #ff5656;
      text-align: right;
      flex-direction: row-reverse;
    }

    .operate {
      padding: 0.26rem 0.3rem;

      button {
        min-width: 1.72rem;
        height: 0.56rem;
        margin-left: 0.24rem;
        padding: 0 0.2rem;
      }

      button.no {
        color: #666;
        border-color: #bbb;
      }
    }
  }
</style>
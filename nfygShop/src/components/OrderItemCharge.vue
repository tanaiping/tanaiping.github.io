<template>
  <!-- 直充订单 -->
  <div class="order-item">
    <div class="state">
      <p>{{stateName[orderData.status]}}</p>
    </div>
    <!-- <router-link :to="{name: (orderType == 'coupon' ? 'mydetailcoupon' : 'mydetailright'), query: {orderCode: orderData.orderCode}}"> -->
    <div class="goods-cell" @click="onClickCellGoods">
      <img class="img" v-lazy="orderData.logo || require('@/assets/nfyg_160_160.png')" alt="花生地铁">
      <div class="info">
        <div class="row">
          <p class="name">{{orderData.chargeName}}({{orderData.productType}})</p>
        </div>
        <div class="row">
          <p class="product">{{orderData.productName}}</p>
        </div>
        <div class="row">
          <p class="price">￥{{regFenToYuan(orderData.pay) || '--'}}</p>
        </div>
      </div>
    </div>
    <!-- </router-link> -->
    <div class="operate">
      <van-row type="flex" justify="end">
        <van-col v-if="orderData.status == 4"><button class="btn-public-2" @click="delThisOrderCharge">删除</button>
        </van-col>
        <van-col v-if="orderData.status == 0"><button class="btn-public-2 no"
            @click="cancelThisOrderCharge">取消订单</button></van-col>
        <van-col v-if="orderData.status != 0" @click="buyAgain"><button class="btn-public-2">再次充值</button></van-col>

        <van-col v-if="orderData.status == 0" @click="payOrderAgain"><button
            class="btn-public-2">待付款￥{{regFenToYuan(orderData.pay) || '--'}}</button></van-col>

      </van-row>
    </div>
  </div>
</template>

<script>
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
          5: "已支付", //等待下单
          6: "已支付", //下单成功
          7: "已支付", //下单失败
          8: "已删除",
          9: "已支付",
          10: "已支付",
        }
      }
    },
    mounted() {},
    methods: {
      // 再次提交付款
      payOrderAgain() {
        if (this.orderData.mwebUrl && this.orderData.overSeconds > 5) {
          window.location.href = this.orderData.mwebUrl
        } else {
          this.$toast("支付倒计时小于5秒,建议重新下单")
        }
      },
      // 再次购买
      buyAgain() {
        this.$router.push({
          name: "detailcharge",
          query: {
            chargeId: this.orderData.chargeId,
          },
        })
      },
      // 取消订单 
      cancelThisOrderCharge() {
        this.$emit("update", {
          name: 'cancel',
          code: this.orderData.orderCode
        })
      },
      // 删除订单 
      delThisOrderCharge() {
        this.$emit("update", {
          name: 'delete',
          code: this.orderData.orderCode
        })
      },
      // 跳转到详情页
      onClickCellGoods() {
        this.$router.push({
          name: "mydetailcharge",
          query: {
            orderCode: this.orderData.orderCode,
          },
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .order-item {
    margin-top: 0.2rem;
    background: #fff;

    .state {
      display: flex;
      padding: 0 0.3rem;
      font-size: 0.28rem;
      line-height: 0.76rem;
      font-weight: 500;
      color: #ff5656;
      text-align: right;
      flex-direction: row-reverse
    }

    .icon-del {
      margin: auto;
      margin-right: 0;
      margin-left: 0.25rem;
      width: 0.44rem;
      height: 0.44rem;
      background: #eee url("../assets/icon_del.png") no-repeat center / contain;
      border-radius: 50%;
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
<template>
  <!-- 商品订单 -->
  <div class="order-item">
    <div class="state">
      <p v-show="orderData.status == 4 || orderData.status == 5" @click="delThisOrder" class="icon-del"></p>
      <p class="text">{{stateName[orderData.status]}}</p>
    </div>
    <!-- <router-link :to="{name: 'mydetailgoods', query: {orderNo: orderData.orderNo}}"> -->
    <div class="goods-cell" @click="onClickCellGoods">
      <img class="img" v-lazy="orderData.thumbPic || require('@/assets/nfyg_160_160.png')" alt="花生地铁">
      <div class="info">
        <div class="row">
          <p class="name">{{orderData.goodsName}}</p>
          <p class="number">x {{orderData.num}}</p>
        </div>
        <div class="row">
          <p class="desc">{{orderData.attrName}}</p>
          <p class="price">￥{{regFenToYuan(orderData.pay) || '--'}}</p>
        </div>
      </div>
    </div>
    <!-- </router-link> -->
    <div class="operate">
      <van-row type="flex" justify="end">
        <van-col v-if="orderData.status == 1" @click="cancelThisOrder"><button class="btn-public-2 no">取消订单</button>
        </van-col>
        <van-col v-if="orderData.status == 3 || orderData.status == 4" @click="onlineService(); onClickLine()"><button
            class="btn-public-2 no">申请售后</button></van-col>
        <van-col v-if="orderData.status == 3" @click="getDataLogisticDetail()"><button
            class="btn-public-2 no">查看物流</button></van-col>
        <van-col v-if="orderData.status == 3" @click="finishThisOrder"><button class="btn-public-2">确认收货</button>
        </van-col>
        <van-col v-if="orderData.status == 2 || orderData.status == 4 || orderData.status == 5" @click="buyAgain">
          <button class="btn-public-2">再次购买</button></van-col>
        <!-- <van-col v-if="orderData.status == 1"
                 @click="payOrderAgain"><button class="btn-public-2">付款￥{{regFenToYuan(orderData.price) || '--'}}</button></van-col> -->
        <van-col v-if="orderData.status == 1" @click="payOrderAgain"><button class="btn-public-2">付款
            {{minute + ':' + seconds }}</button></van-col>
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
          0: "已删除",
          1: "待付款",
          2: "待发货",
          3: "待收货",
          4: "已完成",
          5: "已取消",
        },
        day: "0",
        hour: "00",
        minute: "00",
        seconds: "00",
      }
    },
    mounted() {
      if (this.orderData.overSeconds > 0) {
        this.aniCountdown(this.orderData.overSeconds)
      }
    },
    methods: {
      // 跳转到详情页
      onClickCellGoods() {
        _czc.push(['_trackEvent', 'apporder_13', '点击', '订单列表页-商品-进入详情页{orderNo:' + this.orderData.orderNo + '}']);
        this.$router.push({
          name: 'mydetailgoods',
          query: {
            orderNo: this.orderData.orderNo
          }
        })
      },
      // 去支付
      payOrderAgain() {
        _czc.push(['_trackEvent', 'apporder_07', '点击', '订单列表页-商品-去支付{orderNo:' + this.orderData.orderNo + ',goodsId:' +
          this.orderData.goodsId + ',goodsName:' + this.orderData.goodsName + '}'
        ]);
        if (this.orderData.wxMwebUrl && this.orderData.overSeconds > 5) {
          window.location.href = this.orderData.wxMwebUrl
        } else {
          this.$toast("支付倒计时小于5秒,建议重新下单！")
        }
      },
      // 再次购买
      buyAgain() {
        _czc.push(['_trackEvent', 'apporder_08', '点击', '订单列表页-商品-再次购买{goodsId:' + this.orderData.goodsId +
          ',goodsName:' + this.orderData.goodsName + ',skuId:' + this.orderData.skuId + '}'
        ]);
        this.$router.push({
          name: "detailgoods",
          query: {
            isAgain: 1,
            detailType: "goods",
            goodsId: this.orderData.goodsId,
            activeId: this.orderData.activeId,
            checkSkuId: this.orderData.skuId,
            entryType: this.orderData.entryType,
          }
        })
      },
      // 确认收货 - type = 1
      finishThisOrder() {
        _czc.push(['_trackEvent', 'apporder_12', '点击', '订单列表页-商品-确认收货']);
        this.$emit("update", {
          name: 'finish',
          code: this.orderData.orderNo
        })
      },
      // 取消订单 - type = 2
      cancelThisOrder() {
        this.$emit("update", {
          name: 'cancel',
          code: this.orderData.orderNo
        })
      },
      // 删除订单 - type = 3
      delThisOrder() {
        this.$emit("update", {
          name: 'delete',
          code: this.orderData.orderNo
        })
      },
      // 查询物流详情
      getDataLogisticDetail() {
        this.$emit("update", {
          name: 'logistic',
          code: this.orderData.orderNo
        })
      },
      onClickLine() {
        _czc.push(['_trackEvent', 'apporder_09', '点击', '订单列表页-商品-申请售后']);
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
          this.$emit("update", {
            name: 'aniTimeOut',
            code: false
          })
        }
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
      flex-direction: row-reverse;

      .text {
        flex: 1;
        margin-right: 0;
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
    }

    .operate {
      padding: 0.26rem 0.3rem;

      button {
        min-width: 1.72rem;
        height: 0.56rem;
        line-height: 0.56rem;
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
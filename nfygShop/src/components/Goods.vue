<template>
  <div class="goods" @click="linkToDeatils(detailType)">
    <div class="img">
      <img class="img" v-lazy="goods.thumbPic || require('@/assets/nfyg_180_180.png')" alt="花生地铁">
      <div v-if="special == 3 && timeOut" class="countdown timeOut">已结束</div>
      <div v-if="special == 3 && !timeOut" class="countdown">距结束:{{day}}天<br />{{hour}}:{{minute}}:{{seconds}}
      </div>
      <img v-show="goods.stockNum == 0" class="sell-out" :src="require('@/assets/sell_out.png')" alt="售罄" />
    </div>
    <!-- 兑换专区 -->
    <div v-if="special == 2" class="info info-special">
      <p class="name">
        <!-- <van-tag v-show="goods.freight == 0" round color="rgba(255,86,86,0.1)" text-color="#FF5656">包邮</van-tag> -->
        <img v-show="goods.freight == 0" class="tags" :src="require('@/assets/tags.png')" alt="">
        <span>{{detailType == 'right' ? goods.rightName : goods.activityName}}</span>
      </p>
      <p class="value"><span class="value-2">¥{{regFenToYuan(goods.disPrice) || '--'}}</span><span class="value-1">市场价
          ¥{{regFenToYuan(goods.price) || '--'}}</span></p>
      <div class="row">
        <p class="price" v-if="goods.excPrice > 0">￥{{regFenToYuan(goods.excPrice) || '--'}}
          <span class="add"> + </span><span class="icon-coin"><span class="path1"></span><span
              class="path2"></span><span class="path3"></span></span>
          {{goods.excPoint}}</p>
        <p class="price" v-if="goods.excPrice == 0"><span class="icon-coin"><span class="path1"></span><span
              class="path2"></span><span class="path3"></span></span>
          {{goods.excPoint}}</p>
        <button class="btn-public-2 btn">去兑换</button>
      </div>
    </div>
    <!-- 限时抢购 -->
    <div v-else-if="special == 3" class="info info-special">
      <p class="name">
        <!-- <van-tag v-show="goods.freight == 0" round color="rgba(255,86,86,0.1)" text-color="#FF5656">包邮</van-tag> -->
        <img v-show="goods.freight == 0" class="tags" :src="require('@/assets/tags.png')" alt="">
        <span>{{detailType == 'right' ? goods.rightName : goods.activityName}}</span>
      </p>
      <p class="return" v-show="goods.returnPoint > 0">会员每件可返{{goods.returnPoint}}花花币</p>
      <p class="value"><span class="value-1" :style="{marginLeft: 0}">市场价￥{{regFenToYuan(goods.price) || '--'}}</span>
      </p>
      <div class="row">
        <p class="price">￥{{regFenToYuan(goods.panicPrice) || '--'}}</p>
        <button class="btn-public-2 btn">{{timeOut ? '已结束' : '去抢购'}}</button>
      </div>
    </div>
    <!-- 花花推荐 -->
    <div v-else class="info">
      <p class="name">
        <!-- <van-tag v-show="goods.freight == 0" round color="rgba(255,86,86,0.1)" text-color="#FF5656">包邮</van-tag> -->
        <img v-show="goods.freight == 0" class="tags" :src="require('@/assets/tags.png')" alt="">
        <span>{{detailType == 'right' ? goods.rightName : goods.activityName}}</span>
      </p>
      <p class="return" v-show="goods.returnPoint > 0">会员每件可返{{goods.returnPoint}}花花币</p>
      <p class="value"><span class="value-1">市场价 ¥{{regFenToYuan(goods.price) || '--'}}</span><span class="value-2">优惠价
          ¥{{regFenToYuan(goods.salePrice) || '--'}}</span></p>
      <div class="row">
        <p class="price">￥{{regFenToYuan(goods.disPrice) || '--'}}</p>
        <img class="tag-s" :src="require('@/assets/tag_s.png')" alt="花花权益价">
        <!-- <p class="sales">已售 {{goods.assign}}</p> -->
      </div>
    </div>
  </div>
</template>

<script>
  const _czc = window._czc || []
  import '../assets/css/goods.less'

  export default {
    name: '',
    props: ['detailType', 'goods', 'special', 'overSeconds'],
    data() {
      return {
        day: "0",
        hour: "00",
        minute: "00",
        seconds: "00",
        timeOut: false
      }
    },
    mounted() {
      this.aniCountdown(this.overSeconds)
    },
    methods: {
      linkToDeatils(detail) {
        if (this.special == 1) {
          _czc.push(['_trackEvent', 'appcommerce_23', '点击', '首页-花花推荐{unionKey:' + this.goods.unionKey +
            ',activityName:' + this.goods.activityName + '}'
          ]);
        } else if (this.special == 2) {
          _czc.push(['_trackEvent', 'appcommerce_23', '点击', '兑换专区{unionKey:' + this.goods.unionKey + ',activityName:' +
            this.goods.activityName + '}'
          ]);
        } else if (this.special == 3) {
          _czc.push(['_trackEvent', 'appcommerce_23', '点击', '限时抢购{unionKey:' + this.goods.unionKey + ',activityName:' +
            this.goods.activityName + '}'
          ]);
        }
        if (this.goods.stockNum == 0) {
          this.$toast("该商品已售罄！")
          return;
        }
        if (this.special == 3 && this.timeOut) {
          this.$toast("该商品抢购已结束！")
          return;
        }
        if (detail == "coupon") {
          this.$router.push({
            name: "detailcoupon",
            query: {
              detailType: "coupon",
              couponId: this.goods.unionKey,
              activeId: this.goods.activeId,
              entryType: this.special
            }
          })
        } else {
          this.$router.push({
            name: "detailgoods",
            query: {
              detailType: "goods",
              goodsId: this.goods.unionKey,
              activeId: this.goods.activeId,
              checkSkuId: this.goods.checkSkuId,
              entryType: this.special,
            }
          })
        }
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
          this.timeOut = true
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .goods {
    margin: 0 0.3rem;
    padding: 0.3rem 0 0 0;

    .info {
      .value-2 {
        margin-left: 0.2rem;
      }

      .price {
        margin: auto;
        margin-left: 0;
        margin-right: 0;
        color: #ff3b30;
      }

      .sales {
        margin: auto;
        margin-right: 0;
      }
    }

    .info-special {
      .value {
        .value-1 {
          margin-left: 0.2rem;
          color: #999;
        }

        .value-2 {
          margin-left: 0;
          color: #333;
        }
      }

      .price {
        .add {
          font-size: 0.3rem;
        }
      }

      .btn {
        width: 1.3rem;
        height: 0.45rem;
        margin: auto;
        margin-right: 0;
        padding: 0;
        font-size: 0.24rem;
        border-radius: 0.23rem;
      }
    }
  }
</style>
<template>
  <div class="my-order bg-public">
    <!-- 卡券订单 -->
    <van-cell-group class="group-public order-cards" :border='false'>
      <van-cell title="卡券订单" value="查看全部卡券订单" :border='false' is-link :to="{name:'myorderlist', query:{listType: 2}}"
        @click="onClickCellMore('cards')" />
      <van-row type="flex" justify="space-around">
        <van-col v-for="(item, i) in couponName" :key="i">
          <router-link :to="{name: 'myorderlist', query:{listType: 2, couponState: (i + 1)}}">
            <div :class="'icon i-c' + (i + 1)"></div>
            <p class="text">{{item}}</p>
          </router-link>
        </van-col>
      </van-row>
    </van-cell-group>
    <!-- 直充订单 -->
    <van-cell-group class="group-public order-cards" :border='false'>
      <van-cell title="直充订单" value="查看全部充值订单" :border='false' is-link :to="{name:'myorderlist', query:{listType: 3}}"
        @click="onClickCellMore('charge')" />
      <van-row type="flex" justify="space-around">
        <van-col v-for="(item, i) in chargeName" :key="i">
          <router-link :to="{name: 'myorderlist', query:{listType: 3, chargeState: (i + 1)}}">
            <div :class="'icon i-z' + (i + 1)"></div>
            <p class="text">{{item}}</p>
          </router-link>
        </van-col>
      </van-row>
    </van-cell-group>
    <!-- 商品订单 -->
    <van-cell-group class="group-public order-goods" :border='false'>
      <van-cell title="商品订单" value="查看全部商品订单" :border='false' is-link :to="{name:'myorderlist', query:{listType: 1}}"
        @click="onClickCellMore('goods')" />
      <van-row type="flex" justify="space-around">
        <van-col v-for="(item, i) in goodsName" :key="i">
          <router-link v-if="i < 4" :to="{name: 'myorderlist', query:{listType: 1, goodsState: (i + 1)}}">
            <div :class="'icon i-s' + (i + 1)"></div>
            <p class="text">{{item}}</p>
          </router-link>
          <div v-if="i == 4" @click="onlineService">
            <div :class="'icon i-s' + (i + 1)"></div>
            <p class="text">{{item}}</p>
          </div>
        </van-col>
      </van-row>
    </van-cell-group>
	<!-- 其他订单订单 -->
	<!-- <van-cell-group class="group-public order-goods" :border='false'>
	  <van-cell title="其他订单" value="查看全部其他订单" :border='false' is-link
	    @click="toOtherOrderList()" />
	</van-cell-group> -->
  </div>
</template>

<script>
  import md5 from 'js-md5';
  const _czc = window._czc || []
  export default {
    name: '',
    data() {
      return {
        couponName: ["待付款", "已支付", "已取消"],
        chargeName: ["待付款", "已支付", "已取消"],
        goodsName: ["待付款", "待发货", "待收货", "已完成", "售后服务"]
      }
    },
    mounted() {
		const shopUserInfo = this.$cookies.get("shopUserInfo")
		if (shopUserInfo) {
		  this.shopUserInfo = shopUserInfo
		}
      this.$cookies.remove('onChangeTabGoodsState')
      this.$cookies.remove('onChangeTabCouponState')
      this.$cookies.remove('onChangeTabChargeState')
    },
    methods: {
      onClickCellMore(type) {
        if (type == 'cards') {
          _czc.push(['_trackEvent', 'apporder_05', '点击', '我的订单页-查看全部{type:0}']);
        } else if (type == 'goods') {
          _czc.push(['_trackEvent', 'apporder_05', '点击', '我的订单页-查看全部{type:1}']);
        } else if (type == 'charge'){
          _czc.push(['_trackEvent', 'apporder_05', '点击', '我的订单页-查看全部{type:2}']);
        }
      },
	  getSign(params, secre) {
	      if (typeof params == "string") {
	          return this.paramsStrSort(params,secre);
	      } else if (typeof params == "object") {
	          var arr = [];
	          for (var i in params) {
	              arr.push((i + "=" + params[i]));
	          }
	          return this.paramsStrSort(arr.join(("&")),secre);
	      }
	  },
	  paramsStrSort(paramsStr,secre) {
	      var url = paramsStr;
	      var urlStr = url.split("&").sort().join("");
	      var newUrl = urlStr + secre;
	      return md5(newUrl);   //.toUpperCase();
	  },
	  toOtherOrderList() {  //第三方 查看全部其他订单
	  	  const uid = this.shopUserInfo.uid || "";
	  	  const target_url = 'https://qilin.shentongcard.com/qilin/hd/coupon/index?view_id=23'
	  	  let encodeUrl = encodeURIComponent(target_url);
		  const timestamp = parseInt(new Date().getTime()/1000)+86400;
	  	  var params = "uid"+uid+"&platformpeanut&t"+timestamp+"&target_url"+target_url;
	  	  let sign = this.getSign(params,'8d31585e1e685b7d6a83a3c913e2ca08');
		  console.log('https://qilin.shentongcard.com/qilin/hd/union?uid='+uid+'&platform=peanut&t='+timestamp+'&target_url='+encodeUrl+'&sign='+sign)
	  	  window.location.href = 'https://qilin.shentongcard.com/qilin/hd/union?uid='+uid+'&platform=peanut&t='+timestamp+'&target_url='+encodeUrl+'&sign='+sign;
	  }
    }
	
	
  }
</script>

<style lang="less" scoped>
  .group-public {
    overflow: hidden;

    .van-cell {
      padding: 0.23rem 0.3rem;
    }

    .van-cell__title {
      font-size: 0.32rem;
      font-weight: bold;
      color: #1e1e1e;
    }

    .van-row {
      padding: 0.15rem 0.2rem 0.3rem 0.2rem;
    }

    .text {
      font-size: 0.26rem;
      color: #666;
      margin-top: 0.2rem;
    }

    .icon {
      width: 0.64rem;
      height: 0.64rem;
      margin: auto;
      background: url(../../assets/order_sprites.png) no-repeat center / 0.64rem 7.68rem;
    }

    .icon.i-c1 {
      background-position: -0 -0;
    }

    .icon.i-c2 {
      background-position: -0 -0.64rem;
    }

    .icon.i-c3 {
      background-position: -0 -1.28rem;
    }

    .icon.i-c4 {
      background-position: -0 -1.92rem;
    }

    .icon.i-s1 {
      background-position: -0 -2.56rem;
    }

    .icon.i-s2 {
      background-position: -0 -3.2rem;
    }

    .icon.i-s3 {
      background-position: -0 -3.84rem;
    }

    .icon.i-s4 {
      background-position: -0 -4.48rem;
    }

    .icon.i-s5 {
      background-position: -0 -5.12rem;
    }

    .icon.i-z1 {
      background-position: -0 -5.76rem;
    }

    .icon.i-z2 {
      background-position: -0 -6.4rem;
    }

    .icon.i-z3 {
      background-position: -0 -7.04rem;
    }
  }
</style>
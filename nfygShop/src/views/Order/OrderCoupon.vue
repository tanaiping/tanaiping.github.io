<template>
  <!-- 提交订单，卡券 -->
  <!-- /v1/coupon/order/commit -->
  <div class="order bg-public">
    <!-- 卡券订单订单详情 -->
    <van-cell-group class="goods"
                    :border='false'>
      <img class="img"
           :src="couponData.logo || require('@/assets/nfyg_180_180.png')"
           alt="花生地铁">
      <div class="info">
        <p class="name">{{couponData.couponName}}</p>
        <!-- <p class="desc">4层加厚·一格顶两格·细密纤维</p> -->
        <div class="cell">
          <!-- 花生权益和花花推荐 -->
          <h5 class="price"
              v-if="$route.query.entryType == 1 || $route.query.entryType == 5">
            ￥{{shopUserInfo.vipType == 0 ? (regFenToYuan(couponData.salePrice) || '--') : (regFenToYuan(couponData.disPrice) || '--')}}
          </h5>
          <!-- 兑换专区 -->
          <!-- v-if="goods.excPrice > 0" -->
          <h5 class="price"
              v-if="$route.query.entryType == 2 && couponData.excPrice > 0">
            ￥{{regFenToYuan(couponData.excPrice) || '--'}}
            <span class="add"> + </span><span class="icon-coin"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
            {{couponData.excPoint}}
          </h5>
          <h5 class="price"
              v-if="$route.query.entryType == 2 && couponData.excPrice == 0"><span class="icon-coin"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
            {{couponData.excPoint}}
          </h5>
          <!-- 限时抢购 -->
          <h5 class="price"
              v-if="$route.query.entryType == 3">
            ￥{{regFenToYuan(couponData.panicPrice) || '--'}}
          </h5>
        </div>
      </div>
    </van-cell-group>
    <!-- 选择购买数量  ---  卡券订单需要填写购买数量 -->
    <van-cell-group class="detail"
                    :border='false'>
      <van-cell title="请选择购买数量"
                :border='false'>
        <van-stepper v-model="stepperValue"
                     min="1"
                     :max="couponData.maxLimit"
                     integer
                     @change="onChangeStepperValue" />
      </van-cell>
    </van-cell-group>
    <!-- 留资  ---  卡券订单需要留资 -->
    <p class="field-tips"
       v-show="couponData.feedback">填写收货信息</p>
    <van-cell-group v-show="couponData.feedback"
                    class="feed"
                    :border='false'>
      <div class="van-cell van-field"
           v-for="(item, i) in couponData.feedItemList"
           :key="i">
        <div class="van-cell__title"><span>{{item}}</span></div>
        <div class="van-cell__value">
          <div class="van-field__body">
            <input type="text"
                   v-model="feedItem[i]"
                   :placeholder="item"
                   class="van-field__control">
          </div>
        </div>
      </div>
    </van-cell-group>
    <!-- 商品折扣信息  ---  公用 -->
    <van-cell-group class="detail"
                    :border='false'>
      <!--tepperValue * couponData.price-->
      <van-cell title="商品金额"
                :value="couponData.salePrice !=null?'￥' + regFenToYuan(stepperValue * couponData.salePrice) : '￥--'"
                :border='false' />
      <!-- <van-cell v-show="$route.query.orderType != 'coupon'" title="运费" value="+￥0.0" :border='false'/> -->
      <van-cell title="花粉专享折扣"
                :value="couponData.salePrice!=null?'-￥' + regFenToYuan(stepperValue * (couponData.salePrice - couponData.pay)) : '￥--'"
                :border='false' />
    </van-cell-group>
    <!--stepperValue * (couponData.price - couponData.disPrice)-->
    <!-- 开通花花卡会员 -->
    <!-- <van-cell-group class="member"
                    :border='false'
                    v-show="shopUserInfo.vipType == 0 ? true : false"
                    @click="$router.push({name:'perfectinfo'})">
      <div class="left">
        <p class="title">花花卡会员</p>
        <p class="desc">
          开通立享花粉权益，本单省{{regFenToYuan(stepperValue * (couponData.salePrice - couponData.disPrice)) || '--'}}元</p>
      </div>
      <button class="right btn-public-2">0元购</button>
    </van-cell-group> -->
    <!-- 底部提交订单按钮 -->
    <div class="foot">
      <!-- 花生权益和花花推荐 -->
      <div class="price"
           v-if="$route.query.entryType == 1 || $route.query.entryType == 5">
        实付款：<span>￥{{shopUserInfo.vipType == 0 ? (regFenToYuan(stepperValue * couponData.salePrice) || '--') : (regFenToYuan(stepperValue * couponData.disPrice) || '--')}}</span>
      </div>
      <!-- 兑换专区 -->
      <div class="price"
           v-if="$route.query.entryType == 2 && couponData.excPrice > 0">
        实付款：<br><span>￥{{regFenToYuan(stepperValue * couponData.excPrice) || '--'}}
          <span class="add"> + </span><span class="icon-coin"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
          {{stepperValue * couponData.excPoint}}
        </span>
      </div>
      <div class="price"
           v-if="$route.query.entryType == 2 && couponData.excPrice == 0">
        实付款：<br><span><span class="icon-coin"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
          {{stepperValue * couponData.excPoint}}
        </span>
      </div>
      <!-- 限时抢购 -->
      <div class="price"
           v-if="$route.query.entryType == 3">
        实付款：<span>￥{{regFenToYuan(stepperValue * couponData.panicPrice) || '--'}}</span>
      </div>
      <div class="return"
           v-show="couponData.backBi > 0">返{{stepperValue * couponData.backBi}}花花币</div>
      <button class="btn-public pay"
              @click="submitOrder">{{couponData.stockNum > 0 ? '提交订单' : '已售空'}}</button>
    </div>
    <!-- 选择支付方式 -->
    <van-popup v-model="isPopup">
      <h5 class="title">选择支付方式</h5>
      <van-radio-group v-model="radio">
        <van-cell-group :border='false'>
          <van-cell clickable
                    :border='false'
                    @click="radio='1'">
            <div class="i-alipay"></div>
            <span>支付宝支付</span>
            <van-radio slot="right-icon"
                       name="1"
                       checked-color="#FF5656" />
          </van-cell>
          <van-cell clickable
                    :border='false'
                    @click="radio='2'">
            <div class="i-wechat"></div>
            <span>微信支付</span>
            <van-radio slot="right-icon"
                       name="2"
                       checked-color="#FF5656" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <button class="btn-public btn"
              @click="submitOrderAndPay">{{radio== 1 ? "支付宝支付：": "微信支付："}}￥{{regFenToYuan(stepperValue * couponData.disPrice) || '--'}}</button>
    </van-popup>
    <!-- 花花币不足提示 -->
    <van-popup v-model="isCoinPopup"
               class="popup-public popup-coin">
      <h5 class="title">温馨提示</h5>
      <p class="tips">亲，您的花花币不足，无法购买！</p>
      <div class="button">
        <button class="cancel"
                @click="isCoinPopup = false">取消</button>
        <button class="back"
                @click="$router.push({name:'special', query: {specialType: 2}})">继续逛逛</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  CouponUrl
} from '../../config/url'
import {
  browser, checkAppInstall
} from '../../server/nfygCommon'

import './order.less'

export default {
  name: '',
  data () {
    return {
      shopUserInfo: {
        "vipType": 0
      },
      orderNo: "",
      isAddress: false,
      isPopup: false,
      isCoinPopup: false,
      radio: '1',
      stepperValue: 1,
      couponData: {},
      feedItem: [],
	  redirect_url:'',
	  goodsType:'',
    }
  },
  mounted () {
    const shopUserInfo = this.$cookies.get("shopUserInfo")
    if (shopUserInfo) {
      this.shopUserInfo = shopUserInfo
    }
    this.getDataDetail()
  },
  methods: {
	 // 获取路径参数信息
	 getQueryString(url, name) {
	   let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	   let r = decodeURIComponent(url).substr(1).match(reg);
	   if (r != null) {
	 	return decodeURI(r[2])
	   }
	   return null
	 },
    // 获取初始化数据 --- 卡券详情
    getDataDetail () {
      const _this = this
      const query = _this.$route.query
      const agentKey = _this.$cookies.get("shopAgentKey")
      const formData = {
        "agentKey": agentKey || "peanut_subway",
        "sign": "fdfc57a94fc480d3a872c9",
        "uid": _this.shopUserInfo.uid || "",
        "couponId": query.couponId,
        "entryType": query.entryType,
        "activeId": query.activeId || "",
      }
      _this.$axios.post(CouponUrl.couponDetail, formData)
        .then((res) => {
          // window.console.log(res);
          if (res.data.resultCode == 0) {
            _this.couponData = res.data.data
          } else {
            _this.$toast(res.data.resultMsg)
          }
        })
        .catch((error) => {
          window.console.log(error);
        })
    },
    // 提交订单
    submitOrder () {
      if (this.shopUserInfo.uid) {
        this.submitOrderAndPay()
      } else {
        if (browser.isNfyg) {
          this.$toast("请先绑定手机号码")
          return
        } else {
          this.$toast("请先登录")
          setTimeout(() => {
            this.$router.push({
              name: "login"
            })
          }, 2000);
        }
      }
    },
    // 提交订单并且去支付
    submitOrderAndPay () {
      const _this = this
      if (_this.isClickAndForbidden) {
        return
      }
      if (_this.couponData.feedItemList) {
        if (_this.feedItem.length < _this.couponData.feedItemList.length) {
          _this.$toast('请填写收货信息')
          return
        }
      }
      _this.isClickAndForbidden = true
      let feed = []
      if (_this.couponData.feedItemList) {
        _this.couponData.feedItemList.forEach((item, i) => {
          const data = {
            "feedDesc": item,
            "feedValue": _this.feedItem[i]
          }
          feed.push(data)
        });
      }
      const query = _this.$route.query
      const agentKey = _this.$cookies.get("shopAgentKey")
      const formData = {
        "agentKey": agentKey || "peanut_subway",
        "sign": "fdfc57a94fc480d3a872c9",
        "uid": _this.shopUserInfo.uid || "",
        "couponId": _this.$route.query.couponId,
        "entryType": query.entryType,
        "activeId": query.activeId || "",
        "amount": _this.stepperValue,
        "feedItemList": feed,
        "payType": 2
      }
      _this.$axios.post(CouponUrl.couponCommit, formData)
        .then((res) => {
          // window.console.log(res);
          if (res.data.resultCode == 0) {
			  //处理IOS支付完成之后不能跳到结果页
			  _this.redirect_url = _this.getQueryString(res.data.data.mwebUrl,'redirect_url');
			  _this.goodsType = _this.getQueryString(res.data.data.mwebUrl,'goodsType');
			  if(browser.ios){
				  setInterval(function(){
					if(_this.redirect_url){
						  window.location.href = _this.redirect_url+"&goodsType="+_this.goodsType;
					}
				  },1000)
			  }
            if (browser.isNfyg) {
              // 判断是否安装微信客户端
              checkAppInstall('com.tencent.mm', 'wechat', function (check) {
                if (check) {
                  window.location.href = res.data.data.mwebUrl
                } else {
                  _this.$toast('您的手机还未安装微信，不能进行微信支付！')
                }
              })
            } else {
              window.location.href = res.data.data.mwebUrl
            }
            // window.location.href = res.data.data.mwebUrl
          } else if (res.data.resultCode == 10) {
            // 花花币不足提示
            _this.isCoinPopup = true
          } else {
            _this.$toast(res.data.resultMsg)
          }
          _this.isClickAndForbidden = false
        })
        .catch((error) => {
          window.console.log(error);
        })
    },
    // 修改计步器数据
    onChangeStepperValue (value) {
      if (value >= this.couponData.maxLimit) {
        this.$toast("亲，每人最多可以购买" + this.couponData.maxLimit + "件~")
      }
      if (value >= this.couponData.stockNum) {
        this.$toast("亲，该商品库存只剩" + this.couponData.stockNum + "件~")
      }
    }
  }
}
</script>
<style lang="less" scoped>
.btn-text {
  margin-top: 0.25rem;
}
</style>
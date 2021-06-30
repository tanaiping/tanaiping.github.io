<template>
  <!-- 提交订单，卡券 -->
  <!-- /v1/coupon/order/commit -->
  <div class="order bg-public">
    <!-- 卡券订单订单详情 -->
    <van-cell-group class="goods" :border='false'>
      <img class="img" :src="chargeData.imageUrl || require('@/assets/nfyg_180_180.png')" alt="花生地铁">
      <div class="info">
        <p class="name">{{chargeData.chargeName}}({{type}})</p>
      </div>
    </van-cell-group>

    <!-- 商品折扣信息  ---  公用 -->
    <div v-for="(item, i) in chargeData.typeList" :key="i" v-if="item.type==type">
      <div v-for="(item, x) in chargeData.typeList[i].productList" :key="x" v-if="item.productId==productId">
        <!-- 商品折扣信息  ---  公用 -->
        <van-cell-group class="detail" :border='false'>
          <van-cell title="规格" :value="item.productName" :border='false' />
        </van-cell-group>
        <van-cell-group class="detail" :border='false'>
          <!--tepperValue * chargeData.price-->
          <van-cell title="商品官方价" :value="item.price !=null?'￥' + regFenToYuan(item.price) : '￥--'" :border='false' />
          <!-- <van-cell v-show="$route.query.orderType != 'coupon'" title="运费" value="+￥0.0" :border='false'/> -->
          <van-cell title="花粉专享折扣" v-if="shopUserInfo.vipType == 0"
            :value="item.price!=null?'-￥' + regFenToYuan((item.price - item.price)) : '￥--'" :border='false' />
          <van-cell title="花粉专享折扣" v-else
            :value="item.price!=null?'-￥' + regFenToYuan((item.price - item.salePrice)) : '￥--'" :border='false' />
        </van-cell-group>
        <van-cell-group class="detail red" :border='false'>
          <!--tepperValue * chargeData.price-->
          <van-cell title="需支付" v-if="shopUserInfo.vipType == 0"
            :value="item.price !=null?'￥' + regFenToYuan(item.price) : '￥--'" :border='false' />
          <van-cell title="需支付" v-else :value="item.salePrice !=null?'￥' + regFenToYuan(item.salePrice) : '￥--'"
            :border='false' />
        </van-cell-group>
        <!-- 开通花花卡会员 -->
        <!-- <van-cell-group class="member" :border='false' v-show="shopUserInfo.vipType == 0 ? true : false"
          @click="$router.push({name:'perfectinfo'})">
          <div class="left">
            <p class="title">花花卡会员</p>
            <p class="desc">
              开通立享花粉权益，本单省{{regFenToYuan((item.price - item.salePrice)) || '--'}}元
            </p>
          </div>
          <button class="right btn-public-2">0元购</button>
        </van-cell-group> -->

        <!-- 底部提交订单按钮 -->
        <div class="foot">
          <button class="btn-public pay" @click="submitOrder">提交订单</button>
        </div>
        <!-- 选择支付方式 -->
        <van-popup v-model="isPopup">
          <h5 class="title">选择支付方式</h5>
          <van-radio-group v-model="radio">
            <van-cell-group :border='false'>
              <van-cell clickable :border='false' @click="radio='1'">
                <div class="i-alipay"></div>
                <span>支付宝支付</span>
                <van-radio slot="right-icon" name="1" checked-color="#FF5656" />
              </van-cell>
              <van-cell clickable :border='false' @click="radio='2'">
                <div class="i-wechat"></div>
                <span>微信支付</span>
                <van-radio slot="right-icon" name="2" checked-color="#FF5656" />
              </van-cell>
            </van-cell-group>
          </van-radio-group>
          <button class="btn-public btn"
            @click="submitOrderAndPay">{{radio== 1 ? "支付宝支付：": "微信支付："}}￥{{regFenToYuan(item.salePrice) || '--'}}</button>
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    ChargeUrl
  } from '../../config/url'
  import {
    browser,
    checkAppInstall
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
      isPopup: false,
      radio: '1',
      chargeData: {},
	  productId:"",
	  type:"",
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
	  _this.productId = query.productId
	  _this.type = query.type
	  window.console.log(_this.productId)
      const formData = {
        "agentKey": agentKey || "peanut_subway",
        "sign": "fdfc57a94fc480d3a872c9",
        "chargeId": query.chargeId,
        }
        _this.$axios.post(ChargeUrl.chargeDetail, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.chargeData = res.data.data;
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 提交订单
      submitOrder() {
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
      submitOrderAndPay() {
        const _this = this
        if (_this.isClickAndForbidden) {
          return
        }
        _this.isClickAndForbidden = true

        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "", //'242667944180449690554342223',
          "payType": 2,
          "productId": query.productId,
          "chargeAccount": query.chargeAccount,
        }
        _this.$axios.post(ChargeUrl.chargeCommit, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
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
            } else {
              _this.$toast(res.data.resultMsg)
            }
            _this.isClickAndForbidden = false
          })
          .catch((error) => {
            window.console.log(error);
          })
      }
    }
  }
</script>
<style lang="less" scoped>
  .btn-text {
    margin-top: 0.25rem;
  }

  .order .foot {
    position: fixed;
    bottom: 0;
    padding: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin: auto;
    width: 100%;
    background: #fff;
  }

  .order .foot .pay {
    width: 100%;
    height: 0.8rem;
    border-radius: 0;
    margin: auto;
  }

  .order .detail.red .van-cell__value {
    color: #ff3b30
  }
</style>
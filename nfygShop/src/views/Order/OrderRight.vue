<template>
  <!-- 提交订单，权益 -->
  <!-- /v1/right/order/commit  -->
  <div class="order bg-public">
    <!-- 权益订单订单详情 -->
    <van-cell-group class="goods" :border='false'>
      <img class="img" :src="rightData.rightLogo || require('@/assets/nfyg_180_180.png')" alt="花生地铁">
      <div class="info">
        <p class="name">{{rightData.rightName}}</p>
        <!-- <p class="desc">4层加厚·一格顶两格·细密纤维</p> -->
        <div class="cell">
          <h5 class="price">
            ￥{{shopUserInfo.vipType == 0 ? (regFenToYuan(rightData.salePrice) || '--') : (regFenToYuan(rightData.disPrice) || '--')}}
          </h5>
        </div>
      </div>
    </van-cell-group>
    <!-- 选择购买数量  ---  卡券订单需要填写购买数量 -->
    <!-- <van-cell-group class="detail" :border='false'>
            <van-cell title="请选择购买数量" :border='false'>
                <van-stepper v-model="stepperValue" min="1" integer @change="onChangeStepperValue"/>
            </van-cell>
        </van-cell-group> -->
    <!-- 商品折扣信息  ---  公用 -->
    <van-cell-group class="detail" :border='false'>
      <van-cell title="商品金额"
        :value="rightData.salePrice !=null?'￥' + regFenToYuan(stepperValue * rightData.salePrice) : '￥--'"
        :border='false' />
      <!-- <van-cell v-show="$route.query.orderType != 'coupon'" title="运费" value="+￥0.0" :border='false'/> -->
      <van-cell title="花粉专享折扣"
        :value="rightData.price !=null?'-￥' + regFenToYuan(stepperValue * (rightData.salePrice - (shopUserInfo.vipType == 0?rightData.salePrice:rightData.disPrice))) : '￥--'"
        :border='false' />
    </van-cell-group>


    <!-- 开通花花卡会员 -->
    <!-- <van-cell-group class="member" :border='false' v-show="shopUserInfo.vipType == 0 ? true : false"
      @click="$router.push({name:'perfectinfo'})">
      <div class="left">
        <p class="title">花花卡会员</p>
        <p class="desc">开通立享花粉权益，本单省{{regFenToYuan(stepperValue * (rightData.salePrice - rightData.disPrice)) || '--'}}元
        </p>
      </div>
      <button class="right btn-public-2">0元购</button>
    </van-cell-group> -->
    <!-- 底部提交订单按钮 -->
    <div class="foot">
      <div class="price">
        实付款：<span>￥{{shopUserInfo.vipType == 0 ? (regFenToYuan(stepperValue * rightData.salePrice) || '--') : (regFenToYuan(stepperValue * rightData.disPrice) || '--')}}</span>
      </div>
      <!-- <div class="return" v-show="rightData.backBi > 0">返{{stepperValue * rightData.backBi}}花花币</div> -->
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
        @click="submitOrderAndPay">{{radio== 1 ? "支付宝支付：": "微信支付："}}￥{{stepperValue * regFenToYuan(rightData.disPrice) || '--'}}</button>
    </van-popup>
  </div>
</template>

<script>
  import {
    RightUrl
  } from '../../config/url'
  import {
    browser,
    checkAppInstall
  } from '../../server/nfygCommon'

  import './order.less'
  export default {
    name: '',
    data() {
      return {
        shopUserInfo: {
          "vipType": 0
        },
        isAddress: false,
        isPopup: false,
        radio: '1',
        stepperValue: 1,
        rightData: {},
		redirect_url:''
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      this.getDataDetail()
    },
    methods: {
      // 获取初始化数据 --- 权益详情
      getDataDetail() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "rightId": _this.$route.query.rightId,
        }
        _this.$axios.post(RightUrl.rightDetail, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.rightData = res.data.data
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
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "rightId": _this.$route.query.rightId,
          "amount": _this.stepperValue,
          "payType": 2
        }
        _this.$axios.post(RightUrl.rightCommit, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
				//处理IOS支付完成之后不能跳到结果页
				_this.redirect_url = _this.getQueryString(res.data.data.mwebUrl,'redirect_url');
				if(browser.ios){
				  setInterval(function(){
					if(_this.redirect_url){
						  window.location.href = _this.redirect_url;
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
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 修改计步器数据
      onChangeStepperValue(value) {
        if (value >= this.rightData.maxLimit) {
          this.$toast("亲，每人最多可以购买" + this.rightData.maxLimit + "件~")
        }
        if (value >= this.rightData.stockNum) {
          this.$toast("亲，该商品库存只剩" + this.rightData.stockNum + "件~")
        }
      }
    }
  }
</script>
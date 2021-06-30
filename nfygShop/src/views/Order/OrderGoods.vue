<template>
  <!-- 提交订单，商品 -->
  <!-- /v1/goods/order/commit -->
  <div class="order bg-public">
    <!-- 地址信息栏：商品订单才需要填写 -->
    <div class="address">
      <van-cell v-if="!isAddress" class="no" title="还没有设置收货地址，马上去设置" is-link
        :to="{name:'addressedit', query: {editType: 1, editFrom: 'order'}}" @click="onClickToNewAddress" />
      <div v-if="isAddress" class="yes" @click="linkToAddressList">
        <div class="add">
          <h5 class="name">{{addressData.rname}}<span>{{addressData.rmobile}}</span></h5>
          <div class="add-msg"><span class="icon-19"></span>{{regionName + ' ' + addressData.addressExt}}
          </div>
        </div>
        <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
      </div>
    </div>
    <!-- 商品订单订单详情 -->
    <van-cell-group class="goods" :border='false'>
		<!-- <img class="img"
		  :src="checkSkuData.attrPicList ? checkSkuData.attrPicList[0] : goodsData.bannerPicList[0] || require('@/assets/nfyg_180_180.png')"
		  alt="花生地铁"> -->
	   <div v-if="checkSkuData.attrPicList">
		  <img class="img"
		    :src="checkSkuData.attrPicList[0]"
		    alt="花生地铁"> 
	   </div>
	   <div v-else>
	   		  <img class="img"
	   		    :src="goodsData.bannerPicList ? goodsData.bannerPicList[0] : require('@/assets/nfyg_180_180.png')"
	   		    alt="花生地铁"> 
	   </div>
      
      <div class="info">
        <p class="name">{{goodsData.goodsName}}</p>
        <p class="desc">{{checkSkuData.attrName}}</p>
        <div class="cell">
          <!-- 花花推荐 -->
          <h5 class="price" v-if="$route.query.entryType == 1">
            ￥{{shopUserInfo.vipType == 0 ? (regFenToYuan(checkSkuData.salePrice) || '--') : (regFenToYuan(checkSkuData.disPrice) || '--')}}
          </h5>
          <!-- 兑换专区 -->
          <h5 class="price" v-if="$route.query.entryType == 2 && checkSkuData.excPrice > 0">
            ￥{{regFenToYuan(checkSkuData.excPrice) || '--'}}
            <span class="add"> + </span><span class="icon-coin"><span class="path1"></span><span
                class="path2"></span><span class="path3"></span></span>
            {{checkSkuData.excPoint}}</h5>
          <h5 class="price" v-if="$route.query.entryType == 2 && checkSkuData.excPrice == 0"><span
              class="icon-coin"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
            {{checkSkuData.excPoint}}</h5>
          <!-- 限时抢购 -->
          <h5 class="price" v-if="$route.query.entryType == 3">￥{{regFenToYuan(checkSkuData.panicPrice) || '--'}}</h5>
          <p class="number">x {{$route.query.stepperValue}}</p>
        </div>
      </div>
    </van-cell-group>
    <!-- 商品折扣信息  ---  公用 -->
    <van-cell-group class="detail" :border='false'>
      <van-cell title="商品金额" :value="'￥' + regFenToYuan($route.query.stepperValue * checkSkuData.salePrice) || '--'"
        :border='false' />
      <van-cell title="运费" :value="'+￥' + regFenToYuan(goodsData.freight) || '--'" :border='false' />
      <!-- 花花推荐 -->
      <van-cell title="花粉专享折扣" v-if="$route.query.entryType == 1"
        :value="'-￥' + (shopUserInfo.vipType == 0 ? '0.00' : regFenToYuan($route.query.stepperValue * (checkSkuData.salePrice - checkSkuData.disPrice))) || '--'"
        :border='false' />
      <!-- 兑换专区 -->
      <van-cell title="花粉专享折扣" v-if="$route.query.entryType == 2"
        :value="'-￥' + (shopUserInfo.vipType == 0 ? '0.00' : regFenToYuan($route.query.stepperValue * (checkSkuData.salePrice - checkSkuData.excPrice))) || '--'"
        :border='false' />
      <!-- 限时抢购 -->
      <van-cell title="花粉专享折扣" v-if="$route.query.entryType == 3"
        :value="'-￥' + (shopUserInfo.vipType == 0 ? '0.00' : regFenToYuan($route.query.stepperValue * (checkSkuData.salePrice - checkSkuData.panicPrice))) || '--'"
        :border='false' />
      <div class="van-cell van-field">
        <div class="van-cell__title"><span>备注</span></div>
        <div class="van-cell__value">
          <div class="van-field__body">
            <input type="text" v-model="remark" placeholder="请填写备注" class="van-field__control"
              :style="{textAlign: 'right'}">
          </div>
        </div>
      </div>
    </van-cell-group>
    <!-- 开通花花卡会员 -->
    <!-- <van-cell-group class="member" :border='false' v-show="shopUserInfo.vipType == 0 ? true : false"
      @click="$router.push({name:'perfectinfo'})">
      <div class="left">
        <p class="title">花花卡会员</p>
        <p class="desc">
          开通立享花粉权益，本单省{{regFenToYuan($route.query.stepperValue * (checkSkuData.salePrice - checkSkuData.disPrice)) || '--'}}元
        </p>
      </div>
      <button class="right btn-public-2">0元购</button>
    </van-cell-group> -->
    <!-- 底部提交订单按钮 -->
    <div class="foot">
      <!-- 花花推荐 -->
      <div class="price" v-if="$route.query.entryType == 1">
        实付款：<span>￥{{shopUserInfo.vipType == 0 ? (regFenToYuan($route.query.stepperValue * checkSkuData.salePrice + goodsData.freight) || '--') : (regFenToYuan($route.query.stepperValue * checkSkuData.disPrice + goodsData.freight) || '--')}}</span>
      </div>
      <!-- 兑换专区 -->
      <div class="price" v-if="$route.query.entryType == 2 && (checkSkuData.excPrice > 0 || goodsData.freight > 0)">
        实付款：<br><span>￥{{regFenToYuan($route.query.stepperValue * checkSkuData.excPrice + goodsData.freight) || '--'}}
          <span class="add"> + </span><span class="icon-coin"><span class="path1"></span><span
              class="path2"></span><span class="path3"></span></span>
          {{$route.query.stepperValue * checkSkuData.excPoint}}
        </span>
      </div>
      <div class="price" v-if="$route.query.entryType == 2 &&  checkSkuData.excPrice == 0 && goodsData.freight == 0">
        实付款：<br><span><span class="icon-coin"><span class="path1"></span><span class="path2"></span><span
              class="path3"></span></span>
          {{$route.query.stepperValue * checkSkuData.excPoint}}
        </span>
      </div>
      <!-- 限时抢购 -->
      <div class="price" v-if="$route.query.entryType == 3">
        实付款：<span>￥{{regFenToYuan($route.query.stepperValue * checkSkuData.panicPrice + goodsData.freight) || '--'}}</span>
      </div>
      <div class="return" v-show="shopUserInfo.vipType != 0 && checkSkuData.returnPoint > 0">
        返{{$route.query.stepperValue * checkSkuData.returnPoint}}花花币</div>
      <button :class="isAddress && isArrive ? (isNumber ? 'btn-public pay no' : 'btn-public pay') : 'btn-public pay no'"
        @click="submitOrder">{{isArrive ? (isNumber ? "库存不足" : "提交订单") : "该地区不配送"}}</button>
    </div>
    <!-- 选择支付方式 -->
    <van-popup v-model="isPayPopup" class="popup-pay">
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
        @click="submitOrderAndPay">{{radio== 1 ? "支付宝支付：": "微信支付："}}￥{{regFenToYuan(goodsData.disPrice) || '--'}}</button>
    </van-popup>
    <!-- 地址不配送提示 -->
    <van-popup v-model="isStockPopup" class="popup-public popup-stock">
      <h5 class="title">无货提示</h5>
      <p class="tips">所选地区不支持配送，非常抱歉！</p>
      <div class="button">
        <button class="cancel" @click="isStockPopup = false">取消</button>
        <button class="change" @click="linkToAddressList">换个地址</button>
      </div>
    </van-popup>
    <!-- 库存不足提示 -->
    <van-popup v-model="isNumberPopup" class="popup-public popup-down">
      <h5 class="title">库存不足</h5>
      <p class="tips">亲，该商品规格已库存不足！</p>
      <div class="button">
        <button class="cancel" @click="isNumberPopup = false">取消</button>
        <button class="back" @click="backToUpLevel">返回</button>
      </div>
    </van-popup>
    <!-- 花花币不足提示 -->
    <van-popup v-model="isCoinPopup" class="popup-public popup-coin">
      <h5 class="title">温馨提示</h5>
      <p class="tips">亲，您的花花币不足，无法购买！</p>
      <div class="button">
        <button class="cancel" @click="isCoinPopup = false">取消</button>
        <button class="back" @click="$router.push({name:'special', query: {specialType: 2}})">继续逛逛</button>
      </div>
    </van-popup>
  </div>
</template>

<script>
  const _czc = window._czc || []
  import {
    GoodsUrl
  } from '../../config/url'
  import {
    browser,
    checkAppInstall
  } from '../../server/nfygCommon'

  import RegionList from '../../assets/js/regionList'

  import './order.less'
  import Utils from '../../server/utils'

  export default {
    name: '',
    data() {
      return {
        shopUserInfo: {
          "vipType": 0
        },
        isAddress: false,
        isArrive: true,
        addressData: {},
        regionName: "",
        isPayPopup: false,
        isStockPopup: false,
        isNumberPopup: false,
        isCoinPopup: false,
        isNumber: false,
        radio: '1',
        goodsData: {},
        checkSkuData: {},
        remark: "",
		redirect_url:'',
		goodsType:'',
      }
    },
    mounted() {
	  let _this = this;
      const shopUserInfo = _this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        _this.shopUserInfo = shopUserInfo
      }
      _this.getDataDetail();
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
      // 获取初始化数据 --- 商品
      getDataDetail() {
        const _this = this
        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "activeId": query.activeId,
          "goodsId": query.goodsId,
          "entryType": query.entryType,
          "checkSkuId": query.checkSkuId
        }
        _this.$axios.post(GoodsUrl.goodsDetail, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.goodsData = res.data.data
              res.data.data.skuList.forEach(item => {
                if (item.skuId == query.checkSkuId) {
                  _this.checkSkuData = item
                }
              });
              this.getAddressDefault()
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取用户地址
      getAddressDefault() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
		let $uid = _this.shopUserInfo.uid;	  
		$uid = Utils.encrypt($uid)
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": $uid//_this.shopUserInfo.uid || ""
        }
        _this.$axios.post(GoodsUrl.addressList, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              if (res.data.data && res.data.data.length > 0) {
                _this.isAddress = true
                let checkData = res.data.data[0]
                const checkId = _this.$cookies.get("checkAddress")
                if (checkId) {
                  res.data.data.forEach(item => {
                    if (item.addressId == checkId) {
                      checkData = item
                    }
                  })
                }
                _this.addressData = checkData
                _this.getRegionName(checkData.regionId)
              }
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取区域名称
      getRegionName(id) {
        RegionList.data.forEach(item => {
          if (item.regionId == id) {
            this.regionName = item.regionName + ' ' + this.regionName
            if (item.regionLevel != 1) {
              this.getRegionName(item.parentregionId)
            }
			/*新版本限制地区包含省 市 所以以下过虑不完整; 由服务端在下单时判断是否可发货*/
            // this.goodsData.regionLimitList.forEach(region => {
            //   if (item.regionId == region.id) {
            //     this.isArrive = false
            //     this.isStockPopup = true
            //   }
            // })
          }
        })
      },
      // 提交订单
      submitOrder() {
        // 不配送地址不可下单
        if (!this.isArrive || this.isNumber) {
          return
        }
        if (this.shopUserInfo.uid) {
          if (this.isAddress) {
            this.submitOrderAndPay()
          } else {
            this.$toast("请先设置收货地址")
          }
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
        if (!_this.isAddress) {
          this.$toast("请先设置收货地址")
          return
        }
        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "activeId": query.activeId,
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "skuId": query.checkSkuId,
          "entryType": query.entryType,
          "amount": query.stepperValue,
          "payType": 2,
          "addressId": _this.addressData.addressId,
          "remark": _this.remark
        }
		// window.console.log(formData)
        _this.$axios.post(GoodsUrl.goodsCommit, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              // 下单成功
              let temp = 0
              if (query.entryType == 1) {
                temp = _this.shopUserInfo.vipType == 0 ? this.regFenToYuan(query.stepperValue * _this.checkSkuData
                  .salePrice + _this.goodsData.freight) : this.regFenToYuan(query.stepperValue * _this.checkSkuData
                  .disPrice + _this.goodsData.freight)
              } else if (query.entryType == 2) {
                temp = this.regFenToYuan(query.stepperValue * _this.checkSkuData.excPrice + _this.goodsData.freight) +
                  query.stepperValue * _this.checkSkuData.excPoint
              } else if (query.entryType == 3) {
                temp = this.regFenToYuan(query.stepperValue * _this.checkSkuData.panicPrice + _this.goodsData.freight)
              }
              _czc.push(['_trackEvent', 'appproduct_10', '点击', '商品下单页-提交订单{way:' + query.entryType + ',goodsId:' +
                query.goodsId + ',goodsName:' + _this.goodsData.goodsName + ',checkSkuId:' + query.checkSkuId +
                ',count:' + query.stepperValue + ',amount:￥' + temp + '}'
              ]);
              _this.$toast('即将打开微信支付！')
              setTimeout(() => {
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
              }, 100);
            } else if (res.data.resultCode == 9) {
              // 库存不足提示
              _this.isNumberPopup = true
              _this.isNumber = true
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
      // 去收货地址页
      linkToAddressList() {
        _czc.push(['_trackEvent', 'appproduct_08', '点击', '商品下单页-选择收货地址(有地址){address:1}']);
        this.$router.push({
          name: "addresslist",
          query: {
            fromType: "order"
          }
        })
      },
      // 返回上一层
      backToUpLevel() {
        this.$router.go(-1);
      },
      onClickToNewAddress() {
        _czc.push(['_trackEvent', 'appproduct_08', '点击', '商品下单页-添加收货地址(无地址){address:0}']);
      },
    }
  }
</script>
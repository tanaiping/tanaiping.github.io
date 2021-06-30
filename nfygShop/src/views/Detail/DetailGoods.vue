<template>
  <div class="detail-goods">
    <!-- <div class="open-app" @click="onClickOpenApp" v-if="$route.query.isShare == 1">
      <img :src="require('@/assets/nfyg_750_750.png')" alt="花生地铁" />
      <p>打开花生地铁APP，购物更方便</p>
      <button class="btn-public-2">立即打开</button>
    </div> -->
    <van-swipe :autoplay="3000" class="swiper-img">
      <van-swipe-item v-for="(item, i) in detailgoods.bannerPicList" :key="i">
        <img v-lazy="item || require('@/assets/nfyg_750_750.png')" alt="商品详情" @click="onClickPreview(i)" />
      </van-swipe-item>
    </van-swipe>
    <!-- 点击商品详情图片看大图 -->
    <van-image-preview v-model="isImgPreview" :images="previewImages" :startPosition="previewIndex">
      <!-- <template v-slot:previewIndex>第{{ previewIndex }}页</template> -->
    </van-image-preview>
    <van-image-preview v-model="isSkuImgPreview"
      :images="[checkSkuData.attrPicList ? checkSkuData.attrPicList[0] : detailgoods.bannerPicList[0] || require('@/assets/nfyg_180_180.png')]">
    </van-image-preview>
    <div class="info">
      <!-- 限时抢购 -->
      <div v-if="this.entryTypeReplace == 3" class="type-3">
        <div class="value">
          <p class="value-1">市场价 ¥{{regFenToYuan(checkSkuData.price) || '--'}}</p>
          <h5 class="price">￥{{regFenToYuan(checkSkuData.panicPrice) || '--'}}</h5>
        </div>
        <div class="countdown">距离结束<br />{{day}}天
          <span>{{hour}}</span>:<span>{{minute}}</span>:<span>{{seconds}}</span></div>
      </div>
      <!-- 普通商品详情 -->
      <div v-if="this.entryTypeReplace == 1" class="default">
        <div class="left">
          <p class="value"><span class="value-1">市场价 ¥{{regFenToYuan(price) || '--'}}</span><span class="value-2">优惠价
              ¥{{regFenToYuan(salePrice) || '--'}}</span></p>
          <div class="member">
            <p class="price"><span class="money-1">￥</span><span
                class="money-2">{{regFenToYuan(disPrice) || '--'}}</span></p>
            <img class="tag-s" :src="require('@/assets/tag_s.png')" @click="equityCard" alt="花花权益价">
          </div>
        </div>
        <!-- <div class="right">
          <p class="sales">已售<br />{{detailgoods.assign}}</p>
        </div> -->
      </div>
      <!-- 商品基础信息 -->
      <div class="msg">
        <h5 class="name">
          <!-- <van-tag v-show="detailgoods.freight == 0" round color="rgba(255,86,86,0.1)" text-color="#FF5656">包邮</van-tag> -->
          <img v-show="detailgoods.freight == 0" class="tags" :src="require('@/assets/tags.png')" alt="">
          {{detailgoods.goodsName}}
        </h5>
        <p class="desc">{{detailgoods.remark}}</p>
      </div>
      <p class="return" v-if="checkSkuData.returnPoint > 0">
        <img :src="require('@/assets/icon_return.png')" alt="返" class="icon">
        <span class="text">会员每件可返{{checkSkuData.returnPoint}}花花币</span>
      </p>
      <!-- 兑换专区 -->
      <div class="type-2" v-if="this.entryTypeReplace == 2">
        <div class="member">
          <h5 class="price" v-show="checkSkuData.excPrice > 0">￥{{regFenToYuan(checkSkuData.excPrice) || '--'}}
            <span class="add"> + </span><span class="icon-coin"><span class="path1"></span><span
                class="path2"></span><span class="path3"></span></span>
            {{checkSkuData.excPoint}}
            <span class="value-1">市场价 ￥{{regFenToYuan(price) || '--'}}</span></h5>
          <h5 class="price" v-show="checkSkuData.excPrice == 0"><span class="icon-coin"><span class="path1"></span><span
                class="path2"></span><span class="path3"></span></span>
            {{checkSkuData.excPoint}}
            <span class="value-1">市场价 ￥{{regFenToYuan(price) || '--'}}</span></h5>
        </div>
      </div>
    </div>
    <div class="detail">
      <div id="detail-nav-1">
        <h5 class="title">商品详情</h5>
        <p class="desc" v-html="detailgoods.goodsDesc"></p>
      </div>
      <div id="detail-nav-2">
        <h5 class="title">购买须知</h5>
		<div v-if="detailgoods.isRegionLimit == 1">
			<div v-if="detailgoods.isBlack == 1">
				<p class="desc" v-show="blackJson && blackJson.length > 0">
				  地区限制，仅以下区域限制购买：<span v-for="(item, i) in blackJson"
					:key="i">{{(i== 0 ? '' : '，') + item.regionName}}</span></p>
			</div>
			<div v-else>
				<p class="desc" v-show="blackJson && blackJson.length > 0">
				  地区限制，仅以下区域支持购买：<span v-for="(item, i) in blackJson"
					:key="i">{{(i== 0 ? '' : '，') + item.regionName}}</span></p>
			</div>
		</div>
        <!-- <p class="desc" v-show="detailgoods.regionLimitList && detailgoods.regionLimitList.length > 0">
          不发货地区：<span v-for="(item, i) in detailgoods.regionLimitList"
            :key="i">{{(i== 0 ? '' : '、') + item.regionName}}</span></p> -->
			
        <p class="desc" v-html="detailgoods.buyNotes"></p>
      </div>
      <div id="detail-nav-3">
        <!-- <h5 class="title">评价</h5>
        <p class="desc"></p> -->
      </div>
    </div>
    <div class="foot">
      <div class="call" @click="onlineService(); onClickLine()"><span class="icon-call"></span><br />联系客服</div>
      <button class="btn-public pay"
        @click="isSkuPopup = true">{{this.entryTypeReplace == 2 ? "立即兑换" : "立即购买"}}</button>
    </div>
    <!-- sku商品信息选择框 -->
    <van-popup v-model="isSkuPopup" class="popup-sku" position="bottom" closeable close-icon="close">
      <div class="info">
        <img class="img"
          :src="checkSkuData.attrPicList ? checkSkuData.attrPicList[0] : detailgoods.bannerPicList[0] || require('@/assets/nfyg_180_180.png')"
          alt="花生地铁" @click="onClickSkuPreview()">
        <div class="value">
          <!-- 花花推荐 -->
          <h5 v-if="this.entryTypeReplace == 1">
            ￥{{shopUserInfo.vipType == 0 ? (regFenToYuan(checkSkuData.salePrice) || '--') : (regFenToYuan(checkSkuData.disPrice) || '--')}}
          </h5>
          <!-- 兑换专区 -->
          <h5 v-if="this.entryTypeReplace == 2 && checkSkuData.excPrice > 0">
            ￥{{regFenToYuan(checkSkuData.excPrice) || '--'}}<span class="add"> +
            </span><span class="icon-coin"><span class="path1"></span><span class="path2"></span><span
                class="path3"></span></span>
            {{checkSkuData.excPoint}}</h5>
          <h5 v-if="this.entryTypeReplace == 2 && checkSkuData.excPrice == 0"><span class="icon-coin"><span
                class="path1"></span><span class="path2"></span><span class="path3"></span></span>
            {{checkSkuData.excPoint}}</h5>
          <!-- 限时抢购 -->
          <h5 v-if="this.entryTypeReplace == 3">￥{{regFenToYuan(panicPrice) || '--'}}</h5>
          <p class="p-1">库存 {{checkSkuData.stockNum}}</p>
          <p class="p-2">已选：{{checkSkuData.attrName}}</p>
        </div>
      </div>
      <div class="scroll">
        <div class="other">
          <h5 class="title">规格</h5>
          <div class="specs">
            <p v-for="(item, i) in detailgoods.skuList" :key="i"
              :class="item.stockNum == 0 ? 'no-stock' : (item.skuId == checkSkuData.skuId ? 'check' : '')"
              @click="onChangeCheckSkuData(i)">
              {{item.attrName}}</p>
          </div>
        </div>
        <!-- <div class="other">
          <h5 class="title">规格</h5>
          <div class="specs">
            <p v-for="(item, i) in detailgoods.skuList" :key="i"
              :class="item.stockNum == 0 ? 'no-stock' : (item.skuId == checkSkuData.skuId ? 'check' : '')"
              @click="onChangeCheckSkuData(i)">
              {{item.attrName}}</p>
          </div>
        </div> -->
        <div class="other">
          <h5 class="title">数量</h5>
          <van-stepper v-model="stepperValue" min="1"
            :max="checkSkuData.maxLimit > checkSkuData.stockNum ? checkSkuData.stockNum : checkSkuData.maxLimit" integer
            @change="onChangeStepperValue" />
        </div>
      </div>
      <button :class="checkSkuData.stockNum == 0 ? 'btn-public btn-pay no-stock' : 'btn-public btn-pay'"
        @click="payGoods">{{this.entryTypeReplace == 2 ? "立即兑换" : "立即购买"}}</button>
    </van-popup>
    <!-- 商品下架提示 -->
    <van-popup v-model="isDownPopup" class="popup-public popup-down">
      <h5 class="title">下架提示</h5>
      <p class="tips">该商品已不存在，换个商品看看</p>
      <div class="button">
        <button class="cancel" @click="backToUpLevel">取消</button>
        <button class="back" @click="backToUpLevel">返回</button>
      </div>
    </van-popup>
    <!-- 非会员办理会员卡提示 -->
    <van-popup v-model="isVipPopup" class="popup-public popup-down">
      <h5 class="title">温馨提示</h5>
      <p class="tips">您还不是花花卡会员，办理才享有优惠哦~</p>
      <div class="button">
        <button class="cancel" @click="isVipPopup = false">取消</button>
        <button class="back" @click="$router.push({name:'perfectinfo'})">免费办理</button>
      </div>
    </van-popup>
    <!-- 绑定用户弹窗 -->
    <van-popup v-model="isAuthPopup" class="popup-public popup-auth">
      <h5 class="title">绑定手机号</h5>
      <van-radio-group :border='false' class="contain">
        <input class="row mobile" type="number" v-model="mobile" placeholder="请输入手机号" />
        <div class="row code">
          <input class="input" type="text" v-model="code" placeholder="请输入验证码" />
          <button :class="countdown > 0 ? 'get-code countdown' : 'get-code'"
            @click="getCode">{{countdown > 0 ? countdown + ' s' : '获取验证码' }}</button>
        </div>
      </van-radio-group>
      <button class="btn-public btn" @click="submitLogon">确认</button>
      <p class="tips">为了您有更好的用户体验，请绑定已激活的手机号码。如未激活，请绑定常用手机号码。</p>
    </van-popup>
  </div>
</template>

<script>
  const _czc = window._czc || []
  import {
    GoodsUrl,
    UserUrl
  } from '../../config/url'
  import {
    browser,
    getUserInfo,
    pushToLoginView
  } from '../../server/nfygCommon'

  export default {
    name: '',
    data() {
      return {
        shopUserInfo: {
          "vipType": 0
        },
        isSkuPopup: false,
        isDownPopup: false,
        isVipPopup: false,
        isAuthPopup: false,
        isImgPreview: false,
        isSkuImgPreview: false,
        previewImages: [
          require("@/assets/nfyg_750_750.png")
        ],
        previewIndex: 0,
        stepperValue: 1,
        detailgoods: {
          bannerPicList: [
            require("@/assets/nfyg_750_750.png"),
            require("@/assets/nfyg_750_750.png"),
            require("@/assets/nfyg_750_750.png")
          ]
        },
        checkSkuData: {},
        day: "0",
        hour: "00",
        minute: "00",
        seconds: "00",
        countdown: 0,
        mobile: "",
        code: "",
        price: "-",
        salePrice: "-",
        disPrice: "-",
        panicPrice: "-",
        entryTypeReplace: "",
		blackJson:null
      }
    },
    watch: {
      $route: function (newVal, oldVal) {
        if (newVal != oldVal) {
          if (this.$route.query.isAgain == 1) {
            this.getDataDetailGoodsAgain()
          } else {
            this.getDataDetailGoods()
          }
        }
      }
    },
    mounted() {
      this.entryTypeReplace = this.$route.query.entryType.toString().indexOf("?cNo=") === 1 ? this.$route.query
        .entryType.toString().replace("?cNo=", "") : this.$route.query.entryType
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      if (this.$route.query.isAgain == 1) {
        this.getDataDetailGoodsAgain()
      } else {
        this.getDataDetailGoods()
      }
	  document.documentElement.scrollTop = 0;//解决部分ios手机页面加载完滚动条不在最顶部
    },
    methods: {
      // 获取初始化数据 --- 商品详情
      getDataDetailGoods() {
        const _this = this
        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
        // const entryTypeReplace = query.entryType.replace("?cNo=", "")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "activeId": query.activeId,
          "goodsId": query.goodsId,
          "entryType": this.entryTypeReplace,
          "checkSkuId": query.checkSkuId
        }
        _this.$axios.post(GoodsUrl.goodsDetail, formData)
          .then((res) => {
            // window.console.log(res);
            _this.detailGoods(res)
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 商品再次购买 --- 商品详情
      getDataDetailGoodsAgain() {
        const _this = this
        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "activeId": query.activeId,
          "goodsId": query.goodsId,
          "entryType": this.entryTypeReplace,
          "checkSkuId": query.checkSkuId
        }
        _this.$axios.post(GoodsUrl.goodsBuyAgain, formData)
          .then((res) => {
            // window.console.log(res);
            _this.detailGoods(res)
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 商品详情 --- 执行函数
      detailGoods(res) {
        const _this = this
        const query = _this.$route.query
        if (res.data.resultCode == 0) {
          _this.detailgoods = res.data.data
		  _this.blackJson = eval("("+res.data.data.blackJson+")");
          _this.price = res.data.data.skuList[0].price
          _this.salePrice = res.data.data.skuList[0].salePrice
          _this.disPrice = res.data.data.skuList[0].disPrice
          _this.panicPrice = res.data.data.skuList[0].panicPrice
          _this.checkSkuData = res.data.data.skuList[0] // 默认选择sku为第一个
          _czc.push(['_trackEvent', 'appproduct_01', '曝光', '商品详情页-曝光{way:' + (query.isAgain == 1 ? "7" : this
            .entryTypeReplace) + ',goodsId:' + query.goodsId + ',goodsName:' + _this.detailgoods.goodsName + '}']);
          res.data.data.skuList.forEach(item => {
            if (item.skuId == query.checkSkuId) {
              _this.checkSkuData = item // 符合条件，修改选择sku
            }
          });
          if (_this.checkSkuData.maxLimit == 0) {
            // maxLimit == 0 表示不限购，则限购数量为库存数量
            _this.checkSkuData.maxLimit = _this.checkSkuData.stockNum
          }
          if (_this.checkSkuData.overSeconds > 0) {
            // 倒计时大于0，限时抢购，开始倒计时
            _this.aniCountdown(_this.checkSkuData.overSeconds)
          }
          if (_this.checkSkuData.stockNum == 0) {
            // 商品数量为0，表示已售空
            _this.$toast("该商品规格已售空！");
          }
          _this.previewImages = res.data.data.bannerPicList
          // 将标题和图片存起来，分享的时候要用
          const shareDetailGoods = {
            imageUrl: res.data.data.bannerPicList[0],
            title: res.data.data.goodsName,
          }
          _this.$cookies.set("shareDetailGoods", shareDetailGoods)
        } else if (res.data.resultCode == 7) {
          // 商品下架提示
          _this.isDownPopup = true
        } else {
          _this.$toast(res.data.resultMsg)
        }
      },
      // 商品支付 - 去提交订单页
      payGoods() {
        let nfygUser = JSON.parse(getUserInfo())
        // window.console.log(nfygUser);
        if (browser.isNfyg && !nfygUser.userId) {
          pushToLoginView()
          return
        }
        if (this.checkSkuData.stockNum == 0) {
          return
        }
        if (this.shopUserInfo.uid) {
          if ((this.entryTypeReplace == 3 || this.entryTypeReplace == 2) && this.shopUserInfo
            .vipType == 0) {
            // this.$toast("只有花花会员才可以参与活动哦！")
            this.isVipPopup = true
            return
          } else {
            _czc.push(['_trackEvent', 'appproduct_06', '点击', '商品详情页-立即购买{way:' + this.entryTypeReplace +
              ',goodsId:' + this.$route.query.goodsId + ',goodsName:' + this.detailgoods.goodsName +
              ',checkSkuId:' + this.checkSkuData.skuId + ',count:' + this.stepperValue + '}'
            ]);
            this.$router.push({
              name: "ordergoods",
              query: {
                goodsId: this.$route.query.goodsId,
                activeId: this.$route.query.activeId,
                checkSkuId: this.checkSkuData.skuId,
                entryType: this.entryTypeReplace,
                stepperValue: this.stepperValue
              }
            })
          }
        } else {
          if (browser.isNfyg) {
            if (nfygUser.userId) {
              // this.$toast("请先绑定手机号码")
              this.isAuthPopup = true
            } else {
              pushToLoginView()
            }
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
          this.seconds = "00";
          if (this.$route.query.isAgain == 1) {
            this.getDataDetailGoodsAgain()
          } else {
            this.getDataDetailGoods()
          }
          // 商品下架提示
          this.isDownPopup = true
        }
      },
      // 选择商品规格
      onChangeCheckSkuData(i) {
        if (this.detailgoods.skuList[i].stockNum == 0) {
          this.$toast("亲，该规格没有货了~")
          return
        }
        this.checkSkuData = this.detailgoods.skuList[i]
        this.stepperValue = 1
        if (this.entryTypeReplace == 3) {
          this.aniCountdown(this.checkSkuData.overSeconds)
        }
      },
      // 修改计步器数据
      onChangeStepperValue(value) {
        if (value >= this.checkSkuData.maxLimit) {
          this.$toast("亲，每人最多可以购买" + this.checkSkuData.maxLimit + "件~")
        }
        if (value >= this.checkSkuData.stockNum) {
          this.$toast("亲，该商品库存只剩" + this.checkSkuData.stockNum + "件~")
        }
      },
      // 返回上一层
      backToUpLevel() {
        this.$router.go(-1);
      },
      // 获取验证码
      getCode() {
        const _this = this
        if (!_this.mobile) {
          _this.$toast('手机号码不能为空')
          return
        } else if (!/^1(1|2|3|4|5|6|7|8|9|0)\d{9}$/.test(_this.mobile)) {
          _this.$toast('请正确填写手机号码')
          return
        }
        const formData = {
          "mobile": _this.mobile
        }
        _this.$axios.post(UserUrl.getCode, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.countdown = 60
              _this.countDown(60)
              _this.$toast('验证码发送成功')
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 提交登录（绑定花生地铁用户信息）
      submitLogon() {
        const _this = this
        if (!_this.mobile || !_this.code) {
          _this.$toast('手机号码和验证码不能为空')
          return
        } else if (!/^1(1|2|3|4|5|6|7|8|9|0)\d{9}$/.test(_this.mobile)) {
          _this.$toast('请正确填写手机号码')
          return
        }
        let nfygUser = JSON.parse(getUserInfo())
        // window.console.log(nfygUser);
        if (!nfygUser.userId) {
          pushToLoginView()
          return
        }
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "mobile": _this.mobile,
          "thirdUid": nfygUser.userId,
          "type": 2,
          "verifyCode": _this.code
        }
        _this.$axios.post(UserUrl.login, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              this.isAuthPopup = false;
              _this.shopUserInfo = res.data.data
              _this.$cookies.set("shopUserInfo", res.data.data, "30d")
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 倒计时
      countDown(time) {
        if (this.countdown > 0) {
          setTimeout(() => {
            this.countdown = time - 1
            this.countDown(time - 1)
          }, 1000);
        } else {
          this.countdown = 0
        }
      },
      equityCard() {
        this.$router.push({
          name: "equity",
        })
      },
      onClickPreview(i) {
        this.previewIndex = i
        this.isImgPreview = true
        _czc.push(['_trackEvent', 'appproduct_02', '点击', '商品详情页-预览商品大图']);
      },
      onClickSkuPreview() {
        this.isSkuImgPreview = true
      },
      onClickLine() {
        _czc.push(['_trackEvent', 'appproduct_05', '点击', '商品详情页-联系客服']);
      },
      // onClickOpenApp() {
      //   console.log("立即打开花生地铁APP");
      //   if (browser.ios) {
      //     window.location.href = "https://itunes.apple.com/cn/app/id1128289794"
      //   } else {
      //     window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb&ckey=CK1360001376091"
      //   }
      // }
    }
  }
</script>

<style lang="less" scoped>
  .swiper-img {
    width: 7.5rem;
    height: 7.5rem;
    background: url(../..//assets/nfyg_750_750.png) no-repeat center / 100%;
    overflow: hidden;
  }

  .default {
    margin-top: 0.16rem;
    padding: 0 0.3rem;
    display: flex;

    .left {
      .value {
        font-size: 0.26rem;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #999;

        .value-1 {
          text-decoration: line-through;
        }

        .value-2 {
          color: #333;
          margin-left: 0.2rem;
        }
      }

      .member {
        display: flex;

        .price {
          color: #ff3b30;

          .money-1 {
            font-size: 0.3rem;
          }

          .money-2 {
            font-size: 0.4rem;
            font-weight: bold;
          }
        }

        .tag-s {
          width: 0.72rem;
          // height: 0.3rem;
          margin: auto;
          margin-left: 0.1rem;
        }
      }
    }

    .right {
      border-left: solid #d3d3d3 1px;
      padding-left: 0.35rem;
      text-align: center;
      font-size: 0.26rem;
      color: #666;
      margin: 0.1rem auto;
      margin-right: 0;
    }
  }

  .type-2 {
    margin-top: 0.2rem;
    margin-bottom: 0.3rem;
    padding: 0 0.3rem;

    .member {
      display: flex;

      .price {
        font-size: 0.4rem;
        color: #ff3b30;

        .add {
          font-size: 0.3rem;
        }

        .value-1 {
          font-size: 0.26rem;
          font-weight: 500;
          color: #999;
          margin-left: 0.2rem;
          text-decoration: line-through;
        }
      }
    }
  }

  .type-3 {
    display: flex;
    width: 100%;
    height: 1.33rem;
    padding: 0.2rem 0.3rem;
    background: url(../../assets/type_2_bg.png) no-repeat center / 100%;

    .value {
      font-size: 0.26rem;
      color: #fff;
      margin-top: 0.05rem;

      .value-1 {
        text-decoration: line-through;
      }

      .price {
        font-size: 0.48rem;
      }
    }

    .countdown {
      font-size: 0.26rem;
      font-weight: bold;
      color: rgba(250, 84, 27, 1);

      margin: auto;
      margin-right: 0;
      text-align: center;

      span {
        background: linear-gradient(90deg,
            rgba(249, 77, 54, 1) 0%,
            rgba(252, 92, 34, 1) 97%);
        border-radius: 3px;
        color: #fff;
        padding: 0.02rem;
      }
    }
  }

  .msg {
    // margin-top: 0.2rem;
    padding: 0 0.3rem;

    .name {
      font-size: 0.3rem;
      color: #333;
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;

      .tags {
        width: 0.5rem;
      }
    }

    .desc {
      font-size: 0.26rem;
      font-weight: 400;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      color: #999;
      margin-top: 0.08rem;
    }
  }

  .return {
    display: flex;
    margin-top: 0.16rem;
    padding: 0 0.3rem;
    width: 100%;
    height: 0.46rem;
    font-size: 0.24rem;
    line-height: 0.46rem;
    font-weight: 400;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #916b3a;
    background: linear-gradient(90deg, #fff0d3 0%, #fff0c2 100%);

    .icon {
      margin: auto;
      margin-left: 0;
      width: 0.28rem;
      height: 0.28rem;

    }

    .text {
      flex: 1;
      margin: auto;
      margin-left: 0.05rem;
      line-height: 0.36rem;
    }
  }

  .detail {
    padding: 0.3rem 0.3rem;
    border-top: solid 0.2rem #f8f8f8;
    margin-bottom: 1.3rem;
    font-size: 0.3rem;

    .title {
      margin-top: 0.2rem;
      font-size: 0.32rem;
      font-weight: bold;
      color: #333;
      text-align: center;
      background: url(../../assets/detail_title.png) no-repeat center / 100%;
    }

    .desc {
      margin-top: 0.2rem;
      font-size: 0.3rem;
      color: #666;
    }
  }

  .foot {
    position: fixed;
    bottom: 0;
    padding: 0.22rem 0.3rem;
    display: flex;
    margin: auto;
    width: 100%;
    background: #fff;

    .call {
      font-size: 0.24rem;
      text-align: center;
      margin: auto;

      span {
        font-size: 0.5rem;
      }
    }

    .pay {
      width: 4.8rem;
      height: 0.8rem;
      background: linear-gradient(270deg,
          rgba(255, 86, 86, 1) 0%,
          rgba(249, 46, 46, 1) 100%);
      border-radius: 0.4rem;
      font-size: 0.32rem;
      font-weight: bold;
      color: #fff;
      line-height: 0.8rem;
      text-align: center;
      margin: auto;
      margin-right: 0.1rem;
    }
  }

  .popup-sku {
    border-radius: 0.16rem 0.16rem 0 0;
    min-height: 8.13rem;
    max-height: 10rem;

    .van-icon {
      top: 0.22rem;
      right: 0.22rem;
      font-size: 0.44rem;
    }

    .info {
      display: flex;
      padding: 0.2rem 0.3rem;
      border-bottom: solid 1px rgba(229, 229, 229, 0.6);

      .img {
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 0.04rem;
      }

      .value {
        margin: auto;
        margin-left: 0.2rem;

        h5 {
          font-size: 0.48rem;
          color: #ff3b30;
        }

        p {
          font-size: 0.26rem;
          font-weight: 400;
          font-family: PingFangSC-Regular, PingFang SC;
          margin-top: 0.08rem;
          margin-left: 0.1rem;
        }

        p.p-1 {
          color: #999;
        }

        p.p-2 {
          margin-top: 0;
        }
      }
    }

    .scroll {
      margin-bottom: 1.28rem;
      max-height: 5.8rem;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
    }

    .other {
      position: relative;
      border-top: solid 1px rgba(229, 229, 229, 0.6);
      margin-top: 0.2rem;
      padding: 0.3rem 0.3rem 0 0.3rem;

      .title {
        font-size: 0.26rem;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
      }

      .specs {
        display: flex;
        flex-flow: row wrap;

        p {
          padding: 0 0.2rem;
          margin-top: 0.2rem;
          margin-right: 0.3rem;
          height: 0.56rem;
          font-size: 0.26rem;
          font-weight: 400;
          font-family: PingFangSC-Regular, PingFang SC;
          line-height: 0.56rem;
          color: #555;
          background: #f8f8f8;
          text-align: center;
          border-radius: 0.31rem;
        }

        p.check {
          background: rgba(255, 86, 86, 0.06);
          border: 0.02rem solid rgba(255, 86, 86, 1);
          color: #ff5656;
        }

        p.no-stock {
          color: #aaa;
        }
      }

      .van-stepper {
        position: absolute;
        right: 0.3rem;
        top: 0.3rem;
      }
    }

    .other:first-child {
      border: none;
      padding-top: 0;
    }

    .btn-pay {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      bottom: 0.2rem;
      width: 6.4rem;
      height: 0.88rem;
      line-height: 0.88rem;
      border-radius: 0.44rem;
    }

    .btn-pay.no-stock {
      color: #aaa;
      background: #f8f8f8;
    }
  }

  .popup-auth {
    .contain {
      .row {
        display: flex;
        width: 4.8rem;
        height: 0.88rem;
        margin: auto;
        margin-top: 0.4rem;
        border-radius: 0.44rem;
        background: #f8f8f8;
      }

      input {
        padding: 0.2rem 0.3rem;
        border: none;
        border-radius: 0.44rem;
        background: #f8f8f8;
      }

      .code {
        display: flex;

        .input {
          flex: 1;
          width: 3rem;
        }

        .get-code {
          border: none;
          background: none;
          color: #ff5656;
          font-size: 0.24rem;
          flex: 1;
        }

        .get-code.countdown {
          color: #999;
        }
      }
    }

    .btn {
      width: 4.6rem;
      height: 0.88rem;
      margin: auto;
      margin-top: 0.6rem;
      border-radius: 0.44rem;
    }

    .tips {
      margin-top: 0.4rem;
      font-size: 0.24rem;
      color: #999;
    }
  }
</style>
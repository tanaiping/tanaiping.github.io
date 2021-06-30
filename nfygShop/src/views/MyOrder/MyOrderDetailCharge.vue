<template>
  <!-- 我的卡券订单详情页 -->
  <!-- 通过路径参数detailType区分 -->
  <!-- detailType == 'coupon' 是卡券订单详情  /v1/coupon/order/detail -->
  <!-- detailType == 'right' 是权益订单详情   /v1/right/order/detail -->
  <div class="detail-right bg-public">
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" class="bg-public" @refresh="onRefresh">
      <!-- 卡券状态 -->
      <van-cell-group class="group-public state" :border='false'>
        <div>
          <h5 class="name">{{stateName[detailData.status]}}</h5>
          <p class="desc" v-show="detailData.status != 0">{{stateDesc[detailData.status]}}</p>
          <p class="desc" v-show="detailData.status == 0">
            {{stateDesc[detailData.status] + '￥' + regFenToYuan(detailData.pay) + '（剩余：' + minute + '分' + seconds + '秒）'}}
          </p>
        </div>
      </van-cell-group>
      <!-- 卡券基础信息 -->
      <van-cell-group class="group-public goods-cell" :border='false'>
        <img class="img" :src="detailData.imageUrl || require('@/assets/nfyg_180_180.png')" @click="buyAgain"
          alt="花生地铁">
        <div class="info" @click="buyAgain">
          <div class="row">
            <p class="title">{{detailData.chargeName}}({{detailData.typeName}})</p>
          </div>
          <div class="row">
            <p class="name">充值账号：{{detailData.chargeAccount}}</p>
          </div>
          <div class="row">
            <p class="name">规格：{{detailData.productName}}</p>
          </div>
        </div>
      </van-cell-group>
      <!-- 提示说明 -->
      <van-cell-group class="group-public remark" :border='false'>
        <h5 class="mid-title">使用说明</h5>
        <p class="desc" v-html="detailData.tips"></p>
      </van-cell-group>
      <!-- 订单情况明细 -->
      <van-cell-group class="group-public order" :class="shopUserInfo.vipType == 0?'':'last'" :border='false'>
        <van-cell class="order-info" :border='false' style="padding-top: .25rem;">
          <p class="key">订单编号：</p>
          <p class="value" :style="{display: 'flex',flexFlow: 'wrap'}">{{$route.query.orderCode}}<span class="copy"
              id="code-copy" :data-clipboard-text="$route.query.orderCode" @click="copyOrderCode">复制</span></p>
        </van-cell>
        <van-cell class="order-info" :border='false'>
          <p class="key">下单时间：</p>
          <p class="value">{{detailData.orderTime}}</p>
        </van-cell>
        <van-cell class="order-info">
          <p class="key">支付方式：</p>
          <p class="value">{{detailData.payType == 1 ? "支付宝" : "微信"}}</p>
        </van-cell>
        <van-cell class="order-value" :border='false' title="商品官方价"
          :value="detailData.price!=null?'￥' + regFenToYuan(detailData.price) : '￥--'" />
        <van-cell class="order-value" title="花粉专享折扣"
          :value="detailData.price !=null?'-￥' + regFenToYuan(detailData.price - detailData.pay) : '￥--'" />
        <van-cell class="order-value price" :border='false' title="实付款"
          :value="detailData.pay !=null?'￥'+ regFenToYuan(detailData.pay) : '￥--'" />
      </van-cell-group>
      <!-- 开通花花卡会员 -->
      <van-cell-group class="member order last" :border='false' v-show="shopUserInfo.vipType == 0 ? true : false"
        @click="$router.push({name:'perfectinfo'})">
        <div class="left">
          <p class="title">花花卡会员</p>
          <p class="desc">
            开通立享花粉权益，本单省{{regFenToYuan((detailData.price - detailData.salePrice)) || '--'}}元
          </p>
        </div>
        <button class="right btn-public-2">0元购</button>
      </van-cell-group>


      <!-- 底部操作按钮 -->
      <div class="foot">
        <div class="call" @click="onlineService"><span class="icon-call"></span><br />联系客服</div>
        <button class="btn-public-2 del" v-show="detailData.status != 0" @click="isDelPopup = true">删除订单</button>
        <button class="btn-public-2 again" v-show="detailData.status != 0" @click="buyAgain">再次充值</button>
        <button class="btn-public-2 del" v-show="detailData.status == 0" @click="cancelThisOrder">取消订单</button>
        <button class="btn-public-2 again" v-show="detailData.status == 0" @click="payOrderAgain">去支付
          ￥{{regFenToYuan(detailData.pay) || '--'}}</button>
      </div>
    </van-pull-refresh>
    <!-- 是否删除弹窗 -->
    <van-popup v-model="isDelPopup" position="bottom" class="popup-del">
      <p class="title">是否删除该订单？</p>
      <button class="btn-public-2 btn del" @click="delThisOrder">删除</button>
      <button class="btn-public-2 btn cancel" @click="isDelPopup = false">取消</button>
    </van-popup>
  </div>
</template>

<script>
  import '../../assets/css/goods.less'
  import './orderDetail.less'

  import {
    ChargeUrl
  } from '../../config/url'
  import Clipboard from 'clipboard'

  import QRCode from "qrcodejs2"

  export default {
    name: '',
    data() {
      return {
        shopUserInfo: {
          "vipType": 0
        },
        stateName: ["等待付款", "已支付", "2", "3", "已取消", "已支付", "已支付", "已支付", "已删除", "已支付", "已支付"],
        stateDesc: ["需支付：", "下单充值中，请耐心等待", "", "", "已取消", "下单充值中，请耐心等待", "下单充值中，请耐心等待", "下单充值中，请耐心等待", "已删除",
          "充值完成,祝您生活愉快~", "充值失败，请联系客服"
        ],
        detailData: {},
        isDelPopup: false,
        day: "0",
        hour: "00",
        minute: "00",
        seconds: "00",
        isLoading: false,
        isQrcode: false,
        timeOutLoading: 0,
      }
    },
    watch: {
      $route: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.getDataChargeDetail(); //重新调用加载函数
        }
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      this.getDataChargeDetail()
      //_czc.push(['_trackEvent', 'apporder_14', '曝光', '订单详情页-卡券{orderNo:' + this.$route.query.orderNo + '}']);
    },
    methods: {
      //  生成二维码
      createQRCode(code, i) {
        let _this = this;
        new QRCode('qrcode-' + i, {
          class: "code",
          width: 120,
          height: 120, // 高度
          text: code, // 二维码内容
          // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f',   // 背景色
          // foreground: '#ff0'    // 前景色
        })
        _this.isQrcode = true
      },
      // 下拉刷新
      onRefresh() {
        this.getDataChargeDetail()
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      // 获取初始化数据-直充
      getDataChargeDetail() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderCode": this.$route.query.orderCode,
          "uid": _this.shopUserInfo.uid || ""
        }
        _this.$axios.post(ChargeUrl.chargeOrderDetail, formData)
          .then((res) => {
            if (res.data.resultCode == 0) {
              _this.detailData = res.data.data
              //  if (!this.isQrcode) {
              //   _this.detailData.codeList.forEach((item, i) => {
              //     _this.$nextTick(() => {
              //       _this.createQRCode(_this.detailData.codeList[i], i);
              //     })
              //   });
              // }
              if (res.data.data.overSeconds) {
                _this.aniCountdown(res.data.data.overSeconds)
              }
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 再次购买
      buyAgain() {
        // _czc.push(['_trackEvent', 'apporder_17', '点击', '订单详情页-卡券-再次购买{couponId:' + this.detailData.id + ',couponName:' +
        //   this.detailData.couponName + '}'
        // ]);
        this.$router.push({
          name: "detailcharge",
          query: {
            chargeId: this.detailData.chargeId,
          },
        })
      },
      // 去支付
      payOrderAgain() {
        // _czc.push(['_trackEvent', 'apporder_15', '点击', '订单详情页-卡券-去支付{orderNo:' + this.detailData.orderNo +
        //   ',couponId:' + this.detailData.id + ',couponName:' + this.detailData.couponName + '}'
        // ]);
        if (this.detailData.mwebUrl && this.detailData.overSeconds > 5) {
          window.location.href = this.detailData.mwebUrl
        } else {
          this.$toast("支付倒计时小于5秒,建议重新下单")
        }
      },
      // 删除订单
      delThisOrder() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderCode": _this.$route.query.orderCode,
        }
        _this.$axios.post(ChargeUrl.chargeOrderDelete, formData)
          .then((res) => {
            // window.console.log(res)
            if (res.data.resultCode == 0) {
              _this.$toast("删除成功")
              setTimeout(() => {
                _this.$router.go(-1)
              }, 1000);
            } else {
              _this.$toast(res.data.resultMsg)
            }

          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 取消订单
      cancelThisOrder() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderCode": this.$route.query.orderCode,
        }
        _this.$axios.post(ChargeUrl.chargeOrderCancel, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.$toast("订单已取消！")
              // _czc.push(['_trackEvent', 'apporder_16', '点击', '订单详情页-卡券-取消订单{orderNo:' + this.detailData.orderNo +
              //   ',couponId:' + this.detailData.id + ',couponName:' + this.detailData.couponName + '}'
              // ]);
              _this.getDataChargeDetail()
              if (_this.timeOutLoading != 0) {
                window.clearTimeout(_this.timeOutLoading);
              }

            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 复制券码
      copyCode: function () {
        let clipboard = new Clipboard('#row-copy');
        clipboard.on('success', () => {
          this.$toast("复制成功")
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', () => {
          this.$toast("该浏览器不支持自动复制")
          // 不支持复制
          // 释放内存
          clipboard.destroy()
        })
      },
      // 复制订单编号
      copyOrderCode() {
        let clipboard = new Clipboard('#code-copy');
        clipboard.on('success', () => {
          this.$toast("复制成功")
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', () => {
          this.$toast("该浏览器不支持自动复制")
          // 不支持复制
          // 释放内存
          clipboard.destroy()
        })
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

          this.timeOutLoading = window.setTimeout(() => {
            t--
            this.aniCountdown(t)
          }, 1000);
        } else {
          this.getDataChargeDetail()
        }
      },
    },
    destroyed() { //页面销毁时 关了倒计时， 否则会一直运行，然后报错；
      const _this = this;
      if (_this.timeOutLoading != 0) {
        window.clearTimeout(_this.timeOutLoading);
      }
    }
  }
</script>
<style lang="less" scoped>
  .goods-cell {
    background: #fff;
  }

  .mid-title {
    line-height: .4rem;
    color: #333;
    margin-bottom: .2rem;
    font-size: .28rem;
  }

  .title {
    font-size: .28rem;
    font-weight: bold;
    line-height: .6rem;
  }

  .name {
    line-height: .5rem;
    font-weight: normal;
  }

  .desc {
    font-size: .28rem;
  }

  .detail-right .order.last {
    overflow: hidden;
  }

  // 办理会员栏
  .member {
    display: flex;
    padding: 0.18rem 0.3rem;
    font-size: 0.28rem;
    color: #916b3a;
    width: 6.9rem;
    margin: .2rem auto 0 auto;
    border-radius: 0.1rem;
    background: linear-gradient(90deg,
        rgba(255, 240, 211, 1) 0%,
        rgba(255, 240, 194, 1) 100%);

    .title {
      font-weight: bold;
    }

    .desc {
      margin-top: 0.12rem;
    }

    .right {
      margin: auto;
      margin-right: 0;
      width: 1.4rem;
      height: 0.5rem;
      color: #916b3a;
      font-weight: bold;
      background: none;
      border-color: #916b3a;
    }
  }
</style>
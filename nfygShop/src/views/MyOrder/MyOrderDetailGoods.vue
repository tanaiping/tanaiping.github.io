<template>
  <div class="detail-goods bg-public">
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" class="bg-public" @refresh="onRefresh">
      <van-cell-group class="state" :border='false'>
        <div>
          <h5 class="name">{{stateName[detailData.status]}}</h5>
          <p class="desc" v-show="detailData.status == 2 || detailData.status == 4 || detailData.status == 5">
            {{detailData.status == 5 ? detailData.reason : stateDesc[detailData.status]}}</p>
          <p class="desc" v-show="detailData.status == 1">
            {{stateDesc[detailData.status] + '￥' + regFenToYuan(detailData.price + detailData.freight) + '（剩余：' + minute + '分' + seconds + '秒）'}}
          </p>
          <p v-show="detailData.status == 3" class="desc">
            物流公司：{{LogisticData.length > 0 ? LogisticData[0].logisticName : ''}}<span></span>
            <p v-show="detailData.status == 3" class="desc">
              运单编号：{{LogisticData.length > 0 ? LogisticData[0].logisticNo : ''}}<span></span>
            </p>
        </div>
        <button v-show="detailData.status == 3" class="btn-public-2" @click="isLogisticsPopup = true">查看物流</button>
        <button v-show="detailData.status == 1" class="btn-public-2" @click="payOrderAgain">去支付</button>
      </van-cell-group>
      <van-cell-group class="address" :border='false'>
        <p class="name">{{rname_rmobile}}</p>
        <div class="add"><span class="icon-19"></span>{{addressExt}}</div>
      </van-cell-group>
      <van-cell-group class="goods-call" :border='false'>
        <div class="goods-cell">
          <img class="img" :src="detailData.thumbPic || require('@/assets/nfyg_180_180.png')" alt="花生地铁"
            @click="buyAgain">
          <div class="info">
            <div class="row">
              <p class="name" @click="buyAgain">{{detailData.goodsName}}</p>
            </div>
            <div class="option">
              <p class="desc">{{detailData.attrName}}</p>
              <p class="number">x{{detailData.num}}</p>
            </div>
            <div class="option">
              <h5 class="price">￥{{regFenToYuan(detailData.pay) || '--'}}</h5>
            </div>
          </div>
        </div>
        <div class="call">
          <div class="col" @click="onlineService"><span class="icon-call"></span><span>联系客服</span></div>
          <div class="col" @click="onlineService" v-if="detailData.status == 3 || detailData.status == 4"><span
              class="icon-call"></span><span>申请售后</span></div>
          <div class="col" @click="onlineService" v-if="detailData.status == 2 "><span
              class="icon-call"></span><span>申请退款</span></div>
        </div>
      </van-cell-group>
      <van-cell-group class="order" :border='false'>
        <van-cell class="order-info" :border='false'>
          <p class="key">订单编号：</p>
          <p class="value" :style="{display: 'flex',flexFlow: 'wrap'}">{{$route.query.orderNo}}<span class="copy"
              id="code-copy" :data-clipboard-text="$route.query.orderNo" @click="copyOrderNo">复制</span></p>
        </van-cell>
        <van-cell class="order-info" :border='false'>
          <p class="key">下单时间：</p>
          <p class="value">{{detailData.orderTime}}</p>
        </van-cell>
        <van-cell class="order-info" :border='false'>
          <p class="key">支付方式：</p>
          <p class="value">{{detailData.payType == 1 ? "支付宝" : "微信"}}</p>
        </van-cell>
      </van-cell-group>
      <van-cell-group class="order last" :border='false'>
        <van-cell class="order-value" title="商品金额"
          :value="detailData.salePrice !=null?'￥' + regFenToYuan(detailData.num * detailData.salePrice) : '￥--'"
          :border='false' />
        <van-cell class="order-value" title="运费"
          :value="detailData.freight != null?'+￥' + regFenToYuan(detailData.freight) : '￥--'" :border='false' />
        <van-cell class="order-value" title="花粉专享折扣"
          :value="detailData.salePrice != null?'-￥' + regFenToYuan(detailData.num * (detailData.salePrice - detailData.pay)) : '￥--'" />
        <van-cell class="order-value price"
          :title="detailData.status == 1 ? '待付款' : (detailData.status == 5 ? '应付款' : '实付款')"
          :value="detailData.price != null?'￥' + regFenToYuan(detailData.price + detailData.freight) : '￥--'"
          :border='false' />
      </van-cell-group>

      <div class="foot">
        <button class="btn-public-2 del" v-show="detailData.status == 1" @click="cancelThisOrder">取消订单</button>
        <button class="btn-public-2 del" v-show="detailData.status == 4 || detailData.status == 5"
          @click="isDelPopup = true">删除订单</button>
        <button class="btn-public-2 again"
          v-show="detailData.status == 2 || detailData.status == 4 || detailData.status == 5"
          @click="buyAgain">再次购买</button>
      </div>
    </van-pull-refresh>
    <!-- 物流弹窗 -->
    <van-popup v-model="isLogisticsPopup" class="popup-logistics" closeable close-icon="close">
      <div class="name">
        <!-- <img class="img" :src="require('@/assets/nfyg_180_180.png')" alt="花生地铁"> -->
        <div>
          <p>物流公司：{{LogisticData.length > 0 ? LogisticData[0].logisticName : ''}}</p>
          <p class="number">运单编号：{{LogisticData.length > 0 ? LogisticData[0].logisticNo : ''}}</p>
        </div>
      </div>
      <div class="info">
        <div class="cell" v-for="(item, i) in LogisticData" :key="i">
          <div :class="'circle circle-' + i"></div>
          <div class="col">
            <p class="content">{{item.content}}</p>
            <p class="time">{{item.time}}</p>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 是否删除订单 -->
    <van-popup v-model="isDelPopup" position="bottom" class="popup-del">
      <p class="title">是否删除该订单？</p>
      <button class="btn-public-2 btn del" @click="delThisOrder($route.query.orderNo)">删除</button>
      <button class="btn-public-2 btn cancel" @click="isDelPopup = false">取消</button>
    </van-popup>
  </div>
</template>

<script>
  const _czc = window._czc || []
  import './orderDetail.less'
  import '../../assets/css/goods.less'
  import RegionList from '../../assets/js/regionList'
  import {
    GoodsUrl
  } from '../../config/url'
  import Clipboard from 'clipboard'
  import Utils from '../../server/utils'
  export default {
    name: '',
    data() {
      return {
        shopUserInfo: {
          "vipType": 0
        },
        LogisticData: [],
        isLogisticsPopup: false,
        isDelPopup: false,
        detailData: {},
        carmodel: '',
        addressData: {},
        stateName: ["已删除", "待付款", "待发货", "待收货", "已完成", "已取消"],
        stateDesc: ["已删除", "需支付：", "商品准备中，请耐心等待", "物流公司：", "您的订单已签收，感谢您，欢迎再次光临！",
          "订单取消"
        ],
        day: "0",
        hour: "00",
        minute: "00",
        seconds: "00",
        rname_rmobile: "",
        addressExt: "",
        isLoading: false,
        timeOutLoading: 0,
      }
    },
    mounted() {
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      this.getDataGoodsDetail()
      _czc.push(['_trackEvent', 'apporder_14', '曝光', '订单详情页-商品{orderNo:' + this.$route.query.orderNo + '}']);
    },
    watch: {
      $route: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.getDataGoodsDetail(); //重新调用加载函数
        }
      }
    },
    methods: {
      // 下拉刷新
      onRefresh() {
        this.getDataGoodsDetail()
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      // 获取商品订单详情
      getDataGoodsDetail() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderNo": _this.$route.query.orderNo,
          "uid": _this.shopUserInfo.uid || ""
        }
        _this.$axios.post(GoodsUrl.goodsOrderDetail, formData)
          .then((res) => {
            // window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.detailData = res.data.data;
              let addressDetail = res.data.data.addressDetail;
              let addressAttr = [];
              addressAttr = addressDetail.split("#");
              _this.rname_rmobile = addressAttr[0];
              _this.addressExt = addressAttr[1];
              if (res.data.data.overSeconds) {
                _this.aniCountdown(res.data.data.overSeconds)
              }
              if (res.data.data.status == 3 || res.data.data.status == 4) {
                _this.getDataLogisticDetail()
              }
              _this.getDataAddress(res.data.data.addressId)
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取用户下单地址
      getDataAddress(id) {
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
            if (res.data.resultCode == 0) {
              res.data.data.forEach(item => {
                if (item.addressId == id) {
                  _this.addressData = item
                  _this.getRegionName(item.regionId)
                }
              });
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 查询物流详情
      getDataLogisticDetail() {
        const _this = this
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderNo": _this.detailData.orderNo
        }
        _this.$axios.post(GoodsUrl.goodsLogisticDetail, formData)
          .then((res) => {
            if (res.data.resultCode == 0) {
              if (res.data.data) {
                _this.LogisticData = res.data.data
              }
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取区域名
      getRegionName(id) {
        const _this = this
        RegionList.data.forEach(item => {
          if (item.regionId == id) {
            _this.carmodel = item.regionName + ' ' + _this.carmodel
            if (item.regionLevel != 1) {
              _this.getRegionName(item.parentregionId)
            }
          }
        })
      },
      // 再次购买
      buyAgain() {
        _czc.push(['_trackEvent', 'apporder_17', '点击', '订单详情页-商品-再次购买{goodsId:' + this.detailData.goodsId +
          ',goodsName:' + this.detailData.goodsName + ',skuId:' + this.detailData.skuId + '}'
        ]);
        this.$router.push({
          name: "detailgoods",
          query: {
            isAgain: 1,
            detailType: "goods",
            goodsId: this.detailData.goodsId,
            activeId: this.detailData.activeId,
            checkSkuId: this.detailData.skuId,
            entryType: this.detailData.entryType,
          }
        })
      },
      // 取消订单
      cancelThisOrder() {
        // goodsOrderDelete
        const _this = this
        const shopUserInfo = _this.$cookies.get("shopUserInfo")
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "orderNo": _this.detailData.orderNo,
          "uid": shopUserInfo ? shopUserInfo.uid : "",
          "type": 2
        }
        _this.$axios.post(GoodsUrl.goodsOrderDelete, formData)
          .then((res) => {
            // window.console.log(res)
            if (res.data.resultCode == 0) {
              _this.$toast("订单已取消！")
              _czc.push(['_trackEvent', 'apporder_16', '点击', '订单详情页-商品-取消订单{orderNo:' + _this.detailData.orderNo +
                ',goodsId:' + _this.detailData.goodsId + ',goodsName:' + _this.detailData.goodsName + '}'
              ]);
              _this.getDataGoodsDetail()
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
      // 去支付
      payOrderAgain() {
        // this.$toast("去支付 orderCode = " + orderCode)
        _czc.push(['_trackEvent', 'apporder_15', '点击', '订单详情页-商品-去支付{orderNo:' + this.detailData.orderNo + ',goodsId:' +
          this.detailData.goodsId + ',goodsName:' + this.detailData.goodsName + '}'
        ]);
        if (this.detailData.wxMwebUrl && this.detailData.overSeconds > 5) {
          window.location.href = this.detailData.wxMwebUrl
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
          "orderNo": _this.$route.query.orderNo,
          "uid": _this.shopUserInfo.uid || "",
          "type": 3
        }
        _this.$axios.post(GoodsUrl.goodsOrderDelete, formData)
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
      // 复制订单编号
      copyOrderNo() {
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
          this.getDataGoodsDetail()
        }
      }
    },
    destroyed() {
      const _this = this;
      if (_this.timeOutLoading != 0) {
        window.clearTimeout(_this.timeOutLoading);
      }
    }
  }
</script>

<style lang="less" scoped>
  .address {
    margin: auto;
    padding: 0.2rem 0.3rem;
    font-size: 0.28rem;

    .name {
      span {
        margin-left: 0.3rem;
      }
    }

    .add {
      margin-top: 0.12rem;
    }
  }

  .goods-cell {
    margin-top: .2rem;
    background: #fff;
  }

  .call {
    display: flex;
    margin: auto;
    padding: 0.25rem;
    font-size: 0.3rem;
    font-weight: bold;
    text-align: center;
    border-top: solid 1px #e5e5e5;

    .col {
      flex: 1;
    }
  }

  .order {
    margin-top: 0.2rem;
  }

  .foot {
    button {
      width: 2.86rem;
    }
  }

  .popup-logistics {
    width: 6.4rem;
    height: 9.3rem;
    border-radius: 0.16rem;

    .name {
      display: flex;
      padding: 0.3rem;

      img {
        width: 1.44rem;
        height: 1.44rem;
        border-radius: 0.02rem;
      }

      div {
        margin: auto;
        margin-left: 0.2rem;
        margin-bottom: 0;
        font-size: 0.28rem;
        color: #333;

        .number {
          margin-top: 0.15rem;
        }
      }
    }

    .info {
      padding: 0.2rem 0.3rem;
      height: 7.51rem;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      border-top: solid 0.2rem #f8f8f8;

      .cell {
        display: flex;
        margin-top: 0.5rem;

        .circle {
          margin: auto;
          margin-left: 0;
          width: 0.17rem;
          height: 0.17rem;
          background: #ccc;
          border-radius: 50%;
        }

        .circle-0 {
          background: #ff5656;
        }

        .col {
          margin: auto;
          margin-left: 0.5rem;
          width: 5.2rem;

          .content {
            font-size: 0.28rem;
            color: #333;
          }

          .time {
            font-size: 0.24rem;
            color: #999;
            margin-top: 0.16rem;
          }
        }
      }
    }
  }
</style>
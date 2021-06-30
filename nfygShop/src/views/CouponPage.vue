<template>
  <!-- 花生权益页面是卡券，需要调卡券接口 -->
  <!-- 查询卡券列表 （/v1/coupon/list） -->
  <div class="coupon-page bg-public">
    <van-cell-group class="header">
      <van-row class="header-tab"
               type="flex"
               justify="space-around">
        <van-col :class="isPopup && tab == 1 ? (tagKey != 0 ? 'select active up' : 'select up') : (tagKey != 0 ? 'select active' : 'select')"
                 @click="changeTabSelect(1)">
          <p class="text">{{tagList[tagKey] || "卡券类别"}}</p><i class="icon"></i>
        </van-col>
        <van-col :class="isPopup && tab == 2 ? (sortType != 0 ? 'select active up' : 'select up') : (sortType != 0 ? 'select active' : 'select')"
                 @click="changeTabSelect(2)">
          <p class="text">{{sortList[sortType] || "智能排序"}}</p><i class="icon"></i>
        </van-col>
      </van-row>
    </van-cell-group>
    <van-popup v-model="isPopup"
               get-container=".header"
               position="top"
               style="top: 1.64rem;max-height:8rem;overflow:auto;">
      <van-row v-if="tab == 1"
               class="header-cell">
        <van-cell v-for="(item, i) in tagList"
                  :key="i"
                  :class="tagKey == i ? 'active' : ''"
                  :title="item"
                  value=""
                  @click="selectTabType('tagKey', i)" />
      </van-row>
      <van-row v-if="tab == 2"
               class="header-cell">
        <van-cell v-for="(item, i) in sortList"
                  :key="i"
                  :class="sortType == i ? 'active' : ''"
                  :title="item"
                  value=""
                  @click="selectTabType('sortType', i)" />
      </van-row>
    </van-popup>
    <!-- 初始化获取数据，加载中... -->
    <van-loading v-if="isFirstLoading"
                 size="24px"
                 type="spinner"
                 :style="{marginTop: '2.25rem'}"
                 vertical>加载中...</van-loading>
    <van-cell-group v-if="couponList ? (couponList.length > 0 ? true : false) : false"
                    class="content"
                    :border='false'>
      <div class="goods"
           v-for="(item, i) in couponList"
           :key="i"
           @click="linkToDeatils('coupon', item.id)">
        <img class="img"
             :src="item.logo || require('@/assets/nfyg_180_180.png')"
             alt="花生地铁" />
        <div class="info">
          <p class="name">{{item.couponName}}</p>
          <p class="return"
             v-if="item.backBi > 0">最多可返{{item.backBi}}花花币</p>
          <p class="value"><span class="value-1">市场价 ¥{{regFenToYuan(item.price) || '--'}}</span><span class="value-2">优惠价 ¥{{regFenToYuan(item.salePrice) || '--'}}</span></p>
          <div class="row">
            <p class="price">￥{{regFenToYuan(item.disPrice) || '--'}}</p>
            <img class="tag-s"
                 :src="require('@/assets/tag_s.png')"
                 alt="花花权益价">
            <!-- <p class="sales">已售 {{item.assign}}</p> -->
          </div>
        </div>
      </div>
    </van-cell-group>
    <NfygEmpth v-if="isNfygEmpth"
               type="coupon"
               text="花粉权益发完啦，等下再来看看吧~" />
  </div>
</template>

<script>
import {
  CouponUrl
} from '../config/url';

import {
  getPosition
} from '../server/nfygCommon'

import NfygEmpth from '../components/NfygEmpty';

import '../assets/css/goods.less'

export default {
  name: '',
  data () {
    return {
      tab: 0,
      sortType: 0,
      tagKey: "",
      isPopup: false,
      isFirstLoading: true,
      isNfygEmpth: false,
      couponList: [],
      tagList: ["全部", "美食", "电影", "演出", "住宿", "门票", "车票", "运动健身", "健康", "美容", "培训", "亲子", "生活服务", "休闲娱乐",
        "电商平台", "花生小说"
      ],
      sortList: ["默认排序", "销量排序", "价格高到低排序", "价格低到高排序"]
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      if (newVal != oldVal) {
        this.getDataCouponList();//重新调用加载函数
      }
    }
  },
  mounted () {
    this.getDataCouponList()
  },
  methods: {
    // 获取初始化数据 --- 卡券列表
    getDataCouponList () {
      const _this = this
      const cityName = _this.$cookies.get("ipPositionCity")
      const agentKey = _this.$cookies.get("shopAgentKey")
      const formData = {
        "agentKey": agentKey || "peanut_subway",
        "sign": "fdfc57a94fc480d3a872c9",
        "cityName": cityName,
        "sortType": _this.sortType,
        "tagKey": _this.tagKey == 0 ? "" : _this.tagKey,
      }
      _this.$axios.post(CouponUrl.couponList, formData)
        .then((res) => {
          // window.console.log(res);
          _this.isFirstLoading = false
          if (res.data.resultCode == 0) {
            _this.couponList = res.data.data
            if (!_this.couponList || !(_this.couponList.length > 0)) {
              _this.isNfygEmpth = true
            } else {
              _this.isNfygEmpth = false
            }
          } else {
            _this.$toast(res.data.resultMsg)
          }
        })
        .catch((error) => {
          window.console.log(error);
        })
    },
    linkToDeatils (type, id) {
      this.$router.push({
        name: "detailcoupon",
        query: {
          detailType: type,
          couponId: id,
          entryType: 5
        }
      })
    },
    changeTabSelect (tab) {
      if (this.tab == tab) {
        this.isPopup = false
        this.tab = 0;
      } else {
        this.isPopup = true
        this.tab = tab;
      }

    },
    selectTabType (type, number) {
      if (type == "sortType") {
        this.sortType = number
      } else {
        this.tagKey = number
      }
      this.getDataCouponList()
      setTimeout(() => {
        this.isPopup = false
      }, 250);
    }
  },
  components: {
    NfygEmpth
  }
}
</script>

<style lang="less" scoped>
.coupon-page {
  .header {
    position: fixed;
    width: 100%;
    height: 0.88rem;
    z-index: 99;

    .header-tab {
      display: flex;
      position: relative;
      width: 100%;
      background: #fff;
      z-index: 3010;

      .select {
        flex: 1;
        margin: auto;
        text-align: center;
        font-size: 0.28rem;
        color: #999;
        padding: 0.2rem 0.3rem 0.1rem 0.3rem;
        display: flex;
      }

      p {
        margin: auto;
        margin-right: 0.1rem;
      }

      .select.active {
        font-weight: bold;
        color: #ff5656;
      }

      .icon {
        margin: auto;
        margin-left: 0.1rem;
        width: 0;
        height: 0;
        border-top: 0.1rem solid #999;
        border-left: 0.1rem solid #f8f8f8;
        border-right: 0.1rem solid #f8f8f8;
        border-bottom: 0 solid #f8f8f8;
      }

      .select.up .icon {
        margin: auto;
        margin-left: 0.1rem;
        width: 0;
        height: 0;
        border-top: 0 solid #999;
        border-left: 0.1rem solid #f8f8f8;
        border-right: 0.1rem solid #f8f8f8;
        border-bottom: 0.1rem solid #999;
      }

      .select.active.up .icon {
        margin: auto;
        margin-left: 0.1rem;
        width: 0;
        height: 0;
        border-top: 0 solid #f8f8f8;
        border-left: 0.1rem solid #f8f8f8;
        border-right: 0.1rem solid #f8f8f8;
        border-bottom: 0.1rem solid #ff5656;
      }

      .select.active .icon {
        margin: auto;
        margin-left: 0.1rem;
        width: 0;
        height: 0;
        border-top: 0.1rem solid #ff5656;
        border-left: 0.1rem solid #f8f8f8;
        border-right: 0.1rem solid #f8f8f8;
        border-bottom: 0 solid #ff5656;
      }
    }
  }

  .header-cell {
    .active {
      color: #ff5656;
    }
  }

  .content {
    margin-top: 1.08rem;

    .goods {
      border-bottom: solid #eeeeee 1px;

      .info {
        .name {
          font-size: 0.3rem;
        }

        .value {
          margin-top: 0.12rem;
        }

        .row {
          .sales {
            margin: auto;
            margin-right: 0;
          }
        }
      }

      .value-2 {
        margin-left: 0.2rem;
      }
    }
  }
}
</style>
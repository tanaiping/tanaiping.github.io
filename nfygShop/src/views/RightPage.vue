<template>
  <div class="right-page bg-public">
    <van-tabs v-model="activeId"
              v-if="bisList.length > 0"
              animated
              swipeable
              @click="changeTab"
              class="header"
              color="#FF5656"
              title-active-color="#FF5656">
      <van-tab v-for="(item, i) in bisList"
               :key="i"
               :title="item.bisName"
               :name="item.id"
               :title-style="{minWidth: 'auto',padding: '0 0.15rem'}">
      </van-tab>
    </van-tabs>
    <!-- 初始化获取数据，加载中... -->
    <van-loading v-if="isFirstLoading"
                 size="24px"
                 type="spinner"
                 :style="{marginTop: '2.25rem'}"
                 vertical>加载中...</van-loading>
    <van-cell-group v-if="rightList ? (rightList.length > 0 ? true : false) : false"
                    class="content"
                    :border='false'>
      <div class="goods"
           v-for="(item, i) in rightList"
           :key="i"
           @click="linkToDeatils('right', item.id)">
        <div class="img">
          <img class="img"
               :src="item.rightLogo || require('@/assets/nfyg_180_180.png')"
               alt="花生地铁">
          <img v-if="item.statue == 3"
               class="sell-out"
               :src="require('@/assets/sell_out.png')"
               alt="售罄" />
        </div>
        <div class="info">
          <p class="name">{{item.rightName}}</p>
          <!-- <p class="return">最多可返200花花币</p> -->
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
  RightUrl
} from '../config/url'

import NfygEmpth from '../components/NfygEmpty'

import '../assets/css/goods.less'

export default {
  name: '',
  data () {
    return {
      bisList: [],
      rightList: [],
      activeId: 0,
      isFirstLoading: true,
      isNfygEmpth: false,
    }
  },
  mounted () {
    this.activeId = this.$route.query.rightId
    this.getDataRightList(this.activeId)
  },
  methods: {
    getDataRightList (id) {
      const _this = this
      const agentKey = _this.$cookies.get("shopAgentKey")
      const formData = {
        "agentKey": agentKey || "peanut_subway",
        "bisId": id,
        "sign": "fdfc57a94fc480d3a872c9"
      }
      _this.$axios.post(RightUrl.rightList, formData)
        .then((res) => {
          // window.console.log(res);
          _this.isFirstLoading = false
          if (res.data.resultCode == 0) {
            if (res.data.data) {
              _this.bisList = res.data.data.bisList
              _this.rightList = res.data.data.rightList
              if (_this.rightList.length > 0) {
                _this.isNfygEmpth = false
              } else {
                _this.isNfygEmpth = true
              }
            } else {
              _this.isNfygEmpth = true
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
        name: "detailright",
        query: {
          detailType: type,
          rightId: id
        }
      })
    },
    changeTab (name) {
      this.getDataRightList(name)
    }
  },
  components: {
    NfygEmpth
  }
}
</script>

<style lang="less" scoped>
.right-page {
  .header {
    display: flex;
    background: #fff;
    overflow: scroll;
    position: fixed;
    width: 100%;
    height: 0.88rem;
    z-index: 99;

    .van-tab {
      min-width: auto;
      padding: 0 0.2rem;
    }

    p {
      min-width: 1.3rem;
      padding: 0.2rem 0.3rem 0.1rem 0.3rem;
      margin: auto 0.1rem;
      font-size: 0.3rem;
      font-weight: 500;
      text-align: center;
    }

    p.active {
      font-weight: bold;
      color: #ff5656;
    }
  }

  .content {
    margin-top: 1.08rem;

    .goods {
      border-bottom: solid #eeeeee 1px;
    }

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
  }
}
</style>
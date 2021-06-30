<template>
  <!-- specialType 2-兑换专区，3-限时抢购 -->
  <div class="special bg-public">
    <p class="sub-title" v-if="$route.query.specialType == 2">定期更新，仅限花花卡会员</p>
    <p class="sub-title" v-if="$route.query.specialType == 3">精选特价疯抢中，仅限花花卡会员</p>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" class="bg-public" @refresh="onRefresh">
      <!-- 初始化获取数据，加载中... -->
      <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '1.5rem'}" vertical>加载中...
      </van-loading>
      <van-cell-group v-if="specialList.length > 0" :border='false'>
        <Goods v-for="(item, i) in specialList" :key="i" :goods="item" :detailType="item.type == 1 ? 'goods' : 'coupon'"
          :special="$route.query.specialType" :overSeconds="item.overSeconds" />
      </van-cell-group>
      <NfygEmpth v-if="isNfygEmpth" type="coupon" text="一大波数据正在赶来~" />
    </van-pull-refresh>
  </div>
</template>

<script>
  import Goods from '../components/Goods'
  import NfygEmpth from '../components/NfygEmpty'

  import {
    GoodsUrl
  } from '../config/url'

  export default {
    name: '',
    data() {
      return {
        specialList: [],
        isNfygEmpth: false,
        isLoading: false,
        isFirstLoading: true
      }
    },
    mounted() {
      this.getDataActivity()
    },
    methods: {
      // 下拉刷新
      onRefresh() {
        this.getDataActivity()
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      getDataActivity() {
        const _this = this
        const cityName = _this.$cookies.get("ipPositionCity")
        const agentKey = _this.$cookies.get("shopAgentKey")
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "entryType": _this.$route.query.specialType,
          "cityName": cityName
        }
        _this.$axios.post(GoodsUrl.activityList, formData)
          .then((res) => {
            // window.console.log(res);
            _this.isFirstLoading = false
            if (res.data.resultCode == 0) {
              _this.orderList = res.data.data
              if (res.data.data) {
                _this.specialList = res.data.data
                if (_this.specialList.length > 0) {
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
    },
    components: {
      Goods,
      NfygEmpth
    }
  }
</script>

<style lang="less" scoped>
  .sub-title {
    padding: 0.1rem;
    font-size: 0.28rem;
    font-weight: 500;
    color: #666;
    line-height: 1.5;
    text-align: center;
    background: #fff;
    border-bottom: solid 0.2rem #f8f8f8;
  }
</style>
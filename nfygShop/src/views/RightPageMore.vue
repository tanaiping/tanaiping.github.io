<template>
  <div class="right-page-more bg-public">
    <van-cell-group class="hot"
                    :border='false'
                    v-for="(hot, h) in hotMoreData"
                    :key="h">
      <p class="title">{{hot.categoryName}}</p>
      <van-row class="hot-row"
               type="flex"
               justify="space-around">
        <router-link class="col"
                     v-for="(item, i) in hot.bisList"
                     :key="i"
                     :to="{name: 'rightpage', query: {rightId: item.id}}">
          <div class="icon">
            <img :src="item.bisLogo || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head_girl.png'"
                 alt="">
          </div>
          <p class="name">{{item.bisName.length>6?item.bisName.substring(0,6):item.bisName}}</p>
          <p class="name desc">{{item.title}}</p>
        </router-link>
      </van-row>
    </van-cell-group>
  </div>
</template>

<script>
import {
  RightUrl
} from '../config/url'
// import { browser, getUserInfo, pushToLoginView } from '../server/nfygCommon'
export default {
  name: '',
  data () {
    return {
      hotMoreData: [],
    }
  },
  mounted () {
    this.getDataHotMore()
  },
  methods: {
    // 获取热门权益
    getDataHotMore () {
      const _this = this
      const cityName = _this.$cookies.get("ipPositionCity")
      const agentKey = _this.$cookies.get("shopAgentKey")
      const formData = {
        "agentKey": agentKey || "peanut_subway",
        "cityName": cityName,
        "sign": "fdfc57a94fc480d3a872c9"
      }
      _this.$axios.post(RightUrl.moreIndex, formData)
        .then((res) => {
          // window.console.log(res);
          if (res.data.resultCode == 0) {
            _this.hotMoreData = res.data.data
          }
        })
        .catch((error) => {
          window.console.log(error);
        })
    },
  }

}
</script>

<style lang="less" scoped>
.hot {
  margin-top: 0.2rem;
  .title {
    font-size: 0.32rem;
    padding: 0.2rem 0.3rem;
  }
}

.hot-row {
  width: 7.1rem;
  margin: auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  padding-bottom:.3rem;
  .col {
    min-width: 1.42rem;
    // margin-top: 0.4rem;
  }

  .icon {
    margin: auto;
    width: 0.8rem;
    height: 0.8rem;
    // background: #efefef;
    // background: linear-gradient(
    //   180deg,
    //   rgba(248, 214, 140, 1) 0%,
    //   rgba(225, 191, 135, 1) 100%
    // );
    // opacity:0.2;
    border-radius: 50%;
    overflow: hidden;
  }

  .name {
    margin-top: 0.08rem;
    font-size: 0.24rem;
    font-weight: 400;
    color: #333;
    text-align: center;
  }
  .desc {
    font-size: 0.2rem;
    color: #999;
  }
}
</style>
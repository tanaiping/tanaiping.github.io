<template>
  <div class="right-page-more bg-public">
    <van-cell-group class="hot"
                    :border='false'>
      <van-row class="hot-row"
               type="flex"
               justify="space-around">
        <div class="col"
                     v-for="(item, i) in chargeData"
                     :key="i"
                     :chargeId = "item.id" @click='linkToChargeDetail(item,i)'>
          <div class="icon">
            <img :src="item.imageUrl || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head_girl.png'"
                 alt="">
          </div>
          <p class="name">{{item.chargeName.length>6?item.chargeName.substring(0,6):item.chargeName}}</p>
          <p class="name desc">{{item.subTitle}}</p>
        </div>
      </van-row>
    </van-cell-group>
  </div>
</template>

<script>
import {
  ChargeUrl
} from '../config/url'
// import { browser, getUserInfo, pushToLoginView } from '../server/nfygCommon'
export default {
  name: '',
  data () {
    return {
      chargeData: [],
    }
  },
  mounted () {
    this.getDataChargeAll()
	this.$cookies.remove('chargeAccount') //清除直充账号cookie
  },
  methods: {
    // 获取热门权益
    getDataChargeAll () {
      const _this = this
      const agentKey = _this.$cookies.get("shopAgentKey")
      const formData = {
        "agentKey": agentKey || "peanut_subway",
        "sign": "fdfc57a94fc480d3a872c9"
      }
      _this.$axios.post(ChargeUrl.chargeAll, formData)
        .then((res) => {
          if (res.data.resultCode == 0) {
			  var newArr = [];
			  res.data.data.forEach(function(item,index,arr){
				  if(item.id != 9){
					  newArr.push(item);
				  }
			  })
			  console.log(newArr)
            _this.chargeData = newArr;
          }
        })
        .catch((error) => {
          window.console.log(error);
        })
    },
	linkToChargeDetail(item,i) {
	  _czc.push(['_trackEvent', 'appinterest_0102', '点击', '更多-运营位icon{site:' + (i+1) + ',name:' + item.chargeName+'}'
	  ]);
	  this.$router.push({
	    name: "detailcharge",
	    query: {
	      chargeId: item.id
	    }
	  })
	},
  }

}
</script>

<style lang="less" scoped>
.hot {
  margin-top: 0.2rem;
  padding-top:.2rem;
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
	margin-bottom: .3rem;
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
    font-size: 0.22rem;
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
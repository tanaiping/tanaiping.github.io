<template>
  <div class="address-list bg-public">
    <!-- 初始化获取数据，加载中... -->
    <van-loading v-if="isFirstLoading"
                 size="24px"
                 type="spinner"
                 :style="{marginTop: '2.25rem'}"
                 vertical>加载中...</van-loading>
    <div v-if="addressList ? (addressList.length > 0 ? true : false) : false"
         class="list">
      <Address v-for="(item, i) in addressList"
               :key="i"
               :address="item"
               v-on:update="addressRload" />
    </div>
    <NfygEmpth v-else-if="isNfygEmpth"
               type="address"
               text="您还没有添加收货地址～" />
    <div :class="'foot ' + (isNfygEmpth ? 'empty' : '')">
      <button class="btn-public btn-new"
              @click="newAddress">+ 新建地址</button>
    </div>
    <van-popup v-model="isDelPopup"
               position="bottom"
               class="popup-del">
      <p class="title">是否删除该地址？</p>
      <button class="btn-public-2 btn del"
              @click="delThisAddress(isDelId)">删除</button>
      <button class="btn-public-2 btn cancel"
              @click="isDelPopup = false">取消</button>
    </van-popup>
  </div>
</template>

<script>
import Address from '../components/Address'

import NfygEmpth from '../components/NfygEmpty'
import {
  GoodsUrl
} from '../config/url'
import Utils from '../server/utils'
export default {
  name: '',
  data () {
    return {
      shopUserInfo: {
        "vipType": 0
      },
      addressList: [],
      isDelPopup: false,
      isDelId: '',
      isFirstLoading: true,
      isNfygEmpth: false,
    }
  },
  mounted () {
    const shopUserInfo = this.$cookies.get("shopUserInfo")
    if (shopUserInfo) {
      this.shopUserInfo = shopUserInfo
    }
    this.getDataAddress()
  },
  methods: {
    addressRload (val) {
      this.isDelPopup = true
      this.isDelId = val
    },
    getDataAddress () {
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
	  	_this.isFirstLoading = false
	  	if (res.data.resultCode == 0) {
	  	  if (res.data.data) {
	  		_this.addressList = res.data.data
	  		if (_this.addressList.length > 0) {
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
    newAddress () {
      this.$router.push({
        name: 'addressedit',
        query: {
          editType: 1,
          editFrom: 'list'
        }
      })
    },
    delThisAddress (id) {
      const _this = this
      const agentKey = _this.$cookies.get("shopAgentKey")
      const formData = {
        "agentKey": agentKey || "peanut_subway",
        "sign": "fdfc57a94fc480d3a872c9",
        "uid": _this.shopUserInfo.uid || "",
        "type": 3,
        "rmobile": "",
        "rname": "",
        "regionId": "",
        "addressExt": "",
        "addressId": id || "",
      }
      _this.$axios.post(GoodsUrl.addressModify, formData)
        .then((res) => {
          // window.console.log(res);
          if (res.data.resultCode == 0) {
            _this.isDelPopup = false
            _this.$toast("删除成功")
            _this.getDataAddress()
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
    Address,
    NfygEmpth
  }
}
</script>

<style lang="less" scoped>
.list {
  margin-bottom: 1.6rem;
}

.foot {
  position: fixed;
  margin: auto;
  width: 100%;
  background: #fff;
  padding-bottom: 0.3rem;
  padding-top: 0.3rem;
  bottom: 0;
}

.foot.empty {
  position: relative;
  margin-top: 1.9rem;
  background: none;
}

.btn-new {
  margin: auto;
  width: 5.8rem;
  height: 0.88rem;
  border-radius: 0.44rem;
}
</style>
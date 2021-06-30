<template>
  <div class="address-edit bg-public">
    <van-cell-group>
      <!-- 收件人 -->
      <div class="van-cell van-field">
        <div class="van-cell__title">
          <span>收件人：</span>
        </div>
        <div class="van-cell__value">
          <div class="van-field__body">
            <input v-model="rname" type="text" placeholder="真实姓名" class="van-field__control" maxlength="30"
              v-on:input="onChangeAddress" />
          </div>
        </div>
      </div>
      <!-- 手机号码 -->
      <div class="van-cell van-field">
        <div class="van-cell__title"><span>手机号码：</span></div>
        <div class="van-cell__value">
          <div class="van-field__body">
            <span class="area">+86</span><input v-model="rmobile" type="number" placeholder="手机号码"
              class="van-field__control" oninput="if(value.length>11)value=value.slice(0,11)"
              v-on:input="onChangeAddress" />
          </div>
        </div>
      </div>
      <!-- 所在地区 - 地区选择器 -->
      <van-cell v-model="carmodel" title="所在地区：" value="" is-link @click="isShowArea = true" />
      <!-- 详细地址 - 文本输入框 -->
      <div class="van-cell van-field">
        <div class="van-cell__title"><span>详细地址：</span></div>
        <div class="van-cell__value">
          <div class="van-field__body">
            <textarea v-model="addressExt" rows="1" placeholder="请输入详细地址" class="van-field__control"
              style="height: 24px;" maxlength="30" v-on:input="onChangeAddress"></textarea>
          </div>
        </div>
      </div>
    </van-cell-group>
    <!-- 设置默认地址 -->
    <van-cell-group>
      <van-cell title="设为默认地址：" class="default-add">
        <van-switch v-model="defaultAddChecked" />
      </van-cell>
    </van-cell-group>
    <div class="tips">
      <p>提示：请输入正确的姓名和地址，以保证您的快递正常送达。</p>
    </div>
    <div class="btn" @click="onSaveAddress">
      <button
        :class="isFinishAddress ? 'btn-public save' : 'btn-public save no'">{{$route.query.editFrom == 'order' ? '保存并使用' : '保存'}}</button>
    </div>
    <!-- 地区选择器 -->
    <van-popup v-model="isShowArea" position="bottom">
      <van-area ref="area" :value="areaValue" :area-list="areaList" :columns-placeholder="['请选择']" @change="onChange"
        @confirm="isShowArea = false" @cancel="isShowArea = false" />
    </van-popup>
  </div>
</template>

<script>
  import AreaList from '../assets/js/areaList'
  import RegionList from '../assets/js/regionList'
  import {
    GoodsUrl
  } from '../config/url'
  import Utils from '../server/utils'
  export default {
    name: '',
    data() {
      return {
        shopUserInfo: {
          "vipType": 0
        },
        defaultAddChecked: true,
        isShowArea: false,
        carmodel: "",
        areaList: AreaList,
        areaValue: '',
        rname: "",
        rmobile: "",
        addressExt: "",
        regionId: "",
        isFinishAddress: true
      }
    },
    mounted() {
      if (this.$route.query.editType == 1) {
        this.isFinishAddress = false
      }
      const shopUserInfo = this.$cookies.get("shopUserInfo")
      if (shopUserInfo) {
        this.shopUserInfo = shopUserInfo
      }
      // 如果传入了addressId
      if (this.$route.query.addressId) {
        this.getDataAddress()
      } else {
        const ipPositionCityAdCode = this.$cookies.get("ipPositionCityAdCode")
        this.areaValue = ipPositionCityAdCode
      }
    },
    methods: {
      // 如果是从列表进入，先查询当前用户地址信息
      getDataAddress() {
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
              res.data.data.forEach(item => {
                if (item.addressId == _this.$route.query.addressId) {
                  _this.rname = item.rname
                  _this.rmobile = item.rmobile
                  _this.addressExt = item.addressExt
                  _this.regionId = item.regionId
                  _this.defaultAddChecked = item.isDefault == 0 ? false : true
                  _this.getRegionName(item.regionId)
                  RegionList.data.forEach(region => {
                    if (region.regionId == item.regionId) {
                      _this.areaValue = region.regionCode
                    }
                  })
                }
              })
            }
          })
          .catch((error) => {
            window.console.log(error);
          })
      },
      // 获取区域名
      getRegionName(id) {
        RegionList.data.forEach(item => {
          if (item.regionId == id) {
            this.carmodel = item.regionName + ' ' + this.carmodel
            if (item.regionLevel != 1) {
              this.getRegionName(item.parentregionId)
            }
          }
        })
      },
      onChangeAddress() {
        const _this = this
        if (!_this.rname || !_this.rmobile || !_this.regionId || !_this.addressExt || (!
            /^1(1|2|3|4|5|6|7|8|9|0)\d{9}$/.test(_this.rmobile))) {
          _this.isFinishAddress = false
          return
        } else {
          _this.isFinishAddress = true
          return
        }
      },
      // 保存地址
      onSaveAddress() {
        const _this = this
        if (!_this.rname) {
          _this.$toast("请填写收件人！")
          return
        } else if (!_this.rmobile) {
          _this.$toast("请填写手机号码！")
          return
        } else if (!_this.regionId) {
          _this.$toast("请选择所在地区！")
          return
        } else if (!_this.addressExt) {
          _this.$toast("请填写详细地址！")
          return
        } else if (!/^1(1|2|3|4|5|6|7|8|9|0)\d{9}$/.test(_this.rmobile)) {
          _this.$toast("请正确填写手机号码！")
          return
        }
        _this.isFinishAddress = true
        const query = _this.$route.query
        const agentKey = _this.$cookies.get("shopAgentKey")
		let type = parseInt(query.editType);
		//1新增 2 修改（取消默认） 3删除 4设置默认地址 5 新增并设为默认地址 6 修改（设置默认地址） 
		if(query.editType == 1 && _this.defaultAddChecked){
			type = 5;
		}else if(query.editType == 2 && _this.defaultAddChecked){//编辑（2，6） 选中默认地址为6    否则为2
			type = 6;
		}
        const formData = {
          "agentKey": agentKey || "peanut_subway",
          "sign": "fdfc57a94fc480d3a872c9",
          "uid": _this.shopUserInfo.uid || "",
          "type": type,
          "rmobile": _this.rmobile,
          "rname": _this.rname,
          "regionId": (query.editType == 1 || query.editType == 2) ? _this.regionId : "",
          "addressExt": (query.editType == 1 || query.editType == 2) ? _this.addressExt : "",
          "addressId": query.addressId || "",
        }
		window.console.log(formData)
        _this.$axios.post(GoodsUrl.addressModify, formData)
          .then((res) => {
            window.console.log(res);
            if (res.data.resultCode == 0) {
              _this.$toast("保存成功")
              if (_this.$route.query.editFrom == 'order') {
                setTimeout(() => {
                  _this.$router.go(-1)
                }, 1000);
              } else {
                setTimeout(() => {
                  _this.$router.go(-1)
                }, 1000);
              }
            } else {
              _this.$toast(res.data.resultMsg)
            }
          })
          .catch((error) => {
            window.console.log(error);
          })

      },
      onChange(picker, value) {
        let areaName = ''
        let areaCode = ''
        for (var i = 0; i < value.length; i++) {
          areaName = areaName + value[i].name + ' '
          areaCode = value[i].code
        }
        this.carmodel = areaName
        RegionList.data.forEach(item => {
          if (item.regionCode == areaCode) {
            this.regionId = item.regionId
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .area {
    margin-right: 0.2rem;
    font-size: 0.32rem;
    font-weight: 500;
    color: #333;
  }

  .van-cell-group {
    margin-top: 0.2rem;
  }

  .van-cell {
    padding: 0.3rem;
    font-size: 0.32rem;
  }

  .van-cell__title {
    font-size: 0.32rem;
    color: #000;
    flex: none;
    width: 90px;
  }

  .van-cell__value {
    font-size: 0.28rem;
  }

  .van-field__control {
    color: #333;
  }

  .van-switch {
    background: #f0f0f0;
    font-size: 0.5rem;
  }

  .van-switch--on {
    background: linear-gradient(270deg,
        rgba(255, 86, 86, 1) 0%,
        rgba(249, 46, 46, 1) 100%);
  }

  .tips {
    padding: 0.2rem 0.3rem;
    font-size: 0.28rem;
    font-weight: 500;
    color: #999;
  }

  .save {
    display: block;
    margin: 1.2rem auto;
    width: 5.8rem;
    height: 0.88rem;
    border-radius: 0.44rem;
  }

  .save.no {
    background: linear-gradient(90deg,
        rgba(191, 191, 191, 1) 0%,
        rgba(211, 209, 209, 1) 100%);
  }

  .default-add {
    .van-cell__title {
      width: 4rem;
    }
  }
</style>
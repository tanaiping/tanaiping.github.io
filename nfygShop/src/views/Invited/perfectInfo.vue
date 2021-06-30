<template>
	<div class="address-edit bg-public">
		<img :src="require('@/assets/card_img.png')" alt="">
		<div class="box-wrap">
			<div class="t1">剩余尊享名额<span>5%</span></div>
			<div class="t2">95%</div>
		</div>
		<div class="percent"><span></span></div>
		<div class="your-mobile">
			<div class="t1">您要开卡的手机账号</div>
			<div class="t2">{{mobile}}</div>
		</div>
		<div class="fix-tips">本产品一经购买，不支持退换。<br />支付后，花花卡激活码将以短信发送至您尾号{{lastMobile}}手机上</div>
		<!-- <van-cell-group>
			<div class="van-cell van-field">
				<div class="van-cell__title">
					<span>姓名：</span>
				</div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<input type="text" placeholder="真实姓名" class="van-field__control" v-model="userName"
							maxlength="30" />
					</div>
				</div>
			</div>
			<div class="van-cell van-field">
				<div class="van-cell__title"><span>手机号码：</span></div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<span class="area">+86</span><input type="number" placeholder="手机号码"
							oninput="if(value.length>11)value=value.slice(0,11)" v-model="mobile"
							class="van-field__control">
					</div>
				</div>
			</div>
			<van-cell v-model="carmodel" title="收货地址：" value="" is-link @click="isShowArea = true" />
			<div class="van-cell van-field mb130">
				<div class="van-cell__title"><span>详细地址：</span></div>
				<div class="van-cell__value">
					<div class="van-field__body">
						<textarea rows="1" placeholder="请输入详细地址" v-model="addressDetail" maxlength="30"
							class="van-field__control" style="height: 24px;"></textarea>
					</div>
				</div>
			</div>
		</van-cell-group>
		<van-popup v-model="isShowArea" position="bottom">
			<van-area ref="area" :value="areaValue" :area-list="areaList" :columns-placeholder="['请选择']"
				@change="onChange" @confirm="isShowArea = false" @cancel="isShowArea = false" />
		</van-popup> -->
		<div class="fix-bottom">
			<div class="fix-l">
				<div class="t1">电子花花卡：<em>12元</em></div>
			</div>
			<button class="btn-public submit-btn" @click="onSaveAddress">提交申请</button>
		</div>
	</div>
</template>

<script>
	import AreaList from '../../assets/js/areaList'
	import RegionList from '../../assets/js/regionList'
	import {
		UserUrl
	} from '../../config/url'

	export default {
		name: '',
		data() {
			return {
				userName: "",
				mobile: "",
				addressDetail: "",
				isShowArea: false,
				carmodel: "",
				areaList: AreaList,
				areaValue: '',
				mobile:'',
				lastMobile:''
			}
		},
		mounted() {
			const shopUserInfo = this.$cookies.get("shopUserInfo");
			// console.log(shopUserInfo)
			if (shopUserInfo) {
			  this.mobile = shopUserInfo.mobile;
			  this.lastMobile = shopUserInfo.mobile.substring(shopUserInfo.mobile.length-4);
			} else {
			  this.$toast("请先登录")
			  this.$router.push({
			    name: "login",
			    query: {
			      backType: "goback"
			    }
			  })
			}
			
		},
		methods: {
			onSaveAddress() {
				const _this = this
				// if (_this.userName == "") {
				// 	_this.$toast('请输入您的姓名');
				// 	return false;
				// } else {
				// 	let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
				// 	if (pattern.test(_this.userName)) {
				// 		_this.$toast('非法字符');
				// 		return false;
				// 	}
				// }
				// if (!/^1(1|2|3|4|5|6|7|8|9|0)\d{9}$/.test(_this.mobile)) {
				// 	_this.$toast('请正确填写手机号码')
				// 	return false;
				// }
				// if (_this.carmodel == "") {
				// 	_this.$toast('请输入收货地址');
				// 	return false;
				// }
				// if (_this.addressDetail == "") {
				// 	_this.$toast('请输入您的详细地址');
				// 	return false;
				// } else {
				// 	let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
				// 	if (pattern.test(_this.userName)) {
				// 		_this.$toast('非法字符');
				// 		return false;
				// 	}
				// }
				const shopUserInfo = _this.$cookies.get("shopUserInfo");
				const formData = {
					"address": _this.carmodel + " " + _this.addressDetail,
					"inviteUid": _this.$route.query.uid || "", //邀请人uid
					"mobile": _this.mobile,
					"name": _this.userName,
					"uid": shopUserInfo ? shopUserInfo.uid : "" //_this.uid '242366258138736640193622366'
				}
				_this.$axios.post(UserUrl.applyCardOrder, formData)
					.then((res) => {
						// window.console.log(res);
						if (res.data.resultCode == 0) {
							this.$router.push({
								name: "pay",
								query: {
									"address": res.data.data.address,
									"mobile": res.data.data.mobile,
									"name": res.data.data.name,
									"orderNo": res.data.data.orderNo,
									"postage": res.data.data.postage,
									"price": res.data.data.price
								},
							})
						} else {
							this.$toast(res.data.resultMsg);
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

	.van-field__control {
		font-size: 0.32rem;
		color: #333;
	}

	.van-switch {
		background: #F0F0F0;
		font-size: 0.5rem;
	}

	.van-switch--on {
		background: linear-gradient(270deg, rgba(255, 86, 86, 1) 0%, rgba(249, 46, 46, 1) 100%);
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
		background: linear-gradient(90deg, rgba(191, 191, 191, 1) 0%, rgba(211, 209, 209, 1) 100%);
	}

	body {
		background-color: #f8f8f8;
	}

	img {
		width: 100%;
	}

	.form-list {
		width: 6.3rem;
		height: 4.1rem;
		background-color: #FFF;
		padding: 0 .3rem;
		margin: 0 auto;
	}

	.form-list li {
		border-bottom: 1px solid #EEEEEE;
		display: flex;
		flex-direction: row;
		position: relative;
		width: 100%;
		height: .9rem;
		overflow: hidden;
		padding-top: .3rem;
	}

	.form-list li input {
		border: none;
		background-color: #FFF;
		line-height: .6rem;
		height: .6rem;
		font-size: .28rem;
		color: #aaa;
		width: 100%;
	}

	.form-list li label {
		line-height: .6rem;
		height: .6rem;
		font-size: .28rem;
		color: #aaa;
		width: 1.86rem;
		white-space: nowrap;
	}

	.fix-bottom {
		padding: .22rem .3rem;
		display: flex;
		justify-content: space-between;
		background-color: #FFF;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
	}

	.submit-btn {
		width: 3.28rem;
		height: .8rem;
		line-height: .8rem;
		border-radius: .4rem;
		text-align: center;
	}

	.fix-l .t1 {
		padding-top: .24rem;
		color: #333;
		font-size: .32rem;
		padding-left: .2rem;
		line-height: .4rem;
	}

	.fix-l .t1 span {
		text-decoration: line-through;
		padding-left: .08rem;
		color: #999;
		font-size: .24rem;
	}

	.fix-l .t1 em {
		color: #FF3B30;
	}

	.mb130 {
		margin-bottom: 1.3rem;
	}
	.box-wrap{
		display: flex;
		justify-content: space-between;
		width: 88%;
		margin:0 auto;
		font-size: .24rem;
		margin-bottom: .1rem;
	}
	.box-wrap .t1{
		color: #333;
	}
	.box-wrap .t1 span{
		padding-left: .2rem;
		color: #C8AB3A;
	}
	.box-wrap .t2{
		background: url(../../assets/icon11.png) no-repeat;
		background-size: contain;
		width: .39rem;
		height: .3rem;
		font-size: .16rem;
		line-height: .3rem;
		text-align: center;
		color: #FFF;
	}
	.percent{
		width: 92%;
		margin:0 auto;
		height: .16rem;
		background-color: #E5E5E5;
		border-radius: .08rem;
		overflow: hidden;
	}
	.percent span{
		width: 95%;
		height: .16rem;
		display: block;
		border-radius: .08rem;
		background:linear-gradient(to right,#F9E6B6,#F0C87F);
		background: -webkit-gradient(to right,#F9E6B6,#F0C87F);
		background: -webkit-linear-gradient(to right,#F9E6B6,#F0C87F);
		background: -o-linear-gradient(to right,#F9E6B6,#F0C87F);
		background: -ms-linear-gradient(to right,#F9E6B6,#F0C87F);
	}
	.your-mobile{
		margin-top:.7rem;
		background-color: #FFF;
	}
	.your-mobile .t1{
		font-size: .28rem;
		color: #666;
		padding:.3rem 0 .25rem 0;
		text-align: center;
	}
	.your-mobile .t2{
		font-size: .4rem;
		color: #333;
		padding-bottom:.3rem;
		text-align: center;
	}
	.fix-tips {
		justify-content: space-between;
		background-color: #FFF;
		position: fixed;
		left: 0;
		bottom: 1.3rem;
		width: 100%;
		text-align: center;
		color: #666;
		font-size: .26rem;
	}
</style>
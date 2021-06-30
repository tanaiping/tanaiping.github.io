<template>
	<div class="pay-success bg-public">
		<div v-if="wait">
			<div class="success">
				<img :src="require('@/assets/pay_wait.png')" alt="等待支付结果">
				<p>等待支付结果</p>
			</div>
		</div>
		<div v-else>
			<div class="success" v-if="!isSuccess">
				<img :src="require('@/assets/pay_paywaiting.png')" alt="支付失败">
				<p>支付失败</p>
			</div>
			<div class="success success-tips" v-if="isSuccess">
				<img :src="require('@/assets/pay_success.png')" alt="支付成功">
				<p>支付成功</p>
			</div>
		</div>
		<div class="pay-tips" v-if="isSuccess">请在<span>“花生特权”左上角“我的”-“我的订单”</span>查看订单状态哦~</div>
		<!-- 操作按钮 -->
		<div class="btn">
			<button class="btn-public see" v-if="isSuccess" @click="goOrderList($route.query.goodsType)">查看订单</button>
			<!-- <router-link v-if="isSuccess"
				:to="{name: 'myorderlist', query: {listType : $route.query.goodsType == 'GOODS' ? 1 : 2}}"><button
					class="btn-public see">查看订单</button></router-link> -->
			<router-link v-if="isSuccess" :to="{name: 'home'}"><button class="more">继续逛逛</button></router-link>
			<router-link v-if="!isSuccess" :to="{name: 'home'}"><button class="more">去首页逛逛</button></router-link>
		</div>
		<div class="ad">
			<img :src="require('@/assets/nfyg_690_210.png')" alt="花生地铁">
		</div>
	</div>
</template>

<script>
	import {
		UserUrl
	} from '../config/url'
	export default {
		name: '',
		data() {
			return {
				isSuccess: false,
				interval: '',
				wait: true,
				times: 0 //100  5分钟就不定时查订单
			}
		},
		mounted() {
			const _this = this;
			_this.interval = setInterval(function () {
				_this.updateOrderStatus();
			}, 3000)
		},
		methods: {
			//查询订单信息
			updateOrderStatus() {
				const _this = this
				const query = _this.$route.query
				const orderNo = query.orderNo;
				const goodsType = query.goodsType=='CHARGE'?'COUPON':query.goodsType;
				const shopUserInfo = _this.$cookies.get("shopUserInfo")
				const formData = {
					"goodsType": goodsType, //COUPON-卡券 RIGHT-权益 CARD-会员卡 GOODS-商品
					"orderNo": orderNo,
					"payType": 1,
					"uid": shopUserInfo.uid //  shopUserInfo.uid
				}
				_this.$axios.post(UserUrl.payCardQuery, formData)
					.then((res) => {
						// window.console.log(res);
						_this.times++;
						if (res.data.resultCode == 0) {
							_this.wait = false;
							if (res.data.data == 'success') {
								_this.isSuccess = true;
								clearInterval(_this.interval);
								if (query.goodsType == 'CARD') {
									_this.$router.push({
										name: 'cardsuccess',
										query: {
											orderNo: query.orderNo,
										}
									});
								}
							} else {
								_this.isSuccess = false;
								if (_this.times == 10) {
									clearInterval(_this.interval);
									if (query.goodsType == 'CARD') {
										_this.$router.push({
											name: 'cardsuccess',
											query: {
												orderNo: query.orderNo,
											}
										});
									}
								}
							}
						} else {
							_this.wait = true;
							_this.$toast(res.data.resultMsg);
						}
					})
					.catch((error) => {
						window.console.log(error);
					})
			},
			goOrderList(goodsType){
				const _this = this;
				let listType = 0;
				if(goodsType == 'GOODS'){
					listType =1
				}else if(goodsType == 'COUPON'){
					listType =2
				}else if(goodsType == 'CHARGE'){
					listType =3
				}else{
					listType =1
				}
				_this.$router.push({
					name: 'myorderlist',
					query: {
						listType: listType,
					}
				});
			}
		},
		beforeDestroy() {
			clearInterval(this.interval);
		}
	}
</script>

<style lang="less" scoped>
	.success {
		padding: 0.6rem 0;
		background: #fff;

		img {
			display: block;
			margin: auto;
			width: 1.3rem;
			height: 1.3rem;
		}

		p {
			font-size: 0.4rem;
			text-align: center;
			margin-top: 0.3rem;
		}
	}

	.success-tips {
		padding: 0.6rem 0 0.1rem;
	}

	.btn {
		button {
			display: block;
			margin: auto;
			margin-top: 0.3rem;
			width: 5.8rem;
			height: 0.88rem;
			border: none;
			border-radius: 0.44rem;
		}

		button.more {
			background: #fff;
			color: #ff5656;
			border: solid 1px #ff5656;
		}
	}

	.ad {
		width: 6.9rem;
		margin: auto;
		margin-top: 0.6rem;

		img {
			border-radius: 0.1rem;
		}
	}

	.pay-tips {
		padding: 0.12rem 0.92rem 0.5rem;
		font-size: 0.28rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666;
		background: #fff;
		text-align: center;

		span {
			color: #ff5656;
		}
	}
</style>
<template>
	<div class="pay-wrap">
		<div class="pay-txt">
			<div class="t1">恭喜名额已锁定成功！</div>
			<div class="t2">请尽快完成支付哦~</div>
		</div>
		<div class="line-box"></div>
		<div class="your-mobile">
			<div class="t1">您要开卡的手机账号</div>
			<div class="t2">{{mobile}}</div>
		</div>
		<div class="fix-tips">本产品一经购买，不支持退换。<br />支付后，花花卡激活码将以短信发送至您尾号{{lastMobile}}手机上</div>
		<!-- <div class="pay-address">
			<div class="name-tel"><span class="name">{{name}}</span><span class="tel">{{mobile}}</span></div>
			<div class="address">{{address}}</div>
		</div>
		<div class="pay-price">
			<div class="product-name">商品价格</div>
			<div class="product-p">￥{{price}}元</div>
		</div>
		<div class="pay-postage">
			<div>邮费</div>
			<div class="postage">￥{{postage}}元</div>
		</div> -->
		<div class="fix-bottom">
			<div class="fix-l">
				<!-- <div class="t1">邮费：<em>{{postage}}元</em></div>
				<div class="t2">花花卡：<em>{{price}}元</em></div> -->
				<div class="t1">电子花花卡：<em>{{price}}元</em></div>
			</div>
			<div class="btn-public submit-btn" @click="getOrder">确认支付</div>
		</div>
	</div>
</template>
<script>
	import {
		UserUrl
	} from '../../config/url'
	export default {
		name: "",
		data() {
			return {
				"name": "",
				"mobile": '',
				"address": "",
				"isShow": false, //为true 弹窗遮罩层显示
				"payLose": false, //为true 支付失败弹窗
				"paySuccess": false, //为true 支付成功弹窗
				"orderNo": "",
				"postage": "",
				"price": "",
				"mobile":'',
				"lastMobile":''
			};
		},
		mounted() {
			this.address = this.$route.query.address;
			this.mobile = this.$route.query.mobile;
			this.name = this.$route.query.name;
			this.orderNo = this.$route.query.orderNo;
			this.postage = this.$route.query.postage;
			this.price = this.$route.query.price;
			// this.getOrder(this.orderNo);
			const shopUserInfo = this.$cookies.get("shopUserInfo");
			// console.log(shopUserInfo)
			this.mobile = shopUserInfo.mobile;
			this.lastMobile = shopUserInfo.mobile.substring(shopUserInfo.mobile.length-4);
		},
		methods: {
			//查询订单信息
			getOrder() {
				const _this = this
				const shopUserInfo = _this.$cookies.get("shopUserInfo")
				const formData = {
					"goodsType": "CARD", //COUPON-卡券 RIGHT-权益 CARD-会员卡 GOODS-商品
					"orderNo": _this.orderNo,
					"payType": 1,
					"uid": shopUserInfo.uid //  shopUserInfo.uid
				}
				_this.$axios.post(UserUrl.payCard, formData)
					.then((res) => {
						// window.console.log(res);
						if (res.data.resultCode == 0) {
							window.location.href = res.data.data;
						} else {
							this.$toast(res.data.resultMsg);
						}
					})
					.catch((error) => {
						window.console.log(error);
					})
			},
			goLoad() {
				this.$router.push({
					name: "home",
				})
			}
		}
	}
</script>

<style scoped>
	body {
		background-color: #f8f8f8;
	}

	.tc {
		text-align: center;
	}

	.pay-txt {
		padding: .4rem 0;
		background-color: #FFF;
	}

	.pay-price,
	.pay-postage {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		line-height: .8rem;
		height: .8rem;
		color: #666;
		padding: 0 .3rem;
		background-color: #FFF;
	}

	.pay-txt .t1 {
		text-align: center;
		line-height: .36rem;
		height: .36rem;
		color: #333;
		font-size: .38rem;
	}

	.pay-txt .t2 {
		text-align: center;
		line-height: .26rem;
		color: #E73046;
		font-size: .26rem;
		padding-top: .26rem;
	}

	.line-box {
		background: url(../../assets/line.png) left top no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: .1rem;
		margin-bottom: .2rem;
	}

	.pay-address {
		padding: .2rem .3rem;
		margin-bottom: .2rem;
		background-color: #FFF;
	}

	.pay-address .name-tel {
		background: url(../../assets/address_ico.png) left top no-repeat;
		background-size: contain;
		padding-left: .54rem;
		font-size: .3rem;

	}

	.pay-address .name-tel span {
		padding-right: .3rem;
	}

	.pay-address .address {
		padding-top: .2rem;
		font-size: .28rem;
		color: #666;
		padding-left: .54rem;
		line-height: .44rem;
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
		padding-top: .26rem;
		color: #333;
		font-size: .32rem;
		line-height: .3rem;
	}

	.fix-l .t1 em {
		color: #FF3B30;
		font-size: .28rem;
	}

	.fix-l .t2 em {
		padding-left: .08rem;
	}

	.fix-l .t2 {
		text-decoration: line-through;
		color: #999;
		font-size: .24rem;
	}

	.flex-btnbox {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
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
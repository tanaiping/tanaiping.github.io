<template>
	<!-- 我的卡券订单详情页 -->
	<!-- 通过路径参数detailType区分 -->
	<!-- detailType == 'coupon' 是卡券订单详情  /v1/coupon/order/detail -->
	<!-- detailType == 'right' 是权益订单详情   /v1/right/order/detail -->
	<div class="detail-right bg-public">
		<van-pull-refresh v-model="isLoading" success-text="刷新成功" class="bg-public" @refresh="onRefresh">
			<!-- 卡券状态 -->
			<van-cell-group class="group-public state" :border='false'>
				<div>
					<h5 class="name">{{stateName[detailData.status]}}</h5>
					<p class="desc">{{stateDesc[detailData.status]}}</p>
				</div>
			</van-cell-group>
			<!-- 卡券基础信息 -->
			<van-cell-group class="group-public goods-cell" :border='false'>
				<img class="img" :src="detailData.logo || require('@/assets/nfyg_180_180.png')" @click="buyAgain"
					alt="花生地铁">
				<div class="info" @click="buyAgain">
					<div class="row">
						<p class="name">{{detailData.rightName}}</p>
					</div>
					<div class="row">
						<p class="desc">有效期：{{detailData.expirationTime}} 前有效</p>
					</div>
				</div>
			</van-cell-group>
			<!-- 使用凭据 -->
			<van-cell-group class="group-public code" :border='false' v-show="detailData.cardType != null">
				<h5 class="remark-title">我的兑换券</h5>
				<p class="code-tips" @click="getDataRightDetail">若加载异常，点击这里刷新<img class="refresh"
						:src="require('@/assets/icon_refresh.png')" alt="">
				</p>
				<div class="code-bg type-1" v-if="detailData.cardType == 0">
					<p class="code-col">兑换码：
						<span class="type-code limit">{{detailData.cardNumber}}</span>
						<span class="type-copy" id="type-copy-0" :data-clipboard-text="detailData.cardNumber"
							@click="copyCode0">复制</span>
					</p>
				</div>
				<div class="code-bg type-0" v-if="detailData.cardType == 1">
					<p class="code-col">卡号：
						<span class="type-code limit">{{detailData.cardNumber}}</span>
						<span class="type-copy" id="type-copy-1num" :data-clipboard-text="detailData.cardNumber"
							@click="copyCode1Num">复制</span></p>
					<p class="code-col">密码：
						<span class="type-code limit">{{detailData.cardPassword}}</span>
						<span class="type-copy" id="type-copy-1pas" :data-clipboard-text="detailData.cardPassword"
							@click="copyCode1Pas">复制</span>
					</p>
				</div>
				<div class="code-bg type-2" v-if="detailData.cardType == 2">
					<img class="type-2-img" :src="detailData.cardQr || require('@/assets/nfyg_180_180.png')" alt="">
					<!-- <p class="type-state">已使用</p> -->
				</div>
			</van-cell-group>
			<!-- 提示说明 -->
			<van-cell-group class="group-public remark" :border='false'>
				<h5 class="remark-title">温馨提示</h5>
				<div class="row" v-show="detailData.remark">
					<h5 class="title">使用说明</h5>
					<p class="desc" v-html="detailData.remark"></p>
				</div>
				<div class="row" v-show="detailData.shop">
					<h5 class="title">适用门店</h5>
					<p class="desc" v-html="detailData.shop"></p>
				</div>
				<div class="row" v-show="detailData.deadline">
					<h5 class="title">有效期</h5>
					<p class="desc">{{detailData.deadline}}</p>
				</div>
				<div class="row" v-show="detailData.phone">
					<h5 class="title">商家电话</h5>
					<a :href="'tel:' + detailData.phone">
						<p class="desc">{{detailData.phone}}</p>
					</a>
				</div>
			</van-cell-group>
			<!-- 订单情况明细 -->
			<van-cell-group class="group-public order last" :border='false'>
				<van-cell class="order-info" :border='false'>
					<p class="key">订单编号：</p>
					<p class="value" :style="{display: 'flex',flexFlow: 'wrap'}">{{$route.query.orderCode}}<span
							class="copy" id="code-copy" :data-clipboard-text="$route.query.orderCode"
							@click="copyOrderCode">复制</span></p>
				</van-cell>
				<van-cell class="order-info" :border='false'>
					<p class="key">下单时间：</p>
					<p class="value">{{detailData.orderTime}}</p>
				</van-cell>
				<van-cell class="order-info">
					<p class="key">支付方式：</p>
					<p class="value">{{detailData.payType == 1 ? "支付宝" : "微信"}}</p>
				</van-cell>
				<van-cell class="order-value" :border='false' title="商品金额"
					:value="detailData.price != null?'￥' + regFenToYuan(detailData.price) : '￥--'" />
				<van-cell class="order-value" title="花粉专享折扣"
					:value="detailData.price !=null?'-￥' + regFenToYuan(detailData.price - detailData.pay) : '￥--'" />
				<van-cell class="order-value price" :border='false' title="实付款"
					:value="detailData.pay !=null?'￥'+ regFenToYuan(detailData.pay) : '￥--'" />
			</van-cell-group>
			<!-- 底部操作按钮 -->
			<div class="foot">
				<div class="call" @click="onlineService"><span class="icon-call"></span><br />联系客服</div>
				<button class="btn-public-2 del" @click="isDelPopup = true">删除订单</button>
				<button class="btn-public-2 again" @click="buyAgain">再次购买</button>
				<button class="btn-public-2 again" v-show="detailData.status == 0" @click="payOrderAgain">去支付
					￥{{regFenToYuan(detailData.pay) || '--'}}</button>
			</div>
		</van-pull-refresh>
		<!-- 是否删除弹窗 -->
		<van-popup v-model="isDelPopup" position="bottom" class="popup-del">
			<p class="title">是否删除该订单？</p>
			<button class="btn-public-2 btn del" @click="delThisOrder">删除</button>
			<button class="btn-public-2 btn cancel" @click="isDelPopup = false">取消</button>
		</van-popup>
	</div>
</template>

<script>
	const _czc = window._czc || []
	import '../../assets/css/goods.less'
	import './orderDetail.less'

	import {
		RightUrl
	} from '../../config/url'
	import Clipboard from 'clipboard'

	export default {
		name: '',
		data() {
			return {
				shopUserInfo: {
					"vipType": 0
				},
				stateName: ["待支付", "已支付", "2", "3", "已取消", "等待下单", "下单成功", "下单失败", "已删除"],
				stateDesc: ["我在静静地等待~", "感谢您的支持~", "", "", "已取消", "等待下单", "下单成功", "下单失败", "已删除"],
				detailData: {},
				isDelPopup: false,
				isLoading: false
			}
		},
		mounted() {
			const shopUserInfo = this.$cookies.get("shopUserInfo")
			if (shopUserInfo) {
				this.shopUserInfo = shopUserInfo
			}
			this.getDataRightDetail()
			_czc.push(['_trackEvent', 'apporder_14', '曝光', '订单详情页-权益{orderNo:' + this.$route.query.orderNo + '}']);
		},
		watch: {
			$route: function (newVal, oldVal) {
				if (newVal != oldVal) {
					this.getDataRightDetail(); //重新调用加载函数
				}
			}
		},
		methods: {
			// 下拉刷新
			onRefresh() {
				this.getDataRightDetail()
				setTimeout(() => {
					this.isLoading = false;
				}, 500);
			},
			// 获取初始化数据-权益
			getDataRightDetail() {
				const _this = this
				const agentKey = _this.$cookies.get("shopAgentKey")
				const formData = {
					"agentKey": agentKey || "peanut_subway",
					"sign": "fdfc57a94fc480d3a872c9",
					"orderCode": _this.$route.query.orderCode,
					"uid": _this.shopUserInfo.uid || ""
				}
				_this.$axios.post(RightUrl.rightOrderDetail, formData)
					.then((res) => {
						// window.console.log(res);
						if (res.data.resultCode == 0) {
							_this.detailData = res.data.data
						} else {
							_this.$toast(res.data.resultMsg)
						}
					})
					.catch((error) => {
						window.console.log(error);
					})
			},
			// 确定删除订单
			delThisOrder() {
				const _this = this
				const agentKey = _this.$cookies.get("shopAgentKey")
				const formData = {
					"agentKey": agentKey || "peanut_subway",
					"sign": "fdfc57a94fc480d3a872c9",
					"orderCode": _this.$route.query.orderCode
				}
				_this.$axios.post(RightUrl.rightOrderDelete, formData)
					.then((res) => {
						// window.console.log(res)
						if (res.data.resultCode == 0) {
							_this.$toast("删除成功")
							setTimeout(() => {
								_this.$router.go(-1)
							}, 1000);
						} else {
							_this.$toast(res.data.resultMsg)
						}
					})
					.catch((error) => {
						window.console.log(error);
					})
			},
			// 去支付
			payOrderAgain() {
				_czc.push(['_trackEvent', 'apporder_15', '点击', '订单详情页-权益-去支付{orderNo:' + this.detailData.orderNo +
					',rightId:' +
					this.detailData.id + ',rightName:' + this.detailData.rightName + '}'
				]);
				if (this.detailData.mwebUrl && this.detailData.overSeconds > 5) {
					window.location.href = this.detailData.mwebUrl
				} else {
					this.$toast("支付倒计时小于5秒,建议重新下单")
				}
			},
			// 再次购买
			buyAgain() {
				_czc.push(['_trackEvent', 'apporder_17', '点击', '订单详情页-权益-再次购买{rightId:' + this.detailData.id +
					',rightName:' + this
					.detailData.rightName + '}'
				]);
				this.$router.push({
					name: "detailright",
					query: {
						isAgain: 1,
						detailType: "right",
						rightId: this.detailData.id,
						activeId: this.detailData.activeId,
						entryType: this.detailData.entryType
					}
				})
			},
			// 复制券码
			copyCode0: function () {
				let clipboard = new Clipboard('#type-copy-0');
				clipboard.on('success', () => {
					this.$toast("复制成功")
					// 释放内存
					clipboard.destroy()
				})
				clipboard.on('error', () => {
					this.$toast("该浏览器不支持自动复制")
					// 不支持复制
					// 释放内存
					clipboard.destroy()
				})
			},
			// 复制券码
			copyCode1Num: function () {
				let clipboard = new Clipboard('#type-copy-1num');
				clipboard.on('success', () => {
					this.$toast("复制成功")
					// 释放内存
					clipboard.destroy()
				})
				clipboard.on('error', () => {
					this.$toast("该浏览器不支持自动复制")
					// 不支持复制
					// 释放内存
					clipboard.destroy()
				})
			},
			// 复制券码
			copyCode1Pas: function () {
				let clipboard = new Clipboard('#type-copy-1pas');
				clipboard.on('success', () => {
					this.$toast("复制成功")
					// 释放内存
					clipboard.destroy()
				})
				clipboard.on('error', () => {
					this.$toast("该浏览器不支持自动复制")
					// 不支持复制
					// 释放内存
					clipboard.destroy()
				})
			},
			// 复制订单编号
			copyOrderCode() {
				let clipboard = new Clipboard('#code-copy');
				clipboard.on('success', () => {
					this.$toast("复制成功")
					// 释放内存
					clipboard.destroy()
				})
				clipboard.on('error', () => {
					this.$toast("该浏览器不支持自动复制")
					// 不支持复制
					// 释放内存
					clipboard.destroy()
				})
			},
		}
	}
</script>


<style lang="less" scoped>
	.goods-cell {
		background: #fff;
	}
</style>
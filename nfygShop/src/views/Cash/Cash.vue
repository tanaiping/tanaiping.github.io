<template>
    <div class="Cash bg-public">
        <van-cell-group class="group head" :border='false'>
            <p class="desc">当前可提现金额(元）</p>
            <h5 class="value">{{cashData.amount || 0}}</h5>
        </van-cell-group>
        <van-cell-group class="group amount" :border='false'>
            <p class="desc">提现金额</p>
            <div class="value">￥<input class="money" type="number" v-model="iamount" @input="onChangeInputAmount"
                    :placeholder="cashData.amount || 0" />
            </div>
            <div class="remark">
                <p class="left" @click="onClickCashAll">全部提现</p>
                <p class="right" v-if="isAmountAllow">余额小于10元不能提现哦~</p>
            </div>
        </van-cell-group>
        <van-cell-group class="group way" :border='false'>
            <p class="desc">提现方式</p>
            <div class="wechat">
                <img :src="require('@/assets/icon_wechat.png')" alt="花生地铁">
                <p>微信</p>
                <button :class="cashData.wxBandStatus ? 'btn-public-2 band' : 'btn-public-2 band no'"
                    @click="onClickToBindWechat">{{cashData.wxBandStatus ? "已绑定" : "立即绑定"}}</button>
            </div>
        </van-cell-group>
        <p v-if="cashData.wxBandStatus == 0 && !isWeixin" class="tips"><span
                class="authentication">你还没有绑定微信<br>请前往【花生特权】公众号进行绑定！</span></p>
        <p v-if="cashData.wxBandStatus == 1 && cashData.cardStatus == 0" class="tips">申请提现需要先
            <span class="authentication" @click="onClickToCashBind">进行身份验证</span>
        </p>
        <div class="foot">
            <button class="btn-public left" @click="onClickToInvitation">邀请好友办卡赚钱</button>
            <button :class="isBind ? 'btn-public right' : 'btn-public right no'" @click="onClickToCash">提现</button>
        </div>

    </div>
</template>

<script>
    const _czc = window._czc || []
    import {
        UserUrl
    } from '../../config/url'
    import {
        browser
    } from '../../server/nfygCommon'
    export default {
        name: '',
        data() {
            return {
                shopUserInfo: "",
                cashData: {},
                iamount: "",
                isBind: false,
                isAmountAllow: false,
                isWeixin: false
            }
        },
        mounted() {
            const shopUserInfo = this.$cookies.get("shopUserInfo")
            this.shopUserInfo = shopUserInfo
            this.isWeixin = browser.weixin
            if (this.shopUserInfo) {
                this.getDataCashPage()
                if (this.$route.query.code) {
                    this.weChatBind()
                }
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
            // 获取基础数据
            getDataCashPage() {
                const _this = this
                const formData = {
                    "uid": _this.shopUserInfo.uid || ""
                }
                _this.$axios.post(UserUrl.cashPage, formData)
                    .then((res) => {
                        // window.console.log(res);
                        if (res.data.resultCode == 0) {
                            _this.cashData = res.data.data
                        } else {
                            _this.$toast(res.data.resultMsg)
                        }
                    })
                    .catch((error) => {
                        window.console.log(error);
                    })
            },
            // 点击提现按钮
            onClickToCash() {
                const _this = this
                if (_this.cashData.wxBandStatus == 0) {
                    if (!browser.weixin) {
                        _this.$toast("你还没有绑定微信，请前往【花生特权】公众号进行绑定!")
                    } else {
                        _this.$toast("你还没有绑定微信，请先进行绑定!")
                    }
                    return
                } else if (!_this.iamount) {
                    _this.$toast("请填写提现金额!")
                    return
                } else if (_this.iamount < 10) {
                    _this.$toast("余额小于10元不能提现!")
                    return
                } else if (_this.iamount > _this.cashData.amount) {
                    _this.$toast("您当前可提现金额不足" + _this.iamount + "元!")
                    return
                } else if (!_this.isBind) {
                    return
                }
                const formData = {
                    "uid": _this.shopUserInfo.uid || "",
                    "amount": _this.iamount * 100
                }
                _this.$axios.post(UserUrl.balanceCash, formData)
                    .then((res) => {
                        // window.console.log(res);
                        if (res.data.resultCode == 0) {
                            _czc.push(['_trackEvent', 'appencourage_38', '点击', '提现页-提现提交成功']);
                            this.$router.push({
                                name: "cashsuccess"
                            })
                        } else {
                            _this.$toast(res.data.resultMsg)
                        }
                    })
                    .catch((error) => {
                        window.console.log(error);
                    })
            },
            // 全部提现
            onClickCashAll() {
                this.iamount = this.cashData.amount
                this.onChangeInputAmount()
            },
            // 输入提现金额修改页面状态
            onChangeInputAmount() {
                _czc.push(['_trackEvent', 'appencourage_35', '点击', '提现页-填写金额{number:' + this.iamount + '}']);
                if (this.iamount < 10) {
                    this.isAmountAllow = true
                    this.isBind = false
                } else {
                    this.isAmountAllow = false
                    if (this.cashData.cardStatus == 1 && this.cashData.wxBandStatus == 1) {
                        this.isBind = true
                    }
                }
            },
            // 去绑定微信
            onClickToBindWechat() {
                if (this.cashData.wxBandStatus == 1) {
                    this.$toast("您已绑定微信!")
                    return
                }
                if (!browser.weixin) {
                    this.$toast("初次提现需要到【花生特权】公众号进行绑定微信!")
                    return
                } else {
                    _czc.push(['_trackEvent', 'appencourage_36', '点击', '提现页-去绑定微信']);
                    const APPID = "wx64629f5ebd79d007"
                    const REDIRECT_URI = "http://cmsfile.wifi8.com/uploads/wifi/AppH5/nfygShop/cash"
                    const SCOPE = "snsapi_userinfo"
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID +
                        "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=" + SCOPE +
                        "&state=STATE#wechat_redirect"
                }
            },
            // 获取微信授权的code，进行微信绑定
            weChatBind() {
                const _this = this
                const formData = {
                    "uid": _this.shopUserInfo.uid || "",
                    "code": _this.$route.query.code
                }
                _this.$axios.post(UserUrl.weChatBind, formData)
                    .then((res) => {
                        // window.console.log(res);
                        if (res.data.resultCode == 0) {
                            _this.$toast("绑定成功!")
                            _czc.push(['_trackEvent', 'appencourage_36', '点击', '提现页-绑定微信成功']);
                            _this.getDataCashPage()
                        } else {
                            _this.$toast(res.data.resultMsg)
                        }
                    })
                    .catch((error) => {
                        window.console.log(error);
                    })
            },
            // 邀请好友赚钱
            onClickToInvitation() {
                _czc.push(['_trackEvent', 'appencourage_39', '点击', '提现页-邀请好友办卡']);
                this.$router.push({
                    name: "invitation"
                })
            },
            // 去进行身份验证
            onClickToCashBind() {
                _czc.push(['_trackEvent', 'appencourage_37', '点击', '提现页-去进行身份验证']);
                this.$router.push({
                    name: "cashbind"
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .Cash {
        .group {
            margin: auto;
            margin-top: 0.2rem;
            padding: 0.3rem;
            width: 6.9rem;
            min-height: 2.1rem;
            background: #fff;
            border-radius: 0.1rem;
        }

        .head {
            text-align: center;
            color: #fff;
            background: linear-gradient(274deg, rgba(252, 25, 0, 1) 0%, rgba(254, 127, 2, 1) 100%, rgba(254, 127, 2, 1) 100%);

            .desc {
                margin-top: 0.1rem;
                font-size: 0.28rem;
                font-weight: bold;
            }

            .value {
                font-size: 0.56rem;
            }

        }

        .amount {
            .desc {
                font-size: 0.34rem;
                font-weight: 500;
            }

            .value {
                margin-top: 0.3rem;
                display: flex;
                font-size: 0.54rem;
                font-weight: bold;
                border-bottom: solid 1px #EEE;

                .money {
                    width: 100%;
                    border: none;
                    padding: 0 0.15rem;
                }
            }

            .remark {
                margin-top: 0.2rem;
                display: flex;
                font-size: 0.28rem;

                .left {
                    color: #666;
                }

                .right {
                    flex: 1;
                    margin-right: 0;
                    text-align: right;
                    color: #FF5656;
                }
            }
        }

        .way {
            .desc {
                font-size: 0.34rem;
                font-weight: 500;
            }

            .wechat {
                margin-top: 0.3rem;
                display: flex;

                img {
                    width: 0.8rem;
                    height: 0.8rem;
                }

                p {
                    margin: auto;
                    margin-left: 0.2rem;
                }

                .band {
                    margin: auto;
                    margin-right: 0;
                    width: 1.6rem;
                    height: 0.52rem;
                    border-color: #CACACA;
                    color: #CACACA;
                }

                .band.no {
                    border-color: #FF5656;
                    color: #FF5656;
                }

            }
        }

        .tips {
            margin-top: 0.2rem;
            font-size: 0.28rem;
            text-align: center;

            .authentication {
                color: #FF5656;
            }
        }

        .foot {
            display: flex;
            position: fixed;
            width: 100%;
            bottom: 0;

            .left {
                flex: 1;
                height: 0.88rem;
                text-align: center;
                line-height: 0.88rem;
                background: #fff;
                color: #FF5656;
            }

            .right {
                flex: 1;
                height: 0.88rem;
            }

            .right.no {
                background: #ccc;
            }
        }
    }
</style>
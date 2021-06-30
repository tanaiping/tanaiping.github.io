<template>
    <div class="Cash-bind bg-public">
        <div class="step">
            <p class="desc">1.绑定微信</p>
            <div class="line wechat">
                <img :src="require('@/assets/icon_wechat.png')" alt="花生地铁">
                <p>微信</p>
                <button :class="cashData.wxBandStatus ? 'btn-public-2 band' : 'btn-public-2 band no'"
                    @click="onClickToBindWechat">{{cashData.wxBandStatus ? "已绑定" : "立即绑定"}}</button>
            </div>
        </div>
        <div class="step">
            <p class="desc">2.上传身份证信息</p>
            <div class="line bind">
                <input class="name" type="text" v-model="iname" v-on:input="onChangeCardInfo" placeholder="请填写姓名" />
                <input class="card" type="number" v-model="icard" v-on:input="onChangeCardInfo" placeholder="请填写身份证号" />
            </div>
        </div>
        <p class="tips">为保证提现成功，请填写真实有效身份信息，花生承诺保证您的信息安全 </p>
        <button :class="isFinishCardInfo ? 'btn-public btn-submit' : 'btn-public btn-submit no'"
            @click="onClickToCardAuth">提交</button>
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
                iname: "",
                icard: "",
                isFinishCardInfo: false
            }
        },
        mounted() {
            const shopUserInfo = this.$cookies.get("shopUserInfo")
            this.shopUserInfo = shopUserInfo
            this.getDataCashPage()
        },
        methods: {
            getDataCashPage() {
                const _this = this
                const formData = {
                    "uid": _this.shopUserInfo.uid
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
            // 提交身份验证
            onClickToCardAuth() {
                const _this = this
                if (!_this.iname) {
                    _this.$toast("请填写姓名！")
                    return
                } else if (!_this.icard) {
                    _this.$toast("请填写身份证号！")
                    return
                } else if (_this.icard.length < 18 || _this.icard.length > 18) {
                    _this.$toast("请正确填写身份证号！")
                    return
                }
                const formData = {
                    "uid": _this.shopUserInfo.uid,
                    "card": _this.icard,
                    "name": _this.iname
                }
                _this.$axios.post(UserUrl.cardAuth, formData)
                    .then((res) => {
                        // window.console.log(res);
                        if (res.data.resultCode == 0) {
                            _this.$toast("身份验证成功!")
                            _czc.push(['_trackEvent', 'appencourage_37', '点击', '提现页-身份验证成功']);
                            _this.$router.go(-1);
                        } else {
                            _this.$toast(res.data.resultMsg)
                        }
                    })
                    .catch((error) => {
                        window.console.log(error);
                    })
            },
            onChangeCardInfo() {
                const _this = this
                if (!_this.iname || !_this.icard || _this.icard.length < 18 || _this.icard.length > 18) {
                    _this.isFinishCardInfo = false
                    return
                } else {
                    _this.isFinishCardInfo = true
                    return
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .step {
        margin: 0.2rem 0.3rem;

        .desc {
            font-size: 0.28rem;
            color: #999;
        }

        .line {
            margin-top: 0.2rem;
            padding: 0.2rem 0.3rem;
            background: #fff;
            border-radius: 0.1rem;
        }

        .bind {
            input {
                width: 100%;
                border: none;
                padding: 0.15rem 0;
            }

            .name {
                border-bottom: solid 1px #F8F8F8;
            }
        }
    }

    .tips {
        font-size: 0.24rem;
        color: #999;
        padding: 0 0.3rem;
    }

    .btn-submit {
        margin: auto;
        margin-top: 0.5rem;
        width: 5.8rem;
        height: 0.88rem;
        border-radius: 0.44rem;
        background: linear-gradient(90deg, rgba(249, 46, 46, 1) 0%, rgba(255, 86, 86, 1) 100%);
    }

    .btn-submit.no {
        background: #CCC;
    }

    .wechat {
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
</style>
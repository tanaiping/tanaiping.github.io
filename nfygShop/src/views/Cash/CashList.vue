<template>
    <div class="Cash-list bg-public">
        <van-cell-group class="" :border='false'>
            <!-- 初始化获取数据，加载中... -->
            <!-- <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '1.5rem'}" vertical>加载中...
            </van-loading> -->
            <van-cell v-for="(item, i) in CashList" :key="i" :title="cashStatus[item.status - 1]"
                :label="item.createTime" :value="(item.amount || '--') + '元'" />
        </van-cell-group>
        <NfygEmpth v-if="isNfygEmpth" type="save" text="你还没有提现明细哦~" />
        <div :class="'foot ' + (isNfygEmpth ? 'empty' : '')">
            <button class="btn-public btn-invitation" @click="onClickToInvitation">邀请好友办卡赚钱</button>
        </div>
    </div>
</template>

<script>
    const _czc = window._czc || []
    import NfygEmpth from '../../components/NfygEmpty';
    import {
        UserUrl
    } from '../../config/url'
    export default {
        name: '',
        data() {
            return {
                CashList: [],
                cashStatus: ["提交申请", "申请成功", "申请失败", "发放成功", "发放失败"],
                isNfygEmpth: true
            }
        },
        mounted() {
            const shopUserInfo = this.$cookies.get("shopUserInfo")
            this.shopUserInfo = shopUserInfo
            this.getDataCashList()
        },
        methods: {
            getDataCashList() {
                const _this = this
                const formData = {
                    "uid": _this.shopUserInfo.uid
                }
                _this.$axios.post(UserUrl.cashDetail, formData)
                    .then((res) => {
                        // window.console.log(res);
                        if (res.data.resultCode == 0) {
                            _this.CashList = res.data.data
                            if (_this.CashList.length > 0) {
                                _this.isNfygEmpth = false
                            } else {
                                _this.isNfygEmpth = true
                            }
                        }
                    })
                    .catch((error) => {
                        window.console.log(error);
                    })
            },
            // 邀请好友赚钱
            onClickToInvitation() {
                _czc.push(['_trackEvent', 'appencourage_40', '点击', '提现明细页-邀请好友办卡']);
                this.$router.push({
                    name: "invitation"
                })
            }
        },
        components: {
            NfygEmpth
        }
    }
</script>

<style lang="less" scoped>
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

    .btn-invitation {
        margin: auto;
        width: 5.8rem;
        height: 0.88rem;
        border-radius: 0.44rem;
    }
</style>
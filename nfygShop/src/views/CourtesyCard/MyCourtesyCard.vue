<template>
    <div class="my-courtesy-card bg-public">
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="isLoading" success-text="刷新成功" class="bg-public" @refresh="onRefresh">
            <van-tabs v-model="cardTab" sticky animated swipeable @click="onChangeTabCard" @change="onChangeTabCard"
                class="card-header" color="#FF5656" title-active-color="#FF5656">
                <van-tab v-for="(item, i) in tabsName" :title="tabsName[i]" :key="i" class="card-contain">
                    <!-- 初始化获取数据，加载中... -->
                    <van-loading v-if="isFirstLoading" size="24px" type="spinner" :style="{marginTop: '2.25rem'}"
                        vertical>
                        加载中...
                    </van-loading>
                    <!-- 优惠券列表 -->
                    <div class="courtesy-card-list">
                        <div class="line">
                            <div class="circular-1"></div>
                            <div class="circular-2"></div>
                            <div class="left">
                                <h5 class="value">10<span>元</span></h5>
                                <!-- <p class="tips">满100元可用</p> -->
                            </div>
                            <div class="center">
                                <h5 class="name">10元立减券</h5>
                                <p class="desc">全品类（除权益和卡券）</p>
                                <p class="time">有效期至：<span>yyyy-mm-dd</span></p>
                            </div>
                            <button class="btn-public right">去使用</button>
                        </div>
                        <div class="line">
                            <div class="circular-1"></div>
                            <div class="circular-2"></div>
                            <div class="left">
                                <h5 class="value">10<span>元</span></h5>
                                <p class="tips">满100元可用</p>
                            </div>
                            <div class="center">
                                <h5 class="name">10元立减券10元立减券10元立减券</h5>
                                <p class="desc">全品类除权益和卡券全品类和卡券全品类除权益和卡券</p>
                                <p class="time">有效期至：<span>yyyy-mm-dd</span></p>
                            </div>
                            <button class="btn-public right">去使用</button>
                        </div>
                        <div class="line">
                            <div class="circular-1"></div>
                            <div class="circular-2"></div>
                            <div class="left">
                                <h5 class="value">10<span>元</span></h5>
                                <p class="tips">满100元可用</p>
                            </div>
                            <div class="center">
                                <h5 class="name">10元立减券</h5>
                                <p class="desc">全品类（除权益和卡券）全品类（除权益和卡券）全品类（除权益和卡券）</p>
                                <p class="time">有效期至：<span>yyyy-mm-dd</span></p>
                            </div>
                            <button class="btn-public right">去使用</button>
                        </div>
                    </div>
                    <!-- 空数据状态 -->
                    <NfygEmpth v-if="isNfygEmpth" type="courtesycard" text="暂无此类型优惠券哦~" />
                </van-tab>
            </van-tabs>
        </van-pull-refresh>
    </div>
</template>

<script>
    import NfygEmpth from '../../components/NfygEmpty'
    export default {
        name: '',
        data() {
            return {
                shopUserInfo: {
                    "vipType": 0
                },
                isLoading: false,
                isFirstLoading: true,
                isNfygEmpth: false,
                cardTab: 0,
                tabsName: ["未使用", "已使用", "已过期"],
            }
        },
        mounted() {
            this.getDataCardList()
        },
        methods: {
            // 下拉刷新
            onRefresh() {
                this.getDataCardList()
                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            },
            // 获取我的优惠券列表数据
            getDataCardList() {
                const _this = this
                _this.isFirstLoading = false
            },
            // 切换优惠券使用状态tab
            onChangeTabCard() {

            }
        },
        components: {
            NfygEmpth
        }
    }
</script>

<style lang="less" scoped>
    .active {
        color: #ff5656;
        font-weight: bold;
    }

    .courtesy-card-list {
        .line {
            position: relative;
            display: flex;
            margin: 0.2rem;
            padding: 0.24rem;
            background: #fff;
            border-radius: 0.16rem;

            .left {
                margin: auto 0;
                width: 1.65rem;
                text-align: center;

                .value {

                    font-size: 0.6rem;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: rgba(255, 86, 86, 1);

                    span {
                        font-size: 0.26rem;
                    }
                }

                .tips {
                    margin-top: 0.1rem;
                    font-size: 0.22rem;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 400;
                    color: rgba(255, 86, 86, 1);
                }

            }

            .center {
                margin-left: 0.24rem;
                flex: 1;

                .name {
                    font-size: 0.3rem;
                    color: #333;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                }

                .desc {
                    margin-top: 0.12rem;
                    font-size: 0.24rem;
                    color: #333;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                }

                .time {
                    margin-top: 0.12rem;
                    font-size: 0.24rem;
                    color: #999;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                }
            }

            .right {
                margin: auto;
                margin-left: 0.24rem;
                margin-right: 0;
                width: 1.22rem;
                height: 0.42rem;
                border-radius: 0.21rem;
                font-size: 0.26rem;
            }

            .circular-1 {
                width: 0.2rem;
                height: 0.2rem;
                border-radius: 50%;
                position: absolute;
                left: 1.79rem;
                top: -0.1rem;
                background: #f8f8f8;
            }

            .circular-2 {
                width: 0.2rem;
                height: 0.2rem;
                border-radius: 50%;
                position: absolute;
                left: 1.79rem;
                bottom: -0.1rem;
                background: #f8f8f8;
            }
        }
    }
</style>
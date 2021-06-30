<template>
    <div class="BeInvited bg-public">
        <img :src="require('@/assets/title_beInvited.png')" class="title" alt="">
        <img :src="require('@/assets/info_beInvited.png')" class="info" alt="">
        <div class="msg">
            <div class="bg-headUrl">
                <img :src="$route.query.headUrl || 'https://cmsfile.wifi8.com/uploads/wifi/AppH5/api/nfyg_head.png'"
                    class="headUrl" alt="">
            </div>
            <p class="nickName">{{$route.query.nickName}}邀请你办理花生商城花花卡</p>
            <img :src="require('@/assets/card_img.png')" class="card" alt="">
        </div>
        <div class="btn-invited btn-be-invited pulse" @click="linkToPerfectinfo">立即办理</div>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {

            }
        },
        mounted() {},
        methods: {
            linkToPerfectinfo() {
                const shopUserInfo = this.$cookies.get("shopUserInfo")
                if (!shopUserInfo) {
                    this.$router.push({
                        name: "login",
                        query: {
                            backType: "goback"
                        }
                    })
                } else {
                    this.$router.push({
                        name: "perfectinfo",
                        query: {
                            uid: this.$route.query.inviteUid
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .BeInvited {
        background: #ffad2f url(../../assets/bg_beInvited.png) no-repeat center top / 100%;

        .title {
            display: block;
            margin: auto;
            margin-top: 0.9rem;
            width: 7.17rem;
        }

        .info {
            display: block;
            margin: auto;
            margin-top: 0.66rem;
            width: 6.54rem;
        }

        .msg {
            .bg-headUrl {
                margin: auto;
                width: 4.05rem;
                background: #ffad2f url(../../assets/bg_headUrl.png) no-repeat center center / 100%;

                .headUrl {
                    display: block;
                    margin: auto;
                    margin-top: 0.66rem;
                    width: 0.8rem;
                    height: 0.8rem;
                    border-radius: 50%;
                    overflow: hidden;
                }
            }

            .nickName {
                margin: auto;
                margin-top: 0.2rem;
                font-size: 0.28rem;
                text-align: center;
                color: #8F5506;
            }

            .card {
                display: block;
                margin: auto;
                margin-top: 0.3rem;
                width: 6.14rem;
            }
        }

        .btn-be-invited {
            margin: auto;
            margin-top: 0.4rem;
            margin-bottom: 0.4rem;
        }
    }
</style>
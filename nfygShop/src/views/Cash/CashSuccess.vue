<template>
    <div class="Cash bg-public">
        <NfygEmpth type="cash" text="您的提现申请已提交" />
        <p class="tips">将在1-2工作日到账</p>
    </div>
</template>

<script>
    import NfygEmpth from '../../components/NfygEmpty'
    export default {
        name: '',
        data() {
            return {}
        },
        components: {
            NfygEmpth
        }
    }
</script>

<style lang="less" scoped>
    .nfyg-empty {
        p {
            font-size: 0.38rem;
            font-weight: 500;
            color: #333;
        }
    }

    .tips {
        font-size: 0.24rem;
        color: #999;
        text-align: center;
        margin-top: 0.1rem;
    }
</style>
<template>
	<img :src="require('@/assets/equitybg.png')" alt="" class="equity-img" @click="toPay">
</template>

<script>
	export default {
		name: "equity",
		data() {
			return {};
		},
		methods: {
			toPay() {
				this.$router.push({
					name: "perfectinfo",
				})
			},
		}
	}
</script>

<style scoped>
	.equity-img{
		width: 100%;
	}
</style>
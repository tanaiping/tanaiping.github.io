<template>
  <div class="activation">
    <div class="tc">
      <img :src="require('@/assets/success.png')"
           alt=""
           class="success-ico">
      <div class="t1">激活成功</div>
      <div class="t2">您已是尊贵的花花卡特权用户 立即开启花花卡省钱之旅</div>
      <button class="btn-public know-btn"
              @click="submitknow">知道了</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "activation",
  data () {
    return {};
  },
  methods: {
    submitknow () {
      this.$router.push({
        name: "home",
      })
    },
  }
}
</script>

<style scoped>
.activation {
  padding-top: 0.6rem;
  width: 5.8rem;
  margin: 0 auto;
}

.tc {
  text-align: center;
}

.t1 {
  color: #333;
  font-size: 0.4rem;
  height: 0.56rem;
  line-height: 0.56rem;
  margin: 0.25rem 0;
}

.t2 {
  color: #666;
  font-size: 0.3rem;
  line-height: 0.5rem;
  width: 4rem;
  margin: 0 auto 0.6rem auto;
}

.success-ico {
  width: 1.3rem;
  height: 1.3rem;
}

.know-btn {
  width: 5.8rem;
  height: 0.94rem;
  line-height: 0.94rem;
  border-radius: 0.4rem;
}
</style>
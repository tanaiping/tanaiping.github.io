<template>
  <div class="rules">
    <div class="line">
      <div class="title">
        <div class="icon">
          <p>01</p>
        </div>
        <h5>花花币介绍</h5>
      </div>
      <p class="text">花花币是花生商城为花生用户提供虚拟的有价值的积分，可用于兑换不同价值的会员权益。</p>
    </div>
    <div class="line">
      <div class="title">
        <div class="icon">
          <p>02</p>
        </div>
        <h5>如何赚取</h5>
      </div>
      <p class="text">1、已激活的花花卡用户，按每次单笔下单金额1:1返花花币</p>
      <p class="text">注：如实付金额有小数，以小数点后一位四舍五入取整数返花花币</p>
      <p class="text">2、非花花卡用户和7日之内未激活花花卡用户，购物不返花花币同时不能使用花花币抵扣</p>
      <p class="text">3、未激活花花卡用户会赠送7个自然日特权体验。体验期间购物享受特权价格，但不送花花币也不能使用花花币。</p>
      <p class="text">4、通过不定期的任务活动，赚取花花币。（后续期待）</p>
    </div>
    <div class="line">
      <div class="title">
        <div class="icon">
          <p>03</p>
        </div>
        <h5>如何使用</h5>
      </div>
      <p class="text">1、在花花币兑换专区，可兑换专属特价商品。兑换形式包括：纯花花币兑换、花花币+现金等形式</p>
      <p class="text">2、可用于参与会员专属福利活动</p>
      <p class="text">更多玩法，敬请期待</p>
    </div>
    <div class="line">
      <div class="title">
        <div class="icon">
          <p>04</p>
        </div>
        <h5>花花币有效期限</h5>
      </div>
      <p class="text">花花币按自然月6个月清零。例：2019年1-6月份所得花花币，将于2019年12月31日24:00清零。</p>
    </div>
    <div class="line">
      <div class="title">
        <div class="icon">
          <p>05</p>
        </div>
        <h5>温馨提示</h5>
      </div>
      <p class="text">1、在兑换专区购买卡券类和充值类商品不返花币。</p>
      <p class="text">2、购卡成功但未激活的7个自然日特权体验用户，体验期间购物享受特权价格，但不送花花币也不能使用花花币。</p>
      <p class="text">3、请勿违规刷花花币（包括但不限于虚假交易、恶意退款、拆单、套现），如发生您存在违规行为，我们有权取消您获得的积分资格。</p>
      <p class="text">4、花花币不可转让。</p>
      <p class="text">5、花生地铁可在法律允许的范围内对本规则进行适当变更或调整，相关变更或调整将公布在活动页面上，或以页面消息、公告等合适方式及时通知。</p>
    </div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped>
.rules {
  .line {
    margin: 0.5rem;
    .title {
      display: flex;
      .icon {
        flex: 8%;
        margin: auto;
        p {
          width: 0.4rem;
          height: 0.4rem;
          text-align: center;
          font-size: 0.2rem;
          line-height: 0.4rem;
          color: #fff;
          border-radius: 50%;
          background: url(../../assets/icon_num_00.png) no-repeat center /
            contain;
        }
      }
      h5 {
        flex: 92%;
        font-size: 0.3rem;
        line-height: 1.5;
        color: #1e1e1e;
        padding: 0.05rem 0;
      }
    }
    .text {
      font-size: 0.28rem;
      line-height: 1.5;
      color: #666;
      padding: 0.05rem 0;
    }
  }
}
</style>

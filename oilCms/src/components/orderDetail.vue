<template>
  <div id="orderdetail">
    <el-form :model="detailData" label-width="100px" class="demo-ruleForm">
      <el-form-item label="订单状态" prop="name">
        <label >{{status[detailData.status-1]}}</label>
      </el-form-item>
      <el-form-item label="退款原因" prop="name">
        <label style="width: 600px;display: block;">{{detailData.refuntMsg}}</label>
      </el-form-item>

      <el-form-item label="渠道名称" prop="name" >
       <label >{{detailData.source}}</label>
      </el-form-item>
      <el-form-item label="渠道订单号" prop="name" >
        <label >{{detailData.order_code}}</label>
      </el-form-item>
      <el-form-item label="订单号" prop="region" >
        <label >{{detailData.orderNo}}</label>
      </el-form-item>
      <el-form-item label="油站名称" prop="region" >
        <label >{{detailData.station_name}}</label>
      </el-form-item>
      <el-form-item label="油站地址" prop="region" >
         <label >{{detailData.address}}</label>
      </el-form-item>
      <el-form-item label="手机号" prop="region" >
         <label >{{detailData.phone}}</label>
      </el-form-item>
      <el-form-item label="油号" prop="name" >
         <label >{{detailData.oil_no}}</label>
      </el-form-item>
      <el-form-item label="枪号" prop="name" >
         <label >{{detailData.gun_no}}</label>
      </el-form-item>
      <el-form-item label="发改委价" prop="name" >
         <label >{{detailData.official_price}}</label>
      </el-form-item>
      <el-form-item label="挂牌价" prop="name" >
         <label >{{detailData.list_price}}</label>
      </el-form-item>
      <el-form-item label="协议价" prop="name" >
         <label >{{detailData.contract_price}}</label>
      </el-form-item>
      <el-form-item label="售价" prop="name" >
         <label >{{detailData.sale_price}}</label>
      </el-form-item>
      <el-form-item label="加油金额" prop="name" >
         <label >{{detailData.total_amount}}</label>
      </el-form-item>
      <el-form-item label="加油量" prop="name" >
         <label >{{detailData.liters}}</label>
      </el-form-item>
      <el-form-item label="优惠金额" prop="name" >
         <label >{{detailData.discount_amount}}</label>
      </el-form-item>
      <el-form-item label="服务费" prop="name" >
         <label >{{detailData.service_fee_amount}}</label>
      </el-form-item>
      <el-form-item label="实付款" prop="name" >
         <label >{{detailData.pay_amount}}</label>
      </el-form-item>
      <el-form-item label="协议金额" prop="name" >
         <label >{{detailData.contract_amount}}</label>
      </el-form-item>
      <el-form-item label="支付方式" prop="name" >
         <label >微信</label>
      </el-form-item>
      <el-form-item label="付款时间" prop="name" >
         <label >{{detailData.payTime}}</label>
      </el-form-item>
      <el-form-item label="付款信息" prop="name" >
         <label ></label>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name:'ordetail',
    data(){
        return {
          status:['支付成功','支付中','支付失败','退款成功','退款中','退款失败','支付超时','下单成功','下单失败','申请退款'],
        }
    },
    props:['detailData']

    }
</script>

<style>
</style>

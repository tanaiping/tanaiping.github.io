layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;


    //判断是券申请 还是编辑
    var  orderid = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      orderid = $("#iframe",parent.document.body).attr("orderid");
    }
    InitOrderDetail(orderid);

    //订单详情
    function InitOrderDetail(orderId){
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/getGoodsOrderDetail?orderId='+orderId,
          contentType: "application/json",
          dataType: 'json',
          // data:JSON.stringify({"orderId":orderId}),
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            console.log(data);
            if(data.resultCode==0){
              var res = data.data;
              var orderStatus ="";
              if(res.status==0){
                orderStatus = "用户已删除";
              }else if(res.status==1){
                orderStatus = "待付款";
              }else if(res.status==2){
                orderStatus = "待发货";
              }else if(res.status==3){
                orderStatus = "待收货";
              }else if(res.status==4){
                orderStatus = "已完成";
              }else if(res.status==5){
                orderStatus = "已取消";
              }else{
                orderStatus = "订单异常";
              }

              $("#order_status").text(orderStatus);
              $("#order_no").text(res.orderNo);
              $("#rname").text(res.rname);
              $("#rmobile").text(res.rmobile);
              $("#address").text(res.address);
              $("#goodsSkuId").text("商品名称："+res.goodsName+";数量："+res.num+";总价格："+(res.price/100).toFixed(2)+";");
              $("#payTime").text(res.payTime);
              $("#usePoint").text("￥"+(res.amount/100).toFixed(2)+"+"+res.usePoint+"币");
              $("#amount").text("￥"+(res.amount/100).toFixed(2));
              $("#orderTime").text(res.createTime);
              $("#pay_Info").text(res.payOrderNo);
              $("#buy_mobile").text(res.mobile);
              $("#createTime").text(res.createTime);
              $("#goodsSupplier").text(res.goodsSupplier);
			  $("#costPrice").text("￥"+(res.costPrice/100).toFixed(2));
			  $("#marketPrice").text("￥"+(res.marketPrice/100).toFixed(2));
			  $("#remark").text(res.remark==null?'':res.remark);
			  

            }else if(data.resultCode==3){
              localStorage.removeItem('role');
                    localStorage.removeItem('token');
          top.location.href="/cms/login.html?rdm="+Math.random();
            }else{
              layer.msg(data.resultMsg, {icon: 5});

            }
          },
          fail: function() {
            //layer.msg("网络异常，请稍后再试！", {icon: 5});
          }
      });

    }

});
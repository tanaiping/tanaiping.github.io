layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;


    //判断是券申请 还是编辑
    var  orderId = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      orderId = $("#iframe",parent.document.body).attr("orderId");
    }
    InitOrderDetail(orderId);

    //订单详情
    function InitOrderDetail(orderId){
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/getGoodsOrderDetail',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify({"orderId":orderId}),
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var res = data.data;
              var orderStatus ="";
              if(data.status==0){
                orderStatus = "用户已删除";
              }else if(data.status==1){
                orderStatus = "待付款";
              }else if(data.status==2){
                orderStatus = "待发货";
              }else if(data.status==3){
                orderStatus = "待收货";
              }else if(data.status==4){
                orderStatus = "已完成";
              }else if(data.status==5){
                orderStatus = "已取消";
              }else{
                orderStatus = "全部";
              }

              $("#order_status").text(orderStatus);
              $("#order_no").text(data.orderNo);
              $("#rname").text(data.rname);
              $("#rmobile").text(data.rmobile);
              $("#address").text(data.address);
              $("#goodsSkuId").text(data.goodsSkuId);
              $("#payTime").text(data.payTime);
              $("#usePoint").text(data.usePoint);
              $("#price").text(data.price);
              

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
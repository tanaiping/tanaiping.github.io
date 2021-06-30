layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var orderid = $("#iframe",parent.document.body).attr("orderid");

    //初始化订单详情
    initOrderDetail(orderid);

    function initOrderDetail(orderid){
    	var params = {
				  "id": orderid,
				}
				console.log(params);
    	$.ajax({
            type: "post",
            url: basePath+'/sys/right/getMrightOrderInfo',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                  var res = data.data;
                  console.log(res);
                  $(".order_no_self").text(res.orderCode);
                  $(".bis_info_self").text(res.rightName);
                  $(".pay_self").text("￥"+(res.pay/100).toFixed(2));
                  $(".excPoint_self").text(res.excPoint==null?0:res.excPoint);
                  if(res.payType ==1){
                  	$(".payType_self").text("支付宝支付")
                  }else if(res.payType ==2){
                  	$(".payType_self").text("微信支付")
                  }
                  $(".mobile_self").text(res.mobile);
                  $(".createTime_self").text(res.createTime);
                  $(".payTime_self").text(res.payTime);
                  var clientStatus = '';
                  if(res.status == 0){
                    clientStatus = "未支付"
                  }else if(res.status == 1){
                    clientStatus = "支付成功"
                  }else if(res.status == 2){
                    clientStatus = "支付失败"
                  }else if(res.status == 3){
                    clientStatus = "支付超时"
                  }else if(res.status == 4){
                    clientStatus = "支付取消"
                  }else if(res.status == 5){
                    clientStatus = "等待下单"
                  }else if(res.status == 6){
                    clientStatus = "下单成功"
                  }else if(res.status == 7){
                    clientStatus = "下单失败"
                  }
                  $(".status_self").text(clientStatus);
                  /* 自有订单数据end*/
                  if(res.orderList != null){
	                  var payTime_html = ''
	                  	payTime_html +='<div class="layui-input-block" style="display:flex;flex-direction: column;">'
	                  for(var i=0;i<res.orderList.length;i++){
		                  $(".status").text(clientStatus);
			              payTime_html +='<label class="layui-form-label"  style="text-align: left;width: auto">'+res.orderList[i].createTime
		                  if(res.orderList[i].resultCode ==0){
			              payTime_html +='<span  style=" color:#49cc90; padding-left:20px;">成功</span>'
		                  }else if(res.orderList[i].resultCode == 1){
		                  payTime_html +='<span  style="color:red; padding-left:20px;">失败</span>'
		                  }
			              payTime_html +='</label>'
	                  }
	                   payTime_html +='</div>';
	                  $(".payTime").append(payTime_html);
                  }

                  
                  

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
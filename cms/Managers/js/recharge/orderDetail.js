layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var orderid = $("#iframe",parent.document.body).attr("orderid");

    //初始化订单详情
    initOrderDetail(orderid);
	var interval = '';
	$(document).on("mouseover",".data-tips",function(){
		var str = $(this).attr("dataJson");
		var index = $(".data-tips").index(this)
		clearInterval(interval);
		layer.tips(str, '.tips-'+index, {
			 tips: [1, '#333'],
			 time: 10000,
			 area: ['130px', 'auto']//这个属性可以设置宽高  auto 表示自动
			});
	})
	$(document).on("mouseover",".layui-layer-molv",function(){
		clearInterval(interval);
	})
	$(document).on("mouseout",".data-tips,.layui-layer-molv",function(){
		interval = setInterval(function(){
		  $(".layui-layer-tips.layui-layer-molv").remove();
		},500)
	})
	

    function initOrderDetail(orderid){
    	$.ajax({
            type: "get",
            url: basePath+'/sys/charge/getChangeOrderInfo?id='+orderid,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                  var res = data.data;
                  console.log(res);
                  $("#orderCode").text(res.orderCode);
				  $("#chargeName").text(res.chargeName);
				  $("#type").text(res.type);
				  $("#productName").text(res.productName);
				  $("#chargeAccount").text(res.chargeAccount);
				  $("#pay").text((res.pay==null?"":res.pay));
				  $("#payType").text((res.payType==1?"支付宝":"微信"));
				  $("#mobile").text(res.mobile);
				  $("#payTime").text(res.payTime);
				  $("#createTime").text(res.createTime);
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
                  }else if(res.status == 9){
                    clientStatus = "充值成功"
                  }else if(res.status == 10){
                    clientStatus = "充值失败"
                  }
                  $("#status").text(clientStatus);
                  /* 自有订单数据end*/
                  if(res.orderList != null){
	                  var payTime_html = ''
	                  	payTime_html +='<div class="layui-input-block" style="display:flex;flex-direction: column;">'
	                  for(var i=0;i<res.orderList.length;i++){
		                  $(".status").text(clientStatus);
			              payTime_html +='<label class="layui-form-label"  style="text-align: left;width: auto">'+res.orderList[i].createTime
		                  if(res.orderList[i].resultCode ==0){
			              payTime_html +="<span  style=' color:#49cc90; padding:3px 20px;' class='data-tips tips-"+i+"' dataJson='"+ res.orderList[i].dataJson +"'>成功</span>"
		                  }else if(res.orderList[i].resultCode == 1){
		                  payTime_html +="<span  style='color:red; padding:3px 20px;' class='data-tips tips-"+i+"' dataJson='"+ res.orderList[i].dataJson +"'>失败</span>"
		                  }
			              payTime_html +='</label>'
	                  }
	                   payTime_html +='</div>';
	                  $("#orderList").append(payTime_html);
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
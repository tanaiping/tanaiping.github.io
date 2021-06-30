  layui.use(['jquery','element','layer', 'form'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form;

 	$.ajax({
        type: "post",
        url: basePath+'/sys/coupon/getCouponList',
        contentType: "application/json",
        dataType: 'json',
        data:JSON.stringify({"pageNo":0}),
        beforeSend: function (xhr) {
			 xhr.setRequestHeader('token', token);
		},
        success: function(data) {
        	if(data.resultCode==0){
        		var html='';



        		$("#ticketData_shop").html(html);
        	}else{
        		layer.msg(data.resultMsg, {icon: 5});
        	}
        },
        fail: function() {
        	//layer.msg("网络异常，请稍后再试！", {icon: 5});
        }
    });

  });
layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate
    ,laypage = layui.laypage;

   var reportTime = '',ifr_src='';
   if($("#iframe",parent.document.body).attr("src")!=undefined){
     ifr_src = $("#iframe",parent.document.body).attr("src");
     reportTime =$("#iframe",parent.document.body).attr("reportTime");
   }

     //订单列表数据
    setTimeout(function(){initOrderList(reportTime)},500);


    function initOrderList(reportTime){
      $.ajax({
          type: "get",
          url: basePath+"/sys/analyse/orderDetail?reportTime="+reportTime,
          contentType: "application/json",
          dataType: 'json',
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var res =data.data;
              if(res!=null&&res.length!=0){
                var html='';
                for(var i=0;i<res.length;i++){
                    html += '<tr><td>'+res[i].goodsType+'</td><td>'+res[i].paidOrder+'</td><td>'+res[i].price+'</td></tr>'
                }
                $("#analyseData").html(html);
              }else{
				html+='<tr><td colspan="3" class="layui-td-nodata"></td></tr>'
				$("#analyseData").html(html);
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
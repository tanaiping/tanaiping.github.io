//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage','laydate'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,laypage=layui.laypage
	,laydate=layui.laydate
    ,form = layui.form;


	//执行一个laydate实例
	var startDate = laydate.render({
	  elem: '#order_start', //指定元素
	  trigger: 'click', //触发事件
	  istime: true, //是否开启时间选择
	  isclear: true, //是否显示清空
	  istoday: true, //是否显示今天
	  issure: true, //是否显示确认
	  min: '1990-01-01', //设定最小日期为当前日期  
	  max: '2900-01-01', //最大日期 laydate.now(-1)
	  done: function(value,date){
	      endDate.config.min={
	      year:date.year,
	      month:date.month-1,//关键
	      date: date.date,
	      hours: 0,
	      minutes: 0,
	      seconds : 0
	      }
	  }
	});
	//执行一个laydate实例
	var endDate = laydate.render({
	  elem: '#order_end', //指定元素
	  trigger: 'click', //触发事件
	  istime: true, //是否开启时间选择
	  isclear: true, //是否显示清空
	  istoday: true, //是否显示今天
	  issure: true, //是否显示确认
	  min: '1990-01-01', //设定最小日期为当前日期   laydate.now(-7)
	  max: '2900-01-01', //最大日期 laydate.now(-1)
	  done: function(value,date){
	      if(value=="") return false;
	      startDate.config.max={
	      year:date.year,
	      month:date.month-1,//关键
	      date: date.date,
	      hours: 0,
	      minutes: 0,
	      seconds : 0
	      }
	  }
	});

    
	let curPage = 1;
	
    //监听订单搜索
    form.on('submit(searchBtn)', function(data){
        getOrderList(1,true);
        return false;
    });
	
	//监听导出
	form.on('submit(exportOrderList)', function(data){
	  exportOrderList(1);
	  return false;
	});
	
	$(document).on('click','.refund-btn',function(){
	  var orderCode = $(this).parents("tr").attr('orderCode');
	  refund(orderCode);
	});
    
    getOrderList(1,true);

    $(document).keypress(function(e) {  
      // 回车键事件  
       if(e.which == 13) {  
        getOrderList(1,true);
       }  
   }); 
     //分页
    function page(total){
      //分页
     laypage.render({
       elem: 'pageList' //注意，这里的 test1 是 ID，不用加 # 号
       ,count: total //数据总数，从服务端得到
       ,limit:20
       ,skin: '#1E9FFF' //自定义选中色值
       ,prev:'上一页'
       ,next:'下一页'
       ,layout: ['count', 'prev', 'page', 'next', 'skip']
       ,groups:2
         ,jump: function(obj, first){
            //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
          if(!first){
            getOrderList(obj.curr,false);
			curPage = obj.curr;
            $(window).scrollTop(0);
          }
        }
     });
    }

    //订单列表
    function getOrderList(cur_page,initPage){
        var ordercode=$("#order_code").val();
        var mobile=$("#mobile").val();
        var status=$("#pay_type").val();
        var checkStatus=$("#order_checkstatus").val();
		var startTime = $("#order_start").val();
		var endTime = $("#order_end").val();
        // var source=$("#source_data").val();
        if(mobile !=""&&mobile !=null){
        if(!phoneFun(mobile)){
          layer.msg("请输入正确的手机号", {icon: 5});
          return false;
        }
      }
        var params={
          "orderCode":ordercode
          ,"mobile":mobile
          ,"status":status
          ,"pageNo":cur_page
          ,"checkStatus":checkStatus
		  ,"startTime":startTime
		  ,"endTime":endTime
        }
        $.ajax({
          type: "post",
          url: basePath+'/sys/order/getOrderList',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
             xhr.setRequestHeader('token', token);
          },
          success: function(data) {
            var order = data.data;
            if(data.resultCode==0){
                if(order.data!=null){
                  var html='';
                  for(var i=0;i<order.data.length;i++){
                    //核销状态
                      var checkStatus="";
                      if(order.data[i].checkStatus==0){
                        checkStatus="未核销";
                      }else if(order.data[i].checkStatus==1){
                        checkStatus="已核销";
                      }else{
                        checkStatus="-";
                      }
                      //支付状态
                      var status="";
                      if(order.data[i].status==-1){
                        status="全部";
                      }else if(order.data[i].status==0){
                        status="未支付";
                      }else if(order.data[i].status==1){
                        status="支付成功";
                      }else if(order.data[i].status==2){
                        status="支付失败";
                      }else if(order.data[i].status==3){
                        status="支付超时";
                      }else if(order.data[i].status==8){
                        status="删除";
                      }else if(order.data[i].status==11){
                        status="退款成功";
                      }else if(order.data[i].status==12){
                        status="已退款";
                      }else{
                        status="支付取消";
                      }
                      var couponCode="";
                      if(order.data[i].couponCode==null){
                        couponCode="--";
                      }else{
                        couponCode = order.data[i].couponCode;
                      }

                      var updateTime = order.data[i].updateTime;
                      if(order.data[i].updateTime==null){
                        updateTime="--";
                      }
                    html+='<tr orderCode ="'+order.data[i].orderCode+'">'
                    html+='<td>'+(i+1)+'</td><td>'+couponCode+'</td><td>'+order.data[i].couponName+'</td><td>'+order.data[i].createTime+'</td>'
                    html+='<td>'+updateTime+'</td><td>'+order.data[i].orderCode+'</td><td>￥'+(order.data[i].cost/100).toFixed(2)+'</td><td>￥'+(order.data[i].pay/100).toFixed(2)+'</td>'
                    html+='<td>￥'+(order.data[i].price/100).toFixed(2)+'</td><td>'+status+'</td><td>'+order.data[i].mobile+'</td><td>'+checkStatus+'</td><td>'
					if(order.data[i].status == 11){
						html+='<button class="layui-btn layui-btn refund-btn">退款</button>'
					}
                    html+='</td></tr>'
                  }
                  $("#order_list").html(html);
                  total = order.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }
                else{
                  html+='<tr><td colspan="13" class="layui-td-nodata"></td></tr>'
                  $("#order_list").html(html);
                  $("#pageList").hide();
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
	
	function exportOrderList(curPage){
	  var ordercode=$("#order_code").val();
	    var mobile=$("#mobile").val();
	    var status=$("#pay_type").val();
	    var checkStatus=$("#order_checkstatus").val();
	  		var startTime = $("#order_start").val();
	  		var endTime = $("#order_end").val();
	    if(mobile !=""&&mobile !=null){
	    if(!phoneFun(mobile)){
	      layer.msg("请输入正确的手机号", {icon: 5});
	      return false;
	    }
	  }
	    var params={
	      "orderCode":ordercode
	      ,"mobile":mobile
	      ,"status":status
	      ,"pageNo":curPage
	      ,"checkStatus":checkStatus
		  ,"startTime":startTime
		  ,"endTime":endTime
	    }
	  $.ajax({
	      type: "post",
	      url: basePath+'/sys/order/exportOrdeList',
	      contentType: "application/json",
	      dataType: 'json',
	      data:JSON.stringify(params),
	      beforeSend: function (xhr) {
	      xhr.setRequestHeader('token', token);
	    },
	      success: function(data) {
	        if(data.resultCode==0){
	            top.location.href = data.data;
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
	
	function refund(ordercode){
		var params={
		    "orderCode":ordercode
		  }
		$.ajax({
		    type: "post",
		    url: basePath+'/sys/order/updateStatus',
		    contentType: "application/json",
		    dataType: 'json',
		    data:JSON.stringify(params),
		    beforeSend: function (xhr) {
		    xhr.setRequestHeader('token', token);
		  },
		    success: function(data) {
		      if(data.resultCode==0){
		          getOrderList(curPage,false);
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
	

	//判断是否为手机号的正则表达式
    function phoneFun(phones){
        var myreg = /\d{11}$/;
        if (!myreg.test(phones)) {
            console.log('手机号格式不正确')
          return false;
        } else {
            console.log('手机号格式正确')
          return true;
        }
    }


  });

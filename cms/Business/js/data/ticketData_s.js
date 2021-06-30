//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage',"laydate"], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate=layui.laydate
    ,laypage = layui.laypage;
	
	//是否显示留资 1显示  0 隐藏
	var isFeedback = parseInt(localStorage.getItem('feedback'));
	
    var total =0;
    //判断是卡券数据  还是卡券明细
    var  ifr_src = "";
    var couponId = "";
    var startTimeDetail = "";
    var endTimeDetail = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      ifr_src = $("#iframe",parent.document.body).attr("src");
    }
    if(ifr_src.indexOf("type_detail")!= -1){  //编辑页面  地址拦   ?type_detail=1 
        if($("#iframe",parent.document.body).attr("couponId")!=undefined){
          couponId = $("#iframe",parent.document.body).attr("couponId");
          param_couponName = $("#iframe",parent.document.body).attr("couponName");
          param_coupon_startTime = $("#iframe",parent.document.body).attr("coupon_startTime");
          param_coupon_endTime = $("#iframe",parent.document.body).attr("coupon_endTime");
        }      
        getDetailData(couponId,1,true);
    }else{
    	
    	initDatalist(1,true);
    }
    

    $(document).keypress(function(e) {  
    	// 回车键事件  
       if(e.which == 13) {  
   			if(ifr_src.indexOf("type_detail")!= -1){  //编辑页面  地址拦   ?type_detail=1 
		        getDetailData(couponId,1,true);
		    }else{
		    	initDatalist(1,true);
		    }
       }  
   }); 

    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#ticket_start', //指定元素
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
      elem: '#ticket_end', //指定元素
      trigger: 'click', //触发事件
      istime: true, //是否开启时间选择
      isclear: true, //是否显示清空
      istoday: true, //是否显示今天
      issure: true, //是否显示确认
      min: '1990-01-01', //设定最小日期为当前日期   laydate.now(-7)
      max: '2900-01-01', //最大日期 laydate.now(-1)
      done: function(value,date){
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

    //搜索卡券列表
    form.on('submit(exportTicketSearch)', function(data){
        initDatalist(1,true);
        return false;
    });
    //导出卡券列表
    form.on('submit(exportTicketList)', function(data){
        exportTList(couponId);
        return false;
    });
    //导出卡券明细
    form.on('submit(exportTicketDetail)', function(data){
        exportTDetail(couponId);
        return false;
    });
    //卡券明细搜索
    form.on('submit(ticketSearchDetail)', function(data){
        getDetailData(couponId,1,true);
        return false;
    });
    
    // 返回 返回列表页
    $(".ticket_detail").click(function(){
    	$("#iframe",parent.document.body).attr({"src":"shop/data/ticketData.html?rdm="+Math.random(),"couponId":couponId});
    })
    
    //明细
    $(document).on('click','.ticket-detail',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	$("#iframe",parent.document.body).attr({"src":"shop/data/ticketData_detail.html?type_detail=1&rdm="+Math.random(),"couponId":couponId});
    });

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
          	if(ifr_src.indexOf("type_detail")== -1){
            	initDatalist(obj.curr,false);
          	}else{
          		getDetailData(couponId,obj.curr,false);
          	}
          	$(window).scrollTop(0);
          }
        }
     });
    }
    

   
    //卡券列表数据
    function initDatalist(curPage,initPage){
		if(isFeedback == 0){
			$("#feedbackTh").hide();
		}
    	var couponName = $("#coupon_name").val();
    	var coupon_startTime = $("#ticket_start").val();
	    var coupon_endTime = $("#ticket_end").val();
    	var params={
          "bisId":userId
          ,"couponName":couponName
          ,"startTime":coupon_startTime
          ,"endTime":coupon_endTime
          ,"pageNo":curPage
        }
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/data/couponData/list",
	        data:JSON.stringify(params),
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	if(data.resultCode==0){
	        		var res = data.data;
	        		if(res.data!=null){
	        			var html='';
	        			for(var i=0;i<res.data.length;i++){
	        				var type="";
	        				if(res.data[i].type==1){
						       type="电子券";
						    }else if(res.data[i].type==2){
						        type="代金券";
						    }else{
						       type="实物券";
						    }
						    var feedback="";
	        				if(res.data[i].feedback==1){
						       feedback="是";
						    }else{
						       feedback="否";
						    }
		        			html+='<tr couponId ="'+res.data[i].couponId+'">';
		        			html+='<td>'+(i+1)+'</td><td>'+res.data[i].couponId+'</td><td>'+res.data[i].couponName+'</td><td>'+res.data[i].tagNames+'</td><td>'+type+'</td>'
		        			html+='<td>'+res.data[i].total+'</td><td>'+res.data[i].assign+'</td><td>'+res.data[i].bisName+'</td>';
							if(isFeedback == 1){
								html+='<td>'+feedback+'</td>';
							}
	      					html+='<td><button class="layui-btn layui-btn-primary ticket-detail">明细</button></td>';
	    					html+='</tr>'
						}
						$("#ticketData").html(html);
		        		total = data.data.total;
	        			if(total>20){
	                        if(initPage){page(total);$("#pageList").show();};
	                    }else{
	                        $("#pageList").hide();
	                    }
	        		}else{
						if(isFeedback == 0){
							html+='<tr><td colspan="9" class="layui-td-nodata"></td></tr>'
						}else{
							html+='<tr><td colspan="10" class="layui-td-nodata"></td></tr>'
						}
	                    $("#ticketData").html(html);
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

    //卡券明细
    function getDetailData(couponId,curPage,initPage){
		if(isFeedback == 0){
			$("#feedbackTh,#telTh").hide();
		}
    	startTimeDetail = $("#ticket_start").val();
    	endTimeDetail = $("#ticket_end").val();
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/data/couponData/detail/list",
	        data:JSON.stringify({"couponId":couponId,"pageNo":curPage,"bisId":userId,"startTime":startTimeDetail,"endTime":endTimeDetail}),
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	if(data.resultCode==0){
	        		var res = data.data;
        			if(res.data!=null&&res.data.length>0){
		        		var html='';
	        			for(var i=0;i<res.data.length;i++){
	        				var feedback="";
	        				if(res.data[i].feedback==null||res.data[i].feedback==""){
						       feedback="-";
						    }else{
						    	feedback = res.data[i].feedback;
						    }
		        			html+='<tr>';
		        			html+='<td>'+(i+1)+'</td><td>'+res.data[i].couponName+'</td><td>'+res.data[i].bisName+'</td><td>'+res.data[i].payTime+'</td>'
		        			html+='<td>'+res.data[i].couponCode+'</td>';
							if(isFeedback == 1){
								html+='<td>'+res.data[i].mobile+'</td><td>'+feedback+'</td>';
							}
	    					html+='</tr>'
						}
						$("#ticketDetailData").html(html);
		        		total = data.data.total;
	        			if(total>20){
	                        if(initPage){page(total);$("#pageList").show();};
	                    }else{
	                        $("#pageList").hide();
	                    }
	        		}
	        		else{
						if(isFeedback == 0){
							html+='<tr><td colspan="5" class="layui-td-nodata"></td></tr>'
						}else{
							html+='<tr><td colspan="7" class="layui-td-nodata"></td></tr>'
						}
	                  
	                  $("#ticketDetailData").html(html);
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



    //导出卡券列表数据
    function exportTList(curPage){
    	var couponName = $("#coupon_name").val();
    	var coupon_startTime = $("#ticket_start").val();
	    var coupon_endTime = $("#ticket_end").val();
    	var params={
          "bisId":userId
          ,"couponName":couponName
          ,"startTime":coupon_startTime
          ,"endTime":coupon_endTime
          ,"pageNo":curPage
        }
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/data/export/couponData/list",
	        data:JSON.stringify(params),
	        contentType: "application/json",
	        dataType: 'json',
          async:false, //同步
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	if(data.resultCode==0){
	        		window.open(data.data);
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

    //导出卡券明细
    function exportTDetail(couponId,curPage){
    	startTimeDetail = $("#ticket_start").val();
    	endTimeDetail = $("#ticket_end").val();
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/data/export/coupon/detail/list",
	        data:JSON.stringify({"couponId":couponId,"pageNo":curPage,"bisId":userId,"startTime":startTimeDetail,"endTime":endTimeDetail}),
	        contentType: "application/json",
	        dataType: 'json',
          async:false, //同步
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	if(data.resultCode==0){
	        		window.open(data.data);
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
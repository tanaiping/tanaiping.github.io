//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage',"laydate"], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate=layui.laydate
    ,laypage = layui.laypage;

    var total =0;
    initTicketlist(1,true);
    $(document).keypress(function(e) {  
    	// 回车键事件  
       if(e.which == 13) {  
   			initTicketlist(1,true);
       }  
   }); 
    //提交
    $(document).on('click','.ticket-submit',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	layer.open({
	        content: '确定要提交发券吗？'
	        ,btn: ['是的', '取消']
	        ,yes: function(index, layero){
	          	//执行结束的ajax
		        modifyStatus('/sys/coupon/submit',couponId);
	          	layer.close(index);
	        }
	        ,btn2: function(index, layero){
	        }
	        ,cancel: function(){ 
	        }
	      });
    });

    //查看详情
    $(document).on('click','.link-text',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	detailTicket(couponId,1);
    });
    //编辑
    $(document).on('click','.ticket-edit',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	var source = $(this).parents("tr").attr('source');
    	detailTicket(couponId,2,source);
    });

    //申请第三方卡券
    $("#apply_ticket_third").click(function(){
    	$("#iframe",parent.document.body).attr("src","ticket/applyTicket_third.html?rdm="+Math.random());
    });

    //申请自产卡券
    $("#apply_ticket_self").click(function(){
    	$("#iframe",parent.document.body).attr("src","ticket/applyTicket_self.html?rdm="+Math.random());
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
            initTicketlist(obj.curr,false);
            $(window).scrollTop(0);
          }
        }
     });
    }
    
    

    //渲染我的卡券列表页
    function initTicketlist(curPage,initPage){
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/coupon/getCouponList",
	        data:JSON.stringify({"pageNo":curPage,"bisId":userId,"couponName":"","status":-1}),
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	//console.log(data);
	        	var html='';
	        	if(data.resultCode==0){
	        		var res = data.data.data;
	        		var btnarry=[];
	        		if(res){
		        	for(var i=0;i<res.length;i++){
		        		if(res[i].type==1){
		        			res[i].type="电子券"
		        		}
		        		else if(res[i].type==2){
		        			res[i].type="代金券"
		        		}
		        		else if(res[i].type==3){
		        			res[i].type="实物券"
		        		}
		        		var reviewStatus ="";
		        		if(res[i].reviewStatus==0){
		        			reviewStatus="待审核";
		        		}else if(res[i].reviewStatus==1){
		        			reviewStatus='审核失败,'+'<a class="aud_reason rea_'+i+'" tipsflag="rea_'+i+'" reason="'+res[i].reviewMsg+'">原因</a>'; //<span class='reason">'+res[i].reviewMsg+'</span>
		        			
		        		}else{
		        			reviewStatus="审核通过";
		        		}
		        		//btnarry  0 1 2 3  分别  提交 恢复 暂停 结束
		        		var status ="";
		        		if(res[i].status==0){
		        			status="未提交";
		        			btnarry=['提交','编辑'];
		        		}else if(res[i].status==1){
		        			status="已提交";
		        			if(res[i].reviewStatus==1){
		        				btnarry=['编辑'];
		        			}else{
		        				btnarry=['编辑'];
		        			}
		        			
		        		}else if(res[i].status==2){
		        			status="已结束";
		        			btnarry=[];
		        		}else if(res[i].status==3){
		        			status="暂停";
		        			btnarry=['编辑'];
		        		}else{
		        			status="发券中";
		        			btnarry=['编辑'];
		        		}

		        		//券码来源
		        		var coupon_source ="";
		        		if(res[i].source==0){
		        			coupon_source="外部券";
		        		}
		        		else{
		        			coupon_source="内部券";
		        		}
	        		html+='<tr couponId="'+res[i].id+'"  source="'+res[i].source+'" status="'+res[i].status+'"><td>'+(i+1)+'</td><td><a href="javascript:;" class="link-text">'+res[i].couponName+'</a></td><td>'+coupon_source+'</td>'+
					      '<td>'+res[i].type+'</td><td>'+res[i].total+'</td><td>'+res[i].assign+'</td><td>'+status+'</td><td>'+reviewStatus+'</td><td>'
							if(btnarry.length>0){
								for(var x=0;x<btnarry.length;x++){
									if(btnarry[x]=="编辑"){
										html+='<button class="layui-btn layui-btn-normal ticket-edit">'+btnarry[x]+'</button>';
									}
									if(btnarry[x]=="提交"){
										html+='<button class="layui-btn ticket-submit">'+btnarry[x]+'</button>';
									}
								}
							}
					      html+='</td></tr>'
		        	}
		        	$("#myTicketlist tbody").html(html);
	        		total = data.data.total;
	        			if(total>20){
                            if(initPage){page(total);$("#pageList").show();};
                        }else{
                            $("#pageList").hide();
                        }
	        		}else{
	        			html+='<tr><td colspan="9" class="layui-td-nodata"></td></tr>'
	                  $("#myTicketlist tbody").html(html);
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

    function modifyStatus(url,couponId){
    	$.ajax({
	        type: "get",
	        url: basePath+url+"?couponId="+couponId,
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	if(data.resultCode==0){
	        		initTicketlist(1,true);
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

    //审核失败原因tips
    var subtips="";
    $(document).on("mouseover",".aud_reason",function(){
    	var reason = $(this).attr("reason");
    	var tipClass =$(this).attr("tipsflag")
	    subtips =layer.tips(reason, '.'+tipClass, {
		  tips: [1, '#24466b'] //还可配置颜色
		  ,time: 30000
		});
    })
    $(document).on("mouseout",".aud_reason",function(){
    	layer.close(subtips);
    })




    //获取卡券详情
    function detailTicket(couponId,type,coupon_source){
    	$.ajax({
	        type: "get",
	        url: basePath+'/sys/coupon/detail?couponId='+couponId,
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	localStorage.removeItem('detail_obj');
	        	if(data.resultCode==0){
	        		localStorage.setItem('detail_obj',JSON.stringify(data.data));
	        		if(type==1){
	        			$("#iframe",parent.document.body).attr("src","ticket/detailTicket.html?rdm="+Math.random()).attr("couponId",couponId);
	        		}else{
	        			$("#iframe",parent.document.body).attr({"src":"ticket/applyTicket_detail.html?type_detail=1&rdm="+Math.random(),"couponId":couponId});
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
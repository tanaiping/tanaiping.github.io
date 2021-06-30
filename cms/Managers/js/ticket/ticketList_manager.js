//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage;

    var total =0;
    initTicketlist(1,true);

    $(document).keypress(function(e) {  
    	// 回车键事件  
       if(e.which == 13) {  
   			initTicketlist(1,true);
       }  
   }); 
    
    //detail
    $(document).on('click','.link-text,.ticket-lookfor',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	detailTicket(couponId);
    });

    //删除
 	$(document).on('click','.ticket-del',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	layer.open({
	        content: '确定要删除未使用的卡券券码吗？'
	        ,btn: ['是的', '取消']
	        ,yes: function(index, layero){
	          	//执行结束的ajax
		        modifyStatus('/sys/coupon/delete/copuonCode',couponId);
	          	layer.close(index);
	        }
	        ,btn2: function(index, layero){
	        }
	        ,cancel: function(){ 
	        }
	      });
    });
    //结束
    $(document).on('click','.ticket-finish',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	layer.open({
	        content: '确定要结束发券吗？'
	        ,btn: ['是的', '取消']
	        ,yes: function(index, layero){
	          	//执行结束的ajax
		        modifyStatus('/sys/coupon/end',couponId);
	          	layer.close(index);
	        }
	        ,btn2: function(index, layero){
	        }
	        ,cancel: function(){ 
	        }
	      });
    });

    //暂停
    $(document).on('click','.ticket-pause',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	layer.open({
	        content: '确定要暂停发券吗？'
	        ,btn: ['是的', '取消']
	        ,yes: function(index, layero){
	          //执行结束的ajax
	          modifyStatus('/sys/coupon/pause',couponId);
	          layer.close(index);
	        }
	        ,btn2: function(index, layero){
	        }
	        ,cancel: function(){ 
	        }
	      });
    });

    //恢复
    $(document).on('click','.ticket-recover',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	layer.open({
	        content: '确定要恢复发券吗？'
	        ,btn: ['是的', '取消']
	        ,yes: function(index, layero){
	          	//执行结束的ajax
		        modifyStatus('/sys/coupon/recover',couponId);
	          	layer.close(index);
	        }
	        ,btn2: function(index, layero){
	        }
	        ,cancel: function(){ 
	        }
	      });
    });
    //置顶
 	$(document).on('click','.ticket-isTop',function(){
 		var couponId = $(this).parents("tr").attr('couponId');
    	isTop(couponId,1,this)
    });
    //置顶
 	$(document).on('click','.ticket-noTop',function(){
 		var couponId = $(this).parents("tr").attr('couponId');
    	isTop(couponId,0,this)
    });

    //编辑发券
    $(document).on('click','.ticket-edit',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	var couponName = $(this).parents("tr").attr('couponName');
    	var type = $(this).parents("tr").attr('type');
    	var total = $(this).parents("tr").attr('total');
    	var extendObj = {"couponId":couponId,"couponName":couponName,"total":total,"type":type,};
    	localStorage.setItem('extendObj',JSON.stringify(extendObj));
    	$("#iframe",parent.document.body).attr({"src":"ticket/extendTicket_detail.html?rdm="+Math.random(),"couponId":couponId});
    });

     //审核事件
    $(document).on('click','.ticket-aud',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	var left_html = '<form class="layui-form" action="">'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">卡券名称</label>'+
		    '<div class="layui-input-inline">'+
		      '<label class="layui-form-label" id="coupon_name_l" style="text-align: left;width: auto"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">券详情页样式</label>'+
		    '<div class="layui-input-block" id="detail_logo">'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">券列表LOGO</label>'+
		    '<div class="layui-input-inline">'+
		        '<img src="" alt="" class="coupon-uploadimg list_logo"  style="width:100px;">'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">卡券数量</label>'+
		    '<div class="layui-input-inline">'+
		      '<label class="layui-form-label" id="coupon_total" style="text-align: left;"><span>0</span>张</label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">来源</label>'+
		    '<div class="layui-input-inline">'+
		      '<label class="layui-form-label" id="coupon_source" style="text-align: left;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">券类型</label>'+
		    '<div class="layui-input-inline">'+
		      '<label class="layui-form-label" id="coupon_type" style="text-align: left;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item layui-form-text">'+
		    '<label class="layui-form-label">使用说明</label>'+
		    '<div class="layui-input-inline">'+
		       '<label class="layui-form-label" id="coupon_desc" style="text-align: left;width: auto; white-space:pre-line;"></label>'+
		    '</div>'+
		  '</div>'+
		 '<div class="layui-form-item layui-form-text">'+
		    '<label class="layui-form-label">适用门店</label>'+
		    '<div class="layui-input-inline">'+
		       '<label class="layui-form-label" id="coupon_stores" style="text-align: left;width: auto"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">使用截止日期</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="stop_date" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">发券时间</label>'+
		    '<div class="layui-input-inline">'+
		      '<div class="layui-date-area">'+
		        '<label class="layui-form-label" id="start_date" style="text-align: left; width: auto;white-space: nowrap;"></label>'+
		        '<label class="layui-form-label">至</label>'+
		        '<label class="layui-form-label" id="end_date" style="text-align: left; width: auto;white-space: nowrap;"></label>'+
		      '</div>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">是否留资</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="lz" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">商户电话</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="coupon_phone" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">外链地址</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="coupon_url" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">可否退款</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="refund" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		'</form>'

    		right_html ='<form class="layui-form" action="">'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">卡券名称</label>'+
		    '<div class="layui-input-inline">'+
		      '<label class="layui-form-label" id="coupon_name2" style="text-align: left;width: auto"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">券详情页样式</label>'+
		    '<div class="layui-input-block" id="detail_logo2">'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">券列表LOGO</label>'+
		    '<div class="layui-input-inline" style="width:100px;">'+
		        '<img src="" alt="" class="coupon-uploadimg list_logo2">'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">卡券数量</label>'+
		    '<div class="layui-input-inline">'+
		      '<label class="layui-form-label" id="coupon_total2" style="text-align: left;"><span>0</span>张</label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">来源</label>'+
		    '<div class="layui-input-inline">'+
		      '<label class="layui-form-label" id="coupon_source2" style="text-align: left;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">券类型</label>'+
		    '<div class="layui-input-inline">'+
		      '<label class="layui-form-label" id="coupon_type2" style="text-align: left;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item layui-form-text">'+
		    '<label class="layui-form-label">使用说明</label>'+
		    '<div class="layui-input-inline">'+
		       '<label class="layui-form-label" id="coupon_desc2" style="text-align: left;width: auto; white-space:pre-line;"></label>'+
		    '</div>'+
		  '</div>'+
		 '<div class="layui-form-item layui-form-text">'+
		    '<label class="layui-form-label">适用门店</label>'+
		    '<div class="layui-input-inline">'+
		       '<label class="layui-form-label" id="coupon_stores2" style="text-align: left;width: auto"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">使用截止日期</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="stop_date2" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">发券时间</label>'+
		    '<div class="layui-input-inline">'+
		      '<div class="layui-date-area">'+
		        '<label class="layui-form-label" id="start_date2" style="text-align: left; width: auto;white-space: nowrap;"></label>'+
		        '<label class="layui-form-label">至</label>'+
		        '<label class="layui-form-label" id="end_date2" style="text-align: left; width: auto;white-space: nowrap;"></label>'+
		      '</div>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">是否留资</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="lz2" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">商户电话</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="coupon_phone2" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">外链地址</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="coupon_url2" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		  '<div class="layui-form-item">'+
		    '<label class="layui-form-label">可否退款</label>'+
		    '<div class="layui-input-inline">'+
		         '<label class="layui-form-label" id="refund2" style="text-align: left;width: auto;"></label>'+
		    '</div>'+
		  '</div>'+
		'</form>'

    	layer.open({
    		title:'审核'
    		,area:["80%","800px"]
	        ,content: '<div class="compare-box"><div class="compare-left">'+left_html+'</div><div class="compare-right">'+right_html+'</div></div><input type="text" class="layui-input" id="reviewMsg" style="margin-top:10px;" maxlength="100"  placeholder="审核失败原因" >'
	        ,btn: ['通过', '拒绝','取消']
	        ,success: function(layero, index){
	        		$.ajax({
				        type: "get",
				        url: basePath+'/sys/coupon/couponReviewDetail?couponId='+couponId,
				        contentType: "application/json",
				        dataType: 'json',
				        beforeSend: function (xhr) {
							 xhr.setRequestHeader('token', token);
						},
				        success: function(data) {
				        	if(data.resultCode==0){
				        		var res = data.data;
				        		console.log(res);
				        		if(res.sing==null){
				        			$("#coupon_name2").text(res.cur.couponName).attr("couponId",couponId);
				                    if(res.cur.type==1){
				                      $("#coupon_type2").text("电子券");
				                    }else if(res.cur.type==2){
				                      $("#coupon_type2").text("代金券");
				                    }else{
				                      $("#coupon_type2").text("实物券");
				                    }
				                    coupon_total = res.cur.total;
				                    $("#coupon_total2 span").text(coupon_total);
				                    var  remark=res.cur.remark;
				                    remark =remark.replace('\\n',"<br />");
				                    remark =remark.replace('\\r',"<br />");
				                    $("#coupon_desc2").html(remark); 
				                    for(var x=0;x<res.cur.imgList.length;x++){
				                      $("#detail_logo2").append('<img src="'+res.cur.imgList[x].imgUrl+'" alt="" class="coupon-uploadimg detail_logo" style="width:100px;height:42px;margin:0 10px 10px 0">')
				                    }
				                    $(".list_logo2").attr("src",res.cur.logo)
				                    $("#coupon_stores2").html(res.cur.shop);
				                    if(res.cur.feedback==1){
				                      $("#lz2").text("是("+res.cur.feedItem+")");
				                    }else{
				                      $("#lz2").text("否");
				                    }
				                     var source="";
				                    if(res.cur.source==0){
				                      source="外部券";
				                    }else{
				                      source="内部券";
				                    }
				                    $("#coupon_source2").text(source);
				                    var startTime = res.cur.startTime;
				                    var endTime = res.cur.endTime;
				                    var deadline = res.cur.deadline 
				                    $("#stop_date2").text(deadline);
				                    $("#start_date2").text(startTime);
				                    $("#end_date2").text(endTime);
				                    $("#coupon_phone2").text(res.cur.phone);
				                    $("#coupon_url2").text(res.cur.linkUrl);
				                    if(res.cur.reFund==0){
				                      $("#refund2").text("是");
				                    }else{
				                      $("#refund2").text("否");
				                    }
				                    
				        		}else{
				        			var res = data.data;
				        			if(res.before!=null){
				        				console.log("===="+res.before.couponName)
					        			$("#coupon_name_l").text(res.before.couponName).attr("couponId",couponId);
					                    if(res.before.type==1){
					                      $("#coupon_type").text("电子券");
					                    }else if(res.before.type==2){
					                      $("#coupon_type").text("代金券");
					                    }else{
					                      $("#coupon_type").text("实物券");
					                    }
					                    coupon_total = res.before.total;
					                    $("#coupon_total span").text(coupon_total);
					                    var  remark=res.before.remark;
					                    remark =remark.replace('\\n',"<br />");
					                    remark =remark.replace('\\r',"<br />");
					                    $("#coupon_desc").html(remark); 
					                    for(var x=0;x<res.before.imgList.length;x++){
					                      $("#detail_logo").append('<img src="'+res.before.imgList[x].imgUrl+'" alt="" class="coupon-uploadimg detail_logo" style="width:100px;height:42px;">')
					                    }
					                    $(".list_logo").attr("src",res.before.logo)
					                    $("#coupon_stores").html(res.before.shop);
					                    if(res.before.feedback==1){
					                      $("#lz").text("是("+res.before.feedItem+")");
					                    }else{
					                      $("#lz").text("否");
					                    }
					                     var source="";
					                    if(res.before.source==0){
					                      source="外部券";
					                    }else{
					                      source="内部券";
					                    }
					                    $("#coupon_source").text(source);
					                    var startTime = res.before.startTime;
					                    var endTime = res.before.endTime;
					                    var deadline = res.before.deadline 
					                    $("#stop_date").text(deadline);
					                    $("#start_date").text(startTime);
					                    $("#end_date").text(endTime);
					                    $("#coupon_phone").text(res.before.phone);
					                    $("#coupon_url").text(res.before.linkUrl);
					                    if(res.before.reFund==0){
					                      $("#refund").text("是");
					                    }else{
					                      $("#refund").text("否");
					                    }
				                    }
				                    if(res.cur!=null){
					        			$("#coupon_name2").text(res.cur.couponName).attr("couponId",couponId);
					                    if(res.cur.type==1){
					                      $("#coupon_type2").text("电子券");
					                    }else if(res.cur.type==2){
					                      $("#coupon_type2").text("代金券");
					                    }else{
					                      $("#coupon_type2").text("实物券");
					                    }
					                    coupon_total = res.cur.total;
					                    $("#coupon_total2 span").text(coupon_total);
					                    var  remark=res.cur.remark;
					                    remark =remark.replace('\\n',"<br />");
					                    remark =remark.replace('\\r',"<br />");
					                    $("#coupon_desc2").html(remark); 
					                    for(var x=0;x<res.cur.imgList.length;x++){
					                      $("#detail_logo2").append('<img src="'+res.cur.imgList[x].imgUrl+'" alt="" class="coupon-uploadimg detail_logo" style="width:100px;height:42px;margin:0 10px 10px 0">')
					                    }
					                    $(".list_logo2").attr("src",res.cur.logo)
					                    $("#coupon_stores2").html(res.cur.shop);
					                    if(res.cur.feedback==1){
					                      $("#lz2").text("是("+res.cur.feedItem+")");
					                    }else{
					                      $("#lz2").text("否");
					                    }
					                     var source="";
					                    if(res.cur.source==0){
					                      source="外部券";
					                    }else{
					                      source="内部券";
					                    }
					                    $("#coupon_source2").text(source);
					                    var startTime = res.cur.startTime;
					                    var endTime = res.cur.endTime;
					                    var deadline = res.cur.deadline 
					                    $("#stop_date2").text(deadline);
					                    $("#start_date2").text(startTime);
					                    $("#end_date2").text(endTime);
					                    $("#coupon_phone2").text(res.cur.phone);
					                    $("#coupon_url2").text(res.cur.linkUrl);
					                    if(res.cur.reFund==0){
					                      $("#refund2").text("是");
					                    }else{
					                      $("#refund2").text("否");
					                    }
				                	}

				        			if(res.sing.couponName==true){
				        				$("#coupon_name2").addClass("layui-t-red");
				        			}
				        			if(res.sing.type==true){
				        				$("#coupon_type").addClass("layui-t-red");
				        			}
				        			if(res.sing.total==true){
				        				$("#coupon_total span").addClass("layui-t-red");
				        			}
				        			if(res.sing.remark==true){
				        				$("#coupon_desc2").addClass("layui-t-red");
				        			}
				        			if(res.sing.deadline==true){
				        				$("#stop_date2").addClass("layui-t-red");
				        			}
				        			if(res.sing.startTime==true){
				        				$("#start_date2").addClass("layui-t-red");
				        			}

				        			if(res.sing.endTime==true){
				        				$("#end_date2").addClass("layui-t-red");
				        			}
				        			if(res.sing.shop==true){
				        				$("#coupon_stores2").addClass("layui-t-red");
				        			}
				        			if(res.sing.feedback==true||res.sing.feedItem==true){
				        				$("#lz2").addClass("layui-t-red");
				        			}
				        			if(res.sing.phone==true){
				        				$("#coupon_phone2").addClass("layui-t-red");
				        			}
				        			if(res.sing.linkUrl==true){
				        				$("#coupon_url2").addClass("layui-t-red");
				        			}
				        			if(res.sing.reFund==true){
				        				$("#refund2").addClass("layui-t-red");
				        			}
				        		}


				        		var l_height = parseInt($(".compare-left form").css("height"));
					        	var r_height = parseInt($(".compare-right form").css("height"));
					        	if(l_height>=r_height){
							    	$(".compare-left form").addClass("compare-br");
							    }
								else{
									$(".compare-right form").addClass("compare-bl");
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
	        ,yes: function(index, layero){
	          //执行结束的ajax
	          var reviewMsg = $("#reviewMsg").val();
	          var reviewStatus =2;
		    	var params ={"couponId":couponId,"reviewMsg":"","reviewStatus":reviewStatus}
		    	audTickets(params);
		        layer.close(index);
		        layer.msg("处理成功！", {icon: 1});
	        }
	        ,btn2: function(index, layero){
	        	var reviewMsg = $("#reviewMsg").val().trim();
	        	if(reviewMsg==""){
	        		$("#reviewMsg").addClass("layui-form-danger").focus();
	        		return false;
	        	}
	        	var reviewStatus =1;
	        	var params ={"couponId":couponId,"reviewMsg":reviewMsg,"reviewStatus":reviewStatus}
		    	audTickets(params);
		        layer.close(index);
		        layer.msg("处理成功！", {icon: 1});
	        }
	        ,btn3: function(index, layero){
	        }
	        ,cancel: function(){ 
	        }
	      });
    });

    //发券跳转
    $(document).on('click','.ticket-issu',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	var couponName = $(this).parents("tr").attr('couponName');
    	var type = $(this).parents("tr").attr('type');
    	var total = $(this).parents("tr").attr('total');
    	var extendObj = {"couponId":couponId,"couponName":couponName,"total":total,"type":type,};
    	localStorage.setItem('extendObj',JSON.stringify(extendObj));
    	$("#iframe",parent.document.body).attr({"src":"ticket/extendTicket.html?rdm="+Math.random()}).attr("couponId",couponId);
    });

    //监听列表搜索
    form.on('submit(TicketSearch)', function(data){
        initTicketlist(1,true);
        return false;
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
		      if(!first){
		        //console.log('第'+ obj.curr +'页', {offset: 'b'});
		        initTicketlist(obj.curr,false);
		        $(window).scrollTop(0);
		      }
		    }
		 });
    }

    //渲染我的卡券列表页
    function initTicketlist(curPage,initPage){
    	var couponName = $("#coupon_name").val();
    	var status = $("#status").val();
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/coupon/getCouponList",
	        data:JSON.stringify({"pageNo":curPage,"couponName":couponName,"status":status}),
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
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
		        		var btnarry = [];
		        		var status ="";
		        		if(res[i].status==0){
		        			status="未提交";
		        		}else if(res[i].status==1){
		        			status="已提交";
		        			if(res[i].reviewStatus==2){
		        				btnarry=['发券','结束'];
		        			}else{
		        				btnarry=['审核','结束'];
		        			}
		        		}else if(res[i].status==2){
		        			status="已结束";
		        			// if(userId==1&&res[i].source==0){  //只有超级管理才有删除功能  外部券才有
		        			// 	btnarry=['删除'];
		        			// }
		        		}else if(res[i].status==3){
		        			status="暂停";
		        			btnarry=['恢复','结束','编辑'];
		        		}else{
		        			status="发券中";
		        			if(res[i].top==0){
		        			    btnarry=['暂停','结束'];
		        			}else{
		        				btnarry=['暂停','结束'];
		        			}
		        		}



	        		html+='<tr couponId="'+res[i].id+'" couponName="'+res[i].couponName+'" type="'+res[i].type+'" total="'+res[i].total+'"><td>'+(i+1)+'</td><td><a href="javascript:;" class="link-text">'+res[i].couponName+'</a></td>'+
					      '<td>'+res[i].bisName+'</td><td>'+res[i].type+'</td><td>'+res[i].total+'</td><td>'+status+'</td><td>'
						  if(btnarry.length>0){
								for(var x=0;x<btnarry.length;x++){
									if(btnarry[x]=="恢复"){
										html+='<button class="layui-btn ticket-recover">'+btnarry[x]+'</button>';
									}
									if(btnarry[x]=="暂停"){
										html+='<button class="layui-btn ticket-pause">'+btnarry[x]+'</button>';
									}
									if(btnarry[x]=="结束"){
										html+='<button class="layui-btn layui-btn-danger ticket-finish">'+btnarry[x]+'</button>';
									}
									if(btnarry[x]=="编辑"){
										html+='<button class="layui-btn layui-btn-normal ticket-edit">'+btnarry[x]+'</button>';
									}
									if(btnarry[x]=="发券"){
										html+='<button class="layui-btn layui-btn-primary ticket-issu">'+btnarry[x]+'</button>';
									}
									if(btnarry[x]=="审核"){
										html+='<button class="layui-btn layui-btn-primary ticket-aud">'+btnarry[x]+'</button>';
									}
									if(btnarry[x]=="删除"){
										html+='<button class="layui-btn layui-btn-danger ticket-del">'+btnarry[x]+'</button>';
									}
								}
							}

					      html+='</td></tr>'
		        	}
		        	$("#audTicket tbody").html(html);
	        		var total = data.data.total;
	        			if(total>20){
                            if(initPage){page(total);$("#pageList").show();};
                        }else{
                            $("#pageList").hide();
                        }
	        		}else{
	        			html+='<tr><td colspan="7" class="layui-td-nodata"></td></tr>'
	                  $("#audTicket tbody").html(html);
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

    //审核卡券
    function audTickets(params){
    	$.ajax({
	        type: "post",
	        url: basePath+'/sys/coupon/review',
	        contentType: "application/json",
	        dataType: 'json',
	        data:JSON.stringify(params),
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

    //获取卡券详情
    function detailTicket(couponId){
    	$.ajax({
	        type: "get",
	        url: basePath+'/sys/coupon/detail?couponId='+couponId,
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	if(data.resultCode==0){
	        		$("#iframe",parent.document.body).attr("src","ticket/detailTicket_m.html?rdm="+Math.random()).attr("couponId",couponId);
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


    //恢复 暂停  结束  
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

    //置顶 取消置顶
    function isTop(couponId,status,obj){
    	var that = obj;
    	$.ajax({
	        type: "post",
	        url: basePath+'/sys/coupon/top',
	        contentType: "application/json",
	        dataType: 'json',
	        data:JSON.stringify({"couponId":couponId,"top":status}),
	        beforeSend: function (xhr) {
				 xhr.setRequestHeader('token', token);
			},
	        success: function(data) {
	        	if(data.resultCode==0){
	        		layer.msg("操作成功", {icon: 1});
	        		if(status==1){
	        			$(that).text("取消置顶").removeClass("ticket-isTop").addClass("ticket-noTop");
	        		}else{
	        			$(that).text("置顶").removeClass("ticket-noTop").addClass("ticket-isTop");
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
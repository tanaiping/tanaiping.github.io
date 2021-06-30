//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage',"laydate","upload"], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate=layui.laydate
    ,laypage = layui.laypage
    ,upload = layui.upload;

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
        }      
        getDetailData(couponId,1,true);
    }else{
    	
    	initDatalist_V(1,true);
    }

    $(".verifi_detail").click(function(){
    	$("#iframe",parent.document.body).attr({"src":"manager/data/verifiData.html?rdm="+Math.random(),"couponId":couponId});
    })

    $(document).keypress(function(e) {  
      // 回车键事件  
       if(e.which == 13) {  
        if(ifr_src.indexOf("type_detail")!= -1){  //编辑页面  地址拦   ?type_detail=1 
            getDetailData(couponId,1,true);
        }else{
          initDatalist_V(1,true);
        }
       }  
   }); 

    getBisList(); 

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

    //搜索核销列表
    form.on('submit(exportVerSearch)', function(data){
        initDatalist_V(1,true);
        return false;
    });
    
    //导出核销列表
    form.on('submit(exportVerList)', function(data){
        exportVList(couponId);
        return false;
    });
    //导出核销明细
    form.on('submit(exportVerDetail)', function(data){
        exportVDetail(couponId);
        return false;
    });
    
    //查看详情
    $(document).on('click','.ticket-detail',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	$("#iframe",parent.document.body).attr({"src":"manager/data/verifiData_detail.html?type_detail=1&rdm="+Math.random(),"couponId":couponId});
    });

    //导入核销
    $(document).on('click','.ticket-verifi',function(){
    	var couponId = $(this).parents("tr").attr('couponId');
    	$("#iframe",parent.document.body).attr({"src":"manager/data/verifiData_import.html?&rdm="+Math.random(),"couponId":couponId});
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
            	initDatalist_V(obj.curr,false);
          	}else{
          		getDetailData(couponId,obj.curr,false);
          	}
          	$(window).scrollTop(0);
          }
        }
     });
    }
    

   
    //核销列表数据
    function initDatalist_V(curPage,initPage){
    	var couponName = $("#coupon_name").val();
    	var bisId = $("#bis_Id").val();
    	var coupon_startTime = $("#ticket_start").val();
	    var coupon_endTime = $("#ticket_end").val();
    	var params={
          "bisId":bisId
          ,"couponName":couponName
          ,"startTime":coupon_startTime
          ,"endTime":coupon_endTime
          ,"pageNo":curPage
        }
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/data/writeoff/list",
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
		        			html+='<tr couponId ="'+res.data[i].couponId+'">';
		        			html+='<td>'+(i+1)+'</td><td>'+res.data[i].couponId+'</td><td>'+res.data[i].couponName+'</td><td>'+type+'</td>'
		        			html+='<td>'+res.data[i].total+'</td><td>'+res.data[i].assign+'</td><td>'+res.data[i].bisName+'</td><td>'+res.data[i].writeoffCount+'</td>';
	      					html+='<td><button class="layui-btn layui-btn-normal ticket-verifi">核销</button></td>';
	      					html+='<td><button class="layui-btn layui-btn-primary ticket-detail">明细</button></td>';
	    					html+='</tr>'
						}
						$("#verifiData").html(html);
		        		var total = data.data.total;
	        			if(total>20){
	                        if(initPage){page(total);$("#pageList").show();};
	                    }else{
	                        $("#pageList").hide();
	                    }
	        		}else{
	                  html+='<tr><td colspan="10" class="layui-td-nodata"></td></tr>'
	                  $("#verifiData").html(html);
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

    //核销明细
    function getDetailData(couponId,curPage,initPage){
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/data/writeoff/detail/list",
	        data:JSON.stringify({"couponId":couponId,"pageNo":curPage,"bisId":-1,"startTime":startTimeDetail,"endTime":endTimeDetail}),
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

	        				var checkStatus="";
	        				if(res.data[i].checkStatus==0){
						       checkStatus="未核销";
						    }else{
						       checkStatus="已核销";
						    }

						    if(res.data[i].writeoffTime==null){
						       res.data[i].writeoffTime="-";
						    }

		        			html+='<tr>';
		        			html+='<td>'+(i+1)+'</td><td>'+res.data[i].couponName+'</td><td>'+res.data[i].bisName+'</td>'
		        			html+='<td>'+checkStatus+'</td><td>'+res.data[i].writeoffTime+'</td><td>'+res.data[i].couponCode+'</td><td>'+res.data[i].mobile+'</td>';
		        			html+='<td>'+res.data[i].cost+'</td><td>'+res.data[i].price+'</td><td>'+res.data[i].pay+'</td><td>'+res.data[i].income+'</td>';
	    					html+='</tr>'

						}
						$("#verifiDetailData").html(html);
		        		var total = data.data.total;
	        			if(total>20){
	                        if(initPage){page(total);$("#pageList").show();};
	                    }else{
	                        $("#pageList").hide();
	                    }
	        		}
	        		else{
	                  html+='<tr><td colspan="11" class="layui-td-nodata"></td></tr>'
	                  $("#verifiDetailData").html(html);
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



    //导出核销列表数据
    function exportVList(curPage){
    	var couponName = $("#coupon_name").val();
    	var bisId = $("#bis_Id").val();
    	var coupon_startTime = $("#ticket_start").val();
	    var coupon_endTime = $("#ticket_end").val();
    	var params={
          "bisId":bisId
          ,"couponName":couponName
          ,"startTime":coupon_startTime
          ,"endTime":coupon_endTime
          ,"pageNo":curPage
        }
    	$.ajax({
	        type: "post",
	        url: basePath+"/sys/data/export/writeoff/list",
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

    //导出核销明细数据
    function exportVDetail(couponId,curPage){
		$.ajax({
	        type: "post",
	        url: basePath+"/sys/data/export/writeoff/detail/list",
	        data:JSON.stringify({"couponId":couponId,"pageNo":curPage,"bisId":-1}),
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


	upload.render({ //允许上传的文件后缀
      elem: '#importVerData'
      ,url: basePath+'/sys/data/import/writeoff'
      ,headers: {token: token}
      ,accept: 'file' //普通文件
      ,exts: 'txt' //只允许上传压缩文件
      ,size: 2048  //kb
      ,before: function(obj){ 
      }
      ,done: function(data){
        if(data.resultCode==0){
        	var str ="";
        	if(data.errorDetail.length>0){
    			for(var i=0;i<data.errorDetail.length;i++){
    				str+=data.errorDetail[i]+'<br/>';
    			}
    		}
        	$(".coupon-upload-num").text("上传成功"+data.data.success+"个，失败"+data.data.fail+"个")
        	$(".dataDesc").html(str).show();
        	layer.open({
			  title: '核销导入'
			  ,content: '提交成功，本次已核销'+data.data.success+'个'
			});     
			  

        }else if(data.resultCode==3){
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            top.location.href="/cms/login.html?rdm="+Math.random();
        }else{
          layer.msg(data.resultMsg, {icon: 5});
        }
      }
    });

  //获取商户列表
    function getBisList(){
      $.ajax({
          type: "get",
          url: basePath+"/sys/bis/getAllBisList",
          contentType: "application/json",
          dataType: 'json',
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var res = data.data;
              if(res!=null&&res.length>0){
                var html='';
                for(var i=0;i<res.length;i++){
                  html+='<option value="'+res[i].id+'">'+res[i].bisName+'</option>'
                }

                $("#bis_Id").append(html);
                form.render();
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

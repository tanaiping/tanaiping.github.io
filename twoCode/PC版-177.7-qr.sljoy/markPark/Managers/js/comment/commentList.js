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
	  elem: '#startTime', //指定元素
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
	  elem: '#endTime', //指定元素
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
	
	var curPage = 1;
	var pageSize = 10;

    //监听订单搜索
    form.on('submit(search-btn)', function(data){
		//$("#iframe",parent.document.body).attr({"src":"park/parkCode.html?rdm="+Math.random()});
        getCommentList(1,true);
        return false;
    });
	
	
	
    getCommentList(1,true);

    $(document).keypress(function(e) {  
      // 回车键事件  
       if(e.which == 13) {  
        getCommentList(1,true);
       }  
   }); 
     //分页
    function page(total){
      //分页
     laypage.render({
       elem: 'pageList' //注意，这里的 test1 是 ID，不用加 # 号
       ,count: total //数据总数，从服务端得到
       ,limit:pageSize
       ,skin: '#1E9FFF' //自定义选中色值
       ,prev:'上一页'
       ,next:'下一页'
       ,layout: ['count', 'prev', 'page', 'next', 'skip']
       ,groups:2
         ,jump: function(obj, first){
            //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
          if(!first){
            getCommentList(obj.curr,false);
			curPage = obj.curr;
            $(window).scrollTop(0);
          }
        }
     });
    }

    //列表
    function getCommentList(cur_page,initPage){
        var customertel=$("#customertel").val();
        var tombname=$("#tombname").val();
        var startTime=$("#startTime").val();
        var endTime=$("#endTime").val();
		var familyname = $("#familyname").val();
		var status = $("#status").val();
		var msgtext = $("#msgtext").val();
		var edittime = '';
		if(startTime != ''||endTime != ''){
			edittime = startTime+"#"+endTime
		}
		var search = {
			'customertel':customertel,
			'tombname':tombname,
			'familyname':familyname,
			'status':status,
			'edittime':edittime,
			'msgtext':msgtext
		}
		console.log(search)
        var params={
          "pgid":cur_page,
		  "pgsize":pageSize,
          "search":search
        }
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsystombmsglist',
			data: JSON.stringify(params),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				if(data.code == 100){
					var res =data.data.list;
					var html = '';
					localStorage.setItem("communityData",JSON.stringify(res))
					if(res&&res.length>0){
						res.forEach(function(item,i){
							var list_num = (cur_page-1)*pageSize+i+1
							html+='<tr status ="'+item.status+'" msgid ="'+item.msgid+'">'+
								// '<td><input type="checkbox" name="" title="发呆" lay-skin="primary"></td>'+
								'<td>'+list_num+'</td>'+
								'<td>'+item.customertel+'</td>'+
								'<td>'+item.customername+'</td>'+
								'<td>'+item.familyname+'</td>'+
								'<td>'+item.addtime+'</td>'+
								'<td>'+item.fusername+'</td>'+
								'<td>'+item.msgtext+'</td>'
								
								if(item.status==1){
									html+='<td>显示</td>'
								}else{
									html+='<td>隐藏</td>'
								}
								html+='<td><div class="tab-btnlist">'
								if(item.status==1){
									html+='<label class="status-btn">隐藏</label>'
								}else{
									html+='<label class="status-btn">显示</label>'
								}	
									html+='<label class="detail-btn">查看</label>'+
									'<label class="del-btn">删除</label>'+
									'</div>'+
									'</td></tr>'
						})
						
						$("#commentData").html(html);
						total = data.data.allnum;
						if(total>pageSize){
							if(initPage){page(total);$("#pageList").show();};
						}else{
							$("#pageList").hide();
						}
					}else{
						html+='<tr><td colspan="9" class="layui-td-nodata"></td></tr>'
						$("#commentData").html(html);
						$("#pageList").hide();
					}
					// total = order.total;
					// if(total>20){
					// 	if(initPage){page(total);$("#pageList").show();};
					// }else{
					// 	$("#pageList").hide();
					// }
					// html+='<tr><td colspan="12" class="layui-td-nodata"></td></tr>'
					// $("#order_list").html(html);
					// $("#pageList").hide();
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
    }
	
	//上下架
	$("#commentData").on("click",".status-btn",function(){
		var status = $(this).parents("tr").attr("status");
		var msgid = $(this).parents("tr").attr("msgid");
		changeStatus(msgid,status);
	})
	//删除
	$("#commentData").on("click",".del-btn",function(){
		var msgid = $(this).parents("tr").attr("msgid");
		delPark(msgid);
	})
	//
	var subtips="";
	$(document).on("mouseover",".detail-btn",function(){
		var $this =$(this);
		var msgid = $(this).parents("tr").attr("msgid");
		var community = localStorage.getItem("communityData");
		community = eval("("+ community +")");
		console.log(community)
		var comStr = '';
		if(community.length>0){
			community.forEach(function(item,i){
				if(item.msgid == msgid){
					comStr +='<div><div class="commu-txt-box"><div>'+item.fusername+':</div><div>'+item.msgtext+'</div></div><div class="community-imgbox">'
					 if(item.msgpics&&item.msgpics.length>0){
						 item.msgpics.forEach(function(elem,j){
							 comStr +='<img src="'+elem+'" />'
						 })
						
					 }
							
						comStr +='</div><div>'+item.addtime+'</div></div>'
				}
				
			})
		}
		
		 
	    subtips =layer.tips(comStr, $(this), {
		  tips: [4, '#7a7a7a'] //还可配置颜色
		  ,time: 30000,
		  area: ['400px', 'auto']
		});
	})
	// $(document).on("mouseout",".detail-btn",function(){
	// 	layer.close(subtips);
	// })
	
	
	
	function changeStatus(msgid,sta){
		var txt = '',dtype=0;
		if(sta == 1){
			txt = '隐藏'
			dtype = 2
		}else{
			txt = '显示'
			dtype = 1
		}
		layer.confirm('确定要'+txt+'吗',{
		    title:"提示",
		    btn: ['取消','确定'] //按钮
		  }, function(){
		    layer.closeAll();
		  }, function(){
		    //下架  上架回调
		    oppPark(msgid,dtype);//1上架  2下架
		  });
		    return false;
	}
	
	function delPark(msgid){
		layer.confirm('确定要删除吗',{
		    title:"删除",
		    btn: ['取消','确定'] //按钮
		  }, function(){
		    layer.closeAll();
		  }, function(){
		    //下架  上架回调
			oppPark(msgid,0);
		  });
		    return false;
	}
	
	function oppPark(tid,type){
		
		var params = {
			"msgid":tid,
			"dtype":type
		}
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsystombmsgact',
			data: JSON.stringify(params),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				if(data.code == 100){
					layer.msg('操作成功！', {icon: 1});
					getCommentList(curPage,false);
				}else if(data.code==-1){
					localStorage.removeItem('utoken');
					top.location.href="http://qr.sljoy.cn/index.html?"+Math.random();
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
	}
	
	

  });

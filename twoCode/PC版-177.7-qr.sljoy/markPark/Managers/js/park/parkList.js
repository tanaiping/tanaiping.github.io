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
	  min: '1000-01-01', //设定最小日期为当前日期  
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
	  min: '1000-01-01', //设定最小日期为当前日期   laydate.now(-7)
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
	//全选
	form.on('checkbox(class_all)', function(data){
		var a = data.elem.checked;
		if(a == true){
			$(".class_one").prop("checked", true);
			form.render('checkbox');
		}else{
			$(".class_one").prop("checked", false);
			form.render('checkbox');
		}

	});
	//有一个未选中全选取消选中
	form.on('checkbox(class_one)', function (data) {
		var item = $(".class_one");
		for (var i = 0; i < item.length; i++) {
			if (item[i].checked == false) {
				$("#class_all").prop("checked", false);
				form.render('checkbox');
				break;
			}
		}
		//如果都勾选了  勾上全选
		var  all=item.length;
		for (var i = 0; i < item.length; i++) {
			if (item[i].checked == true) {
				all--;
			}
		}
		if(all==0){
			$("#class_all").prop("checked", true);
			form.render('checkbox');
		}
	});
	//遍历选中的值
// 	 var arr = new Array();
//      $("input:checkbox[name='like']:checked").each(function(i){
//           arr[i] = $(this).val();
//      });
//      data.field.like = arr.join(",");//将数组合并成字符串

	var curPage = 1;
	var pageSize = 10;
    //监听订单搜索
    form.on('submit(search-btn)', function(data){
		//$("#iframe",parent.document.body).attr({"src":"park/parkCode.html?rdm="+Math.random()});
        getParkList(1,true);
        return false;
    });
	
	//创建纪念园
	$(document).on('click','.add-btn',function(){
	  $("#iframe",parent.document.body).removeAttr("tombid");
	  $("#iframe",parent.document.body).attr({"src":"park/createPark.html?rdm="+Math.random()});
	  return false;
	});
	//编辑纪念园
	$(document).on('click','.edit-btn',function(){
		var tombid = $(this).parents("tr").attr("tombid");
	  $("#iframe",parent.document.body).attr({"src":"park/createPark.html?rdm="+Math.random()+"&isEdit=1","tombid":tombid});
	  return false;
	});
	//详情纪念园
	$(document).on('click','.detail-btn',function(){
		var tombid = $(this).parents("tr").attr("tombid");
	  $("#iframe",parent.document.body).attr({"src":"park/detailPark.html?rdm="+Math.random(),"tombid":tombid});
	  return false;
	});
	//上下架
	$("#parkData").on("click",".status-btn",function(){
		var status = $(this).parents("tr").attr("status");
		var tombid = $(this).parents("tr").attr("tombid");
		changeStatus(tombid,status);
	})
	//删除
	$("#parkData").on("click",".del-btn",function(){
		var tombid = $(this).parents("tr").attr("tombid");
		delPark(tombid);
	})
	
	
    getParkList(1,true);

    $(document).keypress(function(e) {  
      // 回车键事件  
       if(e.which == 13) {  
        getParkList(1,true);
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
            getParkList(obj.curr,false);
			curPage = obj.curr;
			$("#class_all").prop("checked", false);
            $(window).scrollTop(0);
          }
        }
     });
    }

    //订单列表
    function getParkList(cur_page,initPage){
        var customertel=$("#customertel").val();
        var tombname=$("#tombname").val();
        var startTime=$("#startTime").val();
        var endTime=$("#endTime").val();
		var familyname = $("#familyname").val();
		var status = $("#status").val();
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
		}
		console.log(search)
		// return false;
        var params={
          "pgid":cur_page,
		  "pgsize":pageSize
          ,"search":search
        }
		 // return false
		 console.log(basePath)
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsystomblist',
			data: JSON.stringify(params),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				console.log(data)
				if(data.code == 100){
					var res =data.data.list;
					var html = '';
					if(res&&res.length>0){
						res.forEach(function(item,i){
							var list_num = (cur_page-1)*pageSize+i+1
							html+='<tr status ="'+item.status+'" tombid ="'+item.tombid+'">'+
								// '<td><input type="checkbox" name="" title="" lay-skin="primary" lay-filter="class_one" class="class_one"></td>'+
								'<td>'+list_num+'</td>'+
								'<td>'+item.customertel+'</td>'+
								'<td>'+item.customername+'</td>'+
								'<td>'+item.acbegday+'</td>'+
								'<td>'+item.tombname+'</td>'+
								'<td>'+item.familyname+'</td>'
								if(item.acendday == ''){
									html +='<td>永久</td>'
								}else{
									html +='<td>'+item.acbegday+' - '+item.acendday+'</td>'
								}
								
								if(item.status==1){
									html+='<td>已上架</td>'
								}else{
									html+='<td>已下架</td>'
								}
								html+='<td><div class="tab-btnlist">'
								if(item.status==1){
									html+='<label class="status-btn">下架</label>'
								}else{
									html+='<label class="status-btn">上架</label>'
								}	
									html+='<label class="edit-btn">编辑</label>'+
									'<label class="detail-btn">查看</label>'+
									'<label class="del-btn">删除</label>'+
									'</div>'+
									'</td></tr>'
						})
						$("#parkData").html(html);
						total = data.data.allnum;
						if(total>pageSize){
							if(initPage){page(total);$("#pageList").show();};
						}else{
							$("#pageList").hide();
						}
						form.render();
					}else{
						html+='<tr><td colspan="9" class="layui-td-nodata"></td></tr>'
						$("#parkData").html(html);
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
				}else if(data.code==-1){
					localStorage.removeItem('utoken');
					top.location.href="http://qr.sljoy.cn/index.html?"+Math.random();
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
    }
	
	function changeStatus(tombid,sta){
		var txt = '',dtype=0;
		if(sta == 1){
			txt = '下架'
			dtype = 2
		}else{
			txt = '上架'
			dtype = 1
		}
		layer.confirm('确定要'+txt+'吗',{
		    title:"提示",
		    btn: ['取消','确定'] //按钮
		  }, function(){
		    layer.closeAll();
		  }, function(){
		    //下架  上架回调
		    oppPark(tombid,dtype);//1上架  2下架
		  });
		    return false;
	}
	
	function delPark(tombid){
		layer.confirm('确定要删除吗',{
		    title:"删除",
		    btn: ['取消','确定'] //按钮
		  }, function(){
		    layer.closeAll();
		  }, function(){
		    //下架  上架回调
			oppPark(tombid,0);
		  });
		    return false;
	}
	
	function oppPark(tid,type){
		
		var params = {
			"tombid":tid,
			"dtype":type
		}
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsystombact',
			data: JSON.stringify(params),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				if(data.code == 100){
					layer.msg('操作成功！', {icon: 1});
					getParkList(curPage,false);
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

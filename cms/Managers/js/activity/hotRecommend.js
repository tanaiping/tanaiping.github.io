layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

	var pages = 1;
    //初始化列表
    initHotList(1,true);
    
    //监听搜索
    form.on('submit(searchHot)', function(data){
      initHotList(1,true);
      return false;
    });
    
    //监听搜索
    form.on('submit(exportHotList)', function(data){
      exportHotList(1);
      return false;
    });
	
    
    
    //置顶  3
    $(document).on('click','.sticky-btn',function(){
        commonOpera(3,this,"/sys/activity/updateActivityIndex");
    });
    //上移 1 
    $(document).on('click','.moveUp-btn',function(){
        commonOpera(1,this,"/sys/activity/updateActivityIndex");
    });
    //下移 2
    $(document).on('click','.moveDown-btn',function(){
      commonOpera(2,this,"/sys/activity/updateActivityIndex");
    });
    
    //删除
  $(document).on('click','.del-btn',function(){
    console.log("fsfsfsdf");
     var _this  = this;
    layer.confirm('确定要删除该商品吗',{
        title:"提示",
        btn: ['取消','确定'] //按钮
      }, function(){
        layer.closeAll();
      }, function(){
        //下架  上架回调
        takeOff(_this);
      });
        return false;
  })
  
  //下架 上架
  $(document).on('click','.takeoff-btn',function(){
    console.log("fsfsfsdf");
     var _this  = this;
     var take_txt = $(this).text();
       var isflg ="会";
       if(take_txt == "上架"){
          isflg = "会";
       }else{
        isflg = "不";
       }
    layer.confirm(take_txt+'该商品后，客户端'+isflg+'展示了哦~',{
        title:"提示",
        btn: ['取消','确定'] //按钮
      }, function(){
        layer.closeAll();
      }, function(){
        //下架  上架回调
        takeOff(_this);
      });
        return false;
  })
    
    function initHotList(curPage,initPage){
    	var goodsName = $("#goods_name").val();
    	var startTime = $("#create_start").val();
    	var endTime = $("#create_end").val();
    	var status = $("#goods_type").val();
    	var params = {
    			  "endTime": endTime,
    			  "goodsName": goodsName,
    			  "pageNo": curPage,
    			  "startTime": startTime,
    			  "status": status
    			}
    	
    	$.ajax({
    	    type: "post",
    	    url: basePath+'/sys/activity/getActivityHotList',
    	    contentType: "application/json",
    	    data:JSON.stringify(params),
    	    dataType: 'json',
    	    beforeSend: function (xhr) {
    	    xhr.setRequestHeader('token', token);
    	},
    	    success: function(data) {
    	      if(data.resultCode==0){
    	        var html =''
    	        var res = data.data.data;
    	        console.log(res);
    	        if(res!=null){
    	          for(var i=0;i<res.length;i++){
    	            var act_status = ""
    	              if(res[i].status==0){
    	                act_status="待上架"
    	              }
    	              else if(res[i].status==1){
    	                act_status="上架"
    	              }else if(res[i].status==2){
    	                act_status="下架"
    	              }
					  var detailLink = '';
					  var linkParams =''
					  if(res[i].type==1){//entryType  1 热门推荐   2  兑换专区  3  限时抢购
					  	  detailLink = 'http://cmsfile.wifi8.com/uploads/wifi/AppH5/nfygShop/detailgoods?detailType=goods&entryType=1&'
					  	  //goodsId=XXXXXX&activeId=XXXXXX&checkSkuId=XXXXXX
					  	  //goodsId：商品id，activeId：专区id，checkSkuId：默认选中的sku，entryType：入口类型
					  }else{
					  	  detailLink = 'http://cmsfile.wifi8.com/uploads/wifi/AppH5/nfygShop/detailcoupon?detailType=coupon&entryType=1&'
					  	  //couponIdXXXXXX&activeId=XXXXXX
					  }
    	
    	              html += '<tr index = "'+res[i].index+'" activityid = "'+res[i].activityNo+'" status = "'+res[i].status+'" type = "'+res[i].type+'"  unionkey = "'+res[i].unionKey+'"><td>'+(i+1)+'</td><td>'+res[i].goodsName+'</td>'+
    	                      '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
    	                      var attrname1 ="";
    	                      var price ="";
    	                      var stock ="";
    	                      if(res[i].goodsSkuList != null){
    	                        for(var j = 0;j<res[i].goodsSkuList.length;j++){
                                if(res[i].goodsSkuList[j].attrName!=null){
                                    attrname1 +='<div>'+res[i].goodsSkuList[j].attrName+'</div>'
                                }else{
                                  attrname1 +='<div>&nbsp;</div>'
                                }
    	                          price+='<div>￥'+(res[i].goodsSkuList[j].vipPrice)/100+'/'+(res[i].goodsSkuList[j].normalPrice)/100+'</div>'
    	                          stock+='<div>'+res[i].goodsSkuList[j].saleStock+'/'+(res[i].goodsSkuList[j].stock-res[i].goodsSkuList[j].saleStock)+'</div>'
    	                          if(res[i].type==1){
    	                          		linkParams ="goodsId="+res[i].goodsSkuList[0].goodsId+"&activeId="+res[i].goodsSkuList[0].activityId+"&checkSkuId="+res[i].goodsSkuList[0].skuId
    	                          }else{
    	                          		linkParams ="couponId="+res[i].goodsSkuList[0].skuId+"&activeId="+res[i].goodsSkuList[0].activityId
    	                          }
    	                        }
    	                      }
    	                     
    	                     html += '<td>'+attrname1+'</td>'+
    	                          '<td>'+price+'</td>'+
    	                          '<td>'+stock+'</td>'
    	
    	
    	                  html += '<td><div>'+res[i].startTime+'</div><div>'+res[i].endTime+'</div></td><td>'+act_status+'</td>'+
    	                      '<td>'+
    						  '<button class="layui-btn layui-btn-primary sticky-btn">置顶</button>'+
    						  '<button class="layui-btn layui-btn-danger moveUp-btn">上移</button>'+
    						  '<button class="layui-btn layui-btn-normal moveDown-btn">下移</button>'
    						  if(res[i].status==0 ||res[i].status==1){
                  html += '<button class="layui-btn layui-btn-primary takeoff-btn" takeoff="2">下架</button>'
                  html += '<button class="layui-btn layui-btn-normal hotRecommend-edit">修改</button>'
                }else if(res[i].status==2){
                 //html += '<button class="layui-btn layui-btn-danger takeoff-btn" takeoff="1">上架</button>' 
                }
                if(res[i].status==0||res[i].status==2){
                  html += '<button class="layui-btn layui-btn-danger del-btn" takeoff="3">删除</button>'
                }
				if(res[i].status==1){
					html += '<button class="layui-btn layui-btn-primary copy-btn" data-clipboard-text="'+(detailLink+linkParams)+'">复制推广链接</button>'
				}
							  // '<button class="layui-btn layui-btn-primary hot-preview">预览</button>'+
    	                      '</td></tr>'
    	          }
    	          $("#hotData").html(html);
    	          var total = data.data.total;
    	            if(total>20){
    	                if(initPage){page(total);$("#pageList").show();};
    	            }else{
    	                $("#pageList").hide();
    	            }
    	        }else{
    	          html+='<tr><td colspan="9" class="layui-td-nodata"></td></tr>'
    	              $("#hotData").html(html);
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
    
    function exportHotList(curPage){
    	var goodsName = $("#goods_name").val();
    	var startTime = $("#create_start").val();
    	var endTime = $("#create_end").val();
    	var status = $("#goods_type").val();
    	var params = {
    			  "endTime": endTime,
    			  "goodsName": goodsName,
    			  "pageNo": curPage,
    			  "startTime": startTime,
    			  "status": status
    			}
    	
    	$.ajax({
    	    type: "post",
    	    url: basePath+'/sys/activity/exportActivityHotList',
    	    contentType: "application/json",
    	    data:JSON.stringify(params),
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

    //是否返花花币
    form.on('checkbox(isfb)', function(data){
      console.log(data.elem.checked); //是否被选中，true或者false
      console.log(data.value); //复选框value值，也可以通过data.elem.value得到
      if(data.elem.checked){
        $("#back_currency").removeAttr("readonly").attr("lay-verify","required|Number");
      }else{
        $("#back_currency").attr("readonly",true).removeAttr("lay-verify");
      }
    }); 


    //修改热门推荐
    $(document).on('click','.hotRecommend-edit',function(){
      var _this = $(this);
	  var goodsType = _this.parents("tr").attr("type");
	  var popH = goodsType==1?"300px":"360px";
	  var layVerify = goodsType==1?"":"required";
	  console.log(goodsType)
	  if(goodsType==1){
		  $(".activityNameBox").hide();
	  }else{
		  $(".activityNameBox").show();
	  }
	  $("#activityName").attr("lay-verify",layVerify);
      layer.open({
              type:1
              ,title: "修改商品信息"
              ,content: $('#editHot')
              ,area: ['650px', popH] //宽高
              ,btn: ['取消', '确定']//只是为了演示
              ,success:function(){
                var activityNo = _this.parents("tr").attr("activityid");
                var goodsId = _this.parents("tr").attr("unionKey");
                $.ajax({
                    type: "post",
                    url: basePath+'/sys/activity/getActivityHotDetail?activityNo='+activityNo,
                    contentType: "application/json",
                    // data:JSON.stringify(params),
                    dataType: 'json',
                    beforeSend: function (xhr) {
                    xhr.setRequestHeader('token', token);
                },
                    success: function(data) {
                      if(data.resultCode==0){
                        var res = data.data;
                        console.log(data);
                        $("#activityName").val(res.activityName);
						$("#shelves_time").val();
                        $("#takeoff_time").val(res.endTime);
                        if(res.returnPoint==0){
                        $("#isfb").html('<input type="checkbox" name="isfb" title="是否返币" lay-filter="isfb">');
                        $("#back_currency").attr("readonly",true).removeAttr("lay-verify");
                      }else{
                        $("#isfb").html('<input type="checkbox" name="isfb" title="是否返币" lay-filter="isfb" checked>');
                        $("#back_currency").removeAttr("readonly").attr("lay-verify","required|Number");
                      }
                      form.render();
                      $("#back_currency").attr({"activityid":activityNo,"goodsid":goodsId,"type":goodsType}).val(res.returnPoint);
                        $("#shelves_time").val(res.startTime);
                      }else if(data.resultCode==3){
                        localStorage.removeItem('role');
                        localStorage.removeItem('token');
                        top.location.href="/cms/login.html?rdm="+Math.random();
                      }else{
                        layer.msg(data.resultMsg, {icon: 5});
                      }

                      var startDate = laydate.render({
                        elem: '#shelves_time', //指定元素
                        type: 'datetime',
                        trigger: 'click', //触发事件
                        istime: true, //是否开启时间选择
                        isclear: true, //是否显示清空
                        istoday: true, //是否显示今天
                        issure: true, //是否显示确认
                        min: '1990-01-01', //设定最小日期为当前日期  
                        max: res.endTime, //最大日期 laydate.now(-1)
                        done: function(value,date){
                            endDate.config.min={
                            year:date.year,
                            month:date.month-1,//关键
                            date: date.date,
                            hours: 0,
                            minutes: 0,
                            seconds : 0
                            }
                        },
                        ready: function(date){
                        //初始化默认时间分为23：59：59
                          // this.dateTime.hours = 23;
                          // this.dateTime.minutes = 59;
                          // this.dateTime.seconds = 59;
                        }
                      });
                      //执行一个laydate实例
                      var endDate = laydate.render({
                        elem: '#takeoff_time', //指定元素
                        type: 'datetime',
                        trigger: 'click', //触发事件
                        istime: true, //是否开启时间选择
                        isclear: true, //是否显示清空
                        istoday: true, //是否显示今天
                        issure: true, //是否显示确认
                        min: res.startTime, //设定最小日期为当前日期  
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
                        },
                        ready: function(date){
                        //初始化默认时间分为23：59：59
                          this.dateTime.hours = 23;
                          this.dateTime.minutes = 59;
                          this.dateTime.seconds = 59;
                        }
                      });
                    },
                    fail: function() {
                      //layer.msg("网络异常，请稍后再试！", {icon: 5});
                    }
                });
                
              }
              ,yes: function(){
                  layer.closeAll();
              }
              ,btn2: function(){
                var activityNo = $("#back_currency").attr("activityid");
                var goodsId = $("#back_currency").attr("goodsid");
                var goodsType = $("#back_currency").attr("type");
                var startTime = $("#shelves_time").val();
                var endTime =  $("#takeoff_time").val();
				var activityName = $("#activityName").val();
                 var returnPoint = 0;
                  if($("#isfb .layui-form-checkbox").hasClass('layui-form-checked')){
                    returnPoint = $("#back_currency").val();
                  }
                var params = {
                  "activityNo": activityNo,
				  "activityName":activityName,
                  "endTime": endTime,
                  "goodsId": goodsId,
                  "goodsType": goodsType,
                  "returnPoint": returnPoint,
                  "startTime": startTime,
                  "type":2
                }
                console.log(params);
                $.ajax({
                    type: "post",
                    url: basePath+'/sys/activity/saveActivityHotDetail',
                    contentType: "application/json",
                    data:JSON.stringify(params),
                    dataType: 'json',
                    beforeSend: function (xhr) {
                    xhr.setRequestHeader('token', token);
                },
                    success: function(data) {
                      if(data.resultCode==0){
                        layer.msg("操作成功！", {icon: 1});
                         setTimeout(function(){
                          layer.closeAll();
                          $("#iframe", window.parent.document).attr("src",'activity/hotRecommend.html?'+Math.random());
                        },1000);

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
    });

    
    //下架
    $(document).on('click','.takeOff-btn',function(){
        var take_txt = $(this).text();
       var isflg ="会";
       if(take_txt == "上架"){
          isflg = "会";
       }else{
        isflg = "不";
       }
        layer.confirm(take_txt+'该商品后，客户端'+isflg+'展示了哦~',{
            title:"提示",
            btn: ['取消','确定'] //按钮
          }, function(){
            layer.closeAll()
          }, function(){
            layer.msg('也可以这样', {
              time: 20000, //20s后自动关闭
              btn: ['明白了', '知道了']
            });
          });
    })
    

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
          	initHotList(obj.curr,false);
			pages = obj.curr
          	$(window).scrollTop(0);
          }
        }
     });
    }
	
	//执行一个laydate实例
	    var startDate = laydate.render({
	      elem: '#create_start', //指定元素
	      type: 'datetime',
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
	      },
	      ready: function(date){
	      //初始化默认时间分为23：59：59
	        // this.dateTime.hours = 23;
	        // this.dateTime.minutes = 59;
	        // this.dateTime.seconds = 59;
	      }
	    });
	    //执行一个laydate实例
	    var endDate = laydate.render({
	      elem: '#create_end', //指定元素
	      type: 'datetime',
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
	      },
	      ready: function(date){
	      //初始化默认时间分为23：59：59
	        this.dateTime.hours = 23;
	        this.dateTime.minutes = 59;
	        this.dateTime.seconds = 59;
	      }
	    });
		
		function commonOpera(moveType,obj,url){
      var activityid = $(obj).parents("tr").attr("activityid");
      var index = $(obj).parents("tr").attr("index");
      var params = {
        "activityNo":activityid,
        "index":index,
        "type":1,
        "moveType":moveType
      }
      $.ajax({
            type: "post",
            url: basePath+url,
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                initHotList(pages,false);
//              window.location.href='hotRecommend.html?'+Math.random();
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
    
    function takeOff(obj){
      var activityid = $(obj).parents("tr").attr("activityid");
      var takeoff = $(obj).attr("takeoff");
      var params = {
        "activityNo":activityid,
        "status":takeoff,
        "type":1, // 活动的上下架类型:1-热门推荐,2-兑换专区,3-限时抢购
      }
      $.ajax({
            type: "post",
            url: basePath+'/sys/activity/updateActivityStatus',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              console.log(data);
              if(data.resultCode==0){
                if(takeoff == 2){//下架
	          		$(obj).parents("td").prev("td").text("下架");
	          		$(obj).remove();
	          	}else if(takeoff == 3){//
//	          		$(obj).parents("tr").remove();
	          		initHotList(pages,false);
	          	}
                //window.location.href='hotRecommend.html?'+Math.random();
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

	var clipboard = new ClipboardJS('.copy-btn');
	clipboard.on('success', function(e) {
		//console.info('Action:', e.action);
		console.info('Text:', e.text);
		layer.msg("复制成功！", {icon: 1});
		//console.info('Trigger:', e.trigger);
		e.clearSelection();
	});
	
	clipboard.on('error', function(e) {
		//console.error('Action:', e.action);
		//console.error('Trigger:', e.trigger);
	});
	
});
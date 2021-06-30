layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    var initType = 1; // 1 2 3   热门推荐   兑换专区   限时抢购
	
	var cur_page = 1;

    //初始化列表
    initRightList(1,true);

    
    
    //监听搜索
    form.on('submit(searchRightList)', function(data){
      initRightList(1,true);
      return false;
    });
    
    //监听导出
    form.on('submit(exportRightList)', function(data){
      exportRightList(1);
      return false;
    });
	
	//移出首页
	$(document).on('click','.remove-btn',function(){
    var activityno = $(this).parents("tr").attr("activityid");
    var type = $(this).parents("tr").attr("modeltype");
	    layer.confirm('确认要移出首页吗',{
	        title:"移除提示",
	        btn: ['取消','确认'] //按钮
	      }, function(){
	        layer.closeAll();
	      }, function(){
          //移出首页  type=0 移出   type=1  加入
          rightOpera(activityno,0,type);
	      });
	})

  function rightOpera(activityno,isShowMain,type){
    var params = {
          "activityNos": activityno,
          "isShowMain": isShowMain,
          "type":type
        }
        console.log(params)
      $.ajax({
          type: "post",
          url: basePath+'/sys/activity/updateIsShowMain',
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
                     	initRightList(1,true);
//                    $("#iframe", window.parent.document).attr({"src":'activity/pollenRights.html?ram'+Math.random()});
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
    
    function initRightList(curPage,initPage){
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
    	    url: basePath+'/sys/activity/getShowMainGoodsList',
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

                    var modelTypes = 0;
                    if(res[i].modelType==1){
                      modelTypes = "热门推荐"
                    }
                    else if(res[i].modelType==2){
                      modelTypes = "兑换专区"
                    }else if(res[i].modelType==3){
                      modelTypes = "限时抢购"
                    }

                    
    	
    	              html += '<tr  topPic = "'+res[i].topPic+'"  isTop = "'+res[i].isTop+'"  modeltype = "'+res[i].modelType+'" index = "'+res[i].index+'" activityid = "'+res[i].activityNo+'" status = "'+res[i].status+'" type = "'+res[i].type+'"><td>'+(i+1)+'</td><td>'+modelTypes+'</td><td>'+res[i].goodsName+'</td>'+
    	                      '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
    	                      var attrname1 ="";
    	                      var price ="";
    	                      if(res[i].goodsSkuList != null){
    	                        for(var j = 0;j<res[i].goodsSkuList.length;j++){
                                if(res[i].goodsSkuList[j].attrName!=null){
                                    attrname1 +='<div>'+res[i].goodsSkuList[j].attrName+'</div>'
                                }else{
                                  attrname1 +='<div>&nbsp;</div>'
                                }
                                if(res[i].modelType==1){
    	                           price+='<div>￥'+(res[i].goodsSkuList[j].vipPrice)/100+'/'+(res[i].goodsSkuList[j].normalPrice)/100+'</div>'
                                }else if(res[i].modelType==2){
                                  price+='<div>￥'+(res[i].goodsSkuList[j].vipPrice)/100+'/'+(res[i].goodsSkuList[j].excPrice)/100+'</div>'
                                }else if(res[i].modelType==3){
                                  price+='<div>￥'+(res[i].goodsSkuList[j].panicPrice)/100+'</div>'
                                }
    	                        }
    	                      }
    	                     
    	                     html += '<td>'+attrname1+'</td>'+
    	                          '<td>'+price+'</td>'
    	
    	
    	                  html += '<td><div>'+res[i].startTime+'</div><div>'+res[i].endTime+'</div></td><td>'+act_status+'</td>'+
    	                      '<td>'
    						  html += '<button class="layui-btn layui-btn-danger remove-btn">移除</button>'
							  if(res[i].isTop == 0){//否
								html += '<button class="layui-btn  layui-btn-normal upload-btn">置顶</button>'
							  }else{//是
								html += '<button class="layui-btn  layui-btn-normal upload-btn istop">取消置顶</button>' 
							  }
							           // '<button class="layui-btn layui-btn-normal preview-btn">查看</button>'+
    	                      html += '</td></tr>'
    	          }
    	          $("#rightData").html(html);
    	          var total = data.data.total;
                console.log(total)
    	            if(total>20){
                    console.log(total)
    	                if(initPage){page(total);$("#pageList").show();};
    	            }else{
    	                $("#pageList").hide();
    	            }
    	        }else{
    	          html+='<tr><td colspan="9" class="layui-td-nodata"></td></tr>'
    	              $("#rightData").html(html);
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
    
    function exportRightList(curPage){
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
    	    url: basePath+'/sys/activity/exportShowMainGoodsList',
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
          	initRightList(obj.curr,false);
			cur_page = obj.curr
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

      form.on('radio(act_type)', function(data){
        console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        console.log(data.elem.checked);
        initType = data.value;
        $("#checkedAll").prop("checked", false)
        initGoodsSearch(1,true,initType);
        return false;
      });  

      //导入活动商品
    $(document).on('click','.importActivityGoods',function(){
      $(".goods-name-select").val("");
      initGoodsList(1,true,initType);
      return false;
    })

    $("#select_wrap").on("click","input[type='checkbox']",function(e){
      if($(this).attr("id")=="checkedAll"){
        if($(this).is(":checked")){
          $("#select_box tr").each(function(){
            $(this).find("input").prop("checked", true)
          })
        }else{
          $("#select_box tr").each(function(){
            $(this).find("input").prop("checked", false)
          })
        }
      }
      e.stopPropagation();
    })

     $("#select_wrap").on("click","tr",function(i){
      var i = $("#select_wrap tr").index(this);
      var thisobj = $(this).find("input");
      console.log(thisobj.is(":checked"));
      if(!thisobj.is(":checked")){
        thisobj.prop("checked", true);

      }else{
        thisobj.prop("checked", false)
      }
      if(i==0){
        if($("#checkedAll").is(":checked")){
          $("#select_box tr").each(function(){
            $(this).find("input").prop("checked", true)
          })
        }else{
          $("#select_box tr").each(function(){
            $(this).find("input").prop("checked", false)
          })
        }
      }
    })

     $(document).keydown(function(event){
    　　if(event.keyCode==13){
      console.log("ss");
    　　   initGoodsSearch(1,true,initType);
          return false;
    　　}
    });

    //搜索
    form.on('submit(searchselect)', function(data){
      initGoodsSearch(1,true,initType);
      return false;
    });
		

    function initGoodsSearch(curPage,initPage,type){
          var params = {
                "goodsName":$(".goods-name-select").val(),
                "pageNo": curPage,
                "type":type
              }
              console.log(params)
            $.ajax({
            type: "post",
            url: basePath+'/sys/activity/getJoinMainActivityGoodsList',
            contentType: "application/json",
            data:JSON.stringify(params),
            dataType: 'json',
            beforeSend: function (xhr) {
            xhr.setRequestHeader('token', token);
        },
            success: function(data) {
              console.log(data);
              // $("#pageLists").remove();
              if(data.resultCode==0){
              var res = data.data.data;
              console.log(res);
              var html ='';
              if(res!=null){
                for(var i=0;i<res.length;i++){
                  html+=
                  '<tr activityno = "'+res[i].activityNo+'" type = "'+res[i].type+'"><td><input type="checkbox" name="commodity" title=""></td>'+
                '<td>'+(i+1)+'</td><td>'+res[i].goodsName+'</td>'+
                '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
                var attrname1 ="";
                  var price ="";
                  if(res[i].goodsSkuList != null){
                    for(var j = 0;j<res[i].goodsSkuList.length;j++){
                      attrname1 +='<div>'+(res[i].goodsSkuList[j].attrName==null?"-":res[i].goodsSkuList[j].attrName)+'</div>'
                      price+='<div>￥'+(res[i].goodsSkuList[j].vipPrice)/100+'/'+(res[i].goodsSkuList[j].normalPrice)/100+'</div>'
                    }
                  }
                 
                 html += '<td>'+attrname1+'</td>'+
                      '<td>'+price+'</td></tr>'
                }
                $("#select_box").html(html);
              }else{
                html+='<tr><td colspan="6" class="layui-td-nodata" style="height:200px"></td></tr>'
                $("#select_box").html(html);

              }
                var total = data.data.total;
              if(total>20){

                if(initPage){
                  laypage.render({
                   elem: 'pageLists' //注意，这里的 test1 是 ID，不用加 # 号
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
                        initGoodsSearch(obj.curr,false,initType);
                        $(window).scrollTop(0);
                      }
                    }
                  });
              }
              };
                
                
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



    function initGoodsList(curPage,initPage,type){
      $("#checkedAll").prop("checked", false)
      var params = {
            "goodsName":$(".goods-name-select").val(),
            "pageNo": curPage,
            "type":type
          }
        console.log(params)
        $.ajax({
        type: "post",
        url: basePath+'/sys/activity/getJoinMainActivityGoodsList',
        contentType: "application/json",
        data:JSON.stringify(params),
        dataType: 'json',
        beforeSend: function (xhr) {
        xhr.setRequestHeader('token', token);
    },
        success: function(data) {
          console.log(data);
          if(data.resultCode==0){
            $(".spec-th").show();
            var res = data.data.data;
            console.log(res);
            var html ='';
            if(res!=null){
              for(var i=0;i<res.length;i++){
                html+=
                '<tr activityno = "'+res[i].activityNo+'" type = "'+res[i].type+'"><td><input type="checkbox" name="commodity" title=""></td>'+
              '<td>'+(i+1)+'</td><td>'+res[i].goodsName+'</td>'+
              '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
              var attrname1 ="";
                var price ="";
                if(res[i].goodsSkuList != null){
                  for(var j = 0;j<res[i].goodsSkuList.length;j++){
                    attrname1 +='<div>'+(res[i].goodsSkuList[j].attrName==null?"-":res[i].goodsSkuList[j].attrName)+'</div>'
                    price+='<div>￥'+(res[i].goodsSkuList[j].vipPrice)/100+'/'+(res[i].goodsSkuList[j].normalPrice)/100+'</div>'
                  }
                }
               
               html += '<td>'+attrname1+'</td>'+
                    '<td>'+price+'</td></tr>'
              }
              
            }else{
              html+='<tr><td colspan="6" class="layui-td-nodata" style="height:200px"></td></tr>'
                  
            }
            $("#select_box").html(html);
            var total = data.data.total;


            layer.open({
              type:1
              ,title: "导入活动商品"
              ,content: $('#select_wrap')
              ,area: ['800px', '600px'] //宽高
              ,btn: ['取消', '确定'] //只是为了演示
              ,success:function(){
                $("#select_wrap").show();
                if(total>20){
                  laypage.render({
                   elem: 'pageLists' //注意，这里的 test1 是 ID，不用加 # 号
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
                        initGoodsSearch(obj.curr,false,initType);
                        $(window).scrollTop(0);
                      }
                    }
                 });
                }
              }
              ,yes: function(){
                  layer.closeAll();
                  $("#select_wrap").hide();
              }
              ,btn2: function(){
                var attrs = [];
                $("#select_box tr").each(function(i){
                  if($(this).find("input").is(':checked')){
                    var attrid = $(this).attr("activityno");
                    attrs.push(attrid);
                  }
                });
                if(attrs.length==0){
                  layer.msg("您还未勾选", {icon: 5});
                  return false;
                }else{
                  rightOpera(attrs.join(","),1,initType);
                }

                //导入
              }
            });   
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
	
	//删除图片
	$(".del-img").click(function(){
	   $(this).parents(".banner-wrap").siblings(".upload-banner-img").addClass("default").attr("src","../images/default.png");
	    $(this).parents(".banner-uploadbox").removeClass("has");
	})
	
	//重传
	$(".reload-img").click(function(){
	  $(this).siblings(".upload-banner").click();
	})
	
	//置顶事件
	$(document).on("click",".upload-btn",function(){
		var $this = $(this);
		var isTop = $this.parents("tr").attr("isTop");
		var topPic = $this.parents("tr").attr("topPic");
		var activityNo = $this.parents("tr").attr("activityid");
		var modelType = $this.parents("tr").attr("modeltype");
		if(isTop==0){
			if(topPic==""||topPic==" "||topPic=="null"){//没有置顶图 上传置顶图
				layer.open({
				  type:1
				  ,title: '上传置顶图'
				  ,content: $('#uploadImg')
				  ,area: ['500px', '350px'] //宽高
				  ,btn: ['取消', '置顶'] //只是为了演示
				  ,success:function(){
					if(!$(".upload-banner-img").hasClass("default")){
						$(".upload-banner-img").addClass("default").attr("src","../images/default.png");
						$(".upload-banner-img").parents(".banner-uploadbox").removeClass("has");
					}
					
				  }
				  ,yes: function(){
				      layer.closeAll();
				      //$("#uploadImg").hide();
				  }
				  ,btn2: function(){
					if($(".upload-banner-img").hasClass("default")){
						layer.msg("请先上传置顶图！", {icon: 5});
						return false;
					}else{
						topPic = $(".upload-banner-img").attr("src");
						// $this.addClass("istop").text("取消置顶");
						setTopping(activityNo,1,modelType,topPic)
					}
					
				  }
				}); 
			}else{
				setTopping(activityNo,1,modelType,topPic)
			}
		}else{
			setTopping(activityNo,0,modelType,topPic)
		}
		
	})
	
	function setTopping(activityNo,isTop,modelType,topPic){
		var params = {
		          "activityNo": activityNo,
				  "isTop": isTop,
				  "modelType": modelType,
		          "topPic": topPic,
		        }
		        console.log(params)
		      $.ajax({
		          type: "post",
		          url: basePath+'/sys/activity/setTopping',
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
							initRightList(cur_page,false);
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
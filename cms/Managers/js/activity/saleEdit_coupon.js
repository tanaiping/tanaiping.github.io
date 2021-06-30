layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var  couponid = "",activityid = "",ifr_src = "";
    var type =0;   //  保存类型1-新增;2-修改;
    var goodsType = 0; //保存类型1-商品;2-卡卷;
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      couponid = $("#iframe",parent.document.body).attr("couponid");
      ifr_src = $("#iframe",parent.document.body).attr("src");
      activityid = $("#iframe",parent.document.body).attr("activityid");
      goodsType = $("#iframe",parent.document.body).attr("goodstype"); 
    }

    //判断是列表页 还是详情页面
    if(ifr_src.indexOf("editType")!= -1){ //编辑
    	type = 2;
        editExchange(activityid);
    }else{//新增
        type = 1;
        initExchangeDetailInfo(couponid);
    }

    
    //保存商品列表
    form.on('submit(saleSubmit)', function(data){
    	var _this = $(this);
        saveSaleChange(_this,goodsType,type);
        return false;
    });

    

	function initExchangeDetailInfo(goodsId){
      $.ajax({
          type: "post",
          url: basePath+'/sys/activity/getCouponDetail?couponId='+couponid,
          contentType: "application/json",
          dataType: 'json',
          // data:JSON.stringify(params),
          beforeSend: function (xhr) {
             xhr.setRequestHeader('token', token);
          },
          success: function(data) {
            console.log(data);
            if(data.resultCode==0){
              var res = data.data;
              var html='';
              html+='<tr unionkey="'+res.id+'"><td>1</td><td class="activityName">'+res.goodsName+'</td>'+
                  '<td><img src="'+res.thumbPic+'" alt="" style="height: 60px;"></td>'
	              var price ="";
                price+='<div>'+(res.vipPrice)/100+'/'+(res.normalPrice)/100+'</div>'
	           
	           html += '<td>'+price+'</td></tr>'
              $("#saleData").html(html);

              
              $(".stock span").text(res.stock);
              $(".costPrice span").text((res.costPrice)/100);
              $(".marketPrice span").text((res.marketPrice)/100);

              	//执行一个laydate实例
			    var startDate = laydate.render({
			      elem: '#shelves_start', //指定元素
			      type: 'datetime',
			      value:res.startTime,
			      trigger: 'click', //触发事件
			      istime: true, //是否开启时间选择
			      isclear: true, //是否显示清空
			      istoday: true, //是否显示今天
			      issure: true, //是否显示确认
			      min: res.startTime, //设定最小日期为当前日期  
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
			      elem: '#shelves_end', //指定元素
			      type: 'datetime',
			      value:res.endTime,
			      trigger: 'click', //触发事件
			      istime: true, //是否开启时间选择
			      isclear: true, //是否显示清空
			      istoday: true, //是否显示今天
			      issure: true, //是否显示确认
			      min: res.startTime, //设定最小日期为当前日期  
      			  max: res.endTime, //最大日期 laydate.now(-1)
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


    function editExchange(activityNo){
    	$.ajax({
          type: "post",
          url: basePath+'/sys/activity/getActivityPanicBuyDetail?activityNo='+activityNo,
          contentType: "application/json",
          dataType: 'json',
          // data:JSON.stringify(params),
          beforeSend: function (xhr) {
             xhr.setRequestHeader('token', token);
          },
          success: function(data) {
            console.log(data);
            if(data.resultCode==0){
              var res = data.data;
              goodsType = data.data.type; //1.商品 2卡券
              var html='';
              html+='<tr  unionkey="'+res.unionKey+'" skuid="'+res.goodsSkuList[0].skuId+'" specid="'+res.goodsSkuList[0].specId+'" activityid="'+res.goodsSkuList[0].activityId+'"><td>1</td><td class="activityName">'+res.goodsName+'</td>'+
                  '<td><img src="'+res.thumbPic+'" alt="" style="height: 60px;"></td>'
	              var price ="";
		                price+='<div>'+(res.goodsSkuList[0].vipPrice)/100+'/'+(res.goodsSkuList[0].normalPrice)/100+'</div>'
	           
	           html += '<td>'+price+'</td></tr>'
              $("#saleData").html(html);
              $(".stock span").text(res.goodsSkuList[0].stock);
              $(".costPrice span").text((res.goodsSkuList[0].costPrice)/100);
              $(".marketPrice span").text((res.goodsSkuList[0].marketPrice)/100);
              $(".panicPrice").val((res.goodsSkuList[0].panicPrice)/100);
              
              $("#back_currency").val(res.goodsSkuList[0].returnPoint);
              if(res.goodsSkuList[0].returnPoint==0){
              	$("#isfb").html('<input type="checkbox" name="isfb" title="是否返币" lay-filter="isfb">');
              	$("#back_currency").attr("readonly",true).removeAttr("lay-verify");
              }else{
              	$("#isfb").html('<input type="checkbox" name="isfb" title="是否返币" lay-filter="isfb" checked>');
              	$("#back_currency").removeAttr("readonly").attr("lay-verify","required|Number");
              }
              form.render();
			  $("#activityName").val(res.goodsName);
              //执行一个laydate实例
			    var startDate = laydate.render({
			      elem: '#shelves_start', //指定元素
			      type: 'datetime',
			      value:res.startTime,
			      trigger: 'click', //触发事件
			      istime: true, //是否开启时间选择
			      isclear: true, //是否显示清空
			      istoday: true, //是否显示今天
			      issure: true, //是否显示确认
			      min: res.startTime, //设定最小日期为当前日期  
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
			      elem: '#shelves_end', //指定元素
			      type: 'datetime',
			      value:res.endTime,
			      trigger: 'click', //触发事件
			      istime: true, //是否开启时间选择
			      isclear: true, //是否显示清空
			      istoday: true, //是否显示今天
			      issure: true, //是否显示确认
			      min: res.startTime, //设定最小日期为当前日期  
      			  max: res.endTime, //最大日期 laydate.now(-1)
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
    function saveSaleChange(obj,goodsType,type){
    	var activityName = $(".activityName").text();
		var activityName2 = $("#activityName").val();
    	var startTime = $("#shelves_start").val();
    	var endTime = $("#shelves_end").val();
    	var list = [];
    		var unionKey ='';
	    	if(goodsType ==1){// 商品
	    		unionKey = $("#saleData tr").attr("skuid");
	    	}else{//卡券
	    		unionKey = $("#saleData tr").attr("unionkey");
	    	}
	    	var panicPrice = $(".panicPrice").val()*100;
	    	var returnPoint = 0;
	    	if($("#isfb .layui-form-checkbox").hasClass('layui-form-checked')){
	    		returnPoint = $("#back_currency").val();
	    	}
	    	var activityid = $("#saleData tr").attr("activityid");
	    	var objlist = {
					      "id": activityid,
					      "type": goodsType,
					      "activityName": activityName,
					      "unionKey": unionKey,
					      "panicPrice": panicPrice,
					      "returnPoint": returnPoint,
					      "startTime": startTime,
					      "endTime": endTime
					    };
				list.push(objlist);
				console.log(list);

    	if(!obj.hasClass("disabled")){
            obj.addClass("disabled");
		    	var params = {
					  "goodsId": couponid,
					  "goodsType": goodsType,
					   "activityName":activityName2,
					  "list": list,
					  "type": type
					}
					console.log(params);
		      $.ajax({
		          type: "post",
		          url: basePath+'/sys/activity/saveActivityPanicBuyDetail',
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
			              var history_src = localStorage.getItem('history_src');
			              $("#iframe", window.parent.document).attr("src",history_src);
			            },1000);

		            }else if(data.resultCode==3){
		              localStorage.removeItem('role');
		              localStorage.removeItem('token');
		              top.location.href="/cms/login.html?rdm="+Math.random();
		            }else{
		              layer.msg(data.resultMsg, {icon: 5});
		              obj.removeClass("disabled");
		            }
		          },
		          fail: function() {
		            //layer.msg("网络异常，请稍后再试！", {icon: 5});
		          }
		      });
		  }

    }

    

});
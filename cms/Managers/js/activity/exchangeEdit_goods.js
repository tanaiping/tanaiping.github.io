layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var  goodsid = "",activityid = "",ifr_src = "";
    var type =0;   //  保存类型1-新增;2-修改;
    var goodsType = 0; //保存类型1-商品;2-卡卷;
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      goodsid = $("#iframe",parent.document.body).attr("goodsid");
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
        initExchangeDetailInfo(goodsid);
    }

    
    //监听导出商品列表
    form.on('submit(exchangeSubmit)', function(data){
    	var _this = $(this);
        saveExchangeChange(_this,goodsType,type);
        return false;
    });

    

	function initExchangeDetailInfo(goodsId){
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/getGoodsDetail?goodsId='+goodsId,
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
              html+='<tr><td>1</td><td class="activityName">'+res.goodsName+'</td>'+
                  '<td><img src="'+res.thumbPic+'" alt="" style="height: 60px;"></td>'
                  var attrname1 ="";
	              var price ="";
		          if(res.goodsSkuList != null){
		              for(var j = 0;j<res.goodsSkuList.length;j++){
		                attrname1 +='<div>'+res.goodsSkuList[j].attrName+'</div>'
		                price+='<div>'+(res.goodsSkuList[j].vipPrice)/100+'/'+(res.goodsSkuList[j].normalPrice)/100+'</div>'
		              }
		          }
	           
	           html += '<td>'+attrname1+'</td><td>'+price+'</td></tr>'
              $("#exchangeData").html(html);

              var spechtml ='';
              if(res.goodsSkuList!=null){
              	for(var i=0;i<res.goodsSkuList.length;i++){
              		$(".spec-name").text(res.goodsSkuList[0].specName);
	              	spechtml +=' <tr attrid="'+res.goodsSkuList[i].attrId+'" unionkey="'+res.goodsSkuList[i].unionKey+'" skuid="'+res.goodsSkuList[i].skuId+'" specid="'+res.goodsSkuList[i].specId+'"><td>'+res.goodsSkuList[i].attrName+'</td><td>'+res.goodsSkuList[i].stock+'</td><td>'+(res.goodsSkuList[i].costPrice)/100+'</td><td>'+(res.goodsSkuList[i].marketPrice)/100+'</td><td>'+(res.goodsSkuList[i].vipPrice)/100+'</td>'+
	                  '<td><div class="layui-input-inline" style="width: 100px;"><input type="text" required  lay-verify="required|isTwoDecimalsFloat" placeholder="兑换价" autocomplete="off"  class="layui-input exchange-price" >'+
	                  '</div><div class="layui-input-inline" style="width: auto;"> <div class="form-desc">元+</div></div>'+
	                  '<div class="layui-input-inline" style="width: 100px;">'+
	                  '<input type="text" required  lay-verify="required|zhengshu" placeholder="花花币" autocomplete="off" class="layui-input coin-price"  ></div>'+
	                  '<div class="layui-input-inline" style="width: auto;"> <div class="form-desc">币</div></div>'+
	                  '</td></tr>'
              	}

              }

              $("#exchangeSell").html(spechtml);
              var start_val = res.startTime == null?start_val="":start_val = res.startTime;
              var start_min = res.startTime == null?start_min='1990-01-01':start_min = res.startTime;
              var start_max = res.startTime == null?start_max='2900-01-01':start_max = res.startTime;
              var end_val = res.endTime == null?start_val="":start_val = res.endTime;

              	//执行一个laydate实例
			    var startDate = laydate.render({
			      elem: '#shelves_start', //指定元素
			      type: 'datetime',
			      value:start_val,
			      trigger: 'click', //触发事件
			      istime: true, //是否开启时间选择
			      isclear: true, //是否显示清空
			      istoday: true, //是否显示今天
			      issure: true, //是否显示确认
			      min: start_min, //设定最小日期为当前日期  
      			  max: start_max, //最大日期 laydate.now(-1)
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
			      value:end_val,
			      trigger: 'click', //触发事件
			      istime: true, //是否开启时间选择
			      isclear: true, //是否显示清空
			      istoday: true, //是否显示今天
			      issure: true, //是否显示确认
			      min: start_min, //设定最小日期为当前日期  
      			  max: start_max, //最大日期 laydate.now(-1)
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


    function editExchange(activityId){
    	$.ajax({
          type: "post",
          url: basePath+'/sys/activity/getActivityExchangeDetail?activityNo='+activityId,
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
              html+='<tr><td>1</td><td class="activityName">'+res.goodsName+'</td>'+
                  '<td><img src="'+res.thumbPic+'" alt="" style="height: 60px;"></td>'
                  var attrname1 ="";
	              var price ="";
		          if(res.goodsSkuList != null){
		              for(var j = 0;j<res.goodsSkuList.length;j++){
		                attrname1 +='<div>'+res.goodsSkuList[j].attrName+'</div>'
		                price+='<div>'+(res.goodsSkuList[j].vipPrice)/100+'/'+(res.goodsSkuList[j].normalPrice)/100+'</div>'
		              }
		          }
	           
	           html += '<td>'+attrname1+'</td><td>'+price+'</td></tr>'
              $("#exchangeData").html(html);

              var spechtml ='';
              if(res.goodsSkuList!=null){
              	for(var i=0;i<res.goodsSkuList.length;i++){
              		$(".spec-name").text(res.goodsSkuList[0].specName);
	              	spechtml +=' <tr attrid="'+res.goodsSkuList[i].attrId+'" unionkey="'+res.goodsSkuList[i].unionKey+'" skuid="'+res.goodsSkuList[i].skuId+'" specid="'+res.goodsSkuList[i].specId+'" activityid="'+res.goodsSkuList[i].activityId+'"><td>'+res.goodsSkuList[i].attrName+'</td><td>'+res.goodsSkuList[i].stock+'</td><td>'+(res.goodsSkuList[i].costPrice)/100+'</td><td>'+(res.goodsSkuList[i].marketPrice)/100+'</td><td>'+(res.goodsSkuList[i].vipPrice)/100+'</td>'+
	                  '<td><div class="layui-input-inline" style="width: 100px;"><input type="text" required  lay-verify="required|isTwoDecimalsFloat" placeholder="兑换价" autocomplete="off"  class="layui-input exchange-price" value="'+(res.goodsSkuList[i].excPrice)/100+'" >'+
	                  '</div><div class="layui-input-inline" style="width: auto;"> <div class="form-desc">元+</div></div>'+
	                  '<div class="layui-input-inline" style="width: 100px;">'+
	                  '<input type="text" required  lay-verify="required|zhengshu" placeholder="花花币" autocomplete="off" class="layui-input coin-price" value="'+res.goodsSkuList[i].excPoint+'" ></div>'+
	                  '<div class="layui-input-inline" style="width: auto;"> <div class="form-desc">币</div></div>'+
	                  '</td></tr>'
              	}


              }

              $("#exchangeSell").html(spechtml);

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
			      min: '1990-01-01', //设定最小日期为当前日期   laydate.now(-7)
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
			      min: res.startTime, //设定最小日期为当前日期   laydate.now(-7)
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


    function saveExchangeChange(obj,goodsType,type){
    	var activityName = $(".activityName").text();
    	var startTime = $("#shelves_start").val();
    	var endTime = $("#shelves_end").val();
    	var list = [];
    	$("#exchangeSell tr").each(function(){
    		var unionKey ='';
	    	if(goodsType ==1){// 商品
	    		unionKey = $(this).attr("skuid");
	    	}else{//卡券
	    		unionKey = $(this).attr("unionkey");
	    	}
	    	var excPrice = $(this).find(".exchange-price").val()*100;
	    	var excPoint = $(this).find(".coin-price").val();
	    	var activityid = $(this).attr("activityid");
	    	var objlist = {
					      "id": activityid,
					      "type": goodsType,
					      "activityName": activityName,
					      "unionKey": unionKey,
					      "excPrice": excPrice,
					      "excPoint": excPoint,
					      "startTime": startTime,
					      "endTime": endTime
					    };
				list.push(objlist);    
    	})
    	if(!obj.hasClass("disabled")){
            obj.addClass("disabled");
		    	var params = {
					  "goodsId": goodsid,
					  "goodsType": goodsType,
					  "list": list,
					  "type": type
					}
					console.log(params);
		      $.ajax({
		          type: "post",
		          url: basePath+'/sys/activity/saveActivityExchangeDetail',
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
			              if(type == 2){//修改
			              	$("#iframe", window.parent.document).attr("src",history_src+"&editback=1");
			              }else{//新增
			              	$("#iframe", window.parent.document).attr("src",history_src);
			              }
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
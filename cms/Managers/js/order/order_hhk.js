layui.use(['jquery','element','layer','form','laydate','laypage','upload'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,upload = layui.upload
    ,laypage = layui.laypage
    ,laydate = layui.laydate;
	
	var _initPage = 0;
    //获取用户渠道列表
    initUserAgent();
    //初始化列表
    setTimeout(function(){initOrderList(1,true)},500);


    //监听搜索
    form.on('submit(searchOrderCard)', function(data){
      initOrderList(1,true);
      return false;
    });

    //监听导出
    form.on('submit(exportOrderList)', function(data){
      exportOrderList(1);
      return false;
    });

    //退款
    $(document).on('click','.refund-btn',function(){
      var orderNo = $(this).parents("tr").attr("orderNo");
       layer.confirm('确认申请退款？',{
            title:"退款提示",
            btn: ['取消','确认'] //按钮
          }, function(){
            layer.closeAll()
          }, function(){
             refund(orderNo);
          });
      return false;

    });
	
	//发卡
	$(document).on('click','.send-btn',function(){
	  var orderNo = $(this).parents("tr").attr("orderNo");
	   layer.confirm('请核对手机号与订单号确定发卡吗？',{
	        title:"确认发卡？",
	        btn: ['取消','确认'] //按钮
	      }, function(){
	        layer.closeAll()
	      }, function(){
	         sendCard(orderNo);
	      });
	  return false;
	
	});

    function refund(orderNo){
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/update/vipOrderStatus',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify({"orderNo":orderNo}),
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
        },
          success: function(data) {
            if(data.resultCode==0){
              layer.msg("退款成功", {icon: 1});
              setTimeout(function(){
				  initOrderList(_initPage,false)
                // $("#iframe",parent.document.body).attr({"src":"order/order_hhk.html?rdm="+Math.random()});
              },500)
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
	
	//发卡
	function sendCard(orderNo){
	  $.ajax({
	      type: "post",
	      url: basePath+'/sys/user/updateStatus/vipOrderCoupon',
	      contentType: "application/json",
	      dataType: 'json',
	      data:JSON.stringify({"orderNo":orderNo}),
	      beforeSend: function (xhr) {
	      xhr.setRequestHeader('token', token);
	    },
	      success: function(data) {
	        if(data.resultCode==0){
	          layer.msg("操作成功", {icon: 1});
	          setTimeout(function(){
				  initOrderList(_initPage,false)
	            // $("#iframe",parent.document.body).attr({"src":"order/order_hhk.html?rdm="+Math.random()});
	          },500)
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

    

    function initUserAgent(){
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/userAgent/list',
          contentType: "application/json",
          dataType: 'json',
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
        },
          success: function(data) {
            if(data.resultCode==0){
              var res = data.data;
              // console.log(res);
              if(res){
                var html = '';
                for(var i = 0;i<res.length;i++){
                  html +='<option value="'+res[i].agentKey+'">'+res[i].agentName+'</option>'
                }
                $("#media").html(html);
                form.render("select");
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

    
    
    function initOrderList(curPage,initPage){
      var mobile = $("#mobile").val();
      var agentKey = $("#media").val();
      var status = $("#ship_type").val();
      var startTime = $("#order_start").val();
      var endTime = $("#order_end").val();
      if(mobile !=""&&mobile !=null){
        if(!phoneFun(mobile)){
          layer.msg("请输入正确的手机号", {icon: 5});
          return false;
        }
      }
      var params = {
            "agentKey": agentKey,
            "etime": endTime,
            "mobile": mobile,
            "pageNo": curPage,
            "status": status,
            "stime": startTime
          }
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/vipOrder/list',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
        },
          success: function(data) {
            if(data.resultCode==0){
                var html =''
                var res = data.data;
                console.log(res);
                if(res.data!=null&&res.data.length!=0){
                  for(var i=0;i<res.data.length;i++){
						var status = '';
						switch(res.data[i].status){
							case 1:
								status = '待付款';
								 break;
							case 2:
								status = '待发卡';
								 break;
							case 3:
								status = '已发卡';
								 break;	 
							case 4:
								status = '已完成';
								 break;
							case 5:
								status = '已取消';
								 break;
							case 6:
								status = '已退款';
								 break;
						}
                      html += '<tr orderNo = "'+res.data[i].orderNo+'"><td>'+(i+1)+'</td><td>'+res.data[i].mobile+'</td><td>'+res.data[i].uid+'</td>'+
                               '<td>'+res.data[i].orderNo+'</td><td>'+res.data[i].agentName+'</td><td>'+res.data[i].createTime+'</td><td>'+(res.data[i].payTime!=null?res.data[i].payTime:'-')+'</td>'+
                               '<td>'+status+'</td>'
                               if(res.data[i].status == 2){
                               html += '<td><button class="layui-btn layui-btn-danger send-btn">发卡</button><button class="layui-btn layui-btn-primary refund-btn">退款</button></td>'
                             }else{
                              html += '<td>&nbsp;</td>'
                             }
                               html+='</tr>'
                  }
                  $("#orderData").html(html);
                  var total = data.data.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }else{
                  html+='<tr><td colspan="9" class="layui-td-nodata"></td></tr>'
                      $("#orderData").html(html);
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

    //上传券码文件
    upload.render({ //允许上传的文件后缀
      elem: '#upload_file'
      ,url: basePath+'/sys/user/import/orderData'
      ,headers: {token: token}
      ,accept: 'file' //普通文件
      ,exts: 'txt' //只允许上传压缩文件
      ,size: 2048  //kb
      ,before: function(obj){ 
        // this.data={'bisId':userId};
      }
      ,done: function(data){
        if(data.resultCode==0){
          console.log(data.data);
          if(data.data == "success"){
            layer.msg("导入成功", {icon: 1});
          }else{
            layer.msg("数据有误，导入失败", {icon: 5});
            setTimeout(function(){window.open(data.data)},500)
          }
        }else if(data.resultCode==3){
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            top.location.href="/cms/login.html?rdm="+Math.random();
        }else{
          layer.msg(data.resultMsg, {icon: 5});
        }
      }
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
          	initOrderList(obj.curr,false);
			_initPage = obj.curr;
          	$(window).scrollTop(0);
          }
        }
     });
    }


     function exportOrderList(curPage){
      var mobile = $("#mobile").val();
      var agentKey = $("#media").val();
      var status = $("#ship_type").val();
      var startTime = $("#order_start").val();
      var endTime = $("#order_end").val();
      if(mobile !=""&&mobile !=null){
        if(!phoneFun(mobile)){
          layer.msg("请输入正确的手机号", {icon: 5});
          return false;
        }
      }
      var params = {
            "agentKey": agentKey,
            "etime": endTime,
            "mobile": mobile,
            "pageNo": curPage,
            "status": status,
            "stime": startTime
          }
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/export/orderData',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
        },
          success: function(data) {
            if(data.resultCode==0){
                top.location.href = data.data;
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



    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#order_start', //指定元素
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
      elem: '#order_end', //指定元素
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

    //判断是否为手机号的正则表达式
    function phoneFun(phones){
        var myreg = /\d{11}$/;
        if (!myreg.test(phones)) {
            console.log('手机号格式不正确')
          return false;
        } else {
            console.log('手机号格式正确')
          return true;
        }
    }

});
layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate
    ,laypage = layui.laypage;

    var nowTime = new Date();
    var LDate = new Date(nowTime - 1000 * 60 * 60 * 24 * 30);
    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#order_start', //指定元素
      trigger: 'click', //触发事件
      value:LDate,
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
      elem: '#order_end', //指定元素
      trigger: 'click', //触发事件
      value:nowTime,
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
    //初始化昨日分析数据
    initYesData();

     //订单列表数据
    setTimeout(function(){initOrderList(1,true)},500);
	
	//订单详情
	$(document).on("click",".detail-btn",function(){
		var reportTime = $(this).parents("tr").attr("reportTime");
	    localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
	    $("#iframe", window.parent.document).removeAttr("goodsid").attr({"src":'statistic/orderDetail.html?'+Math.random(),"reportTime":reportTime});
	    return false;
	});


    //监听订单分析查询
    form.on('submit(searchOrderAnalyse)', function(data){
        initOrderList(1,true);
        return false;
    });

    //监听订单分析导出
    form.on('submit(exportOrderAnalyse)', function(data){
        exportOrderList(1);
        return false;
    });

    function initYesData(){
      $.ajax({
          type: "get",
          url: basePath+"/sys/analyse/getYesterdayOrderData",
          contentType: "application/json",
          dataType: 'json',
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var res =data.data;
              $("#addOrder").text(res.addOrder);
              $("#payOrder").text(res.payOrder);
              $("#price").text(res.price);

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
      var startTime = $("#order_start").val();
      var endTime = $("#order_end").val();
      var params = {
            "endTime": endTime,
            "pageNo": curPage,
            "startTime": startTime
          }
      
      $.ajax({
          type: "post",
          url: basePath+"/sys/analyse/getOrderList",
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var res =data.data;
              if(res.data!=null){
                var html='';
                for(var i=0;i<res.data.length;i++){
                    html += '<tr reportTime = "'+ res.data[i].reportTime +'"><td>'+res.data[i].reportTime+'</td><td>'+res.data[i].addOrder+'</td>'+
                            '<td>'+res.data[i].paidOrder+'</td><td>'+res.data[i].unPaidOrder+'</td>'+
                            '<td>'+res.data[i].cancelOrder+'</td><td>'+res.data[i].price+'</td>'+
							'<td><button class="layui-btn layui-btn-normal detail-btn">查看</button></td></tr>'
							
                }

                $("#analyseData").html(html);
                var total = data.data.total;
                if(total>20){
                          if(initPage){page(total);$("#pageList").show();};
                      }else{
                          $("#pageList").hide();
                      }
              }else{
                    html+='<tr><td colspan="6" class="layui-td-nodata"></td></tr>'
                    $("#analyseData").html(html);
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

    function exportOrderList(curPage){
      var startTime = $("#order_start").val();
      var endTime = $("#order_end").val();
      var params = {
            "endTime": endTime,
            "pageNo": curPage,
            "startTime": startTime
          }
      
      $.ajax({
          type: "post",
          url: basePath+"/sys/analyse/exportOrderList",  
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
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

    $(".down-up").click(function(){
    	if($(this).hasClass("layui-icon-down")){
    		$(this).removeClass("layui-icon-down").addClass("layui-icon-up");
    		$(this).parents(".com-header").next(".days-order-box").hide();
    	}else{
    		$(this).addClass("layui-icon-down").removeClass("layui-icon-up");
    		$(this).parents(".com-header").next(".days-order-box").show();
    	}
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
          	initOrderList(obj.curr,false);
          	$(window).scrollTop(0);
          }
        }
     });
    }


});
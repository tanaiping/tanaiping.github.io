layui.use(['jquery','element','layer','form','laydate','upload','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate
    ,upload = layui.upload;

    

     
    initOrderList(1,true);

    //监听搜索订单列表
    form.on('submit(searchOrderList)', function(data){
        initOrderList(1,true);
        return false;
    });

    //监听导出订单列表downloadDemo
    form.on('submit(exportOrderList)', function(data){
        exportOrderList(1);
        return false;
    });

    

    
    
    //查看订单
    $(document).on('click','.order-look',function(){
      var orderid = $(this).parents("tr").attr('orderid');
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe",parent.document.body).attr({"src":"order/goodsOrderDetail.html?rdm="+Math.random(),"orderid":orderid});
    });

    //发货
    $(document).on('click','.goods-ship',function(){
      var orderid = $(this).parents("tr").attr('orderid');
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe",parent.document.body).attr({"src":"goods/goodsShip.html?rdm="+Math.random(),"orderid":orderid});
    });

    //查看物流  复制
    var clipboard = new ClipboardJS('.view-logistics');
    clipboard.on('success', function(e) {
        // console.info('Action:', e.action);
        // console.info('Text:', e.text);
        // console.info('Trigger:', e.trigger);
        layer.msg('您已复制物流单号，稍后可直接粘贴查询物流信息', {icon: 1});
        setTimeout(function(){
        top.location.href="https://www.kuaidi100.com/";
      },1500);
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        // console.error('Action:', e.action);
        // console.error('Trigger:', e.trigger);
    });


    //退款
    // $(document).on('click','.refund-btn',function(){
    //   var orderid = $(this).parents("tr").attr('orderid');
    //   localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
    //   $("#iframe",parent.document.body).attr({"src":"goods/refund.html?rdm="+Math.random(),"orderid":orderid});
    // });

    

    //退款/退货
    $(document).on('click','.goodsBack-btn',function(){
      var orderid = $(this).parents("tr").attr('orderid');
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe",parent.document.body).attr({"src":"goods/returns.html?rdm="+Math.random(),"orderid":orderid});
    });

    //通过
    $(document).on('click','.order-pass',function(){
      //把状态 改为 待发货
      var orderid = $(this).parents("tr").attr("orderid");
      orderOperate(orderid,2);
    });

    //拒绝
    $(document).on('click','.order-refuse',function(){
      //把状态 改为 待付款
      var orderid = $(this).parents("tr").attr("orderid");
      orderOperate(orderid,1);
      return false;
    });



    //导入发货信息
    upload.render({ //允许上传的文件后缀
      elem: '#importShipInfo'
      ,url: basePath+'/sys/goods/importDeliverGoodsList'
      ,headers: {token: token}
      ,accept: 'file' //普通文件
      ,exts: 'txt|xls' //只允许上传压缩文件
      ,size: 2048  //kb
      ,before: function(obj){ 
        //this.data={'bisId':userId};
      }
      ,done: function(data){
        if(data.resultCode==0){
          // clearInterval(interResult);
          // fileId = data.data.fileId;
          // interResult = setInterval(function(){getResult(fileId,1)},500);
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


    
    
    //下载发货模板
    $(document).on('click','.downloadDemo',function(){
      var start = $("#demo_start").val();
      var end = $("#demo_end").val();
      var html ='<form class="layui-form" action="">'+
              '<div class="layui-form-item">'+
              '<label class="layui-form-label">开始时间</label>'+
              '<div class="layui-input-inline" style="width: 200px;">'+
              '<input type="text" class="layui-input layui-input-date" id="ship_start" readonly="true" placeholder="上架时间">'+
              '</div></div>'+
              '<div class="layui-form-item">'+
              '<label class="layui-form-label">结束时间</label>'+
              '<div class="layui-input-inline" style="width: 200px;">'+
              '<input type="text" class="layui-input layui-input-date" id="ship_end" readonly="true" placeholder="下架时间">'+
              '</div></div></form>'
        layer.confirm(html,{
            title:"下载发货模板",
            btn: ['取消','确定'], //按钮
            area: ['400px', '250px'],
            success:function(){
              //执行一个laydate实例
              var startDate = laydate.render({
                elem: '#ship_start', //指定元素
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
                elem: '#ship_end', //指定元素
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
              // form.render();
            }
          }, function(){
            layer.closeAll()
          }, function(){
              var params = {
                "startTime": $("#ship_start").val(),
                "endTime": $("#ship_end").val(),
               }
            $.ajax({
                type: "post",
                url: basePath+'/sys/goods/exportDeliverGoodsList',
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

          });
        form.render();
        return false;
    });

    
    //异常订单的通过  拒绝
    function orderOperate(orderId,type){
      var params = {
        orderId:orderId,
        status:type
      }
      $.ajax({
            type: "post",
            url: basePath+'/sys/goods/abnormalOrderOperate',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              // console.log(data);
              if(data.resultCode==0){
                  layer.msg("操作成功！", {icon: 1});
                     setInterval(function(){
                      var history_src = localStorage.getItem('history_src');
                      $("#iframe", window.parent.document).attr("src",history_src);
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


    //获取订单列表
    function initOrderList(curPage,initPage){
      var goodsName = $("#goods_name").val();
      var orderNo = $("#order_num").val();
      var logisticNo = $("#logistic_num").val();
      var startTime = $("#order_start").val();
      var endTime = $("#order_end").val();
      var goodsType = $("#goods_type").val();
      var rmobile = $("#receiver_tel").val();
	  var goodsSupplier = $("#goodsSupplier").val();
	  var mobile = $("#mobile").val();
      if(mobile !=""&&mobile !=null){
        if(!phoneFun(mobile)){
          layer.msg("请输入正确的手机号", {icon: 5});
          return false;
        }
      }
      var params = {
          "endTime": endTime,
          "goodsName": goodsName,
          "logisticNo":logisticNo,
          "orderNo": orderNo,
          "pageNo": curPage,
          "rmobile": rmobile,
          "startTime": startTime,
          "status": goodsType,
          "goodsSupplier":goodsSupplier,
          "mobile":mobile
        }
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/getGoodsOrderList',
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
                if(res.data!=null&&res.data.length!=0){
                  console.log(res);
                  for(var i=0;i<res.data.length;i++){
                      var g_status ="";
                      if(res.data[i].status==0){
                        g_status ="用户已删除"
                      }else if(res.data[i].status==1){
                        g_status ="待付款"
                      }else if(res.data[i].status==2){
                        g_status ="待发货"
                      }else if(res.data[i].status==3){
                        g_status ="待收货"
                      }else if(res.data[i].status==4){
                        g_status ="已完成"
                      }else if(res.data[i].status==5){
                        g_status ="已取消"
                      }else if(res.data[i].status==6){
                        g_status ="订单异常"
                      }else if(res.data[i].status==99){
                        g_status ="已退款"
                      }
                      var bz ="-";
                      if(res.data[i].reason!=null){
                        bz = res.data[i].reason;
                      }
                      var timeStr ='';
                      if(res.data[i].createTime !=null){
                      	timeStr += "下单时间："+res.data[i].createTime+'<br/>'
                      }
					  if(res.data[i].payTime !=null){
                      	timeStr += "付款时间："+res.data[i].payTime+'<br/>'
                      }
					  if(res.data[i].deliverTime !=null){
                      	timeStr += "发货时间："+res.data[i].deliverTime+'<br/>'
                      }
					  if(res.data[i].endTime !=null){
					  	timeStr += "收货时间："+res.data[i].endTime+'<br/>'
					  }
					  if(res.data[i].cancelTime !=null){
                      	timeStr += "取消时间："+res.data[i].cancelTime+'<br/>'
                      }
					  
					  if(res.data[i].status==0){
							timeStr += "删除时间："+res.data[i].updateTime+'<br/>'
                      }
					  if(res.data[i].refundTime !=null){
                      	timeStr += "退款时间："+res.data[i].refundTime+'<br/>'
                      }
					
                      html += '<tr orderid ="'+res.data[i].id+'" goodsSkuId ="'+res.data[i].goodsSkuId+'"><td>'+(i+1)+'</td><td>'+res.data[i].orderNo+'</td><td>'+(res.data[i].goodsSupplier==""?"-":res.data[i].goodsSupplier)+'</td><td>'+res.data[i].mobile+'</td><td>'+res.data[i].rname+'</td><td>'+res.data[i].rmobile+'</td>'+
                              '<td>'+res.data[i].address+'</td><td>'+res.data[i].goodsName+'*'+res.data[i].num+'<br/>'+res.data[i].attrName+';￥'+((res.data[i].price)/100).toFixed(2)+'</td>'+
                              '<td>￥'+((res.data[i].amount)/100+(res.data[i].freight)/100).toFixed(2)+'</td><td>￥'+(res.data[i].marketPrice/100).toFixed(2)+'</td><td>￥'+(res.data[i].costPrice/100).toFixed(2)+'</td>'+
							  '<td>'+timeStr+'</td>'+
                              '<td class="status-txt">'+g_status+'</td><td>'+bz+'</td><td style="white-space: nowrap;">'+
                              '<button class="layui-btn layui-btn-danger order-look">查看</button>'
                              
                                if(res.data[i].status==2){//待发货
                                  html +='<button class="layui-btn layui-btn-normal goods-ship">发货</button>'+
                                  '<button class="layui-btn layui-btn-normal goodsBack-btn">退款/退货</button>'
                                }else if(res.data[i].status==3){//待收货
                                  html +='<button class="layui-btn view-logistics" data-clipboard-text="'+res.data[i].logisticNo+'">查看物流</button>'+
                                  '<button class="layui-btn layui-btn-normal goodsBack-btn">退款/退货</button>'
                                }else if(res.data[i].status==4){//已完成
                                  html +='<button class="layui-btn view-logistics" data-clipboard-text="'+res.data[i].logisticNo+'">查看物流</button>'+
                                  '<button class="layui-btn layui-btn-normal goodsBack-btn">退款/退货</button>'
                                }else if(res.data[i].status==6){//已完成
                                  html +='<button class="layui-btn layui-btn order-pass">通过</button>'+
                                  '<button class="layui-btn layui-btn-normal order-refuse">拒绝</button>'+
                                  '<button class="layui-btn layui-btn-normal goodsBack-btn">退款/退货</button>'
                                }
                                  html +='</td></tr>'

                  }
                  $("#orderData").html(html);
                  var total = data.data.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }else{
                  html+='<tr><td colspan="15" class="layui-td-nodata"></td></tr>'
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

    //导出订单列表
    function exportOrderList(curPage){
      var goodsName = $("#goods_name").val();
      var orderNo = $("#order_num").val();
      var logisticNo = $("#logistic_num").val();
      var startTime = $("#order_start").val();
      var endTime = $("#order_end").val();
      var goodsType = $("#goods_type").val();
      var rmobile = $("#receiver_tel").val();
	  var goodsSupplier = $("#goodsSupplier").val();
      var params = {
          "endTime": endTime,
          "goodsName": goodsName,
          "logisticNo":logisticNo,
          "orderNo": orderNo,
          "pageNo": curPage,
          "rmobile": rmobile,
          "startTime": startTime,
          "status": goodsType,
          "goodsSupplier":goodsSupplier
        }
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/exportGoodsOrderList',
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

     var orderTime = laydate.render({
      elem: '#order_time', //指定元素
      trigger: 'click', //触发事件
      istime: true, //是否开启时间选择
      isclear: true, //是否显示清空
      istoday: true, //是否显示今天
      issure: true, //是否显示确认
      min: '1990-01-01', //设定最小日期为当前日期  
      max: '2900-01-01', //最大日期 laydate.now(-1)
      done: function(value,date){
      }
    });
    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#order_start', //指定元素
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
      elem: '#order_end', //指定元素
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

    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#demo_start', //指定元素
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
      elem: '#demo_end', //指定元素
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
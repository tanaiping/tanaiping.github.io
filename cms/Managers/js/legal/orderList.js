layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    
    //查看订单
    $(document).on('click','.order-look',function(){
      var orderid = $(this).parents("tr").attr('orderid');
      // var source = $(this).parents("tr").attr('source');
       localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe",parent.document.body).attr({"src":"legal/legalOrderDetail.html?rdm="+Math.random(),"orderid":orderid});
    });

    InitOrderList(1,true);

    //监听搜索
    form.on('submit(orderListSearch)', function(data){
      InitOrderList(1,true);
      return false;
    });
    //监听搜索
    form.on('submit(exportTableInfo)', function(data){
      exportOrderList(1);
      return false;
    });

    
    laydate.render({
      elem: '#pay_time', //指定元素
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

    function InitOrderList(curPage,initPage){
      var goodsName = $("#goods_name").val();
      var orderNum = $("#order_num").val();
      var receiverTel = $("#receiver_tel").val();
      var payTime = $("#pay_time").val();
      var status = $("#client_type .layui-this").attr('lay-value');
      var resultCode = $("#api_type .layui-this").attr('lay-value');
      // var source = $("#source_data .layui-this").attr('lay-value');
        var params = {
            "mobile": receiverTel,
            "orderCode": orderNum,
            "pageNo": curPage,
            "payTime": payTime,
            "resultCode": resultCode,
            "rightName": goodsName,
            "status": status,
            // "source": source
          }
      $.ajax({
            type: "post",
            url: basePath+'/sys/right/getMrightOrderlist',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                var res =data.data;
                  if(res.data!=null&&res.data.length!=0){
                    var html='';
                    for(var i=0;i<res.data.length;i++){
                      var clientStatus = '';
                      if(res.data[i].status == 0){
                        clientStatus = "未支付"
                      }else if(res.data[i].status == 1){
                        clientStatus = "支付成功"
                      }else if(res.data[i].status == 2){
                        clientStatus = "支付失败"
                      }else if(res.data[i].status == 3){
                        clientStatus = "支付超时"
                      }else if(res.data[i].status == 4){
                        clientStatus = "支付取消"
                      }else if(res.data[i].status == 5){
                        clientStatus = "等待下单"
                      }else if(res.data[i].status == 6){
                        clientStatus = "下单成功"
                      }else if(res.data[i].status == 7){
                        clientStatus = "下单失败"
                      }else if(res.data[i].status == 8){
                        clientStatus = "订单删除"
                      }
                      var apiStatus = '';
                      if(res.data[i].resultCode == 0){
                        apiStatus = "成功"
                      }else if(res.data[i].resultCode == 1){
                        apiStatus = "失败"
                      }
                        html += '<tr orderid = "'+res.data[i].id+'"><td>'+(i+1)+'</td><td>'+res.data[i].orderCode+'</td><td>'+res.data[i].mobile+'</td>'+
                                '<td>'+res.data[i].rightName+'</td>'+
                                '<td>'+res.data[i].pay+'</td><td>'+res.data[i].payTime+'</td><td>'+clientStatus+'</td><td>'+apiStatus+'</td>'+
                                '<td><button class="layui-btn layui-btn-danger order-look">查看</button></tr>'
                    }

                    $("#orderData").html(html);
                    var total = data.data.total;
                    if(total>20){
                              if(initPage){page(total);$("#pageList").show();};
                          }else{
                              $("#pageList").hide();
                          }
                  }else{
                        html+='<tr><td colspan="10" class="layui-td-nodata"></td></tr>'
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
            InitOrderList(obj.curr,false);
            $(window).scrollTop(0);
          }
        }
     });
    }

    function exportOrderList(curPage,initPage){
      var goodsName = $("#goods_name").val();
      var orderNum = $("#order_num").val();
      var receiverTel = $("#receiver_tel").val();
      var payTime = $("#pay_time").val();
      var status = $("#client_type .layui-this").attr('lay-value');
      var resultCode = $("#api_type .layui-this").attr('lay-value');
      // var source=$("#source_data .layui-this").attr('lay-value');

        var params = {
            "mobile": receiverTel,
            "orderCode": orderNum,
            "pageNo": curPage,
            "payTime": payTime,
            "resultCode": resultCode,
            "rightName": goodsName,
            // "source": source,
            "status": status
          }
      $.ajax({
            type: "post",
            url: basePath+'/sys/right/exportMrightOrderList',
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

    

});
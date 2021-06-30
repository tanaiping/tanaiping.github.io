layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;


    //判断是券申请 还是编辑
    var  orderid = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      orderid = $("#iframe",parent.document.body).attr("orderid");
    }
    InitOrderDetail(orderid);

    //初始化快递公司列表
    initCourierCompany();

    form.on('radio(refund)', function(data){
        console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        console.log(data.elem.checked);
        if(data.value==0){
          $(".refund-form").hide().find("input").removeAttr("lay-verify")
        }else{
          $(".refund-form").show().find("input").attr("lay-verify","required");
        }
        return false;
    });  

    //监听退款
    form.on('submit(refund)', function(data){
      var _this = $(this);
        refund(orderid,_this);
        return false;
    });

    //订单详情
    function InitOrderDetail(orderId){
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/getGoodsOrderDetail?orderId='+orderId,
          contentType: "application/json",
          dataType: 'json',
          // data:JSON.stringify({"orderId":orderId}),
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var res = data.data;
              var orderStatus ="";
              if(res.status==0){
                orderStatus = "用户已删除";
              }else if(res.status==1){
                orderStatus = "待付款";
              }else if(res.status==2){
                orderStatus = "待发货";
              }else if(res.status==3){
                orderStatus = "待收货";
              }else if(res.status==4){
                orderStatus = "已完成";
              }else if(res.status==5){
                orderStatus = "已取消";
              }else{
                orderStatus = "订单异常";
              }
              $("#order_status").text(orderStatus);
              $("#order_no").text(res.orderNo);
              $("#rname").text(res.rname);
              $("#rmobile").text(res.rmobile);
              $("#address").text(res.address);
              $("#goodsSkuId").text(res.goodsSkuId+";"+res.num+";"+(res.price/100).toFixed(2)+";");
              $("#payTime").text(res.payTime);
              $("#usePoint").text(res.usePoint);
              $("#amount").text((res.amount/100).toFixed(2));
              $("#orderTime").text(res.createTime);
              $("#pay_Info").text(res.payOrderNo);
              $("#buy_mobile").text(res.mobile);
              $("#createTime").text(res.createTime);
              

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

    function initCourierCompany(){
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/getLogistic',
          contentType: "application/json",
          dataType: 'json',
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              console.log(data);
              var res = data.data;
              var html = ''; 
              for(var i=0;i<res.length;i++){
                html +='<option value="'+res[i].id+'">'+res[i].logisticName+'</option>'
              }
              $("#courierCompany select").html(html);
              form.render();
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

    //退货、退款
    function refund(orderId,obj){
      if(!obj.hasClass("disabled")){
            obj.addClass("disabled");
            var reason = $("#refund_reason").val();
            var logisticNo = $("#logistic_no").val();
            var courierCompany = $("#courierCompany .layui-this").attr('lay-value');
            var params = {
                  "logisticId": courierCompany,
                  "logisticNo": logisticNo,
                  "orderId": orderId,
                  "reason": reason
                }
                console.log(params);
              $.ajax({
                  type: "post",
                  url: basePath+'/sys/goods/saveCancelOrderReason',
                  contentType: "application/json",
                  dataType: 'json',
                  data:JSON.stringify(params),
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
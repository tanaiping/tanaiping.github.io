layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var orderid = $("#iframe",parent.document.body).attr("orderid");

    initShipInfo(orderid);

    //初始化快递公司列表
    initCourierCompany();
    
    //监听确认发货
    form.on('submit(shipSubmit)', function(data){
      var _this = $(this);
        shipSubmit(orderid,_this);
        return false;
    });

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

    

    //初始化发货信息
    function initShipInfo(orderId){
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
              $("#order_no").text(res.orderNo);
              $("#rname").text(res.rname);
              $("#rmobile").text(res.rmobile);
              $("#address").text(res.address);

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

    //发货
    function shipSubmit(orderId,obj){
      if(!obj.hasClass("disabled")){
            obj.addClass("disabled");
          var courierCompany = $("#courierCompany .layui-this").attr('lay-value');
          var logisticNo = $("#logistic_no").val();
          var params = {
                "logisticId": courierCompany,
                "logisticNo": logisticNo,
                "orderId": orderId
              }
          $.ajax({
              type: "post",
              url: basePath+'/sys/goods/saveDeliverGoodsInfo',
              contentType: "application/json",
              dataType: 'json',
              data:JSON.stringify(params),
              beforeSend: function (xhr) {
             xhr.setRequestHeader('token', token);
          },
              success: function(data) {
                console.log(data);
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
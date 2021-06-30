//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,laypage=layui.laypage
    ,form = layui.form;


    var total = 0;

    //监听订单搜索
    form.on('submit(searchBtn)', function(data){
        var ordercode=$("#order_code").val();
        var uid=$("#order_uid").val();
        var status=$("#pay_type").val();
        var checkStatus=$("#order_checkstatus").val();
        var source=$("#source_data").val();
        getOrderList(1,true);
        return false;
    });
    
    getOrderList(1,true);

    $(document).keypress(function(e) {  
      // 回车键事件  
       if(e.which == 13) {  
        getOrderList(1,true);
       }  
   }); 
     //分页
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
            getOrderList(obj.curr,false);
            $(window).scrollTop(0);
          }
        }
     });
    }

    //订单列表
    function getOrderList(cur_page,initPage){
        var ordercode=$("#order_code").val();
        var uid=$("#order_uid").val();
        var status=$("#pay_type").val();
        var checkStatus=$("#order_checkstatus").val();
        var source=$("#source_data").val();
        var params={
          "orderCode":ordercode
          ,"uid":uid
          ,"status":status
          ,"pageNo":cur_page
          ,"checkStatus":checkStatus
          ,"source":source
        }
        $.ajax({
          type: "post",
          url: basePath+'/sys/order/getOrderList',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
             xhr.setRequestHeader('token', token);
          },
          success: function(data) {
            var order = data.data;
            if(data.resultCode==0){
                if(order.data!=null){
                  var html='';
                  for(var i=0;i<order.data.length;i++){
                    //核销状态
                      var checkStatus="";
                      if(order.data[i].checkStatus==0){
                        checkStatus="未核销";
                      }else if(order.data[i].checkStatus==1){
                        checkStatus="已核销";
                      }else{
                        checkStatus="-";
                      }
                      //支付状态
                      var status="";
                      if(order.data[i].status==-1){
                        status="全部";
                      }else if(order.data[i].status==0){
                        status="未支付";
                      }else if(order.data[i].status==1){
                        status="支付成功";
                      }else if(order.data[i].status==2){
                        status="支付失败";
                      }else if(order.data[i].status==3){
                        status="支付超时";
                      }else{
                        status="支付取消";
                      }
                      var couponCode="";
                      if(order.data[i].couponCode==null){
                        couponCode="--";
                      }else{
                        couponCode = order.data[i].couponCode;
                      }

                      var updateTime = order.data[i].updateTime;
                      if(order.data[i].updateTime==null){
                        updateTime="--";
                      }
                    html+='<tr>'
                    html+='<td>'+(i+1)+'</td><td>'+couponCode+'</td><td>'+order.data[i].couponName+'</td><td>'+order.data[i].createTime+'</td>'
                    html+='<td>'+updateTime+'</td><td>'+order.data[i].orderCode+'</td><td>'+order.data[i].pay/100+'</td>'
                    html+='<td>'+order.data[i].price/100+'</td><td>'+order.data[i].amount+'</td><td>'+status+'</td><td>'+order.data[i].uid+'</td><td>'+checkStatus+'</td>'
                    html+='</tr>'
                  }
                  $("#order_list").html(html);
                  total = order.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }
                else{
                  html+='<tr><td colspan="12" class="layui-td-nodata"></td></tr>'
                  $("#order_list").html(html);
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



  });

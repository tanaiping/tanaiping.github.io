//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laydate','upload'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,upload=layui.upload
    ,laydate = layui.laydate;

      layer.load();
      setTimeout(function(){
        var couponId = "";
        if($("#iframe",parent.document.body).attr("src")!=undefined){
          couponId = $("#iframe",parent.document.body).attr("couponId");
        }
        getScheduleInfo(couponId);
      },1000)

      //$("#cp-box").val()

      //获取卡券排期详情
      function getScheduleInfo(couponId){ //
          $.ajax({
              type: "get",
              url: basePath+'/sys/coupon/getScheduleInfo?couponId='+couponId,
              contentType: "application/json",
              dataType: 'json',
              beforeSend: function (xhr) {
                 xhr.setRequestHeader('token', token);
              },
              success: function(data) {
                if(data.resultCode==0){
                  $("#ScheduleInfoId").val(data.data.id);  //这个ID需要回传
                  $("#coupon_cost").val(parseInt(data.data.cost)/100);
                  $("#coupon_price").val(parseInt(data.data.price)/100);
                  $("#coupon_salePrice").val(parseInt(data.data.salePrice)/100);
                  $("#coupon_disPrice").val(parseInt(data.data.disPrice)/100);
                  var startTime = data.data.startTime;
                  var endTime = data.data.endTime;
                  $("#ticket_start").val(startTime);
                  $("#ticket_end").val(endTime);
                  $("#coupon_max").val(data.data.maxLimit);
                  //城市
                  var cityList= data.data.cityList;
                  console.log(cityList);
                  if(cityList!=null&&cityList.length>0){
                    $(".city-box .layui-form-radio").eq(1).click();//点击其他
                    for(var i=0;i<cityList.length;i++){
                        $("#cityList input").each(function(index) {
                          var cityId = $(this).val();
                           if(cityList[i].id==cityId){
                            $(this).next(".layui-form-checkbox").click();
                           }
                        });
                    }
                  }

                  layer.closeAll('loading');
                  $("#extend_detail").show();
                  
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

      //监听提交  js计算有问题 先X100 再除100
    form.on('submit(extend_detail_btn)', function(data){
        var coupon_startTime = $("#ticket_start").val();
        var coupon_endTime = $("#ticket_end").val();
        var coupon_deadline = $("#stop_date").text();
        var maxLimit = $("#coupon_max").val();
        var price =$("#coupon_price").val()*100;
        var cost = $("#coupon_cost").val()*100;
        var salePrice = $("#coupon_salePrice").val()*100;
        var disPrice = $("#coupon_disPrice").val()*100;
        //拼成城市列表对象
        var clist =[];
        $(".city-box .layui-form-radio").each(function(i){
           if($(this).hasClass('layui-form-radioed')){
              if($(this).prev("input").val()!=0){//   0 全国  1 其他
                  $("#cityList .layui-form-checkbox").each(function(i){
                     if($(this).hasClass('layui-form-checked')){
                      var city_id = $(this).prev("input").val();
                      var city_cityName= $(this).prev("input").attr("title");
                      var city_elem = {"id":city_id,"cityName":city_cityName};
                      clist.push(city_elem);
                     }
                  })
              }
           }
        })
        
        //卡券分类
        var tagKey ="";
        $("#tagKey .layui-form-checkbox").each(function(i){
           if($(this).hasClass('layui-form-checked')){
            tagKey += $(this).prev("input").val()+",";
           }
        })
        tagKey = tagKey.substring(0,tagKey.length-1);

        // if(coupon_total<maxLimit){
        //    layer.msg("最大限制卡券数不能大于卡券总数", {icon: 5});
        //    return false;
        // }
        //截止时间必须大于等于发券时间
        if(new Date(coupon_deadline).getTime()<new Date(coupon_endTime).getTime()){
          layer.msg("截止时间必须大于等于发券时间", {icon: 5});
          return false;
        }

      var params ={
          "cityList": clist,
          "cost": parseInt(cost.toFixed(2)),
          "couponId": $("#coupon_name").attr("couponId"),
          "endTime": coupon_endTime,
          "price": parseInt(price.toFixed(2)),
          "startTime": coupon_startTime,
          "maxLimit": maxLimit,
          "id":$("#ScheduleInfoId").val(),
          "tagKey":tagKey,
          "salePrice": parseInt(salePrice.toFixed(2)),
          "disPrice": parseInt(disPrice.toFixed(2)),
        }
        issuTicket_detail(params)
        return false;
    });


     //卡券发放事件
    function issuTicket_detail(params){
      $.ajax({
          type: "post",
          url: basePath+'/sys/coupon/edit/assign',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
             xhr.setRequestHeader('token', token);
          },
          success: function(data) {
            if(data.resultCode==0){
               window.location.href="../ticket/audTicket.html?rdm="+Math.random();
              // $(".layui-nav-item",parent.document.body).removeClass('layui-this');
              // $("#m02",parent.document.body).addClass('layui-this');
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
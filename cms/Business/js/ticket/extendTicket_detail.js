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
                  var startTime = data.data.startTime;
                  var endTime = data.data.endTime;
                  $("#ticket_start").val(startTime);
                  $("#ticket_end").val(endTime);
                  $("#coupon_max").val(data.data.maxLimit);

                    var topImgHtml = '';
                    if(data.data.logoType==0){
                      topImgHtml+='<input type="radio" name="istop" value="1" title="是" >';
                      topImgHtml+='<input type="radio" name="istop" value="0" title="否" checked="">';
                    }else{
                      topImgHtml+='<input type="radio" name="istop" value="1" title="是"  checked="">';
                      topImgHtml+='<input type="radio" name="istop" value="0" title="否">';
                    }
                    $(".top-box").html(topImgHtml);
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

                  //权益
                  var deliveType=data.data.deliveType;
                  if(deliveType==0){
                    $("#cp_content").hide();
                    $(".cp-box .layui-form-radio").eq(1).click();
                    layer.closeAll('loading');
                    $("#extend_detail").show();
                  }else{
                    $("#cp_content").show();
                    $(".cp-box .layui-form-radio").eq(0).click();

                    var cpId = data.data.cpId;
                    $("#cp_tab li").each(function(){
                      if($(this).attr("cpid")==cpId){
                        $(this).click();
                      }
                    });
                    var ruleList =data.data.ruleList;
                    setTimeout(function(){
                      $(".rule-elem").each(function(i){
                        if(ruleList!=null&&ruleList.length>0){
                          var obj = $(this).find('input');
                          for(var x =0;x<ruleList.length;x++){
                             if(ruleList[x].ruleId==obj.val()){
                                obj.siblings('.layui-form-checkbox').click();
                                obj.parent(".rule-elem").find(".input_1").val(ruleList[x].value);
                                obj.parent(".rule-elem").find(".input_2").val(ruleList[x].disPrice/100);
                             }
                          }

                        }
                      })
                      layer.closeAll('loading');
                      $("#extend_detail").show();
                      
                    },500);
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

      //监听提交  js计算有问题 先X100 再除100
    form.on('submit(extend_detail_btn)', function(data){
        var coupon_startTime = $("#ticket_start").val();
        var coupon_endTime = $("#ticket_end").val();
        var coupon_deadline = $("#stop_date").text();
        var maxLimit = $("#coupon_max").val();
        var price =$("#coupon_price").val()*100;
        var cost = $("#coupon_cost").val()*100;
        var salePrice = $("#coupon_salePrice").val()*100;
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
        //权益  非权益的值
        var deliveType=0;
        $(".cp-box .layui-form-radio").each(function(i){
           if($(this).hasClass('layui-form-radioed')){
              deliveType = $(this).prev("input").val();
           }
        })
        var logoType = 0;
        $(".top-box .layui-form-radio").each(function(i){
           if($(this).hasClass('layui-form-radioed')){
              logoType = $(this).prev("input").val();
           }
        })
        //权益数组对象
        var ruleList = [];

        $(".rule-elem .layui-form-checkbox").each(function(i){
           if($(this).hasClass('layui-form-checked')){
            var ruleId = $(this).prev("input").val();
            var grad_v= $(this).parents(".rule-elem").find('.input_1').val();
            var disPrice= parseFloat($(this).parents(".rule-elem").find('.input_2').val())*100;
            var rule_e = {"disPrice": parseInt(disPrice.toFixed(2)),"ruleId": ruleId,"value": grad_v};
            ruleList.push(rule_e);
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
        var flag =false;//判断在权益投放情况下 是否勾选了至少一个规则 默认没勾
        $(".rule-elem .layui-form-checkbox").each(function(){
          if($(this).hasClass('layui-form-checked')){
            flag=true;
          }
        })
        if(!flag&&deliveType==1){
          layer.msg("权益投放至少勾选一个投放规则", {icon: 5});
          return false;
        }
        if(ruleList.length>0){
          for(var i=0;i<ruleList.length;i++){
            if(ruleList[i].disPrice>salePrice){
              layer.msg("券权益价不能大于券折扣价", {icon: 5});
              return false;
            }
          }
        }

      var params ={
          "cityList": clist,
          "cost": parseInt(cost.toFixed(2)),
          "couponId": $("#coupon_name").attr("couponId"),
          "endTime": coupon_endTime,
          "price": parseInt(price.toFixed(2)),
          "startTime": coupon_startTime,
          "deliveType":deliveType,
          "maxLimit": maxLimit,
          "ruleList":ruleList,
          "id":$("#ScheduleInfoId").val(),
          "tagKey":tagKey,
          "salePrice": parseInt(salePrice.toFixed(2)),
          "logoType":logoType,
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
//JavaScript代码区域
layui.use(['jquery','element','layer', 'form','laydate','upload'], function(){
    var element = layui.element
    ,$ = layui.$;  //重点之处。 引入jquery

    $(".coupon-detail-m").click(function(){
      $("#iframe",parent.document.body).attr({"src":"ticket/audTicket.html?rdm="+Math.random()});
    });

    layer.load();

    //判断是券申请 还是编辑
    var  couponId = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      couponId = $("#iframe",parent.document.body).attr("couponId");
    }

    var cpList ={};  
    var ruleList ={};
    var ruleStr =""  //存取权益的字符串

    getCpList();
    detailTicket(couponId);


    //加载权益CP列表
    function getCpList(){
      $.ajax({
            type: "get",
            url: basePath+'/sys/cp/list',
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                 cpList = data.data;
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

    //加载权益规则列表
    function getRuleList(cpId,ruleId,value,price){
      $.ajax({
            type: "get",
            url: basePath+'/sys/cp/rule/list?cpId='+cpId,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                 if(data.data!=null){
                    for(var m=0;m<data.data.length;m++){
                         if(data.data[m].id==ruleId){
                            ruleStr+=' ('+data.data[m].ruleName+"【"+data.data[m].id +"】:"+value+data.data[m].ruleUnit+","+price/100+"元/券权益价) ";
                            $("#media").html(ruleStr);
                         }
                     }
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

    //获取卡券详情
    function detailTicket(couponId){
        $.ajax({
            type: "get",
            url: basePath+'/sys/coupon/detail?couponId='+couponId,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
                 xhr.setRequestHeader('token', token);
            },
            success: function(data) {
                if(data.resultCode==0){
                    var res = data.data;
                    $("#coupon_name").text(res.couponName);
                    if(res.type==1){
                      $("#coupon_type").text("电子券");
                    }else if(res.type==2){
                      $("#coupon_type").text("代金券");
                    }else{
                      $("#coupon_type").text("实物券");
                    }
                    var source="";
                    if(res.source==0){
                      source="外部券";
                    }else{
                      source="内部券";
                    }
                    $("#coupon_source").text(source);
                    // $("#bus_name").text(res.bisName); //商户名称
                    
                    $("#coupon_total span").text(res.total);
                    var  remark=res.remark;
                    remark =remark.replace('\\n',"<br />");
                    remark =remark.replace('\\r',"<br />");
                    $("#coupon_desc").html(remark); 
                    for(var x=0;x<res.imgList.length;x++){
                      $("#detail_logo").append('<img src="'+res.imgList[x].imgUrl+'" alt="" class="coupon-uploadimg detail_logo">')
                    }
                    $(".list_logo").attr("src",res.logo)
                    $(".banner-logo").attr("src",res.bannerLogo);
                    $("#coupon_cost span").text(res.cost/100);
                    $("#coupon_price span").text(res.price/100);
                    $("#coupon_stores").html(res.shop);
                    var startTime = res.startTime;
                    var endTime = res.endTime;
                    var deadline = res.deadline 
                    $("#stop_date").text(deadline);
                    $("#start_date").text(startTime);
                    $("#end_date").text(endTime);
                    $("#coupon_phone").text(res.phone);
                    $("#coupon_url").text(res.linkUrl);
                    if(res.feedback==1){
                      $("#lz").text("是("+res.feedItem+")");
                    }else{
                      $("#lz").text("否");
                    }
                    if(res.reFund==0){
                      $("#refund").text("是");
                    }else{
                      $("#refund").text("否");
                    }
                    var cityStr="";
                    if(res.cityList!=null){
                        for(var i=0;i<res.cityList.length;i++){
                            if(i==0){
                                cityStr+= res.cityList[i].cityName;
                            }else{
                                cityStr+= ","+res.cityList[i].cityName;
                            }
                        }
                    }
                    //卡券分类
                    var tagT = "";
                    var tagList =res.tagList;
                    var tagKey = res.tagKey;
                        if(tagKey!=null&&tagKey!=""){
                        tagKey = tagKey.split(",");
                        for(var x =0;x<tagKey.length;x++){
                            for(var i=0;i<tagList.length;i++){
                                if(tagKey[x]==tagList[i].id){
                                    tagT+=tagList[i].tagName+",";
                                }
                            
                            }
                        }
                        tagT = tagT.substring(0,tagT.length-1);
                    }
                    $("#tagKey").text(tagT);
                    if(cityStr==""){
                        cityStr="全部";
                    }
                    $("#cityList").text(cityStr);
                    $("#coupon_max span").text(res.maxLimit);

                    detailAudTicket(couponId);

                }else if(res.resultCode==3){
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

    //获取排期详情
    function detailAudTicket(couponId){
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
                    var res = data.data;
                    if(res!=null){
                        $("#coupon_cost span").text(res.cost/100);
                        $("#coupon_price span").text(res.price/100);
                        $("#coupon_salePrice span").text(res.salePrice/100);
                        var cityStr="";
                        if(res.cityList!=null){
                            for(var i=0;i<res.cityList.length;i++){
                                if(i==0){
                                    cityStr+= res.cityList[i].cityName;
                                }else{
                                    cityStr+= ","+res.cityList[i].cityName;
                                }
                            }
                        }
                        //卡券分类
                        var tagT = "";
                        var tagList =res.tagList;
                        var tagKey = res.tagKey;
                            if(tagKey!=null&&tagKey!=""){
                            tagKey = tagKey.split(",");
                            for(var x =0;x<tagKey.length;x++){
                                for(var i=0;i<tagList.length;i++){
                                    if(tagKey[x]==tagList[i].id){
                                        tagT+=tagList[i].tagName+",";
                                    }
                                
                                }
                            }
                            tagT = tagT.substring(0,tagT.length-1);
                        }
                        $("#tagKey").text(tagT);
                        var startTime = res.startTime;
                        var endTime = res.endTime;
                        $("#start_date").text(startTime);
                        $("#end_date").text(endTime);
                        if(cityStr==""){
                            cityStr="全部";
                        }
                        $("#cityList").text(cityStr);
                        $("#coupon_max span").text(res.maxLimit);
                        
                        if(res.deliveType==1){
                            ruleStr +="权益券投放";
                            for(var x=0;x<cpList.length;x++){
                                 if(cpList[x].id==res.cpId){
                                    ruleStr = cpList[x].cpName; //获取CP名字
                                    if(res.ruleList!=null){
                                        for(var y=0;y<res.ruleList.length;y++){
                                            getRuleList(res.cpId,res.ruleList[y].ruleId,res.ruleList[y].value,res.ruleList[y].disPrice);
                                        }
                                    }
                                 }
                            }
                            $("#rule_con").text(ruleStr);
                            $("#rule-list").show();
                        }else{
                            $("#media").html('非权益投放');
                        }
                    }

                    layer.closeAll('loading');
                    $("#ticket_form").show();
                    
                }else if(res.resultCode==3){
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
//JavaScript代码区域
layui.use(['jquery','element','layer', 'form','laydate','upload'], function(){
    var element = layui.element
    ,$ = layui.$;  //重点之处。 引入jquery

    $(".coupon-detail-shop").click(function(){
      $("#iframe",parent.document.body).attr({"src":"ticket/myTicket.html?rdm="+Math.random()});
    })


    //判断是券申请 还是编辑
    var  couponId = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      couponId = $("#iframe",parent.document.body).attr("couponId");
    }
    detailTicket(couponId);
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
                // console.log(data);
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
                    $(".list_logo").attr("src",res.logo);
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
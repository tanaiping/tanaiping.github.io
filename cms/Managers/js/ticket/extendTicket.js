//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laydate','upload'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,upload=layui.upload
    ,laydate = layui.laydate;
    
    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#ticket_start', //指定元素
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
      elem: '#ticket_end', //指定元素
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

    var loadingCityList = false;
    var loadingTag = false;
    getTagList();
    getCityList();
    var  couponId = "";
    var coupon_total =""
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      couponId = $("#iframe",parent.document.body).attr("couponId");
      function loadInit(){
        if(loadingCityList==true&&loadingTag==true){
          initExtend(couponId);
          clearInterval(inter);
        }
      }
      var inter = setInterval(loadInit,500);
    }
    // var cp_val = "";

    // form.on("radio",function(){
    //   cp_val = data.value
    // })

    //监听提交
	  form.on('submit(extend-btn)', function(data){
        var coupon_startTime = $("#ticket_start").val();
        var coupon_endTime = $("#ticket_end").val();
        var coupon_deadline = $("#stop_date").text();
        var maxLimit = $("#coupon_max").val();
        var price =$("#coupon_price").val()*100;
        var cost = $("#coupon_cost").val()*100;
        var salePrice =$("#coupon_salePrice").val()*100;
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
        

        
        if(coupon_total<maxLimit){
           layer.msg("最大限制卡券数不能大于卡券总数", {icon: 5});
           return false;
        }
        //截止时间必须大于等于发券时间
        if(new Date(coupon_deadline).getTime()<new Date(coupon_endTime).getTime()){
          layer.msg("截止时间必须大于等于发券时间", {icon: 5});
          return false;
        }
        

        // if(price<salePrice){
        //   layer.msg("券折扣价不能大于券原价", {icon: 5});
        //   return false;
        // }


        

      var params ={
          "cityList": clist,
          "cost": parseInt(cost.toFixed(2)),
          "price": parseInt(price.toFixed(2)),
          "salePrice": parseInt(salePrice.toFixed(2)),
          "disPrice": parseInt(disPrice.toFixed(2)),
          "couponId": $("#coupon_name").attr("couponId"),
          "endTime": coupon_endTime,
          "startTime": coupon_startTime,
          "maxLimit": maxLimit,
          "tagKey":tagKey,
        }
        issuTicket(params)
	    return false;
	  });


    //初始化发放卡券页面
    function initExtend(couponId){
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
                    $("#coupon_name").text(res.couponName).attr("couponId",couponId);
                    if(res.type==1){
                      $("#coupon_type").text("电子券");
                    }else if(res.type==2){
                      $("#coupon_type").text("代金券");
                    }else{
                      $("#coupon_type").text("实物券");
                    }
                    coupon_total = res.total;
                    $("#coupon_total span").text(coupon_total);

                    var  remark=res.remark;
                    remark =remark.replace('\\n',"<br />");
                    remark =remark.replace('\\r',"<br />");
                    $("#coupon_desc").html(remark); 
                    for(var x=0;x<res.imgList.length;x++){
                      $("#detail_logo").append('<img src="'+res.imgList[x].imgUrl+'" alt="" class="coupon-uploadimg detail_logo">')
                    }
                    $(".list_logo").attr("src",res.logo)
                    $("#coupon_stores").html(res.shop);
                    $("#coupon_cost").val(res.cost/100);
                    $("#coupon_price").val(res.price/100);
                    $("#ticket_start").val(res.startTime);
                    $("#ticket_end").val(res.endTime);
                    var deadline = res.deadline 
                    $("#stop_date").text(deadline);
                    if(res.feedback==1){
                      $("#lz").text("是("+res.feedItem+")");
                    }else{
                      $("#lz").text("否");
                    }

                    //城市
                    var cityList= res.cityList;
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
                    //卡券分类获取
                    var tagKeyD= res.tagKey;
                     tagKeyD = ","+tagKeyD+",";
                    $("#tagKey input").each(function(index) {
                      var tagkeyId = $(this).val();
                       tagkeyId = ","+tagkeyId+",";
                       if(tagKeyD.indexOf(tagkeyId)>-1){
                         $(this).next(".layui-form-checkbox").click();
                       }
                    });

                    $("#coupon_max").val(res.maxLimit);


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


    //获取城市列表
    function getCityList(){
      $.ajax({
            type: "post",
            url: basePath+'/sys/city/getCityList',
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                // <option value="0">北京</option>
                //<input type="checkbox" name="rule" value="权益券投放" title="权益券投放" checked="" >
                var html='';
                if(data.data.length>0){
                  for(var i=0;i<data.data.length;i++){
                      html+='<input type="checkbox" name="city" value="'+data.data[i].id+'" title='+data.data[i].cityName+'  style="width:150px;margin-bottom:10px;">'
                  }
                  $("#cityList").append(html);
                  form.render();//动态添加  重新渲染
                  // element.init();
                  loadingCityList =true;
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

    //卡券分类列表
    function getTagList(){
      $.ajax({
            type: "get",
            url: basePath+'/sys/coupon/getCouponTagList',
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              console.log(data);
              if(data.resultCode==0){
                var html='';
                if(data.data.length>0){
                  for(var i=0;i<data.data.length;i++){
                      html+='<input type="checkbox" name="tagNames" value="'+data.data[i].id+'" title='+data.data[i].tagName+'  style="width:150px;margin-bottom:10px;">'
                  }
                  $("#tagKey").append(html);
                  form.render();//动态添加  重新渲染
                  // element.init();
                  loadingTag = true;
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

    

    



     //卡券发放事件
    function issuTicket(params){
      $.ajax({
          type: "post",
          url: basePath+'/sys/coupon/assign',
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


    //切换城市 全国  其他
    $(".city-box").on("click",".layui-form-radio",function(){
      var index = $(".city-box .layui-form-radio").index(this);
      if(index==1){
        $("#cityList").show();
        console.log("OTHER")
      }else{
       $("#cityList").hide();
      }
    });


    





  });
//JavaScript代码区域
layui.use(['jquery','element','layer', 'form','laydate','upload','layedit'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate
    ,layedit = layui.layedit
    ,upload = layui.upload;

    var loadingCityList =false;
    var loadingTag = false;
    var source =0;
	
	//是否显示留资 1显示  0 隐藏
	var isFeedback = parseInt(localStorage.getItem('feedback'));
	if(isFeedback == 0){
		$("#lz_radio,#lz_conbox").hide();
	}

    var ueEditor = layedit.build('coupon_desc', { //建立编辑器
        height: 300,
//      uploadImage: { url: basePath + '/sys/editorUpload.ajax', type: 'post' }
    }); 
    var ueEditor_s = layedit.build('coupon_stores', { //建立编辑器
        height: 300,
//      uploadImage: { url: basePath + '/sys/editorUpload.ajax', type: 'post' }
    }); 

    
    //判断是券申请 还是编辑
    var  ifr_src = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      ifr_src = $("#iframe",parent.document.body).attr("src");
    }

    getTagList();
    getCityList();

  if(ifr_src.indexOf("type_detail")!= -1){  //加载完城市之后再初始化详情页面 
    function loadInitDetail(){
      if(loadingCityList==true&&loadingTag==true){
        initDetail();
        clearInterval(inter);
      }
    }

    var inter = setInterval(loadInitDetail,500);
    }
    
    // initDetail();
    var fileId="";
    var interResult;  //定义一个定时变量  用时定时去调获取券码解析结果   
    //执行一个laydate实例
    laydate.render({
      elem: '#stop_date', //指定元素
      type: 'datetime',
      trigger: 'click', //触发事件
      istime: true, //是否开启时间选择
      isclear: true, //是否显示清空
      istoday: true, //是否显示今天
      issure: true, //是否显示确认
      min: '1990-01-01', //设定最小日期为当前日期  
      max: '2900-01-01', //最大日期 laydate.now(-1)
      ready: function(date){
      //初始化默认时间分为23：59：59
        this.dateTime.hours = 23;
        this.dateTime.minutes = 59;
        this.dateTime.seconds = 59;
      }
    });

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

   

    //监听提交
    form.on('submit(submitBtn)', function(data){
        var url ="";
        if(source ==0){
          url = "/sys/coupon/third/apply";
        }else{
          url = "/sys/coupon/produce/apply";
        }
        applyTicket(url,1,"#applySubmit");
        return false;
    });

    //监听保存
    form.on('submit(saveBtn)', function(data){
        var url ="";
        if(source ==0){
          url = "/sys/coupon/third/apply";
        }else{
          url = "/sys/coupon/produce/apply";
        }
        applyTicket(url,0,"#applySave");
        return false;
    });

    //监听提交  编辑
    form.on('submit(submitBtn_edit)', function(data){
        var url ="";
        if(source ==0){
          url = "/sys/coupon/third/edit";
        }else{
          url = "/sys/coupon/produce/edit";
        }
        editTicket(url,1,"#editSubmit");
        return false;
    });

    //监听保存  编辑
    form.on('submit(saveBtn_edit)', function(data){
        var url ="";
        if(source ==0){
          url = "/sys/coupon/third/edit";
        }else{
          url = "/sys/coupon/produce/edit";
        }
        editTicket(url,0,"#editSubmit");
        return false;
    });

    //监听卡券来源切换

    form.on('select(coupon_source)', function(data){
      if(data.value == 0){
          $("#import_box").show();
          $("#coupon_acount").html('<label class="layui-form-label" style="text-align: left;" id="coupon_num"><span>0</span>张</label>')
          form.render('select');
          source = 0;
      }else if(data.value == 1){
          $("#import_box").hide();
          $("#coupon_acount").html('<input type="text"  lay-verify="required|Number" placeholder="卡券数量" autocomplete="off" class="layui-input" id="coupon_num">')
          form.render('select');//select是固定写法 不是选择器
          source = 1;
      }
  });

    
    //上传券码文件
    upload.render({ //允许上传的文件后缀
      elem: '#upload_file'
      ,url: basePath+'/sys/coupon/import'
      ,headers: {token: token}
      ,accept: 'file' //普通文件
      ,exts: 'txt' //只允许上传压缩文件
      ,size: 2048  //kb
      ,before: function(obj){ 
        this.data={'bisId':userId};
      }
      ,done: function(data){
        if(data.resultCode==0){
          clearInterval(interResult);
          fileId = data.data.fileId;
          interResult = setInterval(function(){getResult(fileId,1)},500);
        }else if(data.resultCode==3){
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            top.location.href="/cms/login.html?rdm="+Math.random();
        }else{
          layer.msg(data.resultMsg, {icon: 5});
        }
      }
    });
    //上传券码文件
    upload.render({ //允许上传的文件后缀
      elem: '#upload_file_add'
      ,url: basePath+'/sys/coupon/import'
      ,headers: {token: token}
      ,accept: 'file' //普通文件
      ,exts: 'txt' //只允许上传压缩文件
      ,size: 2048  //kb
      ,before: function(obj){ 
        this.data={'bisId':userId};
      }
      ,done: function(data){
        if(data.resultCode==0){
          clearInterval(interResult);
          fileId = data.data.fileId;
          interResult = setInterval(function(){getResult(fileId,2)},500);
        }else if(data.resultCode==3){
            localStorage.removeItem('role');
            localStorage.removeItem('token');
            top.location.href="/cms/login.html?rdm="+Math.random()
        }else{
          layer.msg(data.resultMsg, {icon: 5});
        }
      }
    });

    //获取券码文件结果
    function getResult(fileId,type){
        $.ajax({
            type: "get",
            url: basePath+'/sys/coupon/getFileStatus?fileId='+fileId,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                //data.data.statue
                if(data.data.statue==1){  //待解析
                  if(type==1){
                    $("#upload_msg").text("文件解析中...").removeClass('layui-color-orange');
                  }else{
                    $("#upload_msg_add").text("文件解析中...").removeClass('layui-color-orange');
                  }
                }else if(data.data.statue==2){  //解析成功
                   if(type==1){
                     $("#upload_msg").text("成功导入"+data.data.success+"个,失败"+data.data.fail+"个").addClass('layui-color-orange');
                     $("#coupon_num span").text(data.data.success);
                  }else{
                    $("#upload_msg_add").text("成功导入"+data.data.success+"个,失败"+data.data.fail+"个").addClass('layui-color-orange');
                    var orgin = parseInt($("#coupon_num span").text());
                    $("#coupon_addnum span").text(data.data.success);
                    $("#coupon_num span").text(orgin+parseInt(data.data.success));
                  }
                  clearInterval(interResult);

                }else{  //解析失败
                  $("#upload_msg").text("");
                  layer.msg("解析失败,请重新上传！", {icon: 5});
                  clearInterval(interResult);
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

    //申请卡券
    function applyTicket(url,type,idStr){
        var coupon_name = $("#coupon_name").val();
        var coupon_status = $("#upload_msg").attr("status");
        var coupon_total = parseInt($("#coupon_num span").text());
        var coupon_remark = layedit.getContent(ueEditor);
        var shop = layedit.getContent(ueEditor_s);
        var coupon_deadline = $("#stop_date").val();
        var coupon_startTime = $("#ticket_start").val();
        var coupon_endTime = $("#ticket_end").val();
        var coupon_shop=[];
        var detailLogo=[];
        var logo = "";
        var feedback =0;
        var coupon_phone = $("#coupon_phone").val();
        var coupon_url = $("#coupon_url").val();
        var coupon_cost = $("#coupon_cost").val()*100;
        var coupon_price = $("#coupon_price").val()*100;
        var coupon_total = 0;
         if(source == 0){
            coupon_total = parseInt($("#coupon_num span").text());
          }else{
            coupon_total = parseInt($("#coupon_num").val());
          }

        if(coupon_cost >= coupon_price){
          layer.msg("券市场价必须大于券成本价", {icon: 5});
          return false;
        }
		if(isFeedback == 1){
			if($(".lz-box .layui-form-radio").eq(0).hasClass('layui-form-radioed')){
			  feedback=1;
			}else{
			  feedback=0;
			}
		}
        var reFund ="";
        if($(".refund .layui-form-radio").eq(0).hasClass('layui-form-radioed')){
          reFund=0;
        }else{
          reFund=1;
        }
        var coupon_type = $("#coupon_type .layui-this").attr('lay-value');//1：电子券  2：代金券  3：实物券
        if(coupon_remark.trim()==""){
          layer.msg("使用说明不能为空", {icon: 5});
          return false;
        }
        if(shop.trim()==""){
          layer.msg("适用门店不能为空", {icon: 5});
          return false;
        }

        var maxLimit = parseInt($("#coupon_max").val());
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

        //遍历两个logo图
        $(".detail_logo").each(function(){
            if(!$(this).hasClass("default")){
              var logo = {"imgUrl":$(this).attr("src")};
              detailLogo.push(logo);
            }
        })
        if(detailLogo.length==0){
          layer.msg("请上传卡券详情页样式LOGO", {icon: 5});
          return false;
        }
        if($(".list_logo").hasClass('default')){
          layer.msg("券列表LOGO", {icon: 5});
          return false;
        }else{
          logo = $(".list_logo").attr("src");
        }


        if(coupon_total<maxLimit){
           layer.msg("最大限制卡券数不能大于卡券总数", {icon: 5});
           return false;
        }

        //截止时间必须大于等于发券时间
        if(new Date(coupon_deadline).getTime()<new Date(coupon_endTime).getTime()){
          layer.msg("截止时间必须大于等于发券时间", {icon: 5});
          return false;
        }
        //
        if(coupon_phone!=""){
          if(isTelephone(coupon_phone)||isMobile(coupon_phone)){
            
          }else{
            layer.msg("请输入正确的电话", {icon: 5});
            return false;
          }
        }

        //留资
        var feedItem ="";
        if(feedback==1){
          $("#lz_conbox input").each(function(i){
            var len = $("#lz_conbox input").length;
            if(i!=len-1){
               feedItem+=$(this).val().trim()+"|";
            }
            else{
              feedItem+=$(this).val().trim();
            }
          })
          if(feedItem==""){
            layer.msg("至少保留一个留资项", {icon: 5});
            return false
          }
        }
        //外部链接
        // if(coupon_url!=""){
        //   if(!isUrl(coupon_url)){
        //     layer.msg("请输入正确的链接地址", {icon: 5});
        //     return false;
        //   }
        // }

        var params={
          "bisId":userId
          ,"couponName":coupon_name
          ,"deadline":coupon_deadline
          ,"startTime":coupon_startTime
          ,"endTime":coupon_endTime
          ,"fileId":fileId
          ,"remark":coupon_remark
          ,"shop":shop
          ,"status":type
          ,"total":coupon_total
          ,"type":coupon_type
          ,"imgList":detailLogo
          ,"logo":logo
          ,"feedback":feedback
          ,"source":source
          ,"phone":coupon_phone
          ,"feedItem":feedItem
          ,"linkUrl":coupon_url
          ,"maxLimit": maxLimit
          ,"cityList": clist
          ,"tagKey":tagKey
          ,"reFund":reFund
          ,"cost": parseInt(coupon_cost.toFixed(2))
          ,"price":parseInt(coupon_price.toFixed(2))
        }
        if(coupon_total!=0){
          if(!$(idStr).hasClass("layui-btn-disabled")){
            $(idStr).addClass("layui-btn-disabled");
            $.ajax({
                type: "post",
                url: basePath+url,
                contentType: "application/json",
                dataType: 'json',
                data:JSON.stringify(params),
                beforeSend: function (xhr) {
                   xhr.setRequestHeader('token', token);
                },
                success: function(data) {
                  if(data.resultCode==0){
                    window.location.href="myTicket.html?rdm="+Math.random();
                    $(".layui-nav-item dd",parent.document.body).removeClass('layui-this');
                    $("#s2101",parent.document.body).addClass('layui-this');
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
                  $(idStr).removeClass("layui-btn-disabled");
                }
            });
          }
        }else{
            layer.msg("卡券数量为0", {icon: 5});
            
        }

    }

    //申请卡券 编辑
    function editTicket(url,type,idStr){
        var couponId = "";
        if($("#iframe",parent.document.body).attr("couponId")!=undefined){
          couponId = $("#iframe",parent.document.body).attr("couponId");
        }
        var coupon_name = $("#coupon_name").val();
        var coupon_type = $("#coupon_type .layui-this").attr('lay-value');//1：电子券  2：代金券  3：实物券
        var coupon_status = $("#upload_msg").attr("status");
        
        var coupon_remark = layedit.getContent(ueEditor);
        var shop = layedit.getContent(ueEditor_s);
        var coupon_deadline = $("#stop_date").val();
        var coupon_startTime = $("#ticket_start").val();
        var coupon_endTime = $("#ticket_end").val();
        var coupon_shop=[];
        var detailLogo=[];
        var logo = "";
        var feedback =0;
        var coupon_phone = $("#coupon_phone").val();
        var coupon_url = $("#coupon_url").val();
        var coupon_cost = $("#coupon_cost").val()*100;
        var coupon_price = $("#coupon_price").val()*100;

        var coupon_total= 0,addTotal = 0;
        if(source == 0){
          coupon_total = parseInt($("#coupon_num span").text());
          addTotal = parseInt($("#coupon_addnum span").text());
        }else{
          var coupon_orgin = $("#coupon_num span").text();
          addTotal = $("#coupon_addnum").val();
          addTotal==""?addTotal = 0:addTotal;
          coupon_total = parseInt(addTotal)+parseInt(coupon_orgin);
          console.log(coupon_orgin+"==="+addTotal);
        }

        if(coupon_cost >= coupon_price){
          layer.msg("券市场价必须大于券成本价", {icon: 5});
          return false;
        }
        if(coupon_remark.trim()==""){
          layer.msg("使用说明不能为空", {icon: 5});
          return false;
        }
        if(shop.trim()==""){
          layer.msg("适用门店不能为空", {icon: 5});
          return false;
        }
		if(isFeedback == 1){
			if($(".lz-box .layui-form-radio").eq(0).hasClass('layui-form-radioed')){
			  feedback=1;
			}else{
			  feedback=0;
			}
		}
        var reFund ="";
        if($(".refund .layui-form-radio").eq(0).hasClass('layui-form-radioed')){
          reFund=0;
        }else{
          reFund=1;
        }
         var coupon_type = $("#coupon_type .layui-this").attr('lay-value');;//1：电子券  2：代金券  3：实物券

         var maxLimit = parseInt($("#coupon_max").val());
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

        //遍历两个logo图
        $(".detail_logo").each(function(){
            if(!$(this).hasClass("default")){
              var logo = {"imgUrl":$(this).attr("src")};
              detailLogo.push(logo);
            }
        })
        if(detailLogo.length==0){
          layer.msg("请上传卡券详情页样式LOGO", {icon: 5});
          return false;
        }
        if($(".list_logo").hasClass('default')){
          layer.msg("请上传券列表LOGO", {icon: 5});
          return false;
        }else{
          logo = $(".list_logo").attr("src");
        }
       
       if(coupon_total<maxLimit){
           layer.msg("最大限制卡券数不能大于卡券总数", {icon: 5});
           return false;
        }

       //截止时间必须大于等于发券时间
        if(new Date(coupon_deadline).getTime()<new Date(coupon_endTime).getTime()){
          layer.msg("截止时间必须大于等于发券时间", {icon: 5});
          return false;
        }
        //
        if(coupon_phone!=""){
          if(isTelephone(coupon_phone)||isMobile(coupon_phone)){
            
          }else{
            layer.msg("请输入正确的电话", {icon: 5});
            return false;
          }
        }
        //留资
        var feedItem ="";
        if(feedback==1){
          $("#lz_conbox input").each(function(i){
            var len = $("#lz_conbox input").length;
            if(i!=len-1){
               feedItem+=$(this).val().trim()+"|";
            }
            else{
              feedItem+=$(this).val().trim();
            }
          })
          if(feedItem==""){
            layer.msg("至少保留一个留资项", {icon: 5});
            return false
          }
        }
        //外部链接
        // if(coupon_url!=""){
        //   if(!isUrl(coupon_url)){
        //     layer.msg("请输入正确的链接地址", {icon: 5});
        //     return false;
        //   }
        // }

        var params={
          "addTotal":addTotal
          ,"couponName":coupon_name
          ,"deadline":coupon_deadline
          ,"startTime":coupon_startTime
          ,"endTime":coupon_endTime
          ,"fileId":fileId
          ,"id":couponId
          ,"remark":coupon_remark
          ,"shop":shop
          ,"status":type
          ,"total":coupon_total
          ,"type":coupon_type
          ,"imgList":detailLogo
          ,"logo":logo
          ,"feedback":feedback
          ,"source":source
          ,"phone":coupon_phone
          ,"feedItem":feedItem
          ,"linkUrl":coupon_url
          ,"maxLimit": maxLimit
          ,"cityList": clist
          ,"tagKey":tagKey
          ,"reFund":reFund
          ,"cost": parseInt(coupon_cost.toFixed(2))
          ,"price":parseInt(coupon_price.toFixed(2))
        }
        if(coupon_total!=0){
          if(!$(idStr).hasClass("layui-btn-disabled")){
            $(idStr).addClass("layui-btn-disabled");
            $.ajax({
                type: "post",
                url: basePath+url,
                contentType: "application/json",
                dataType: 'json',
                data:JSON.stringify(params),
                beforeSend: function (xhr) {
                   xhr.setRequestHeader('token', token);
                },
                success: function(data) {
                  if(data.resultCode==0){
                    window.location.href="myTicket.html";
                    $(".layui-nav-item dd",parent.document.body).removeClass('layui-this');
                    $("#s2101",parent.document.body).addClass('layui-this');
                  }else if(data.resultCode==3){
                      localStorage.removeItem('role');
                      localStorage.removeItem('token');
                      top.location.href="/cms/login.html?rdm="+Math.random();
                  }else{
                    layer.msg(data.resultMsg, {icon: 5});
                  }
                  setTimeout(function(){
                    $(idStr).removeClass("layui-btn-disabled");
                  },2000);
                },
                fail: function() {
                  //layer.msg("网络异常，请稍后再试！", {icon: 5});
                  $(idStr).removeClass("layui-btn-disabled");
                }
            });
          }
        }else{
            layer.msg("卡券数量为0", {icon: 5});
            
        }

    }


    //详情logo重传
  $(".del-img").click(function(){
     $(this).parents(".banner-wrap").siblings(".detail_logo").addClass("default").attr("src","../images/default.png");
    $(this).parents(".banner-uploadbox").removeClass("has");
  })


    //初始化详情页面数据
    function initDetail(){
      var detailData = localStorage.getItem('detail_obj');
      detailData = eval('(' + detailData + ')');
      var startTime = detailData.startTime;
      var endTime = detailData.endTime;
      var deadline = detailData.deadline 
      $("#coupon_name").val(detailData.couponName);
      //给select动态选中某个值
      $("#coupon_type select").val(detailData.type);
      form.render();
      $("#coupon_num span").text(detailData.total);
      layedit.setContent(ueEditor,detailData.remark);
      layedit.setContent(ueEditor_s,detailData.shop);
      for(var x=0;x<detailData.imgList.length;x++){
        $(".detail_logo").eq(x).attr("src",detailData.imgList[x].imgUrl).removeClass("default");
        $(".detail_logo").eq(x).parents(".banner-uploadbox").addClass("has");
      }
      $(".list_logo").attr("src",detailData.logo);
      $("#ticket_start").val(startTime);
      $("#ticket_end").val(endTime); 
      $("#stop_date").val(deadline);  
      $("#coupon_phone").val(detailData.phone);
      $("#coupon_url").val(detailData.linkUrl);
      $("#coupon_cost").val(detailData.cost/100);
      $("#coupon_price").val(detailData.price/100);
      if(detailData.source==0){
        $("#coupon_source").text("外部券").attr("source",0);
        $("#import_box").show();
        $("#coupon_acount").html('<label class="layui-form-label" style="text-align: left;" id="coupon_addnum"><span>0</span>张</label>');
        source = 0;
      }else{
        $("#coupon_source").text("内部券").attr("source",1);
        $("#import_box").hide();
        $("#coupon_acount").html('<input type="text" placeholder="新增卡券数量" autocomplete="off" class="layui-input" id="coupon_addnum">')
        source = 1;
      }
      //城市
      var cityList= detailData.cityList;
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
      var tagKeyD= detailData.tagKey;
       tagKeyD = ","+tagKeyD+",";
      $("#tagKey input").each(function(index) {
        var tagkeyId = $(this).val();
         tagkeyId = ","+tagkeyId+",";
         if(tagKeyD.indexOf(tagkeyId)>-1){
           $(this).next(".layui-form-checkbox").click();
         }
      });

      $("#coupon_max").val(detailData.maxLimit);

      if(detailData.status==3||detailData.status==4){
        $("#coupon_max").addClass("layui-disabled").attr("disabled",true);
        $(".city-box input,#cityList input,#tagKey input").attr("disabled",true);
      }
		if(isFeedback == 1){
		  var html ='';
		  if(detailData.feedback==1){
			html+='<input type="radio" name="lz" value="是" title="是" checked="" id="lz_yes">';
			html+='<input type="radio" name="lz" value="否" title="否" id="lz_no">';
			var feedItem=detailData.feedItem; //detailData.feedItem
			var feedItems = feedItem.split("|");
			for(var i=0;i<feedItems.length;i++){
			  $(".lz-addwrap").before('<div class="layui-form-item lz-inputwrap">'+
			  '<label class="layui-form-label">&nbsp;</label>'+
			  '<div class="layui-input-inline">'+
				'<input type="text" class="layui-input"  lay-verify="required" value="'+feedItems[i]+'">'+
			  '</div><div class="layui-icon-del"></div></div>');
			}
			$("#lz_conbox").show();   
		  }else{
			html+='<input type="radio" name="lz" value="是" title="是"  id="lz_yes">';
			html+='<input type="radio" name="lz" value="否" title="否" checked="" id="lz_no">';
			$("#lz_conbox").hide(); 
		  }
		  $(".lz-box").html(html);
		}

       var html_back ='';
      if(detailData.reFund==0){
        html_back+='<input type="radio" name="refund" value="是" title="是" checked="">';
        html_back+='<input type="radio" name="refund" value="否" title="否">';
      }else{
        html_back+='<input type="radio" name="refund" value="是" title="是" >';
        html_back+='<input type="radio" name="refund" value="否" title="否" checked="">';
      }
      $(".refund").html(html_back);

      if(detailData.status==3||detailData.status==4){
        $("#coupon_max").attr("disabled",true);
      }

      form.render();// 动态加载  重新渲染表单

  }

  //详情logo重传
  $(".reload-img").click(function(){
    $(this).siblings(".upload-banner").click();
  })

  //详情logo
  $(".del-img").click(function(){
     $(this).parents(".shade-wrap").siblings(".coupon-uploadimg").addClass("default").attr("src","../images/default.png");
    $(this).parents(".com-uploadbox").removeClass("has");
  })

  //切换留资
  $(".lz-box").on("click",".layui-form-radio",function(){
    var index = $(".lz-box .layui-form-radio").index(this);
    if(index==0){
      $("#lz_conbox").show();
    }else{
      $("#lz_conbox").hide();
      $("#lz_conbox input").each(function(){
        if($(this).val()==""){
          $(this).parents(".lz-inputwrap").remove();
        }
      })
    }
  });

  //删除留资项
  $("#lz_conbox").on("click",".layui-icon-del",function(){
      $(this).parents(".lz-inputwrap").remove();
  });

  //新增留资项
  $(".customBtn").click(function(){
    $(".lz-addwrap").before('<div class="layui-form-item lz-inputwrap">'+
      '<label class="layui-form-label">&nbsp;</label>'+
      '<div class="layui-input-inline">'+
        '<input type="text" class="layui-input"  lay-verify="required" value="">'+
      '</div><div class="layui-icon-del"></div></div>');
    return false;
  });

  //切换城市 全国  其他
    $(".city-box").on("click",".layui-form-radio",function(){
      if(!$(this).hasClass("layui-disabled")){
        var index = $(".city-box .layui-form-radio").index(this);
        if(index==1){
          $("#cityList").show();
        }else{
         $("#cityList").hide();
        }
      }
    });

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
              // console.log(data);
              if(data.resultCode==0){
                var html='';
                if(data.data.length>0){
                  for(var i=0;i<data.data.length;i++){
                      html+='<input type="checkbox" name="tagNames" value="'+data.data[i].id+'" title='+data.data[i].tagName+'  style="width:150px;margin-bottom:10px;">'
                  }
                  $("#tagKey").append(html);
                  form.render();//动态添加  重新渲染
                  // element.init();
                  loadingTag =true;
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
layui.use(['jquery','element','layer','form','laydate','layedit'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,layedit = layui.layedit
    ,laydate = layui.laydate;

    var legalid = $("#iframe",parent.document.body).attr("legalid");

    var ueEditor_remark = layedit.build('goods_detail', { //建立编辑器
        height: 300,
//      uploadImage: { url: basePath + '/sys/editorUpload.ajax', type: 'post' }
    }); 
    var ueEditor_notice = layedit.build('buy_notice', { //建立编辑器
        height: 300,
//      uploadImage: { url: basePath + '/sys/editorUpload.ajax', type: 'post' }
    }); 


  //图片重传
  $(".layui-elem-field").on("click",".reload-img",function(){
      $(this).siblings(".upload-banner").click();
    })

  //图片删除
  $(".layui-elem-field").on("click",".del-img",function(){
      $(this).parents(".shade-wrap").siblings(".upload-source").addClass("default").attr("src","../images/default.png");
      $(this).parents(".com-uploadbox").removeClass("has");
  })

  //初始化权益编辑信息
  setTimeout(function(){initLegalInfo(legalid)},500);


  //监听保存
  form.on('submit(legalSubmit)', function(data){
      editLegalInfo(legalid);
      return false;
  });
  //监听库存的复选框切换
  form.on('checkbox(nolimited)', function(data){
    if(data.elem.checked){
      $("#legal_endTime").removeAttr("lay-verify");
    }else{
      $("#legal_endTime").attr("lay-verify","required");
    }
    return false;
  });  
  //监听限购数量期的复选框切换
  form.on('checkbox(limited_stock)', function(data){
    if(data.elem.checked){
      $("#stock").removeAttr("lay-verify");
    }else{
      $("#stock").attr("lay-verify","required|zhengshu");
    }
    return false;
  }); 
  //监听有效期的复选框切换
  form.on('checkbox(limitCntType)', function(data){
    if(data.elem.checked){
      $("#limitCnt").attr("lay-verify","required|zhengshu");
    }else{
      $("#limitCnt").removeAttr("lay-verify");
    }
    return false;
  }); 
  //监听是否限制上限的复选框切换
  form.on('checkbox(limitSingleType)', function(data){
    if(data.elem.checked){
      $("#limitSingle").attr("lay-verify","required|zhengshu");
    }else{
      $("#limitSingle").removeAttr("lay-verify");
    }
    return false;
  }); 

  function initLegalInfo(id){
    $.ajax({
            type: "get",
            url: basePath+'/sys/right/getMrightInfo?id='+id,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                var res = data.data;
                console.log(data);
                $("#goods_name").val(res.rightName);
                if(res.channel == 0){
                  $("#rightApiChannel").text("xPrime");
                }
                $("#legal_bis").text(res.bisName).attr("bisId",res.bisId);
                $(".upload-thumbnail-img").attr("src",res.rightLogo).removeClass("default");
                for(var i=0;i<res.imagesList.length;i++){
                  $(".upload-banner-img").eq(i).attr("src",res.imagesList[i].imageUrl).removeClass("default");
                  $(".upload-banner-img").eq(i).parents(".banner-uploadbox").addClass("has");
                }
                //是否限库存
                if(res.stockStatue == 0){
                  $("#nolimited_stock").html('<input type="checkbox" name="stock" value="0" title="不限" checked="" lay-filter="limited_stock">')
                  $("#stock").removeAttr("lay-verify");
                }else{
                  $("#nolimited_stock").html('<input type="checkbox" name="stock" value="0" title="不限" lay-filter="limited_stock">')
                  $("#stock").attr("lay-verify","required|zhengshu");
                }
                //是否限有效期
                // if(res.expirationType==0){
                //   $("#nolimited").html('<input type="checkbox" name="expirationType" value="0" title="不限" checked="" lay-filter="nolimited">')
                //   $("#legal_endTime").removeAttr("lay-verify");
                // }else{
                //   $("#nolimited").html('<input type="checkbox" name="expirationType" value="0" title="不限" lay-filter="nolimited">')
                //   $("#legal_endTime").attr("lay-verify","required");
                // }
                // $("#legal_endTime").val(res.expirationTime);
                $("#stock").val(res.stock);
                $("#cost").text((res.cost)/100);
                $("#price").text((res.price)/100);
                $("#disPrice").val((res.disPrice)/100);
                $("#salePrice").val((res.salePrice)/100);
                //是否限购数量
                if(res.limitCntType==1){
                  $("#limitCntType").html('<input type="checkbox" name="limitCnt" value="0" title="是否限购" checked="" lay-filter="limitCntType">')
                  $("#limitCnt").attr("lay-verify","required");
                }else{
                  $("#limitCntType").html('<input type="checkbox" name="limitCnt" value="0" title="是否限购" lay-filter="limitCntType">')
                  $("#limitCnt").removeAttr("lay-verify");
                }
                //是否限购订单上限
                if(res.limitSingleType==1){
                  $("#limitSingleType").html('<input type="checkbox" name="limitSingle" value="0" title="是否限制上限" checked="" lay-filter="limitSingleType">')
                  $("#limitSingle").attr("lay-verify","required");
                }else{
                  $("#limitSingleType").html('<input type="checkbox" name="limitSingle" value="0" title="是否限制上限" lay-filter="limitSingleType">')
                  $("#limitSingle").removeAttr("lay-verify");
                }
                $("#limitCnt").val(res.limitCnt);
                $("#limitSingle").val(res.limitSingle);
				if(res.remark == null){
					res.remark = "";
				}
				if(res.tips == null){
					res.tips = "";
				}
                layedit.setContent(ueEditor_remark,res.remark);
                layedit.setContent(ueEditor_notice,res.tips);
                var status_html = ''
                if(res.statue==0){
                  status_html += '<input type="radio" name="legalType" value="2" title="否" id="legalType1">'+
                                 '<input type="radio" name="legalType" value="1" title="是"  id="legalType2">'+
                                 '<input type="radio" name="legalType" value="0" title="待完善" checked="" id="legalType3">'
                }else if(res.statue==1){
                  status_html += '<input type="radio" name="legalType" value="2" title="否" id="legalType1">'+
                                 '<input type="radio" name="legalType" value="1" title="是" checked=""  id="legalType2">'+
                                 '<input type="radio" name="legalType" value="0" title="待完善"  id="legalType3">'
                }else if(res.statue==2){
                  status_html += '<input type="radio" name="legalType" value="2" title="否" checked="" id="legalType1">'+
                                 '<input type="radio" name="legalType" value="1" title="是"  id="legalType2">'+
                                 '<input type="radio" name="legalType" value="0" title="待完善"  id="legalType3">'
                }else{
                  status_html += '<input type="radio" name="legalType" value="2" title="否" id="legalType1">'+
                                 '<input type="radio" name="legalType" value="1" title="是" checked=""  id="legalType2">'+
                                 '<input type="radio" name="legalType" value="0" title="待完善"  id="legalType3">'
                }
                $("#shelves_status").html(status_html);

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


    //执行一个laydate实例
      laydate.render({
      elem: '#legal_endTime', //指定元素
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

   var startDate = laydate.render({
      elem: '#shelves_start', //指定元素
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
      elem: '#shelves_end', //指定元素
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



    function editLegalInfo(id){
      var rightName = $("#goods_name").val();

      var expirationType ="";
       // if($("#nolimited .layui-form-checkbox").hasClass('layui-form-checked')){
       //    expirationType = 0
       // }else{
       //    expirationType = 1
       // }
      // var expirationTime = $("#legal_endTime").val();
      
      // var channel = $("#rightApiChannel").text();
      // $("#legal_bis").text(res.bisName).attr("bisId",res.bisId);
      var rightLogo = "";
      if($(".upload-thumbnail-img").hasClass('default')){
        layer.msg("请上传缩略图", {icon: 5});
        return false;
      }else{
        rightLogo = $(".upload-thumbnail-img").attr("src");
      }
      var imgList =[];
      $(".upload-banner-img").each(function(){
            if(!$(this).hasClass("default")){
              var logo = {"imageUrl":$(this).attr("src")};
              imgList.push(logo);
            }
        })
        if(imgList.length==0){
          layer.msg("请上传轮播图", {icon: 5});
          return false;
        }

        var stockStatue ="";
         if($("#nolimited_stock .layui-form-checkbox").hasClass('layui-form-checked')){
            stockStatue = 0
         }else{
            stockStatue = 1
         }
         var limitCntType ="";
         if($("#limitCntType .layui-form-checkbox").hasClass('layui-form-checked')){
            limitCntType = 1
         }else{
            limitCntType = 0
         }

        var limitSingleType ="";
         if($("#limitSingleType .layui-form-checkbox").hasClass('layui-form-checked')){
            limitSingleType = 1
         }else{
            limitSingleType = 0
         }


      
      var stock = $("#stock").val();
      var disPrice = $("#disPrice").val()*100;
      var salePrice = $("#salePrice").val()*100;
      var limitCnt = $("#limitCnt").val();
      var limitSingle = $("#limitSingle").val()
      var remark = layedit.getContent(ueEditor_remark);
      var tips = layedit.getContent(ueEditor_notice);
      var statue = $('#shelves_status input[name="legalType"]:checked').val()

      var params = {
            "disPrice": disPrice,
            // "expirationTime": expirationTime,
            // "expirationType": expirationType,
            "id": id,
            "imgList": imgList,
            "limitCnt": limitCnt,
            "limitSingle": limitSingle,
            "remark": remark,
            "rightLogo": rightLogo,
            "rightName":rightName,
            "salePrice": salePrice,
            "statue": statue,
            "stock": stock,
            "stockStatue": stockStatue,
            "tips": tips,
            "limitSingleType":limitSingleType,
            "limitCntType":limitCntType
          }
          console.log(params);
    $.ajax({
            type: "post",
            url: basePath+'/sys/right/editMright',
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

              }
            },
            fail: function() {
              //layer.msg("网络异常，请稍后再试！", {icon: 5});
            }
        });

  }

    
  



  

  


  


});
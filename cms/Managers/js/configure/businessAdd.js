layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var businessid = $("#iframe",parent.document.body).attr("businessid");
    //判断是券申请 还是编辑
    var  ifr_src = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      ifr_src = $("#iframe",parent.document.body).attr("src");
    }

    if(ifr_src.indexOf("editType")!= -1){ //修改商家
        $(".bis-title").text("编辑商家");
        initEditBusiness(businessid);
    }

     
    //监听保存
    form.on('submit(saveBtn)', function(data){
      var _this = $(this);
        if(businessid !=undefined && businessid !=null){
            editBusiness(businessid,_this);
        }else{
            addBusiness(_this);
        }
        return false;
    });

     function initEditBusiness(id){
      $.ajax({
            type: "get",
            url: basePath+'/sys/right/getMbisInfo?id='+id,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                $("#business_name").text(data.data.bisName);
                $("#business_title").val(data.data.title);
                $(".business-logo").attr("src",data.data.bisLogo).removeClass("default");
                var html = '';
                if(data.data.iconType==1){
                    html +='<input type="radio" name="set" value="1" title="是" checked="">'+
                            '<input type="radio" name="set" value="0" title="否" >'
                }else{
                    html +='<input type="radio" name="set" value="1" title="是">'+
                            '<input type="radio" name="set" value="0" title="否"  checked="">'
                }
                $(".set-radio").html(html);
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

  
     //   编辑   
     function editBusiness(id,obj){
      if(!obj.hasClass("disabled")){
            obj.addClass("disabled");
            var bisName = $("#business_name").text();
            var title = $("#business_title").val();
            var bisLogo = "";
            if($(".business-logo").hasClass('default')){
              layer.msg("请上传缩略图", {icon: 5});
              obj.removeClass("disabled");
              return false;
            }else{
              bisLogo = $(".business-logo").attr("src");
            }
            var iconType = 0;
            if($(".set-radio .layui-form-radio").eq(0).hasClass('layui-form-radioed')){
              iconType=1;
            }else{
              iconType=0;
            }

            var params = {
              // "bisName": bisName,
              "bisLogo": bisLogo,
              "iconType": iconType,
              "title": title,
              "id":id
            }
            $.ajax({
                type: "post",
                url: basePath+'/sys/right/editMbis',
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



     //新增   
     function addBusiness(obj){
      if(!obj.hasClass("disabled")){
            obj.addClass("disabled");
            var bisName = $("#business_name").text();
            var title = $("#business_title").val();
            var bisLogo = "";
            if($(".business-logo").hasClass('default')){
              layer.msg("请上传缩略图", {icon: 5});
              obj.removeClass("disabled");
              return false;
            }else{
              bisLogo = $(".business-logo").attr("src");
            }
            var iconType = 0;
            if($(".set-radio .layui-form-radio").eq(0).hasClass('layui-form-radioed')){
              iconType=1;
            }else{
              iconType=0;
            }
            var params = {
              "bisName": bisName,
              "bisLogo": bisLogo,
              "iconType": iconType,
              "title": title
            }
            $.ajax({
                type: "post",
                url: basePath+'/sys/right/addMbis',
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
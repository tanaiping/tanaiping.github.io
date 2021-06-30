layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var iconid = $("#iframe",parent.document.body).attr("iconid");

    //判断是券申请 还是编辑
    var  ifr_src = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      ifr_src = $("#iframe",parent.document.body).attr("src");
    }

    if(ifr_src.indexOf("editType")!= -1){ //修改分类
        $(".bis-title").text("编辑Icon");
        initEditIcon(iconid);
    }else{//新增分类
	
    }
	
	//图片重传
	$(".layui-elem-field").on("click",".reload-img",function(){
	    $(this).siblings(".upload-banner").click();
	  })
	
	//图片删除
	$(".layui-elem-field").on("click",".del-img",function(){
	    $(this).parents(".shade-wrap").siblings(".upload-source").addClass("default").attr("src","../images/default.png");
	    $(this).parents(".com-uploadbox").removeClass("has");
	})

    //监听保存
    form.on('submit(saveBtn)', function(data){
		var _this = $(this);
        if(iconid !=undefined && iconid !=null){
            editType(iconid);
        }else{
            addType(_this);
        }
        return false;
    });
	

   //编辑分类详情 
    function initEditIcon(id){
      $.ajax({
            type: "get",
            url: basePath+'/sys/charge/getIconInfo?id='+id,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                $("#title").val(data.data.title).attr("iconid",data.data.id);
				$("#subTitle").val(data.data.subTitle);
				$("#linkUrl").val(data.data.linkUrl);
                if(data.data.imageUrl!=null&&data.data.imageUrl!=""){
					$(".upload-thumbnail-img").attr("src",data.data.imageUrl).removeClass("default");
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

    //   编辑   
     function editType(id){
        var title = $("#title").val();
		var subTitle = $("#subTitle").val();
		var linkUrl = $("#linkUrl").val();
		var iconid = $("#title").attr("iconid");
		var imageUrl = "";
		if(!isUrl(linkUrl)){
			layer.msg("请填写正确格式的url链接", {icon: 5});
			return false;
		}
		if($(".upload-thumbnail-img").hasClass('default')){
		  layer.msg("请上传缩略图", {icon: 5});
		  return false;
		}else{
		  imageUrl = $(".upload-thumbnail-img").attr("src");
		}
        var params = {
				  "id": iconid,
				  "imageUrl":imageUrl,
				  "linkUrl": linkUrl,
				  "subTitle": subTitle,
				  "title": title
				}
        $.ajax({
            type: "post",
            url: basePath+'/sys/charge/editIcon',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
				  layer.msg("操作成功", {icon: 1});
				  setTimeout(function(){
					$("#iframe", window.parent.document).attr("src",'icon/iconList.html?'+Math.random());
				  },1000)
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



     //新增   
     function addType(obj){
        var title = $("#title").val();
        var subTitle = $("#subTitle").val();
        var linkUrl = $("#linkUrl").val();
        var imageUrl = "";
		if(!isUrl(linkUrl)){
			layer.msg("请填写正确格式的url链接", {icon: 5});
			return false;
		}
        if($(".upload-thumbnail-img").hasClass('default')){
          layer.msg("请上传缩略图", {icon: 5});
          return false;
        }else{
          imageUrl = $(".upload-thumbnail-img").attr("src");
        }
        var params = {
			  "id": "",
			  "imageUrl":imageUrl,
			  "linkUrl": linkUrl,
			  "subTitle": subTitle,
			  "title": title
			}
		if(!obj.hasClass("layui-btn-disabled")){
			obj.addClass("layui-btn-disabled");
			$.ajax({
				type: "post",
				url: basePath+'/sys/charge/addIcon',
				contentType: "application/json",
				dataType: 'json',
				data:JSON.stringify(params),
				beforeSend: function (xhr) {
				   xhr.setRequestHeader('token', token);
				},
				success: function(data) {
				  if(data.resultCode==0){
					layer.msg("操作成功", {icon: 1});
					setTimeout(function(){
						$("#iframe", window.parent.document).attr("src",'icon/iconList.html?'+Math.random());
					},1000)
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
				  layer.msg("网络异常，请稍后再试！", {icon: 5});
				  obj.addClass("layui-btn-disabled");
				}
			});
		}
     }

    
});
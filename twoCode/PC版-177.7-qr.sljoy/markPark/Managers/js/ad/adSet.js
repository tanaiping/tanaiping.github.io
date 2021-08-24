//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage','laydate','upload'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,laypage=layui.laypage
	,laydate=layui.laydate
	,upload=layui.upload
    ,form = layui.form;
	
	//监听订单搜索
	form.on('submit(saveAd)', function(data){
	// $(document).on('click','.add_things',function(){
		saveAdSet();
	    return false;
	});
	
	//删除图片
	$(document).on("click",".img-close-icon",function(){
		var parObj = $(this).parents(".flex-imglist");
		var len = parObj.find(".upload-img-elem").length;
		if(len == 1){
			$(this).parents(".upload-img-elem").css("background-image","url(../images/default.png)").removeClass("has").removeAttr("picurl");
		}else{
			$(this).parents(".upload-img-elem").remove();
		}
	})
	
	getad();
	
	//获取配置
	function getad(){
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsysadconf',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				if(data.code == 100){
					var res =data.data.info;
					console.log(res)
					if(res&&res.picurl){
						if(res.picurl != ''){
							$("#picurl").attr('picurl', res.picurl).css("background-image","url("+res.picurl+")"); //图片链接（base64）不支持ie8
							$("#picurl").addClass("has");
						}
						if(res.gourl != ''){
							$("#gourl").val(res.gourl)
						}
					}
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
	}
	
	upload.render({ //允许上传的文件后缀
	  elem: '#uploadAdImg' //绑定元素
	  ,url: basePath+'/api/webcgi/savefile' //上传接口
	  ,headers: {utoken: utoken}
	  ,accept: 'images' //普通文件
	  ,exts: 'jpg|png|gif|bmp|jpeg'
	  ,size: 204800  //kb
	  ,auto:false
	  ,field:'upfile'
	  , choose: function(obj) {
	      obj.preview(function(index, file, result) {
	        var img = new Image();
	        img.onload = function() {
	          console.log('choose poster', img.width, img.height);
	
	          // obj.upload(index, file);
	          if ('750' == img.width && '300' == img.height) {
	            //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
	            obj.upload(index, file);
	          } else {
	            layer.msg('图片尺寸必须为： 750px x 300px', {icon: 5});
	          }
	        };
	        img.src = result;
	      });
	    }
	  ,before: function(obj){ 
	    layer.load();
	  }
	  ,done: function(data){
	    layer.closeAll('loading');
	    console.log(data);
	    if(data.code==100){
	       $("#picurl").attr('picurl', data.data.fileurl).css("background-image","url("+data.data.fileurl+")"); //图片链接（base64）不支持ie8
	       $("#picurl").addClass("has");
	    }else if(data.code==-1){
	        localStorage.removeItem('utoken');
	        top.location.href="http://qr.sljoy.cn/index.html?"+Math.random();
	    }else{
	      layer.closeAll('loading');
	      // layer.alert('上传失败，请重试！');
	      layer.msg(data.codemsg, {icon: 5});
	    }
	  }
	});

    //订单列表
    function saveAdSet(){
		var picurl = $("#picurl").attr("picurl");
		var gourl = $("#gourl").val();
		if(picurl ==''||picurl == undefined){
			layer.msg('请上传广告配置图片', {icon: 5});
			return false;
		}
		var params = {
			"picurl":picurl,
			"gourl":gourl,
			"adtitle":''
		}
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/savesysadconf',
			data: JSON.stringify(params),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				if(data.code == 100){
					layer.msg('操作成功', {icon: 1});
				}else{
				  layer.msg(data.resultMsg, {icon: 5});
				}
			}
		});
    }

  });

//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage','laydate','upload'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,laypage=layui.laypage
	,laydate=layui.laydate
	,upload=layui.upload
    ,form = layui.form;

	var tombid = $("#iframe",parent.document.body).attr("tombid");
	detailPark(tombid);
	
	var clipboard = new ClipboardJS('.copy-btn');
	// $(this).css("background-image","url(on.jpg)");
	
	
	clipboard.on('success', function(e) {
	    console.info('Action:', e.action);
	    console.info('Text:', e.text);
	    console.info('Trigger:', e.trigger);
		// alert("复制成功")
		layer.msg('复制成功', {icon: 1});
	    e.clearSelection();
		return false;
	});
	clipboard.on('error', function(e) {
	    console.error('Action:', e.action);
	    console.error('Trigger:', e.trigger);
		return false;
	});
	// $(this).css("background-image","url(on.jpg)");
	
	//编辑纪念园
	$(document).on('click','.edit-btn',function(){
	  $("#iframe",parent.document.body).attr({"src":"park/createPark.html?rdm="+Math.random()+"&isEdit=1","tombid":tombid});
	  return false;
	});
	//详情纪念园
	$(document).on('click','.detail-btn',function(){
	  $("#iframe",parent.document.body).attr({"src":"park/detailPark.html?rdm="+Math.random(),"tombid":tombid});
	  return false;
	});
	//返回首页
	$(document).on('click','.go-home',function(){
	  $("#iframe",parent.document.body).attr({"src":"park/parkList.html?rdm="+Math.random()});
	  return false;
	});

	//返回
	$(".back-btn,.cancel-btn").click(function(){
		$("#iframe",parent.document.body).attr({"src":"park/parkList.html?rdm="+Math.random()});
		 return false;
	})
	
	
	
	//详情
	function detailPark(id){
		var params = {
			'tombid':id
		}
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsystombbyid',
			data: JSON.stringify(params),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				console.log(data);
				if(data.code == 100){
					var res = data.data.info;
					if(res.acendday ==''){
						$("#acdate").text('永久');
					}else{
						$("#acdate").text(res.acbegday+"-"+res.acendday);
					}
					$("#qrurl").attr("src",res.codeinfo.qrurl)
					$("#qrtxt").text(res.codeinfo.qrtext).attr("href",res.codeinfo.qrtext)
					$(".copy-btn").attr("data-clipboard-text",res.codeinfo.qrtext);
					$("#acpwd").text(res.acpwd)
					
				}else if(data.code==-1){
					localStorage.removeItem('utoken');
					top.location.href="http://qr.sljoy.cn/index.html?"+Math.random();
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
		
	}

  });

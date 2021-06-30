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
				if(data.code == 100){
					var res = data.data.info;
					$("#customername").text(res.customername);
					$("#customertel").text(res.customertel);
					$("#tombname").text(res.tombname);
					$("#familyname").text(res.familyname);
					console.log(res.birthday+"-"+res.deathdate)
					$("#deathDate1").html(res.birthday+" - "+res.deathdate);
					
					$("#city").text(res.city);
					$("#desc").text(res.desc);
					$("#bgmusic").text(res.bgmusic);
					$("#bgpic .img-bgshow").css("background-image","url("+res.bgpic+")");
					$("#acpwd").text(res.acpwd);
					$("#qrurl").attr("src",res.codeinfo.qrurl)
					$("#qrtxt").text(res.codeinfo.qrtext);
					$(".copy-btn").attr("data-clipboard-text",res.codeinfo.qrtext);
					
					if(res.acendday ==''){
						$("#acdate").text('永久');
					}else{
						$("#acdate").text(res.acbegday+"-"+res.acendday);
					}
					
					if(res.relates&&res.relates.length>0){
						var html = '';
						res.relates.forEach(function(item,i){
							var rtype ='';
							if(item.rtype ==1){
								rtype = '长辈'
							}else if(item.rtype ==2){
								rtype = '平辈'
							}else if(item.rtype ==3){
								rtype = '晚辈'
							}
							if(i == 0){
								html +='<div class="layui-form-item relative-box">'+
							    '<label class="layui-form-label">亲友档案</label>'+
							    '<div class="layui-input-inline">'+
									'<label class="layui-form-label layui-form-auto rtype">'+rtype+'</label></div>'+
								'<div class="layui-input-inline" style="width: 200px;">'+
									'<label class="layui-form-label layui-form-auto rname">'+item.rname+'</label></div>'+
								'<div class="layui-input-inline" style="width: 200px;">'+
									'<label class="layui-form-label layui-form-auto funame">'+item.funame+'</label></div>'+
								'<div class="layui-input-inline" style="width: 200px;">'+
									'<label class="layui-form-label layui-form-auto remark">'+item.remark+'</label></div>'+
								'<div class="layui-input-inline" style="width: 200px;">'+
									'<label class="layui-form-label layui-form-auto tomburl">'+item.tomburl+'</label></div></div>'
							}else{
								html +='<div class="layui-form-item relative-box">'+
								'<label class="layui-form-label">&nbsp;</label>'+
								'<div class="layui-input-inline">'+
									'<label class="layui-form-label layui-form-auto rtype">'+rtype+'</label></div>'+
								'<div class="layui-input-inline" style="width: 200px;">'+
									'<label class="layui-form-label layui-form-auto rname">'+item.rname+'</label></div>'+
								'<div class="layui-input-inline" style="width: 200px;">'+
									'<label class="layui-form-label layui-form-auto funame">'+item.funame+'</label></div>'+
								'<div class="layui-input-inline" style="width: 200px;">'+
									'<label class="layui-form-label layui-form-auto remark">'+item.remark+'</label></div>'+
								'<div class="layui-input-inline" style="width: 200px;">'+
									'<label class="layui-form-label layui-form-auto tomburl">'+item.tomburl+'</label></div></div>'
							}
						})
						$("#relative-wrap").html(html);
					}
					if(res.events&&res.events.length>0){
						var html = '';
						res.events.forEach(function(item,i){
							html +='<div class="things-list">'+
								'<div class="layui-form-item">'+
							    '<label class="layui-form-label">事迹'+(i+1)+'</label>'+
							    '<div class="layui-input-inline">'+
							    '<label class="layui-form-label layui-form-auto">'+item.edate+'</label>'+
							    '</div></div>'+
								'<div class="layui-form-item">'+
							    '<label class="layui-form-label">&nbsp;</label>'+
							    '<div class="layui-input-inline">'+
							    '<label class="layui-form-label layui-form-auto">'+item.content+'</label>'+
							    '</div></div>'+
								'<div class="layui-form-item">'+
							    '<label class="layui-form-label">事迹照片</label>'+
							    '<div class="layui-input-block">'+
								'<div class="flex-row">'
								if(item.eventpics&&item.eventpics.length>0){
									item.eventpics.forEach(function(elem,j){
										html+='<div class="img-bgshow" style="background-image:url('+elem+')"></div>'
									})
								}
								
								html+='</div></div></div></div>'
						})
						$(".things-box").append(html);
					}
					if(res.images&&res.images.length>0){
						var html = '';
						res.images.forEach(function(item,i){
							html +='<div class="w200"><div class="img-bgshow" style="background-image:url('+item.showpic+'"></div>'+
									'<div class="txt-desc">'+item.showtitle+'</div></div>'
						})
						
						$("#imglistPic").html(html);
					}
					if(res.movies&&res.movies.length>0){
						var html = '';
						res.movies.forEach(function(item,i){
							html +='<div class="w200"><div class="img-bgshow" style="background-image:url('+item.showpic+'.jpeg"></div>'+
									'<div class="txt-desc">'+item.showtitle+'</div></div>'
						})
						$("#videolistPic").html(html);
					}
					
					
					
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

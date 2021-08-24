//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage','laydate','upload'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,laypage=layui.laypage
	,laydate=layui.laydate
	,upload=layui.upload
    ,form = layui.form;

	//执行一个laydate实例
	var startDate = laydate.render({
	  elem: '#birthday', //指定元素
	  trigger: 'click', //触发事件
	  istime: false, //是否开启时间选择
	  isclear: true, //是否显示清空
	  istoday: true, //是否显示今天
	  issure: true, //是否显示确认
	  min: '1000-01-01', //设定最小日期为当前日期  
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
	  }
	});
	//执行一个laydate实例
	var endDate = laydate.render({
	  elem: '#deathdate', //指定元素
	  trigger: 'click', //触发事件
	  istime: false, //是否开启时间选择
	  isclear: true, //是否显示清空
	  istoday: true, //是否显示今天
	  issure: true, //是否显示确认
	  min: '1000-01-01', //设定最小日期为当前日期   laydate.now(-7)
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
	  }
	});
	var startDate1 = laydate.render({
	  elem: '#acbegday', //指定元素
	  trigger: 'click', //触发事件
	 type: 'datetime',
	  istime: false, //是否开启时间选择
	  isclear: true, //是否显示清空
	  istoday: true, //是否显示今天
	  issure: true, //是否显示确认
	  min: '1000-01-01', //设定最小日期为当前日期  
	  max: '2900-01-01', //最大日期 laydate.now(-1)
	  done: function(value,date){
	      endDate1.config.min={
	      year:date.year,
	      month:date.month-1,//关键
	      date: date.date,
	      hours: 0,
	      minutes: 0,
	      seconds : 0
	      }
	  }
	});
	//执行一个laydate实例
	var endDate1 = laydate.render({
	  elem: '#acendday', //指定元素
	  trigger: 'click', //触发事件
	  type: 'datetime',
	  istime: false, //是否开启时间选择
	  isclear: true, //是否显示清空
	  istoday: true, //是否显示今天
	  issure: true, //是否显示确认
	  min: '1000-01-01', //设定最小日期为当前日期   laydate.now(-7)
	  max: '2900-01-01', //最大日期 laydate.now(-1)
	  done: function(value,date){
	      if(value=="") return false;
	      startDate1.config.max={
	      year:date.year,
	      month:date.month-1,//关键
	      date: date.date,
	      hours: 0,
	      minutes: 0,
	      seconds : 0
	      }
	  }
	});
	
	laydate.render({
	  elem: '.events-date', //指定元素
	  trigger: 'click', //触发事件
	  istime: false, //是否开启时间选择
	  isclear: true, //是否显示清空
	  istoday: true, //是否显示今天
	  issure: true, //是否显示确认
	  min: '1000-01-01', //设定最小日期为当前日期   laydate.now(-7)
	  max: '2900-01-01', //最大日期 laydate.now(-1)
	  done: function(value,date){
	      if(value=="") return false;
	  }
	});
	
	
	var ifr_src =  $("#iframe",parent.document.body).attr("src");
	//判断是新增 还是修改
	if(ifr_src.indexOf("isEdit")!= -1){ //修改
	  var tombid = $("#iframe",parent.document.body).attr("tombid");
	  detailPark(tombid);
	}else{//新增
	  $("#iframe",parent.document.body).removeAttr("tombid");
	  loadFamily();
	}
	//删除图片
	$(document).on("click",".img-close-icon",function(){
		var parObj = $(this).parents(".flex-imglist");
		var len = parObj.find(".upload-img-elem").length;
		if(len == 1){
			$(this).parents(".upload-img-elem").css("background-image","url(../images/default.png)").removeClass("has").removeAttr("bgpic").removeAttr("eventpics");
		}else{
			$(this).parents(".upload-img-elem").remove();
		}
	})
	//删除 图片集 视频集
	$(document).on("click",".img-close-icon2",function(){
		var parObj = $(this).parents(".flex-imglist");
		var len = parObj.find(".upload-img-elem").length;
		if(len == 1){
			$(this).parents(".upload-img-elem").css("background-image","url(../images/default.png)").removeClass("has").removeAttr("showpic");
		}else{
			$(this).parents(".set-box").remove();
		}
	})
	
	upload.render({ //允许上传的文件后缀
	  elem: '#parkImg' //绑定元素
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
	          //if ('440' == img.width && '227' == img.height) {
	            //$('.detail_logo').attr('src', result).removeClass('default'); //图片链接（base64）不支持ie8
	            obj.upload(index, file);
	          // } else {
	          //   layer.msg('图片尺寸必须为： 440px x 227px', {icon: 5});
	          // }
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
	       $("#bgpic").attr('bgpic', data.data.fileurl).css("background-image","url("+data.data.fileurl+")"); //图片链接（base64）不支持ie8
	       $("#bgpic").addClass("has");
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
	//事迹照片
	upload.render({ //允许上传的文件后缀
	  elem: '#uploadEventsImg' //绑定元素
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
	          // if ('106' == img.width && '106' == img.height) {
	            obj.upload(index, file);
	          // } else {
	          //   layer.msg('图片尺寸必须为： 106px x 106px', {icon: 5});
	          // }
	        };
	        img.src = result;
	      });
	    }
	  ,before: function(obj){ 
	    layer.load();
	  }
	  ,done: function(data){
		  var _this = this.item;
	    layer.closeAll('loading');
	    console.log(data);
	    if(data.code==100){
			var $this = _this.parents(".things-list").find(".eventpics").last();
				if($this.attr("eventpics")==""||$this.attr("eventpics") == undefined){
					$this.attr('eventpics', data.data.fileurl).css("background-image","url("+data.data.fileurl+")"); //图片链接（base64）不支持ie8
					$this.addClass("has");
				}else{
					var html='<div class="upload-img-elem mr15 mb15 eventpics has" eventpics ="'+data.data.fileurl+'" style="background-image:url('+data.data.fileurl+')">'+
							  '<div class="img-close-icon"></div></div>'
					$this.after(html)
				}
			
	      
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
	//纪念相册
	upload.render({ //允许上传的文件后缀
	  elem: '#uploadImgList' //绑定元素
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
	          // if ('106' == img.width && '106' == img.height) {
	            obj.upload(index, file);
	          // } else {
	          //   layer.msg('图片尺寸必须为： 106px x 106px', {icon: 5});
	          // }
	        };
	        img.src = result;
	      });
	    }
	  ,before: function(obj){ 
	    layer.load();
	  }
	  ,done: function(data){
		  var _this = this.item;
	    layer.closeAll('loading');
	    console.log(data);
	    if(data.code==100){
			var _box = $(".phone-imglist").find(".set-box").last()
			var $this = _box.find(".showpic");
				if($this.attr("showpic")==""||$this.attr("showpic") == undefined){
					$this.attr('showpic', data.data.fileurl).css("background-image","url("+data.data.fileurl+")"); //图片链接（base64）不支持ie8
					$this.addClass("has");
				}else{
					var html='<div class="set-box">'+
							  '<div class="upload-img-elem mr15 mb15 showpic has "showpic ="'+data.data.fileurl+'" style="background-image:url('+data.data.fileurl+')">'+
							  '<div class="img-close-icon2"></div></div>'+
							  '<input type="text" name="title"  placeholder="请输入图片描述" autocomplete="off" class="layui-input showtitle" style="width: 200px;"></div>'
					_box.after(html)
				}
			
	      
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
	upload.render({ //允许上传的文件后缀
	  elem: '#uploadVideoList' //绑定元素
	  ,url: basePath+'/api/webcgi/savefile' //上传接口
	  ,headers: {utoken: utoken}
	  ,accept: 'video' //普通文件
	  ,exts: 'mp4'
	  ,size: 204800  //kb
	  ,auto:false
	  ,field:'upfile'
	  , choose: function(obj) {
	      obj.preview(function(index, file, result) {
			  obj.upload(index, file);
	      });
	    }
	  ,before: function(obj){ 
	    layer.load();
	  }
	  ,done: function(data){
		  var _this = this.item;
	    layer.closeAll('loading');
	    console.log(data);
	    if(data.code==100){
			var _box = $(".video-list").find(".set-box").last()
			var $this = _box.find(".showpic");
				if($this.attr("showpic")==""||$this.attr("showpic") == undefined){
					$this.attr('showpic', data.data.fileurl).css("background-image","url("+data.data.fileurl+".jpeg)"); //图片链接（base64）不支持ie8
					$this.addClass("has");
				}else{
					var html='<div class="set-box">'+
							  '<div class="upload-img-elem mr15 mb15 showpic has "showpic ="'+data.data.fileurl+'" style="background-image:url('+data.data.fileurl+'.jpeg)">'+
							  '<div class="img-close-icon2"></div></div>'+
							  '<input type="text" name="title"  placeholder="请输入图片描述" autocomplete="off" class="layui-input showtitle" style="width: 200px;"></div>'
					_box.after(html)
				}
			
	      
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
	
	upload.render({ //允许上传的文件后缀
	  elem: '#uploadMusic' //绑定元素
	  ,url: basePath+'/api/webcgi/savefile' //上传接口
	  ,headers: {utoken: utoken}
	  ,accept: 'audio' //普通文件
	  ,exts: 'mp3'
	  ,size: 204800  //kb
	  ,auto:false
	  ,field:'upfile'
	  , choose: function(obj) {
	      obj.preview(function(index, file, result) {
			  obj.upload(index, file);
	      });
	    }
	  ,before: function(obj){ 
	    layer.load();
	  }
	  ,done: function(data){
		  var _this = this.item;
	    layer.closeAll('loading');
	    console.log(data);
	    if(data.code==100){
		  $("#bgmusic").attr("bgmusic",data.data.fileurl)
	      $("#bgmusic").text(data.data.fileurl)
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
	

	

	//返回
	$(".back-btn,.cancel-btn").click(function(){
		$("#iframe",parent.document.body).attr({"src":"park/parkList.html?rdm="+Math.random()});
		 return false;
	})
	
    //监听订单搜索
    form.on('submit(createCode)', function(data){
	// $(document).on('click','.add_things',function(){
		savePark();
        return false;
    });
	//获取所属家族的值
	// form.on('select(familyname)', function (data) {
	// 	// familyname = data.value;
	// 	familyname = data.elem[data.elem.selectedIndex].text;
	// 	console.log(familyname)
	// });
	
	
	
	function loadFamily(familyName){//-1
		console.log(familyName);
		// var html = '<option value="1">家族1</option><option value="11">家族12</option><option value="122">家族122</option>'
		// $("#familyname select").append(html);
		// form.render();
		// return false;
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsysfamily',
			async: false,
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				if(data.code == 100){
					var res = data.data.famlist;
					var html = '';
					if(res&&res.length>0){
						if(familyName!=""&&familyName!=undefined){
							res.forEach(function(item,i){
								if(familyName == item){
									html+='<option value="'+i+'" selected>'+item+'</option>'
								}else{
									html+='<option value="'+i+'">'+item+'</option>'
								}
							})
						}else{
							res.forEach(function(item,i){
								html+='<option value="'+i+'">'+item+'</option>'
							})
						}
						$("#familyname select").append(html);
						form.render('select');
					}
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
	}
	
	function savePark(){
		var tombid = $("#iframe",parent.document.body).attr("tombid");
		tombid == undefined?0:tombid;
		var customername = $("#customername").val();
		var customertel = $("#customertel").val();
		var tombname = $("#tombname").val();
		var familyname = $("#familyname .layui-this").text();
		var addfamilyname = $("#addfamilyname").val();
		if(addfamilyname != ''){
			familyname = addfamilyname;
		}
		var birthday = $("#birthday").val();
		var deathdate = $("#deathdate").val();
		var city = $("#city").val();
		var desc = $("#desc").val();
		var bgmusic = $("#bgmusic").attr("bgmusic");
		var bgpic = $("#bgpic").attr("bgpic");
		var acpwd = $("#acpwd").val();
		var acbegday = $("#acbegday").val();
		var acendday = $("#acendday").val();
		var relates = [],events = [],imagesList = [],moviesList = [];
		$(".relative-box").each(function(){//亲友关系
		// if($(this).find(".rtype").find(".layui-this").attr("lay-value") == -1){
		// 	layer.msg('请选择辈份', {icon: 5});
		// 	return false;
		// }
			var obj = {
				"rtype":$(this).find(".rtype").find(".layui-this").attr("lay-value"),
				"rname":$(this).find(".rname").val(),
				"funame":$(this).find(".funame").val(),
				"remark":$(this).find(".remark").val(),
				"tomburl":$(this).find(".tomburl").val()
			}
			relates.push(obj);
		})
		$(".things-list").each(function(){//事迹
			var imgobj = [];
			$(this).find(".things-imgList .eventpics").each(function(){
				imgobj.push($(this).attr("eventpics"));
			})
			if($(this).find(".events-date-com").val() == ''){
			  layer.msg("请选择事迹日期", {icon: 5});
			  return false;
			}
			var obj = {
				"edate":$(this).find(".events-date-com").val(),
				"content":$(this).find(".content").val(),
				"eventpics":imgobj
			}
			events.push(obj);
		})
		$(".phone-imglist .set-box").each(function(){//图片集
			var obj = {
				"showtitle":$(this).find(".showtitle").val(),
				"showpic":$(this).find(".upload-img-elem").attr("showpic"),
			}
			imagesList.push(obj);
		})
		
		$(".video-list .set-box").each(function(){//图片集
			var obj = {
				"showtitle":$(this).find(".showtitle").val(),
				"showpic":$(this).find(".upload-img-elem").attr("showpic"),
			}
			moviesList.push(obj);
		})
		if(!isTelephone(customertel)){
		  layer.msg("请输入正确的客户电话", {icon: 5});
		  return false;
		}
		if(familyname == ''){
		  layer.msg("请选择或输入所属家族", {icon: 5});
		  return false;
		}
		// if(bgmusic == ''){
		//   layer.msg("请上传背景音乐", {icon: 5});
		//   return false;
		// }
		if(bgpic == ''){
		  layer.msg("请上传墓园照片", {icon: 5});
		  return false;
		}
		if(birthday == ''){
		  layer.msg("请选择出生日期", {icon: 5});
		  return false;
		}
		if(deathdate == ''){
		  layer.msg("请选择死亡日期", {icon: 5});
		  return false;
		}
		if(acendday != ''){
			if(acbegday ==''){
				layer.msg("请选择有效期开始时间", {icon: 5});
				return false;
			}
		}
		
		var params ={
			"familyname":familyname,
			"customername":customername,
			"customertel":customertel,
			"tombname":tombname,
			"birthday":birthday,
			"deathdate":deathdate,
			"city":city,
			"desc":desc,
			"headpic":"",
			"bgmusic":bgmusic,
			"bgpic":bgpic,
			"acpwd":acpwd,
			"acbegday":acbegday,
			"acendday":acendday,
			"relates":relates,
			"events":events,
			"images":imagesList,
			"movies":moviesList,
			"tombid":tombid
		}
		console.log(params)
		
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsystombsave',
			data: JSON.stringify(params),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				if(data.code == 100){
					layer.msg('操作成功', {icon: 1});
					setTimeout(function(){
						if(ifr_src.indexOf("isEdit")!= -1){
							$("#iframe",parent.document.body).attr({"src":"park/parkList.html?rdm="+Math.random()});
						}else{
							$("#iframe",parent.document.body).attr({"src":"park/parkCode.html?rdm="+Math.random(),"tombid":data.data.tombid});
						}
						
					},2000)
					
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
		
		
	}
	//添加事迹
	$("#add_things").click(function(){
		addThings();
		return false;
	})
	//添加亲友档案
	$("#add_relative").click(function(){
		addRelative();
		return false;
	})
	
	//删除事迹
	$(".things-box").on("click",".layui-form-things",function(){
		$(this).parents(".things-list").remove();
	})
	//删除亲友档案
	$(document).on("click",".layui-form-relative",function(){
		$(this).parents(".relative-box").remove();
	})
	
	//添加事迹
	function addThings(){
		var index = parseInt($(".things-box").attr("num"))+1;
		$(".things-box").attr("num",index)
		var num = $(".things-list").length
		var html = '<div class="things-list">'+
		'<div class="layui-form-item">'+
			'<label class="layui-form-label layui-form-things">事迹'+(num+1)+'</label>'+
			'<div class="layui-input-inline">'+
			  '<div class="layui-date-area">'+
				 '<input type="text" class="layui-input layui-input-date events-date-com events-date'+index+'" readonly="true" placeholder="事迹日期">'+
			  '</div></div></div>'+
		'<div class="layui-form-item">'+
			'<label class="layui-form-label">&nbsp;</label>'+
			'<div class="layui-input-inline">'+
			  '<textarea name="desc" placeholder="请输入内容" class="layui-textarea content"></textarea>'+
			'</div></div>'+
		'<div class="layui-form-item">'+
			'<label class="layui-form-label">事迹照片</label>'+
			'<div class="layui-input-inline" style="width: 114px;">'+
				'<button type="button" class="layui-btn" id="uploadEventsImg'+index+'">'+
				 '<i class="layui-icon"></i>上传图片'+
				'</button><input class="layui-upload-file" type="file" accept="undefined" name="file">'+
			'</div></div>'+
		'<div class="layui-form-item">'+
			'<label class="layui-form-label">&nbsp;</label>'+
			'<div class="layui-input-block flex-imglist things-imgList">'+
				  '<div class="upload-img-elem mr15 mb15 eventpics" eventpics ="">'+
					'<div class="img-close-icon"></div>'+
				  '</div></div></div></div>';
		
		
		$("#addThingsBox").before(html);
		form.render();
		laydate.render({
		  elem: '.events-date'+index, //指定元素
		  trigger: 'click', //触发事件
		  istime: false, //是否开启时间选择
		  isclear: true, //是否显示清空
		  istoday: true, //是否显示今天
		  issure: true, //是否显示确认
		  min: '1000-01-01', //设定最小日期为当前日期   laydate.now(-7)
		  max: '2900-01-01', //最大日期 laydate.now(-1)
		  done: function(value,date){
		      if(value=="") return false;
		  }
		});
		upload.render({ //允许上传的文件后缀
		  elem: '#uploadEventsImg'+index //绑定元素
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
		          //if ('106' == img.width && '106' == img.height) {
		            obj.upload(index, file);
		          // } else {
		          //   layer.msg('图片尺寸必须为： 106px x 106px', {icon: 5});
		          // }
		        };
		        img.src = result;
		      });
		    }
		  ,before: function(obj){ 
		    layer.load();
		  }
		  ,done: function(data){
			  var _this = this.item;
		    layer.closeAll('loading');
		    console.log(data);
		    if(data.code==100){
				var $this = _this.parents(".things-list").find(".eventpics").last();
					if($this.attr("eventpics")==""||$this.attr("eventpics") == undefined){
						$this.attr('eventpics', data.data.fileurl).css("background-image","url("+data.data.fileurl+")"); //图片链接（base64）不支持ie8
						$this.addClass("has");
					}else{
						var html='<div class="upload-img-elem mr15 mb15 eventpics has" eventpics ="'+data.data.fileurl+'" style="background-image:url('+data.data.fileurl+')">'+
								  '<div class="img-close-icon"></div></div>'
						$this.after(html)
					}
				
		      
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
	}
	
	function addRelative(){
		var html = '<div class="layui-form-item relative-box">'+
					    '<label class="layui-form-label layui-form-relative">亲友档案</label>'+
					    '<div class="layui-input-inline rtype" style="width: 200px;">'+
							'<select name="rtype">'+
							  '<option value="-1">选择辈分</option>'+
							  '<option value="1">长辈</option>'+
							  '<option value="2">平辈</option>'+
							  '<option value="3">晚辈</option>'+
							'</select></div>'+
						'<div class="layui-input-inline" style="width: 200px;">'+
							'<input type="text" name="title"  placeholder="请输入亲友关系" autocomplete="off" class="layui-input rname"></div>'+
						'<div class="layui-input-inline" style="width: 200px;">'+
							'<input type="text" name="title" placeholder="请输入亲友名称" autocomplete="off" class="layui-input funame"></div>'+
						'<div class="layui-input-inline" style="width: 200px;">'+
							'<input type="text" name="title"  placeholder="请输入备注" autocomplete="off" class="layui-input remark"></div>'+
						'<div class="layui-input-inline" style="width: 200px;">'+
							'<input type="text" name="title" placeholder="请输入跳转链接" autocomplete="off" class="layui-input tomburl">'+
						'</div></div>';
		
		
		$("#addRelative").before(html);
		form.render();
	}
	
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
					$("#customername").val(res.customername);
					$("#customertel").val(res.customertel);
					$("#tombname").val(res.tombname);
					loadFamily(res.familyname);
					$("#birthday").val(res.birthday);
					$("#deathdate").val(res.deathdate);
					$("#city").val(res.city);
					$("#desc").val(res.desc);
					$("#bgmusic").attr("bgmusic",res.bgmusic).text(res.bgmusic);
					$("#bgpic").attr("bgpic",res.bgpic).css("background-image","url("+res.bgpic+")");
					$("#acpwd").val(res.acpwd);
					$("#acbegday").val(res.acbegday);
					$("#acendday").val(res.acendday);
					if(res.relates&&res.relates.length>0){
						var html = '';
						res.relates.forEach(function(item,i){
							if(i==0){
								$(".relative-box option").each(function(i){
									if(item.rtype == $(this).attr("value")){
										$(this).attr("selected","selected");
									}
								})
								$(".relative-box .rname").val(item.rname)
								$(".relative-box .funame").val(item.funame)
								$(".relative-box .remark").val(item.remark)
								$(".relative-box .tomburl").val(item.tomburl)
							}else{
								html += '<div class="layui-form-item relative-box">'+
											    '<label class="layui-form-label layui-form-relative">亲友档案</label>'+
											    '<div class="layui-input-inline rtype" style="width: 200px;">'+
													'<select name="rtype">'+
													 '<option value="-1">选择辈分</option>'
													for(var x = 1;x<4;x++){
														if(item.rtype==1){
															html+='<option value="1" selected>长辈</option>'+
															'<option value="2">平辈</option>'+
															'<option value="3">晚辈</option>'
														}else if(item.rtype==2){
															html+='<option value="1">长辈</option>'+
															'<option value="2" selected>平辈</option>'+
															'<option value="3">晚辈</option>'
														}else if(item.rtype==3){
															html+='<option value="1">长辈</option>'+
															'<option value="2">平辈</option>'+
															'<option value="3"  selected>晚辈</option>'
														}
													}
													html+='</select></div>'+
												'<div class="layui-input-inline" style="width: 200px;">'+
													'<input type="text" name="title" placeholder="请输入亲友关系" autocomplete="off" class="layui-input rname" value='+item.rname+'></div>'+
												'<div class="layui-input-inline" style="width: 200px;">'+
													'<input type="text" name="title" placeholder="请输入亲友名称" autocomplete="off" class="layui-input funame" value='+item.funame+'></div>'+
												'<div class="layui-input-inline" style="width: 200px;">'+
													'<input type="text" name="title" placeholder="请输入备注" autocomplete="off" class="layui-input remark" value='+item.remark+'></div>'+
												'<div class="layui-input-inline" style="width: 200px;">'+
													'<input type="text" name="title" placeholder="请输入跳转链接" autocomplete="off" class="layui-input tomburl" value='+item.tomburl+'>'+
												'</div></div>';
								
							}
						})
						$("#addRelative").before(html);
					}
					if(res.events&&res.events.length>0){
						res.events.forEach(function(item,i){
							if(i == 0){
								var $events = $(".things-list").eq(i)
								$events.find(".layui-input-date").val(item.edate)
								$events.find(".content").val(item.content);
								if(item.eventpics&&item.eventpics.length>0){
									item.eventpics.forEach(function(elem,j){
										if(j==0){
											$events.find(".eventpics").attr("eventpics",elem);
											$events.find(".eventpics").css("background-image","url("+elem+")").addClass("has");
										}else{
											var html = '<div class="upload-img-elem mr15 mb15 eventpics has" eventpics ="'+elem+'" style="background-image:url('+elem+')">'+
														'<div class="img-close-icon"></div></div>'
											$events.find(".things-imgList").append(html);
										}
									})
								}
							}else{
								var index = parseInt($(".things-box").attr("num"))+1;
								$(".things-box").attr("num",index)
								var num = $(".things-list").length
								var html = '<div class="things-list">'+
								'<div class="layui-form-item">'+
									'<label class="layui-form-label layui-form-things">事迹'+(num+1)+'</label>'+
									'<div class="layui-input-inline">'+
									  '<div class="layui-date-area">'+
										 '<input type="text" class="layui-input layui-input-date events-date-com events-date'+index+'" value="'+item.edate+'" readonly="true" placeholder="事迹日期">'+
									  '</div></div></div>'+
								'<div class="layui-form-item">'+
									'<label class="layui-form-label">&nbsp;</label>'+
									'<div class="layui-input-inline">'+
									  '<textarea name="desc" placeholder="请输入内容" class="layui-textarea content">'+item.content+'</textarea>'+
									'</div></div>'+
								'<div class="layui-form-item">'+
									'<label class="layui-form-label">事迹照片</label>'+
									'<div class="layui-input-inline" style="width: 114px;">'+
										'<button type="button" class="layui-btn" id="uploadEventsImg'+index+'">'+
										 '<i class="layui-icon"></i>上传图片'+
										'</button><input class="layui-upload-file" type="file" accept="undefined" name="file">'+
									'</div></div>'+
								'<div class="layui-form-item">'+
									'<label class="layui-form-label">&nbsp;</label>'+
									'<div class="layui-input-block flex-imglist things-imgList">'
									if(item.eventpics&&item.eventpics.length>0){
										item.eventpics.forEach(function(elem,j){
											 html +='<div class="upload-img-elem mr15 mb15 eventpics has" eventpics ="'+elem+'" style="background-image:url('+elem+')">'+
											 '<div class="img-close-icon"></div></div>'
										})
									}
									'</div></div></div>';
								
								
								$("#addThingsBox").before(html);
								form.render();
								laydate.render({
								  elem: '.events-date'+index, //指定元素
								  trigger: 'click', //触发事件
								  istime: false, //是否开启时间选择
								  isclear: true, //是否显示清空
								  istoday: true, //是否显示今天
								  issure: true, //是否显示确认
								  min: '1000-01-01', //设定最小日期为当前日期   laydate.now(-7)
								  max: '2900-01-01', //最大日期 laydate.now(-1)
								  done: function(value,date){
								      if(value=="") return false;
								  }
								});
								upload.render({ //允许上传的文件后缀
								  elem: '#uploadEventsImg'+index //绑定元素
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
								          //if ('106' == img.width && '106' == img.height) {
								            obj.upload(index, file);
								          // } else {
								          //   layer.msg('图片尺寸必须为： 106px x 106px', {icon: 5});
								          // }
								        };
								        img.src = result;
								      });
								    }
								  ,before: function(obj){ 
								    layer.load();
								  }
								  ,done: function(data){
									  var _this = this.item;
								    layer.closeAll('loading');
								    console.log(data);
								    if(data.code==100){
										var $this = _this.parents(".things-list").find(".eventpics").last();
											if($this.attr("eventpics")==""||$this.attr("eventpics") == undefined){
												$this.attr('eventpics', data.data.fileurl).css("background-image","url("+data.data.fileurl+")"); //图片链接（base64）不支持ie8
												$this.addClass("has");
											}else{
												var html='<div class="upload-img-elem mr15 mb15 eventpics has" eventpics ="'+data.data.fileurl+'" style="background-image:url('+data.data.fileurl+')">'+
														  '<div class="img-close-icon"></div></div>'
												$this.after(html)
											}
										
								      
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
							}
						})
					}
					if(res.images&&res.images.length>0){
						var html = '';
						res.images.forEach(function(item,i){
							var $imglistOjb = $(".phone-imglist").eq(i)
							if(i==0){
								$imglistOjb.find(".upload-img-elem").attr("showpic",item.showpic)
								$imglistOjb.find(".upload-img-elem").css("background-image","url("+item.showpic+")").addClass("has");
								$imglistOjb.find(".showtitle").val(item.showtitle)
							}else{
								html+='<div class="set-box">'+
								'<div class="upload-img-elem mr15 mb15 showpic has" showpic="'+item.showpic+'" style="background-image:url('+item.showpic+')">'+
									'<div class="img-close-icon2"></div></div>'+
								'<input type="text" name="title" placeholder="请输入图片描述" value="'+item.showtitle+'" autocomplete="off" class="layui-input showtitle" style="width: 200px;">'+
							'</div>'
							}
						})
						$(".phone-imglist").append(html);
					}
					if(res.movies&&res.movies.length>0){
						var html = ''
						res.movies.forEach(function(item,i){
							if(i==0){
								$(".video-list").find(".upload-img-elem").eq(i).attr("showpic",item.showpic)
								$(".video-list").find(".upload-img-elem").eq(i).css("background-image","url("+item.showpic+".jpeg)").addClass("has");
								$(".video-list").find(".showtitle").eq(i).val(item.showtitle)
							}else{
								html+='<div class="set-box">'+
								'<div class="upload-img-elem mr15 mb15 showpic has" showpic="'+item.showpic+'" style="background-image:url('+item.showpic+'.jpeg)">'+
									'<div class="img-close-icon2"></div></div>'+
								'<input type="text" name="title"  placeholder="请输入视频描述" value="'+item.showtitle+'" autocomplete="off" class="layui-input showtitle" style="width: 200px;">'+
							'</div>'
							}
						})
						$(".video-list").append(html);
					}
					
					
					form.render();
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
		
	}
	
	function getFamily(index,type){
	  $.ajax({
	        type: "post",
	        url: basePath+'/sys/goods/getGoodsSpec',
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
	           xhr.setRequestHeader('token', token);
	        },
	        success: function(data) {
	          console.log(data);
	          if(data.resultCode==0){
	            localStorage.setItem('spec',JSON.stringify(data));
	            var res = data.data;
	            if(res!=null){
	              var html = '';
	              if(type == 1){
	                html+='<option value="-1" selected="">请选择规格</option>'
	              for(var i=0;i<res.length;i++){
	                 html +='<option value="'+res[i].id+'">'+res[i].specName+'</option>' 
	              }
	              }else{
	                html+='<option value="-1">请选择规格</option>'
	                for(var i=0;i<res.length;i++){
	                  if(res[i].id==index){//默认加载第一个规格的属性
	                    html +='<option value="'+res[i].id+'" selected>'+res[i].specName+'</option>'
	                  }else{
	                   html +='<option value="'+res[i].id+'">'+res[i].specName+'</option>' 
	                  }
	                }
	              }
					if(judgeUpdate != 1&&judgeUpdate != ""){
						$("#goods_spec select").attr("disabled",true);
					}
	              $("#goods_spec select").html(html);
	              form.render('select');
	              // creatNewSellInfo();
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

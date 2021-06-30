$(function(){
	
	$("#tcode_val,#websitecode_val,.input-box input,.input-box textarea").keyup(function(){
		_czc.push(['_trackEvent', '输入框', '得到焦点', '','1']);
	})
	
	
	
	sys_getwebuinfo();
	
	//切换menu
	$(".menu-list li").click(function(){
		var menuName = $(this).find("a").text();
		_czc.push(['_trackEvent', menuName, '点击', '','1']);
		
		var index = $(".menu-list li").index(this);
		// if(index == 0 || index == 1|| index == 6||index == 8|| index == 9){
			// if(!$(this).hasClass("act")){
				$(".menu-list li").removeClass("act").eq(index).addClass("act");
				$(".main-box").hide().eq(index).show();
				
				//清空数据
				$("input,textarea").val("");
				$(".create-btn").removeClass("again-btn").text('生成二维码');
				$("input,textarea").val("");
				$(".upload-conbox ul").empty();
				$(".net-address span").removeClass("act");
				$(".wifi-type span").removeClass("act").eq(0).addClass("act");
				$(".add-btn,.input-upload1").show();
				$(".con-r img").attr("src","").hide();
				$(".con-r span").show();
				$(".article-elem").each(function(){
					if($(this).attr("flag") == 1){
						$(this).remove();
					}
				})
				
			// }
		// }else{
		// 	showMsg("敬请期待！！！")
		// }
		
	})
	
	//登录
	$(".unlogin").click(function(){
		_czc.push(['_trackEvent', '登录', '点击', '','1']);
		$(".blackbg,.login-pop").show();
		sys_getloginqr()
	})
	
	//关闭登录弹窗
	$(".blackbg,.login-close").click(function(){
		$(".blackbg,.login-pop").hide();
		clearInterval(timer);
	})
	
	//登录的下拉
	$(".icon-spread").click(function(){
		if(!$(this).hasClass("act")){
			$(this).addClass("act");
			$(".login-ope").show();
		}else{
			$(this).removeClass("act");
			$(".login-ope").hide();
		}
	})
	
	//退出
	$(".exit-out").click(function(){
		_czc.push(['_trackEvent', '安全退出', '点击', '','1']);
		sys_logout();
		
	})
	
	//活码勾选
	$(".check-code").click(function(){
		if(!$(this).hasClass("act")){
			$(this).addClass("act");
		}else{
			$(this).removeClass("act");
		}
	})
	
	//tag标签点击
	$(".net-address span").click(function(){
		var init_v = $("#websitecode_val").val();
		if($(this).hasClass("act")){
			$(this).removeClass("act");
			$(this).parents(".con-l").find("textarea").val("");
		}else{
			$(".net-address span").removeClass("act");
			$(this).addClass("act");
			$(this).parents(".con-l").find("textarea").val(init_v+$(this).text());
		}
		
	})
	//tag  wifi标签点击
	$(".wifi-type span").click(function(){
		var i = $(".wifi-type span").index(this);
		$(".wifi-type span").removeClass("act").eq(i).addClass("act");
		if(i == 2){
			$("#wpass").val("").attr("disabled",true)
		}else{
			$("#wpass").attr("disabled",false)
		}
		
	})
	//删除的某个li元素
	$(".upload-conbox").on("click",".close-li-elem",function(){
		var obj = $(this).parents(".upload-conbox");
		var len = obj.find("li").length;
		if(len==1){
			var parObj = $(this).parents(".con-box");
			parObj.find(".add-btn").show();
			parObj.find(".input-upload1").show();
			parObj.find(".flex-end").removeClass("flex-between");
			parObj.find(".continue-btn").hide();
			parObj.find(".upload-conbox").hide();
		}
		$(this).parent("li").remove();
		
	})
	//删除文章的某个元素
	$(".article-content").on("click",".close-article-elem",function(){
		var obj = $(this).parents(".article-content");
		$(this).parent(".article-elem").remove();
		
	})
	//上传文件 pdf doc xlsx
	$("#File_path").change(function(){
		var fileList = uploadFiles(this,0);
		if(fileList == "") return;
		var fileType = "other";
		if(fileList.fext =='doc'||fileList.fext =='docx'||fileList.fext =='xlsx'||fileList.fext =='xls'||fileList.fext =='pdf'||fileList.fext =='png'||fileList.fext =='jpg'||fileList.fext =='jpeg'||fileList.fext =='gif'||fileList.fext =='bmp'){
			fileType = fileList.fext;
		}
		$(".filelist").append('<li fileurl ="'+fileList.fileurl+'" ftype = "'+fileList.ftype+'" fname = "'+fileList.fname+'"><div class="'+fileType+'-icon"></div><span>'+fileList.fname+'</span><em class="close-li-elem"></em></li>')
	})
	
	$("#File_path2").change(function(){
		var fileList = uploadFiles(this,1);
		if(fileList == "") return;
		var fileType = fileList.fext;
		var fileType = "other";
		if(fileList.fext =='doc'||fileList.fext =='docx'||fileList.fext =='xlsx'||fileList.fext =='xls'||fileList.fext =='pdf'||fileList.fext =='png'||fileList.fext =='jpg'||fileList.fext =='jpeg'||fileList.fext =='gif'||fileList.fext =='bmp'){
			fileType = fileList.fext;
		}
		$(".filelist").append('<li fileurl ="'+fileList.fileurl+'" ftype = "'+fileList.ftype+'" fname = "'+fileList.fname+'"><div class="'+fileType+'-icon"></div><span>'+fileList.fname+'</span><em class="close-li-elem"></em></li>')
	})
	
	
	//上传图片文件
	$("#Picture_path").change(function(){
		var imgList = uploadFiles(this,0);
		if(imgList == "") return;
		$(".imglist").append('<li><div class="img-overflow"><img src="'+imgList.fileurl+'" alt=""></div><span>'+imgList.fname+'</span><em class="close-li-elem"></em></li>')
	})
	
	$("#Picture_path2").change(function(){
		var imgList = uploadFiles(this,1);
		if(imgList == "") return;
		$(".imglist").append('<li><div class="img-overflow"><img src="'+imgList.fileurl+'" alt=""></div><span>'+imgList.fname+'</span><em class="close-li-elem"></em></li>')
	})
	
	//上传音频文件
	$("#Audio_path").change(function(){
		var audioList = uploadFiles(this,0);
		if(audioList == "") return;
		$(".audiolist").append('<li fileurl ="'+audioList.fileurl+'"><div class="audio-icon"></div><span>'+audioList.fname+'</span><em class="close-li-elem"></em></li>')
	})
	
	$("#Audio_path2").change(function(){
		var audioList = uploadFiles(this,1);
		if(audioList == "") return;
		$(".audiolist").append('<li fileurl ="'+audioList.fileurl+'"><div class="audio-icon"></div><span>'+audioList.fname+'</span><em class="close-li-elem"></em></li>')
	})
	
	//上传视频文件
	$("#Video_path").change(function(){
		var videoList = uploadFiles(this,0);
		if(videoList == "") return;
		$(".videolist").append('<li fileurl ="'+videoList.fileurl+'"><video src="'+videoList.fileurl+'"></video><span>'+videoList.fname+'</span><em class="close-li-elem"></em></li>')
	})
	
	$("#Video_path2").change(function(){
		var videoList = uploadFiles(this,1);
		if(videoList == "") return;
		$(".videolist").append('<li fileurl ="'+videoList.fileurl+'"><video src="'+videoList.fileurl+'"></video><span>'+videoList.fname+'</span><em class="close-li-elem"></em></li>')
	})
	
	//-----文章模块 start
	$("#addImg").change(function(){
		var imgList = uploadFiles(this,1);
		if(imgList == "") return;
		$(".article-content").append('<div class="article-elem"  mtype = "1" flag="1" fileurl ="'+imgList.fileurl+'"><img src="'+imgList.fileurl+'" alt=""><em class="close-article-elem"></em></div>')
	})
	$("#addAudio").change(function(){
		var audioList = uploadFiles(this,1);
		if(audioList == "") return;
		$(".article-content").append('<div class="article-elem" mtype = "2" flag="1" fileurl ="'+audioList.fileurl+'" style="width:110px;"><div class="audio-icon"></div><em class="close-article-elem"></em></div>')
	})
	$("#addVideo").change(function(){
		var videoList = uploadFiles(this,1);
		if(videoList == "") return;
		$(".article-content").append('<div class="article-elem" mtype = "3" flag="1" fileurl ="'+videoList.fileurl+'"><video src="'+videoList.fileurl+'"></video><em class="close-article-elem"></em></div>')
	})
	
	$("#addTextarea").click(function(){
		$(".article-content").append('<div class="input-box article-elem" flag="1" style="width: 100%;"  mtype = "4"><textarea placeholder="输入正文内容"></textarea><em class="close-article-elem"></em></div>')
	})
	
	// 文章二维码
	$("#creartArticleCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		var datainfo = []
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		$(".article-elem").each(function(i){
			var mtype = parseInt($(this).attr("mtype"));
			var mcontent = '';
			if(mtype == 0||mtype == 4){
				mcontent = $(this).find("input,textarea").val();
			}else{
				mcontent = $(this).attr("fileurl")
			}
			datainfo.push({"mtype":mtype,"mcontent":mcontent,"mvface":$(this).attr("mvface"),"vtime":$(this).attr("vtime")});	
		})
		
		if(datainfo.length == 0) return;
		var params =JSON.stringify({'qtype':6,'datainfo':datainfo})
		console.log(params)
		sys_qrtxt(params,this);
	})
	
	
	
	
	//-----文章模块 end 
	
	//生成文本二维码
	$("#creartTxtCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var tcode_val = $("#tcode_val").val();
		var params =JSON.stringify({'qtype':4,'datainfo':[{'txtstr':tcode_val}]})
		if(tcode_val =="") return;
		sys_qrtxt(params,this);
	})
	//网址二维码
	$("#creartWebsiteCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var tcode_val = $("#websitecode_val").val();
		var params =JSON.stringify({'qtype':4,'datainfo':[{'txtstr':tcode_val}]})
		if(tcode_val =="") return;
		sys_qrtxt(params,this);
	})
	//名片二维码
	$("#creartCardCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var c_name = $("#c_name").val();
		var c_tel = $("#c_tel").val();
		var c_company = $("#c_company").val();
		var c_title = $("#c_title").val();
		var c_email = $("#c_email").val();
		var c_addr = $("#c_addr").val();
		if(c_name == ""||c_tel == ""){
			showMsg("请输入姓名和手机号")
			return;
		}
		var datainfo = {"name":c_name,"tel":c_tel,"company":c_company,"title":c_title,"email":c_email,"addr":c_addr}
		var params =JSON.stringify({'qtype':7,'datainfo':datainfo})
		sys_qrtxt(params,this);
	})
	
	//邮件二维码
	$("#creartEmailCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var fname = $("#fname").val();
		var tname = $("#tname").val();
		var etitle = $("#etitle").val();
		var content = $("#content").val();
		if(fname == ""||tname == ""){
			showMsg("请输入发件人和收件人")
			return;
		}
		
		var datainfo = {"fname":fname,"tname":tname,"etitle":etitle,"content":content}
		var params =JSON.stringify({'qtype':8,'datainfo':datainfo})
		sys_qrtxt(params,this);
	})
	
	//wifi二维码
	$("#creartWifiCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var wname = $("#wname").val();
		var wpass = $("#wpass").val();
		var wtype = 1;//默认
		
		$("#wtype span").each(function(i){
			if($(this).hasClass("act")){
				wtype = $(this).attr("wtype");
			}
		})
		if(wname == ""){
			showMsg("请输入wifi账号名")
			return;
		}
		if(wpass.length<8&&wtype!=0){
			showMsg("wifi密码必须为8位以上的字符串")
			return;
		}
		
		
		var datainfo = {"wname":wname,"wpass":wpass,"wtype":wtype}
		var params =JSON.stringify({'qtype':9,'datainfo':datainfo})
		sys_qrtxt(params,this);
	})
	// 图片二维码
	$("#creartImgCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var datainfo = []
		$(".imglist li").each(function(i){
		datainfo.push({"fileurl":$(this).find("img").attr("src")});	
		})
		if(datainfo.length == 0) return;
		var params =JSON.stringify({'qtype':1,'datainfo':datainfo})
		sys_qrtxt(params,this);
	})
	// 文件二维码
	$("#creartFileCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var datainfo = []
		$(".filelist li").each(function(i){
			var fType =0;
			if($(this).attr("fileurl") == 'doc'||$(this).attr("fileurl") == 'docx'){
				fType = 1;
			}else if($(this).attr("fileurl") == 'xlsx'||$(this).attr("fileurl") == 'xls'){
				fType = 2;
			}else if($(this).attr("fileurl") == 'ppt'||$(this).attr("fileurl") == 'pptx'){
				fType = 3;
			}else if($(this).attr("fileurl") == 'txt'){
				fType = 4;
			}
		datainfo.push({"fileurl":$(this).attr("fileurl"),"ftype":fType,"fname":$(this).attr("fname")});	
		})
		if(datainfo.length == 0) return;
		var params =JSON.stringify({'qtype':5,'datainfo':datainfo})
		sys_qrtxt(params,this);
	})
	
	// 音频二维码
	$("#creartAudioCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var datainfo = []
		$(".audiolist li").each(function(i){
			datainfo.push({"fileurl":$(this).attr("fileurl"),"vtime":$(this).attr("vtime")});	
		})
		if(datainfo.length == 0) return;
		var params =JSON.stringify({'qtype':2,'datainfo':datainfo})
		sys_qrtxt(params,this);
	})
	
	// 视频二维码
	$("#creartVideoCode").click(function(){
		_czc.push(['_trackEvent', '生成按钮', '生成二维码', '','1']);
		if($(this).hasClass("again-btn")){
			var index = $(this).attr("index");
			$(".menu-list li").eq(index).trigger("click");
			return;
		}
		var datainfo = []
		$(".videolist li").each(function(i){
			datainfo.push({"fileurl":$(this).attr("fileurl"),"mvface":$(this).attr("mvface"),"vtime":$(this).attr("vtime")});	
		})
		if(datainfo.length == 0) return;
		var params =JSON.stringify({'qtype':3,'datainfo':datainfo})
		sys_qrtxt(params,this);
	})
	
	$(".go-home").click(function(){
		 window.location.href="http://www.sljoy.cn/"
	})
	
})

	
	//文件上传  type = 0  点击中间的上传按钮  type =1 点击左下角的继续上传按钮 
	function uploadFiles(obj,type){
		var upfile = $(obj).attr("id");
		var parObj = $(obj).parents(".con-box");
		var files = $("#"+upfile).prop('files');
		var resultData = '';
		var fdata = new FormData();
		if (files[0] == undefined || files[0] == null) {
			return;
		}
		fdata.append('upfile', files[0]);
		$.ajax({
			type:'POST',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			url:'http://sysapp.sljoy.cn/api/webcgi/savefile',
			data: fdata,
			cache: false,
			processData: false,
			contentType: false,
			async: false,
			success: function (data) {
				if(data.code == 100){
					if(type == 0){
						parObj.find(".add-btn").hide();
						parObj.find(".input-upload1").hide();
						parObj.find(".flex-end").addClass("flex-between");
						parObj.find(".continue-btn").show();
						parObj.find(".upload-conbox").show();
					}
					console.log(data.data)
					resultData =  data.data;
				}else if(data.code == 0){
					showMsg(data.codemsg);
				}else if(data.code == -1){
					$(".blackbg,.login-pop").show();
					sys_getloginqr()
				}
			}
		});
		return resultData;
	}
	
	var timer = null;
	var inters = 0;
	//获取登录码
	function sys_getloginqr(){
		$.ajax({
			type:'POST',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			url: 'http://sysapp.sljoy.cn/api/webcgi/wxqrode',
			success: function (data) {
				if(data.code==100){
					$('#showcode').attr('src',data.data.wqrurl);
					// 轮询登录状态
					timer = setInterval(sys_checklogincode, 2000);
				}
				console.log(data);
			}
		});
	}
	//轮询查询扫描状态
	function sys_checklogincode(){
		$.ajax({
			type:'POST',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			url:'http://sysapp.sljoy.cn/api/webcgi/wxcheck',
			success: function (data) {
				console.log(data);
				if(data.code==100){
					clearInterval(timer);
					inters = 0;
					$(".blackbg,.login-pop").hide();
					sys_getwebuinfo();
				}else if(data.code == -1){
					showMsg(data.codemsg);
				}else{
					inters++;
					if(inters == 50){ //避免一直请求查询状态的接口
						clearInterval(timer);
					}
				}
			}
		});
	}
	
	//获取用户信息-是否登录
	function sys_getwebuinfo(){
		$.ajax({
			type:'POST',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			url:'http://sysapp.sljoy.cn/api/webcgi/getuinfo',
			//data:JSON.stringify({'pid':100,'stype':10000}),
			success: function (data) {
				console.log(data);
				if(data.code == 100){
					$(".unlogin").hide();
					$(".tx-img").attr("src",data.data.faceurl)
					$(".acc-name").text(data.data.nickname)
					$(".logined").show();
				}else{
					//showMsg(data.codemsg);
				}
			}
		});
	}
	//退出
	function sys_logout(){
		$.ajax({
			type:'POST',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			url:'http://sysapp.sljoy.cn/api/webcgi/logout',
			success: function (data) {
				if(data.code ==100){
					$(".unlogin").show();
					$(".tx-img").attr("src","")
					$(".acc-name").text("")
					$(".logined").hide();
					$(".login-ope").hide();
				}else if(data.code == 0){
					showMsg(data.codemsg);
				}
			}
		});
	}
	//提示信息
	function  showMsg(msg) {
	  $("#prompt em").html(msg);
	  $("#prompt").show();
	  window.setTimeout(function () {
	    $("#prompt").hide()
	  }, 2000)
	}
	
	
	//
	function sys_qrtxt(params,obj){
		$.ajax({
			type:'POST',
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			url:'http://sysapp.sljoy.cn/api/webcgi/qrsave',
			data:params,
			success: function (data) {
				if(data.code == 100){
					// console.log(data.data.qrurl)
					var parentObj = $(obj).parents(".con-box");
					parentObj.find(".con-r").find("span").hide();
					parentObj.find(".con-r").find("img").attr("src",data.data.qrurl).show();
					// if($(obj).attr("id")=="creartTxtCode"||$(obj).attr("id")=="creartCardCode"||$(obj).attr("id")=="creartEmailCode"){
					// 	parentObj.find(".flex-end").addClass("flex-between").find(".success-code").show();
					// }
					
					var parIndex = $(obj).parents(".main-box");
					var i = $(".main-box").index(parIndex);
					$(obj).addClass("again-btn").attr("index",i);
					$(obj).text("再创建一个");
					parIndex.find(".close-li-elem,.close-article-elem,.continue-btn").hide();
					if($(obj).attr("id")=="creartWifiCode") return
					parIndex.find(".flex-end").removeClass("flex-between");
					
				}else if(data.code == 0){
					showMsg(data.codemsg);
				}else if(data.code == -1){
					$(".blackbg,.login-pop").show();
					sys_getloginqr()
				}
			}
		});
	}

//倒计时
var InterValObj; //timer变量，控制时间
var count = 90; //间隔函数，1秒执行
var curCount;//当前剩余秒数
function sendCode(){
	curCount = count;
    //设置button效果，开始计时
    $('#getCode').text( "重新获取("+curCount+")").removeClass("button_r");
    $('#getCode').addClass("send-disabled");
    $('#getCode').attr('disbaled','disbaled');
    InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
    //timer处理函数
    function SetRemainTime() {
        if (curCount == 0) {
            window.clearInterval(InterValObj);//停止计时器
            // $('#send_'+type).attr('disbaled',false);
            $('#getCode').removeClass('send-disabled');
            $('#getCode').attr('disbaled',false);
            $('.addRed').addClass('button_r');
            $('#getCode').text("重新发送验证码"); 
        }
        else {
            $('#getCode').text("重新获取("+curCount+")").removeClass("button_r");
            curCount--;
        }
    }
}

//获取验证码的callbackfun
function getVerifyCode(res){
	//alert(res.resultCode);
	if(res.resultCode == 17){//需要获取图形验证码
		$('#mask,#vcode').show();//显示弹窗，显示图形验证码
	}else if(res.resultCode == 0){//第一次获取短信验证码	
		//启动倒计时
	    	sendCode();
	}else{//出错信息提示
		promptErr(res.resultMsg,'#msg_pro1');
	}

}

// 注册callbackFun
function registerFun(res){
	if(res.resultCode == 0){
		$('#reg_one').hide();
		/*开始抽奖*/
		$("body,html").scrollTop(10);
		var userId_c = res.data.userId;
		$.fn.cookie('userId_c', userId_c);
		getData('Post',apiurl.luckDraw,'json',{"userId":userId_c,"type":1},true,false,luckDrawBack2);
		/*同步邀请者数据*/ 

		if(GetQueryString('inviteUserId') != null || GetQueryString('inviteUserId') != ""){/*邀请的*/
			getData('Post',apiurl.updateLotteryNum,'json',{"userId":GetQueryString('inviteUserId'),"nUserId":userId_c},true,false,updateLotteryNum);
		}
	}else{
		promptErr(res.resultMsg,'#msg_pro1');
	}
}
/*数据上报回调*/
function updateLotteryNum(res){

}
// 设置密码回调
function setPasuc(res){
	if(res.resultCode == 0){
		$('#setPwd').hide();
		$('#regsuc').show();
	}else{
		promptErr(res.resultMsg,'#msg_pro2');
	}
}
//受权回调
function loginHandle(res){
	if(res.resultCode == 0){
		/*登录成功*/
		var backUrl = GetQueryString('backUrl');
		window.location.href = decodeURIComponent(backUrl);
		promptErr('受权成功','#msg_pro1');
	}else if(res.resultCode == 14){/*登录失败*/
		promptErr("未注册",'#msg_pro1');
	}else if(res.resultCode == 10){
		promptErr("密码错误",'#msg_pro1');
	}else if(res.resultCode == 1){
		promptErr(res.resultMsg,'#msg_pro1');
	}else{
		promptErr(res.resultMsg,'#msg_pro1');
	}
}
/*授受权绑定*/ 
function registerBackFun(res){
	if(res.resultCode == 0){/*注册成功*/
		promptErr('注册成功,正在绑定授权','#msg_pro1');
		var tel = $('#tel').val();
		var password = $('#password').val();
		var notifyUrl = decodeURIComponent(GetQueryString('notifyUrl'));
		var login_param2 = {
				"baseInfo":{
		    			"platform":5,
		    		},
				"mobile":tel,
				"safetyCode":password,
				"type":3,
				"busiType":"WD_REGISTER",
				"notifyUrl":notifyUrl

			};
		getData('POST',apiurl.login,'json',{"loginReqForWd":JSON.stringify(login_param2)},true,false,loginRedirect);

	}else{
		promptErr(res.resultMsg,'#msg_pro1');
	}
}
/*登录成功后重定向*/
function loginRedirect(res){
	if(res.resultCode == 0){
		var backUrl = GetQueryString('backUrl');
		window.location.href = decodeURIComponent(backUrl);
	}else{
		promptErr('绑定失败，请重新授权登录','#msg_pro1');
	}
} 
//加载完成后执行
$(function(){
	// 获取userId
	if(GetQueryString('inviteUserId') != null || GetQueryString('inviteUserId') == ""){
		var invite_userId = GetQueryString('inviteUserId');
		console.log(invite_userId);
	}else{
		var invite_userId = "";
		
	}
	//密码输入限制
	var reg = /[0-9a-zA-Z\u0000-\u00FF]{6,16}/;
	var re = /^1\d{10}$/;
	$('#password').on('keyup',function(){
		  for(i=0;i<$(this).val().length;i++){
	        var c = $(this).val().substr(i,1);
	        var ts = escape(c);
	        if(ts.substring(0,2) == "%u"){
	            $(this).val("");
	        	}
	    	}
	});
	//取短信验证码
	$('#getCode').on('click',function(){
		// console.log(invite_userId);
		var tel = $.trim($('#tel').val());
		$('#tel_1').val(tel);
		// var picVerifyCode = $('#picVerifyCode').val();
		if(tel == ''|| !re.test(tel) || tel.length != 11){
			promptErr('请输入正确的手机号','#msg_pro1');
		}else{
			/*邀请用户注册，需要传userId*/
				var verify_param = {
					"mobile":tel,
					"baseInfo":{
						"userId":invite_userId,
						"platform":5
					},
					"picVerifyCode":"",
					"type":3
				};
				if(!$(this).hasClass("send-disabled")){
					getData('POST',apiurl.getVerifyCode,'json',{"verifyCodeReq":JSON.stringify(verify_param)},true,false,getVerifyCode);
		
				}
					
				
		}
		
	});
	
	// 注册
	$('#submit_one').on('click',function(){
		var tel_1 = $.trim($('#tel').val());
		var verify_code = $.trim($('#verify_code').val());
		var psw = $.trim($('#password').val());
		if(verify_code == '' || psw == '' ){
			promptErr('验证码与密码不能为空','#msg_pro1');
		}else if(!re.test(tel_1) || tel_1==""){
			promptErr('请输入正确的手机号','#msg_pro1');
		}else if(!reg.test(psw)){
			promptErr('密码不低于6位','#msg_pro1');
		}else{
			/*邀请用户注册需要传userId*/
			// console.log(6);
			var regsiter_param = {
					// "mobile":"12397719257",
					"mobile":tel_1,
					"safetyCode":verify_code,
					"password":$.md5(psw),
					"baseInfo":{
						"platform":5,
						"userId":invite_userId
					},
					"busiType":"ZP_ACTIVITY"
				};
			getData('POST',apiurl.register,'json',{"registerReq":JSON.stringify(regsiter_param)},true,false,registerFun);
		}

	});
	/*调用插件，获取图形验证码，并生成图片*/
	if($('body').attr('name') != 'login'){
		var verifyCode = new GVerify( {id:"v_container",canvasId:"verifyCanvas",width:5.6+"rem",height:1.8+"rem",type:"",code: ""});
	}
	//前端端验证
	$('#submit_picCode').on('click',function(){
		var va_res = verifyCode.validate($("#code_input").val());
	    if(va_res){//验证正确
	    	$('#mask,#vcode').hide();
	    	// console.log('ok');
	    	var imgVCode = $.trim($('#code_input').val());
	    	if($('body').attr('name') == 'register_h5'){
		    	var checkVcode_param = {
			    		"baseInfo":{
			    			"platform":5
			    		},
			    		"mobile":$.trim($('#tel').val()),
			    		"picVerifyCode":imgVCode,
			    		"type":3,
			    		"busiType":"WD_REGISTER"
			    	};
			    	//验证图形码同时获取短信验证码
			    	// console.log({"verifyCodeReq":JSON.stringify(checkVcode_param)});
			    	getData('POST',apiurl.getVerifyCode,'json',{"verifyCodeReq":JSON.stringify(checkVcode_param)},true,false,getVerifyCode);
			    	//sendCode();//启动倒计时
	    	}else{
		    	var checkVcode_param = {
		    		"baseInfo":{
		    			"platform":5,
		    			"userId":invite_userId
		    		},
		    		"mobile":$.trim($('#tel').val()),
		    		"picVerifyCode":imgVCode,
		    		"type":3
		    	};
		    	//验证图形码同时获取短信验证码
		    	// console.log({"verifyCodeReq":JSON.stringify(checkVcode_param)});
		    	getData('POST',apiurl.getVerifyCode,'json',{"verifyCodeReq":JSON.stringify(checkVcode_param)},true,false,getVerifyCode);
		    	//sendCode();//启动倒计时
	    		
	    	}
	    }else{//验正错误
	    	promptErr('请输入正确的图形验证码','#msg_pro');
	    }
	});
	/*用户登录*/
	$('#submit_login').on('click',function(){
		var l_tel = $.trim($('#tel').val());
		var password = $('#password').val();
		if(l_tel == "" || password == ""){
			promptErr('请输入手机号与密码','#msg_pro1');
		}else if(!re.test(l_tel)){
			promptErr('请输入正确的手机号','#msg_pro1');
		}else{
			var login_param = {
				"baseInfo":{
		    			"platform":5,
		    		},
				"mobile":l_tel,
				"safetyCode":password,
				"type":3,
				"busiType":"WD_REGISTER",
				"notifyUrl":notifyUrl

			}
			getData('POST',apiurl.login,'json',{"loginReqForWd":JSON.stringify(login_param)},true,false,loginHandle);
		}
	})
})
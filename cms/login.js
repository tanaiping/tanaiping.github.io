//JavaScript代码区域
layui.use(['jquery','element','layer', 'form'], function(){
	var element = layui.element
	,$ = layui.$  //重点之处。 引入jquery
	,layer = layui.layer
	,form = layui.form;

	//添加验证规则  
    // form.verify({  
	   //  name:function(value){
	   //  ……
	   //  return "";
	   //  },   
    // });
    initE();

    function login(url,userName,password,role){
    	var params = {"password":password,"userName":userName};
    	$.ajax({
            type: "post",
            url: basePath+url,
            data:JSON.stringify(params),
            contentType: "application/json",
            dataType: 'json',
            success: function(data) {
				if(data.resultCode==0){
					localStorage.setItem('role',role);
					localStorage.setItem('token',data.data.token);
					localStorage.setItem('userId',data.data.userId);
					localStorage.setItem('userName',data.data.userName);
					localStorage.setItem('feedback',data.data.feedback);
					
					if(role==0){
						window.location.href="Managers/main.html";
					}else{
						window.location.href="Business/main.html";
					}
				}else{
					$(".login-msg").text(data.resultMsg);
				}
            },
            fail: function() {
				$(".login-msg").text("网络异常，请稍后再试！");
            }
        });
    	

    }


	//监听提交
	form.on('submit(login)', function(data){
		var _role = 0;
		for(var i =0;i<$(".layui-login-tab li").length;i++){
			$(".layui-login-tab li").each(function(index, el) {
				if($(this).hasClass('act')){
					_role = index;
				}
			});
		}
		var userName = $("#user_name").val();
		var userPwd = $("#user_pwd").val();
		// console.log(data.field)
		userPwd = md5(userPwd);
		if(_role==0){//管理员
			login('/sys/account/admin/login',userName,userPwd,_role);
		}else if(_role==1){//商户
			login('/sys/account/bis/login',userName,userPwd,_role);
		}
		// else{//代理商
		// 	login('/sys/account/agent/login',userName,userPwd,_role);
		// }
		return false;
	});


	//切换登录身份
	$(".layui-login-tab li").click(function(){
		var index = $(".layui-login-tab li").index(this);
		$(".layui-login-submit").attr("type",index);
		$(".layui-login-tab li").removeClass('act').eq(index).addClass('act');
		initE();
	});

	function initE(){
		$("#login_box").html('<div class="layui-form-item">'+
            '<input type="text" name="username" required  lay-verify="required" placeholder="账户名" autocomplete="off" class="layui-input" id="user_name">'+
        	'</div><div class="layui-form-item">'+
            '<input type="password" name="psd" required  lay-verify="required" placeholder="账户密码" autocomplete="off" class="layui-input" id="user_pwd">'+
        	'</div><div class="layui-form-item">'+
            '<button class="layui-btn layui-login-submit layui-btn-lg" lay-submit lay-filter="login" type="0">登录</button></div>'+
			'<div class="layui-form-item login-msg" style=" text-align: center;color: red;"></div>');
		element.init();
	}

	
	//判断是否已登录
	var role = localStorage.getItem('role');
	if(role!=""&&role!=undefined){
		if(role==0){
			window.location.href="Managers/main.html";
		}else{
			window.location.href="Business/main.html";
		}
	}
});


//js 加密 +混淆

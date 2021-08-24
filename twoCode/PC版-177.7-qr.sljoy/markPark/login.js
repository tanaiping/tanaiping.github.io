//JavaScript代码区域
layui.use(['jquery','element','layer', 'form'], function(){
	var element = layui.element
	,$ = layui.$  //重点之处。 引入jquery
	,layer = layui.layer
	,form = layui.form;


    function login(url,userName,password){
    	var params = {"password":password,"userName":userName};
    	$.ajax({
            type: "post",
            url: basePath+url,
            data:JSON.stringify(params),
            contentType: "application/json",
            dataType: 'json',
            success: function(data) {
				if(data.resultCode==0){
					localStorage.setItem('token',data.data.token);
					localStorage.setItem('userId',data.data.userId);
					localStorage.setItem('userName',data.data.userName);
					localStorage.setItem('feedback',data.data.feedback);
					
					window.location.href="Managers/main.html";
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
		var userName = $("#user_name").val();
		var userPwd = $("#user_pwd").val();
		// console.log(data.field)
		userPwd = md5(userPwd);
		login('/sys/account/admin/login',userName,userPwd);
		
		return false;
	});


});


//js 加密 +混淆

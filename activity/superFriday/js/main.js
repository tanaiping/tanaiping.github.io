// $(function(){
var basePath = 'http://activity.peanut8.com/';
var payType = 1;
var openid = '';
var inviteId = nfyg.otherCommon.GetQueryString("inviteId"); //
inviteId == null ? inviteId = "" : inviteId;
var id = nfyg.otherCommon.GetQueryString("id"); //商品id
id == null ? id = "" : id;
var price = nfyg.otherCommon.GetQueryString("price"); //商品price
price == null ? price = "" : price;
var state = -1 ;
var interUserInfo = '' //授权定时器
var isbind = false  //默认没有绑定微信
// shareData.url = baseUrl + "/act/2020/superFriday/index.html?id=" + id + "&inviteId=" + inviteId;
// var initShare = function(){
if (isApp) {
	nfyg.encrypt(mobile, function(data) {
		var app_mobile = encodeURIComponent(data)
		if (state == 3) {
			shareData.url = baseUrl + "/act/2020/superFriday/share_wx.html?id=" + id + "&inviteId=" + app_mobile
		} else {
			var url = baseUrl + "/act/2020/superFriday/index.html?id=" + id + "&inviteId=" + app_mobile
			shareData.url = baseUrl + "/20/friday/wx?url="+encodeURIComponent(url);
		}
	})
}
// }

$(document).on("click","#logic_btn",function(){
	var logistics = $(this).attr("logistics");
	window.open("https://m.kuaidi100.com/result.jsp?nu=" + logistics)
})

var ishistory = nfyg.otherCommon.GetQueryString("ishistory"); //
ishistory == null ? ishistory = "" : ishistory;
var flag = nfyg.otherCommon.GetQueryString("flag"); //
flag == null ? flag = "" : flag;
//点击支付预付款 1元
$(".payment-btn").click(function() {
	// showLoginPop();
	// return 
	if (state == 3) {
		nfyg.otherCommon.promptShow('非活动进行时间，不能支付哦~');
		return false;
	}
	if (isApp) {
		if (!userInfo) {
			nfyg.otherCommon.promptShow('您先登录');
			return false;
		}
		nfyg.encrypt(mobile, function(data) {
			pay(1,data);
		})
	} else {
		// mobile = $.cookie('tel');
		// if (!mobile) {
		// 	nfyg.otherCommon.promptShow('您先登录');
		// 	showLoginPop();
		// 	return false;
		// }
		openApp();
	}
	

})

//跳到预支付1元定金页面
$("#goPay").click(function() {
	if(state == 0||state == 3){
		nfyg.otherCommon.promptShow('非活动进行时间，不能支付哦~');
		return false;
	}
	window.location.href = "payment.html?id=" + id+ "&inviteId=" + inviteId +"&price=1";
})
//回到首页
$(".back-home").click(function() {
	window.location.href = "index.html?id=" + id+ "&inviteId=" + inviteId+"&flag=1";
})

//跳到抽签记录列表
$(".go-record").click(function() {
	window.location.href = "recordList.html?id=" + id+ "&inviteId=" + inviteId;
})
//跳到详情
$(".go-detail").click(function() {
	window.location.href = "detail.html?id=" + id+ "&inviteId=" + inviteId;
})

$(".paylast-btn").click(function() {
	submitAddress();
})
//点击登录
$(document).on("click", ".login-btn", function() {
	login();
})
//点击注册 
$(document).on("click", ".reg-btn", function() {
	var userName = $("#userName").val();
	var yzm = $("#yzm").val();
	nfyg.otherCommon.getDatanormal("post", basePath + '20/friday/reg', "json", {
		userName: userName,
		uuid: uuid,
	}, true, function(res) {
		if (res.code == 1) {
			// 处理登录成功代码
			$("#blackBg,.popwrap").remove();
			regSuccess();
		} else {
			nfyg.otherCommon.promptShow(res.msg);
		}
	})
})

//去参与
$(document).on("click", ".go-join", function() {
	window.location.href = "payment.html?id=" + id + "&inviteId=" + inviteId+"&price=1";
})
//点击关闭弹窗
$(document).on("click", ".close-pop", function() {
	$("#blackBg,.popwrap").remove();
})

//去注册
$(document).on("click", ".go-reg-txt", function() {
	$("#blackBg,.popwrap").remove();
	showRegPop();
})
//去往期活动
$(document).on("click", ".history-btn", function() {
	window.location.href="index.html?id="+id+"&ishistory=1";
})

//抽签记录跳转
$(document).on("click", ".record-elem", function() {
	var states = $(this).attr("state");
	var timeout = $(this).attr("timeout");
	var address = $(this).attr("address");
	var isPay = $(this).attr("isPay");
	var isWinner = $(this).attr("isWinner");
	if(states==1){
		window.location.href="waitLottery.html?id=" + id + "&inviteId=" + inviteId;
	}else if(states==2){
		window.location.href="lotterying.html?id=" + id + "&inviteId=" + inviteId;
	}else if(states==3){
		if (isWinner != 1) {
			window.location.href="loseLottery.html?id=" + id + "&inviteId=" + inviteId;
		}else{
			if(timeout==1){
				window.location.href="overTime.html?id=" + id + "&inviteId=" + inviteId;
			}else{
				if(isPay!=1){
					window.location.href="payEnd.html?id=" + id + "&inviteId=" + inviteId;
				}else{
					window.location.href = "waitEnd.html?id=" + id + "&inviteId=" + inviteId;
				}
			}
		}
	}
	
})


//转发微信好友、朋友圈
$(document).on("click", ".repay-btn,.repay-btn2", function() {
	if (isApp) {
		if (!userInfo) {
			nfyg.otherCommon.promptShow('您先登录');
			return false;
		}
		nfyg.encrypt(mobile, function(data) {
			var app_mobile = encodeURIComponent(data)
			if (state == 3) {
				shareData.url = baseUrl + "/act/2020/superFriday/share_wx.html?id=" + id + "&inviteId=" + app_mobile+"&channel=share"
			} else {
				shareData.imgUrl =  baseUrl + "/act/2020/superFriday/images/share.jpg";
				var url = baseUrl + "/act/2020/superFriday/index.html?id=" + id + "&inviteId=" + app_mobile+"&channel=share"
			}
			nfyg.openSharePanel(shareData.url, shareData.imgUrl, shareData.title, shareData.text); //
		})
	} else {
		// mobile = $.cookie('tel');
		// if (!mobile) {
		// 	nfyg.otherCommon.promptShow('您先登录');
		// 	showLoginPop();
		// 	return false;
		// }
		var html = '<div id="blackBg"></div>' +
			'<div class="popup popup__wechat"><img src="images/wechat_share.png" alt="" class="share-pop-img2"></div>'
		$("body").append(html);
	}

})

//微信的分享页面
$(".link-app,.go-app").click(function() {
	openApp();
});
$(document).on("click", ".popup,#blackBg", function() {
	$(".popup,#blackBg").remove();
})



var indexInitPage = function(type) {
	if (isApp) {
		if (!userInfo) {
			nfyg.otherCommon.promptShow('您先登录');
			return false;
		}
		nfyg.encrypt(mobile, function(data) {
			comFun(data,type);
		})
		
	} 
}

var comFun = function(mobile,type){
	
	nfyg.otherCommon.getDatanormal("post", basePath + '20/friday/index', "json", {
		tel: mobile,
		id: id,
		type: type
	}, true, function(res) {
		console.log(res);
		if (res.code == 1) {
			// console.log(res);
			// 处理登录成功代码
			state = res.data.state;
			console.log(state)
			if(state==3||res.data.isPay ==1){
				$(".repay-btn2").show();
			}
			if(flag==1) return ;//
			if(ishistory==1) return; //往期活动
			if (type == 1 || type == 2) {
				// console.log(state+"====state")
				// console.log(res.data.isPay+"====isPay");
				// return false
				if (state == 1) { //抽签准备
					if(res.data.isPay == 1){
						window.location.href = "waitLottery.html?id=" + id + "&inviteId=" + inviteId;
					}
				} else if (state == 2) { //抽签中
					if(res.data.isPay == 1){
						window.location.href = "lotterying.html?id=" + id+ "&inviteId=" + inviteId;
					}
				}
			} else if (type == 3) {
				if (state != 2) {
					countDown(res.data.countdown)
				}
				var html = '';
				if (res.data.mCode.length > 0) {
					for (var i = 0; i < res.data.mCode.length; i++) {
						html += '<p>' + res.data.mCode[i] + '</p>'
					}
				}
				$(".code-box").html(html)
			} else if (type == 4) {
				$("#signCode span").text(res.data.winningCode)
				if (res.data.isWinner != 1) { //
					//window.location.href = "loseLottery.html?id=" + id;
				} else {
					if (res.data.logistics == '') {
						$("#logistics").html('未发货');
					} else {
						$("#logistics").html('快递单号：<span id="orderCode">' + res.data.logistics +
							'</span><div id="logic_btn" class="logistics-btn2" logistics = "'+res.data.logistics+'"></div>');
					}
					$("#winningCode").text(res.data.winningCode)
					$("#person").text(res.data.address.name)
					$("#mobile").text(res.data.address.mobile)
					$("#address").text(res.data.address.address)
	
				}
			}else if(type == 6){
				console.log(res);
				$(".wx_info .t1 span").text(res.data.openDate);
			}
	
		} else {
			nfyg.otherCommon.promptShow(res.msg);
		}
	})
}

//支付
var pay = function(type,mobile,name, mobiles, address) {
	// alert("==="+inviteId+"====")
	nfyg.otherCommon.getDatanormal("post", basePath + '20/friday/pay', "json", {
		tel: mobile,
		inviteId: inviteId,
		id: id,
		type: type,
		name: name,
		address: address,
		mobile: mobiles,
	}, true, function(res) {
		console.log(res);
		if (res.code == 1) {
			// 处理登录成功代码
			if (res.data) {
				if (res.data.isPay == 0) {
					if(isApp){
						payType = type;
						nfyg.peanutPay(1, 'business004', '', '', '', res.data.money, userId, res.data.extContent);
					}else{
						openApp();
					}
				} else { //如果已付款 不管是订金 还是尾款  跳转页 根据状态 跳到 已付定金页面或开奖页面
					if (type == 1) {
						window.location.href = "waitLottery.html?id=" + id + "&inviteId=" + inviteId;
					} else {
						window.location.href = "waitEnd.html?id=" + id + "&inviteId=" + inviteId;
					}
				}
			}
		}else if(res.code == -5){
			nfyg.AuthOnGetUserInfo();
			
			if(nfyg.browser.ios){
				interUserInfo = setInterval(function(){
					nfyg.getWXUserInfo();
					
				},1000);
			}
			// getWXUserInfo
		} else {
			nfyg.otherCommon.promptShow(res.msg);
		}
	})
}
//提交收货信息
var submitAddress = function() {
	var person = $("#person").val().trim();
	var mobiles = $("#mobile").val().trim();
	var address = $("#address").val().trim();
	if (person == '' || mobile == '' || address == '') {
		nfyg.otherCommon.promptShow('填写收货信息才能支付哦~');
		return false;
	} else {
		if (!isMobile(mobile)) {
			nfyg.otherCommon.promptShow('请输入11位数的手机号码');
			return false;
		}
	}
	if(isApp){
		nfyg.encrypt(mobile, function(data) {
			pay(2,data, person, mobiles, address)
		})
	}else{
		openApp();
	}
	
}
//登录弹窗
var showLoginPop = function() {
	var html = '<div id="blackBg"></div>' +
		'<div id="loginPop" class="popwrap">' +
		'<div class="pop-mainbox">' +
		'<div class="flex-center"><img src="images/login_title.png" alt="" class="login-title"></div>' +
		'<input type="text" placeholder="用户名" class="pop-input" id="mobile">' +
		'<div class="pr"><input type="text" placeholder="验证码" class="pop-input" id="code"><div class="get-code" id="getCode">获取验证码</div></div>' +
		// '<a href="javascript:;" class="go-reg-txt">没有账号，注册</a>'+
		'<div class="login-btn"></div>' +
		'</div><div class="close-pop"></div></div>'
	$("body").append(html)
}


//登录成功
var loginSuccess = function() {
	var html = '<div id="blackBg"></div>' +
		'<div id="loginSuccessPop" class="popwrap">' +
		'<div class="pop-mainbox">' +
		'<div class="flex-center"><img src="images/login_success_icon.png" alt="" class="success_icon"></div>' +
		'<div class="flex-center"><img src="images/login_success_con.png" alt="" class="success_content"></div>' +
		'<div class="go-join"></div>' +
		'</div><div class="close-pop"></div></div>'
	$("body").append(html)
}

//注册弹窗
var showRegPop = function() {
	var html = '<div id="blackBg"></div>' +
		'<div id="loginPop" class="popwrap">' +
		'<div class="pop-mainbox">' +
		'<div class="flex-center"><img src="images/reg_title.png" alt="" class="reg-title"></div>' +
		'<input type="text" placeholder="用户名" class="pop-input" id="mobile">' +
		'<input type="password" placeholder="密码" class="pop-input" id="yzm">' +
		'<div class="reg-btn"></div>' +
		'</div><div class="close-pop"></div></div>'
	$("body").append(html)
}


//注册成功
var regSuccess = function() {
	var html = '<div id="blackBg"></div>' +
		'<div id="regSuccessPop" class="popwrap">' +
		'<div class="pop-mainbox">' +
		'<div class="flex-center"><img src="images/reg_success_icon.png" alt="" class="reg_icon"></div>' +
		'<div class="flex-center"><img src="images/login_success_con.png" alt="" class="success_content"></div>' +
		'<div class="go-join"></div>' +
		'</div><div class="close-pop"></div></div>'
	$("body").append(html)

}

//打开APP
var openApp = function(){
	if (nfyg.browser.weixin || nfyg.browser.qq || nfyg.browser.ding || nfyg.browser.alipay || nfyg.browser.weibo) {
		var html = '<div id="blackBg"></div>' +
			'<div class="popup popup__wechat"><img src="images/icon_open.png" alt="" class="share-pop-img"></div>'
		$("body").append(html)
	} else {
		shareData.url = baseUrl + "/act/2020/superFriday/index.html?id=" + id + "&inviteId=" + inviteId;
		openNfygApp(shareData.url);
	}
}

//抽签记录列表
var recordList = function() {
	if (isApp) {
		if (!userInfo) {
			nfyg.otherCommon.promptShow('您先登录');
			return false;
		}
		nfyg.encrypt(mobile, function(data) {
			loadList(data);
		})
	} else {
		// mobile =$.cookie('tel');
		// if (!mobile) {
		// 	nfyg.otherCommon.promptShow('您先登录');
		// 	showLoginPop();
		// 	return false;
		// }
		// loadList(mobile);
		//openApp();
		nfyg.otherCommon.promptShow('参与记录要打开花生地铁APP查看哦~');
		
	}
}

var loadList = function(mobile){
	console.log(mobile);
	nfyg.otherCommon.getDatanormal("post", basePath + '20/friday/record', "json", {
		tel: mobile
	}, true, function(res) {
		if (res.code == 1) {
			// 处理登录成功代码
			console.log(res)
			var html = '';
			if (res.data.length > 0) {
				for (var i = 0; i < res.data.length; i++) {
					html += '<div class="record-elem" address ="'+res.data[i].address +'" isPay="'+res.data[i].isPay+'" isWinner ="'+res.data[i].isWinner +'" state="'+res.data[i].state+'" timeout="'+res.data[i].timeout+'">' +
						'<div class="record-con1">' +
						'<div>半价' + res.data[i].name + '</div>' +
						'<div>' + res.data[i].actStatus + '</div>' +
						'</div>' +
						'<div class="record-con2-box">' +
						'<div class="record-con2">' +
						'<div class="con2-elem">参与日期：' + res.data[i].addTime + '</div>' +
						'<div class="con2-elem">' + res.data[i].payStatus + '</div>' +
						'</div>' +
						'<div class="record-con2">' +
						'<div class="con2-elem">状态：' + res.data[i].deposit + '</div>'
					// if (res.data[i].logistics != "") {
					// 	html += '<div class="con2-elem"><a href="https://m.kuaidi100.com/result.jsp?nu="' + res.data[i].logistics +
					// 		' class="logistics-btn"></a></div>'
					// }
					html += '</div></div></div>'
				}
	
			} else {
				html += '<div class="record-elem">' +
					'<div class="record-null">你还没有抽签记录哦~</div></div>'
			}
	
	
			$("#record_con").html(html);
	
		} else {
			nfyg.otherCommon.promptShow(res.msg);
		}
	})
}


var isMobile = function(string) {
	var reg = /^0?1[0-9]{10}$/;
	return reg.test(string);
}

var timeout = "";
var countDown = function(t) {
	let time_hour, time_minute, time_second; //time_day,
	if (t > 0) {
		// time_day = Math.floor(t / 60 / 60 / 24);
		time_hour = Math.floor(t / 60 / 60 % 24)+ Math.floor(t / 60 / 60 / 24)*24;
		time_minute = Math.floor(t / 60 % 60);
		time_second = Math.floor(t % 60);
		if (time_hour < 10) {
			time_hour = "0" + time_hour;
		}
		if (time_minute < 10) {
			time_minute = "0" + time_minute;
		}
		if (time_second < 10) {
			time_second = "0" + time_second;
		}
		$("#countdown").text(time_hour + ":" + time_minute + ":" + time_second);
		timeout = setTimeout(function() {
			t--
			countDown(t);
		}, 1000);
	} else {
		clearTimeout(timeout)
	}
}

var bindAccount = function(mobile,openId){
	nfyg.otherCommon.getDatanormal("post", basePath + '20/friday/bindAccount', "json", {
		tel: mobile,
		openId: openId,
	}, true, function(res) {
		console.log(res)
		console.log("==绑定的返回==")
		if (res.code == 1) {
			// 处理登录成功代码
			console.log('授权成功！')
			console.log(mobile)
			pay(1,mobile);
		} else {
			nfyg.otherCommon.promptShow(res.msg);
		}
	})
}


//支付成功之后  app主动回调h5的方法
window.PayResultCallBack = function PayResultCallBack(res) {
	console.log(res);
	const data = nfyg.browser.ios ? res : JSON.parse(res)
	console.log(parseInt(data.resultCode))
	if (parseInt(data.resultCode) === 1||parseInt(data.resultCode) === 101) {
		//_czc.push(['_trackEvent', '支付成功', '统计', '用户支付成功回调teamId=' + teamId]);
		if (price == 1) {
			nfyg.otherCommon.promptShow('参与成功');
			setTimeout(function(){
				window.location.href = "waitLottery.html?id=" + id + "&inviteId=" + inviteId;
			},1000);
		} else {
			window.location.href = "waitEnd.html?id=" + id + "&inviteId=" + inviteId;
		}
	}
}

//微信授权的APP主动回调
window.AuthCallBack = function (a, b) {
	console.log(a); //ios返回 obj
	console.log(b);//安卓返回 string 
	if(nfyg.browser.ios){
		openid = a.openid;
	}else{
		var dataobj = eval("("+b+")");
		openid = dataobj.openid;
	}
	
	if(openid == '(null)'||openid == ''||openid == undefined){
		nfyg.otherCommon.promptShow('授权失败');
		return false
	}
	if(!isbind){
		isbind = true;
		nfyg.encrypt(openid, function(data) {
			openid = data;
			nfyg.encrypt(mobile, function(res) {
				bindAccount(res,openid);
			})
		})
	}else{
		nfyg.otherCommon.promptShow('不能重复绑定哦');
	}
	
}



















// })

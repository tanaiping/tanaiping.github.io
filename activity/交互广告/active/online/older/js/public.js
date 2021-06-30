//rem 设置
function Rem() {
var docEl = document.documentElement,
oSize = docEl.clientWidth / 36;

if (oSize > 20) {
oSize = 20; // 限制rem值 720 / 36 =20
}
//console.log(oSize);
docEl.style.fontSize = oSize + 'px';
}

function mainH(){
	var win_w = document.documentElement.clientWidth;
	if(win_w>750){
		win_w=750;
	}
    var main_h =parseFloat(win_w*1206/750);
    $(".main-wrap").css("height",main_h+"px");
}

//用于生成uuid
function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
	return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
}


//获取地址栏数据  GetQueryString("appkey")
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

//自定义cookie对象
var cookie = {
	"setCookie": function (name, value) {
		var curDate = new Date();
		//当前时间戳
		var curTamp = curDate.getTime();
		//当前日期
		var curDay = curDate.toLocaleDateString();
		var brow = $.browser;
		var curWeeHours = 0;
		if (brow.safari) {
			//当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
			curWeeHours = new Date(curDay).getTime() + (8 * 60 * 60 * 1000) - 1;
		} else {
			curWeeHours = new Date(curDay).getTime() - 1;
		}
		//当日已经过去的时间（毫秒）
		var passedTamp = curTamp - curWeeHours;
		
		//当日剩余时间
		var leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
		var leftTime = new Date();
		leftTime.setTime(leftTamp + curTamp);
		//创建cookie
		document.cookie = name + "=" + value + ";expires=" + leftTime.toGMTString() + ";path=/";
	},
	"getCookie": function (name) {
		//name 为想要取到的键值的键名
		var reg = /\s/g;
		var result = document.cookie.replace(reg, "");
		var resultArr = result.split(";");
		for (var i = 0; i < resultArr.length; i++) {
			var nameArr = resultArr[i].split("=");
			if (nameArr[0] == name) {
				return nameArr[1];
			}
		}
	},
	"removeCookie": function (name) {
		//name为想要删除的Cookie的键名
		var oDate = new Date(); //时间对象
		oDate.setDate(new Date().getDate() - 1);
		document.cookie = name + "=123;expires=" + oDate + ";path=/";
	}
}

function system(){
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isAndroid==true){
		platform = 1;
	}else if(isiOS==true){
		platform = 2;
	}else{
		var random = parseInt(Math.random()*2)+1;
		platform = random;
	}
}
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=750){
                docEl.style.fontSize = '20px';
            }else{
                docEl.style.fontSize = 20 * (clientWidth / 750) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var basePath ="http://activity.peanut8.com/";
var cookie = {
    set:function(key,val,time){//设置cookie方法
        var date=new Date(); //获取当前时间
        var expiresDays=time;  //将date设置为n天以后的时间
        date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
        document.cookie=key + "=" + val +";expires="+date.toGMTString();  //设置cookie
    },
    get:function(key){//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
            var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips=arr[1];   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    },
    delete:function(key){ //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime()-10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" +date.toGMTString();//设置cookie
    }
}

var nfyg = new NFYG();
var type=1; //APP 内为非1  APP外为1;
var hasAwards=1;
console.log(nfyg);
var isApp = nfyg.browser.isNfyg;
var tel, nickName, headUrl, point, userId;
if (isApp) {
	var userInfo = nfyg.getUserInfo();
  console.log(userInfo)
	userInfo = JSON.parse(userInfo);
	  tel = userInfo.mobile;
	  nickName = userInfo.nickName;
	  headUrl = userInfo.headUrl;
	  point = userInfo.point;
	  userId = userInfo.userId;
	 if (userId == '' || userId == undefined || userId == null) {
	    nfyg.pushToLoginView()
	  }
	   
	type=2;
} else {
 $(".packet-box").hide();
 if(cookie.get("tel")==undefined){
    $(".black-formsbg,.login").show();
 }else{
  tel = cookie.get("tel");
 }
}
//定义步数变量
var step;

  //判断微信
	function is_weixn() {
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	}

  //是否是qq打开 
  function is_qq() {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/QQ\/[0-9]/i)) {
      return true;
    } else {
      return false;
    }
  }

  function get_os() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if(userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
      return 2;
    } else {
      return 1;
    }
  }

//验证码
var interval;
var num =60;
function times(){
if(num>0){
    num--;
    $(".yzm-btn").text(num+"s");
}else{
    clearInterval(interval);
    $(".yzm-btn").removeClass('disabled').text("获取验证码");
}
}
$(".yzm-btn").click(function(){
	var tel = $(".tel-num").val();
	var $this = $(this);
	console.log(tel);
    if(!$(this).hasClass('disabled')){
    	$.ajax({
            type: "post",
            url: basePath+'activity/send',
            data:{"tel":tel},
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if(data.code==1){
	                num=60;
			        $this.addClass('disabled').text(60+"s");
			        interval = setInterval(times,1000);
                }else{
                	$(".error-text").text(data.msg);
                }
            }
          });
    }
})
//APP内右上角分享
/*app右上角分享调用方法定义*/
function reShare() {
  var title = "连地铁WiFi赢张信哲演唱会门票！";
  var url = 'http://activity.peanut8.com/act/2019/dice/index.html';
  var imgUrl = 'http://activity.peanut8.com/act/2019/dice/images/share.jpg';
  var text = "花生地铁WiFi  上班族都在使用";
    return {
      "title": title,
      "url": url,
      "imgUrl": imgUrl,
      "text": text
    }
}



//微信分享
var url = 'http://activity.peanut8.com/act/2019/dice/index.html';
var imageUrl = 'http://activity.peanut8.com/act/2019/dice/images/share.jpg';
var title = '连地铁WiFi赢张信哲演唱会门票！';
var desc = '花生地铁WiFi  上班族都在使用';
var wx_url = window.location.href;
$.ajax({
	type: "get",
	url: 'http://activity.peanut8.com/WxShare/anxious',
	data: {
		url: wx_url
	},
	dataType: 'json',
	success: function(data) {
		if(data.code == 1) {
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.data.sharePackage.appId, // 必填，公众号的唯一标识
				timestamp: data.data.sharePackage.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.data.sharePackage.nonceStr, // 必填，生成签名的随机串
				signature: data.data.sharePackage.signature, // 必填，签名，见附录1
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage'
				] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			var shareInfo = data.data.shareInfo;
			wx.ready(function() {
				//分享到朋友圈
				wx.onMenuShareTimeline({
					title: title, // 分享标题
					desc: desc,
					link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imageUrl, // 分享图标
					success: function() {

					},
					cancel: function(res) {

					}
				});

				//分享给朋友
				wx.onMenuShareAppMessage({
					title: title, // 分享标题
					desc: desc, // 分享描述
					link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imageUrl, // 分享图标
					success: function() {

					},
					cancel: function() {

					}
				});
			});
		}
	},
	error: function() {}
})



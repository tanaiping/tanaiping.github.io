!(function (doc, win) {
  var docEle = doc.documentElement, //获取html元素
    event = "onorientationchange" in window ? "orientationchange" : "resize", //判断是屏幕旋转还是resize;
    fn = function () {
      var width = docEle.clientWidth;
      if (width > 750) {
        docEle.style.fontSize = "200px";
      } else {
        width && (docEle.style.fontSize = 200 * (width / 750) + "px"); //设置html的fontSize，随着event的改变而改变。
      }
    };
  win.addEventListener(event, fn, false);
  doc.addEventListener("DOMContentLoaded", fn, false);
  win.onresize = function () {
    fn();
  };
})(document, window);

var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
		var ua = u.toLowerCase();
        return {
          // 浏览器和设备信息
          ie: u.indexOf("Trident") > -1, //IE内核
          presto: u.indexOf("Presto") > -1, //opera内核
          webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
          gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
          iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf("iPad") > -1, //是否iPad
          webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
          mobile: !!u.match(/AppleWebKit.*Mobile.*/) || (!!u.match(/AppleWebKit/) && u.indexOf("QIHU") && u.indexOf("QIHU") > -1 && u.indexOf("Chrome") < 0), //是否为移动终端
          android: ua.match(/Android/i) == "android", //android终端
          ios: ua.match(/iPhone\sOS/i) == "iphone os", //ios终端
          weixin: ua.match(/MicroMessenger/i) == "micromessenger", //微信內置浏览器
          qqb: ua.match(/MQQBrowser/i) == "mqqbrowser" && !u.match(/\sQQ/i), //QQ浏览器
          qq: ua.match(/iPhone\sOS/i) == "iphone os" ? (ua.match(/\sQQ/i) == " qq" && !u.match(/MQQBrowser/i)) : (ua.match(/\sQQ/i) == " qq" && ua.match(/MQQBrowser/i) == "mqqbrowser"), //QQ内置浏览器
          weibo: ua.match(/WeiBo/i) == "weibo", // 微博内置浏览器
          alipay: ua.match(/Alipay/i) == "alipay", // 支付宝内置浏览器
          ding: ua.match(/dingtalk/i) == "dingtalk", //钉钉内置浏览器
          isNfyg: ua.match(/iPhone\sOS/i) == "iphone os" ? (typeof isNfygPlatform === "function" ? isNfygPlatform() : false) : (window.news ? true : false) //是否花生地铁APP
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
}
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = decodeURIComponent(window.location.search).substr(1).match(reg);
  if (r != null) {
	return decodeURI(r[2])
  }
  return null
}

function promptShow(msg) {
  $("#prompt").children("em").html(msg);
  $("#prompt").show();
  window.setTimeout(function () {
	$("#prompt").hide()
  }, 2000)
}

function getDatanormal(type, url, datatype, data, async, callback) {
  $.ajax({
	type: type,
	url: url,
	dataType: datatype,
	data: data,
	async: async,
	timeout: 5000,
	success: function (res) {
	  callback(res)
	},
	error: function (XMLHttpRequest, textStatus, errorThrown) {
	  promptShow("<strong>抱歉，网络繁忙请稍后</strong><br/>或尝试切换网络试试")
	}
  })
}
//线上
// var baseUrl ='http://activity.peanut8.com';

//测试接口地址
var baseUrl2 ='http://cmsapi.wifi8.com';

//测试地址
var baseUrl ='http://cmsfile.wifi8.com';

// 分享数据
var shareData = {
  url: baseUrl + "/uploads/wifi/AppH5/communityDetail/detai.html",
  imgUrl: baseUrl + "/uploads/wifi/AppH5/communityDetail/images/share.jpg",
  title: "",
  text: ""
};
// 打开花生地铁APP
function openNfygApp(communityId) {
  if (browser.versions.weixin || browser.versions.qq || browser.versions.ding || browser.versions.alipay || browser.versions.weibo) {
    $('.blackbg, .wx_share').show();
  } else {
	  if(browser.versions.ios){
		  // console.log('nfyg://1/PNCommunityDetailViewController?communityId='+communityId)
		  window.location.href = 'nfyg://1/PNCommunityDetailViewController?communityId='+communityId
	  }else{
		  window.location.href = 'nfyg://launcher?url=nfyg://1/com.nfyg.hsbb.views.community.CommunityDetailActivity?communityId='+communityId
	  }
    //window.location.href = "nfyg://detail?url=" + shareData.url
    setTimeout(() => {
      // 下载落地页
      window.location.href = "http://web.peanut8.com/download"
    }, 4000);
  }
}
/*app右上角分享调用方法定义*/
function reShare() {
  return {
    title: shareData.title,
    url: shareData.url,
    imgUrl: shareData.imgUrl,
    text: shareData.text
  }
}
// 微信分享
wechatShare(shareData.url, shareData.imgUrl, shareData.title, shareData.text)
// 微信分享
function wechatShare(url, imgUrl, title, text) {
  var nurl = window.location.href;
  $.ajax({
    type: "get",
    url: "http://activity.peanut8.com/wxShare/anxious",
    data: {
      url: nurl
    },
    dataType: "json",
    success: function (data) {
      if (data.code == 1) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.data.sharePackage.appId, // 必填，公众号的唯一标识
          timestamp: data.data.sharePackage.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.data.sharePackage.nonceStr, // 必填，生成签名的随机串
          signature: data.data.sharePackage.signature, // 必填，签名，见附录1
          jsApiList: [
            "checkJsApi",
            "onMenuShareTimeline",
            "onMenuShareAppMessage"
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
          //分享到朋友圈
          wx.onMenuShareTimeline({
            title: title, // 分享标题
            desc: text,
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {},
            cancel: function (res) {}
          });
          //分享给朋友
          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: text,
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {},
            cancel: function () {}
          });
        });
      }
    },
    error: function () {}
  });
}

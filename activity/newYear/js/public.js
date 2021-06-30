var basePath = 'http://192.168.3.92:8081';
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=750){
                docEl.style.fontSize = '100px';
            }else{
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


 //  提示信息
function promptShow(msg) {
    $('#prompt').children('em').html(msg);
    $('#prompt').show();
    window.setTimeout(function () {
      $('#prompt').hide();
    }, 2500);
}

let nfygNickName, opetionResult, dataLackDraw;
let optionSum = 0;
let isLuckyCardTouch = false;

var nfyg = new NFYG();
var isApp = nfyg.browser.isNfyg;
var userInfo = "";
var baseInfo = "";
var mobile, nickName, headUrl, point, userId;
var level = 5;
if (isApp) {
  baseInfo = nfyg.getBaseInfo();
  if (baseInfo != "") {
    baseInfo = JSON.parse(baseInfo);
  }
  userInfo = nfyg.getUserInfo();
  if (nfyg.browser.android) {
    if (userInfo != "" && userInfo != undefined && userInfo != null) {
      userInfo = JSON.parse(userInfo);
      mobile = userInfo.mobile;
      nickName = userInfo.nickName;
      headUrl = userInfo.headUrl;
      point = userInfo.point;
      userId = userInfo.userId;
      level = userInfo.level;
    } else {
      nfyg.pushToLoginView();
    }
  } else if (nfyg.browser.ios) {
    userInfo = JSON.parse(userInfo);
    mobile = userInfo.mobile;
    nickName = userInfo.nickName;
    headUrl = userInfo.headUrl;
    point = userInfo.point;
    userId = userInfo.userId;
    level = userInfo.level;
    if (userId == "" || userId == undefined || userId == null) {
      nfyg.pushToLoginView();
    }
  }
  if (headUrl == "" || typeof (headUrl) == undefined || headUrl == null) {
    headUrl = "../images/icon_head.png"
  }
}else{
    mobile = localStorage.getItem("mobile");
} 



var baseUrl = "http://activity.peanut8.com";
// 分享数据
var shareData = {
  url: baseUrl + "/act/2019/Lack/html/index.html",
  imgUrl: baseUrl + "/act/2019/Lack/images/share.png",
  title: "我正在领开工红包，拜托帮帮我哦",
  text: "大吉大利，开工有喜【花生地铁新春福利】"
};

/*app右上角分享调用方法定义*/
function reShare() {
  return {
    title: shareData.title,
    url: shareData.url,
    imgUrl: shareData.imgUrl,
    text: shareData.text
  };
}
wechatShare(shareData.url, shareData.imgUrl, shareData.title, shareData.text)

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


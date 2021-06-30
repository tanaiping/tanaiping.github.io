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

var nfyg = new NFYG();
var isApp = nfyg.browser.isNfyg;
var userInfo = "";
var baseInfo = "";
var mobile, nickName, headUrl, point, userId;
var level = 5;
var _czc = _czc || [];

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
    headUrl = "../images/nfyg_head.png"
  }
  nfyg.getNewUserInfo(function (data) {
    userInfo = JSON.parse(data);
    mobile = userInfo.mobile;
    nickName = userInfo.nickName;
    headUrl = userInfo.headUrl;
    point = userInfo.point;
    userId = userInfo.userId;
    level = userInfo.level;
    if (userId == "" || userId == undefined || userId == null) {
      nfyg.pushToLoginView();
    }
  })
} else {

}
var baseUrl ='http://activity.peanut8.com';
// 分享数据
var shareData = {
  url: baseUrl + "/act/2020/meeting/index.html",
  imgUrl: baseUrl + "/act/2020/meeting/images/share.png",
  title: "打卡~领绝版周边！",
  text: "打卡~领绝版周边！"
};
// 后台接口
var urlConfig = {
  'send': baseUrl + '/19/user/send',
  'login': baseUrl + '/19/user/login',
}

// 打开花生地铁APP
function openNfygApp() {
  if (nfyg.browser.weixin || nfyg.browser.qq || nfyg.browser.ding || nfyg.browser.alipay || nfyg.browser.weibo) {
    $('.popup, .popup__wechat').addClass('active')
  } else {
    window.location.href = "nfyg://detail?url=" + shareData.url
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


// 点击获取验证码操作
$(document).on('click', '.get-code',function () {
  const obj = this
  if ($(obj).hasClass("disabled")) {
    return;
  } else {
    getCode(obj);
  }
})

// 获取验证码
function getCode(obj) {
	
  let tel = $("#mobile").val();
  if (!tel) {
    nfyg.otherCommon.promptShow("手机号码不能为空哦");
  } else if (!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(tel)) {
    nfyg.otherCommon.promptShow("请正确填写手机号码");
  } else {
	  console.log(urlConfig.send)
    _czc.push(['_trackEvent', '发送验证码', '点击', '发送验证码']);
    nfyg.otherCommon.getDatanormal("post", urlConfig.send, "json", {
      tel: tel
    }, true, function (res) {
		console.log(res);
      if (res.code == 1) {
        // 发送成功，倒计时
        nfyg.otherCommon.timeCountDown(obj);
      } else {
        nfyg.otherCommon.promptShow(res.msg);
      }
    });
  }
}

// 登录
function login() {
  let tel = $("#mobile").val();
  let code = $("#code").val();
  nfyg.otherCommon.getDatanormal("post", urlConfig.login, "json", {
    tel: tel,
    code: code,
    type: isApp ? 1 : 9
  }, true, function (res) {
	  console.log(res);
    if (res.code == 1) {
      // 处理登录成功代码
	  $.cookie('mobiles', res.data.userId, { expires: 7 });
	  $(".pop-com,.blackbg").hide();
	  // window.location.href = "index.html?mobiles="+res.data.userId
	  Init(res.data.userId);
    } else {
      nfyg.otherCommon.promptShow(res.msg);
    }
  })
}
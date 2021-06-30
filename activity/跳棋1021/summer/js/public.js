!(function (doc, win) {
  var docEle = doc.documentElement, //获取html元素
    event = "onorientationchange" in window ? "orientationchange" : "resize", //判断是屏幕旋转还是resize;
    fn = function () {
      var width = docEle.clientWidth;
      if (width > 750) {
        docEle.style.fontSize = "100px";
      } else {
        width && (docEle.style.fontSize = 100 * (width / 750) + "px"); //设置html的fontSize，随着event的改变而改变。
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

var isPopupShowView = false
var isRules = $.fn.cookie('summer_rules_nfyg')
var userChance = 0
var usershare = 0

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
    headUrl = "../images/icon_head.png"
  }
  // nfyg.encrypt(mobile, function (data) {
  //   mobile = data
  // })
} else {
  user = $.fn.cookie("summer_userInfo_nfyg");
  if (user != null) {
    user = JSON.parse(user);
    mobile = user.mobile;
    nickName = user.nickName;
  }
}
var baseUrl = "http://activity.peanut8.com";
var cmsUrl = "https://cmsapi.wifi8.com";
// 分享数据
var shareData = {
  url: baseUrl + "/act/2019/summer/html/index.html",
  imgUrl: baseUrl + "/act/2019/summer/images/share.jpg",
  title: "全城3000份降温礼包免费派发啦～",
  text: "夏日大作战邀你来挑战"
};
// 后台接口
var urlConfig = {
  'index': baseUrl + '/whszn/index',
  'send': baseUrl + '/whszn/send',
  'login': baseUrl + '/whszn/login',
  'reporting': baseUrl + '/whszn/reporting',
  'ranking': baseUrl + '/whszn/ranking',
  'share': baseUrl + '/whszn/share'
}
$(function () {
  var u = navigator.userAgent
  var ua = u.toLowerCase()
  // share() 
  if (isRules == null) {
    $('.popup, .popup__rules').addClass('active')
    $('.guide').show()
    $.fn.cookie("summer_rules_nfyg", "summer_rules_nfyg", {
      expires: 7
    });
  }
  $('.btn-close, .popup__bg, .popup__wechat, .btn-cancel').on('click', function () {
    $('.popup, .popup__act').removeClass('active')
  })
  $('.btn-rules').on('click', function () {
    $('.popup, .popup__rules').addClass('active')
    _czc.push(['_trackEvent', '活动规则', '点击', '查看活动规则']);
  })
  $('.btn-ranking').on('click', function () {
    if (isApp) {
      nfyg.encrypt(mobile, function (data) {
        mobile = data
        ranking()
      })
    } else {
      ranking()
    }
    $('.popup, .popup__ranking').addClass('active')
  })
  var len = nfyg.otherCommon.getRandomNumber(5, 12, 1)
  var bubbleHtml = ''
  for (let i = 0; i <= len; i++) {
    var opt = {
      width: ((i % 3 == 0) ? 0.28 : (i % 2 == 0) ? 0.2 : 0.18) + "rem",
      top: nfyg.otherCommon.getRandomNumber(1, 10, 1) + "rem",
      left: nfyg.otherCommon.getRandomNumber(1, 7, 1) + "rem",
    }
    bubbleHtml += '<div class="bubble" style="width: ' + opt.width + ';height: ' + opt.width + ';top: ' + opt.top + ';left: ' + opt.left + ';"><div class="bubble-shine"></div></div>'
  }

  $('.foot-bubble').html(bubbleHtml)
})

function ranking() {
  nfyg.otherCommon.getDatanormal("post", urlConfig.ranking, "json", {
    page: 1,
    tel: mobile
  }, true, function (res) {
    var rankingHtml = ''
    rankingHtml += '<li>\
                      <div style="width: 0.56rem;text-align: center;">排名</div>\
                      <div class="name">昵称</div>\
                      <div class="score">得分</div>\
                      <div class="prize">奖品</div>\
                    </li>'
    if (res.info != null && res.info.length != 0) {
      var classNum = res.info.ranking > 100 ? 'long' : ''
      rankingHtml += '<li class="isme">\
                        <div class="num ' + classNum + '">' + res.info.ranking + '</div>\
                        <div class="name">' + res.info.nickName + '</div>\
                        <div class="score">' + res.info.score + '</div>\
                        <div class="prize">' + res.info.prizeName + '</div>\
                      </li>'
    }
    res.list.forEach((item, i) => {
      var classNum = i > 100 ? 'long' : ''
      rankingHtml += '<li>\
                        <div class="num ' + classNum + '">' + (i + 1) + '</div>\
                        <div class="name">' + item.nickName + '</div>\
                        <div class="score">' + item.score + '</div>\
                        <div class="prize">' + item.prizeName + '</div>\
                      </li>'
    });
    $('#ranking-list').html(rankingHtml)
  })
}

function openNfygApp() {
  if (nfyg.browser.weixin) {
    $('.popup, .popup__wechat').addClass('active')
    // window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb&ckey=CK1360001376091"
  } else {
    window.location.href = "nfyg://detail?url=" + shareData.url
    setTimeout(() => {
      window.location.href = "http://wifi8.com/"
    }, 3000);
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
            success: function () {
              share()
            },
            cancel: function (res) {}
          });
          //分享给朋友
          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: text,
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
              share()
            },
            cancel: function () {}
          });
        });
      }
    },
    error: function () {}
  });
}
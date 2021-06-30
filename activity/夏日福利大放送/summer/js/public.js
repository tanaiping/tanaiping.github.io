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
} else {
  var userId_tel = $.fn.cookie("userId_tel");
  if (userId_tel != null) {
    mobile = userId_tel
  }
}
var _baseUrl = "http://activity.peanut8.com";
var keyParams = 'hdspring2' //hcode = hdspring2 
var apiurl = {
  "init": _baseUrl + "/operateact/index",
  "luckDraw": _baseUrl + "/operateact/luckDraw",
  "lists": _baseUrl + "/operateact/lists",
  "receivePrize": _baseUrl + "/operateact/receivePrize",
  "getUserCoupon": _baseUrl + "/operateact/getUserCoupon",
  "receiveGold": _baseUrl + "/operateact/receiveGold",
  "share": _baseUrl + "/operateact/share",
  "send": _baseUrl + "/operateact/send",
  "login": _baseUrl + "/operateact/login",
  "detail": _baseUrl + "/operateact/detail"
};
var shareData = {
  "url": _baseUrl + "/act/2020/summer/html/index.html",
  "imgUrl": _baseUrl + "/act/2020/summer/images/share.png?",
  "title": "花生地铁城市微光版夏日福利大放送",
  "text": "花生地铁城市微光版夏日福利大放送"
};
// 配置奖品
var prizeArr = ["肯德鸡早餐", "星巴克中杯", "中拿铁+红豆派/葡挞", "冰拿铁+原味花筒", "喜茶-30元代金券", "再接再厉"]
// 活动规则
var rulesText = "<p>1、福利活动期间，每位用户1次免费抽奖机会，每日首次分享，免费机会+1。2次免费机会用完后， 5金币/次，抽奖机会最多不超过10次</p>\
                  <p>2、金币可通过每日签到、分享资讯获得</p>\
                  <p>3、电子优惠券请在【我的奖品】中查看使用</p>\
                  <p>4、红包可在APP“我的”--“钱包”查看明细</p>\
                  <p>5、抽中实物奖品后请在5个工作日之内联系花生地铁客服，确认中奖信息。一经确认，我们将会在活动结束后的7个工作日内寄出，逾期视为主动放弃；部分奖品使用快递到付，拒收视为放弃奖品</p>\
                  <p>6、中奖结果以活动界面【我的奖品】信息为准</p>\
                  <p>7、花生地铁拥有法律所允许范围内的最终解释权</p>"
// 配置图片
var config_img = {
  bg: "../images/summer_bg2.jpg",
  foot_bg: "../images/foot_bg_1.png",
  box_bg: "",//../images/box_bg_20190711.png
  box_prize: "../images/box_prize_20210402.png",
  btn_start: "../images/btn_start.png",
  icon_grass: "../images/icon_grass_1.png",
  icon_num: "../images/icon_num_1.png",
  num_color: "#5B6AE4",
  tips_color: "#F98183",
  tips_bg_color: "rgba(255, 216, 221, 0.5)",
  head_rules: "linear-gradient(-180deg, #ffc840 0%, #fd971e 100%)",
  head_prize: "linear-gradient(-180deg, #51EACC 0%, #00E1B7 100%)",
  title_detail: "../images/detail_title_1.png",
  title_foot: "../images/foot_title_1.png",
  title_prize: "../images/prize_title_20190711.png",
  title_rules: "../images/rules_title_20190711.png",
  bg_color: "#FDE4C0",
  rules_ill: "../images/rules_illustrate_20190711.png"
}
var myDate = new Date();
var tYear = myDate.getFullYear();
var tMonth = myDate.getMonth();
var m = tMonth + 1;
var n = m == 12 ? 1 : m + 1
var y1 = tYear
var y2 = m == 12 ? tYear + 1 : tYear
if (m.toString().length == 1) {
  m = "0" + m;
}
if (n.toString().length == 1) {
  n = "0" + n;
}
// 设置页面图片和文字内容
$(function () {
  // $('.head .tips').html('活动时间：' + y1 + '-' + m + '-01 00:00 至 ' + y2 + '-' + n + '-01 00:00').css('color', '#0C9B84').css('background', 'transparent')
  $('.illustrate .text').html('是花生地铁4月份推出的福利活动，活动为期一周，每天奖品更新，敬请关注哦。')
  $('.container').css('background', '#FDE4C0 url(' + config_img.bg + ') no-repeat top center / 100%')
  // $('.head .btn_rules').css('background-image', config_img.head_rules)
  // $('.head .btn_prize').css('background-image', config_img.head_prize)
  $('.main').css('background', 'url(' + config_img.box_bg + ') no-repeat center / contain')
  $('.main .box .box-prize').attr('src', config_img.box_prize)
  $('.main .box .inner').css('background', 'url(' + config_img.btn_start + ') no-repeat center / contain')
  $('.main .grass').css('background', 'url(' + config_img.icon_grass + ') no-repeat center / contain')
  $('.main .num').css('background', 'url(' + config_img.icon_num + ') no-repeat center / contain').css('color', config_img.num_color)
  // $('.foot').css('background', 'url(' + config_img.foot_bg + ') no-repeat center / contain')
  $('.foot .title').attr('src', config_img.title_foot)
  $('.my-prize, .my-rules').css('background', config_img.bg_color)
  $('.prize-title').css('background', 'url(' + config_img.title_prize + ') no-repeat center / auto 100%')
  $('.rules-title').css('background', 'url(' + config_img.title_rules + ') no-repeat center / auto 100%')
  $('.illustrate').css('background', 'url(' + config_img.rules_ill + ') no-repeat center /contain')
  $('.prize-note .title').attr('src', config_img.title_detail)
})

function openNfygApp() {
  if (!isApp) {
    // window.location.href = "nfyg://detail?url=" + shareData.url
    if (nfyg.browser.weixin || nfyg.browser.qq || nfyg.browser.ding || nfyg.browser.alipay || nfyg.browser.weibo) {
      $(".popup, .open-1").show();
      $('.btn-close').hide()
      // window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb&ckey=CK1360001376091"
    } else {
	  window.location.href = "nfyg://detail?url=" + shareData.url
	  setTimeout(() => {
	    // 下载落地页
	    window.location.href = "http://web.peanut8.com/download"
	  }, 4000);
    }
  }
  
}
/*app右上角分享调用方法定义*/
function reShare() {
  return {
    "title": shareData.title,
    "url": shareData.url,
    "imgUrl": shareData.imgUrl,
    "text": shareData.text
  }
};
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
          debug: false,
          appId: data.data.sharePackage.appId,
          timestamp: data.data.sharePackage.timestamp,
          nonceStr: data.data.sharePackage.nonceStr,
          signature: data.data.sharePackage.signature,
          jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage"]
        });
        wx.ready(function () {
          wx.onMenuShareTimeline({
            title: title,
            desc: text,
            link: url,
            imgUrl: imgUrl,
            success: function () {},
            cancel: function (res) {}
          });
          wx.onMenuShareAppMessage({
            title: title,
            desc: text,
            link: url,
            imgUrl: imgUrl,
            success: function () {},
            cancel: function () {}
          })
        })
      }
    },
    error: function () {}
  })
};
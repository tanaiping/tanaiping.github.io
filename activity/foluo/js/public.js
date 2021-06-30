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
}else{
    mobile = localStorage.getItem("nfyg_mobile");
}

 //  提示信息
function promptShow(msg) {
$('#prompt').children('em').html(msg);
$('#prompt').show();
window.setTimeout(function () {
  $('#prompt').hide();
}, 2500);
}


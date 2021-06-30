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



$(function(){
   //微信分享
    var url = 'http://activity.peanut8.com/act/2019/shareTour/index.html';
    var imgUrl = 'http://activity.peanut8.com/act/2019/shareTour/images/share.jpg';
    var title = '布衣生态共享旅游';
    var desc = '布衣生态共享旅游';
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
              imgUrl: imgUrl, // 分享图标
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
              imgUrl: imgUrl, // 分享图标
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


    $(".submit-btn").click(function(){
        var phone =$(".phone").val();
        var name = $(".name").val();
        var reg = /^.{1,20}$/;
        if(name.trim()==""||phone.trim()==""){
        console.log(phone+"==="+name);
          promptShow("您还有未填写的信息");
        }else{
          if(!reg.test(name)){
            promptShow("姓名必须为1-20的字符");
            return false;
          }
          if(!isMobile(phone)){
            promptShow("请输入正确的电话号码");
            return false;
          }
          $.ajax({
              type: "post",
              url: "http://activity.peanut8.com/index.php/HsAct/hsySave",
              data:{"tel":phone,"name":name},
              dataType: 'json',
              success: function(data) {
                  console.log(data);
                  if(data.code==1){
                      promptShow(data.msg);
                      setTimeout(function(){window.location.href="http://activity.peanut8.com/act/2019/shareTour/index.html"},3000);
                  }else{
                    promptShow(data.msg);
                  }
              }
            });
        }
    })

  
})

 //  提示信息
function promptShow(msg) {
    $('#prompt').children('em').html(msg);
    $('#prompt').show();
    window.setTimeout(function () {
      $('#prompt').hide();
    }, 2500);
}

function isMobile(string) {
  var reg = /^0?(13[0-9]|15[0123456789]|18[012356789]|14[57]|17[0-9])[0-9]{8}$/;
  return reg.test(string);
}



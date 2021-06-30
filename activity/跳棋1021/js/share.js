$(function () {
  console.log('share.js');
  var shareData = {
    "link":"http://activity.peanut8.com/act/2019/dice/invitation.html",
    "imgUrl":"http://activity.peanut8.com/act/2019/dice/images/share.jpg",
    "title": "连地铁WiFi赢张信哲演唱会门票！",
    "desc": "花生地铁WiFi  上班族都在使用"
  }
  var url = window.location.href;
  $.ajax({
    type: "get",
    url: 'http://activity.peanut8.com/WxShare/anxious',
    data: {
      url: url
    },
    dataType: 'json',
    success: function (data) {
      if (data.code == 1) {
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
        wx.ready(function () {
          //分享到朋友圈
          wx.onMenuShareTimeline({
            title: shareData.title, // 分享标题
            desc: shareData.desc,
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareData.imgUrl, // 分享图标
            success: function () {

            },
            cancel: function (res) {

            }
          });

          //分享给朋友
          wx.onMenuShareAppMessage({
            title: shareData.title, // 分享标题
            desc: shareData.desc, // 分享描述
            link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareData.imgUrl, // 分享图标
            success: function () {

            },
            cancel: function () {

            }
          });
        });
      }
    },
    error: function () {}
  });
})
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
    var url = 'http://activity.peanut8.com/act/2019/guess/index.html';
    var imgUrl = 'http://activity.peanut8.com/act/2019/guess/images/share.jpg';
    var title = '猜运动员赢钻石联赛上海站门票';
    var desc = '参加即有机会获得赛事门票，购票更有机会赢取选手签名海报';
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


    $(".sport-name").click(function(){
            var index = $(".sport-name").index(this);
            if(index==1){
                $(".img02").attr("src","images/img02_s.png").addClass("right");
            }
            if(index==2){
                $(".img03").attr("src","images/img03_s.png").addClass("right");
            }
            if(index==3){
                $(".img01").attr("src","images/img01_s.png").addClass("right");
            }
            $(this).addClass("check");

            var num=0;
            $(".sport-img").each(function(){
                if($(this).hasClass("right")){
                    num++
                }
            })
            if(num==3){
                //答对了...
                $(".black-bg,.pop-box").show();
            }
            console.log(num);
    });

    $(".close-pop").click(function(){
        $(".form-list input").val("");
        $(".black-bg,.pop-box").hide();

    });

    $(".fomt-submit").click(function(){
        var tel =$(".tel input").val();
        var code = $(".yzm-li input").val();
        $.ajax({
            type: "post",
            url: "http://activity.peanut8.com/index.php/api/login",
            data:{"tel":tel,"code":code},
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if(data.code==1){
                    promptShow("提交成功，免费赛事门票等着你！");
                    setTimeout(function(){window.location.href="http://activity.peanut8.com/act/2019/guess/index.html"},2500)
                }else{
                  promptShow(data.msg);
                }
            }
          });
    })


    //验证码
    var interval;
    var num =60;
    function times(){
    if(num>0){
        num--;
        $(".yzm-li span").text(num+"s");
    }else{
        clearInterval(interval);
        $(".yzm-li span").removeClass('disabled').text("发送验证码");
    }
    }
    $(".yzm-li span").click(function(){
      var tel = $(".tel input").val();
      var $this = $(this);
      console.log(tel);
        if(!$(this).hasClass('disabled')){
          $.ajax({
            type: "post",
            url: "http://activity.peanut8.com/index.php/api/send",
            data:{"tel":tel},
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if(data.code==1){
                  num=60;
                  $this.addClass('disabled').text(60+"s");
                  interval = setInterval(times,1000);
                }else{
                  promptShow(data.msg);
                }
            }
          });
        }
    });
    //解决安卓软键盘兼容问题
    $(".form-list input").bind("focus",function(){
        $(".pop-box").removeClass("blur").addClass("focus")
    });
    $(".form-list input").bind("blur",function(){
        //加延迟 是解决blur 和click冲突
       setTimeout(function(){$(".pop-box").removeClass("focus").addClass("blur")},100); 
    });
  
})

 //  提示信息
function promptShow(msg) {
    $('#prompt').children('em').html(msg);
    $('#prompt').show();
    window.setTimeout(function () {
      $('#prompt').hide();
    }, 2500);
}


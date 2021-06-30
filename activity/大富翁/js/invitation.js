// var _url = 'http://192.168.201.170/'
var _url = 'http://cmsapi.wifi8.com/'
var _URL = 'http://activity.peanut8.com/operateact/';
//  后台接口
var _UrlConfig = {
  'getVerifyCode': _url + 'uSystem/V5/user/getVerifyCode',
  'awakenUser': _url + 'uSystem/v1/awakenUser',
  'send': _URL + 'send',
  'checkCode': _URL + 'checkCode'
};

var invite_userId = GetQueryString('userId');
if (invite_userId == null) {
  promptShow('路径参数错误，请确认后重试')
}
//调用插件，获取图形验证码，并生成图片
// var verifyCode = new GVerify({
//   id: "v_container",
//   canvasId: "verifyCanvas",
//   width: "",
//   height: "",
//   type: "",
//   code: ""
// });
//密码输入限制
var reg = /[0-9a-zA-Z\u0000-\u00FF]{6,16}/;
var re = /^1\d{10}$/;
$(function () {
  $('.mask-bg').on('click', function () {
    $('.mask').hide()
  })
  // 获取验证码
  $("#get-code").on("click", function () {
    if ($(this).hasClass("disabled")) {
      return;
    } else {
      getCode();
    }
  });
  //刷新验证码
  // $('#refresh').on('click', function () {
  //   verifyCode.refresh();
  //   $('#code_input').val('')
  // })
  //验证图形验证码
  $('#submit_picCode').on('click', function () {
    submitCode()
  });
  // 注册
  $('.btn-register').on('click', function () {
    registerFun()
  });
})

function getCode() {
  var tel = $.trim($("#tel").val());
  if (!tel) {
    promptShow("手机号码不能为空哦！");
  } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel)) {
    promptShow("请正确填写手机号码！");
  } else {
    getData("post", _UrlConfig.send, 'json', {
      'tel': tel,
      'type': 1
    }, true, false, function (res) {
      console.log(res);
      switch (res.code) {
        case 1:
          //启动倒计时
          timeCountDown();
          break;
        default:
          promptShow(res.msg);
          break;
      }
    })
  }
}

// 注册
function registerFun() {
  var tel = $.trim($('#tel').val());
  var verify_code = $.trim($('#verify_code').val());
  if (tel == '' || verify_code == '') {
    promptShow('手机号码与验证码不能为空');
  } else if (!re.test(tel)) {
    promptShow('请输入正确的手机号');
  } else {
    getData("post", _UrlConfig.checkCode, 'json', {
      'tel': tel,
      'code': verify_code
    }, true, false, function (res) {
      console.log(res);
      switch (res.code) {
        case 1:
          var regsiter_param = {
            "userId": invite_userId,
            "mobile": tel
          };
          getData('POST', _UrlConfig.awakenUser, 'json', JSON.stringify(regsiter_param), true, false, function (res) {
            console.log(res);
            if (res.resultCode == 0) {
              promptShow('领取成功，现在前往 花生地铁APP ');
              setTimeout(() => {
                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb&ckey=CK1360001376091'
              }, 2800);
            } else {
              promptShow(res.resultMsg);
              if(res.resultCode == 52){
                setTimeout(() => {
                  window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb&ckey=CK1360001376091'
                }, 2800);
              }
            }
          });
          break;
        default:
          promptShow(res.msg);
          break;
      }
    })
  }
}

// 获取数据
function getData(type, apiUrl, datatype, data, async, iserr, callbackFun) {
  $.ajax({
    type: type,
    url: apiUrl,
    dataType: datatype,
    data: data,
    async: async,
    success: function (res) {
      callbackFun(res);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      //弹出错误信息
      if (iserr) {
        // $('body').append(temp_err);	
      }
    }

  });
}
//验证码倒计时
var wait = 60;

function timeCountDown() {
  if (wait == 0) {
    $(".get-code").removeClass("disabled");
    $(".get-code").html("获取验证码");
    wait = 60;
  } else {
    $(".get-code").addClass("disabled");
    $(".get-code").html(wait + " s");
    wait--;
    setTimeout(function () {
      timeCountDown()
    }, 1000)
  }
}
//  提示信息
function promptShow(msg) {
  $('#prompt').children('em').html(msg);
  $('#prompt').show();
  window.setTimeout(function () {
    $('#prompt').hide();
  }, 2500);
}
/*获取参数*/
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    // console.log(r);
    return decodeURI(r[2]);
  }
  return null;
}
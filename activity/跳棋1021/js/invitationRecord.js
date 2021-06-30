// var _url = 'http://192.168.201.170/'
var _url = 'https://cmsapi.wifi8.com/'
var _URL = 'http://activity.peanut8.com/act/zillionaire/';
var url = _url + 'uSystem/v1/getAwakenUsers'
var shareData = {
  "url": _URL + "invitation.html",
  "imageUrl": _URL + "images/share.png",
  "title": "Hi，我想领花生地铁WiFi岁末豪礼，请帮我一把哦~",
  "text": "免费领香港迪士尼、云南6天5夜旅游券等，你也有机会哦~"
}
var nfyg = new NFYG();
var isApp = nfyg.browser.isNfyg;
var tel, nickName, headUrl, point, userId;
$(function () {
  if (isApp) {
    nfyg.getNewUserInfo(function (userInfo) {
      userInfo = JSON.parse(userInfo);
      // console.log(userInfo);
      tel = userInfo.mobile;
      nickName = userInfo.nickName;
      headUrl = userInfo.headUrl;
      point = userInfo.point;
      userId = userInfo.userId;
      if (userId == '' || userId == undefined || userId == null) {
        nfyg.pushToLoginView()
      }
      nfyg.encrypt(userId, function (data) {
        initRecord(data)
      })
    });
  } else {
    promptShow('请前往 花生地铁WIFI APP查看邀请数据！')
  }

  $('.list-td').on('click', '.btn-share', function () {
    var obj = $(this)
    var type = parseInt(obj.attr('data-type'))
    if (obj.hasClass('share-status-2')) {
      return
    }
    shareInvitation(type)
  })
  $('.btn-invitation').on('click', function () {
    shareInvitation(5)
  })
})

// 初始化
function initRecord(userId) {
  getDataspecial("post", url, "json", {
    "userId": userId
  }, true, function (res) {
    console.log(res);
    switch (res.resultCode) {
      case 0:
        var list = res.data;
        var length = list.awaKenRecords.length
        $('#info-dayCount').html(list.dayCount)
        $('#info-sumCount').html(list.sumCount)
        $('#info-dayRank').html(list.dayRank)
        $('#info-sumRank').html(list.sumRank)
        var html = "";
        if (length == 0) {
          html += '<p class="no-list">据说分享之后会变帅哦~</p>'
        } else {
          $.each(list.awaKenRecords, function (i, item) {
            html += '<li>';
            html += '<div class="name">';
            if(item.name==undefined||item.name=="") item.name="花生用户";
            html += '<p class="nikename" id="list-name">' + item.name + '</p>';
            html += '<p class="time" id="list-createTime">' + item.createTime + '</p>';
            html += '</div>';
            html += '<div class="tel" id="list-mobile">' + item.mobile + '</div>';
            html += '<div class="btn-share share-status-' + item.status + '" data-type="' + item.status + '"></div>';
            html += '</li>';
          });
        }
        $(".list-td").append(html);
        break;
      default:
        promptShow(res.resultMsg)
        break;
    }
  })
}

// 分享链接
function shareInvitation(type) {
  if (isApp) {
    nfyg.encrypt(userId, function (data) {
      var shareUrl = shareData.url + "?userId=" + data + "&shareType=" + type
      nfyg.openSharePanel(shareUrl, shareData.imageUrl, shareData.title, shareData.text)
    })
  } else {
    promptShow('请前往 花生地铁WIFI APP分享给好友哦！')
  }
}

//  获取数据
function getDataspecial(type, url, datatype, data, async, callback) {
  $.ajax({
    type: type,
    url: url,
    dataType: datatype,
    data: data,
    async: async,
    timeout: 5000,
    contentType: "application/x-www-form-urlencoded",
    success: function (res) {
      callback(res);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      promptShow(
        "<strong>抱歉，网络繁忙请稍后</strong><br/>或尝试切换网络试试"
      );
    }
  });
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
//  提示信息
function promptShow(msg) {
  $('#prompt').children('em').html(msg);
  $('#prompt').show();
  window.setTimeout(function () {
    $('#prompt').hide();
  }, 2500);
}
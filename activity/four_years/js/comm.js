// 关闭弹窗
var basePath = "http://activity.peanut8.com/";
function closeAlert(obj) {
  $(obj).parent(".pop").hide();
  $("#mask").hide();
}
// 展示弹窗
function showAlert(obj) {
  $(obj).show().siblings(".pop").hide();
  $("#mask").show();
}

if(localStorage.getItem("userId")==null){
  showAlert("#nologin");
}

// 转盘效果
var luck = {
  index: -1, //当前转动到哪个位置，起点位置
  count: 0, //总共有多少个位置
  timer: 0, //setTimeout的ID，用clearTimeout清除
  speed: 40, //初始转动速度
  times: 0, //转动次数
  cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
  prize: -1, //中奖位置
  prizeIndex: -1,
  init: function (id) {
    if ($("#" + id).find(".luck-unit").length > 0) {
      $luck = $("#" + id);
      $units = $luck.find(".luck-unit");
      this.obj = $luck;
      this.count = $units.length;
      $luck.find(".luck-unit-" + this.index).addClass("active");
    }
  },
  roll: function () {
    var index = this.index;
    var count = this.count;
    var luck = this.obj;
    $(luck)
      .find(".luck-unit-" + index)
      .removeClass("active");
    index += 1;
    if (index > count - 1) {
      index = 0;
    }
    $(luck)
      .find(".luck-unit-" + index)
      .addClass("active");
    this.index = index;
    return false;
  },
  stop: function (index) {
    this.prize = index;
    return false;
  }
};

function roll(prizeId, number, prizeImg, type) {
  luck.times += 1;
  luck.roll();
  if (luck.times > luck.cycle + 10 && luck.prize == luck.index) {
    clearTimeout(luck.timer);
    if (type == 0) {
      /*在app内的*/
      if (number == 0) {
        /*没机会*/
        if (prizeId == 7) {
          /*没抽中没机会*/
          // showAlert("#noAndno");
          $("#prizeBox2").html('<img src="' + prizeImg + '">');
          showAlert("#drawAndNo");
        } else {
          /*抽中了没机会*/
          $("#prizeBox2").html('<img src="' + prizeImg + '">');
          showAlert("#drawAndNo");
        }
      } else {
        /*有机会*/
        if (prizeId == 7) {
          /*没抽中有机会*/
          //showAlert("#noAndHave");
          $("#prizeBox2").html('<img src="' + prizeImg + '">');
          showAlert("#drawAndNo");
        } else {
          /*抽中了有机会*/
          console.log("prizeImg2:" + prizeImg);
          $("#prizeBox1").html('<img src="' + prizeImg + '">');
          showAlert("#drawAndHave");
        }
      }
    } else if (type == 2) {
      /*app外假数据*/
      showAlert("#drawAndHave");
    } else {
      /*app外*/
      if (prizeId == 7) {
        /*没抽中*/
        showAlert("#drawNone");
      } else {
        $("#prizeBox1").html('<img src="' + prizeImg + '">');
        showAlert("#drawAndHave");
      }
    }
    luck.prize = -1;
    luck.times = 0;
    click = false;
  } else {
    if (luck.times < luck.cycle) {
      luck.speed -= 10;
    } else if (luck.times == luck.cycle) {
      luck.prize = luck.prizeIndex;
    } else {
      if (luck.times > luck.cycle + 10) {
        luck.speed += 110;
      } else {
        luck.speed += 20;
      }
    }
    if (luck.speed < 40) {
      luck.speed = 40;
    }
    luck.timer = window.setTimeout(
      "roll(" + prizeId + "," + number + ",'" + prizeImg + "'," + type + ")",
      luck.speed
    );
  }
  return false;
}
// 获取初始数据
function getInitDataBack() {
  $.ajax({
    type:"post",
    url:basePath+"nfyg/index",
    data:"",
    dataType: "json",
    success: function(res){
       console.log(res);
       if(res.code==1){
          var prizeList = res.prizeList;
          prizeList.forEach(function (value, index, array) {
            $(".luck-unit-" + index).html('<img src="' + value + '">');
          });
       }
        
    },
   error:function(e){
       console.log(e);
   }
  })
 
}

//验证码
var interval;
var num =10;
function times(){
if(num>0){
    num--;
    $(".get-code").text(num+"s");
}else{
    clearInterval(interval);
    $(".get-code").removeClass('disabled').text("发送验证码");
}
}
$(".get-code").click(function(){
  var tel = $(".mobile").val();
  var $this = $(this);
    if(!$(this).hasClass('disabled')){
      $.ajax({
            type: "post",
            url: basePath+'nfyg/send',
            data:{"tel":tel},
            dataType: 'json',
            success: function(data) {
                if(data.code==1){
                  num=10;
                  $this.addClass('disabled').text(10+"s");
                  interval = setInterval(times,1000);
                }else{
                  promptShow(data.msg);
                }
            }
          });
    }
})

function telVerify() {
  var tel =$("#mobile").val();
  var code = $("#code").val();
  $.ajax({
    type:"post",
    url:basePath+"nfyg/userInfo",
    data:{"tel":tel,"code":code},
    dataType: "json",
    success: function(res){
        console.log(res);
        if (res.code == 1) {
          $("body,html").scrollTop(10);
          localStorage.setItem("userId",res.userId);
          luckDrawBack();
        } else{
          promptShow(res.msg);
        }
    },
   error:function(e){
       console.log(e);
   }
  })
  
}



/*抽奖回调*/
function luckDrawBack() {
  var userId = localStorage.getItem("userId");
  $.ajax({
    type:"post",
    url:basePath+"nfyg/luckDraw",
    data:{"userId":userId},
    dataType: "json",
    success: function(res){
        console.log(res);
        if (res.code == 1) {
          // $("#chance").html(1);
          luck.init("luck");
          luck.prizeIndex = res.prizeId - 1;
          if (click) {
            return false;
          } else {
            luck.speed = 100;
            roll(res.prizeId, 0, res.prizeImg, 0);
            click = true;
            // $("#chance").html(0);
            return false;
          }
        }else if(res.code==-3){
          showAlert("#nologin");
        }else if(res.code==-4){
          showAlert("#noChance");
        }else{
          promptShow(res.msg);
        }
    },
   error:function(e){
       console.log(e);
   }
  })
  
}
/*奖品列表返回*/
function prizeListBack(res) {
  var userId = localStorage.getItem("userId");
    $.ajax({
      type:"post",
      url:basePath+"nfyg/lists",
      data:{"userId":userId},
      dataType: "json",
      success: function(res){
          console.log(res);
          var prizeList = res.myPrizeList;
          if (res.code == 1) {
            if (prizeList.length > 0) {
              prizeList.forEach(function (value, index, array) {
                $("#list").append(
                    '<li>\
                        <img src="' + value.prizeImg + '" alt="">\<div class="box_txt">\<h2 class="title2">' + value.prizeName + '</h2>\
                        <span>抽奖：'+value.addTime +'</span>\
                        </div>\
                      </li>'
                  );
              });
            } else {
              $("#prizeList").html('<p class="no-prize">你还没有奖品!</p>');
            }
          }
      },
     error:function(e){
         console.log(e);
     }
    })
  
}

/*再来一次抽奖*/
function drawLuckAgina() {
  $("#mask,.pop").hide();
  /*隐藏弹窗再来一次抽奖*/
  luckDrawBack();
}
/*加载完成的公共执行方法*/
$(function () {
  $(".close")
    .off("click")
    .on("click", function () {
      closeAlert(this);
    });
  $(".btn, .btn-share").on("click", function () {
    closeAlert(this);
  });
  $(".btn-download").on("click", function () {
    window.location.href =
      "http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb";
  });
});
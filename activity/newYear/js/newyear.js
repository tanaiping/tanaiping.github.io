$(function(){
        var timeout_pop="";  //用于弹窗5秒延迟的变量
        var loseList = [
        '改革春风吹满地，<br/>新的一年要争气！',
        '新的一年了，<br/>除了暴富也可以抱抱我喔',
        '雪花变成爆米花<br/>有人赚钱给我花',
        '想和你<br/>和岁岁年年常相见',
        '生活明朗<br/>新的一年要争气！',
        '前路浩浩荡荡，<br/>万事尽可期待',
        '三餐四季，<br/>温柔有趣！'
        ]

        var shareId = GetQueryString("shareId");

        initIndex();


        //走马灯
        $('.marquee-box').liMarquee();

        //规则跳转
        $(".rules-btn").click(function(){
          window.location.href="rule.html"
        })

        //我的奖品
        $(".my-award").click(function(){
          window.location.href="myAward.html"
        })

        //点击关闭 关闭弹窗
        $(".close-pop,.red-name,.black-bg").click(function(){
          clearTimeout(timeout_pop);
          $(".popwrap,.black-bg").hide();
        });

        //提现
        
        $(".cashout-btn").click(function(){
          if(parseFloat($("#money").text())>=10){
            window.location.href="cashout.html"
          }else{
            promptShow("累计到10元即可提现哦！")
          }
        });

        //邀请好友助力
        $(".invited-index").click(function(){
          //机会用完
          $(".pop-useup,.black-bg").show();
          setTimeout(function(){
            $(".popwrap,.black-bg").hide(); 
            window.location.href="index.html";
          },5000)

        });

        //帮好友助力
        $(".invited-btn-pop").click(function(){
            if(!isApp){
              nfyg.encrypt(mobile, function (data) {
                mobile = data
              })
              var params = {
                "tel":'/2qHNmLoLJ3HEyteV+zcow==',
                "shareId":shareId,   
              }
              console.log(params);
              $.ajax({
                    type: "post",
                    url: basePath+'/20/godspeed/help',
                    dataType: 'json',
                    data:JSON.stringify(params),
                    beforeSend: function (xhr) {
                    },
                    success: function(data) {
                      console.log(data);
                      if(data.code==1){
                         promptShow("帮好友助力成功~");
                         setTimeout(function(){window.location.href="index.html"},1000);
                      }else{
                        promptShow(data.msg);
                      }
                    },
                    fail: function() {
                      //layer.msg("网络异常，请稍后再试！", {icon: 5});
                    }
                });
              }
        })

        //翻牌
        $(".click-me").click(function(){
          if(!isApp){
            nfyg.encrypt(mobile, function (data) {
              mobile = data
            })
            var params = {
              "tel":'/2qHNmLoLJ3HEyteV+zcow==',
              "nickName":nickName,   
              "headUrl":headUrl,
            }
            console.log(params);
            $.ajax({
                  type: "post",
                  url: basePath+'/20/godspeed/luckDraw',
                  dataType: 'json',
                  data:JSON.stringify(params),
                  beforeSend: function (xhr) {
                  },
                  success: function(data) {
                    console.log(data);
                    if(data.code==-1){
                      promptShow("您先登录！");
                    }else if(data.code==1){
                      if(data.isPrize == 0){
                         //显示没中奖方案弹窗
                         var rmd = parseInt(Math.random()*5);
                        $(".lose-t1").html(loseList[rmd])
                        $(".pop-lose,.black-bg").show();  
                      }else{
                        if(data.prizeImg!=""&&data.prizeImg!=undefined){//有图就是实物
                          $(".pop-goods,.black-bg").show();
                          $("#goods_img").attr("src",data.prizeImg);
                        }else{
                          $(".pop-redPackage,.black-bg").show();
                          $("#red_package").text(data.money);
                        }
                      }
                    }else if(data.code==-2){
                      $(".pop-useup,.black-bg").show();
                    }else if(data.code==-3){
                      promptShow("系统错误");
                    }
                    setTimeout(function(){
                    $(".popwrap,.black-bg").hide(); 
                  },5000)
                  },
                  fail: function() {
                    //layer.msg("网络异常，请稍后再试！", {icon: 5});
                  }
              });
            }



        })



        // var date1 = new Date()
        // var date2 = new Date('2020/02/07 23:59:59');
        // var SysSecond = (date2.getTime() - date1.getTime())/1000;
        //InterValObj = window.setInterval(SetRemainTime, 1000);
        var SysSecond = 0;
        //将时间减去1秒，计算天、时、分、秒
        function SetRemainTime() {
          if (SysSecond > 0) {
           SysSecond = SysSecond - 1;
           var second = Math.floor(SysSecond % 60);            // 计算秒     
           var minite = Math.floor((SysSecond / 60) % 60);      //计算分 
           var hour = Math.floor((SysSecond / 3600) % 24);      //计算小时
           var day = Math.floor((SysSecond / 3600) / 24);       //计算天 
         
           var hourDiv = "<span id='hourSpan'>"+ hour + "小时"+"</span>";
           var dayDiv = "<span id='daySpan'>"+ day + "天"+"</span>";
         
            $(".countdown").html(dayDiv + hourDiv + minite + "分" + second + "秒");
         
            if(hour === 0) {//当不足1小时时隐藏小时
                $('#hourSpan').css('display','none');
            }
          if(day === 0) {//当不足1天时隐藏天
                $('#daySpan').css('display','none');
            }
          } else {//剩余时间小于或等于0的时候，就停止间隔函数
           window.clearInterval(InterValObj);
           //这里可以添加倒计时时间为0后需要执行的事件
           $(".countdown").text("红包已失效");
          }
        }

        console.log(isApp);

        function initIndex(){
          if(!isApp){
            nfyg.encrypt(mobile, function (data) {
              mobile = data
            })
            shareId==undefined?shareId="":shareId
            var params = {
              "tel":mobile,
              "shareId":shareId,   //状态:1-上架;2-下架;3-删除;
            }
            console.log(params);
            $.ajax({
                  type: "post",
                  url: basePath+'/20/godspeed/index',
                  dataType: 'json',
                  data:JSON.stringify(params),
                  beforeSend: function (xhr) {
                  },
                  success: function(data) {
                    console.log(data);
                    SysSecond = data.timestamp;
                    InterValObj = window.setInterval(SetRemainTime, 1000);
                    $("#money").text(data.regEnvelope);
                    $("#changeNum").text(data.number);
                    if(data.helplist!= null&&data.helplist.length>0){
                      var html='';
                      for(var i =0;i<data.helplist.length;i++){
                      html += '<li><div class="invited-box"><div class="invited-info">'+
                        '<img src="'+data.helpList[i].headUrl+'" alt="" class="invited-tx">'+
                        '<div class="invited-t"><div class="name">'+data.helpList[i].nickName+'</div><div class="desc">大吉大利 零开工红包</div>'+
                        '</div></div><div class="invited-price">帮你获得<span>'+data.helpList[i].money+'</span></div>'+
                        '</div></li>'
                      }
                      $("#heplList").html(html);
                    }
                  },
                  fail: function() {
                    //layer.msg("网络异常，请稍后再试！", {icon: 5});
                  }
              });
            }
          }


        function GetQueryString(name) {
             var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
             var r = window.location.search.substr(1).match(reg);
             if(r!=null)return  unescape(r[2]); return null;
        }


        




        
    })
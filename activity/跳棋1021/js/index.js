$(function(){
      var awardsType=1;
      var redPacket=0;  //我的红包的初始值
     //页面加载初始化为 位置为1
    
    var speed=150 
    window.onload=function(){
    var demo=document.getElementById("demo"); 
    var demo2=document.getElementById("demo2"); 
    var demo1=document.getElementById("demo1"); 
    demo2.innerHTML=demo1.innerHTML 
    function Marquee(){ 
    if(demo.scrollTop>=demo1.offsetHeight){
    demo.scrollTop=0; 
    }
    else{ 
    demo.scrollTop=demo.scrollTop+1;
    } 
    } 
    var MyMar=setInterval(Marquee,speed) 
    demo.onmouseover=function(){clearInterval(MyMar)} 
    demo.onmouseout=function(){MyMar=setInterval(Marquee,speed)} 
    }

    var curDate="";
    var myDate = new Date();  
    var y = myDate.getFullYear(); //获取完整的年份(4位,1970-????)  
    var m = myDate.getMonth()+1; //获取当前月份(0-11,0代表1月)         // 所以获取当前月份是myDate.getMonth()+1;   
    var d = myDate.getDate(); //获取当前日(1-31) 
    curDate = y+"-"+m+"-"+d;
    if(curDate=="2019-10-28"){
      $(".big-awards-title").text("今日最大奖");
    }
    getStep();
    //获取用户步数
    function getStep(){
      //页面加载进来获取奖品列表以及已抽奖次数
      $.ajax({
          type: "post",
          url: basePath+'activity/index',
          data:{"userId":tel},  //15814777383
          dataType: 'json',
          success: function(data) {
            console.log(data);
            redPacket = data.sVal;
            if(data.number>=0&&data.number!=null){
              $(".change-num em").text(data.number);
            }else{
              $(".change-num em").text(0);
            }
            $(".big-awards-img img").attr("src",data.img);
            
            getCash(redPacket);
              for(var i=0;i<data.prizeList.length;i++){
                step=data.step;
                //if(data.prizeList[i].num>0){
                  $(".step-"+data.prizeList[i].step).attr("src",data.prizeList[i].prizeImg);
                //}
              }
               var c= step+1;
              if(step==0){$(".elem-"+c).addClass('anim-opacity2 db');}
              else{
                $(".elem-"+step).addClass('db');
              }
              if(data.winningList!==""){
                $("#demo1").html(data.winningList);
              }

          },
          complete:function(){
            setTimeout(function(){$(".page-loading").hide();},1500);
          }
        });
    }

    //获取红包 进度条
    function getCash(x){
      //调取接口中 获取用户的红包值
      var w = parseInt($(".progress").css("width"));
      var l = parseInt($(".progress em").css("left"));
      var em_w = w-l*2;
      var red = x/30;
      $(".progress em").animate({width: em_w*red+"px"}, 100,function(){
          if(x>=30){
            $(".cash-btn").addClass('act');
          }
      })
    }


    var imgurl="";
    //开始移动飞行棋
    function start_go(go_nums,endstep){
        $(".elem-1").removeClass('anim-opacity2');
        //如果开始掷骰子的时候已经是在20步 默认从起点重新开始
        //页面加载的时候通过接口返回用户所有位置step
        // if(step==20) step=0;
        var newNum =go_nums+step;
        if(newNum>20) newNum=newNum-20;
        //飞行棋动画
        var inter = setInterval(function(){
            step++;
            if(step>20){
                step=step-20;
            }
            $(".elem-img").removeClass('db');
            $(".elem-"+step).addClass('db');
            console.log(step);
            if(step==newNum){
                clearInterval(inter);
                setTimeout(function(){$(".lottery-btn").removeClass('disabled')},400);
            }
            // if(step==20){
            //     clearInterval(inter);
            //     step=1;
            // }
        },300);
        
        //跳完步数之后 根据所在位置显示相应的弹窗
        setTimeout(function(){
            switch(step)
            {
            case 2:case 6:case 10: case 13:case 15:case 16:case 19:case 20:
              getAwards(awardsType);
              break;
            case 3:
              var reduce_num =step-2;
              var reduce = setInterval(function(){
                    --step;
                    $(".elem-img").removeClass('db');
                    $(".elem-"+step).addClass('db');
                    if(step==reduce_num){
                        clearInterval(reduce);
                        setTimeout(function(){$(".lottery-btn").removeClass('disabled')},400);
                    }
                },300);
              break;
            case 9:
              var add_num =step+2;
              var add = setInterval(function(){
                    ++step;
                    $(".elem-img").removeClass('db');
                    $(".elem-"+step).addClass('db');
                    if(step==add_num){
                        clearInterval(add);
                        setTimeout(function(){$(".lottery-btn").removeClass('disabled')},400);
                    }
                },300);  
              break;
            case 18:
              var add_num =step+1;
              var add = setInterval(function(){
                    ++step;
                    $(".elem-img").removeClass('db');
                    $(".elem-"+step).addClass('db');
                    if(step==add_num){
                        clearInterval(add);
                        setTimeout(function(){$(".lottery-btn").removeClass('disabled')},400);
                    }
                },300);  
              break;
            case 12:case 7:
              getTask();
              break;
            case 14:
              var add_num =step-1;
              var add = setInterval(function(){
                    --step;
                    $(".elem-img").removeClass('db');
                    $(".elem-"+step).addClass('db');
                    if(step==add_num){
                        clearInterval(add);
                        setTimeout(function(){
                          $(".lottery-btn").removeClass('disabled');
                          getAwards(awardsType);
                      },400);
                    }
                },300);  
              break;
            default:
              console.log(step)
            }
        },go_nums*350);
    }

    //开始掷骰子
    $(".lottery-btn").click(function(){
        if(!$(this).hasClass('disabled')){
            $(this).addClass('disabled');
            $.ajax({
            type: "post",
            url: basePath+'activity/dice',
            data:{"userId":tel,"type":type},
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if(data.number>=0&&data.number!=null){
                  $(".change-num em").text(data.number);
                }else{
                  $(".change-num em").text(0);
                }
                if(data.code==1){
                  var dice = $("#dice");
                  var num = data.point;//生成随机数1-6  Math.floor(Math.random()*6+1)
                  dice.attr("class","dice");//清除上次动画后的点数
                  dice.css('cursor','default');
                  dice.animate({left: '+2px'}, 100,function(){
                      dice.addClass("dice_t");
                  }).delay(100).animate({top:'-2px'},100,function(){
                      dice.removeClass("dice_t").addClass("dice_s");
                  }).delay(100).animate({opacity: 'show'},600,function(){
                      dice.removeClass("dice_s").addClass("dice_e");
                  }).delay(100).animate({left:'-2px',top:'2px'},100,function(){
                      dice.removeClass("dice_e").addClass("dice_"+num);
                      dice.css('cursor','pointer');
                  });
                  imgurl = data.prizeImg;
                  setTimeout(function(){start_go(num,data.step)},1300);
                  hasAwards = data.isPrize;
                  awardsType=data.type;
                  if(awardsType==1){
                    $(".get-btn").attr("ids",data.id);
                    $(".redpacket-box img").attr("src",data.prizeImg);
                  }else{
                    $(".awards-img img").attr("src",data.prizeImg);
                  }
                  
                }else if(data.code==-1){
                  $(".input-box input").val("");
                   $(".black-formsbg,.login").show();
                   $(".lottery-btn").removeClass('disabled');
                }else if(data.code==-2){ //抽奖次数
                    change_useup("今日免费机会已用完啦","快，分享好友，掷骰子机会+1",2);
                }else if(data.code==-4){ //抽奖次数
                    //change_useup("今日免费机会已用完啦","快，分享好友，掷骰子机会+1",1);
                    change_useup("","今日机会已用完，请明天再来哦～ ",3);
                }else if(data.code==-6){ //10次用完
                    change_useup("","今日机会已用完，请明天再来哦～ ",3);
                }else if(data.code==-5){  //没做完任务 提示做任务
                  getTask();
                  $(".lottery-btn").removeClass('disabled');
                }else{  //奖品没领的情况    if(data.code==-3)
                  $(".black-formsbg,.no-get").show();
                  $(".lottery-btn").removeClass('disabled');
                }
            }
          });
            
        }
    })

    //  提示信息
      function promptShow(msg) {
        $('#prompt').children('em').html(msg);
        $('#prompt').show();
        window.setTimeout(function () {
          $('#prompt').hide();
        }, 2500);
      }
    //领取红包
    $(".get-btn").click(function(){
      var $this = $(this);
      if(isApp){
          //
          var ids = $(this).attr("ids");
          if(!$(this).hasClass('disabled')){
              $this.addClass('disabled');
              $.ajax({
                type: "post",
                url: basePath+'activity/receivePrize',
                data:{"userId":userId,"tel":tel,"id":ids},
                dataType: 'json',
                success: function(data) {
                  console.log(data);
                  console.log(redPacket+"========="+data.data.sVal)
                  if(data.code==1){
                    redPacket =parseFloat(redPacket)+parseFloat(data.data.sVal);
                    getCash(redPacket);
                    console.log("总的红包=="+redPacket)
                     $this.parents(".forms-wrap").hide();
                     $(".black-formsbg").hide();
                  }
                },
                complete:function(data){
                    $this.removeClass('disabled');
                }
              });
        }
          
      }else{
        //打开下载地址or唤醒APP
        var $this =$(this);
         promptShow('请到花生地铁APP领取奖励哦');
          setTimeout(() => {
            $(".black-formsbg").hide();
            $this.parents(".forms-wrap").hide();
            window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb&ckey=CK1360001376091';
          }, 2800);
      }
    })

    //弹窗的交互  common
    $(".hide-pop").click(function(){
        $(this).parents(".forms-wrap").hide();
        $(".black-formsbg").hide();
        $(".day-useup .change-box").empty();
    })

    //红包弹窗
    function getTask(){
      $(".black-formsbg,.task").show();
    }
    //奖品
    function getAwards(type){
      if(type==1){  //红包
          if(hasAwards==1){
              $(".black-formsbg,.redpacket").show();
          }else{
             $(".black-formsbg,.failbox").show();
          }
      }else{//实物
        if(hasAwards==1){
            $(".black-formsbg,.get-awards").show();
        }else{
           $(".black-formsbg,.failbox").show();
        }
      }
    }

    //机会用完的
    function change_useup(title,desc,type){ 
    // type  1 2 3   当前机会已用完 分享机会+1  -->    <!-- 第三次抽奖 今日免费机会已用完 分享机会+1  -->   <!-- 用完10次  标题为空-->
    // <!-- 今日免费机会已用完啦 -->  <!-- 空 -->
    //<div class="invate-btn"></div>   <div class="share-btn"></div>   <div class="know-btn"></div>
        $(".day-useup .title").text(title);
        $(".day-useup .content").text(desc);
        if(type==1){
          $(".day-useup .change-box").html('<div class="share-btn"></div>')
          // $(".day-useup .change-box").html('<div class="invate-btn"></div>')
        }else if(type==2){
          $(".day-useup .change-box").html('<div class="share-btn"></div>')
        }else{
          $(".day-useup .change-box").html('<div class="know-btn"></div>')
        }
        $(".black-formsbg,.day-useup").show();
        $(".lottery-btn").removeClass('disabled');
    }

    //分享
    $(".day-useup .change-box").on("click",".know-btn",function(){
        $(this).parents(".forms-wrap").hide();
        $(".black-formsbg").hide();
        $(".day-useup .change-box").empty();
    });

    //分享
    $(".day-useup .change-box").on("click",".share-btn",function(){
        share();
        updateChange(tel,0);  //次数用完的 分享
    });
    $(".share-btn").click(function(){
        share();
        updateChange(tel,1);  //任务 分享
    });

    //邀请
    $(".day-useup .change-box").on("click",".invate-btn",function(){
        invate();
    });
    $(".invate-btn").click(function(){
        invate();
    });

    $(".black-formsbg").click(function(){
      $(".black-formsbg,.wx-guide,.forms-wrap").hide();
    })

  //分享
  function share(){
    $(".black-formsbg,.day-useup,.task,.failbox").hide();
    if(isApp) {
      /* 这些变量因为微信分享要用到 所以提到public.js里面去了 */
      // var url = 'http://activity.peanut8.com/index.php/free/forward?id=63_2108';
      // var imageUrl = 'http://activity.peanut8.com/public/free/img/share.jpg';
      // var title = '连地铁WiFi，领迪士尼、云南旅游双人旅游票';
      // var text = '花生地铁WiFi地铁官方指定，免费';
      console.log("url=="+url)
      updateChange(tel,0);
      if(get_os() == 2) {
        return window.webkit.messageHandlers.openSharePanel.postMessage({
          "url": url,
          "imageUrl": imageUrl,
          "title": title,
          "text": desc
        });
      } else {
        return window.news.openSharePanel(url, imageUrl, title, desc);
      }
    } else if(is_weixn()) {
          //需要加一个引导弹窗  
          $(".black-formsbg,.wx-guide").show();
    }
  }

  //邀请
  function invate(){
    $(".black-formsbg,.day-useup,.failbox").hide();
    if(isApp) {
      var url = 'http://activity.peanut8.com/act/zillionaire/invitation.html?type=6&userId=';  //invitation.html
      var imageUrl = 'http://activity.peanut8.com/act/zillionaire/images/share.png';
      var title = 'Hi,我想领花生地铁WiFi岁未豪礼，请帮我一把哦';
      var text = '免费领香港迪士尼、云南6天5夜旅游券等，你也有机会领哦~';
      nfyg.encrypt(userId,function(data){
            url = url + data
            if(get_os() == 2) {
              return window.webkit.messageHandlers.openSharePanel.postMessage({
                "url": url,
                "imageUrl": imageUrl,
                "title": title,
                "text": text
              });
            } 
            else {
              return window.news.openSharePanel(url, imageUrl, title, text);
            }
          });
    }else if(is_weixn()) {
                //需要加一个引导弹窗  
    }
    
  }

  //跳转到APP
  $('.goapp-btn,.sign-btn').click(function() {
    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb";
  })

  //更新用户抽奖次数
  function updateChange(userId,type){
    $.ajax({
      type: "post",
      url: basePath+'activity/share',
      data:{"userId":tel,"type":type},
      dataType: 'json',
      success: function(data) {
        getStep();
      }
    });
  }

  $(".submit-btn").click(function(){
    var tels = $(".tel-num").val();
    var code =$(".yzm-code").val();
    $.ajax({
          type: "post",
          url: basePath+'activity/login',
          data:{"tel":tels,"code":code},
          dataType: 'json',
          success: function(data) {
              console.log(data);
              if(data.code==1){
                $(".black-formsbg,.login").hide();
                cookie.set("tel",tels,1);
                tel = tels
                getStep();
              }else{
                $(".error-text").text(data.msg);
              }
          }
        });
  });

})
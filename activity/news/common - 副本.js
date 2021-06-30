$(function(){
        var channelKey = "835519373702598656";
        var cityName = "深圳";
        var params = {
            "baseInfo":{
              "deviceCode":channelKey,
              "platform":1,
              "sign":"",
              "userId":"",
              "versionCode":248
            },
            "channelKey":"uc_youliao",
            "cityName":cityName,
            "imei":channelKey,
            "nType":2
        }

        init();

        $(".nav-list li").click(function(){
          if(!$(this).hasClass("act")){
            $(".nav-list li").removeClass("act");
            $(this).addClass("act");
             channelKey = $(this).attr("channelKey");
             cityName = $(this).text();
             $(".con-list").empty();

             init();
          }
        })

        $(window).scroll(function(){
            var scrollTop = Math.ceil($(this).scrollTop()); //滚动条的高度
            var conHeight =$(this).height();  //可见内容高度
            var  totalHeight = $(document).height(); // 总高度
            if((scrollTop + conHeight)>=totalHeight){  //
              init();
            }
        });
        //详情
        $(".con-list").on("click","a",function(){
          var vData = $(this).attr("v-data");
          localStorage.setItem("detailUrl",vData);
          var pid = Math.floor(Math.random()*10000000);
          window.location.href = "detail.html?pid=p"+pid;
        })
        //下载
        var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        $(".down-btn").click(function(){
          if (isIOS) {
           //这个是安卓操作系统
           window.open("https://itunes.apple.com/cn/app/%E7%8E%A9%E8%BD%AC%E5%9C%B0%E9%93%81/id1439775795?mt=8");
        }else{
           window.open("http://portal.wode20.com/wifiapp/upload/WMETRO_115_126.apk");
        }
        })

        function init(){
         $.ajax({
                url: 'http://cmsapi.wifi8.com/v100/publicNews/list',
                type: 'post',
                dataType: 'json',
                data: JSON.stringify(params),
                success: function(data) {
                    console.log(data);
                    if(data.resultCode == 0){
                      var html = '';
                      var data = data.data;
                      for(var i = 0; i<data.articleList.length;i++){
                        if(data.articleList[i].pic3){
                          html+='<li>'+
                            '<a href="javascript:;" v-data = "'+data.articleList[i].linkUrl+'">'+
                              '<div class="con-main">'+
                                '<div class="txt-wrap">'+
                                  '<h3>'+data.articleList[i].title+'</h3>'+
                                  '<span>'+data.articleList[i].srcName+'</span>'+
                                '</div>'+
                                '<div class="img-wrap" style="background-image:url('+data.articleList[i].pic3[0].url +')"></div>'+
                              '</div></a></li>'
                        }
                      }
                      $(".con-list").append(html);
                    }
                }
            });
        }
    })


  function loadingDetail(id){
    var url = localStorage.getItem("detailUrl")
    $("#"+id).attr("src",url);
  }

  

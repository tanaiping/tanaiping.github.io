layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var ban_id = $("#iframe",parent.document.body).attr("ban_id");
    var type = 0;  //1 代表新增  2 代表修改
    //判断是券申请 还是编辑
    var  ifr_src = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      ifr_src = $("#iframe",parent.document.body).attr("src");
    }

    if(ifr_src.indexOf("editType")!= -1){ //修改商家
        $(".bis-title").text("编辑商家");
        type = 2;
        initEditBanner(ban_id);
    }else{
        type = 1;
    }

    //监听保存
    form.on('submit(submitBtn)', function(data){
        var _this = $(this);
        saveBanner(ban_id,type,_this);
        return false;
    });

    

    //获取banner详情
    function initEditBanner(ban_id){
        $.ajax({
            type: "post",
            url: basePath+'/sys/banner/getBannerDetail?bannerId='+ban_id,
            contentType: "application/json",
            dataType: 'json',
            // data:JSON.stringify({"bannerId":ban_id}),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                $("#title").val(data.data.title);
                $(".upload-thumbnail-img").attr("src",data.data.bannerUrl).removeClass("default");
                $("#shelves_start").val(data.data.startTime);
                $("#shelves_end").val(data.data.endTime);
                $("#banner_path").val(data.data.linkUrl);

              }else if(data.resultCode==3){
                localStorage.removeItem('role');
                localStorage.removeItem('token');
                top.location.href="/cms/login.html?rdm="+Math.random();
              }else{
                layer.msg(data.resultMsg, {icon: 5});

              }
            },
            fail: function() {
              //layer.msg("网络异常，请稍后再试！", {icon: 5});
            }
        });

    }
    //提交banner信息
    function saveBanner(ban_id,type,obj){
        if(!obj.hasClass("disabled")){
            obj.addClass("disabled");
            var title = $("#title").val();
            var startTime = $("#shelves_start").val();
            var endTime = $("#shelves_end").val();
            var linkUrl = $("#banner_path").val();
            var bannerUrl = "";
            if($(".upload-thumbnail-img").hasClass('default')){
                  layer.msg("请上传缩略图", {icon: 5});
                  obj.removeClass("disabled");
                  return false;
                }else{
                  bannerUrl = $(".upload-thumbnail-img").attr("src");
                }
            if(!isUrl(linkUrl)){
                layer.msg("请填写有效的跳转路径", {icon: 5});
                obj.removeClass("disabled");
                return false
            }
            var params ={
                  "bannerUrl": bannerUrl,
                  "endTime": endTime,
                  "id": ban_id,
                  "index": "",
                  "linkUrl": linkUrl,
                  "startTime": startTime,
                  "status": "",
                  "title": title,
                  "type": type
            }
            $.ajax({
                type: "post",
                url: basePath+'/sys/banner/saveBanner',
                contentType: "application/json",
                dataType: 'json',
                data:JSON.stringify(params),
                beforeSend: function (xhr) {
                   xhr.setRequestHeader('token', token);
                },
                success: function(data) {
                  if(data.resultCode==0){
                    layer.msg("操作成功！", {icon: 1});
                    setTimeout(function(){
                      var history_src = localStorage.getItem('history_src');
                      $("#iframe", window.parent.document).attr("src",history_src);
                    },1000);

                  }else if(data.resultCode==3){
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    top.location.href="/cms/login.html?rdm="+Math.random();
                  }else{
                    layer.msg(data.resultMsg, {icon: 5});
                    obj.removeClass("disabled");
                  }
                },
                fail: function() {
                  //layer.msg("网络异常，请稍后再试！", {icon: 5});
                }
            });

        }
    }



    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#shelves_start', //指定元素
      type: 'datetime',
      trigger: 'click', //触发事件
      istime: true, //是否开启时间选择
      isclear: true, //是否显示清空
      istoday: true, //是否显示今天
      issure: true, //是否显示确认
      min: '1990-01-01', //设定最小日期为当前日期  
      max: '2900-01-01', //最大日期 laydate.now(-1)
      done: function(value,date){
          endDate.config.min={
          year:date.year,
          month:date.month-1,//关键
          date: date.date,
          hours: 0,
          minutes: 0,
          seconds : 0
          }
      },
      ready: function(date){
      //初始化默认时间分为23：59：59
        // this.dateTime.hours = 23;
        // this.dateTime.minutes = 59;
        // this.dateTime.seconds = 59;
      }
    });
    //执行一个laydate实例
    var endDate = laydate.render({
      elem: '#shelves_end', //指定元素
      type: 'datetime',
      trigger: 'click', //触发事件
      istime: true, //是否开启时间选择
      isclear: true, //是否显示清空
      istoday: true, //是否显示今天
      issure: true, //是否显示确认
      min: '1990-01-01', //设定最小日期为当前日期   laydate.now(-7)
      max: '2900-01-01', //最大日期 laydate.now(-1)
      done: function(value,date){
          if(value=="") return false;
          startDate.config.max={
          year:date.year,
          month:date.month-1,//关键
          date: date.date,
          hours: 0,
          minutes: 0,
          seconds : 0
          }
      },
      ready: function(date){
      //初始化默认时间分为23：59：59
        this.dateTime.hours = 23;
        this.dateTime.minutes = 59;
        this.dateTime.seconds = 59;
      }
    });



    /**
 * 验证是否是URL地址
 * @param url
 * @returns Boolean
 */
function isUrl(url){
    // var urlRegex = /^(http|https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    // var urlRegex = /^(http|https?|ftp)*$/;
    var urlRegex = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
    return urlRegex.test(url);
}
  

  

  


});
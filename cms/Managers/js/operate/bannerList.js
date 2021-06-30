layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
  var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    
    //初始化列表
    initBannerList(1,true)

    //监听搜索
    form.on('submit(searchBannerList)', function(data){
      initBannerList(1,true);
      return false;
    });
	//重置
	$(".layui-btn-reset").click(function(){
		var parent_form = $(this).parents("form");
		parent_form.find("input").val("");
		$(".select-com").val("-1");
		form.render('select');
		initList(1,true);
		return false;
	})

    //置顶  3
    $(document).on('click','.sticky-btn',function(){
        commonOpera(3,this,"/sys/banner/updateBannerIndex");
    });
    //上移 1 
    $(document).on('click','.moveUp-btn',function(){
        commonOpera(1,this,"/sys/banner/updateBannerIndex");
    });
    //下移 2
    $(document).on('click','.moveDown-btn',function(){
      commonOpera(2,this,"/sys/banner/updateBannerIndex");
    });

    //下架 上架
    $(document).on('click','.takeOff-btn',function(){
       var _this  = this;
       var take_txt = $(this).text();
       var isflg ="会";
       if(take_txt == "上架"){
          isflg = "会";
       }else{
        isflg = "不";
       }
        layer.confirm(take_txt+'该商品后，客户端'+isflg+'展示了哦~',{
            title:"提示",
            btn: ['取消','确定'] //按钮
          }, function(){
            layer.closeAll();
          }, function(){
            //下架  上架回调
            takeOff(_this);
          });
        // return false;
    })

    //新增
    $(document).on('click','.addBanner',function(){
        localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
        $("#iframe", window.parent.document).attr("src",'operate/bannerAdd.html?'+Math.random());
        return false;
    })
    //修改
    $(document).on('click','.banner-edit',function(){
      var ban_id = $(this).parents("tr").attr('ban_id');
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe", window.parent.document).attr({"src":'operate/bannerAdd.html?editType=1&rmd'+Math.random(),"ban_id":ban_id});
      return false;
    });
    

    function initBannerList(curPage,initPage){
      var title = $("#title_name").val();
      var startTime = $("#create_start").val();
      var endTime = $("#create_end").val();
      var status = $("#banner_type").val();
      var params = {
          "endTime": endTime,
          "pageNo": curPage,
          "startTime": startTime,
          "status": status,
          "title": title
        }
        // console.log(params);
      $.ajax({
          type: "post",
          url: basePath+'/sys/banner/getBannerList',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
        },
          success: function(data) {
            if(data.resultCode==0){
                var html =''
                var res = data.data;
                if(res.data!=null&&res.data.length!=0){
                  for(var i=0;i<res.data.length;i++){
                      var b_status ="";
                      if(res.data[i].status==1){
                        b_status ="上架"
                      }else if(res.data[i].status==2){
                        b_status ="下架"
                      }else if(res.data[i].status==0){
                        b_status ="待上架"
                      }
                      html += '<tr status = "'+res.data[i].status+'" ban_id = "'+res.data[i].id+'" index = "'+res.data[i].index+'"><td>'+(i+1)+'</td><td>'+res.data[i].title+'</td>'+
                               '<td><img src="'+res.data[i].bannerUrl+'" style="height:60px;"></td><td>'+res.data[i].linkUrl+'</td>'+
                               '<td>'+b_status+'</td><td>'+res.data[i].startTime+'</td><td>'
                               if(res.data[i].status !=2){
                       html += '<button class="layui-btn layui-btn-primary sticky-btn">置顶</button>'+
                                 '<button class="layui-btn layui-btn-danger moveUp-btn">上移</button>'+
                                 '<button class="layui-btn layui-btn-normal moveDown-btn">下移</button>'
                               }
                                if(res.data[i].status ==1){
                                  html +=  '<button class="layui-btn layui-btn-primary takeOff-btn">下架</button>'
                                }else if(res.data[i].status ==2||res.data[i].status ==3){
                                  html +=  '<button class="layui-btn layui-btn-danger takeOff-btn">上架</button>'
                                } 
                      html +=  '<button class="layui-btn layui-btn-normal banner-edit">修改</button></td></tr>'

                  }
                  $("#bannerData").html(html);
                  var total = data.data.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }else{
                  html+='<tr><td colspan="7" class="layui-td-nodata"></td></tr>'
                      $("#bannerData").html(html);
                      $("#pageList").hide();
                }
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



    function commonOpera(type,obj,url){
      var ban_id = $(obj).parents("tr").attr("ban_id");
      var index = $(obj).parents("tr").attr("index");
      var params = {
        "id":ban_id,
        "index":index,
        "type":type,
      }
      $.ajax({
            type: "post",
            url: basePath+url,
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
                console.log(data);
              if(data.resultCode==0){
                window.location.href='bannerManager.html?'+Math.random();
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

    function takeOff(obj){
        console.log("Fsf");
      var ban_id = $(obj).parents("tr").attr("ban_id");
      var status = $(obj).parents("tr").attr("status");
      //上架下架状态切换  告诉后台应该要进行上架 or下架操作
      if(status ==1){
        status = 2;
      }else{
         status = 1;
      }
      var params = {
        "id":ban_id,
        "status":status,
      }
      console.log(params);
      $.ajax({
            type: "post",
            url: basePath+'/sys/banner/updateBannerStatus',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              console.log(data);
              if(data.resultCode==0){
                window.location.href='bannerManager.html?'+Math.random();
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


    function page(total){
      //分页
     laypage.render({
       elem: 'pageList' //注意，这里的 test1 是 ID，不用加 # 号
       ,count: total //数据总数，从服务端得到
       ,limit:20
       ,skin: '#1E9FFF' //自定义选中色值
       ,prev:'上一页'
       ,next:'下一页'
       ,layout: ['count', 'prev', 'page', 'next', 'skip']
       ,groups:2
         ,jump: function(obj, first){
            //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
          if(!first){
            initBannerList(obj.curr,false);
            $(window).scrollTop(0);
          }
        }
     });
    }



    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#create_start', //指定元素
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
      elem: '#create_end', //指定元素
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


});
layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate
    ,laypage = layui.laypage;

    var nowTime = new Date();
    var LDate = new Date(nowTime - 1000 * 60 * 60 * 24 * 30);
    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#order_start', //指定元素
      trigger: 'click', //触发事件
      value:LDate,
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
      }
    });
    //执行一个laydate实例
    var endDate = laydate.render({
      elem: '#order_end', //指定元素
      trigger: 'click', //触发事件
      value:nowTime,
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
      }
    });

    //初始化昨日分析数据
    initYesData();
    //用户列表数据
    setTimeout(function(){initUserList(1,true)},500);



    //监听用户分析查询
    form.on('submit(searchUserAnalyse)', function(data){
        initUserList(1,true);
        return false;
    });

    //监听用户分析导出
    form.on('submit(exportUserAnalyse)', function(data){
        exportUserList(1);
        return false;
    });

    function initYesData(){
      $.ajax({
          type: "get",
          url: basePath+"/sys/analyse/getYesterdayUserData",
          contentType: "application/json",
          dataType: 'json',
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var res =data.data;
              $("#add_member").text(res.addMember);
              $("#add_user").text(res.addUser);
              $("#total_member").text(res.totalMember);
              $("#total_user").text(res.totalUser);

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

    function initUserList(curPage,initPage){
      var startTime = $("#order_start").val();
      var endTime = $("#order_end").val();
      var params = {
            "endTime": endTime,
            "pageNo": curPage,
            "startTime": startTime
          }
      
      $.ajax({
          type: "post",
          url: basePath+"/sys/analyse/getUserList",
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token',token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var res =data.data;
              if(res.data!=null){
                var html='';
                for(var i=0;i<res.data.length;i++){
                    html += '<tr><td>'+res.data[i].reportTime+'</td><td>'+res.data[i].addUser+'</td>'+
                            '<td>'+res.data[i].addMember+'</td><td>'+res.data[i].rate+'</td>'+
                            '<td>'+res.data[i].buyGoods+'</td><td>'+res.data[i].saleGoods+'</td>'+
                            '<td>'+res.data[i].price+'</td></tr>'
                }
                $("#analyseData").html(html);
                var total = data.data.total;
                if(total>20){
                          if(initPage){page(total);$("#pageList").show();};
                      }else{
                          $("#pageList").hide();
                      }
              }else{
                    html+='<tr><td colspan="7" class="layui-td-nodata"></td></tr>'
                    $("#analyseData").html(html);
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

    function exportUserList(curPage){
      var startTime = $("#order_start").val();
      var endTime = $("#order_end").val();
      var params = {
            "endTime": endTime,
            "pageNo": curPage,
            "startTime": startTime
          }
      
      $.ajax({
          type: "post",
          url: basePath+"/sys/analyse/exportUserList",
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          async:false, //同步
          beforeSend: function (xhr) {
         xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
			             window.open(data.data);
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
            initUserList(obj.curr,false);
          	$(window).scrollTop(0);
          }
        }
     });
    }

});
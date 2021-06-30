layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    //获取用户渠道列表
    initUserAgent();
    
    //初始化用户列表
    setTimeout(function(){initUserManager(1,true)},500);

    //监听搜索
    form.on('submit(searchUserManager)', function(data){
      initUserManager(1,true);
      return false;
    });

    form.on('submit(exportUserManager)', function(data){
      exportUserManager(1);
      return false;
    });
    function initUserAgent(){
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/userAgent/list',
          contentType: "application/json",
          dataType: 'json',
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
        },
          success: function(data) {
            if(data.resultCode==0){
              var res = data.data;
              // console.log(res);
              if(res){
                var html = '';
                for(var i = 0;i<res.length;i++){
                  html +='<option value="'+res[i].agentKey+'">'+res[i].agentName+'</option>'
                }
                $("#media").html(html);
                form.render("select");
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


    function initUserManager(curPage,initPage){
      var mobile = $("#user_tel").val();
      var vipType = $("#user_type").val();
      var agentKey = $("#media").val();
      if(mobile !=""&&mobile !=null){
        if(!phoneFun(mobile)){
          layer.msg("请输入正确的手机号", {icon: 5});
          return false;
        }
      }
      var params = {
          "agentKey": agentKey,
          "mobile": mobile,
          "pageNo": curPage,
          "vipType": vipType
        }
        // console.log(params);
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/userData/list',
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
                // console.log(res);
                if(res.data!=null&&res.data.length!=0){
                  for(var i=0;i<res.data.length;i++){
                      var userType ="";
                      if(res.data[i].vipType==0){
                        userType ="普通用户"
                      }else if(res.data[i].vipType==1){
                        userType ="体验会员"
                      }else if(res.data[i].vipType==2){
                        userType ="特权会员"
                      }
                      html += '<tr><td>'+(i+1)+'</td><td>'+res.data[i].mobile+'</td>'+
                              '<td>'+res.data[i].uid+'</td><td>'+res.data[i].nickName+'</td><td>'+userType+'</td><td>'+res.data[i].agentName+'</td><td>'+res.data[i].createTime+'</td>'+
                              '</tr>'
                  }
                  $("#userData").html(html);
                  var total = data.data.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }else{
                  html+='<tr><td colspan="7" class="layui-td-nodata"></td></tr>'
                      $("#userData").html(html);
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
          	initUserManager(obj.curr,false);
          	$(window).scrollTop(0);
          }
        }
     });
    }

    function exportUserManager(curPage){
      var mobile = $("#user_tel").val();
      var vipType = $("#user_type").val();
      var agentKey = $("#media").val();
      if(mobile !=""&&mobile !=null){
        if(!phoneFun(mobile)){
          layer.msg("请输入正确的手机号", {icon: 5});
          return false;
        }
      }
      var params = {
          "agentKey": agentKey,
          "mobile": mobile,
          "pageNo": curPage,
          "vipType": vipType
        }
        // console.log(params);
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/export/userData',
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

    //判断是否为手机号的正则表达式
    function phoneFun(phones){
        var myreg = /\d{11}$/;
        if (!myreg.test(phones)) {
            console.log('手机号格式不正确')
          return false;
        } else {
            console.log('手机号格式正确')
          return true;
        }
    }
});
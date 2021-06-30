layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    //获取用户渠道列表
    initUserAgent();
    //初始化返利列表
    setTimeout(function(){initRebateList(1,true)},500);


    //监听搜索
    form.on('submit(searchRebate)', function(data){
      initRebateList(1,true);
      return false;
    });

    //查看订单
    $(document).on('click','.rebate-look',function(){
      var uid = $(this).parents("tr").attr('uid');
      var mobile = $(this).parents("tr").attr('mobile');
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe",parent.document.body).attr({"src":"operate/rebateDetail.html?editType=1&rdm="+Math.random(),"uid":uid,"mobile":mobile});
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
              if(res!=null&&res.length!=0){
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

    
    
    function initRebateList(curPage,initPage){
      var mobile = $("#user_tel").val();
      var agentKey = $("#media").val();
      if(mobile !=""&&mobile !=null){
        if(!phoneFun(mobile)){
          layer.msg("请输入正确的手机号", {icon: 5});
          return false;
        }
      }
      var params = {
          "mobile": mobile,
          "agentKey":agentKey,
          "pageNo":curPage
        }
        // console.log(params);
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/huaCurrency/list',
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
						var totalConsumeMoney = (res.data[i].totalConsumeMoney)/100;
						totalConsumeMoney = totalConsumeMoney.toFixed(2);
                      html += '<tr uid = "'+res.data[i].uid+'" mobile = "'+res.data[i].mobile+'"><td>'+(i+1)+'</td><td>'+res.data[i].mobile+'</td>'+
                              '<td>￥'+totalConsumeMoney+'</td><td>'+res.data[i].totalGetCurrency+'</td><td>'+res.data[i].totalConsumeCurrency+'</td><td>'+res.data[i].surplusCurrency+'</td>'+
                              '<td>'+res.data[i].agentName+'</td><td><button class="layui-btn layui-btn-normal rebate-look">查看</button></td></tr>'
                  }
                  $("#rebateData").html(html);
                  var total = data.data.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }else{
                  html+='<tr><td colspan="8" class="layui-td-nodata"></td></tr>'
                      $("#rebateData").html(html);
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
          	initRebateList(obj.curr,false);
          	$(window).scrollTop(0);
          }
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
layui.use(['jquery','element','layer','form','laydate'], function(){
  var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var uid = $("#iframe",parent.document.body).attr("uid");
    var mobile = $("#iframe",parent.document.body).attr("mobile");
    var agentName = $("#iframe",parent.document.body).attr("agentName");
    $("#mobile").text(mobile);
    //初始化数据
    InitCashbackDetail(1,true)
    
    function InitCashbackDetail(curPage,initPage){
      var params = {
          "uid": uid,
          "pageNo":curPage
        }
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/inviteCashBackDetail/list',
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
                console.log(res);
                if(res.data){
                  for(var i=0;i<res.data.length;i++){
                    var cashbackStatus = "";
                      if(res.data[i].status ==0){
                        cashbackStatus = "未生效";
                      }else if(res.data[i].status ==1){
                        cashbackStatus = "生效";
                      }
					  else if(res.data[i].status ==2){
					    cashbackStatus = "已失效";
					  }
                      html += '<tr><td>'+(i+1)+'</td><td>'+res.data[i].mobile+'</td>'+
                              '<td>'+res.data[i].createTime+'</td><td>'+cashbackStatus+'</td><td>'+res.data[i].amount+'</td>'+
                              '<td>'+agentName+'</td></tr>'
                  }
                  $("#cashbackDetailData").html(html);
                  var total = data.data.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }else{
                  html+='<tr><td colspan="6" class="layui-td-nodata"></td></tr>'
                      $("#cashbackDetailData").html(html);
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
            InitCashbackDetail(obj.curr,false);
            $(window).scrollTop(0);
          }
        }
     });
    }


});
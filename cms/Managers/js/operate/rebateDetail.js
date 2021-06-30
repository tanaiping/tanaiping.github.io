layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    var uid = $("#iframe",parent.document.body).attr("uid");
    var mobile = $("#iframe",parent.document.body).attr("mobile");
    $("#mobile").text(mobile);
    //初始化数据
    InitRebateDetail(1,true)
    
    function InitRebateDetail(curPage,initPage){
      var params = {
          "uid": uid,
          "pageNo":curPage
        }
      $.ajax({
          type: "post",
          url: basePath+'/sys/user/huaCurrencyDetail/list',
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
                // console.log(res.data);
                if(res.data!=null&&res.data.length!=0){
                  for(var i=0;i<res.data.length;i++){
                    var rebateType = "";
                      if(res.data[i].type ==1){
                        rebateType = "商品";
                      }else if(res.data[i].type ==2){
                        rebateType = "兑换";
                      }
                      html += '<tr><td>'+(i+1)+'</td><td>'+res.data[i].orderNum+'</td>'+
                              '<td>'+rebateType+'</td><td>￥'+(res.data[i].consumeMoney)/100+'</td><td>'+(res.data[i].currency>0?"+"+res.data[i].currency:res.data[i].currency)+'</td>'+
                              '<td>'+res.data[i].createTime+'</td></tr>'
                  }
                  // console.log(html);
                  $("#rebateDetailData").html(html);
                  var total = data.data.total;
                    if(total>20){
                        if(initPage){page(total);$("#pageList").show();};
                    }else{
                        $("#pageList").hide();
                    }
                }else{
                  html+='<tr><td colspan="7" class="layui-td-nodata"></td></tr>'
                      $("#rebateDetailData").html(html);
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
            InitRebateDetail(obj.curr,false);
            $(window).scrollTop(0);
          }
        }
     });
    }


});
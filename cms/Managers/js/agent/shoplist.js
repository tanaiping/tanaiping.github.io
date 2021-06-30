//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage;

   
    initShoplist(1,true);

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
              console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
              if(!first){
                initShoplist(obj.curr,false);
                $(window).scrollTop(0);
              }
            }
         });
    }



    //渲染我的卡券列表页
    function initShoplist(curPage,initPage){
        $.ajax({
            type: "post",
            url: basePath+"/sys/bis/getBisList",
            data:JSON.stringify({"pageNo":curPage,"agentId":userId}),
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
                 xhr.setRequestHeader('token', token);
            },
            success: function(data) {
                //console.log(data);
                var html='';
                if(data.resultCode==0){
                    var res = data.data.data;
                    var btnarry=[];
                    if(res){
                    var html='';
                    for(var i=0;i<res.length;i++){
                        html+='<tr><td>'+res[i].bisName+'</td>';
                        html+='<td>'+res[i].license+'</td>';
                        html+='<td>'+res[i].tradeNames+'</td>';
                        html+='<td>'+res[i].logo+'</td></tr>';
                    }
                    $("#shoplist tbody").html(html);
                    var total = data.data.total;
                        if(total>20){
                            if(initPage){page(total);$("#pageList").show();};
                        }else{
                            $("#pageList").hide();
                        }
                    }
                }else if(data.resultCode==3){
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    top.location.href="/cms/login.html?"+Math.random();
                }else{
                    layer.msg(data.resultMsg, {icon: 5});
                }
                
            },
            fail: function() {
                //layer.msg("网络异常，请稍后再试！", {icon: 5});
            }
        });
    }



    
  });

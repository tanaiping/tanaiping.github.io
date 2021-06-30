//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage;


    initagentlist(1,true);

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
                initagentlist(obj.curr,false);
                $(window).scrollTop(0);
              }
            }
         });
    }



    //渲染我的卡券列表页
    function initagentlist(curPage,initPage){
        $.ajax({
            type: "post",
            url: basePath+"/sys/coupon/getAgentCouponList",
            data:JSON.stringify({"pageNo":curPage,"agentId":userId}),
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
                 xhr.setRequestHeader('token', token);
            },
            success: function(data) {
                var html='';
                if(data.resultCode==0){
                    var res = data.data.data;
                    var btnarry=[];
                    if(res){
                    var html='';
                    for(var i=0;i<res.length;i++){
                        html+='<tr><td>'+res[i].bisName+'</td>';
                        html+='<td>'+res[i].couponName+'</td>';
                        if(res[i].type==1){
                            html+='<td>电子券</td>';
                        }
                        html+='<td>'+res[i].assign+'</td>';
                        if(res[i].status==0){
                             html+='<td>未提交</td></tr>';
                        }else if(res[i].status==1){
                             html+='<td>已提交</td></tr>';
                        }else if(res[i].status==2){
                             html+='<td>已结束</td></tr>';
                        }else if(res[i].status==3){
                             html+='<td>暂停</td></tr>';
                        }else{
                             html+='<td>发券中</td></tr>';
                        }
                    }
                    $("#agentlist tbody").html(html);
                    total = data.data.total;
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

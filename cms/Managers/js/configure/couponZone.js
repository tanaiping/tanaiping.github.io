layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    

    //修改商家信息
    $(document).on('click','.coupon-edit',function(){
      var businessid = $(this).parents("tr").attr("businessid");
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe", window.parent.document).attr({"src":'configure/businessAdd.html?editType=1&ram'+Math.random(),"businessid":businessid});
      return false;
    })
    //初始化专区列表
    initZoneList(1,true);

    //置顶  3
    $(document).on('click','.sticky-btn',function(){
        commonOpera(3,this,"/sys/right/mBisIconSort");
    });
    //上移 1 
    $(document).on('click','.moveUp-btn',function(){
        commonOpera(1,this,"/sys/right/mBisIconSort");
    });
    //下移 2
    $(document).on('click','.moveDown-btn',function(){
      commonOpera(2,this,"/sys/right/mBisIconSort");
    });
    //移除
    $(document).on('click','.del-btn',function(){
      var businessid = $(this).parents("tr").attr("businessid");
      $.ajax({
            type: "get",
            url: basePath+'/sys/right/moveMbisIcon?id='+businessid,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                window.location.href='couponZone.html?'+Math.random();
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
    })

    function initZoneList(curPage,initPage){
      $.ajax({
            type: "post",
            url: basePath+'/sys/right/getMbisIconlist',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify({"pageNo":curPage}),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                var res =data.data;
                  if(res.data!=null){
                    var html='';
                    for(var i=0;i<res.data.length;i++){
                        html += '<tr iconType = "'+res.data[i].iconType+'" businessid = "'+res.data[i].id+'" sort = "'+res.data[i].sort+'" statue = "'+res.data[i].statue+'">'+
                                '<td>'+(i+1)+'</td><td>'+res.data[i].bisName+'</td>'+
                                '<td><img src="'+res.data[i].bisLogo+'" alt="" style="height: 60px;"></td><td>'+
                                '<button class="layui-btn layui-btn-primary sticky-btn">置顶</button>'+
                                '<button class="layui-btn layui-btn-danger moveUp-btn">上移</button>'+
                                '<button class="layui-btn layui-btn-normal moveDown-btn">下移</button>'+
                                '<button class="layui-btn layui-btn-danger del-btn">移除</button>'+
                                '<button class="layui-btn layui-btn-normal coupon-edit">修改</button>'+
                                '</td></tr>'
                    }

                    $("#zoneData").html(html);
                    var total = data.data.total;
                    if(total>20){
                              if(initPage){page(total);$("#pageList").show();};
                          }else{
                              $("#pageList").hide();
                          }
                  }else{
                        html+='<tr><td colspan="4" class="layui-td-nodata"></td></tr>'
                        $("#zoneData").html(html);
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
            initZoneList(obj.curr,false);
          	$(window).scrollTop(0);
          }
        }
     });
    }

    function commonOpera(type,obj,url){
      var businessid = $(obj).parents("tr").attr("businessid");
      var sort = $(obj).parents("tr").attr("sort");
      var params = {
        "id":businessid,
        "sort":sort,
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
              if(data.resultCode==0){
                window.location.href='couponZone.html?'+Math.random();
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
});
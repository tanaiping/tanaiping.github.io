layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    var cur_page =1;
     //初始化专区列表
    initList(1,true);
	
	//回车
	$(document).keydown(function(event){
	　　if(event.keyCode==13){
		 initList(1,true);
		 return false;
	　　}
	});

    //置顶  3
    $(document).on('click','.sticky-btn',function(){
        typeOpera(3,this,"/sys/charge/iconSort");
    });
    //上移 1 
    $(document).on('click','.moveUp-btn',function(){
        typeOpera(1,this,"/sys/charge/iconSort");
    });
    //下移 2
    $(document).on('click','.moveDown-btn',function(){
      typeOpera(2,this,"/sys/charge/iconSort");
    });

    //新增分类
    $(document).on('click','.addIcon',function(){
		var iconid = $(this).parents("tr").attr('iconid');
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe", window.parent.document).attr("src",'icon/iconAdd.html?'+Math.random()).removeAttr("iconid");
      return false;
    })

    //修改分类
    $(document).on('click','.edit-btn',function(){
      var iconid = $(this).parents("tr").attr("iconid");
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe", window.parent.document).attr({"src":'icon/iconAdd.html?editType=1&ram'+Math.random(),"iconid":iconid});
      return false;
    })
	
	//移除
	$(document).on('click','.del-btn',function(){
	  var iconid = $(this).parents("tr").attr("iconid");
	  $.ajax({
	        type: "get",
	        url: basePath+'/sys/charge/moveIcon?id='+iconid,
	        contentType: "application/json",
	        dataType: 'json',
	        beforeSend: function (xhr) {
	           xhr.setRequestHeader('token', token);
	        },
	        success: function(data) {
	          if(data.resultCode==0){
	           initList(cur_page,true);
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

    function initList(curPage,initPage){
      $.ajax({
            type: "post",
            url: basePath+'/sys/charge/getIconList',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify({"pageNo":curPage}),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              console.log(data);
              if(data.resultCode==0){
                var res =data.data;
                  if(res.data!=null){
                    var html='';
                    for(var i=0;i<res.data.length;i++){
                      html += '<tr sort="'+res.data[i].index+'" iconid="'+res.data[i].id+'"><td>'+(i+1)+'</td><td>'+res.data[i].title+'</td><td><img src="'+res.data[i].imageUrl+'"  style="width:60px;height:60px"/></td><td><a href="'+res.data[i].linkUrl+'" target="_blank" >'+res.data[i].linkUrl+'</a></td><td>'+
                              '<button class="layui-btn layui-btn-primary sticky-btn">置顶</button>'+
                              '<button class="layui-btn layui-btn-danger moveUp-btn">上移</button>'+
                              '<button class="layui-btn layui-btn-normal moveDown-btn">下移</button>'
                              html += '<button class="layui-btn  layui-btn-danger del-btn">移除</button>'+
                              '<button class="layui-btn layui-btn-primary edit-btn">修改</button>'+
                              '</td></tr>'
                    }

                    $("#iconData").html(html);
                    var total = data.data.total;
                    if(total>20){
                              if(initPage){page(total);$("#pageList").show();};
                          }else{
                              $("#pageList").hide();
                          }
                  }else{
                        html+='<tr><td colspan="5" class="layui-td-nodata"></td></tr>'
                        $("#iconData").html(html);
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
          	initList(obj.curr,false);
			cur_page = obj.curr;
          	$(window).scrollTop(0);
          }
        }
     });
    }


    function typeOpera(type,obj,url){
      var iconId = $(obj).parents("tr").attr("iconid");
      var sort = $(obj).parents("tr").attr("sort");
      var params = {
        "id":iconId,
        "index":sort,
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
                initList(cur_page,false);
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
//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage','laydate'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,laypage=layui.laypage
	,laydate=layui.laydate
    ,form = layui.form;
	

	var curPage = 1;
	var pageSize = 10;
	
    getadList(1,true);

    $(document).keypress(function(e) {  
      // 回车键事件  
       if(e.which == 13) {  
        getadList(1,true);
       }  
   }); 
     //分页
    function page(total){
      //分页
     laypage.render({
       elem: 'pageList' //注意，这里的 test1 是 ID，不用加 # 号
       ,count: total //数据总数，从服务端得到
       ,limit:pageSize
       ,skin: '#1E9FFF' //自定义选中色值
       ,prev:'上一页'
       ,next:'下一页'
       ,layout: ['count', 'prev', 'page', 'next', 'skip']
       ,groups:2
         ,jump: function(obj, first){
            //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
          if(!first){
            getadList(obj.curr,false);
			curPage = obj.curr;
            $(window).scrollTop(0);
          }
        }
     });
    }

    //订单列表
    function getadList(cur_page,initPage){
		$.ajax({
			type:'POST',
			dataType: 'json',
			url:basePath+'/api/webtomb/getsysadconf',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('utoken', utoken);
			},
			success: function (data) {
				if(data.code == 100){
					var res =data.data.info;
					console.log(res)
					var html = '';
					if(res){
						html+='<tr>'+
							'<td>'+res.adtitle+'</td>'+
							'<td><img src="'+res.picurl+'"/></td>'+
							'<td>'+res.gourl+'</td></tr>'
						
						$("#adData").html(html);
					}else{
						html+='<tr><td colspan="3" class="layui-td-nodata"></td></tr>'
						$("#adData").html(html);
					}
				}else{
				  layer.msg(data.codemsg, {icon: 5});
				}
			}
		});
    }

  });

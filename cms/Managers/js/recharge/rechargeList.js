layui.use(['jquery','element','layer','form','laydate','laypage','upload'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,upload = layui.upload
    ,laydate = layui.laydate;

    var cur_page = 1;
	
    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#startTime', //指定元素
      trigger: 'click', //触发事件
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
      elem: '#endTime', //指定元素
      trigger: 'click', //触发事件
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
    //下架 上架
    $(document).on('click','.takeoff-btn',function(){
       var _this  = this;
       var take_txt = $(this).text();
       var isflg ="会";
       if(take_txt == "上架"){
          isflg = "会";
       }else{
        isflg = "不";
       }
        layer.confirm(take_txt+'该直充后，客户端'+isflg+'展示了哦~',{
            title:"提示",
            btn: ['取消','确定'] //按钮
          }, function(){
            layer.closeAll();
          }, function(){
            //下架  上架回调
			if(take_txt=="上架"){//下架
				takeOff('/sys/charge/upShelves',_this);
			}else{//上架
				takeOff('/sys/charge/downShelves',_this);
			}
          });
    })

    
    

    //修改
    $(document).on('click','.charge-edit',function(){
      var chargeDetailId = $(this).parents("tr").attr("chargeDetailId");
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe", window.parent.document).attr({"src":'recharge/rechargeEdit.html?editType=1&ram'+Math.random(),"chargeDetailId":chargeDetailId});
      return false;
    });
	//删除
	$(document).on('click','.charge-del',function(){
	  var chargeDetailId = $(this).parents("tr").attr("chargeDetailId");
	  delCharge(chargeDetailId);
	  return false;
	});
	
	//删除直充
	function delCharge(id){
		layer.confirm('删除该直充信息，删除后将不存在了哦~',{
		    title:"确认删除",
		    btn: ['取消','确定'] //按钮
		  }, function(){
		    layer.closeAll();
		  }, function(){
			$.ajax({
			      type: "get",
			      url: basePath+'/sys/charge/deleteCharge?id='+id,
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
		  });
		
	}

    //初始化权益列表
    initList(1,true);
	
	//回车
	$(document).keydown(function(event){
	　　if(event.keyCode==13){
		 initList(1,true);
		 return false;
	　　}
	});

    //监听列表查询
    form.on('submit(searchRechargeList)', function(data){
        initList(1,true);
        return false;
    });
    //监听列表导出
    form.on('submit(exportRechargeList)', function(data){
        exportRechargeList(1);
        return false;
    });
	

    function initList(curPage,initPage){
      var chargeName = $("#chargeName").val();
      var startTime = $("#startTime").val();
      var endTime = $("#endTime").val();
      var statue = $("#statue").val();

      var params = {
            "chargeName": chargeName,
            "startTime": startTime,
            "endTime": endTime,
            "pageNo": curPage,
            "statue": statue
          }
      $.ajax({
            type: "post",
            url: basePath+'/sys/charge/getChargeList',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                var res =data.data;
                  if(res.data!=null&&res.data.length!=0){
                    var html='';
                    for(var i=0;i<res.data.length;i++){
                        html += '<tr chargeId="'+res.data[i].chargeId+'" chargeDetailId="'+res.data[i].id+'" statue="'+res.data[i].statue+'"><td>'+(i+1)+'</td><td>'+res.data[i].chargeId+'</td><td>'+res.data[i].chargeName+'</td>'+
                                '<td><img src="'+(res.data[i].bannerUrl==null?"":res.data[i].bannerUrl)+'" alt="" style="height: 60px;"></td>'+
								'<td><img src="'+(res.data[i].imageUrl==null?"":res.data[i].imageUrl)+'" alt="" style="height: 60px;"></td>'+
                                '<td>'+res.data[i].createTime+'</td>'+
                                '<td>'+res.data[i].type+'</td>'+
                                '<td>'+res.data[i].productName+'</td>'+
                                '<td>'+(res.data[i].salePrice==null?"--":res.data[i].salePrice)+'</td>'+
                                '<td>'+res.data[i].statueName+'</td><td>'
                                if(res.data[i].statue == 1){
                                      html += '<button class="layui-btn layui-btn-primary takeoff-btn">下架</button>'
                                }else if(res.data[i].statue == 2||res.data[i].statue == 0){
                                      html += '<button class="layui-btn layui-btn-danger takeoff-btn">上架</button>'
                                }
                                html += '<button class="layui-btn layui-btn-normal charge-edit">修改</button>'+
                                  '<button class="layui-btn charge-del">删除</button>'+
                                '</td></tr>'

                    }

                    $("#chargeListData").html(html);
                    var total = data.data.total;
                    if(total>20){
                              if(initPage){page(total);$("#pageList").show();};
                          }else{
                              $("#pageList").hide();
                          }
                  }else{
                        html+='<tr><td colspan="11" class="layui-td-nodata"></td></tr>'
                        $("#chargeListData").html(html);
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

    function exportRechargeList(curPage){
      var chargeName = $("#chargeName").val();
      var startTime = $("#startTime").val();
      var endTime = $("#endTime").val();
      var statue = $("#statue").val();
      
      var params = {
            "chargeName": chargeName,
            "startTime": startTime,
            "endTime": endTime,
            "pageNo": curPage,
            "statue": statue
          }
      $.ajax({
            type: "post",
            url: basePath+'/sys/charge/exportChargeList',
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
            initList(obj.curr,false);
			cur_page = obj.curr;
            $(window).scrollTop(0);
          }
        }
     });
    }

    function takeOff(requestUrl,obj){
      var id = $(obj).parents("tr").attr("chargeDetailId");
      $.ajax({
            type: "get",
            url: basePath+requestUrl+'?id='+id,
            contentType: "application/json",
            dataType: 'json',
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
layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,laydate = layui.laydate;

    
    getGoodsList(1,true);

    //监听搜索商品列表
    form.on('submit(searchGoodsList)', function(data){
        getGoodsList(1,true);
        return false;
    });
    //监听导出商品列表
    form.on('submit(exportGoodsList)', function(data){
        exportGoodsList(1);
        return false;
    });



    

    //监听新增商品
    $(".addGoods").click(function(){
        localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
        $("#iframe", window.parent.document).removeAttr("goodsid").attr("src",'goods/goodsAdd.html?'+Math.random());
        return false;
    });

    //修改
    $(document).on('click','.goods-edit',function(){
      var goodsid = $(this).parents("tr").attr('goodsid');
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      isEditGoods(goodsid)
      return false;
    });

    $(document).on('click','.preview-btn',function(){
      var goodsId = $(this).parents("tr").attr("goodsid")
      layer.open({
          type:1
          ,title: "预览"
          ,content: $('#previewWrap')
          ,area: ['375px', '500px'] //宽高
          ,btn: ['确定'] //只是为了演示
          ,success:function(){
              $.ajax({
                  type: "post",
                  url: basePath+'/sys/goods/getGoodsDetail?goodsId='+goodsId,
                  contentType: "application/json",
                  //data:"goodsId="+goodsId,
                  dataType: 'json',
                  beforeSend: function (xhr) {
                  xhr.setRequestHeader('token', token);
              },
                  success: function(data) {
                    console.log(data);
                    if(data.resultCode==0){
                      var res = data.data;
                        $(".pre-main .thumbPic-img").attr("src",res.thumbPic);
                        if(res.freight == 0){
                        	$(".pre-main .goodsName").html("<span>包邮</span>"+res.goodsName);
                        }else{
                        	$(".pre-main .goodsName").text(res.goodsName);
                        }
                        
                        $(".pre-main .remark").text(res.remark);
                        if(res.returnPoint==undefined||res.returnPoint==null){
                        $(".pre-main .returnPoint").text(0);
                      }else{
                        $(".pre-main .returnPoint").text(res.returnPoint);
                      }

                        $(".pre-main .marketPrice").text("￥"+(res.goodsSkuList[0].marketPrice)/100+"市场价");
                        $(".pre-main .normalPrice").text("￥"+(res.goodsSkuList[0].normalPrice)/100+"优惠价");
                        $(".pre-main .vipPrice").text("￥"+(res.goodsSkuList[0].vipPrice)/100);
                        $(".pre-main .saleStock").text(res.goodsSkuList[0].saleStock);
                            
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
          ,yes: function(){
              layer.closeAll();
          }
        });  

    })

    //判断是否可以修改商品
    function isEditGoods(goodsId){
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/judgeUpdateGoods?goodsId='+goodsId,
          contentType: "application/json",
          //data:"goodsId="+goodsId,
          dataType: 'json',
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            console.log(data);
            if(data.resultCode==0){
              var res = data.data;
              $("#iframe", window.parent.document).attr({"src":'goods/goodsAdd.html?editType=1&rmd='+Math.random(),"goodsid":goodsId,"judgeUpdate":res.judgeUpdate});
                    
                    
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

  

    //执行一个laydate实例
    var startDate = laydate.render({
      elem: '#goods_start', //指定元素
      type: 'datetime',
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
      },
      ready: function(date){
      //初始化默认时间分为23：59：59
        // this.dateTime.hours = 23;
        // this.dateTime.minutes = 59;
        // this.dateTime.seconds = 59;
      }
    });
    //执行一个laydate实例
    var endDate = laydate.render({
      elem: '#goods_end', //指定元素
      type: 'datetime',
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
      },
      ready: function(date){
      //初始化默认时间分为23：59：59
        this.dateTime.hours = 23;
        this.dateTime.minutes = 59;
        this.dateTime.seconds = 59;
      }
    });

    
    

    //获取商品列表
    function getGoodsList(curPage,initPage){
      var goodsName = $("#goods_name").val();
      var startTime = $("#goods_start").val();
      var endTime = $("#goods_end").val();
      var goodsType = $("#goods_type").val();
      var goodsIsNull = $("#goods_isnull").val();
      var params = {
          "endTime": endTime,
          "goodsName": goodsName,
          "pageNo": curPage,
          "startTime": startTime,
          "status": goodsType
        }

      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/getGoodsList',
          contentType: "application/json",
          data:JSON.stringify(params),
          dataType: 'json',
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            if(data.resultCode==0){
              var html =''
              var res = data.data.data;
              console.log(res);
			  
              if(res){
                for(var i=0;i<res.length;i++){
                  var g_status = ""
                    if(res[i].status==0){
                      g_status="待上架"
                    }
                    else if(res[i].status==1){
                      g_status="上架过"
                    }
                    html += '<tr goodsid = "'+res[i].id+'"><td>'+(i+1)+'</td><td>'+res[i].goodsName+'</td>'+
                            '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
                            var attrname1 ="";
                            var price ="";
                            var stock ="";
							var marketPrice ="";
							var costPrice ="";
							var sales = '';
                            if(res[i].goodsSkuList != null){
                              for(var j = 0;j<res[i].goodsSkuList.length;j++){
                                attrname1 +='<div>'+res[i].goodsSkuList[j].attrName+'</div>'
                                price+='<div>￥'+(res[i].goodsSkuList[j].vipPrice/100).toFixed(2)+'/'+(res[i].goodsSkuList[j].normalPrice/100).toFixed(2)+'</div>'
                                stock+='<div>'+res[i].goodsSkuList[j].saleStock+'/'+res[i].goodsSkuList[j].stock+'</div>'
								marketPrice +='<div>￥'+(res[i].goodsSkuList[j].marketPrice/100).toFixed(2)+'</div>'
								costPrice +='<div>￥'+(res[i].goodsSkuList[j].costPrice/100).toFixed(2)+'</div>'
								sales += '<div>实际'+(res[i].goodsSkuList[j].saleStock==null?"0":res[i].goodsSkuList[j].saleStock)+'，总'+(res[i].goodsSkuList[j].salesTotal==null?"0":res[i].goodsSkuList[j].salesTotal)+'</div>';
                              }
                            }
                           
                           html += '<td>'+attrname1+'</td><td>'+price+'</td><td>'+marketPrice+'</td><td>'+costPrice+'</td><td>'+stock+'</td>'


                        html += '<td>'+res[i].createsTime+'</td><td>'+sales+'</td><td>'+g_status+'</td>'+
                            '<td style="white-space: nowrap;">'+
                            '<button class="layui-btn layui-btn-normal goods-edit">修改</button>'+
                            // '<button class="layui-btn preview-btn">预览</button>'+
                            '</td>'+
                            '</tr>'
                }
                $("#goodsListData").html(html);
                var total = data.data.total;
                  if(total>20){
                      if(initPage){page(total);$("#pageList").show();};
                  }else{
                      $("#pageList").hide();
                  }
              }else{
                html+='<tr><td colspan="12" class="layui-td-nodata"></td></tr>'
                    $("#goodsListData").html(html);
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

    //导出商品列表
    function exportGoodsList(curPage){
      var goodsName = $("#goods_name").val();
      var startTime = $("#goods_start").val();
      var endTime = $("#goods_end").val();
      var goodsType = $("#goods_type").val();
      var goodsIsNull = $("#goods_isnull").val();
      var params = {
          "endTime": endTime,
          "goodsName": goodsName,
          "pageNo": curPage,
          "startTime": startTime,
          "status": goodsType
        }

      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/exportGoodsList',
          contentType: "application/json",
          data:JSON.stringify(params),
          dataType: 'json',
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
            getGoodsList(obj.curr,false);
          	$(window).scrollTop(0);
          }
        }
     });
    }




});
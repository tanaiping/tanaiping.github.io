layui.use(['jquery','element','layer','form','laydate','laypage','upload'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage
    ,upload = layui.upload
    ,laydate = layui.laydate;

    
    //执行一个laydate实例
    laydate.render({
      elem: '#creat_time', //指定元素
      type: 'date',
      trigger: 'click', //触发事件
      istime: true, //是否开启时间选择
      isclear: true, //是否显示清空
      istoday: true, //是否显示今天
      issure: true, //是否显示确认
      min: '1990-01-01', //设定最小日期为当前日期  
      max: '2900-01-01', //最大日期 laydate.now(-1)
      ready: function(date){
      //初始化默认时间分为23：59：59
        this.dateTime.hours = 23;
        this.dateTime.minutes = 59;
        this.dateTime.seconds = 59;
      }
    });

    //导入权益
    // upload.render({ //允许上传的文件后缀
    //   elem: '#upload_file'
    //   ,url: basePath+'/sys/coupon/import'
    //   ,headers: {token: token}
    //   ,accept: 'file' //普通文件
    //   ,exts: 'txt' //只允许上传压缩文件
    //   ,size: 2048  //kb
    //   ,before: function(obj){ 
    //     this.data={'bisId':userId};
    //   }
    //   ,done: function(data){
    //     if(data.resultCode==0){
    //       clearInterval(interResult);
    //       fileId = data.data.fileId;
    //       interResult = setInterval(function(){getResult(fileId,1)},500);
    //     }else if(data.resultCode==3){
    //         localStorage.removeItem('role');
    //         localStorage.removeItem('token');
    //         top.location.href="/cms/login.html?rdm="+Math.random();
    //     }else{
    //       layer.msg(data.resultMsg, {icon: 5});
    //     }
    //   }
    // });
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
        layer.confirm(take_txt+'该商品后，客户端'+isflg+'展示了哦~',{
            title:"提示",
            btn: ['取消','确定'] //按钮
          }, function(){
            layer.closeAll();
          }, function(){
            //下架  上架回调
            takeOff(_this);
          });
    })

    //预览
    $(document).on('click','.legal-preview',function(){
       // var _this  = this;
       //  var take_txt = $(this).text();
       var isflg ="会";
       if(take_txt == "上架"){
          isflg = "会";
       }else{
        isflg = "不";
       }
        layer.confirm(take_txt+'该商品后，客户端'+isflg+'展示了哦~',{
            title:"提示",
            btn: ['取消','确定'] //按钮
          }, function(){
            layer.closeAll();
          }, function(){
            //下架  上架回调
            takeOff(_this);
          });
    })

    

    //修改
    $(document).on('click','.legal-edit',function(){
      var legalid = $(this).parents("tr").attr("legalid");
      localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
      $("#iframe", window.parent.document).attr({"src":'legal/legalEdit.html?editType=1&ram'+Math.random(),"legalid":legalid});
      return false;
    });

    //初始化权益列表
    initLegalList(1,true);

    //监听列表查询
    form.on('submit(searchLegalList)', function(data){
        initLegalList(1,true);
        return false;
    });
    //监听列表导出
    form.on('submit(exportLegalList)', function(data){
        exportLegalList(1);
        return false;
    });
	
	//导入第三方权益
	$("#importLegal").click(function(){
    layer.confirm('确定导入？',{
            title:"提示",
            btn: ['取消','确定'] //按钮
          }, function(){
            layer.closeAll()
          }, function(){
            $.ajax({
                  type: "get",
                  url: basePath+'/sys/xPrime/package/list.ajax',
                  contentType: "application/json",
                  dataType: 'json',
                  // data:JSON.stringify({"appid":"1575430558982","sign":"201912","timestamp":"123456"}),
                  beforeSend: function (xhr) {
                     xhr.setRequestHeader('token', token);
                  },
                  success: function(data) {
                    if(data.resultCode==0){
                      // top.location.href=data.data;
                  $("#iframe", window.parent.document).attr("src","legal/legalList.html?rdm="+Math.random());
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

		
		return false;
	})
    

    function initLegalList(curPage,initPage){
      var bisName = $("#bis_name").val();
      var createTime = $("#creat_time").val();
      var rightName = $("#legal_name").val();
      var statue = $("#legal_type .layui-this").attr('lay-value');

      var params = {
            "bisName": bisName,
            "createTime": createTime,
            "pageNo": curPage,
            "rightName": rightName,
            "statue": statue
          }
          console.log(params);
          // return false;
      $.ajax({
            type: "post",
            url: basePath+'/sys/right/getMrightlist',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
				console.log(data);
              if(data.resultCode==0){
                var res =data.data;
                  if(res.data!=null&&res.data.length!=0){
                    var html='';
                    for(var i=0;i<res.data.length;i++){
                      var l_status = "";
                        if(res.data[i].statue == 0){
                          l_status = "待完善";
                        }else if(res.data[i].statue ==1){
                          l_status = "上架";
                        }else if(res.data[i].statue ==2){
                          l_status = "下架";
                        }else if(res.data[i].statue ==3){
                          l_status = "售空";
                        }
                        html += '<tr legalid="'+res.data[i].id+'" statue="'+res.data[i].statue+'"><td>'+(i+1)+'</td><td>'+res.data[i].rightName+'</td>'+
                                '<td><img src="'+res.data[i].rightLogo+'" alt="" style="height: 60px;"></td>'+
                                '<td>'+res.data[i].createTime+'</td>'+
                                '<td>'+res.data[i].price+'</td>'+
                                '<td>'+res.data[i].bisName+'</td>'+
                                '<td>'+res.data[i].assign+'</td>'+
                                '<td>'+l_status+'</td><td>'
                                if(res.data[i].statue == 1){
                                      html += '<button class="layui-btn layui-btn-primary takeoff-btn">下架</button>'
                                }else if(res.data[i].statue == 2||res.data[i].statue == 0){
                                      html += '<button class="layui-btn layui-btn-danger takeoff-btn">上架</button>'
                                }
                                html += '<button class="layui-btn layui-btn-normal legal-edit">修改</button>'+
//                                 '<button class="layui-btn layui-btn-danger preview-btn">预览</button>'+
                                '</td></tr>'

                    }

                    $("#legalListData").html(html);
                    var total = data.data.total;
                    if(total>20){
                              if(initPage){page(total);$("#pageList").show();};
                          }else{
                              $("#pageList").hide();
                          }
                  }else{
                        html+='<tr><td colspan="9" class="layui-td-nodata"></td></tr>'
                        $("#legalListData").html(html);
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

    function exportLegalList(curPage){
      var bisName = $("#bis_name").val();
      var createTime = $("#creat_time").val();
      var rightName = $("#legal_name").val();
      var statue = $("#legal_type .layui-this").attr('lay-value');

      var params = {
            "bisName": bisName,
            "createTime": createTime,
            "pageNo": curPage,
            "rightName": rightName,
            "statue": statue
          }
      $.ajax({
            type: "post",
            url: basePath+'/sys/right/exportMrightList',
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
            initLegalList(obj.curr,false);
            $(window).scrollTop(0);
          }
        }
     });
    }

    function takeOff(obj){
      var legalid = $(obj).parents("tr").attr("legalid");
      var statue = $(obj).parents("tr").attr("statue");
      //上架下架状态切换  告诉后台应该要进行上架 or下架操作
      if(statue ==1){
        statue = 2;
      }else{
         statue = 1;
      }
      var params = {
        "id":legalid,
        "statue":statue,
      }
      $.ajax({
            type: "post",
            url: basePath+'/sys/right/mRightStatue',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              console.log(data);
              if(data.resultCode==0){
                window.location.href='legalList.html?'+Math.random();
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


	$(document).on('click','.preview-btn',function(){
      var legalId = $(this).parents("tr").attr("legalid")
      layer.open({
          type:1
          ,title: "预览"
          ,content: $('#previewWrap')
          ,area: ['375px', '500px'] //宽高
          ,btn: ['确定'] //只是为了演示
          ,success:function(){
              $.ajax({
                  type: "get",
                  url: basePath+'/sys/right/getMrightInfo?id='+legalId,
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
                        $(".pre-main .legal-img").attr("src",res.rightLogo);
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

});
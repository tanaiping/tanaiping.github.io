layui.use(['jquery','element','layer','form','laydate','laypage'], function(){
  var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laypage = layui.laypage; 

    var total = 0;
    var select_url = "";// 跳转 商品 卡券的请求接口
    var pop_title = "" //弹窗的标题
    var type = 1; //1 代表兑换专区的  2 代表限时抢购的  3 热门推荐
    var goodstype =0  //  默认0     商品==1     卡券==2

    $("#select_wrap").on("click","input[type='checkbox']",function(e){
      e.stopPropagation();
    })

    $("#select_wrap").on("click","tr",function(){
      var thisobj = $(this).find("input");
      if(!thisobj.is(":checked")){
        thisobj.prop("checked", true)
      }
    })
    $(document).keydown(function(event){
    　　if(event.keyCode==13){
    　　if(goodstype ==1){
            initGoodsSearch(1,true,select_url);
          }else if(goodstype ==2){
            initCouponSearch(1,true,select_url);
          }
          return false;
    　　}
    });
    
    //搜索
    form.on('submit(searchselect)', function(data){
      if(goodstype ==1){
        initGoodsSearch(1,true,select_url);
      }else if(goodstype ==2){
        initCouponSearch(1,true,select_url);
      }
      
      return false;
    });

    //选择商品 兑换专区
    $(document).on('click','.selectCommodity_e',function(){
      $(".goods-name-select").val("");
      pop_title="选择商品";
      goodstype = 1;
      select_url = '/sys/activity/getJoinActivityGoodsList';
      initGoodsList(1,true,"/sys/activity/getJoinActivityGoodsList",1);
              return false;
    })

    //选择卡券 兑换专区
    $(document).on('click','.selectCoupon_e',function(){
      $(".goods-name-select").val("");
      pop_title="选择卡券";
      goodstype = 2;
      select_url = '/sys/activity/getJoinActivityCouponList';
        initCouponList(1,true,"/sys/activity/getJoinActivityCouponList",1);
              return false;
    })

    //选择商品 限时抢购
    $(document).on('click','.selectCommodity_s',function(){
      $(".goods-name-select").val("");
      pop_title="选择商品";
      goodstype = 1;
      select_url = '/sys/activity/getJoinActivityGoodsList';
      initGoodsList(1,true,"/sys/activity/getJoinActivityGoodsList",2);
              return false;
    })

    //选择卡券 限时抢购
    $(document).on('click','.selectCoupon_s',function(){
      $(".goods-name-select").val("");
      pop_title="选择卡券";
      goodstype = 2;
      select_url = '/sys/activity/getJoinActivityCouponList';
        initCouponList(1,true,"/sys/activity/getJoinActivityCouponList",2);
              return false;
    })

    //选择商品 热门推荐
    $(document).on('click','.selectCommodity_h',function(){
      $(".goods-name-select").val("");
      pop_title="选择商品";
      goodstype = 1;
      select_url = '/sys/activity/getJoinActivityGoodsList';
      initGoodsList(1,true,"/sys/activity/getJoinActivityGoodsList",3);
              return false;
    })

    //选择卡券 热门推荐
    $(document).on('click','.selectCoupon_h',function(){
      $(".goods-name-select").val("");
      pop_title="选择卡券";
      goodstype = 2;
      select_url = '/sys/activity/getJoinActivityCouponList';
        initCouponList(1,true,"/sys/activity/getJoinActivityCouponList",3);
              return false;
    })

    function initGoodsSearch(curPage,initPage,url){
      console.log(curPage);
        var params = {
              "goodsName":$(".goods-name-select").val(),
              "pageNo": curPage
            }
          $.ajax({
          type: "post",
          url: basePath+url,
          contentType: "application/json",
          data:JSON.stringify(params),
          dataType: 'json',
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            console.log(data);
            $("#select_wrap").show();
            $(".spec-th").show();
            // $("#pageLists").remove();
            if(data.resultCode==0){
              var res = data.data.data;
              console.log(res);
              var html ='';
              if(res!=null){
                for(var i=0;i<res.length;i++){
                  html+=
                  '<tr goodsid = "'+res[i].id+'"><td><input type="radio" name="commodity" title=""></td>'+
                '<td>'+(i+1)+'</td><td>'+res[i].goodsName+'</td>'+
                '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
                var attrname1 ="";
                  var price ="";
                  if(res[i].goodsSkuList != null){
                    for(var j = 0;j<res[i].goodsSkuList.length;j++){
                      attrname1 +='<div>'+res[i].goodsSkuList[j].attrName+'</div>'
                      price+='<div>￥'+(res[i].goodsSkuList[j].vipPrice)/100+'/'+(res[i].goodsSkuList[j].normalPrice)/100+'</div>'
                    }
                  }
                 
                 html += '<td>'+attrname1+'</td>'+
                      '<td>'+price+'</td></tr>'
                total = data.data.total;
                }
                $("#select_box").html(html);
              }else{
                html+='<tr><td colspan="6" class="layui-td-nodata" style="height:200px;"></td></tr>'
                $("#select_box").html(html);

              }
              if(total>20){
                if(initPage){
                  laypage.render({
                   elem: pageLists //注意，这里的 test1 是 ID，不用加 # 号
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
                        initGoodsSearch(obj.curr,false,select_url);
                        $(window).scrollTop(0);
                      }
                    }
                  });
              }
              }else{
              	$("#pageLists").empty();
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

    function initCouponSearch(curPage,initPage,url){
      console.log(curPage);
        var params = {
              "goodsName":$(".goods-name-select").val(),
              "pageNo": curPage
            }
          $.ajax({
          type: "post",
          url: basePath+url,
          contentType: "application/json",
          data:JSON.stringify(params),
          dataType: 'json',
          beforeSend: function (xhr) {
          xhr.setRequestHeader('token', token);
      },
          success: function(data) {
            console.log(data);
            $("#select_wrap").show();
            $(".spec-th").hide();
            // $("#pageLists").remove();
            if(data.resultCode==0){
              var res = data.data.data;
              console.log(res);
              var html ='';
              if(res!=null){
                for(var i=0;i<res.length;i++){
                  html+=
                  '<tr goodsid = "'+res[i].id+'"><td><input type="radio" name="commodity" title=""></td>'+
                '<td>'+(i+1)+'</td><td>'+res[i].goodsName+'</td>'+
                '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
                  var price ="";
                      price+='<div>￥'+(res[i].vipPrice)/100+'/'+(res[i].normalPrice)/100+'</div>'
                 
                 html += '<td>'+price+'</td>'
                total = data.data.total;
                }
                $("#select_box").html(html);
              }else{
                html+='<tr><td colspan="5" class="layui-td-nodata" style="height:200px;"></td></tr>'
                $("#select_box").html(html);

              }
              if(total>20){

                if(initPage){
                  laypage.render({
                   elem: pageLists //注意，这里的 test1 是 ID，不用加 # 号
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
                        initCouponSearch(obj.curr,false,select_url);
                        $(window).scrollTop(0);
                      }
                    }
                  });
              }
              }else{
              	$("#pageLists").empty();
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

    function initGoodsList(curPage,initPage,url,type){
      var params = {
            "goodsName":$(".goods-name-select").val(),
            "pageNo": curPage
          }
        $.ajax({
        type: "post",
        url: basePath+url,
        contentType: "application/json",
        data:JSON.stringify(params),
        dataType: 'json',
        beforeSend: function (xhr) {
        xhr.setRequestHeader('token', token);
    },
        success: function(data) {
          console.log(data);
          if(data.resultCode==0){
            $(".spec-th").show();
            var res = data.data.data;
            console.log(res);
            var html ='';
            if(res!=null){
              for(var i=0;i<res.length;i++){
                html+=
                '<tr goodsid = "'+res[i].id+'"><td><input type="radio" name="commodity" title=""></td>'+
              '<td>'+(i+1)+'</td><td>'+res[i].goodsName+'</td>'+
              '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
              var attrname1 ="";
                var price ="";
                if(res[i].goodsSkuList != null){
                  for(var j = 0;j<res[i].goodsSkuList.length;j++){
                    attrname1 +='<div>'+res[i].goodsSkuList[j].attrName+'</div>'
                    price+='<div>￥'+(res[i].goodsSkuList[j].vipPrice)/100+'/'+(res[i].goodsSkuList[j].normalPrice)/100+'</div>'
                  }
                }
               
               html += '<td>'+attrname1+'</td>'+
                    '<td>'+price+'</td></tr>'
                total = data.data.total;
              }
              
            }else{
              html+='<tr><td colspan="6" class="layui-td-nodata" style="height:200px;"></td></tr>'
                  
            }
            $("#select_box").html(html);


            layer.open({
              type:1
              ,title: pop_title
              ,content: $('#select_wrap')
              ,area: ['800px', '580px'] //宽高
              ,btn: ['取消', '下一步'] //只是为了演示
              ,success:function(){
                $("#select_wrap").show();
                if(total>20){
                  laypage.render({
                   elem: pageLists //注意，这里的 test1 是 ID，不用加 # 号
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
                        initGoodsSearch(obj.curr,false,select_url);
                        $(window).scrollTop(0);
                      }
                    }
                 });
                }else{
	              	$("#pageLists").empty();
	              }
              }
              ,yes: function(){
                  layer.closeAll();
                  $("#select_wrap").hide();
              }
              ,btn2: function(){
                console.log("goods")
                var attrid = '';
                $("#select_box tr").each(function(i){
                  if($(this).find("input").is(':checked')){
                    attrid = $(this).attr("goodsid");
                  }
                });
                if(attrid == ""){
                  layer.msg("您还未勾选", {icon: 5});
                  return false;
                }
                localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
                if(type == 1){//兑换专区
                    $("#iframe",parent.document.body).attr({"src":"activity/exchangeEditCommodity.html?rdm="+Math.random(),"goodsid":attrid,"goodstype":goodstype});
                }else if(type ==2){ //限时购买
                    $("#iframe",parent.document.body).attr({"src":"activity/saleEditCommodity.html?rdm="+Math.random(),"goodsid":attrid,"goodstype":goodstype});
                }else if(type ==3){//热门推荐
                    $("#iframe",parent.document.body).attr({"src":"activity/hotEditCommodity.html?rdm="+Math.random(),"goodsid":attrid,"goodstype":goodstype});
                }
              }
            });   
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

    function initCouponList(curPage,initPage,url,type){
      var params = {
            "goodsName":$(".goods-name-select").val(),
            "pageNo": curPage
          }
        $.ajax({
        type: "post",
        url: basePath+url,
        contentType: "application/json",
        data:JSON.stringify(params),
        dataType: 'json',
        beforeSend: function (xhr) {
        xhr.setRequestHeader('token', token);
    },
        success: function(data) {
          console.log(data);
          if(data.resultCode==0){
            $(".spec-th").hide();
            var res = data.data.data;
            console.log(res);
            var html ='';
            if(res!=null){
              for(var i=0;i<res.length;i++){
                html+=
                '<tr goodsid = "'+res[i].id+'"><td><input type="radio" name="commodity" title=""></td>'+
              '<td>'+(i+1)+'</td><td>'+res[i].goodsName+'</td>'+
              '<td><img src="'+res[i].thumbPic+'" alt="" style="height: 60px;"></td>'
                var price ="";
                    price+='<div>￥'+(res[i].vipPrice)/100+'/'+(res[i].normalPrice)/100+'</div>'
               
               html += '<td>'+price+'</td></tr>'
                total = data.data.total;
              }
              
            }else{
              html+='<tr><td colspan="5" class="layui-td-nodata" style="height:200px;"></td></tr>'
                  
            }
            $("#select_box").html(html);


            layer.open({
              type:1
              ,title: pop_title
              ,content: $('#select_wrap')
              ,area: ['800px', '540px'] //宽高
              ,btn: ['取消', '下一步'] //只是为了演示
              ,success:function(){
                $("#select_wrap").show();
                if(total>20){
                  laypage.render({
                   elem: pageLists //注意，这里的 test1 是 ID，不用加 # 号
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
                        initCouponSearch(obj.curr,false,select_url);
                        $(window).scrollTop(0);
                      }
                    }
                 });
                }else{
	              	$("#pageLists").empty();
	              }
              }
              ,yes: function(){
                  layer.closeAll();
                  $("#select_wrap").hide();
              }
              ,btn2: function(){
                console.log("coupon")
                var attrid = '';
                $("#select_box tr").each(function(i){
                  if($(this).find("input").is(':checked')){
                    attrid = $(this).attr("goodsid");
                  }
                });
                if(attrid == ""){
                  layer.msg("您还未勾选", {icon: 5});
                  return false;
                }
                localStorage.setItem('history_src',$("#iframe", window.parent.document).attr("src"));
                if(type == 1){//兑换专区
                    $("#iframe",parent.document.body).attr({"src":"activity/exchangeEditCoupon.html?rdm="+Math.random(),"couponid":attrid,"goodstype":goodstype});
                }else if(type ==2){ //限时购买
                    $("#iframe",parent.document.body).attr({"src":"activity/saleEditCoupon.html?rdm="+Math.random(),"couponid":attrid,"goodstype":goodstype});
                }else if(type ==3){//热门推荐
                    $("#iframe",parent.document.body).attr({"src":"activity/hotEditCoupon.html?rdm="+Math.random(),"couponid":attrid,"goodstype":goodstype});
                }
              }
            });   
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
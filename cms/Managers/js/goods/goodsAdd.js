layui.use(['jquery','element','layer','form','laydate','upload','layedit'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,upload = layui.upload
    ,layedit = layui.layedit
    ,laydate = layui.laydate;

    var attr_index = $("#attr_index").val();
    var attrlen = 0;//判断属性是否重复
	
	var limitedType = 1; // 1  黑名单  0白名单

    var  ifr_src = "";
    var goodsid ="";
	var judgeUpdate = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      ifr_src = $("#iframe",parent.document.body).attr("src");
      goodsid =$("#iframe",parent.document.body).attr("goodsid");
	  judgeUpdate = $("#iframe",parent.document.body).attr("judgeUpdate");
    }
    
    //限购地区  老的 暂且不用
    //getGoodsLimitRegion();

    //判断是新增 还是修改
    if(ifr_src.indexOf("editType")!= -1){ //修改
      $(".head_title").text("编辑商品");
      setTimeout(function(){editGoodsInfo(goodsid);},300)	  
      
    }else{//新增
      //初始化规格信息  type =1  代表 默认加载第一个规格的属性  type =2  默认不加载属性
	  $("#iframe",parent.document.body).removeAttr("judgeUpdate");
	  judgeUpdate = ""
      getGoodsSpec(0,1);
      //getTypeList();     //一期先不做分类
    }

    //监听保存
    form.on('submit(addGoodsSubmit)', function(data){
      var _this = $(this);
      if(goodsid==""||goodsid==undefined){
        addGoods(_this);
        return false;
      }else{
        editGoods(_this);
        return false;
      }
    });

    //预览
    form.on('submit(goodsPreview)', function(data){
        previewGoods();
        return false;
    });

    //切换规格 
    form.on('select(goodsSpec)', function(data){
      console.log(data.value);
      if(data.value==-1){//选择到  请选择规格
        $(".add-attr-btn").addClass("layui-btn-disabled");
        $(".attr-box").remove();
        creatNewSellInfo();
      }else{

        switchSpec(data.value);
      }
    }); 


  //图片重传
  $(".layui-elem-field").on("click",".reload-img",function(){
      $(this).siblings(".upload-banner").click();
    })

  //图片删除
  $(".layui-elem-field").on("click",".del-img",function(){
      $(this).parents(".shade-wrap").siblings(".upload-source").addClass("default").attr("src","../images/default.png");
      $(this).parents(".com-uploadbox").removeClass("has");
  })

  //删除属性
  $(".layui-elem-field").on("click",".attr-close",function(){
      var index = $(".attr-box").index($(this).parent(".attr-box"));
      $(this).parents(".attr-box").remove();
      if($("#sell_table tr").length==2){
        $("#sell_table").empty();
      }else{
        $("#sell_table tr").eq(index+1).remove();
      }

      form.render();
  })
  //修改属性名称 同步售卖信息
  $(document).on("blur",".attr-name",function(){
    var i  = $(".attr-name").index(this);
    $("#sell_table tr").eq((i+1)).find("td").eq(0).text($(this).val());
    //判断是否属性重复
    var attrNames =[]
      $(".attr-name").each(function(){
        attrNames.push($(this).val());
      })
    for(var i=0;i<attrNames.length;i++) {
      attrlen = 0;
      for(var j=(i+1);j<attrNames.length;j++){
        if(attrNames[i]===attrNames[j]){
          layer.msg("不能输入相同的属性名", {icon: 5});
          // obj.removeClass("disabled")
          return false;
        }
      }
    }
  });



  //删除规则
  $(".del-rule-btn").click(function(){
	  if(!$(this).hasClass("layui-btn-disabled")){
		layer.confirm('是否删除，删除后将不存在？',{
			  title:"删除确认",
			  btn: ['取消','删除'] //按钮
			}, function(){
			  // layer.msg('的确很重要', {icon: 1});
			  layer.closeAll();
			}, function(){
			  $(".attr-box").remove();
	//        var html = '<tr><th>可售库存</th><th>成本价（元）</th><th>市场价（元）</th><th>非会员价（元）</th><th>会员价（元）</th><th>限购（件/人）</th></tr>'+
	//                   '<tr><td><input type="text" class="layui-input"  lay-verify="required|Number" placeholder="可售库存"></td>'+
	//                   '<td><input type="text" class="layui-input"  lay-verify="required|isTwoDecimalsFloat" placeholder="成本价（元）"></td>'+
	//                   '<td><input type="text" class="layui-input"  lay-verify="required|isTwoDecimalsFloat" placeholder="市场价（元）"></td>'+
	//                   '<td><input type="text" class="layui-input"  lay-verify="required|isTwoDecimalsFloat" placeholder="非会员价（元）"></td>'+
	//                   '<td><input type="text" class="layui-input"  lay-verify="required|isTwoDecimalsFloat" placeholder="会员价（元）"></td>'+
	//                   '<td><input type="text" class="layui-input"  placeholder="限购（件/人）"></td></tr>'
				$("#sell_table").html("");
				form.render();
				// creatNewSellInfo();
			});
		}
      return false;
	  
  })

    var editor_detail = layedit.build('goods_detail', { //建立编辑器
        height: 300,
        //uploadImage: { url: basePath + '/sys/editorUpload.ajax', type: 'post' }
    }); 
    var editor_notice = layedit.build('buy_notice', { //建立编辑器
        height: 300,
        //uploadImage: { url: basePath + '/sys/editorUpload.ajax', type: 'post' }
    }); 


   var startDate = laydate.render({
      elem: '#shelves_start', //指定元素
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
      elem: '#shelves_end', //指定元素
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

    //添加属性
    $(".add-attr-btn").click(function(){
      if(!$(this).hasClass("layui-btn-disabled")){
       ++attr_index;
      // if($('#is_add_rule_img').is(':checked')) {
        var spec_html =('<div class="layui-input-inline attr-box" style="width: 300px;">'+
                '<input type="text" class="layui-input attr-name" value="新的属性名'+attr_index+'" maxlength="15"  lay-verify="required" placeholder="请输入商品属性">'+
                '<i class="layui-icon layui-icon-close attr-close"></i>'+
                '<div class=" com-uploadbox banner-uploadbox pr" style="width: 300px;height: 128px;position:relative">'+
                      '<img src="../images/default.png" alt="" class="upload-source default upload-attr-img">'+
                      '<div class="shade-wrap banner-wrap">'+
                        '<div class="pr">'+
                          '<button type="button" class="layui-btn upload-banner" id="upload_attr_img'+attr_index+'">'+
                            '<i class="layui-icon">&#xe67c;</i>单张上传'+
                          '</button>'+
                          '<a href="javascript:;" title="重传" class="reload-img"></a>'+
                          '<a href="javascript:;" title="删除" class="del-img"></a>'+
                        '</div>'+
                      '</div>'+
                  '</div>'+
            '</div>');
          $("#spec-box").append(spec_html);
          

          (function(index){
            setTimeout(function(){
              upload.render({ //允许上传的文件后缀
              elem: '#upload_attr_img'+index
              ,url: basePath+'/sys/upload/img'
              ,headers: {token: token}
              ,accept: 'images' //普通文件
              ,exts: 'jpg|png|gif|bmp|jpeg'
              ,size: 2048  //kb
              ,auto:false
              , choose: function(obj) {
                  obj.preview(function(index, file, result) {
                    var img = new Image();
                    img.onload = function() {
                      console.log('choose poster', img.width, img.height);

                      // obj.upload(index, file);
                      //if ('750' == img.width && '320' == img.height) {
                        obj.upload(index, file);
                      // } else {
                      //   layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
                      // }
                    };
                    img.src = result;
                  });
                }
              ,before: function(obj){ 
                layer.load();
              }
              ,done: function(data){
                layer.closeAll('loading');
                //console.log(data);
                if(data.resultCode==0){
                   $("#upload_attr_img"+index).parents(".banner-wrap").siblings('.upload-attr-img').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
                   $("#upload_attr_img"+index).parents(".banner-uploadbox").addClass("has");
                }else if(data.resultCode==3){
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    top.location.href="/cms/login.html?"+Math.random();
                }else{
                  layer.closeAll('loading');
                  // layer.alert('上传失败，请重试！');
                  layer.msg(data.resultMsg, {icon: 5});
                }
              }
            });
            },100);
            

          }(attr_index));
        // creatNewSellInfo();

          var html ='';
          var ruleName = $("#goods_spec .layui-this").text();
          var len = $(".attr-name").length;
          var goodsName = $(".attr-name").eq(len-1).val();
          var html ='';
          var thStr = '<th>可售库存</th><th>成本价（元）</th><th>市场价（元）</th><th>非会员价（元）</th><th>会员价（元）</th><th>限购（件/人）</th>'
          var tdStr = '<td><input type="text" class="layui-input stock"  lay-verify="required|Number" placeholder="可售库存"></td>'+
                    '<td><input type="text" class="layui-input costPrice"  lay-verify="required|isTwoDecimalsFloat" placeholder="成本价（元）"></td>'+
                    '<td><input type="text" class="layui-input marketPrice"  lay-verify="required|isTwoDecimalsFloat" placeholder="市场价（元）"></td>'+
                    '<td><input type="text" class="layui-input normalPrice"  lay-verify="required|isTwoDecimalsFloat" placeholder="非会员价（元）"></td>'+
                    '<td><input type="text" class="layui-input vipPrice"  lay-verify="required|isTwoDecimalsFloat" placeholder="会员价（元）"></td>'+
                    '<td><input type="text" class="layui-input limitCnt"  placeholder="限购（件/人）"></td>'
          if($("#sell_table tr").length>=2){
            html += '<tr><td>'+goodsName+'</td>'+tdStr+'</tr>'; 
          }else{
            html += '<tr><th>'+ruleName+'</th>'+thStr+'</tr>';
            html += '<tr><td>'+goodsName+'</td>'+tdStr+'</tr>'; 
          }
            $("#sell_table").append(html);
        form.render();
      }
      return false;
    })


    //卡券分类列表
    function getTypeList(){
      $.ajax({
            type: "post",
            url: basePath+'/sys/goods/getGoodsCategory',
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              // console.log(data);
              if(data.resultCode==0){
                var html='';
                if(data.data.length>0){
                  for(var i=0;i<data.data.length;i++){
                      html+='<input type="checkbox" name="tagNames" value="'+data.data[i].id+'" title='+data.data[i].tagName+'  style="width:150px;margin-bottom:10px;">'
                      html+='<option value="'+data.data[i].cateId+'" parentId ="'+data.data[i].parentId+'">'+data.data[i].cateName+'</option>'
                  }
                  $("#goods_type1").html(html);
                  form.render();//动态添加  重新渲染
                  // element.init();
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

    //是否返花花币
    form.on('checkbox(isfb)', function(data){
      console.log(data.elem.checked); //是否被选中，true或者false
      console.log(data.value); //复选框value值，也可以通过data.elem.value得到
      if(data.elem.checked){
        $("#back_currency").removeAttr("readonly").attr("lay-verify","required|Number");
      }else{
        $("#back_currency").attr("readonly",true).removeAttr("lay-verify");
      }
    }); 

    //是否上架
    form.on('radio(goodsType)', function(data){
      console.log(data.elem.checked); //是否被选中，true或者false
      console.log(data.value); //复选框value值，也可以通过data.elem.value得到
      if(data.value == 0){
        $("#isfb").hide();
        $(".shelves-box").hide();
        $("#back_currency,#shelves_start,#shelves_end").removeAttr("lay-verify");
      }else{
        $("#isfb").show();
        $(".shelves-box").show();
        $("#shelves_start,#shelves_end").attr("lay-verify","required");
      }
    }); 
	
	//是否选中黑白名单
	form.on('radio(limitedType)', function(data){
	  console.log(data.elem.checked); //是否被选中，true或者false
	  console.log(data.value); //复选框value值，也可以通过data.elem.value得到
	  limitedType = data.value
	}); 
	
	//选择区域
	$("#selectArea").click(function(){
		var popTitle = "选择不可购买的区域"
		if(limitedType == 1){
			popTitle = "选择不可购买的区域"
		}else{
			popTitle = "选择可购买的区域"
		}
		checkLimitedArea(popTitle)
	})

    

    function editGoodsInfo(goodsId){
      $.ajax({
          type: "post",
          url: basePath+'/sys/goods/getGoodsDetail?goodsId='+goodsId,
          contentType: "application/json",
          dataType: 'json',
          // data:JSON.stringify(params),
          beforeSend: function (xhr) {
             xhr.setRequestHeader('token', token);
          },
          success: function(data) {
            console.log(data);
            if(data.resultCode==0){
              var res = data.data;
              $("#goods_name").val(res.goodsName);
              $("#goods_sell_point").val(res.remark);
              $("#goodsSupplier").val(res.goodsSupplier);
				              
              $(".upload-thumbnail-img").attr("src",res.thumbPic).removeClass("default").parents(".banner-uploadbox").addClass("has");

              $(".add-attr-btn").removeClass("layui-btn-disabled");
              layedit.setContent(editor_detail,res.goodsDesc);
              layedit.setContent(editor_notice,res.buyNotes);
              var bannerPic = res.bannerPic;
              bannerPic = bannerPic.split(",");
              for(var i = 0;i<bannerPic.length;i++){
                $(".upload-banner-img").eq(i).attr("src",bannerPic[i]).removeClass("default").parents(".banner-uploadbox").addClass("has");
              }
              $("#freight_price").val((res.freight)/100);
              if(res.status == 0){
                $("#goodsStatus").append('<div class="layui-input-inline">'+
          '<label class="layui-form-label" style="text-align: left;width: auto">否</label>'+
        '</div>');
              }else{
               $("#goodsStatus").append('<div class="layui-input-inline">'+
          '<label class="layui-form-label" style="text-align: left;width: auto">是</label>'+
        '</div>');
              }


              var spec_html = '';
              var specid = '';
              for(var j=0;j<res.goodsSkuList.length;j++){
                ++attr_index;
                // if($('#is_add_rule_img').is(':checked')) {
                  spec_html +='<div class="layui-input-inline attr-box" style="width: 300px;">'+
                          '<input type="text" class="layui-input attr-name"   lay-verify="required" maxlength="15" skuid = "'+ res.goodsSkuList[j].skuId+'" attr_id = "'+ res.goodsSkuList[j].attrId+'" value="'+ res.goodsSkuList[j].attrName+'" disabled>'+
                          '<i class="layui-icon layui-icon-close attr-close"></i>'+
                          '<div class=" com-uploadbox banner-uploadbox pr" style="width: 300px;height: 128px;position:relative">'+
                                '<img src="../images/default.png" alt="" class="upload-source default upload-attr-img">'+
                                '<div class="shade-wrap banner-wrap">'+
                                  '<div class="pr">'+
                                    '<button type="button" class="layui-btn upload-banner" id="upload_attr_img'+attr_index+'">'+
                                      '<i class="layui-icon">&#xe67c;</i>单张上传'+
                                    '</button>'+
                                    '<a href="javascript:;" title="重传" class="reload-img"></a>'+
                                    '<a href="javascript:;" title="删除" class="del-img"></a>'+
                                  '</div>'+
                                '</div>'+
                            '</div>'+
                      '</div>';
                    $("#spec-box").html(spec_html);
                    console.log(res.goodsSkuList[j])
                    specid = res.goodsSkuList[j].specId;

                    (function(index){
                      setTimeout(function(){
                        upload.render({ //允许上传的文件后缀
                        elem: '#upload_attr_img'+index
                        ,url: basePath+'/sys/upload/img'
                        ,headers: {token: token}
                        ,accept: 'images' //普通文件
                        ,exts: 'jpg|png|gif|bmp|jpeg'
                        ,size: 2048  //kb
                        ,auto:false
                        , choose: function(obj) {
                            obj.preview(function(index, file, result) {
                              var img = new Image();
                              img.onload = function() {
                                console.log('choose poster', img.width, img.height);

                                // obj.upload(index, file);
                                //if ('750' == img.width && '320' == img.height) {
                                  obj.upload(index, file);
                                // } else {
                                //   layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
                                // }
                              };
                              img.src = result;
                            });
                          }
                        ,before: function(obj){ 
                          layer.load();
                        }
                        ,done: function(data){
                          layer.closeAll('loading');
                          //console.log(data);
                          if(data.resultCode==0){
                             $("#upload_attr_img"+index).parents(".banner-wrap").siblings('.upload-attr-img').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
                             $("#upload_attr_img"+index).parents(".banner-uploadbox").addClass("has");
                          }else if(data.resultCode==3){
                              localStorage.removeItem('role');
                              localStorage.removeItem('token');
                              top.location.href="/cms/login.html?"+Math.random();
                          }else{
                            layer.closeAll('loading');
                            // layer.alert('上传失败，请重试！');
                            layer.msg(data.resultMsg, {icon: 5});
                          }
                        }
                      });
                      },100);
                      

                    }(attr_index));
                }
                getGoodsSpec(specid,2);


                creatNewSellInfo();

                for(var i=1;i<$("#sell_table tr").length;i++){
                  var _this = $("#sell_table tr").eq(i);
                  if(res.goodsSkuList[i-1].attrPic!=""){
                    $(".upload-attr-img").eq(i-1).attr("src",res.goodsSkuList[i-1].attrPic).removeClass("default").parents(".banner-uploadbox").addClass("has");
                  }
                  
                  _this.find(".costPrice").val((res.goodsSkuList[i-1].costPrice)/100);
                  _this.find(".marketPrice").val((res.goodsSkuList[i-1].marketPrice)/100);
                  _this.find(".normalPrice").val((res.goodsSkuList[i-1].normalPrice)/100);
                  _this.find(".vipPrice").val((res.goodsSkuList[i-1].vipPrice)/100);
                  _this.find(".limitCnt").val(res.goodsSkuList[i-1].limitCnt);
                  if(res.goodsSkuList[i-1].limitCnt == 0){
                     _this.find(".limitCnt").val("");
                  }else{
                  _this.find(".limitCnt").val(res.goodsSkuList[i-1].limitCnt);
                  }
                  _this.find(".stock").val(res.goodsSkuList[i-1].stock);
                  
                }




              $(".status-type").remove();// 编辑的时候 状态隐藏
              $(".shelves-box").remove();// 编辑的时候 时间 隐藏
              $("#isfb").remove();  //编辑的时候 是否返还花花币 隐藏
              if(res.isRegionLimit == 0){
                $("#limited").html('<input type="checkbox" name="limited" value="0"  title="地区限制">您可以设置此商品的地域购买限制，地区限制根据用户ip判断，实物会额外在下单时根据收货地址做限制')
              }else{
                $("#limited").html('<input type="checkbox" name="limited" value="0" checked  title="地区限制">您可以设置此商品的地域购买限制，地区限制根据用户ip判断，实物会额外在下单时根据收货地址做限制')
              }
			  limitedType = res.isBlack;
			  if(res.isBlack == 1){
			    $("#limitedType").html('<input type="radio" name="limit-roster" value="1" checked title="黑名单" lay-filter="limitedType">'+
				  '<input type="radio" name="limit-roster" value="0" title="白名单" lay-filter="limitedType">')
			  }else{
			    $("#limitedType").html('<input type="radio" name="limit-roster" value="1" title="黑名单" lay-filter="limitedType">'+
			      '<input type="radio" name="limit-roster" value="0" title="白名单" checked lay-filter="limitedType">')
			  }
			  $("#limited_input").attr("cityjson",res.blackJson);
			  var blackJson = '';
			  if(res.blackJson !=""&&res.blackJson !=null){
				  var blackJson = eval("("+ res.blackJson +")");
				  var blackJsonStr = '';
				  for(var i = 0;i<blackJson.length;i++){
				  				  if(i == blackJson.length-1){
				  					  blackJsonStr += blackJson[i].regionName;
				  				  }else{
				  					  blackJsonStr += blackJson[i].regionName+",";
				  				  }
				  }
			  }
			  
			  $("#limited_input").val(blackJsonStr);
              form.render();
			  if(judgeUpdate != 1&&judgeUpdate != ""){
			  		 $(".attr-close").hide();
			  		 $("#sell_table input,#freight_price").attr("disabled",true).css("background","#e6e6e6");
					 $(".attr-name").css("background","#e6e6e6");
					 $(".del-rule-btn,.add-attr-btn").addClass("layui-btn-disabled");
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
  


    //添加商品
    function addGoods(obj){
    	// var cateId =  $("#goods_type1 .layui-this").attr('lay-value');
          var goodsName = $("#goods_name").val();
          var remark = $("#goods_sell_point").val();
          var thumbPic = '';
          if($(".upload-thumbnail-img").hasClass('default')){
              layer.msg("请上传缩略图", {icon: 5});
              return false;
            }else{
              thumbPic = $(".upload-thumbnail-img").attr("src");
            }
          var goodsDesc = layedit.getContent(editor_detail);
          var buyNotes = layedit.getContent(editor_notice);
          var bannerPic = [];
          //遍历两个logo图
          $(".upload-banner-img").each(function(){
              if(!$(this).hasClass("default")){
                var logo = $(this).attr("src");
                bannerPic.push(logo);
              }
          })
          if(bannerPic.length==0){
            layer.msg("请上传轮播顶图", {icon: 5});
            return false;
          }
          var freight = $("#freight_price").val()*100;
          var status = "";
          var startTime = $("#shelves_start").val();
          var endTime = $("#shelves_end").val();
          var isRegionLimit = 0;
          if($('[name="limited"]').is(':checked')){
            isRegionLimit =1;
          }
          var returnPoint = $("#back_currency").val()
          if($("#goodsStatus .layui-form-radio").eq(0).hasClass('layui-form-radioed')){
              status=0;
              startTime = "";
              endTime = "";
              returnPoint = "";
              
            }else{
              status=1;
            }

          //规格id
          var specId  = $("#goods_spec .layui-this").attr('lay-value');
          if(specId == -1){
            layer.msg("请选择规格", {icon: 5});
            obj.removeClass("disabled");
            return false;
          }
          var goodsSkuList =[];
          if($("#sell_table tr").length<2){
            layer.msg("请至少添加一个属性", {icon: 5});
            obj.removeClass("disabled");
            return false;
          }
          for(var i=1;i<$("#sell_table tr").length;i++){
            var _this = $("#sell_table tr").eq(i);

            var attrPic = "";
            if($(".upload-attr-img").eq(i-1).hasClass('default')){
              }else{
                attrPic = $(".upload-attr-img").eq(i-1).attr("src");
              }
            var attrId = $(".attr-name").eq(i-1).attr("attrid");
            var attrName = $(".attr-name").eq(i-1).val();
            if(attrId == undefined){
              attrId = "";
            }
            var costPrice = Math.round(_this.find(".costPrice").val()*100);
            var marketPrice = Math.round(_this.find(".marketPrice").val()*100);
            var normalPrice = Math.round(_this.find(".normalPrice").val()*100);
            var vipPrice = Math.round(_this.find(".vipPrice").val()*100);
            var limitCnt = _this.find(".limitCnt").val();
            var stock = _this.find(".stock").val();
            goodsid==undefined?"":goodsid;
			var blackJson = $("#limited_input").attr("cityjson");//黑白名单的json字符串
			if(isRegionLimit == 1){
				if(blackJson == ""||blackJson == null){
					layer.msg("请至少选择一个限制区域", {icon: 5});
					return false;
				}
			}
          
               var objs =  {
                "attrId": attrId,
                "goodsId": goodsid,
                "specId":specId,
                "attrName":attrName,
                // "saleStock": 2,
                "stock":stock,
                "attrPic":attrPic,
                "costPrice":costPrice,
                "vipPrice":vipPrice,
                "normalPrice":normalPrice,
                "marketPrice":marketPrice,
                "limitCnt":limitCnt
                }
                goodsSkuList.push(objs);
            
		}
          //判断是否属性重复
        var attrNames =[]
          $(".attr-name").each(function(){
            attrNames.push($(this).val());
          })
        for(var i=0;i<attrNames.length;i++) {
          attrlen = 0;
          for(var j=(i+1);j<attrNames.length;j++){
            if(attrNames[i]===attrNames[j]){
              layer.msg("不能输入相同的属性名", {icon: 5});
              obj.removeClass("disabled")
              return false;
            }
          }
        }

          if(!(/(^[1-9]\d*$)/.test(limitCnt))&&limitCnt!=""){
            layer.msg("限购输入不合法！", {icon: 5});
            obj.removeClass("disabled");
            return false
          }
		var goodsSupplier = $("#goodsSupplier").val();
          var params = {
            "bannerPic": bannerPic.join(","),
            "buyNotes":buyNotes,
            "cateId": 0,
            "endTime": endTime,
            "freight": freight,
            "goodsDesc": goodsDesc,
            "goodsName": goodsName,
            "goodsSkuList": goodsSkuList,
            "isRegionLimit": isRegionLimit,//"是否选限购区域：0-不限购；1-限购",
            "remark": remark,
            "returnPoint": returnPoint,
            "startTime": startTime,
            "status": status,//"是否上架：0-待上架；1-上架",
            "thumbPic": thumbPic,
            "goodsSupplier":goodsSupplier,
			"isBlack":limitedType,
			"blackJson":blackJson
          }
          console.log(params);
           if(!obj.hasClass("disabled")){
             obj.addClass("disabled");
	          $.ajax({
	                type: "post",
	                url: basePath+'/sys/goods/addGoods',
	                contentType: "application/json",
	                dataType: 'json',
	                data:JSON.stringify(params),
	                beforeSend: function (xhr) {
	                   xhr.setRequestHeader('token', token);
	                },
	                success: function(data) {
	                  // console.log(data);
	                  if(data.resultCode==0){
	                    layer.msg("操作成功！", {icon: 1});
	                     setTimeout(function(){
	                      var history_src = localStorage.getItem('history_src');
	                      $("#iframe", window.parent.document).attr("src",history_src);
	                    },1000);
	                  }else if(data.resultCode==3){
	                    localStorage.removeItem('role');
	                    localStorage.removeItem('token');
	                    top.location.href="/cms/login.html?rdm="+Math.random();
	                  }else{
	                    layer.msg(data.resultMsg, {icon: 5});
	                    obj.removeClass("disabled");
	                  }
	                },
	                fail: function() {
	                  //layer.msg("网络异常，请稍后再试！", {icon: 5});
	                }
	            });
            }
        
    }

    //编辑商品
    function editGoods(obj){
      if(!obj.hasClass("disabled")){
            obj.addClass("disabled");
          // var cateId =  $("#goods_type1 .layui-this").attr('lay-value');
          var goodsName = $("#goods_name").val();
          var remark = $("#goods_sell_point").val();
          var thumbPic = '';
          if($(".upload-thumbnail-img").hasClass('default')){
              layer.msg("请上传缩略图", {icon: 5});
              return false;
            }else{
              thumbPic = $(".upload-thumbnail-img").attr("src");
            }
          var goodsDesc = layedit.getContent(editor_detail);
          var buyNotes = layedit.getContent(editor_notice);
          var bannerPic = [];
          //遍历两个logo图
          $(".upload-banner-img").each(function(){
              if(!$(this).hasClass("default")){
                var logo = $(this).attr("src");
                bannerPic.push(logo);
              }
          })
          if(bannerPic.length==0){
            layer.msg("请上传轮播顶图", {icon: 5});
            return false;
          }
          var freight = $("#freight_price").val()*100;
          var startTime = $("#shelves_start").val();
          var endTime = $("#shelves_end").val();
          var isRegionLimit = 0;
          if($('[name="limited"]').is(':checked')){
            isRegionLimit =1;
          }

          //规格id
          var specId  = $("#goods_spec .layui-this").attr('lay-value');
          if(specId == -1){
            layer.msg("请选择规格", {icon: 5});
            obj.removeClass("disabled");
            return false;
          }
          var goodsSkuList =[];
          if($("#sell_table tr").length<2){
            layer.msg("请至少添加一个属性", {icon: 5});
            obj.removeClass("disabled");
            return false;
          }

          var goodsSkuList =[];
          for(var i=1;i<$("#sell_table tr").length;i++){
            var _this = $("#sell_table tr").eq(i);

            var attrPic = "";
            if($(".upload-attr-img").eq(i-1).hasClass('default')){
              }else{
                attrPic = $(".upload-attr-img").eq(i-1).attr("src");
              }
            var attrId = $(".attr-name").eq(i-1).attr("attr_id");
            var skuid = $(".attr-name").eq(i-1).attr("skuid");
            var attrName = $(".attr-name").eq(i-1).val();
            if(attrId == undefined){
              attrId = "";
            }
            var costPrice = Math.round(_this.find(".costPrice").val()*100);
            var marketPrice = Math.round(_this.find(".marketPrice").val()*100);
            var normalPrice = Math.round(_this.find(".normalPrice").val()*100);
            var vipPrice = Math.round(_this.find(".vipPrice").val()*100);
            var limitCnt = _this.find(".limitCnt").val();
            var stock = _this.find(".stock").val();
            goodsid==undefined?goodsid="":goodsid = goodsid;
			var blackJson = $("#limited_input").attr("cityjson");//黑白名单的json字符串
			if(isRegionLimit == 1){
				console.log(blackJson)
				console.log(blackJson == null)
				if(blackJson == ""||blackJson == null){
					layer.msg("请至少选择一个限制区域", {icon: 5});
					return false;
				}
			}
               var objs =  {
                "attrId": attrId,
                "id": skuid,
                "goodsId": goodsid,
                "specId":specId,
                "attrName":attrName,
                // "saleStock": 2,
                "stock":stock,
                "attrPic":attrPic,
                "costPrice":costPrice,
                "vipPrice":vipPrice,
                "normalPrice":normalPrice,
                "marketPrice":marketPrice,
                "limitCnt":limitCnt,
                }
                goodsSkuList.push(objs);
              }


          //判断是否属性重复
          var attrNames =[]
            $(".attr-name").each(function(){
              attrNames.push($(this).val());
            })
          for(var i=0;i<attrNames.length;i++) {
            attrlen = 0;
            for(var j=(i+1);j<attrNames.length;j++){
              if(attrNames[i]===attrNames[j]){
                layer.msg("不能输入相同的属性名", {icon: 5});
                obj.removeClass("disabled")
                return false;
              }
            }
          }

          if(!(/(^[1-9]\d*$)/.test(limitCnt))&&limitCnt!=""){
            layer.msg("限购输入不合法！", {icon: 5});
            return false
          }
        var goodsSupplier = $("#goodsSupplier").val();  
		
          var params = {
            "bannerPic": bannerPic.join(","),
            "buyNotes":buyNotes,
            "cateId": 0,
            "endTime": endTime,
            "freight": freight,
            "goodsDesc": goodsDesc,
            "goodsName": goodsName,
            "goodsSkuList": goodsSkuList,
            "remark": remark,
            "startTime": startTime,
            "thumbPic": thumbPic,
            "id":goodsid,
            "isRegionLimit":isRegionLimit,
            "goodsSupplier":goodsSupplier,
			"isBlack":limitedType,			
			"blackJson":blackJson
          }
          console.log(params);
		  console.log("isBlack====="+limitedType);
          $.ajax({
                type: "post",
                url: basePath+'/sys/goods/saveGoods',
                contentType: "application/json",
                dataType: 'json',
                data:JSON.stringify(params),
                beforeSend: function (xhr) {
                   xhr.setRequestHeader('token', token);
                },
                success: function(data) {
                  // console.log(data);
                  if(data.resultCode==0){
                    layer.msg("操作成功！", {icon: 1});
                     setTimeout(function(){
                      var history_src = localStorage.getItem('history_src');
                      $("#iframe", window.parent.document).attr("src",history_src);
                    },1000);
                  }else if(data.resultCode==3){
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    top.location.href="/cms/login.html?rdm="+Math.random();
                  }else{
                    layer.msg(data.resultMsg, {icon: 5});
                    obj.removeClass("disabled");
                  }
                },
                fail: function() {
                  //layer.msg("网络异常，请稍后再试！", {icon: 5});
                }
            });
        }
    }



    //加载规格
    function getGoodsSpec(index,type){
      $.ajax({
            type: "post",
            url: basePath+'/sys/goods/getGoodsSpec',
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              console.log(data);
              if(data.resultCode==0){
                localStorage.setItem('spec',JSON.stringify(data));
                var res = data.data;
                if(res!=null){
                  var html = '';
                  if(type == 1){
                    html+='<option value="-1" selected="">请选择规格</option>'
                  for(var i=0;i<res.length;i++){
                     html +='<option value="'+res[i].id+'">'+res[i].specName+'</option>' 
                  }
                  }else{
                    html+='<option value="-1">请选择规格</option>'
                    for(var i=0;i<res.length;i++){
                      if(res[i].id==index){//默认加载第一个规格的属性
                        html +='<option value="'+res[i].id+'" selected>'+res[i].specName+'</option>'
                      }else{
                       html +='<option value="'+res[i].id+'">'+res[i].specName+'</option>' 
                      }
                    }
                  }
					if(judgeUpdate != 1&&judgeUpdate != ""){
						$("#goods_spec select").attr("disabled",true);
					}
                  $("#goods_spec select").html(html);
                  form.render('select');
                  // creatNewSellInfo();
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

    //切换规则
    function switchSpec(id){
      var spec = localStorage.getItem('spec');
      spec = eval('('+spec+')');
      console.log(spec);
      var html = '';
      var res = spec.data;
      if(res!=null){
        for(var i=0;i<res.length;i++){
          if(res[i].id == id){
            $(".add-attr-btn").removeClass('layui-btn-disabled');
              console.log(res[i].specAttrList);
              if(res[i].specAttrList==null) return false;
              var spec_html='';
              if(res[i].specAttrList.length>0){
              for(var j=0;j<res[i].specAttrList.length;j++){
                ++attr_index;
                  spec_html +='<div class="layui-input-inline attr-box" style="width: 300px;">'+
                        '<input type="text" class="layui-input attr-name"   lay-verify="required" attrid = "'+ res[i].specAttrList[j].id+'" value="'+ res[i].specAttrList[j].attrName+'" disabled>'+
                        '<i class="layui-icon layui-icon-close attr-close"></i>'+
                        '<div class=" com-uploadbox banner-uploadbox pr" style="width: 300px;height: 128px;position:relative">'+
                              '<img src="../images/default.png" alt="" class="upload-source default upload-attr-img">'+
                              '<div class="shade-wrap banner-wrap">'+
                                '<div class="pr">'+
                                  '<button type="button" class="layui-btn upload-banner" id="upload_attr_img'+attr_index+'">'+
                                    '<i class="layui-icon">&#xe67c;</i>单张上传'+
                                  '</button>'+
                                  '<a href="javascript:;" title="重传" class="reload-img"></a>'+
                                  '<a href="javascript:;" title="删除" class="del-img"></a>'+
                                '</div>'+
                              '</div>'+
                          '</div>'+
                    '</div>';
                  $("#spec-box").html(spec_html);

                    (function(index){
                      setTimeout(function(){
                        upload.render({ //允许上传的文件后缀
                        elem: '#upload_attr_img'+index
                        ,url: basePath+'/sys/upload/img'
                        ,headers: {token: token}
                        ,accept: 'images' //普通文件
                        ,exts: 'jpg|png|gif|bmp|jpeg'
                        ,size: 2048  //kb
                        ,auto:false
                        , choose: function(obj) {
                            obj.preview(function(index, file, result) {
                              var img = new Image();
                              img.onload = function() {
                                console.log('choose poster', img.width, img.height);

                                // obj.upload(index, file);
                                //if ('750' == img.width && '320' == img.height) {
                                  obj.upload(index, file);
                                // } else {
                                //   layer.msg('图片尺寸必须为： 750px x 320px', {icon: 5});
                                // }
                              };
                              img.src = result;
                            });
                          }
                        ,before: function(obj){ 
                          layer.load();
                        }
                        ,done: function(data){
                          layer.closeAll('loading');
                          //console.log(data);
                          if(data.resultCode==0){
                             $("#upload_attr_img"+index).parents(".banner-wrap").siblings('.upload-attr-img').attr('src', data.data.url).removeClass('default'); //图片链接（base64）不支持ie8
                             $("#upload_attr_img"+index).parents(".banner-uploadbox").addClass("has");
                          }else if(data.resultCode==3){
                              localStorage.removeItem('role');
                              localStorage.removeItem('token');
                              top.location.href="/cms/login.html?"+Math.random();
                          }else{
                            layer.closeAll('loading');
                            // layer.alert('上传失败，请重试！');
                            layer.msg(data.resultMsg, {icon: 5});
                          }
                        }
                      });
                      },100);
                      
                    }(attr_index));

                  }
                }
                else{
                  $("#spec-box").html(spec_html);
                }

          }
        }
      }
      creatNewSellInfo();
    }

    //获取限购城市
    function getGoodsLimitRegion(){
      $.ajax({
            type: "post",
            url: basePath+'/sys/goods/getGoodsLimitRegion',
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              console.log(data);
              if(data.resultCode==0){
                var res = data.data;
                if(res!=null){
				  var limitedStr = '';
                  for(var i=0;i<res.length;i++){
					if(i ==res.length-1){
						limitedStr += res[i]
					}else{
						limitedStr += res[i] +",";
					}
                  }
				   $("#limited_input").val(limitedStr)
				  //$("#limited_input").val(cityStr).attr("cityJson","");
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
	
	 //全选
	form.on('checkbox(provinceAll)', function (data) {
		var _this = $(data.elem);
		var parProvinceElem = $(data.elem).parents(".province-elem");
		_this.parents(".province-elem").find(".provinceOne").each(function () {
			this.checked = data.elem.checked;
		});
		if(this.checked == false){
			parProvinceElem.find(".city-data-hide").remove();
			parProvinceElem.find(".province-num").remove();
		}
		form.render('checkbox');
	});
	//单选
	form.on('checkbox(provinceOne)', function (data) {
		var i = 0;
		var j = 0;
		var _this = $(data.elem);
		_this.parents(".province-elem").find(".provinceOne").each(function () {
			if( this.checked === true ){
				i++;
			}else{
				$(this).parents(".province-box").find(".province-num").remove();
			}
			j++;
		});
		if( i == j )
		{
			_this.parents(".province-elem").find(".provinceAll").prop("checked",true);
			form.render('checkbox');
		}else
		{
			_this.parents(".province-elem").find(".provinceAll").removeAttr("checked");
			form.render('checkbox');
		}

	});

	//单选
	form.on('checkbox(cityOne)', function (data) {
		var flg = data.elem.checked;
		var _this = $(data.elem);
		var id = _this.attr("id");
		var regionLevel = _this.attr("regionLevel");
		var parentId = _this.attr("parentId");
		var regionName = _this.attr("regionName");
		$(".province-box").each(function(){
			if($(this).hasClass("act")){
				var numObj = $(this).find(".province-num");
				if(flg == true){//选中 +1
					if(numObj.length != 0){
						numObj.text(parseInt(numObj.text())+1)
					}else{
						$(this).find(".layui-icon-triangle-d").before('<span class="province-num">1</span>');
						$(this).find(".provinceOne").prop("checked",true);
					}
					$(this).append('<div class="city-data-hide" id="'+ id +'" regionLevel="'+ regionLevel +'" parentId="'+ parentId +'" regionName="'+ regionName +'" ></div>')
				}else{//取消选中 -1
					if(parseInt(numObj.text())>1){
						numObj.text(parseInt(numObj.text())-1)
					}else{
						numObj.remove();
						$(this).find(".provinceOne").prop("checked",false);
					}
					$(this).find(".city-data-hide").each(function(){
						if($(this).attr("id") == id){
							$(this).remove();
						}
					})
				}
			}
		})
		form.render('checkbox');
		event.stopPropagation()
	});
	
	
	var interval = '';
	$(document).on("click",".layui-icon-triangle-d",function(e){
		$("#cityTips").remove();
		$(".province-box").removeClass("act");
		var provinceBox = $(this).parents(".province-box");
		provinceBox.addClass("act");//标记是展开此省
		var l = provinceBox.position().left;
		var t = provinceBox.position().top;
		var areaId = provinceBox.attr("areaId"); //用于遍历哪个区
		var id = provinceBox.attr("id"); //用于遍历哪个省
		var areaStr = localStorage.getItem("areaStr");
		areaStr = eval("("+ areaStr +")");
		console.log(areaStr);
		var cityTips = '<form class="layui-form" action="" id="cityTips"><div class="flex-wrap">'
		for(var i =0;i<areaStr.length;i++){
			if(areaStr[i].areaId == areaId){
				var provinceList = areaStr[i].provinceRegionList;
			   for(var j =0;j<provinceList.length;j++){
				   if(provinceList[j].id == id){
					   var cityList = provinceList[j].provinceRegionList;
					   for(var x = 0;x<cityList.length;x++){
						   cityTips +='<div class="city-box"><input type="checkbox" id="'+cityList[x].id+'" regionLevel="'+cityList[x].regionLevel+'" parentId="'+cityList[x].parentId+'" regionName="'+cityList[x].regionName+'" class="cityOne" name="" lay-skin="primary" lay-filter="cityOne">'+cityList[x].regionName+'</div>'
					   }
				   }
				   
			   }	
			}
		}
		cityTips += '</div></form>';
		provinceBox.append(cityTips);
		
		if(provinceBox.find(".city-data-hide").length>0){
			provinceBox.find(".city-data-hide").each(function(i){
				var _this = $(this);
				$(".cityOne").each(function(y){
					if(_this.attr("id") == $(this).attr("id")){
						$(this).prop("checked",true)
						return;
					}
				})
			})
		}
		
		if(l+300>600){
		$("#cityTips").css({"left":300+"px","top":(t+34)+"px"})	
		}else{
			$("#cityTips").css({"left":l+"px","top":(t+34)+"px"})
		}
		form.render();
		e.stopPropagation();
	})
	//阻止点tips区域隐藏tips
	$(document).on("click","#cityTips,.city-box",function(e){
		e.stopPropagation();
	})
	
	$(document).click(function(){
		$(".province-box").removeClass("act");
		$("#cityTips").remove();
	})
	
	
	//选择区域 step1 
	function checkLimitedArea(popTitle){
		var selectedArea = $("#limited_input").attr("cityjson");
		console.log(selectedArea)
		if(selectedArea !=""&&selectedArea !=null){
			selectedArea = eval("("+ selectedArea +")");
		}
		var areaStr = localStorage.getItem("areaStr");
		var areaAll = '<form class="layui-form" action=""><div id="provincewrap"></div></form>';
		layer.open({
			 type:1
			,title:popTitle
			,area:["750px","600px"]
		    ,content: areaAll
		    ,btn: ['确定','取消']
		    ,success: function(layero, index){
					if(areaStr ==null){
						$.ajax({
						    type: "post",
						    url: basePath+'/sys/goods/getGoodsLimitRegionNew',
						    contentType: "application/json",
						    dataType: 'json',
							async:false,
						    beforeSend: function (xhr) {
								 xhr.setRequestHeader('token', token);
							},
						    success: function(data) {
						    	if(data.resultCode==0){
									 var res = data.data;
									 if(res.length>0){
										 areaStr = JSON.stringify(res);
										 localStorage.setItem("areaStr",areaStr);
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
					
					
					var html = '';
					var res = eval("("+ areaStr +")");
					if(res==null) return;
					//加载所有区域数据			
					for(var x = 0;x<res.length;x++){
							html += '<div class="province-elem">';
							html +='<div class="province-l"><div class="province-box" areaId="'+res[x].areaId+'"><input type="checkbox" class="provinceAll" name="" lay-skin="primary" lay-filter="provinceAll">'+res[x].areaName+'</div></div>'
							html += '<div class="province-r">';
							for(var i = 0;i<res[x].provinceRegionList.length;i++){
								html +='<div class="province-box" id="'+res[x].provinceRegionList[i].id+'" regionLevel="'+res[x].provinceRegionList[i].regionLevel+'" parentId="'+res[x].provinceRegionList[i].parentId+'" regionName="'+res[x].provinceRegionList[i].regionName+'" areaId="'+res[x].provinceRegionList[i].areaId+'"><input type="checkbox" name="check[]" class="provinceOne" lay-skin="primary" lay-filter="provinceOne">'+res[x].provinceRegionList[i].regionName+'<i class="layui-icon layui-icon-triangle-d"></i></div>'
							}
						html +='</div></div>'
					}					
					
					$("#provincewrap").append(html)
					
					if(selectedArea.length>0){ //填充已经选择的省份以及选择的城市
						selectedArea.forEach(function(item,index,arr){
							if(item.regionLevel == 1){
								$(".province-box").each(function(){
									if($(this).attr("id") == item.id){
										$(this).find(".provinceOne").prop("checked",true);
									}
								})
							}else if(item.regionLevel == 2){
								var num  = 0;
								$(".province-box").each(function(){
									if($(this).attr("id") == item.parentId){
										$(this).find(".provinceOne").prop("checked",true);
										if($(this).find(".province-num").length>0){
											num = parseInt($(this).find(".province-num").text());
										}else{
											$(this).find(".layui-icon-triangle-d").before('<span class="province-num">'+num+'</span>')
										}
										num++;
										$(this).append('<div class="city-data-hide" id="'+ item.id +'" regionLevel="'+ item.regionLevel +'" parentId="'+ item.parentId +'" regionName="'+ item.regionName +'" ></div>')
										$(this).find(".province-num").text(num)
									}
									
								})
								
							}
						})
						
					}	
					
					//根据已选的省份来确定是否要勾选区域
					$(".province-elem").each(function(){//遍历每个区
						var province_len = $(this).find(".province-r .province-box").length;
						var num = 0;
						$(this).find(".province-r .province-box").each(function(i){//判断右边的省是否全选中  全选中则勾选左边区域名
							if($(this).find(".provinceOne").prop("checked") == true){
								num++;
							}
						})
						if(province_len == num){
							$(this).find(".provinceAll").prop("checked",true);
						}
						
					})
					
					form.render();
					
					//把省  市 抽出来存本地 以后后面第二次弹窗 模糊查询需要用到
					var provinceList = [],cityList = []
					for(var i =0;i<res.length;i++){
							var List1 = res[i].provinceRegionList;
							for(var j =0;j<List1.length;j++){
								provinceList.push({"id":List1[j].id,"regionLevel":List1[j].regionLevel,"parentId":List1[j].parentId,"regionName":List1[j].regionName,"areaId":List1[j].areaId})
							   var List2 = List1[j].provinceRegionList;
							   for(var x = 0;x<List2.length;x++){
								   cityList.push({"id":List2[x].id,"regionLevel":List2[x].regionLevel,"parentId":List2[x].parentId,"regionName":List2[x].regionName})
							   }
							}
								
					}
					provinceList = JSON.stringify(provinceList);
					cityList = JSON.stringify(cityList);
					localStorage.setItem("provinceList",provinceList);
					localStorage.setItem("cityList",cityList);
					//渲染区域之后
					if(selectedArea.length>0){
						
					}
		
		
		    	
			  }
		    ,yes: function(index, layero){
		      //执行结束的ajax
			  //cityStr 转化为字符串的json
				var cityStr =[];
				$(".province-box").each(function(){//取出已经选择的省、市
					if($(this).find(".provinceOne").prop("checked")){
						if($(this).find(".city-data-hide").length>0){//如果省下面选了市  就拼接市的字段
							$(this).find(".city-data-hide").each(function(){
								var id = $(this).attr("id");
								var regionLevel = $(this).attr("regionLevel"); 
								var parentId = $(this).attr("parentId"); 
								var regionName = $(this).attr("regionName"); 
								cityStr.push({"id":id,"regionLevel":regionLevel,"parentId":parentId,"regionName":regionName})
							})
						}else{//否则就拼音省的字段
							var id = $(this).attr("id"); 
							var regionLevel = $(this).attr("regionLevel"); 
							var parentId = $(this).attr("parentId"); 
							var regionName = $(this).attr("regionName"); 
							var areaId = $(this).attr("areaId"); 
							cityStr.push({"id":id,"regionLevel":regionLevel,"parentId":parentId,"regionName":regionName,"areaId":areaId})
						}
					}
				})
				cityStr = JSON.stringify(cityStr)
				// console.log(cityStr)
				layer.close(index);
				confirmPopfnc(cityStr,popTitle)
				
		    }
		    ,btn2: function(index, layero){
		    }
		    ,cancel: function(){ 
		    }
		  });
	}
	
	//监听添加区域选择
	form.on('submit(addAreaSelect)', function(data){
	  var _this = $(this);
	  if(provinceStr != ''){
		  var arr = provinceStr.split(",");
		  var isRepeat = false;
		  $(".selected-elem").each(function(){
			  if(arr[0] == $(this).attr("id")){
				isRepeat = true;
				layer.msg('已添加 '+arr[4]+'，无需再重复添加', {icon: 5}); 
				return false;
			  }
		  })
		  if(!isRepeat){
			$(".selected-bg").append('<div class="selected-elem" id ="'+arr[0]+'" regionLevel ="'+arr[1]+'" parentId ="'+arr[2]+'" areaId ="'+arr[3]+'" regionName ="'+arr[4]+'">'+arr[4]+'<i class="layui-icon layui-icon-close-fill close-area"></i></div>')
		  }
		  
	  }
	  if(cityStr != ''){
		  var arr = cityStr.split(",");
		  var isRepeat = false;
		  $(".selected-elem").each(function(){
			  if($(this).attr("regionLevel") == 1&&$(this).attr("id") == arr[2]){
				isRepeat = true;
				layer.msg('已添加 '+$(this).attr("regionName")+' 全省范围，无需再添加'+arr[3], {icon: 5}); 
				return false;
			  }else if($(this).attr("regionLevel") == 2&&$(this).attr("id") == arr[0]){
				 isRepeat = true;
				 layer.msg('已添加 '+arr[3]+'，无需再重复添加', {icon: 5}); 
				 return false; 
			  }
		  })
		   if(!isRepeat){
			  $(".selected-bg").append('<div class="selected-elem" id ="'+arr[0]+'" regionLevel ="'+arr[1]+'" parentId ="'+arr[2]+'" regionName ="'+arr[3]+'" areaId ="">'+arr[3]+'<i class="layui-icon layui-icon-close-fill close-area"></i></div>')  
			}
	  }
	  $(".area-msg").remove();
	  
	  $("#select_city,#select_province").val(-1); //清空原选项值
	  form.render();
	  provinceStr = '';
	  cityStr = '';
	  return false;
	});
	//删除已选的省 市
	$(document).on("click",".close-area",function(){
		if($(".selected-elem").length ==1){
			$(this).parents(".selected-elem").remove();
			$(".selected-bg").append('<div class="area-msg">您还没有选择任何区域</div>')
		}else{
			$(this).parents(".selected-elem").remove();
		}
		
	})
	
	var provinceStr = '',cityStr = '';
	//监听选择省份
	form.on('select(select_province)', function(data){
		//console.log(data.value)
		//console.log(data.elem[data.elem.selectedIndex].text)
		if(data.value == -1){
			provinceStr = '';
			return ;
		} 
		var _this = $(data.elem).find("option:selected");
		provinceStr = data.value+","+_this.attr("regionLevel")+","+_this.attr("parentId")+","+_this.attr("areaId")+","+data.elem[data.elem.selectedIndex].text;
	   return false;
	});
	
	//监听选择城市
	form.on('select(select_city)', function(data){
	   console.log(data.value)
	   console.log(data.elem[data.elem.selectedIndex].text)
	   if(data.value == -1){
	   	cityStr = '';
	   	return ;
	   } 
	   var _this = $(data.elem).find("option:selected");
	   cityStr = data.value+","+_this.attr("regionLevel")+","+_this.attr("parentId")+","+data.elem[data.elem.selectedIndex].text;
	   return false;
	});
	
	
	//限制区域  step2
	function confirmPopfnc (cityStr,popTitle){
		var selectedArea = eval("("+ cityStr +")");//
		var provinceList = localStorage.getItem("provinceList");
		var cityList = localStorage.getItem("cityList");
		provinceList = eval("("+provinceList+")");
		cityList = eval("("+cityList+")");
		var areaAll = '<form class="layui-form" action=""><div id="resultwrap">';
		areaAll +='<div class="layui-inline">'+
					  '<label class="layui-form-label">请选择城区域</label>'+
					  '<div class="layui-input-inline" style="width:170px;margin-right:20px">'+
						'<select name="modules"  lay-search="" lay-filter="select_province" id="select_province">'+
							'<option value="-1">请选择省份</option>'
						for(var i = 0;i<provinceList.length;i++){
							areaAll +='<option value="'+provinceList[i].id+'" regionLevel="'+provinceList[i].regionLevel+'" parentId="'+provinceList[i].parentId+'" areaId="'+provinceList[i].areaId+'">'+provinceList[i].regionName+'</option>'
						}
						areaAll +='</select>'+
					  '</div>'+
					'<div class="layui-input-inline"  style="width:170px;margin-right:20px">'+
						'<select name="modules"  lay-search="" lay-filter="select_city" id="select_city">'+
						  '<option value="-1">请选择城市</option>'
						  for(var i = 0;i<cityList.length;i++){
						  	areaAll +='<option value="'+cityList[i].id+'" regionLevel="'+cityList[i].regionLevel+'" parentId="'+cityList[i].parentId+'" >'+cityList[i].regionName+'</option>'
						  }
						   
						areaAll +='</select>'+
					  '</div>'+
				  '<button class="layui-btn layui-btn" lay-submit="" lay-filter="addAreaSelect">选择</button>'+
				  '</div>'+
				  '<div class="selected-bg">'
				  if(selectedArea.length>0){
					  for(var m = 0;m<selectedArea.length;m++){
					  					  areaAll +='<div class="selected-elem" id="'+selectedArea[m].id+'" regionLevel="'+selectedArea[m].regionLevel+'" parentId="'+selectedArea[m].parentId+'" regionName="'+selectedArea[m].regionName+'" areaId="'+selectedArea[m].areaId+'">'+selectedArea[m].regionName+'<i class="layui-icon layui-icon-close-fill close-area"></i></div>'
					  }
				  }else{
					  areaAll +='<div class="area-msg">您还没有选择任何区域</div>';
				  }
				  
				  areaAll += '</div>'
				  
		areaAll +='</div></form>'
		
		layer.open({
			type:1
			,title:popTitle
			,area:["750px","600px"]
		    ,content: areaAll
		    ,btn: ['确定','取消']
		    ,success: function(layero, index){
		    		form.render();
			  }
		    ,yes: function(index, layero){
		      //执行结束的ajax
			  //cityStr 转化为字符串的json
			  var cityStr ='';
			  var cityJson = [];
			  if($(".selected-elem").length>0){
				  $(".selected-elem").each(function(i){
					  cityJson.push({"id":$(this).attr("id"),"regionLevel":$(this).attr("regionLevel"),"parentId":$(this).attr("parentId"),"regionName":$(this).attr("regionName"),"areaId":($(this).attr("areaId")=='undefined'?'':$(this).attr("areaId"))})
					  if(i == $(".selected-elem").length-1){
						  cityStr += $(this).attr("regionName")
					  }else{
						cityStr += $(this).attr("regionName")+","
					  }
				  })
				  cityJson = JSON.stringify(cityJson);
				  $("#limited_input").val(cityStr).attr("cityJson",cityJson);
			  }else{
				 $("#limited_input").val(cityStr).attr("cityJson","");
			  }
		        // layer.msg("处理成功！", {icon: 1});
				layer.close(index);
		    }
		    ,btn2: function(index, layero){
		    }
		    ,cancel: function(){ 
		    }
		  });
		
	}
	
	


    //生成新的售卖信息
    function creatNewSellInfo(){
        var ruleName = $("#goods_spec .layui-this").text();
        var goodsName = [];
        var html ='';
        var thStr = '<th>可售库存</th><th>成本价（元）</th><th>市场价（元）</th><th>非会员价（元）</th><th>会员价（元）</th><th>限购（件/人）</th>'
        var tdStr = '<td><input type="text" class="layui-input stock"  lay-verify="required|Number" placeholder="可售库存"></td>'+
                  '<td><input type="text" class="layui-input costPrice"  lay-verify="required|isTwoDecimalsFloat" placeholder="成本价（元）"></td>'+
                  '<td><input type="text" class="layui-input marketPrice"  lay-verify="required|isTwoDecimalsFloat" placeholder="市场价（元）"></td>'+
                  '<td><input type="text" class="layui-input normalPrice"  lay-verify="required|isTwoDecimalsFloat" placeholder="非会员价（元）"></td>'+
                  '<td><input type="text" class="layui-input vipPrice"  lay-verify="required|isTwoDecimalsFloat" placeholder="会员价（元）"></td>'+
                  '<td><input type="text" class="layui-input limitCnt"  placeholder="限购（件/人）"></td>'
        $(".attr-name").each(function(i){
          if($(this).val()!=""){
            goodsName.push($(this).val());
          }
        });
        if(goodsName.length>0){
          html += '<tr><th>'+ruleName+'</th>'+thStr+'</tr>';
          for(var i =0;i<goodsName.length;i++){
           html += '<tr><td>'+goodsName[i]+'</td>'+tdStr+'</tr>'; 
          }
        }else{
          html="";
        }

        $("#sell_table").html(html);
        form.render();

        // $(this).remove();
        return false;
    }


	function previewGoods(){
      layer.open({
          type:1
          ,title: "预览"
          ,content: $('#previewWrap')
          ,area: ['375px', '500px'] //宽高
          ,btn: ['确定'] //只是为了演示
          ,success:function(){
          	var _this = $("#sell_table tr").eq(1);
          	var thumbPic = $(".upload-thumbnail-img").attr("src");
          	var goodsName = $("#goods_name").val();
          	var remark = $("#goods_sell_point").val();
          	var goodsDesc = layedit.getContent(editor_detail);
          	var freight = $("#freight_price").val()*100;
          	
          	var returnPoint = $("#back_currency").val()
          	var costPrice = _this.find(".costPrice").val()*100;
            var marketPrice = _this.find(".marketPrice").val()*100;
            var normalPrice = _this.find(".normalPrice").val()*100;
            var vipPrice = _this.find(".vipPrice").val()*100;
            var limitCnt = _this.find(".limitCnt").val();
            var stock = _this.find(".stock").val();
          	
          	
            $(".pre-main .thumbPic-img").attr("src",thumbPic);
            if(freight == 0){
            	$(".pre-main .goodsName").html("<span>包邮</span>"+goodsName);
            }else{
            	$(".pre-main .goodsName").text(goodsName);
            }
            $(".pre-main .remark").text(remark);
            $(".pre-main .returnPoint").text((returnPoint==""?0:returnPoint));

            $(".pre-main .marketPrice").text("￥"+(marketPrice)/100+"市场价");
            $(".pre-main .normalPrice").text("￥"+(normalPrice)/100+"优惠价");
            $(".pre-main .vipPrice").text("￥"+(vipPrice)/100);
            $(".pre-main .saleStock").text(0);

          }
          ,yes: function(){
              layer.closeAll();
          }
        });  

	}
    



});
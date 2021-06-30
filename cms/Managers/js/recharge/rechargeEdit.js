layui.use(['jquery','element','layer','form','laydate','layedit'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,layedit = layui.layedit
    ,laydate = layui.laydate;

    var chargeDetailId = $("#iframe",parent.document.body).attr("chargeDetailId");
	var chargeId = '';
    var ueEditor_tips = layedit.build('tips', { //建立编辑器
        height: 300,
//      uploadImage: { url: basePath + '/sys/editorUpload.ajax', type: 'post' }
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

  //初始化权益编辑信息
  setTimeout(function(){initChargeInfo(chargeDetailId)},500);


  //监听保存
  form.on('submit(chargeSubmit)', function(data){
      editChargeInfo(chargeDetailId);
      return false;
  });

  function initChargeInfo(id){
    $.ajax({
            type: "get",
            url: basePath+'/sys/charge/getChargeInfo?id='+id,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                var res = data.data;
                $("#chargeName").val(res.chargeName);
				$("#type").val(res.type);
				$("#productName").val(res.productName);
				if(res.imageUrl!=null&&res.imageUrl!=""){
					$(".upload-thumbnail-img").attr("src",res.imageUrl).removeClass("default");
				}
				if(res.bannerUrl!=null&&res.bannerUrl!=""){
					$(".upload-thumbnail-img2").attr("src",res.bannerUrl).removeClass("default");
				}
                $("#cost").val(res.cost);
                $("#price").val(res.price);
                $("#salePrice").val(res.salePrice);
				if(res.tips == null){
					res.tips = "";
				}
                layedit.setContent(ueEditor_tips,res.tips);
                var status_html = ''
                if(res.statue==0){
                  status_html += '<input type="radio" name="statue" value="2" title="否">'+
                                 '<input type="radio" name="statue" value="1" title="是" >'+
                                 '<input type="radio" name="statue" value="0" title="待完善" checked="">'
                }else if(res.statue==1){
                  status_html += '<input type="radio" name="statue" value="2" title="否">'+
                                 '<input type="radio" name="statue" value="1" title="是" checked="" >'+
                                 '<input type="radio" name="statue" value="0" title="待完善" >'
                }else if(res.statue==2){
                  status_html += '<input type="radio" name="statue" value="2" title="否" checked="">'+
                                 '<input type="radio" name="statue" value="1" title="是" >'+
                                 '<input type="radio" name="statue" value="0" title="待完善" >'
                }
				chargeId = res.chargeId;
                $("#statue").html(status_html);
                form.render();
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



    function editChargeInfo(id){
		var chargeName = $("#chargeName").val();
		var type = $("#type").val();
		var productName = $("#productName").val();
		
		var cost = $("#cost").val()*100;
		var price = $("#price").val()*100;
		var salePrice = $("#salePrice").val()*100;
		
		var bannerUrl = "";
		if($(".upload-thumbnail-img2").hasClass('default')){
		  layer.msg("请上传Icon图", {icon: 5});
		  return false;
		}else{
		  bannerUrl = $(".upload-thumbnail-img2").attr("src");
		}

      var imageUrl = "";
      if($(".upload-thumbnail-img").hasClass('default')){
        layer.msg("请上传缩略图", {icon: 5});
        return false;
      }else{
        imageUrl = $(".upload-thumbnail-img").attr("src");
      }
	  
	  if(cost>salePrice){
		  layer.msg("会员价不能低于成本价，请重新输入", {icon: 5});
		  return false
	  }
	  
      var tips = layedit.getContent(ueEditor_tips);
      var statue = $('#statue input[name="statue"]:checked').val()

      var params = {
			  "chargeId": chargeId,
			  "chargeName": chargeName,
			  "cost": cost,
			  "id": id,
			  "imageUrl": imageUrl,
			  "bannerUrl":bannerUrl,
			  "price": price,
			  "productName": productName,
			  "salePrice": salePrice,
			  "statue": statue,
			  "tips": tips,
			  "type": type
			}
          console.log(params);
    $.ajax({
            type: "post",
            url: basePath+'/sys/charge/editCharge',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
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

              }
            },
            fail: function() {
              layer.msg("网络异常，请稍后再试！", {icon: 5});
            }
        });

  }

    
  



  

  


  


});
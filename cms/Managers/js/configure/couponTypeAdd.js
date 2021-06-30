layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var typeId = $("#iframe",parent.document.body).attr("typeId");

    //判断是券申请 还是编辑
    var  ifr_src = "";
    if($("#iframe",parent.document.body).attr("src")!=undefined){
      ifr_src = $("#iframe",parent.document.body).attr("src");
    }

    if(ifr_src.indexOf("editType")!= -1){ //修改分类
        $(".bis-title").text("编辑商家");
        initEditType(typeId);
    }else{//新增分类
        initBusinessList();
    }

    //监听保存
    form.on('submit(saveBtn)', function(data){
        if(typeId !=undefined && typeId !=null){
            editType(typeId);
        }else{
            addType();
        }
        return false;
    });
    //初始化商家列表
    function initBusinessList(id){
      $.ajax({
            type: "get",
            url: basePath+'/sys/right/getAllMbusinessList',
            contentType: "application/json",
            dataType: 'json',
            data:"",
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                var html = '';
                var res = data.data;
                for(var i=0;i<res.length;i++){
                   html += '<input type="checkbox" name="commodity" value="'+res[i].id+'" title="'+res[i].bisName+'">'     
                }
                $("#commodity_list").html(html);
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

   //编辑分类详情 
    function initEditType(id){
      $.ajax({
            type: "get",
            url: basePath+'/sys/right/getMcategoryInfo?id='+id,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                $("#type_name").val(data.data.categoryName);
                var html = '';
                var res = data.data;
                console.log(res);
                for(var i=0;i<res.bisList.length;i++){
                        var bisIds = ","+res.bisIds+",";
                        if(bisIds.indexOf(","+res.bisList[i].id +",") != -1){
                           html += '<input type="checkbox" name="commodity" value="'+res.bisList[i].id+'" title="'+res.bisList[i].bisName+'" checked="" >'
                        }else{
                            html += '<input type="checkbox" name="commodity" value="'+res.bisList[i].id+'" title="'+res.bisList[i].bisName+'">'
                        }   
                        
                    }
                $("#commodity_list").html(html);
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

    //   编辑   
     function editType(id){
        var categoryName = $("#type_name").val();
        var bisIds ="";
        $("#commodity_list .layui-form-checkbox").each(function(i){
           if($(this).hasClass('layui-form-checked')){
            bisIds += $(this).prev("input").val()+",";
           }
        })
        bisIds = bisIds.substring(0,bisIds.length-1);
        var params = {
              "bisIds": bisIds,
              "categoryName": categoryName,
              "id": id
            }
        $.ajax({
            type: "post",
            url: basePath+'/sys/right/editMcategory',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                $("#iframe", window.parent.document).attr("src",'configure/couponType.html?'+Math.random());
                
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



     //新增   
     function addType(){
        var categoryName = $("#type_name").val();
        var bisIds ="";
        $("#commodity_list .layui-form-checkbox").each(function(i){
           if($(this).hasClass('layui-form-checked')){
            bisIds += $(this).prev("input").val()+",";
           }
        })
        bisIds = bisIds.substring(0,bisIds.length-1);

        var params = {
              "bisIds": bisIds,
              "categoryName": categoryName
            }
        $.ajax({
            type: "post",
            url: basePath+'/sys/right/addMcategory',
            contentType: "application/json",
            dataType: 'json',
            data:JSON.stringify(params),
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              if(data.resultCode==0){
                $("#iframe", window.parent.document).attr("src",'configure/couponType.html?'+Math.random());
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
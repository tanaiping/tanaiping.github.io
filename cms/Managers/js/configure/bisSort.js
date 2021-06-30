layui.use(['jquery','element','layer','form','laydate'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,laydate = layui.laydate;

    var businessid = $("#iframe",parent.document.body).attr("businessid");

    //初始化分类商家列表
    initBusinessLegalList(businessid);

    //置顶  3
    $(document).on('click','.sticky-btn',function(){
        commonOpera(3,this,"/sys/right/businessRightSort");
    });
    //上移 1 
    $(document).on('click','.moveUp-btn',function(){
        commonOpera(1,this,"/sys/right/businessRightSort");
    });
    //下移 2
    $(document).on('click','.moveDown-btn',function(){
      commonOpera(2,this,"/sys/right/businessRightSort");
    });

    function initBusinessLegalList(businessid){

    	$.ajax({
            type: "get",
            url: basePath+'/sys/right/businessRight?bisId='+businessid,
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function (xhr) {
               xhr.setRequestHeader('token', token);
            },
            success: function(data) {
              console.log(data);
              if(data.resultCode==0){
                var res =data.data;
                  if(res!=null){
                    var html='';
                    for(var i=0;i<res.length;i++){
                        html += '<tr  rightid = "'+res[i].rightId+'" sort = "'+res[i].sort+'" >'+
                                '<td>'+(i+1)+'</td><td>'+res[i].rightName+'</td><td>'+
                                '<button class="layui-btn layui-btn-primary sticky-btn">置顶</button>'+
                                '<button class="layui-btn layui-btn-danger moveUp-btn">上移</button>'+
                                '<button class="layui-btn layui-btn-normal moveDown-btn">下移</button>'+
                                '</td></tr>'
                    }

                    $("#sortData").html(html);
                }else{
                        html+='<tr><td colspan="3" class="layui-td-nodata"></td></tr>'
                        $("#typeData").html(html);
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


    function commonOpera(type,obj,url){
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
                $("#iframe", window.parent.document).attr("src",'configure/businessSort.html?'+Math.random())
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
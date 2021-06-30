//JavaScript代码区域
  layui.use(['jquery','element','layer', 'form','laypage'], function(){
    var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,laypage=layui.laypage
    ,form = layui.form;

     //监听提交商户信息
    form.on('submit(build_shopUser)', function(data){
        addShopUser();
        return false;
    });

    //添加商户
    function addShopUser(){
        var params={
          "bisName":$("#shop_name").val()
          ,"password":md5($("#shop_pwd").val())
          ,"userName":$("#shop_Username").val()
        }
        $.ajax({
          type: "post",
          url: basePath+'/sys/bis/add',
          contentType: "application/json",
          dataType: 'json',
          data:JSON.stringify(params),
          beforeSend: function (xhr) {
             xhr.setRequestHeader('token', token);
          },
          success: function(data) {
            if(data.resultCode==0){
                layer.msg("添加商户成功！！！", {icon: 1});
                setTimeout(function(){window.location.href="add_shoper.html?rdm="+Math.random()},3000);
              
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



    // var html ='';
    // for(var i=0;i<8;i++){
    // 	html+='<tr><td>待审核</td><td>12个商户</td><td>12个申请</td><td>已发券</td><td>1000张</td></tr>';
    // }
    // $("#m_table tbody").html(html);



  });

//JavaScript代码区域
layui.use(['jquery','element','layer', 'form','tree'], function(){
  var element = layui.element
  ,tree = layui.tree
  ,$ = layui.$;  //重点之处。 引入jquery

  var h = parseInt($(window).height());
  $("#iframe").css("height",(h-70)+"px");
  $(window).resize(function() {
     h = parseInt($(window).height());
    $("#iframe").css("height",(h-70)+"px");
  });
  // //配置主菜单
  var menuList ={
      name:['纪念园管理','评论管理','广告管理'],value:['','','',''],id:['m01','m02','m03'],
      second:[
        {
          d_name:['纪念园列表'],
          d_value:['park/parkList.html?'+Math.random()],
          d_id:['s1101']
        },{
          d_name:['评论列表'],
          d_value:['comment/commentList.html?'+Math.random()],
          d_id:['s1301']
        },
		{
          d_name:['广告配置'],//广告列表
          d_value:['ad/adSet.html?'+Math.random()],//'ad/adList.html?'+Math.random(),
          d_id:['s1202']//'s1201',
        },
      ]
    }
  ;
  var html='';
  for(var len=0;len<menuList.name.length;len++){
    html+='<li class="layui-nav-item" id="'+menuList.id[len]+'"><a class="" href="javascript:;" linkTo="'+menuList.value[len]+'">'+menuList.name[len]+'</a>';
    if(menuList.second!=undefined){
      if(menuList.second[len].d_name!=undefined){
          html+='<dl class="layui-nav-child">';
       
        for(var i =0;i<menuList.second[len].d_name.length;i++){
          if(i==0&&len==0){
            html+='<dd class="layui-this">';
          }else{
            html+='<dd>';
          }
          // html+='<dd>';
          html+='<a href="javascript:;"  id="'+menuList.second[len].d_id[i]+'" linkTo="'+menuList.second[len].d_value[i]+'">'+menuList.second[len].d_name[i]+'</a></dd>'
        }
      }
      html+='</dl></li>';
    }

  }
  $(".layui-nav-tree").html(html);

  //动态配置菜单之后再初始化element  导航的hover效果、二级菜单等功能，需要依赖element模块
	element.init();
	
    $("#iframe").attr("src",'park/parkList.html?'+Math.random());
    $("#s1101").addClass('layui-this');
    $("#m01").addClass('layui-nav-itemed');
  
  

  //切换菜单
  $(".layui-nav-tree").on("click","a",function(){
    var $src = $(this).attr("linkTo");
    if(!$src=="")
    $("#iframe").attr("src",$src);
  });

  //退出登录
  // $(".log-out").click(function(){
  //   var _this = $(this);
  //   //询问是否退出登录
  //     layer.open({
  //       content: '确定退出登录？'
  //       ,btn: ['退出', '取消']
  //       ,yes: function(index, layero){
  //         $.ajax({
  //             type: "get",
  //             url: basePath+'/sys/account/logout',
  //             contentType: "application/json",
  //             dataType: 'json',
  //             beforeSend: function (xhr) {
  //                xhr.setRequestHeader('token', token);
  //             },
  //             success: function(data) {
  //               if(data.resultCode==0){
  //                 localStorage.removeItem('role');
  //                 localStorage.removeItem('token');
  //                 window.location.href="/cms/login.html?rdm="+Math.random();
  //               }else if(data.resultCode==3){
  //                   localStorage.removeItem('role');
  //                   localStorage.removeItem('token');
  //                   window.location.href="/cms/login.html?rdm="+Math.random();
  //               }else{
  //                 layer.msg(data.resultMsg, {icon: 5});
  //               }
  //             },
  //             error: function() {
  //               // layer.msg("网络异常，请稍后再试！", {icon: 5});
  //               localStorage.removeItem('role');
  //               localStorage.removeItem('token');
  //               top.location.href="/cms/login.html?rdm="+Math.random();
  //             }
  //         });
  //       }
  //       ,btn2: function(index, layero){
  //         _this.parent("li").removeClass('layui-this');
  //       }
  //       ,cancel: function(){ 
  //         _this.parent("li").removeClass('layui-this');
  //       }
  //     });
  // })


});






//设置token
//headers: {token: 'sasasas'}
// beforeSend: function (xhr) {
//  xhr.setRequestHeader('token', "token");
// }

// xhr.setRequestHeader("token","header-token-value"); // 可以定义请求头带给后端
// xhr.setRequestHeader("dingyi","header-dingyi-value");
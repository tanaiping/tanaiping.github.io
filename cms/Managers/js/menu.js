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
  //获取登录角色的类型
  if(role==""||role==undefined){
    window.location.href="/cms/login.html?rdm="+Math.random();
    return false;
  } 
  // //配置主菜单
  var menuList =[
    {
      name:['统计','商品管理','卡券管理','直充管理','权益管理','订单管理','运营管理','活动管理','卡券配置','Icon配置'],value:['','','','','','','','','','icon/iconList.html?'+Math.random()],id:['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10'],
      second:[
        {
          d_name:['用户分析','订单分析'],
          d_value:['statistic/userAnalyse.html?'+Math.random(),'statistic/orderAnalyse.html?'+Math.random()],
          d_id:['s1101','s1102']
        },
        {
          d_name:['商品列表'],
          d_value:['goods/goodsList.html?'+Math.random()],
          d_id:['s1201']
        },
        {
          d_name:['卡券审核','卡券数据','核销数据','添加商户'],
          d_value:['ticket/audTicket.html?'+Math.random(),'manager/data/ticketData.html?'+Math.random(),'manager/data/verifiData.html?'+Math.random(),'manager/add_shoper.html?'+Math.random()],
          d_id:['s1301','s1302','s1303','s1304']
        },
		{
		  d_name:['直充列表','直充订单'],
		  d_value:['recharge/rechargeList.html?'+Math.random(),'recharge/rechargeOrder.html?'+Math.random()],
		  d_id:['s1401','s1402']
		},
        {
          d_name:['权益列表','权益订单'],
          d_value:['legal/legalList.html?'+Math.random(),'legal/legalOrder.html?'+Math.random()],
          d_id:['s1501','s1502']
        },
		{
		  d_name:['商品订单','卡券订单','花花卡订单'],
		  d_value:['order/goodsOrder.html?'+Math.random(),'order/orderList.html?'+Math.random(),'order/order_hhk.html?'+Math.random()],
		  d_id:['s1601','s1602','s1603']
		},
        {
          d_name:['用户管理','轮播管理','消费返利','邀请返现'],
          d_value:['operate/userManager.html?'+Math.random(),'operate/bannerManager.html?'+Math.random(),'operate/consumptionRebate.html?'+Math.random(),'operate/invitationCashback.html?'+Math.random()],
          d_id:['s1701','s1702','s1703','s1704']
        },
        {
          d_name:['兑换专区','限时抢购','热门推荐','花粉权益'],
          d_value:['activity/exchangeArea.html?'+Math.random(),'activity/flashSale.html?'+Math.random(),'activity/hotRecommend.html?'+Math.random(),'activity/pollenRights.html?'+Math.random()],
          d_id:['s1801','s1802','s1803','s1804']
        },
        {
          d_name:['卡券专区','卡券分类','商家配置'],
          d_value:['configure/couponZone.html?'+Math.random(),'configure/couponType.html?'+Math.random(),'configure/businessConfiguration.html?'+Math.random()],
          d_id:['s1901','s1902','s1903']
        },
		{},
      ]
    },
    {
      name:['我的卡券','数据查看'],value:['',''],id:['s101','s102'],
      second:[
        {
          d_name:['卡券列表','外部券','内部券'],
          d_value:['ticket/myTicket.html?'+Math.random(),'ticket/applyTicket_third.html?'+Math.random(),'ticket/applyTicket_self.html?'+Math.random()],
          d_id:['s2101','s2102','s2103']
        },
        {
          d_name:['卡券数据','核销数据'],
          d_value:['shop/data/ticketData.html?'+Math.random(),'shop/data/verifiData.html?'+Math.random()],
          d_id:['s2201','s2202']
        },
      ]
    },
    {name:['我的商户','数据查看'],value:['agent/shoplist.html?'+Math.random(),'agent/data.html?'+Math.random()],id:['d01','d02']},
  ];
  var html='';
  for(var len=0;len<menuList[role].name.length;len++){
    html+='<li class="layui-nav-item" id="'+menuList[role].id[len]+'"><a class="" href="javascript:;" linkTo="'+menuList[role].value[len]+'">'+menuList[role].name[len]+'</a>';
    if(menuList[role].second!=undefined){
      if(menuList[role].second[len].d_name!=undefined){
          html+='<dl class="layui-nav-child">';
       
        for(var i =0;i<menuList[role].second[len].d_name.length;i++){
          if(i==0&&len==0){
            html+='<dd class="layui-this">';
          }else{
            html+='<dd>';
          }
          // html+='<dd>';
          html+='<a href="javascript:;"  id="'+menuList[role].second[len].d_id[i]+'" linkTo="'+menuList[role].second[len].d_value[i]+'">'+menuList[role].second[len].d_name[i]+'</a></dd>'
        }
      }
      html+='</dl></li>';
    }

  }
  $(".layui-nav-tree").html(html);

  //动态配置菜单之后再初始化element  导航的hover效果、二级菜单等功能，需要依赖element模块
  element.init();
  // $(".layui-nav-tree li").eq(0).addClass('layui-this');
  // $("#iframe").attr("src",menuList[role].value[0]);
  if(role==0){
    $("#iframe").attr("src",'statistic/userAnalyse.html?'+Math.random());
    $("#s1101").addClass('layui-this');
    $("#m01").addClass('layui-nav-itemed');
  }else if(role==1){
   $("#iframe").attr("src",'ticket/myTicket.html?'+Math.random());
  }
  

  //切换菜单
  $(".layui-nav-tree").on("click","a",function(){
    var $src = $(this).attr("linkTo");
    if(!$src=="")
    $("#iframe").attr("src",$src);
  });

  //退出登录
  $(".log-out").click(function(){
    var _this = $(this);
    //询问是否退出登录
      layer.open({
        content: '确定退出登录？'
        ,btn: ['退出', '取消']
        ,yes: function(index, layero){
          $.ajax({
              type: "get",
              url: basePath+'/sys/account/logout',
              contentType: "application/json",
              dataType: 'json',
              beforeSend: function (xhr) {
                 xhr.setRequestHeader('token', token);
              },
              success: function(data) {
                if(data.resultCode==0){
                  localStorage.removeItem('role');
                  localStorage.removeItem('token');
                  window.location.href="/cms/login.html?rdm="+Math.random();
                }else if(data.resultCode==3){
                    localStorage.removeItem('role');
                    localStorage.removeItem('token');
                    window.location.href="/cms/login.html?rdm="+Math.random();
                }else{
                  layer.msg(data.resultMsg, {icon: 5});
                }
              },
              error: function() {
                // layer.msg("网络异常，请稍后再试！", {icon: 5});
                localStorage.removeItem('role');
                localStorage.removeItem('token');
                top.location.href="/cms/login.html?rdm="+Math.random();
              }
          });
        }
        ,btn2: function(index, layero){
          _this.parent("li").removeClass('layui-this');
        }
        ,cancel: function(){ 
          _this.parent("li").removeClass('layui-this');
        }
      });
  })


});






//设置token
//headers: {token: 'sasasas'}
// beforeSend: function (xhr) {
//  xhr.setRequestHeader('token', "token");
// }

// xhr.setRequestHeader("token","header-token-value"); // 可以定义请求头带给后端
// xhr.setRequestHeader("dingyi","header-dingyi-value");
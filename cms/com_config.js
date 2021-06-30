//JavaScript代码区域
//李明
// var basePath ="http://192.168.1.147:7788";
//lhc
var basePath ="http://192.168.1.173:7788";
//测试
// var basePath =" http://192.168.3.70:7788";
//李玉芳
// var basePath =" http://192.168.1.118:7788";
//刘惠春
// var basePath =" http://192.168.1.173:7788";

//线上
// var basePath = "http://vp.wifi8.com:7788";
var userId = localStorage.getItem('userId');
var role = localStorage.getItem('role');
var token = localStorage.getItem('token');
var userName = localStorage.getItem('userName');
var banerImage;


layui.use(['jquery','element','layer', 'form','upload','laypage'], function(){
	var element = layui.element
    ,$ = layui.$  //重点之处。 引入jquery
    ,layer = layui.layer
    ,form = layui.form
    ,upload = layui.upload
    ,laypage = layui.laypage;

    //配置弹窗风格
	layer.config({
	  anim: 1, //默认动画风格
	  skin: 'layui-layer-molv', //默认皮肤
	});

  $(".user-name span").text(userName);

   //返回
   $(".layui-btn-back").click(function(){
      var history_src = localStorage.getItem('history_src');
      $("#iframe", window.parent.document).attr("src",history_src);
      return false;
  })

	form.verify({  
	    zhengshu : [/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$|0$/,'必须大于等于0'], 
	    Number : [/^\+?[1-9][0-9]*$/,'必须为正整数'],
      isTwoDecimalsFloat:[/^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,'请输入最多为两位小数的数值'],
      disRate:[/^100$|^(\d|[1-9]\d)$/,'必须为0-100的正整数'],
    });

});
    
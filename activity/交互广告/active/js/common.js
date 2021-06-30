var preUrl = "http://192.168.3.70/";  //http://192.168.201.178
var random='111';//中奖随机数 ,分解金豆获取钢镚'000','111','222'，
var platform =1;  // 1： android  2:  ios
var appkey = ""; //获取地址栏appkey参数
var uid = "";

//关闭弹窗
$(".close-btn,.confirm-btn").click(function(){
	var $this = $(this);
	$this.parents(".forms-wrap").addClass('hidden');
	setTimeout(function(){
		$this.parents(".forms-wrap").hide();
		$(".white-formsbg-black").hide();
	},800);
});

//互动广告获取数据
function getAd(appkey,activeType,platform,time){
	
	if(appkey!=""||appkey!="undefined"){	
		//发起请求
		//countType 计数类型  1：发起请求 2：请求成功 3：曝光 4：点击 5：奖品页点击
		ajaxAdCount(appkey,0,1);
		
		 //uid 存在cookies里面 key appkey_activeType_uid
		 uid = cookie.getCookie("uid");
		 if(uid=='' || undefined == uid){
			uid = guid();
			cookie.setCookie("uid",uid);		
		 }
		
		//获取广告
		var param = buildParam(appkey,activeType,platform,time,uid);
	    $.ajax({
	        url : preUrl+"active/ad",
	        type: 'post',
	        data:param,
	        async:false,
	        success  : function(res) {
				if(res.resultCode==0 && res.data!=null && undefined != res.data){
					//console.info("ad data:"+res);
					//有广告		
					//请求成功	
					ajaxAdCount(appkey,res.data.adId,2);	
					
					//弹出弹框，写入广告信息，曝光					
					$("#awards_title_id").text(res.data.title);
					$("#awards_subTitle_id").text(res.data.subTitle);
					$("#awards_btnTitle_id").text(res.data.btnTitle);
					$("#award_img_id").find("img").attr("src",res.data.resUrl);
					$("#awards_btnTitle_id").attr("tagers",res.data.clickList);
					$("#awards_btnTitle_id").attr("appkey",appkey);
					$("#awards_btnTitle_id").attr("adId",res.data.adId);
					$("#award_img_id").attr("href",res.data.actionInfo);
					$("#awards_btnTitle_id").attr("href",res.data.actionInfo);
					
					//展示曝光弹窗
					if(activeType<4){
						setTimeout(function(){$(".white-formsbg-black,.awards").removeClass('hidden').show()},time);
					}else{
						setTimeout(function(){
							$("#prize-popupWrap").show();
						},time);
					}
					
					//曝光	
					ajaxAdCount(appkey,res.data.adId,3);				
					//第三方 曝光
					showUrl(res.data.showList)

				}else{
					//没有广告 提示框
					random='123';//中奖随机数 ,分解金豆获取钢镚'000','111','222'，
					switch(activeType)
						{
						    case 4:
						        setTimeout(function(){
									$(".prize-word").html("<p>挑战失败，</p><p>再来尝试一次吧！</p>");
									$("#prize-numWrap").show();
								},time);
						        break;
						    case 5:
						        setTimeout(function(){
									$("#prize-numWrap").find('.prize-num').attr("class","prize-num prize-numSb");
									$("#prize-numWrap").show();
								},time);
						        break;
						    default:
						        setTimeout(function(){
									$(".end-failed-con .t1").html("挑战失败，<br /> 再来尝试一次吧！");
									$(".white-formsbg-black,.end-failed").removeClass('hidden').show();
								},time);
						}
					
				}
				
	        }
	    });

	  
	}
}

//今日剩余次数  key = appkey_activeType
function todayNums(appkey,activeType){	
	 var _value = false;
	 var key = appkey+"_"+activeType;
	 var x_count = cookie.getCookie(key);
	 if(x_count!=null && undefined != x_count){
		if(x_count>0){
			x_count = x_count-1;
			cookie.setCookie(key,x_count);
			_value = true;
		}
	 }else{
		x_count=7;
		cookie.setCookie(key,x_count);
		_value = true;
	 }
	$(".today-nums em").text(x_count);
	return _value;
}

// 收集参数--计数接口
function countParam(appkey,adId,countType){
   var param = {};
   param["appkey"] = appkey;
   param["adId"] = adId;
   param["countType"] = countType;
   return JSON.stringify(param);
}
// 收集参数 --获取广告
function buildParam(appkey,activeType,platform,time,uid){
   var param = {};
   param["appkey"] = appkey;
   param["activeType"] = activeType;
   param["platform"] = platform;
   param["time"] = time;
   param["uid"] = uid;
   return JSON.stringify(param);
}


//上报计数
function ajaxAdCount(appkey,adId,countType){
  var param = countParam(appkey,adId,countType);
  //console.info("param="+param);
  $.ajax({
	url : preUrl+"active/count",
	type: 'post',
	data:param,
	success  : function(res) {

	}
  });
}

//第三方上报曝光点击
function ajaxCom(clickUrl){
  $.ajax({
	  url : clickUrl,
	 // type: "post",
	  dataType:"jsonp"
	 // jsonp: 'callback', 
	//  success  : function(data) {	
	// }
  });
}

// 第三方 曝光监控
function showUrl(urlList){	
	if(urlList!=null && undefined != urlList){	
		var length = urlList.length;
		console.log("上报曝光 length="+length);		
		for(var i = 0;i<length;i++){
		  ajaxCom(urlList[i]);
		}
	}
}

// 上报点击 第三方 曝光
$("#awards_ad_id").on("click",".click-link",function(){	
	var appkey = $("#awards_btnTitle_id").attr("appkey");
	var adId = $("#awards_btnTitle_id").attr("adId");	
	$(this).parents(".forms-wrap").addClass('hidden').hide();
	$(this).parents(".prize-popupWrap").hide(); //关闭彩球弹窗
	$(".white-formsbg-black").hide();
	//上报点击
	ajaxAdCount(appkey,adId,4);	
	//第三方 点击监控
	var tagers = $(".click-get").attr("tagers");	
	if(tagers!=null && undefined != tagers){	
		var urlList = tagers.split(",");
		var length = urlList.length;
		//console.info(typeof(urlList)+" : typeof urlList");
		console.log("上报点击length="+length);		
		for(var i = 0;i<length;i++){
		  ajaxCom(urlList[i]);
		}
	}
});

//我的奖品点击
$("#awards_list_id").on("click",".awards-link",function(){
	var adId = $(this).attr("adId");
	var appkey = $(this).attr("appkey");
	//上报计数
	ajaxAdCount(appkey,adId,5);
});

//我的奖品
function myawards(activeType){
	window.location.href = 'my_awards_v1.html?activeType='+activeType+"&appkey="+appkey+"&uid="+uid;
}
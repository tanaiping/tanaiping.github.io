var net_address = "http://xsyl.sljoy.cn/";
var availableTags = [];
var export_json = ""; //出口详情json
function loadStation(){
	var keyword="";
	var param = buildParam(keyword);
	$.ajax({
        url : net_address+"/v1/metro/getSiteByKeyword",
        type: 'post',
        data:param,
        success  : function(res) {
        		 // console.log(res);
        		if(res.resultCode==0){
        			console.log(res.data.length+"站点个数");
        			for(var i=0;i<res.data.length;i++){
        				availableTags.push(res.data[i].siteName);
        			}
			        $("#start_line").autocomplete({
			          source: availableTags
			        });
			         $("#end_line").autocomplete({
			          source: availableTags
			        });
			        $("#end_station").autocomplete({
			          source: availableTags
			        }); 
			        $("#toilet_station").autocomplete({
			          source: availableTags
			        }); 
			        $("#out_station").autocomplete({
			          source: availableTags
			        });
			        
			}
    	}
    });

    // 收集参数
	function buildParam(keyword){
	   var param = {};
	   var keyword = keyword;
	   param["keyword"] = keyword;
	   return JSON.stringify(param);
	}
	
}

//获取线路ID
function getLineId(cityId){
	var param = buildParam(cityId);
	$("#lines-con").empty();

	$.ajax({
        url : net_address+"/v1/metro/lineList",
        type: 'post',
        data : param,
        success  : function(res) {
	        if(res.resultCode==0){
			    var html="";
			    var selectObj = $(".start-line select");   //站点查询下拉框
			    selectObj.append('<option value="-1" lineId="-1">全部线路</option>');
				for(var i=0;i<res.data.length;i++){
					if("i==0"){
						html+=' <li class="act" lineId="'+res.data[i].lineId+'"><em class="line'+(i+1)+'"></em><div class="t3">'+res.data[i].lineName+'</div></li>'
					}else{
						html+=' <li><em class="line'+(i+1)+'" lineId="'+res.data[i].lineId+'"></em><div class="t3">'+res.data[i].lineName+'</div></li>'
					}
					selectObj.append('<option value="'+i+'" lineId="'+res.data[i].lineId+'">'+res.data[i].lineName+'</option>');
				}
				$("#lines-con").append(html);
	        }
    	}
    });

	// 收集参数
	function buildParam(cityId){
	   var param = {};
	   var cityId = cityId;
	   param["cityId"] = cityId;
	   return JSON.stringify(param);
	}
}
//根据线路查站点列表
function lookLine(lineId,type){
	var param = buildParam(lineId,type);
	// console.log(param);
	$.ajax({
        url : net_address+"/v1/metro/lineSiteList",
        type: 'post',
        data : param,
        success  : function(res) {
        		console.log(res);
        		if(res.resultCode==0){
	        		var len = res.data.siteList.length;
	        		var lineTimes = res.data.lineTime.split("##");
	        	   $("#station-info").empty();
				    $(".main-info .t1").text(res.data.lineName);
				    $(".main-info .t2 .start").text(res.data.siteList[0].siteName);
				    $(".main-info .t2 .end").text(res.data.siteList[len-1].siteName);
				    if(type==1){
				    	$("#schedule_tims").html(lineTimes[0]);
				    }else{
				    	$("#schedule_tims").html(lineTimes[1]);
				    }
				    for(var i=0;i<len;i++){
				    	var html="";
				    	if(res.data.siteList[i].type==4){
				    		html+='<li class="lines-change">'+res.data.siteList[i].siteName+'</li>'
				    		if(i<len-1){
				    			html+='<li class="lines-line"><em></em><span class="change-info">'+res.data.siteList[i].transDesc+'</span></li>';
				    		}else{
				    			html+='<li class="lines-line"><span class="change-info">'+res.data.siteList[i].transDesc+'</span></li>';
				    		}
				    	}else {
				    		html+='<li class="lines-nochange">'+res.data.siteList[i].siteName+'</li>'
				    		if(i<len-1){
				    			html+='<li class="lines-line"><em></em></li>'
				    		}
				    	}
				    	
				    	$("#station-info").append(html);
				    }
				$(".lines-list").css("height",$(".lines-detail").height()); 
			}
    	}
    });

	// 收集参数
	function buildParam(lineId,type){
	   var param = {};
	   param["lineId"] = lineId;
	   param["type"] = type;
	   return JSON.stringify(param);
	}
}

//根据线路查站点列表
var stationList = [];
function getStationList(lineId,type){
	var param = buildParam(lineId,type);
	$.ajax({
        url : net_address+"/v1/metro/lineSiteList",
        type: 'post',
        data : param,
        async:false,
        success  : function(res) {
        	if(res.resultCode==0){
	        	var len = res.data.siteList.length;
	        	 for(var i=0;i<len;i++){
	        	 	stationList.push(res.data.siteList[i].siteName);
	        	 }
			}
    	}
    });

	// 收集参数
	function buildParam(lineId,type){
	   var param = {};
	   param["lineId"] = lineId;
	   param["type"] = type;
	   return JSON.stringify(param);
	}
}


//时刻表页面
function schedule(lineId,type){
	var param = buildParam(lineId,type);
	$.ajax({
        url : net_address+"/v1/metro/lineSiteList",
        type: 'post',
        data : param,
        async:false,
        success  : function(res) {
	        if(res.resultCode==0){
	        	var siteNum = res.data.siteList.length-1;
	        	var lineList = [];
	        	var lineTimes = res.data.lineTime.split("##");
			    var html="";
			    if(type==1){

			    	html+='<li class="line'+lineId+'"><div class="station-work-time-box">';
			    	html+='<div class="subway-namebox"> <span>'+res.data.lineName+'</span></div>';
		        	html+='<div class="subway-timebox"><div class="direct"><img src="images/direct_ico.png" alt=""> <span>'+res.data.siteList[0].siteName+'</span></div>';
		        	html+='<div class="times">'+lineTimes[0]+'</div>';
		        	html+='</div>';
		        	html+='</div></li>';
		        	$("#time-list").append(html);
			    }else{

			    	html+='<div class="subway-timebox"><div class="direct"><img src="images/direct_ico.png" alt=""> <span>'+res.data.siteList[0].siteName+'</span></div>';
		        	html+='<div class="times">'+lineTimes[1]+'</div>';
		        	html+='</div>';
		        	$(".line"+lineId).find('.station-work-time-box').append(html);
			    }
	        	
				
	        }
    	}
    });

	// 收集参数
	function buildParam(lineId,type){
	   var param = {};
	   var lineId = lineId;
	   param["lineId"] = lineId;
	   param["type"] = type;
	   return JSON.stringify(param);
	}
}

//1 代表 上海      获取上海的所有线路时刻表
function showLinelist(cityId){
	var param = buildParam(cityId);
	$("#time-list").empty();

	$.ajax({
        url : net_address+"/v1/metro/lineList",
        type: 'post',
        data : param,
        async:false,
        success  : function(res) {
	        if(res.resultCode==0){
	        	console.log(res.data);
	        	var lineList = [];
			    var html="";
	        	for(var i=0;i<res.data.length;i++){
	        		lineList.push(res.data[i].lineId);
	        	}
	        	for(var i=0;i<lineList.length;i++){
	        		schedule(lineList[i],1);
	        		schedule(lineList[i],2);
	        	}
	        }
    	}
    });

	// 收集参数
	function buildParam(cityId){
	   var param = {};
	   var cityId = cityId;
	   param["cityId"] = cityId;
	   return JSON.stringify(param);
	}
}

	

//查看线路说明
$(".line-look").click(function(){
    var tag = $(this).attr("tag");
    var lineId =$("#lines-con li").eq(0).attr("lineId");
    //判断是否已占开查看线路按钮
    if(tag==1){
        $(this).attr("tag","0").find("img").attr("src","images/line_close.jpg");
        $(".line-switch").show();
    }else{
        $(this).attr("tag","1").find("img").attr("src","images/line_switch.jpg");
        $(".line-switch").hide();
    }
 	lookLine(lineId,1);
 	$("#switch-station").attr({"switchId":"2","lineId":lineId});
 	$(".lines-list li").removeClass('act').eq(0).addClass('act');
});

//查看”反向“线路说明
$("#switch-station").click(function(){
	var type = $(this).attr("switchId");
	var lineId =$(this).attr("lineId");
	lookLine(lineId,type);
	if(type==1){
		$(this).attr("switchId","2");
	}else{
		$(this).attr("switchId","1");
	}
})


//线路切换
$("#lines-con").on("click","li",function(){
	var lines_name = $(this).find('.t1').text();
	var index = $("#lines-con li").index(this);
	$("#lines-con li").removeClass('act').eq(index).addClass('act');
	var lineId =$(this).attr("lineId");
	lookLine(lineId,1);
	$("#switch-station").attr({"switchId":"2","lineId":lineId});
});







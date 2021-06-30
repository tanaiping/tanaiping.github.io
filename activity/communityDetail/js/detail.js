$(function(){
	var  commentId = '';
	var ismoreComment = false;
	var ismoreReply = false;
	var communityId = GetQueryString("communityId");
	initDetail();
	
	$("#carousel1").on("click",".carousel-item",function(){
		var index = $("#carousel1 .carousel-item").index(this);
		$('#carousel2').carousel(index);
		$("#carousel2").show();
		$("#carousel2,#carousel2 .carousel-inner,#carousel2 .carousel-item").css("height",$(window).height());
	})
	$("#carousel2").on("click",".carousel-item",function(){
		var index = $("#carousel2 .carousel-item").index(this);
		$("#carousel2").hide();
		$('#carousel1').carousel(index);
	})
	
	
	$("#carousel1").on("slide.bs.carousel",function(obj){
		var len = $("#carousel1").find(".carousel-item").length;
		var index = $(this).find('.carousel-item').index(obj.relatedTarget);
		$(".carousel-bottom").text((index+1)+"/"+len);
	})
	$("#carousel2").on("slide.bs.carousel",function(obj){
		var len = $("#carousel2").find(".carousel-item").length;
		var index = $(this).find('.carousel-item').index(obj.relatedTarget);
		$(".carousel-top").text((index+1)+"/"+len);
	})
	//加载更多评论
	$(".load-more").click(function(){
		if(!$(this).hasClass("no-more")){
			communityId = $("#commentList .comment-elem").last().attr("communityId")
			initDetail(communityId)
		}
	})
	//提示用浏览器打开
	$(".store,.conmunity-input,#zanCnt,#commentCnt,#shareCnt").click(function(){
		$('.blackbg, .wx_share').show();
	})
	$("#commentList").on("click",".comment-zan",function(obj){
		$('.blackbg, .wx_share').show();
	})
	
	$('.blackbg, .wx_share').click(function(){
		$('.blackbg, .wx_share').hide();
	})
	$(".comment-input input").focus(function(){
		$('.blackbg, .wx_share').show();
	})
	
	$("#commentList").on("click",".spread-icon",function(obj){
		var nid =$(this).parents(".comment-elem").attr("communityid");
		var tid = $(this).attr("talkid");
		var replyNum = $(this).attr("replyNum")//已经加载回复条数
		$(this).remove();
		$(this).parents(".comment-elem").append(getreply(nid,tid,replyNum));
	})
	
	function initDetail(com_id){
		var params = {
			"baseInfo":{
				"versionCode":471,
				"sign":"0f100c8b4be5b6fc6b5da6e0f1be5c40",
				"deviceCode":"08a421f30b2179d58c6491a4be871f35",
				"userId":"856445858030292992",
				"platform":2,
			},
			"communityId":communityId,
			"commentId":com_id,
		}
		getDatanormal("post",baseUrl2+'/uSystem/v100/community/detailInfo', "json", JSON.stringify(params), true, function (res) {
		  if (res.resultCode == 0) {
			  var obj = res.data;
			  if(com_id == ''||com_id == undefined){
				if(obj.imgList&&obj.imgList.length>0){
					 obj.imgList.forEach(function(item,i){
						 $("#carousel1 .carousel-inner").append('<div class="carousel-item"><img src="'+item+'" class="d-block w-100" alt="..."></div>');
						 $("#carousel2 .carousel-inner").append('<div class="carousel-item"><div class="item-box"><img src="'+item+'" class="d-block w-100" alt="..."></div></div>');
					 });
					 $(".carousel-bottom").text("1/"+obj.imgList.length);
					 $(".carousel-top").text("1/"+obj.imgList.length);
					  $('#carousel1 .carousel-item').eq(0).addClass("active");
					  $('#carousel2 .carousel-item').eq(0).addClass("active");
					 $('#carousel1').carousel();
				}
				
				$("#headUrl").attr("src",obj.headUrl)
				$("#nickName").text(obj.nickName)
				$("#createTime").text(obj.createTime)
				if(obj.isFavorites ==1){
					$(".store").addClass("act")
				}
				$("#title").text(obj.title)
				if(obj.tagList&&obj.tagList.length>0){
					obj.tagList.forEach(function(item,i){
						$("#tagList").append("<span>"+item+"</span>")
					});
					
				}
				 $("#content").html(obj.content)
				 $("#zanCnt").text(obj.zanCnt)
				 $("#commentCnt").text(obj.commentCnt)
				 console.log(obj.commentCnt)
				 $(".community-type span").text("("+obj.commentCnt+")")
				 $("#shareCnt").text(obj.shareCnt)
				 $("#locationUrl").attr("src",obj.locationUrl)
				 $("#cityName").text(obj.cityName)
				 $("#locationName").text(obj.locationName)
				 $("#adress").attr("adress",obj.adress)
				 $("#commentList").attr("commentCnt",obj.commentCnt)
				 
				 
				 shareData.title = obj.title;
				 shareData.text = $("#content").text();
				 openNfygApp(communityId);
			 }
			 
			 loadCommentList(obj.commentList)
			 
			 
		  } else {
		    promptShow(res.resultMsg);
		  }
		})
	}
	
	function loadCommentList(arr){
		if(arr&&arr.length>0){
			var html = ''
			arr.forEach(function(item,i){
				html +='<div class="comment-box comment-elem" communityId = "'+item.commentId+'">'+
						'<div class="comment-head flex-between">'+
							'<div class="comment-left flex-row">'+
								'<img src="'+item.headUrl+'" alt="" >'+
								'<div class="comment-info flex-col">'+
									'<div class="comment-nickname" >'+item.nickName+'</div>'+
									'<div class="comment-date">'+item.createTime+'</div>'
				if(item.zanStatus ==1){
					html +='</div></div><div class="comment-zan flex-row"><em class="ico act"></em><span>'+item.zanCnt+'</span></div></div>'
				}else{
					html +='</div></div><div class="comment-zan flex-row"><em class="ico"></em><span>'+item.zanCnt+'</span></div></div>'
				}
				html +='<div class="comment-con">'+item.content+'</div>'
				html += getreply(item.commentId,'',0);
				html +='<div class="line-box"></div>'
				html +='</div>'
							
			});
			var num = parseInt($("#commentList").attr("num"))+arr.length;
			var commentCnt = $("#commentList").attr("commentCnt")
			$("#commentList").attr("num",num)
			if(num=commentCnt){
				$(".load-more").addClass("no-more").text("没有更多评论~")
			}
						
			$("#commentList").html(html);
			
		}else{
			$(".load-more").addClass("no-more").text("没有更多评论~")
		}
	}
	
	function getreply(nid,talkId,num){
		var html = ''
			var params = {
				"baseInfo":{
					"versionCode":471,
					"sign":"0f100c8b4be5b6fc6b5da6e0f1be5c40",
					"deviceCode":"08a421f30b2179d58c6491a4be871f35",
					"userId":"856445858030292992",
					"platform":2,
				},
				"nid":nid,
				"talkId":talkId
			}
			
			getDatanormal("post",baseUrl2+'/uSystem/v100/community/commenttalk/list', "json", JSON.stringify(params), false, function (res) {
			  if (res.resultCode == 0) {
				  var obj = res.data;
				  if(obj){
					  
					  var talkId = '';
					  var talkResultNum = 0;
					  if(obj.commentTalkResults&&obj.commentTalkResults.length>0){
						  obj.commentTalkResults.forEach(function(item,i){
							  html +='<div class="comment-box">'+
								'<div class="comment-head flex-between">'+
									'<div class="comment-left flex-row">'+
										'<img src="'+item.fromHeadUrl+'" alt="">'+
										'<div class="comment-info flex-col">'+
											'<div class="comment-nickname">'+item.fromNickName+'</div>'+
											'<div class="comment-date">'+item.createTime+'</div>'
										if(item.zanStatus ==1){
											html +='</div></div><div class="comment-zan flex-row"><em class="ico act"></em><span>'+item.zanCnt+'</span></div></div>'
										}else{
											html +='</div></div><div class="comment-zan flex-row"><em class="ico"></em><span>'+item.zanCnt+'</span></div></div>'
										}
								if(item.level==4){
									html+='<div class="comment-con">@'+item.targetNickName+':'+item.content+'</div></div>'
								}else{
									html+='<div class="comment-con">'+item.content+'</div></div>'
								}
							talkId = item.talkId;
						  })
						  talkResultNum = obj.commentTalkResults.length+num//当前已经加载的回复数
					  }
					  if(obj.commentCnt>talkResultNum){//总条数>回复数
						  html+='<span class="spread-icon" talkId = '+talkId+' replyNum = "'+talkResultNum+'">展开更多</span>'
					  }
					  
				  }
				 
				 
			  } else {
			    promptShow(res.resultMsg);
			  }
			})
		return html;
	}
	
	
})
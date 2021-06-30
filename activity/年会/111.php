<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta http-equiv="Cache-Control" content="no-cache" />
		<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
		<meta name="MobileOptimized" content="240" />
		<meta name="apple-touch-fullscreen" content="YES" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta content="telephone=no" name="format-detection" />
		<meta content="email=no" name="format-detection" />
		<!-- uc强制竖屏 -->
		<meta name="screen-orientation" content="portrait">
		<!-- QQ强制竖屏 -->
		<meta name="x5-orientation" content="portrait">
		<!-- UC强制全屏 -->
		<meta name="full-screen" content="yes">
		<!-- QQ强制全屏 -->
		<meta name="x5-fullscreen" content="true">
		<!-- UC应用模式 -->
		<meta name="browsermode" content="application">
		<!-- QQ应用模式 -->
		<meta name="x5-page-mode" content="app">
		<!-- windows phone 点击无高光 -->
		<meta name="msapplication-tap-highlight" content="no">
		<!-- 适应移动端end -->
		<title>2018关键之战，“心”出发</title>

		<link rel="stylesheet" href="/public/annualMeeting/css/annualMeeting.css">
	</head>
	<body style="background: #0e0546;">
		<div class="main-wrap reward-wrap">
			<div class="rewardBox"> 
				<div class="rewardImg">
					<div class="reward-headImg">
						<img src="<?=base_url($info['img'])?>" />
					</div>
					<!--<p>表演部门</p>-->
					<div class="reward-words">
						<div style="height: 1.98rem;overflow: hidden;">
							<p class="reward-title">表演部门</p>
							<p><?=$info['core']?></p>
							<span>表演人员：<em><?=$info['participants']?></em></span>
							<span><em></em></span>
						</div>
						<!-- 打赏按钮  -->
						<div class="reward-bt"></div>
						<div class="reward-listWrap">
							<ul class="reward-list" style="position: relative;">
								<?php if (!empty($list)): ?>
									<?php foreach ($list as $key => $item): ?>
										<?php $data=json_decode($item,true);?>
										<li><?=$data['context']?></li>
									<?php endforeach; ?>
								<?php endif; ?>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 弹窗 -->
		<div class="main-wrap popup-wrap" style="display: none">
			<!-- 免费打赏 -->
			<div class="popup-content" id="contentBox" style="display: none;">
				<div class="contentBox">
					<p>温馨提示</p>
					<p>您可以为本节目进行打赏（免费）</p>
					<p>剩余免费打赏次数：<span><em id="number"><?=10-$number?></em>次</span></p>
					<div class="popup-btWrap fl_start">
						<button class="cancel">取消</button>
						<button class="ok">我要打赏</button>
					</div>
				</div>
			</div>
			
			<!-- 打赏成功 -->
			<div class="popup-content" id="contentBox2" style="display: none;">
				<div class="contentBox">
					<p>温馨提示</p>
					<p>您的热情我们已经收到了！</p>
					<p>每个人打赏上限为<span><em>30</em>次</span>，请期待评选结果</p>
					<div class="popup-btWrap popup-btWrap2 fl_start">
						<button class="cancel">我知道了</button>
					</div>
				</div>
			</div>	
			<!-- 付费打赏 -->
			<div class="popup-content popup-content3"  id="contentBox3" style="display: none">
				<div class="contentBox contentBox3">
					<p>温馨提示</p>
					<p>您将为该节目打赏<span>10</span>元</p>
					<p>打赏金额将在年会之后向您收取</p>
				</div>
				<p class="num">您已累计赏金（所有节目）：<?=$number*10?>元</p>
				<div class="popup-btWrap popup-btWrap3 fl_start">
					<button class="cancel">取消</button>
					<button class="ok">我要打赏</button>
				</div>
			</div>

			<!-- 打赏成功 -->
			<div class="popup-content" id="contentBox4" style="display: none;">
				<div class="contentBox">
					<p>打赏成功</p>
					<p>感谢您对该节目的支持</p>
					<p>敬请期待最终的票选结果！</p>
					<div class="popup-btWrap popup-btWrap2 fl_start">
						<button class="cancel">我知道了</button>
					</div>
				</div>
			</div>	
			<!-- 打赏失败 -->
			<div class="popup-content" id="contentBox5" style="display: none;">
				<div class="contentBox">
					<p>打赏失败</p>
					<p>请稍后在试</p>
					<div class="popup-btWrap popup-btWrap2 fl_start">
						<button class="cancel">我知道了</button>
					</div>
				</div>
			</div>
		</div>
		
		<script src="/public/annualMeeting/js/jquery1.42.min.js"></script>
		<script src="/public/annualMeeting/js/jquery.SuperSlide.2.1.1.js"></script>
		<script src="/public/annualMeeting/js/commonUtil.js"></script>
		<script>
			
			$(function(){
				var number = '<?=$number?>';
				var id 	   = '<?=$info['id']?>';
				var name   = '<?=$info['name']?>';
				var li_pb = parseFloat($(".reward-list li").css("padding-bottom"));
				var top_val = parseFloat($(".reward-list li").css("height"))+li_pb;
				var append_num = 0;
				var li_num = $(".reward-list li").length;
				//$(".reward-listWrap").slide({mainCell:".reward-list",autoPlay:true,effect:"topMarquee",vis:7,interTime:50});
				
				//取消打赏
				$(".cancel").click(function(){
					$(".popup-wrap,#contentBox4").hide();
				})
				$(".reward-bt").click(function(){
					$(".popup-wrap").show();
					if(number<10){
						$("#contentBox").show();
					}else{
						$(".num").text('您已累计赏金（所有节目）：'+(number-10)*10+'元');
						$("#contentBox3").show();
					}
				})
				initSocket();
	            var ws;
	            ws = new WebSocket("ws://114.80.9.199:1997");
	            //链接服务器
	            ws.onopen = function(){
	                console.log("握手成功");
	            };
	            //监听消息
	            ws.onmessage = function(e){
	            	var pid  = e.data.substr(-1);
	            	if(pid == id){
	            		$(".reward-list").append('<li>'+e.data.substr(0,e.data.length-1)+'</li>');
	            		li_num++;
	            		console.log(li_num+"====append_num"+append_num+"====top_val"+top_val);
	            		if(li_num>7){
	            			console.log("gogogo"+li_num);
	            			append_num++;
						  $(".reward-list").animate({top:-append_num*top_val+"px"},200);
						}
	            	}
	            };
	            ws.onerror = function(){
	                console.log("error");
	            };

	            ws.onclose = function(){
	                console.log("关闭"); 
	            }

	            function initSocket() {
                	//alert(window.WebSocket);
	                if (!window.WebSocket) {
	                    commonUtils("您的浏览器不支持websocket！");
	                    return false;
	                }
	            }

				$(".ok").click(function(){
					$("#contentBox,#contentBox2,#contentBox3").hide();
					$.ajax({
						type: "post",
						dataType: "json",
						url: '<?=site_url('annualMeeting/vito')?>',
						data: {'pid':id,'pname':name},
						success: function(data) {
							if (data.code == 1) {
								$("#contentBox4").show();
								if(ws.readyState !== 1){
		                            ws.close();
		                            ws = new WebSocket("ws://114.80.9.199:1997");
		                        }
		                        ws.send(data.data.context);
		                        var num = parseInt($("#number").text());
								$("#number").text(num-1);
		    					number++;
		    					top_val = parseFloat($(".reward-list li").css("height"))+li_pb;
		    					li_pb = parseFloat($(".reward-list li").css("padding-bottom"));
		    					console.log(parseFloat($(".reward-list li").css("height"))+"===="+li_pb);
								//commonUtils.showPop2(data.msg);
							}else if(data.code == -2){
								$("#contentBox2").show();
							}else if(data.code == -1){
								$("#contentBox5").show();
							}
						}
					});
					//alert(number);
				})
			})
		</script>
	</body>
</html>

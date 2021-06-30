$(function(){
	change();
	var activeType = 5;
	appkey = GetQueryString("appkey");
	 var init_count = cookie.getCookie(appkey+"_"+activeType);
	 if(init_count!=null && undefined != init_count){
		$(".today-nums em").text(init_count)
	 }else{
		init_count=8;
		$(".today-nums em").text(8)
	 }
	 
	 //uid 存在cookies里面 key appkey_activeType_uid
	  uid = cookie.getCookie("uid");
	 console.info("uid init:"+uid);
	 if(uid=='' || undefined == uid){
		uid = guid();
		cookie.setCookie("uid",uid);			
	 }
	 console.info("uid:"+uid);

 	//抽奖
	$(".snacks-bt a").click(function(){
		var $this = $(this);
		if(!$this.hasClass('disabled')){
			var count = cookie.getCookie(appkey+"_"+activeType);
			 if(count==null || undefined == count){
				count=8;
			 }
			 if(count>0){
			 	$this.addClass('disabled');
				if($(".dice .dice-content").hasClass("snacks-img") == true){
					$(".dice .dice-content").removeClass("snacks-img").addClass("moving");
				}else if($(".dice .dice-content").hasClass("snacks-img2") == true){
					$(".dice .dice-content").removeClass("snacks-img2").addClass("moving");
				}else if($(".dice .dice-content").hasClass("snacks-img3") == true){
					$(".dice .dice-content").removeClass("snacks-img3").addClass("moving");
				}else if($(".dice .dice-content").hasClass("snacks-img4") == true){
					$(".dice .dice-content").removeClass("snacks-img4").addClass("moving");
				}else if($(".dice .dice-content").hasClass("snacks-img5") == true){
					$(".dice .dice-content").removeClass("snacks-img5").addClass("moving");
				}else if($(".dice .dice-content").hasClass("snacks-img6") == true){
					$(".dice .dice-content").removeClass("snacks-img6").addClass("moving");
				}
				
				setTimeout(function(){
					change();
					handle(500);
					setTimeout(function(){$this.removeClass('disabled')},1000);
				},1000)
			 }else{
			 	handle(0);
			 	setTimeout(function(){$this.removeClass('disabled')},500);
			 }
		 }
	})

	function change(){
		var arr = ["snacks-img","snacks-img3","snacks-img4","snacks-img6","snacks-img5","snacks-img2"];
		var index = Math.floor(Math.random()*arr.length); 
		$(".dice .dice-content").removeClass("moving").addClass(arr[index]);
	}

	//获取广告处理入口
   function handle(time){
		 //今日剩余次数  key = appkey_activeType
		 var xxx = !todayNums(appkey,activeType);
		 console.log(xxx+"===")
		if(xxx){
			$("#prize-numWrap").find('.prize-num').attr("class","prize-num prize-num0");
			$("#prize-numWrap").show();
		} else {
			getAd(appkey,activeType,platform,time);
		}

   }

 })


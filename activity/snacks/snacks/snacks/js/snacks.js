$(function(){
	//封装过期控制代码
    function set(key,value){
        var myDate = new Date(); 
		var date_all =myDate.getFullYear()+"/"+(myDate.getMonth()+1)+"/"+myDate.getDate()+" 23:59:59";
		var deadTime = (new Date(date_all)).getTime(); //得到毫秒数
        localStorage.setItem(key,JSON.stringify({data:value,time:deadTime}));
        $(".today-nums em").text(count);
    }
    function get(key){
        var data = localStorage.getItem(key);
        var dataObj = JSON.parse(data);
        if (new Date().getTime()>dataObj.time) {
            alert('信息已过期');
            localStorage.removeItem('counts');
        }else{
            //console.log("data="+dataObj.data);
            //console.log(JSON.parse(dataObj.data));
            var dataObjDatatoJson = JSON.parse(dataObj.data)
            return dataObjDatatoJson;
        }
    }
    // localStorage.clear();
    // localStorage.removeItem('counts');
	change();
	var count=0;
	if(localStorage.getItem("counts")!=null){
		count = get("counts");
		$(".today-nums em").text(count);
	}else{
		count = 6;  //每天默认的次数
		set("counts",count);
	}
 	//抽奖
	$(".snacks-bt a").click(function(){
		var $this = $(this);
		// console.log(count+"fffffff");
		if(!$this.hasClass('disabled')){
			
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
					change(0);
					count--;
					$(".today-nums em").text(count);
					set("counts",count);
					setTimeout(function(){$this.removeClass('disabled')},1000);
				},1000)
			 }else{
			 	$("#prize-numWrap").find('.prize-num').attr("class","prize-num prize-num0");
				$("#prize-numWrap").show();
			 	setTimeout(function(){$this.removeClass('disabled')},500);
			 }
		 }
	})

	function change(index){
		var arr = ["snacks-img","snacks-img2","snacks-img3","snacks-img4","snacks-img5","snacks-img6"];
		if(index==undefined){
			var index = Math.floor(Math.random()*arr.length); 
			$(".dice .dice-content").removeClass("moving").addClass(arr[index]);
		}else{
			$(".dice .dice-content").removeClass("moving").addClass(arr[index]);
			if(index!=5){
				$("#prize-popupWrap").show();
			}else{
				 $("#prize-numWrap").find('.prize-num').attr("class","prize-num prize-numSb");
		 		 $("#prize-numWrap").show();
			}
		}
		
	}
	//没有抽奖次数
	// $("#prize-numWrap").find('.prize-num').attr("class","prize-num prize-num0");
	// $("#prize-numWrap").show();

	//抽奖失败
	// $("#prize-numWrap").find('.prize-num').attr("class","prize-num prize-numSb");
	// $("#prize-numWrap").show();

 })


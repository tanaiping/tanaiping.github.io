﻿/**  
 * @author xff 2017-11-21
 */
var commonUtils= function (){};

//判空
commonUtils.checkStr = function(vab){
	if (typeof(vab) == "undefined" || null==vab || "" == vab || "undefined" == vab) { 
	   return false;
	}
	return true;
}
//检查手机号码
commonUtils.checkPhoneNum = function(num) {
    var reg = /^0?1[3|4|5|7|8|9][0-9]\d{8}$/;
    return !!reg.test(num);
}

commonUtils.showPop2 = function(text,time,fontSize) {
    var time = time || 2000;
    var fontSize = fontSize || 14;
    var pop = $('#popInfo2');
    if(pop.length > 0){
        pop.hide();
        pop.text(text);
        pop.show();
        window.showPopTimer && clearTimeout(showPopTimer);
        window.showPopTimer = setTimeout(
            function(){
                pop.hide();
            }, time);
    } else {
        pop = $('<div class="popInfo2" id="popInfo2" style="position: fixed;z-index:9999;bottom: 13%;left: 21%;width:60%;line-height: 40px;height: 40px; background-color: rgba(0, 0, 0, 0.7);z-index: 8899;color: #F7F9EE;text-align: center; font-size: '+fontSize+'px; border-radius: 10px;">'+ text +'</div>').appendTo('body');
        window.showPopTimer = setTimeout(
            function(){
                pop.hide();
            }, time);
    }
}




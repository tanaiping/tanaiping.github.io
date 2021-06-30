//rem 设置
function Rem() {
var docEl = document.documentElement,
oSize = docEl.clientWidth / 37.5;

if (oSize > 20) {
oSize = 20; // 限制rem值 720 / 36 =20
}
//console.log(oSize);
docEl.style.fontSize = oSize + 'px';
}

function mainH(){
	var win_h = document.documentElement.clientHeight;
	var main_h =$(".main-wrap").height();
    $(".main-wrap").css("min-height",win_h+"px");
    if(win_h-main_h<26){
    	$(".footer").css({'position':'static','padding-top':'10px'});
    }
}
var commonUtils= function (){};
commonUtils.showPop2 = function(text,time,fontSize) {
    var time = time || 2000;
    var fontSize = fontSize || 16;
    var pop = $('#popInfo2');
    var blackbg = $(".formsbg-black");
    if(pop.length > 0){
        pop.hide();
        blackbg.hide();
        pop.text(text);
        pop.show();
        blackbg.show();
        window.showPopTimer && clearTimeout(showPopTimer);
        window.showPopTimer = setTimeout(
            function(){
                pop.hide();
                blackbg.hide();
            }, time);
    } else {
        pop = $('<div class="popInfo2" id="popInfo2" style="position: fixed;top: 40%;left: 15%;width:70%;line-height: 76px;height: 76px; background-color:#FFF;z-index: 8899;color: #222;text-align: center; font-size: '+fontSize+'px; border-radius: 10px;">'+ text +'</div>').appendTo('body');
        blackbg.show();
        window.showPopTimer = setTimeout(
            function(){
                pop.hide();
                blackbg.hide();
            }, time);
    }
}
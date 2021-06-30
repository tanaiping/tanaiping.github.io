//rem 设置
function Rem() {
var docEl = document.documentElement,
oSize = docEl.clientWidth / 36;

if (oSize > 20) {
oSize = 20; // 限制rem值 720 / 36 =20
}
//console.log(oSize);
docEl.style.fontSize = oSize + 'px';
}

function mainH(){
	var win_w = document.documentElement.clientWidth;
	if(win_w>750){
		win_w=750;
	}
    var main_h =parseFloat(win_w*1206/750);
    $(".main-wrap").css("height",main_h+"px");
}
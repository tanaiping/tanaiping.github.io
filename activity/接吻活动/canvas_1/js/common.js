$(function(){
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
	window.addEventListener('resize', Rem, false);
	Rem();

})


function toast(str){
	$("body").append('<div class="total-box"><span>'+str+'</span></div>');
	setTimeout(function(){$(".total-box").remove();},2000);
}
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


function GetQueryString(name){
 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
 var r = window.location.search.substr(1).match(reg);
 if(r!=null)return  unescape(r[2]); return null;
}

(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=750){
                docEl.style.fontSize = '20px';
            }else{
                docEl.style.fontSize = 20 * (clientWidth / 750) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
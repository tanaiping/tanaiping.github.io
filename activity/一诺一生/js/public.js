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
    function setSize(){
        Rem();
    }
    var commonUtils= function (){};
    commonUtils.showPop2 = function(text,time,fontSize) {
        var time = time || 2000;
        var fontSize = fontSize || 1.4;
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
            pop = $('<div class="popInfo2" id="popInfo2" style="position: fixed;top: 40%;left: 15%;width:70%;line-height: 3.5rem;height: 3.5rem; background-color:#000;z-index: 8899;color: #FFF;text-align: center; font-size: '+fontSize+'rem; border-radius: 5rem;">'+ text +'</div>').appendTo('body');
            blackbg.show();
            window.showPopTimer = setTimeout(
                function(){
                    pop.hide();
                    blackbg.hide();
                }, time);
        }
    }
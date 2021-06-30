$(document).ready(function () {
	    function debounce(func, wait, immediate) {
	        var timeout;
	        return function () {
	            var context = this, args = arguments;
	            clearTimeout(timeout);
	            timeout = setTimeout(function () {
	                timeout = null;
	                if (!immediate)
	                    func.apply(context, args);
	            }, wait);
	            if (immediate && !timeout)
	                func.apply(context, args);
	        };
	    }
	    ;
	    var winW = $(window).width(), winH = $(window).height(), winWHalf = winW / 2, winHHalf = winH / 2, $cont = $('.content'), $bg = $('.parallax'), contW = $cont.width(), contH = $cont.height(), bgW = $bg.width(), bgH = $bg.height(), diffX = (winW - contW) / 2, diffY = (winH - contH) / 2;
	    var finalX = 0, finalY = 0, finalBgX = 0, finalBgY = 0;
	    var moveContent = function (e) {
	        var x = e.pageX, y = e.pageY;
	        finalX = (x - winWHalf) * (contW / winW) / 2;
	        finalY = (y - winHHalf) * (contH / winH) / 2;
	        finalBgX = (x - winWHalf) * (bgW / winW) / 20;
	        finalBgY = (y - winHHalf) * (bgH / winH) / 20;
	        //$cont.css('transform', 'translate3D(' + (0 - finalX) + 'px, ' + (0 - finalY) + 'px, 0)');
	        $bg.css('transform', 'translate3D(' + (0 - finalBgX) + 'px, ' + (0 - finalBgY) + 'px, 0)');
	    };
	    $(document).on('mousemove', moveContent);
	    $(window).on('resize', function () {
	        winW = $(window).width();
	        winH = $(window).height();
	        winWHalf = winW / 2;
	        winHHalf = winH / 2;
	        contW = $cont.width();
	        contH = $cont.height();
	        bgW = $bg.width();
	        bgH = $bg.height();
	        diffX = (winW - contW) / 2;
	        diffY = (winH - contH) / 2;
	        moveContent({
	            pageX: winWHalf,
	            pageY: winHHalf
	        });
	    });
	});
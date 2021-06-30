"undefined" != typeof jQuery && !
function(t) {
    "use strict";
    t.imgpreload = function(n, e) {
        e = t.extend({},
        t.fn.imgpreload.defaults, e instanceof Function ? {
            all: e
        }: e),
        "string" == typeof n && (n = [n]);
        var a = [];
        t.each(n,
        function(s, i) {
            var o = new Image,
            c = i,
            r = o;
            "string" != typeof i && (c = t(i).attr("src") || t(i).css("background-image").replace(/^url\((?:"|')?(.*)(?:'|")?\)$/gm, "$1"), r = i),
            t(o).bind("load error",
            function(s) {
                a.push(r),
                t.data(r, "loaded", "error" != s.type),
                e.each instanceof Function && e.each.call(r, a.slice(0)),
                a.length >= n.length && e.all instanceof Function && e.all.call(a),
                t(this).unbind("load error")
            }),
            o.src = c
        })
    },
    t.fn.imgpreload = function(n) {
        return t.imgpreload(this, n),
        this
    },
    t.fn.imgpreload.defaults = {
        each: null,
        all: null
    }
} (jQuery),
$(function() {
    function t(t) {
        var n = new RegExp("(^|&)" + t + "=([^&]*)(&|$)"),
        e = window.location.search.substr(1).match(n);
        return null != e ? unescape(e[2]) : null
    }
    function n() {
        var n = t("hsfrom");
        //"xinqing" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "xinqing", "来源心情语录"]) : "ceshi" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "ceshi", "来源测试达人"]) : "sixiang" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "sixiang", "来源思想聚焦"]) : "jingdian" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "jingdian", "来源经典语录"]) : "huxinshu" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "huxinshu", "来源胡辛束"]) : "momo" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "momo", "来源陌陌"]) : "wangye" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "momoweixin", "来源陌陌微信"]) : "wangye" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "momoweibo", "来源陌陌微博"]) : "wangye" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "jiazhangke", "来源贾樟柯直发"]) : "Qzone01" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "Qzone01", "来源Qzone01"]) : "Qzone02" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "Qzone02", "来源Qzone02"]) : "Qzone03" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "Qzone03", "来源Qzone03"]) : "wangye" == $.trim(n) ? _hmt.push(["_trackEvent", "source", "wangye", "来源网页"]) : _hmt.push(["_trackEvent", "source", "others", "其它来源"])
    }
    function e() {
        q = q < Q ? q: Q;
        var t = q / 650;
        $(".p0-gate-wrap").css({
            width: 256 * t
        })
    }
    function a() {
        var t = $(".p1").width(),
        n = .935 * t,
        e = n / 1250;
        $(".p1-note1").css({
            bottom: 356 * e,
            left: 80 * e
        }),
        $(".p1-note2").css({
            bottom: 376 * e,
            left: 344 * e
        }),
        $(".p1-note3").css({
            bottom: 198 * e,
            left: 24 * e
        }),
        $(".p1-note4").css({
            bottom: 212 * e,
            left: 340 * e
        }),
        $(".p1-note5").css({
            bottom: 92 * e,
            left: 80 * e
        }),
        $(".scene-front").height(38 * e)
    }
    function s() {
        q = q < Q ? q: Q;
        var t = q / 650;
        $(".p11-loading").css({
            width: 519 * t
        })
    }
    function i() {
        //_hmt.push(["_trackEvent", "page", "p0", "进入初始页面"]),
        T = 1,
        $(".p0-hint").delay(8 * R).transition({
            x: "-50%",
            y: "-50%"
        },
        1e3)
    }
    function o() {
        $(".btn-start").removeClass("btn-pressed"),
        $(".p0-hint").transition({
            x: "-50%",
            y: "50%"
        },
        1e3,
        function() {
            $(".p0-gate-left").delay(500).transition({
                x: "-70%"
            },
            1500, ""),
            $(".p0-gate-right").delay(500).transition({
                x: "70%"
            },
            1500, "", c)
        })
    }
    function c() {
        $(".p0").transition({
            scale: 8,
            y: "-10%"
        },
        3e3, "linear"),
        $(".p0").delay(30 * R).fadeOut(5 * R),
        $(".p1").delay(30 * R).fadeIn(5 * R, r)
    }
    function r() {
        //_hmt.push(["_trackEvent", "page", "p1", "进入页面1"]),
        $(".p1 .mask").css({
            opacity: 0
        }).delay(500).transition({
            "z-index": "99980",
            opacity: 1
        },
        1e3);
    }
    function u() {
        $(this).transition({
            opacity: 0
        },
        1e3,
        function() {
            $(this).css({
                "z-index": "-99980"
            }),
            g($(".p1"))
        })
    }
    function p(t) {
        for (var n = 0; n < 9; n++) if (t <= H[n]) {
            //$(".p11-result-title").attr("src", S + "img/p11result" + n + "title.jpg"),
            //$(".p11-result-cont").attr("src", S + "img/p11result" + n + "cont.jpg");
            //_(n),
            // _hmt.push(["_trackEvent", "level", "L" + n, "等级 " + n + " 人次"]);
            //_hmt.push();
            break
        }
    }
    function m() {
        //_hmt.push(["_trackEvent", "page", "p11", "进入页面10"]),
        p(P);
        //$(".p11-loading").show().addClass("ani-dot");
        var t = setTimeout(function() {
            return clearTimeout(t),
            M = 1,
            0 != L && void h()
        },
        17.5 * R)
    }
    function h() {
        M = 0,
        $(".p11-loading").fadeOut(5 * R,
        function() {
            $(".p11-result").transition({
                opacity: 1
            },
            5 * R)
        })
    }
    var isTrue =false;
    function d() {
        var t = $(this).attr("data-question"),
        n = $(this).attr("data-ans"),
        e = $(".p" + t),
        a = $(".p" + (parseInt(t) + 1));
        var obj = $(this).parent(".scene-cont").find($(".scene-ans[data-ans=" + n + "]"));
        if (!F[t] && e.hasClass("tag-nextOk")) {
                //_hmt.push(t+"-"+n);
                // _hmt.push(["_trackEvent", "question" + t, "answer" + t + "-" + n, t + "-" + n + "-选择人数"]);
                if(t==2||t==4||t==7||t==8||t==9){
                    if(!isTrue){
                        if(!obj.hasClass('checked')){
                            var s = obj.addClass("tada").addClass('checked');
                            var imgSrc = obj.attr("src");
                            imgSrc =imgSrc.replace(".png","d.png");
                            obj.attr("src",imgSrc);
                            var i = setTimeout(function() {
                                clearTimeout(i),
                                s.removeClass("tada");
                            },
                            1300)
                        }
                        var num = $(this).attr("data-question");
                        change(num);
                        isTrue = true;
                    }
                }else{
                    if(!obj.hasClass('checked')){
                        var s = obj.addClass("tada").addClass('checked');
                        var imgSrc = obj.attr("src");
                        imgSrc =imgSrc.replace(".png","d.png");
                        obj.attr("src",imgSrc);
                        var i = setTimeout(function() {
                            clearTimeout(i),
                            s.removeClass("tada");
                        },
                        1300)
                    }else{
                        var s = obj.removeClass('checked');
                        var imgSrc = obj.attr("src");
                        imgSrc =imgSrc.replace("d.png",".png");
                        obj.attr("src",imgSrc);

                    }
                }
            
        }
    }
    function change(q){
        setTimeout(function(){isTrue = false;},1000);
        var t = q,
        //n = $(this).attr("data-ans"),
        e = $(".p" + t),
        a = $(".p" + (parseInt(t) + 1));
        if (!F[t] && e.hasClass("tag-nextOk")&&e.find('.checked').length>0) { //必选一个  如果没选 点下一步不会切换
            e.find(".scene-ans").each(function(){
                if($(this).hasClass('checked')){
                    var t = $(this).attr("data-question"),
                    n = $(this).attr("data-ans");
                     _hmt.push(t+"-"+n);
                }
            });
            a.show();
            var i = setTimeout(function() {
                clearTimeout(i),
                l(e, a,
                function() {
                    10 == t ? m() : g(a);
                });
            },
            500)
            if(tel==undefined){
                tel = '';
            }
            var param = buildParam(tel,t,JSON.stringify(_hmt));
            $.ajax({
            type: "post",
            url: 'http://activity.peanut8.com/api/save',
            async:false,
            data: param,
            dataType: 'json',
            success: function(data) {
                $(".p11-loading").show().addClass("ani-dot");
                if(data.code ==1&&q==10){
                    setTimeout(function(){
                    $(".p11-loading").hide().removeClass("ani-dot");
                    h();
                    $(".city-name").text(data.data.info.city);
                    $(".city-img img").attr("src",data.data.info.img);
                    $(".active-desc").text(data.data.info.label);
                    url=data.data.info.link;
                    imageUrl=data.data.info.imgUrl;
                    title=data.data.info.title;
                    text=data.data.info.text;
                    $(".hs_text span").text(data.data.info.number);
                         /* start */
                        wx.ready(function () {
                            //分享到朋友圈
                            wx.onMenuShareTimeline({
                                title:  title, // 分享标题
                                desc:   text,
                                link:  url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                imgUrl: imageUrl, // 分享图标
                                success: function () { 
                                    
                                },
                                cancel: function (res) { 
                                    
                                }
                            });

                            //分享给朋友
                            wx.onMenuShareAppMessage({
                               title:  title, // 分享标题
                                desc:   text,
                                link:  url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                imgUrl: imageUrl, // 分享图标
                                success: function () { 
                                   
                                },
                                cancel: function () { 
                                    
                                }
                            });
                        });
                        /* end */
                  },3000)
                }
            },
            error: function() {}
          });
        }  

    }
    // 拼接参数
    function buildParam(tel,page,sval){
        var param = {};
        param["tel"] = tel;
        param["page"] = page;
        param["sVal"] = sval;
        console.log(JSON.stringify(param))
        return param;
    }

    function postTel(tel){
        $.ajax({
            type: "post",
            url: 'http://activity.peanut8.com/api/receive',
            async:false,
            data: {'tel':tel},
            dataType: 'json',
            success: function(data) {
              if(data.code ==-1){
                $(".tel-form-box .msg").text(data.msg);
              }else{
                $(".tel-submit").hide();
                $(".msg").text("");
                $(".tel-result").removeClass('dp-n').find('span').text(tel);
                $(".code-bg .t2").text(data.data.coupon);
              }
            },
            error: function() {}
          });

    }
    function l(t, n, e) {
        return !! t.hasClass("tag-nextOk") && (t.removeClass("tag-nextOk"), t.find(".scene-bg").transition({
            y: "-100%"
        },
        16 * R), t.find(".scene-cont").transition({
            x: "-120%"
        },
        16 * R,
        function() {
            t.hide()
        }), n.show(), n.find(".scene-bg").transition({
            y: "0%"
        },
        16 * R,
        function() {
            var t = n.find(".scene-ans:eq(0)").attr("data-question");
            t 
            //t || _hmt.push(["_trackEvent", "page", "p" + t, "进入页面" + t])
        }), void n.find(".scene-cont").transition({
            x: "0%"
        },
        16 * R, e))
    }
    function g(t) {
        t.find(".scene-ans").each(function() {
            $(this).delay(4 * R * $(this).attr("data-ans")).transition({
                opacity: 1
            },
            2 * R,
            function() {
                "4" == $(this).attr("data-ans") && t.addClass("tag-nextOk")
            })
        })
    }
    function f() {
        //_hmt.push(["_trackEvent", "again", "again", "再测一次"]),
        $(".scene-bg").css({
            translate: "0,100%"
        }),
        $(".scene-cont").css({
            translate: "120%,0%"
        }),
        $(".scene-ans").css({
            opacity: "0"
        }),
        $(".p1 .scene-cont").css({
            translate: "0%,0%"
        }),
        $(".p1 .scene-bg").css({
            translate: "0%,0%"
        }),
        $(".p1 .mask").css({
            opacity: "1"
        }),
        $(".p11-loading").removeClass("ani-dot"),
        $(".p11-result").css({
            opacity: 0
        }),
        F = [],
        L = 0,
        M = 0,
        P = 0,
        z(1)
        _hmt=[];
        $('.scene-ans').each(function() {
            $(this).removeClass('checked');
            var imgSrc = $(this).attr("src");
            imgSrc =imgSrc.replace("d.png",".png");
            $(this).attr("src",imgSrc);
        });
        $(".tel-submit").show();
        $(".msg").text("");
        $(".tel-result").addClass('dp-n')

    }
    function v() {
        Q = document.documentElement.clientWidth,
        q = document.documentElement.clientHeight,
        Q > q ? $("body").css({
            translate: "-50%,-50%",
            rotate: "0deg",
            width: "100%",
            height: "100%"
        }) : $("body").css({
            translate: "-50%,-50%",
            rotate: "90deg",
            width: q,
            height: Q
        })
    }
    function y() {
        var t = 1;
        $(window).resize(function() {
            return 0 != I && (t && setTimeout(function() {
                t = 1
            },
            1e3), t = 0, v(), k(), void $(".sharehint").fadeOut(200))
        }),
        $(window).resize(),
        $(".p1 .mask").click(u),
        $(".btn-start").click(o),
        $(" .scene-figure, .scene-ans").click(d),
        $(".sharehint").click(function() {
            $(this).fadeOut(500)
        }),
        $(".btn-again").click(f),
        $(document).on("touchstart", ".tag-btn",
        function() {
            $(this).addClass("btn-pressed")
        }),
        $(document).on("touchend", ".tag-btn",
        function() {
            $(this).removeClass("btn-pressed")
        })
        $(".step-next").click(function(){
            var num = $(this).attr("data-question");
            change(num);
        });
        $(".sub-btn").click(function(){
            var phone = $(".tel-input").val();
            postTel(phone);
        });
        $(".active-btn").click(function(){
            $(".p11-result").css('opacity', '0');
            $(".tel-form-box").show();
            if(tel!=''){
                $(".tel-input").val(tel);
            } 
            
        });
        $(".btn-again-btn").click(f);
        $(".btn-share-btn").click(function(){
            if(isApp){
              if(get_os()==2){
                  return window.webkit.messageHandlers.openSharePanel.postMessage({"url": url,"imageUrl":imageUrl, "title": title, "text": text});
                }else{
                    return window.news.openSharePanel(url,imageUrl,title,text);
                }
            }else if(isWeixinBrowser()){
                $(".tag-sharehint-left").show();
           }
           else {
                $(".tag-sharehint-left").show();
           }
        })
    }
    function k() {
        e(),
        a(),
        s()
    }
    function b() {
        $mIcon = $('<img id="bg-music">'),
        $mIcon = $(".bg-music");
        var t = {
            iOn: S + "img/musicOn.png",
            iOff: S + "img/musicOff.png"
        },
        n = new Audio;
        n.loop = !0,
        n.autoPlay = !0,
        n.src = S + "music/bgm.mp3",
        n.play();
        $(document).one("touchstart",
        function() {
            n.play()
        }),
        $mIcon.on("click",
        function() {
            n.paused ? (n.play(), $mIcon[0].src = t.iOn, $mIcon.addClass("rotate")) : (n.pause(), $mIcon[0].src = t.iOff, $mIcon.removeClass("rotate"))
        });
        var e = new Audio;
        e.src = S + "music/click.mp3";
        // $(".scene-figure, .scene-ans").click(function() {
        //     e.play()
        // });
        var a = new Audio;
        a.src = S + "music/enter.mp3",
        $(".btn-start").on("click",
        function() {
            a.play()
        }),
        e.addEventListener("ended",
        function() {
            n.paused && $mIcon.hasClass("rotate") && n.play()
        }),
        a.addEventListener("ended",
        function() {
            n.paused && $mIcon.hasClass("rotate") && n.play()
        })
    }

    function get_os() {
          var userAgent = navigator.userAgent || navigator.vendor || window.opera;
          if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
              return 2;
          }
          else {
             return 1;
          }
    }

    function isWeixinBrowser() {
        var agent = navigator.userAgent.toLowerCase();
        if (agent.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    
    function j() {
        //_hmt.push(["_trackEvent", "page", "preLoad", "进入loading页面"]);
        for (var t = 0,
        n = [], e = document.images, a = 0; a < e.length; a++) n.push(e[a].src);
        n.push(S + "img/darkbg.png"),
        n.push(S + "img/p0brand.png"),
        n.push(S + "img/p0frame.png"),
        n.push(S + "img/p0hintwords0.png"),
        n.push(S + "img/whiteboard2.png"),
        n.push(S + "img/p1bg2.jpg"),
        n.push(S + "img/p2bg.jpg"),
        n.push(S + "img/p3bg.jpg"),
        n.push(S + "img/p4bg.jpg"),
        n.push(S + "img/p5bg.jpg"),
        n.push(S + "img/p6bg.jpg"),
        n.push(S + "img/p7bg.jpg"),
        n.push(S + "img/p8bg.jpg"),
        n.push(S + "img/p9bg.jpg"),
        n.push(S + "img/p10bg.jpg"),
        $.imgpreload(n, {
            each: function() {
                var e = $(this).data("loaded") ? "success": "error";
                if ("success" == e) {
                    var a = (parseFloat(++t) / n.length).toFixed(2);
                    a > .1 && $(".loading-wave").css({
                        top: 66 - 26 * (a - .1) + "%"
                    })
                }
            },
            all: function() {
                $(".loading").fadeOut(500),
                I = 1,
                1 == I && 0 == T && (A ? O() : i())
            }
        })
    }
    function C(t) {
        t.show(),
        t.find(".scene-bg").css({
            y: "0%"
        }),
        t.find(".scene-cont").css({
            x: "0%"
        })
    }
    function z(t) {
        A = !0,
        $(".page").hide();
        var n = $(".p" + t);
        switch (n.show(), t) {
        case 0:
            i();
            break;
        case 1:
            r();
            break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            C(n),
            g(n);
            break;
        case 11:
            C(n),
            m()
        }
    }
    function O() {
        z(0)
    }
    var I = 0,
    Q = document.documentElement.clientWidth,
    q = document.documentElement.clientHeight,
    T = 0,
    F = [],
    L = 0,
    M = 0,
    A = !0,
    W = [[2, 3, 1, 4], [2, 3, 1, 4], [1, 3, 2, 4], [2, 3, 4, 1], [2, 4, 3, 1], [1, 4, 3, 2], [2, 3, 4, 1], [2, 4, 3, 1], [1, 4, 3, 2], [1, 4, 3, 2]],
    H = [6, 10, 14, 18, 21, 24,28,32,36,40,46],
    P = 0,
    R = 100,
    S = "";
    n(),
    j(),
    k(),
    b(),
    y()
});
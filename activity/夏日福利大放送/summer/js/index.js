var KinerLottery = new KinerLottery({
    rotateNum: 8, //转盘转动圈数
    body: "#box", //大转盘整体的选择符或zepto对象
    direction: 0, //0为顺时针转动,1为逆时针转动
    clickCallback: function () {
        luckDraw();
    }, //点击抽奖按钮,再次回调中实现访问后台获取抽奖结果,拿到抽奖结果后显示抽奖画面
    KinerLotteryHandler: function (deg) {
        getResult(deg);
    } //抽奖结束回调
});
var scroll_1 = 0
var scroll_2 = -100
$(function () {
    //openNfygApp()
    init();
    bename();
    // 验证码登录
    $(".get-code").on("click", function () {
        if ($(this).hasClass("disabled")) {
            return;
        } else {
            getCode($(this));
        }
    });
    $(".btn-submit").on("click", function () {
        submit();
    });
    // 用户分享
    // $(".btn-share-add").on("click", function () {
    //     $(".page-share").show();
    // });
    $(".page-share ul li").each(function () {
        $(this).on("click", function () {
            var from = $(this).attr("data-type");
            shareAdd();
            nfyg.scriptShare(
                from,
                shareData.url,
                shareData.imgUrl,
                shareData.title,
                shareData.text
            );
        });
    });
    // 关闭弹窗页面
    $(".btn-close, .popup-bg, .btn-gold-add").on("click", function () {
        $(".popup, .win, .fail, .login, .wechat-share,.wechat-open,.btn-close").hide();
    });
    $(".page-share-bg, .btn-cancel-share").on("click", function () {
        $(".page-share").hide();
    });
    // 任务跳转
    $(".btn-to-signin").on("click", function () {
		console.log("----signin----")
        nfyg.openAppPage("signin");
    });
    $(".btn-to-share, .btn-read-add, .btn-share-add").on("click", function () {
        if (isApp) {
            nfyg.openSharePanel(shareData.url, shareData.imgUrl, shareData.title, shareData.text)
        } else {
            $('.win, .fail, .login, .btn-close').hide()
            $('.popup, .wechat-share').show()
        }
        shareAdd();
    });
    $(".btn-open-app").on("click", function () {
        window.location.href =
            "http://a.app.qq.com/o/simple.jsp?pkgname=com.nfyg.hsbb&ckey=CK1360001376091";
    });
    setTimeout(() => {
        $(".page-loading").hide();
    }, 150);
});

function luckDraw() {
    console.log(mobile);
    if (mobile == null || typeof mobile == undefined || mobile == "") {
        $(".popup, .btn-close, .login").show()
    } else {
        if (isApp) {
            const position = nfyg.getPosition() ? JSON.parse(nfyg.getPosition()) : { city: "all" }
            let city = "all"
            switch (position.city) {
              case "深圳":
                city = "sz"
                break;
              case "上海":
                city = "sh"
                break;
              case "广州":
                city = "gz"
                break;
              default:
                city = "all"
                break;
            }
            nfyg.encrypt(point + "", function (data) {
                nfyg.otherCommon.getDatanormal("Post", apiurl.luckDraw, "json", {
                    tel: mobile,
                    type: isApp ? 0 : 1,
                    userId: isApp ? userId : "",
                    point: data,
                    city: city,
					hcode:keyParams
                }, false, function (res) {
                    console.log(res);
                    luckDrawBack(res)
                })
            })
        } else {
            nfyg.otherCommon.getDatanormal("Post", apiurl.luckDraw, "json", {
                tel: mobile,
                type: isApp ? 0 : 1,
                userId: isApp ? userId : "",
                point: "",
                city: "",
				hcode:keyParams
            }, false, function (res) {
                console.log(res);
                luckDrawBack(res)
            })
        }
    }
};

function luckDrawBack(res) {
    switch (res.code) {
        case 1:
            $(".win-prize").attr("src", res.prizeImg);
            var id = res.prizeId;
            var prizeDeg = 60 * id - Math.floor(Math.random() * 45);
            $(".inner").removeClass("scale");
            KinerLottery.goKinerLottery(360 - prizeDeg);
            break;
        case -2:
            if (isApp) {
                $(".popup, .btn-close, .fail-to-share").show();
            } else {
                openNfygApp()
                $(".popup, .btn-close, .open-1").show();
                $('.btn-close').hide()
            }
            break;
        case -1:
            $(".popup, .btn-close, .login").show();
            break;
        case -6:
            $(".win-prize").attr("src", res.prizeImg);
            $(".popup, .btn-close, .win-out-have").show();
            break;
        case -7:
            $(".popup, .btn-close, .fail-out").show();
            break;
        default:
            nfyg.otherCommon.promptShow(res.msg);
            break
    }
}

function init() {
    nfyg.otherCommon.getDatanormal("Post", apiurl.init, "json", {
        tel: mobile,
        type: isApp ? 0 : 1,
		hcode:keyParams
    }, true, function (res) {
        if (res.flag == 5) {
            // $(".luck-number").html("5金币/次")
        } else {
            $("#luck-number").html(res.number)
        }
    })
};

function shareAdd() {
    nfyg.otherCommon.getDatanormal("Post", apiurl.share, "json", {
        tel: mobile,
		hcode:keyParams
    }, true, function (res) {
        console.log(res)
    })
};

function getResult(deg) {
    $(".inner").addClass("scale");
    if (deg > 120 && deg <= 180||deg > 300 && deg <= 360) {
        $(".popup, .btn-close, .fail-heart").show()
    } else {
        $(".popup, .btn-close, .win-in").show()
        if (!isApp) {
            setTimeout(() => {
                $('.win-in').hide()
                openNfygApp()
                $(".popup, .btn-close, .open-1").show();
                $('.btn-close').hide()
            }, 3000);
        }
    }
};

function getCode(obj) {
    var tel = $("#mobile").val();
    if (!tel) {
        nfyg.otherCommon.promptShow("手机号码不能为空哦")
    } else {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel)) {
            nfyg.otherCommon.promptShow("请正确填写手机号码")
        } else {
            nfyg.otherCommon.getDatanormal("post", apiurl.send, "json", {
                tel: tel,
				hcode:keyParams
            }, true, function (res) {
                console.log(res);
                if (res.code == 1) {
                    nfyg.otherCommon.timeCountDown(obj)
                } else {
                    nfyg.otherCommon.promptShow(res.msg)
                }
            })
        }
    }
};

function submit() {
    var tel = $("#mobile").val();
    var code = $("#code").val();
    if (!tel) {
        nfyg.otherCommon.promptShow("手机号码不能为空哦")
    } else {
        if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel)) {
            nfyg.otherCommon.promptShow("请正确填写手机号码")
        } else {
            if (!code) {
                nfyg.otherCommon.promptShow("验证码不能为空哦")
            } else {
                nfyg.otherCommon.getDatanormal("post", apiurl.login, "json", {
                    tel: tel,
                    code: code,
					hcode:keyParams
                }, true, function (res) {
                    console.log(res);
                    if (res.code == 1) {
                        $.fn.cookie("userId_tel", tel, {
                            expires: 3
                        });
                        mobile = tel;
						//sessionStorage.setItem("$mobile",tel);
                        $(".popup, .login").hide();
                        luckDraw()
                    } else {
                        nfyg.otherCommon.promptShow(res.msg)
                    }
                })
            }
        }
    }
};

function bename() {
    var nameArr = ["0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "花", "生", "王", "李", "张", "刘", "陈", "杨", "周", "赵", "吴", "孙", "徐", "林", "胡", "朱", "郭", "梁", "马", "高", "何", "郑", "罗", "宋", "谢", "叶", "韩", "任", "潘", "唐", "于", "冯", "董", "吕", "邓", "许", "曹", "曾", "沈", "卢", "余", "杜", "蒋", "汪", "丁", "方", "苏", "一", "二", "三", "大", "小", "多", "少", "圆", "白", "黄", "红", "蓝", "爱", "文", "博", "南", "雅", "菲"];
    for (var i = 0; i < 50; i++) {
        if (Math.ceil(Math.random() * 100) < 10) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-1').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[0] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 30 && Math.ceil(Math.random() * 100) >= 10) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-1').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[1] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 50 && Math.ceil(Math.random() * 100) >= 30) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-1').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[2] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 70 && Math.ceil(Math.random() * 100) >= 50) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-1').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[3] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 80 && Math.ceil(Math.random() * 100) >= 70) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-1').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[4] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 90 && Math.ceil(Math.random() * 100) >= 80) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-1').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[2] + '</p></li>');
        } else {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-1').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[4] + '</p></li>');
        }
        if (Math.ceil(Math.random() * 100) < 10) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-2').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[1] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 30 && Math.ceil(Math.random() * 100) >= 10) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-2').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[3] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 50 && Math.ceil(Math.random() * 100) >= 30) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-2').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[4] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 70 && Math.ceil(Math.random() * 100) >= 50) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-2').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[3] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 80 && Math.ceil(Math.random() * 100) >= 70) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-2').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[2] + '</p></li>');
        } else if (Math.ceil(Math.random() * 100) < 90 && Math.ceil(Math.random() * 100) >= 80) {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-2').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[1] + '</p></li>');
        } else {
            var firstName = nameArr[Math.ceil(Math.random() * 100)];
            var lastName = nameArr[Math.ceil(Math.random() * 100)];
            $('#win-scroll>.line-2').append('<li><p><span>' + firstName + '***' + lastName + '</span> 刚获得 ' + prizeArr[0] + '</p></li>');
        }
    }
    setInterval(() => {
        $(".line-1").css("marginLeft", scroll_1--);
        $(".line-2").css("marginLeft", scroll_2--);
    }, 25);
}
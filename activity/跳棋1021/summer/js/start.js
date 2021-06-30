/**
 * Created by Administrator on 2018/2/1.
 */
(function () {
    var winWidth = document.documentElement.clientWidth;
    var winHeight = document.documentElement.clientHeight;
    var WWBase = 100 * (winWidth / 750)
    var scoreOld = 0
    var timeActive = false
    var timeAll = 60

    var centerObj = new Object();
    centerObj.camera = new HGAME.camera(); //镜头对象
    centerObj.animate = new HGAME.animate(); //动画对象
    centerObj.animate2 = new HGAME.animate({
        time: 20
    }); //动画对象
    centerObj.model = new HGAME.model();
    centerObj.maxBox = new HGAME.canvas({
        w: 750,
        h: 1206
    }); //canvas对象
    centerObj.start = false;
    centerObj.loadedObj = new HGAME.source(); //加载资源
    centerObj.camera.add(centerObj.maxBox);
    var arr = new Array();
    centerObj.resultFun = function () {
        centerObj.nowTime = 0
        centerObj.start = false
        timeActive = false
        if (centerObj.user.num >= gsImgInfo[centerObj.gs][2]) {
            centerObj.winFun()
        } else {
            centerObj.failFun()
        }
    }
    centerObj.failFun = function () {
        // TODO 注意，这里会一直执行，判断到弹窗出现状态了要return
        // 失败弹窗
        if (isPopupShowView === true) return;
        isPopupShowView = true
        reporting(centerObj.user.num)
        $('#fail-score').html(centerObj.user.num)
        $('.popup, .popup__fail').addClass('active')
    }
    centerObj.winFun = function () {
        // TODO 注意，这里会一直执行，判断到弹窗出现状态了要return
        // 成功弹窗
        if (isPopupShowView === true) return;
        isPopupShowView = true
        reporting(centerObj.user.num)
        $('#win-score').html(centerObj.user.num)
        $('.popup, .popup__win').addClass('active')
    }

    centerObj.animate2.action = function () {
        if (centerObj.model.showView == false) {
            for (var i = 0; i < centerObj.stArr.length; i++) {
                methodInfo(centerObj.stArr[i], "method2");
            }
        }
        // if (centerObj.user.num >= gsImgInfo[centerObj.gs][2]) {
        //     // console.log("这里应该是成功了吧");
        //     // TODO 注意，这里会一直执行，判断到弹窗出现状态了要return
        //     // 成功弹窗
        //     if (isPopupShowView === true) return;
        //     isPopupShowView = true
        //     centerObj.nowTime = 0;
        //     console.log("得分 = " + centerObj.user.num);
        //     reporting(centerObj.user.num)
        //     $('#win-score').html(centerObj.user.num)
        //     $('.popup, .popup__win').addClass('active')
        // }
        // if (centerObj.nowTime >= gsImgInfo[centerObj.gs][3]) {
        //     centerObj.failFun();
        // }
    }
    centerObj.animate2.aSecondAction = function () {
        if (centerObj.model.showView == true) {
            return
        };
        centerObj.nowTime++;

        for (var i = 0; i < centerObj.goodsArr.length; i++) {
            methodInfo(centerObj.goodsArr[i], "method3");
        }
        if (centerObj.user.goodsAddInfo > 0) {
            centerObj.user.goodsAddInfo--;
        } else if (centerObj.user.goodsAddInfo == 0) {
            if (centerObj.user.goodsAdd == 0) return;
            centerObj.user.goodsAdd = 0;
        }
    }
    centerObj.animate.action = function () {
        centerObj.maxBox.render();
        if (centerObj.model.showView == true) {
            renderAfter();
            return
        };
        centerObj.user.angeleChangeFun();
        for (var i = 0; i < centerObj.stArr.length; i++) {
            methodInfo(centerObj.stArr[i]);
        }
        for (i = 0; i < centerObj.goodsArr.length; i++) {
            methodInfo(centerObj.goodsArr[i]);
        }
        renderAfter();
    };

    // centerObj.gs = 0;
    centerObj.gs = nfyg.otherCommon.getRandomNumber(0, 2, 1);
    centerObj.allGs = 2;
    centerObj.stArr = new Array();
    centerObj.goodsArr = new Array();
    centerObj.bgArr = new Array();
    centerObj.nowTime = 0;

    function changeAttr(struct) {
        var arr = new Array();
        for (var i in struct) {
            if (typeof struct[i] == "string") {
                status[i] && (arr = status[i].split("=>"));
                //0 设置 1 对象 2 属性 3 偏差
                if (arr[0] == "set") {
                    struct[i] = centerObj[arr[1]][arr[2]] + arr[3];
                }
            }
        }
    }

    function methodInfo(struct, name) {
        name = name || "method";
        if (typeof struct[name] != "undefined") {
            //debugger;
            for (var q = 0; q < struct[name].length; q++) {
                if (typeof struct[struct[name][q].name] != "undefined") {
                    if (typeof struct[name][q].arguments == "string") {
                        arr = struct[name][q].arguments.split("=>");
                        if (arr.length >= 2 && arr[0] == "set") {
                            struct[struct[name][q].name](centerObj);
                        } else {
                            struct[struct[name][q].name](struct[name][q].arguments);
                        }
                    } else {
                        struct[struct[name][q].name](struct[name][q].arguments);
                    }

                }
            }
        }
    }

    // 加载每一个关卡内容
    function gsInfo(num) {
        console.log("关数 ： " + num);
        centerObj.gs = num;
        centerObj.animate.stop();
        centerObj.animate2.stop();
        centerObj.maxBox.empty();
        centerObj.stArr = new Array();
        centerObj.goodsArr = new Array();
        centerObj.bgArr = new Array();
        centerObj.loadedObj.loadCall = function () {
            var txt = centerObj.maxBox.txt;
            centerObj.maxBox.clear();
            txt.beginPath();
            txt.fillStyle = "#5BD9FF";
            txt.fillRect(0, 0, centerObj.maxBox.w, centerObj.maxBox.h);
            txt.fillStyle = "#000";
            txt.font = ("normal normal {size}/{line} arial").replace("{size}", "30px").replace("{line}", "30px");
            txt.textBaseline = "middle";
            txt.textAlign = "center";
            number = Math.ceil(this.loadNum / (this.data.length)) * 100
            txt.fillText("加载资源" + number + "%", centerObj.maxBox.w / 2, centerObj.maxBox.h / 2);
            txt.closePath();
        }
        // 主动加载资源
        centerObj.loadedObj.loadedSource(gsImgInfo[centerObj.gs][0], function () {
            for (var i = 0; i < gsImgInfo[centerObj.gs][1].length; i++) {
                changeAttr(gsImgInfo[centerObj.gs][1][i]);
                var obj = null;
                gsImgInfo[centerObj.gs][1][i].type = typeof gsImgInfo[centerObj.gs][1][i].type == "undefined" ? "stone" : gsImgInfo[centerObj.gs][1][i].type;
                if (gsImgInfo[centerObj.gs][1][i].type == "stone") {
                    obj = new HGAME.stone(gsImgInfo[centerObj.gs][1][i]);
                    if (!obj.nowPush) {
                        centerObj.stArr.push(obj);
                    }
                    centerObj.maxBox.add(obj);
                } else if (gsImgInfo[centerObj.gs][1][i].type == "bg") {
                    // debugger
                    obj = new HGAME.stone(gsImgInfo[centerObj.gs][1][i]);
                    if (!obj.nowPush) {
                        centerObj.bgArr.push(obj);
                        // centerObj.goodsArr.push(obj);
                    }
                    centerObj.maxBox.add(obj);
                }
            }
            setTimeout(function () {
                centerObj.maxBox.add(centerObj.user.user);
                centerObj.animate.run();
                centerObj.animate2.run();
            }, 500);
        });
    }
    // 主动加载资源
    centerObj.loadedObj.loadedSource(allImgData, function () {
        var userDate = METHOD.arrToImg(userImg);
        var uImgArr = [userDate[0], userDate[1]];
        var tImgArr = [userDate[0], userDate[1]];
        centerObj.user = new HGAME.userObj({
            uImgObj: {
                // 人物的参数
                w: 434,
                h: 256,
                x: 150,
                y: 50
            },
            gzObj: {
                // 钩子-爪子的参数
                w: 84,
                h: 72
            },
            tImgArr: tImgArr,
            lineObj: {
                // 钩子-绳子的参数
                x: 285,
                y: 110,
                w: 150,
                h: 5,
                color: "#C4D5A6"
            },
            // lineObj: lineArr,
            uImgArr: uImgArr,
            sW: centerObj.maxBox.w,
            sH: centerObj.maxBox.h,
            gzImg: userDate[2],
            maxBox: centerObj.maxBox
        });
        var txt = centerObj.maxBox.txt;
        var img = METHOD.createImg("../images/home_theme.png");
        txt.drawImage(img, 0, 0);
    });
    // 键盘方法
    window.onkeydown = function (e) {
        e = e || window.event;
        if (e.keyCode == 74) {
            if (centerObj.user.line.w != centerObj.user.bufW) return;
            centerObj.user.grabFun(centerObj);
            centerObj.user.colFun(centerObj.stArr);
        }
        // if (e.keyCode == 68 || e.keyCode == 39) {
        //     centerObj.user.moveLeft();
        // }
        // if (e.keyCode == 65 || e.keyCode == 37) {
        //     centerObj.user.moveRight();
        // }
    };
    var constStruct = {
        bufW: 0,
        bufW02: 0,
        bufH: 0,
        fontStr: "normal normal {size}/{line} arial"
    };

    function renderAfter() {
        if (centerObj.nowTime > gsImgInfo[centerObj.gs][3] && centerObj.start) {
            centerObj.resultFun();
            // centerObj.failFun();
        }
        if (!timeActive) {
            return
        } else {
            document.getElementById("icon-time").innerHTML = (timeAll - centerObj.nowTime)
        }
        if (scoreOld === centerObj.user.num) {
            return
        } else {
            scoreOld = centerObj.user.num
            document.getElementById("icon-score").innerHTML = centerObj.user.num
        }
    }

    function _nextAndAgainFun() {
        if (centerObj.gs == centerObj.allGs) {
            centerObj.gs = -1
        }
        centerObj.user.num = 0;
        centerObj.nowTime = 0;
        centerObj.gs++;
        localStorage.gs = centerObj.gs;
        timeActive = true
        centerObj.start = true
        gsInfo(centerObj.gs);
    }
    $('.btn-again').on('click', function () {
        if (userChance == 0) {
            if (usershare == 1) {
                nfyg.otherCommon.promptShow("今日机会已用完");
                $('.home').addClass('active')
                $('.game').removeClass('active')
                $('.popup, .popup__act').removeClass('active')
            } else {
                nfyg.otherCommon.promptShow("今日机会已用完，邀请好友助力");
                $('.btn-share').addClass('swing')
            }
            return
        }
        _nextAndAgainFun()
        isPopupShowView = false
        $('.popup, .popup__act').removeClass('active')
    })
    $('.btn-close, .popup__bg, .popup__wechat').on('click', function () {
        isPopupShowView = false
        timeActive = false
        centerObj.start = false
        centerObj.user.num = 0;
        centerObj.nowTime = 0;
        $('.home').addClass('active')
        $('.game').removeClass('active')
        $('.popup, .popup__act').removeClass('active')
    })
    $('.btn-share').on('click', function () {
        if (isApp) {
            nfyg.openSharePanel(shareData.url, shareData.imgUrl, shareData.title, shareData.text)
        } else {
            $('.popup__act').removeClass('active')
            $('.popup, .popup__wechat').addClass('active')
        }
        share()
    })
    $('.get-code').on('click', function () {
        var obj = $(this)
        if (obj.hasClass("disabled")) {
            return;
        } else {
            getCode(obj);
        }
    })
    $('.btn-submit').on('click', function () {
        submit()
    })
    $('.guide').on('click', function () {
        $('.guide').hide()
    })
    $('#btn-start-rules').on('click', function () {
        $('.popup, .popup__rules').removeClass('active')
    })

    // 开始游戏
    var btnStart = document.getElementById('btn-start');
    var btnStartRules = document.getElementById('btn-start-rules');
    btnStart.addEventListener('click', startFun, false); //鼠标单击的时候调用startFun这个函数 
    btnStartRules.addEventListener('click', startFun, false); //鼠标单击的时候调用startFun这个函数 
    function startFun() {
        console.log("开始游戏");
        if (mobile == null) {
            $('.popup, .popup__login').addClass('active')
            return
        }
        if (userChance == 0) {
            $('.popup, .popup__share').addClass('active')
            nfyg.otherCommon.promptShow("今日机会已用完")
            return
        }
        $('.popup, .popup__act').removeClass('active')
        $('.home').removeClass('active')
        $('.game').addClass('active')
        gsInfo(centerObj.gs);
        centerObj.start = true;
        timeActive = true;
    }
    var canvasDom = document.getElementById("canvas")
    var footDom = document.getElementById("foot")
    var guideDom = document.getElementById("guide")
    canvasDom.addEventListener('click', canvasFun, false); //鼠标点击屏幕的时候，抓取东西
    footDom.addEventListener('click', canvasFun, false); //鼠标点击屏幕的时候，抓取东西
    guideDom.addEventListener('click', canvasFun, false); //鼠标点击屏幕的时候，抓取东西
    function canvasFun() {
        if (centerObj.user.line.w != centerObj.user.bufW) return;
        centerObj.user.grabFun(centerObj);
        centerObj.user.colFun(centerObj.stArr);
    }
    if (isApp) {
        nfyg.encrypt(mobile, function (data) {
            mobile = data
            init(mobile)
        })
    } else {
        init(mobile)
    }
    // 初始化
    function init(m) {
        nfyg.otherCommon.getDatanormal("post", urlConfig.index, "json", {
            tel: m
        }, true, function (res) {
            userChance = res.number
            usershare = res.isShare
        })
    }
    // 信息上报
    function reporting(number) {
        nfyg.otherCommon.getDatanormal("post", urlConfig.reporting, "json", {
            tel: mobile,
            nickName: nickName,
            score: number
        }, true, function (res) {
            init(mobile)
        })
    }
    // 分享
    function share() {
        nfyg.otherCommon.getDatanormal("post", urlConfig.share, "json", {
            tel: mobile
        }, true, function (res) {
            init(mobile)
        })
    }
    // 获取验证码
    function getCode(obj) {
        let tel = $("#mobile").val();
        if (!tel) {
            nfyg.otherCommon.promptShow("手机号码不能为空哦");
        } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel)) {
            nfyg.otherCommon.promptShow("请正确填写手机号码");
        } else {
            nfyg.otherCommon.getDatanormal("post", urlConfig.send, "json", {
                tel: tel
            }, true, function (res) {
                if (res.code == 1) {
                    nfyg.otherCommon.timeCountDown(obj);
                } else {
                    nfyg.otherCommon.promptShow(res.msg);
                }
            });
        }
    }
    // 提交验证码
    function submit() {
        let name = $("#nickName").val();
        let tel = $("#mobile").val();
        let code = $("#code").val();
        if (!tel || !name) {
            nfyg.otherCommon.promptShow("昵称和手机号码不能为空哦");
        } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(tel)) {
            nfyg.otherCommon.promptShow("请正确填写手机号码");
        } else if (!code) {
            nfyg.otherCommon.promptShow("验证码不能为空哦");
        } else {
            nfyg.otherCommon.getDatanormal("post", urlConfig.login, "json", {
                tel: tel,
                code: code,
                nickName: name
            }, true, function (res) {
                if (res.code == 1) {
                    let userInfo = {
                        mobile: res.data.userId,
                        nickName: res.data.nickName
                    }
                    $.fn.cookie("summer_userInfo_nfyg", JSON.stringify(userInfo), {
                        expires: 7
                    });
                    mobile = res.data.userId;
                    nickName = res.data.nickName;
                    init(mobile)
                    startFun()
                    $('.popup, .popup__login').removeClass('active')
                } else {
                    nfyg.otherCommon.promptShow(res.msg);
                }
            });
        }
    }
    canvasDom.style.transform = "scale(" + winWidth / 750 + ")"
    document.getElementById("canvas").appendChild(centerObj.maxBox.dom);

})();
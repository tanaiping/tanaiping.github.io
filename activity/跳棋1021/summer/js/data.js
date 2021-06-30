/**
 * Created by Administrator on 2018/2/6.
 */
var winWidth = document.documentElement.clientWidth;
var winHeight = document.documentElement.clientHeight;
// 获取随机数
function getRandomNumber(start, end, n, type) {
    var arr = [];
    var number;
    for (var i = 0; i < n; i++) {
        number = Math.random() * (end - start + 1) + start;
        if (type == "int") {
            number = Math.floor(Math.random() * (end - start + 1) + start);
        }
        if (arr.indexOf(number) < 0) {
            arr.push(number)
        } else {
            i--
        }
    }
    return arr
}
var allImgData = [
    /*人物*/
    "../images/brand_logo.png",
    "../images/brand_logo.png",
    /*钩子*/
    "../images/icon_hook.png",
    /*河床*/
    "../images/bg_game_2.png"
];
var userImg = [
    /*人物*/
    "../images/brand_logo.png",
    "../images/brand_logo.png",
    /*钩子*/
    "../images/icon_hook.png",
    /*河床*/
    "../images/bg_game_2.png"
];
var gsImgInfo = [
    [
        [
            /*黄金*/
            "../images/bg_game.jpg",
            "../images/game_1.png",
            "../images/game_2.png",
            "../images/game_3.png",
        ],
        [{
                nowPush: true,
                x: 0,
                y: 0,
                w: 750,
                h: 1206,
                img: METHOD.createImg("../images/bg_game.jpg")
            },
            {
                type: "bg",
                x: 0,
                y: 945,
                w: 750,
                h: 261,
                img: METHOD.createImg("../images/bg_game_2.png"),
            },
            {
                x: 217,
                y: 540,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 345,
                y: 657,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 616,
                y: 711,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 282,
                y: 1000,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 402,
                y: 1010,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 371,
                y: 538,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 627,
                y: 615,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 113,
                y: 625,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 222,
                y: 694,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 463,
                y: 734,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 384,
                y: 807,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 101,
                y: 824,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 324,
                y: 920,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 520,
                y: 980,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 476,
                y: 586,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 58,
                y: 685,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 223,
                y: 809,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 508,
                y: 821,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 100,
                y: 950,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // angle: getRandomNumber(-60, 60, 1),
                img: METHOD.createImg("../images/game_3.png")
            },
        ],
        500, //过关分数
        60 //当前关数的时间 单位s
    ],
    [
        [
            /*黄金*/
            "../images/bg_game.jpg",
            "../images/game_1.png",
            "../images/game_2.png",
            "../images/game_3.png",
        ],
        [{
                nowPush: true,
                x: 0,
                y: 0,
                w: 750,
                h: 1206,
                img: METHOD.createImg("../images/bg_game.jpg")
            },
            {
                type: "bg",
                x: 0,
                y: 945,
                w: 750,
                h: 261,
                img: METHOD.createImg("../images/bg_game_2.png"),
            },
            {
                x: 220,
                y: 556,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 628,
                y: 724,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 242,
                y: 816,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 152,
                y: 929,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 399,
                y: 995,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 349,
                y: 540,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 394,
                y: 645,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 627,
                y: 615,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 482,
                y: 742,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 287,
                y: 716,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 28,
                y: 716,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 84,
                y: 819,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 77,
                y: 1029,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 324,
                y: 920,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 521,
                y: 946,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 598,
                y: 866,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 148,
                y: 668,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 411,
                y: 807,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 265,
                y: 999,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 503,
                y: 568,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // 关数 ： 2
                img: METHOD.createImg("../images/game_3.png")
            }
        ],
        500, //过关分数
        60 //当前关数的时间 单位s
    ],
    [
        [
            /*黄金*/
            "../images/bg_game.jpg",
            "../images/game_1.png",
            "../images/game_2.png",
            "../images/game_3.png",
        ],
        [{
                nowPush: true,
                x: 0,
                y: 0,
                w: 750,
                h: 1206,
                img: METHOD.createImg("../images/bg_game.jpg")
            },
            {
                type: "bg",
                x: 0,
                y: 945,
                w: 750,
                h: 261,
                img: METHOD.createImg("../images/bg_game_2.png"),
            },
            {
                x: 366,
                y: 534,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 487,
                y: 712,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 290,
                y: 784,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 85,
                y: 891,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 364,
                y: 916,
                w: 90,
                h: 88,
                addNum: 70,
                stonge: 2.4,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_1.png")
            },
            {
                x: 25,
                y: 697,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 118,
                y: 622,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 85,
                y: 795,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 185,
                y: 736,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 203,
                y: 903,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 136,
                y: 1026,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 372,
                y: 690,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 417,
                y: 845,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 372,
                y: 1063,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 527,
                y: 838,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 588,
                y: 930,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 606,
                y: 645,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 503,
                y: 569,
                w: 90,
                h: 53,
                addNum: 40,
                stonge: 3,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_2.png")
            },
            {
                x: 248,
                y: 576,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 247,
                y: 975,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 503,
                y: 962,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_3.png")
            },
            {
                x: 628,
                y: 774,
                w: 90,
                h: 107,
                addNum: 60,
                stonge: 2.6,
                // 关数 ： 3
                img: METHOD.createImg("../images/game_3.png")
            },
        ],
        500, //过关分数
        60 //当前关数的时间 单位s
    ]
];
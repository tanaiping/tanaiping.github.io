/**
 * nfyg-pack-common.js 1.0.1
 * author : yerongtao
 * last modified date : 2019/1/24
 * NFYG： [App与H5交互接口] 方法的封装
 * 使用方法 :
 *     html 里先引入zepto.min.js，再引入nfyg-pack-common.js
 *     初始化之后：
 *     var nfyg = new NFYG();
 *     nfyg.openAppPage('wallet');
 */
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ?
    (module.exports = factory()) :
    typeof define === "function" && define.amd ?
    define(factory) :
    (global.NFYG = factory());
})(this, function () {
  "use strict";
  var wait = 60;
  var u = navigator.userAgent;
  var Browser = (function Browser() {
    var ua = u.toLowerCase();
    return {
      // 浏览器和设备信息
      ie: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      iPhone: u.indexOf("iPhone") > -1 || u.indexOf("Mac") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
      mobile:
        !!u.match(/AppleWebKit.*Mobile.*/) ||
        (!!u.match(/AppleWebKit/) &&
          u.indexOf("QIHU") &&
          u.indexOf("QIHU") > -1 &&
          u.indexOf("Chrome") < 0), //是否为移动终端
      android: ua.match(/Android/i) == "android", //android终端
      ios: ua.match(/iPhone\sOS/i) == "iphone os", //ios终端
      weixin: ua.match(/MicroMessenger/i) == "micromessenger", //微信內置浏览器
      qq: ua.match(/QQ/i) == "qq", //QQ内置浏览器，QQ浏览器
      weibo: ua.match(/WeiBo/i) == "weibo", // 微博内置浏览器
      alipay: ua.match(/Alipay/i) == "alipay", // 支付宝内置浏览器
      isNfyg: ua.match(/iPhone\sOS/i) == "iphone os" ?
        typeof isNfygPlatform === "function" ?
        isNfygPlatform() :
        false : window.news ?
        true : false //是否花生地铁APP
    };
  })();

  function NFYG() {}
  NFYG.prototype = {
    //  关闭当前的H5页面
    closeWindow: function () {
      if (Browser.ios) {
        return window.webkit.messageHandlers.closeWindow.postMessage("");
      } else {
        return window.news.closeWindow();
      }
    },
    openUrl: function (url, title, sourceType) {
      /* sourceType 1：导航 、2：游戏、3：发现、4：新闻、5：广告 */
      if (Browser.ios) {
        window.webkit.messageHandlers.openUrl.postMessage(
          url,
          title,
          sourceType
        );
      } else {
        window.news.toLink(url, title, sourceType);
      }
    },
    //  打开APP的固定页(协议跳转)
    openAppPage: function (openType) {
      /** openType
       *  wallet : 钱包
       *  cardPackage : 卡包
       *  signin ： 登录
       *  myDetail ： 个人资料
       */
      var link;
      var appPageLink = {
        wallet: {
          iosLink: "nfyg://1/MyWalletViewController",
          androidLink: "nfyg://1/com.nfyg.hsbb.views.mine.wallet.WalletActivity"
        },
        cardPackage: {
          iosLink: "nfyg://1/CardPackageViewController",
          androidLink: "nfyg://1/com.nfyg.hsbb.views.mine.CardActivity"
        },
        signin: {
          iosLink: "nfyg://1/PNSigInViewController",
          androidLink: "nfyg://1/com.nfyg.hsbb.views.sign.SignActivity"
        },
        myDetail: {
          iosLink: "nfyg://1/MyDetailViewController",
          androidLink: "nfyg://1/com.nfyg.hsbb.views.mine.AccountActivity"
        }
      };
      switch (openType) {
        case "wallet":
          link = Browser.ios ?
            appPageLink.wallet.iosLink :
            appPageLink.wallet.androidLink;
          break;
        case "cardPackage":
          link = Browser.ios ?
            appPageLink.cardPackage.iosLink :
            appPageLink.cardPackage.androidLink;
          break;
        case "signin":
          link = Browser.ios ?
            appPageLink.signin.iosLink :
            appPageLink.signin.androidLink;
          break;
        case "myDetail":
          link = Browser.ios ?
            appPageLink.myDetail.iosLink :
            appPageLink.myDetail.androidLink;
          break;
        default:
          break;
      }
      window.location.href = link;
    },
    getUserInfo: function () {
      if (Browser.ios) {
        return getUserInfo();
      } else {
        return window.news.getUserInfo();
      }
    },
    getBaseInfo: function () {
      if (Browser.ios) {
        return getBaseInfo();
      } else {
        return window.news.getBaseInfo();
      }
    },
    getNewUserInfo: function (callback) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(
            "getCommonH5Data", {
              getNewUserInfo: "getNewUserInfo"
            },
            function responseCallback(res) {
              callback(res);
            }
          );
        });
      } else {
        var userInfo = window.news.getUserInfo();
        if (userInfo == null || userInfo == undefined || userInfo == "") {
          userInfo =
            '{ "userId": "", "isSetSecurity": 0, "isSafe": 0, "point": 0, "vipType": 0, "level": 0, "status": 0, "experience": 0, "isSetTaste": 0, "sex": 0 }';
        }
        callback(userInfo);
      }
    },
    getNewBaseInfo: function (callback) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(
            "getCommonH5Data", {
              getNewBaseInfo: "getNewBaseInfo"
            },
            function responseCallback(res) {
              callback(res);
            }
          );
        });
      } else {
        callback(window.news.getBaseInfo());
      }
    },
    //  分享到指定的某个平台(分享网页链接)[适用场景：前端做分享按钮]
    scriptShare: function (sharePlatform, url, imageUrl, title, text) {
      /* sharePlatform  0：微信朋友圈 、 1：微信好友、2：QQ、3：QQ空间、4：微博 */
      if (Browser.ios) {
        return window.webkit.messageHandlers.scriptShare.postMessage({
          sharePlatform: sharePlatform,
          url: url,
          imageUrl: imageUrl,
          title: title,
          text: text
        });
      } else {
        return window.news.scriptShare(
          sharePlatform,
          url,
          imageUrl,
          title,
          text
        );
      }
    },
    //  分享到指定的某个平台(分享图片)[适用场景：前端做分享按钮]
    scriptShareImg: function (sharePlatform, imageUrl, shareType) {
      /** sharePlatform  0：微信朋友圈 、 1：微信好友、2：QQ、3：QQ空间、4：微博
       *  shareType      0：以表情的形式分享（限微信） 1：下载，2：以图片的形式分享
       */
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(
            "scriptShareImg", {
              sharePlatform: sharePlatform,
              imageUrl: imageUrl,
              isShare: shareType
            },
            function responseCallback(res) {}
          );
        });
      } else {
        return window.news.scriptShareImg(sharePlatform, imageUrl, shareType);
      }
    },
    //  打开分享弹框[适用场景：调起APP的分享按钮]
    openSharePanel: function (url, imageUrl, title, text) {
      if (Browser.ios) {
        return window.webkit.messageHandlers.openSharePanel.postMessage({
          url: url,
          imageUrl: imageUrl,
          title: title,
          text: text
        });
      } else {
        return window.news.openSharePanel(url, imageUrl, title, text);
      }
    },
    //  打开APP原生登陆页
    pushToLoginView: function () {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(
            "pushToLoginView", {
              pushToLoginView: "pushToLoginView"
            },
            function responseCallback(res) {}
          );
        });
      } else {
        return window.news.pushToLoginView();
      }
    },
    //  支付（单纯使用微信或者支付宝）
    peanutPay: function (
      payType,
      bussiCode,
      bussiDesc,
      goodsCode,
      goodsDesc,
      price,
      userId,
      extContent
    ) {
      /** payType  支付方式:1-微信支付;2-苹果支付 */
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(
            "peanutPay", {
              payType: payType,
              bussiCode: bussiCode,
              bussiDesc: bussiDesc,
              goodsCode: goodsCode,
              goodsDes: goodsDesc,
              price: price,
              userId: userId,
              extContent: extContent
            },
            function responseCallback(responseData) {}
          );
        });
      } else {
        window.news.peanutPay(
          payType,
          bussiCode,
          bussiDesc,
          goodsCode,
          goodsDesc,
          price,
          userId,
          extContent
        );
      }
    },
    // 混合支付（钱包余额+现金）
    peanutMixturePay(commodityKey, bussiCode, bussiDesc, goodsDesc, price, extContent, goodsType) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(
            "peanutMixturePay", {
              commodityKey: commodityKey,
              bussiCode: bussiCode,
              bussiDesc: bussiDesc,
              goodsDes: goodsDesc,
              price: price,
              extContent: extContent,
              goodsType: goodsType
            },
            function responseCallback(responseData) {}
          );
        });
      } else {
        window.news.peanutMixturePay(commodityKey, bussiCode, bussiDesc, goodsDesc, price, extContent, goodsType);
      }
    },
    //  AES加密(用户相关)
    encrypt: function (value, callback) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("encrypt", value, function responseCallback(res) {
            callback(res);
          });
        });
      } else {
        callback(window.news.encrypt(value));
      }
    },
    /*调用客户端的埋点方法*/
    saveH5Statistic: function (id, itemName) {
      if (Browser.ios) {
        window.webkit.messageHandlers.saveH5Statistics.postMessage({
          id: id,
          jsonValue: itemName
        });
      } else {
        window.news.saveH5Statistics(id, '{"jsonValue":"' + itemName + '"}');
      }
    },
    commonH5Data: function (type, data, callback) {
      /** getCommonH5Data
       *  saveCommonH5Data
       * 使用方法：nfyg.commonH5Data('get', data, function(res){})
       * 使用方法：nfyg.commonH5Data('save', data, function(res){})
       */
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(
            type == "get" ? "getCommonH5Data" : "saveCommonH5Data",
            data,
            function responseCallback(res) {
              callback(res);
            }
          );
        });
      } else {
        var key = Object.keys(data)[0];
        var value = Object.values(data)[0];
        if (type == "get") {
          var h5Data = window.news.getCommonH5Data(key);
          callback(h5Data);
        } else {
          return window.news.saveCommonH5Data(key, value);
        }
      }
    }
  };

  //  ios调用第三方的方法定义
  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement("iframe");
    WVJBIframe.style.display = "none";
    WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  }

  //  其他常用公用方法
  var otherCommon = {
    //  获取一定范围内n个随机整数
    getRandomNumber: function (start, end, n) {
      var arr = [];
      for (var i = 0; i < n; i++) {
        var number = Math.floor(Math.random() * (end - start + 1) + start);
        if (arr.indexOf(number) < 0) {
          arr.push(number);
        } else {
          i--;
        }
      }
      return arr;
    },
    //  获取路径参数
    getParseUrl: function () {
      var search = location.search;
      if (!search) {
        return false;
      } else {
        var i = search.indexOf("?");
        var querystr = search.substr(i + 1);
        var arr1 = querystr.split("&");
        var arr2 = new Object();
        for (i in arr1) {
          var ta = arr1[i].split("=");
          arr2[ta[0]] = ta[1];
        }
        return arr2;
      }
    },
    /*获取参数*/
    GetQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = decodeURIComponent(window.location.search).substr(1).match(reg);
      if (r != null) {
        // console.log(r);
        return decodeURI(r[2]);
      }
      return null;
    },
    //  提示信息
    promptShow: function (msg) {
      /** <div class="prompt" id="prompt"><em>提示信息</em></div> */
      $("#prompt")
        .children("em")
        .html(msg);
      $("#prompt").show();
      window.setTimeout(function () {
        $("#prompt").hide();
      }, 2000);
    },
    //  验证码倒计时
    timeCountDown: function (obj) {
      if (wait == 0) {
        $(obj).removeClass("disabled");
        $(obj).html("获取验证码");
        wait = 60;
      } else {
        $(obj).addClass("disabled");
        $(obj).html(wait + " s");
        wait--;
        setTimeout(function () {
          otherCommon.timeCountDown(obj);
        }, 1000);
      }
    },
    //  获取数据
    getDataspecial: function (type, url, datatype, data, async, callback) {
      $.ajax({
        type: type,
        url: url,
        dataType: datatype,
        data: data,
        async: async,
        timeout: 5000,
        contentType: "application/x-www-form-urlencoded",
        success: function (res) {
          callback(res);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          otherCommon.promptShow(
            "<strong>抱歉，网络繁忙请稍后</strong><br/>或尝试切换网络试试"
          );
        }
      });
    },
    //  通用获取数据
    getDatanormal: function (type, url, datatype, data, async, callback) {
      $.ajax({
        type: type,
        url: url,
        dataType: datatype,
        data: data,
        async: async,
        timeout: 5000,
        success: function (res) {
          callback(res);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          otherCommon.promptShow(
            "<strong>抱歉，网络繁忙请稍后</strong><br/>或尝试切换网络试试"
          );
        }
      });
    }
  };

  NFYG.installModule = function installModule(module) {
    var params = [],
      len = arguments.length - 1;
    while (len-- > 0) params[len] = arguments[len + 1];

    var Class = this;
    if (!Class.prototype.modules) {
      Class.prototype.modules = {};
    }
    var name =
      module.name ||
      Object.keys(Class.prototype.modules).length + "_" + Utils.now();
    Class.prototype.modules[name] = module;
    // Prototype
    if (module.proto) {
      Object.keys(module.proto).forEach(function (key) {
        Class.prototype[key] = module.proto[key];
      });
    }
    // Class
    if (module.static) {
      Object.keys(module.static).forEach(function (key) {
        Class[key] = module.static[key];
      });
    }
    // Callback
    if (module.install) {
      module.install.apply(Class, params);
    }
    return Class;
  };
  NFYG.use = function use(module) {
    var params = [],
      len = arguments.length - 1;
    while (len-- > 0) params[len] = arguments[len + 1];

    var Class = this;
    if (Array.isArray(module)) {
      module.forEach(function (m) {
        return Class.installModule(m);
      });
      return Class;
    }
    return Class.installModule.apply(Class, [module].concat(params));
  };
  var Browser$1 = {
    name: "browser",
    proto: {
      browser: Browser
    },
    static: {
      browser: Browser
    }
  };
  var otherCommon$1 = {
    name: "otherCommon",
    proto: {
      otherCommon: otherCommon
    },
    static: {
      otherCommon: otherCommon
    }
  };
  var components = [Browser$1, otherCommon$1];
  if (typeof NFYG.use === "undefined") {
    NFYG.use = NFYG.Class.use;
    NFYG.installModule = NFYG.Class.installModule;
  }
  NFYG.use(components);
  return NFYG;
});
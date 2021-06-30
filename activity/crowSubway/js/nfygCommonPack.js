/**
 * nfygCommonPack.js 3.0.4
 * author : yerongtao
 * last modified date : 2020/06/16
 * NFYG： [App与H5交互接口] 方法的封装
 * 使用方法 :
 *     html 里先引入zepto.min.js，再引入nfyg-pack-common.js
 *     初始化之后：
 *     var nfyg = new NFYG();
 */
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? (module.exports = factory()) :
    typeof define === "function" && define.amd ? define(factory) : (global.NFYG = factory());
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
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || (!!u.match(/AppleWebKit/) && u.indexOf("QIHU") && u.indexOf("QIHU") > -1 && u.indexOf("Chrome") < 0), //是否为移动终端
      android: ua.match(/Android/i) == "android", //android终端
      ios: ua.match(/iPhone\sOS/i) == "iphone os", //ios终端
      weixin: ua.match(/MicroMessenger/i) == "micromessenger", //微信內置浏览器
      qqb: ua.match(/MQQBrowser/i) == "mqqbrowser" && !u.match(/\sQQ/i), //QQ浏览器
      qq: ua.match(/iPhone\sOS/i) == "iphone os" ? (ua.match(/\sQQ/i) == " qq" && !u.match(/MQQBrowser/i)) : (ua.match(/\sQQ/i) == " qq" && ua.match(/MQQBrowser/i) == "mqqbrowser"), //QQ内置浏览器
      weibo: ua.match(/WeiBo/i) == "weibo", // 微博内置浏览器
      alipay: ua.match(/Alipay/i) == "alipay", // 支付宝内置浏览器
      ding: ua.match(/dingtalk/i) == "dingtalk", //钉钉内置浏览器
      isNfyg: ua.match(/iPhone\sOS/i) == "iphone os" ? (typeof isNfygPlatform === "function" ? isNfygPlatform() : false) : (window.news ? true : false) //是否花生地铁APP
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
    /* sourceType 1：导航 、2：游戏、3：发现、4：新闻、5：广告 */
    openUrl: function (url, title, sourceType) {
      if (Browser.ios) {
        window.webkit.messageHandlers.openUrl.postMessage(url, title, sourceType);
      } else {
        window.news.toLink(url, title, sourceType);
      }
    },
    //  打开APP的固定页(协议跳转)
    /*type *wallet : 钱包 *cardPackage : 卡包 *signin ： 登录 *myDetail ： 个人资料 *novel : 小说首页 */
    openAppPage: function (type) {
      var link, versionCode;
      var baseInfo = nfyg.getBaseInfo();
      if (baseInfo != "") {
        baseInfo = JSON.parse(baseInfo);
        versionCode = baseInfo.versionCode
      }
      var appLink = {
        wallet: {
          ios: "nfyg://1/MyWalletViewController",
          and: "nfyg://1/com.nfyg.hsbb.views.mine.wallet.WalletActivity"
        },
        cardPackage: {
          ios: "nfyg://1/CardPackageViewController",
          and: "nfyg://1/com.nfyg.hsbb.views.mine.CardActivity"
        },
        signin: {
          ios: "nfyg://1/PNSigInViewController",
          and: "nfyg://1/com.nfyg.hsbb.views.sign.SignActivity"
        },
        myDetail: {
          ios: "nfyg://1/MyDetailViewController",
          and: "nfyg://1/com.nfyg.hsbb.views.mine.AccountActivity"
        },
        novel: {
          ios: "nfyg://1/PNNovelVC",
          and: "nfyg://1/com.nfyg.hsbb.views.novel.NovelActivity"
        },
        novel_2: {
          ios: versionCode >= 429 ? "nfyg://1/PNNovelVC" : "nfyg://2/Novel",
          and: versionCode >= 256 ? "nfyg://1/com.nfyg.hsbb.views.novel.ReadFragment" : "nfyg://2/Novel"
        },
        news: {
          ios: "nfyg://2/2",
          and: "nfyg://2/2"
        },
        buyTime: {
          ios: "nfyg://1/PNBuyTimeVC",
          and: "nfyg://1/com.nfyg.hsbb.views.pay.BookComboActivity"
        },
      };
      var link = Browser.ios ? appLink[type].ios : appLink[type].and;
      window.location.href = link;
    },
    getPosition: function () {
      if (Browser.ios) {
        return getPosition();
      } else {
        return window.news.getPosition();
      }
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
          bridge.callHandler("getCommonH5Data", {
            getNewUserInfo: "getNewUserInfo"
          }, function responseCallback(res) {
            callback(res);
          });
        });
      } else {
        var userInfo = window.news.getUserInfo();
        if (userInfo == null || userInfo == undefined || userInfo == "") {
          userInfo = '{ "userId": "", "isSetSecurity": 0, "isSafe": 0, "point": 0, "vipType": 0, "level": 0, "status": 0, "experience": 0, "isSetTaste": 0, "sex": 0 }';
        }
        callback(userInfo);
      }
    },
    getNewBaseInfo: function (callback) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("getCommonH5Data", {
            getNewBaseInfo: "getNewBaseInfo"
          }, function responseCallback(res) {
            callback(res);
          });
        });
      } else {
        callback(window.news.getBaseInfo());
      }
    },
    // 获取商户用户信息
    getShopUserInfo: function (callback) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("getShopUserInfo", "getShopUserInfo", function responseCallback(res) {
            callback(res);
          });
        });
      } else {
        var userInfo = window.news.getShopUserInfo();
        if (userInfo == null || typeof (userInfo) == undefined || userInfo == "") {
          userInfo = '{"uid": "", "uName": "", "headUrl": ""}';
        }
        callback(userInfo);
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
        return window.news.scriptShare(parseInt(sharePlatform), url, imageUrl, title, text);
      }
    },
    //  分享到指定的某个平台(分享图片)[适用场景：前端做分享按钮]
    scriptShareImg: function (sharePlatform, imageUrl, shareType) {
      /** sharePlatform  0：微信朋友圈 、 1：微信好友、2：QQ、3：QQ空间、4：微博 *  shareType      0：以表情的形式分享（限微信） 1：下载，2：以图片的形式分享 */
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("scriptShareImg", {
            sharePlatform: sharePlatform,

            imageUrl: imageUrl,
            isShare: shareType
          }, function () {});
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
          bridge.callHandler("pushToLoginView", {
            pushToLoginView: "pushToLoginView"
          }, function () {});
        });
      } else {
        return window.news.pushToLoginView();
      }
    },
    //  支付（单纯使用微信或者支付宝）/** payType  支付方式:1-微信支付;3-支付宝支付 */
    peanutPay: function (payType, bussiCode, bussiDesc, goodsCode, goodsDesc, price, userId, extContent) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(
          function (bridge) {
            bridge.callHandler("peanutPay", {
                payType: payType,
                bussiCode: bussiCode,
                bussiDesc: bussiDesc,
                goodsCode: goodsCode,
                goodsDes: goodsDesc,
                price: price,
                userId: userId,
                extContent: extContent
              },
              function responseCallback(res) {}
            );
          });
      } else {
        window.news.peanutPay(payType, bussiCode, bussiDesc, goodsCode, goodsDesc, price, userId, extContent);
      }
    },
    // 混合支付下单（钱包余额+现金）
    peanutMixturePay(commodityKey, maxNum) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("peanutMixturePay", {
            commodityKey: commodityKey,
            maxNum: maxNum
          }, function () {});
        });
      } else {
        window.news.peanutMixturePay(commodityKey, maxNum);
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
    //  AES加密 -- 多参数  value  json对象{a:"aaa",b:"bbb",c:"ccc"} 要求传入的值为string类型   callback  返回加密后的一个对象
    mul_encrypt: function (value, callback) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("mul_encrypt", value, function responseCallback(res) {
            var data = {};
            for (var item in res) {
              if (res.hasOwnProperty(item)) {
                data[item] = res[item]
              }
            }
            callback(data);
          });
        });
      } else {
        var data = {};
        for (var item in value) {
          if (value.hasOwnProperty(item)) {
            data[item] = window.news.encrypt(value[item])
          }
        }
        callback(data);
      }
    },
    decrypt: function (value, callback) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("decrypt", value, function responseCallback(res) {
            callback(res);
          });
        });
      } else {
        callback(window.news.decrypt(value));
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
      /** getCommonH5Data  使用方法：nfyg.commonH5Data('get', data, function(res){})
       *  saveCommonH5Data  使用方法：nfyg.commonH5Data('save', data, function(res){})  */
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler(type == "get" ? "getCommonH5Data" : "saveCommonH5Data", data, function responseCallback(res) {
            callback(res);
          });
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
    },
    h5Log: function (tag, logInfo) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("h5Log", {
            tag: tag,
            logInfo: logInfo
          }, function () {});
        });
      } else {
        window.news.h5Log(tag, logInfo)
      }
    },
    checkAppInstall: function (name, callback) {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("checkAppInstall", {
            "checkAppInstall": name
          }, function responseCallback(res) {
            callback(res);
          });
        });
      } else {
        callback(window.news.checkAppInstall(name));
      }
    },
    // 微信授权
    AuthOnGetUserInfo: function () {
      if (Browser.ios) {
        setupWebViewJavascriptBridge(function (bridge) {
          bridge.callHandler("AuthOnGetUserInfo", {
            "AuthOnGetUserInfo": "AuthOnGetUserInfo"
          }, function responseCallback(res) {
            callback(res);
          });
        });
      } else {
        console.log("window.news.AuthOnGetUserInfo();");
        window.news.AuthOnGetUserInfo();
      }
    },
	
	getWXUserInfo:function(){
		if (Browser.ios) {
		  setupWebViewJavascriptBridge(function (bridge) {
		    bridge.callHandler("getWXUserInfo", {
		      "getWXUserInfo": "getWXUserInfo"
		    }, function responseCallback(res) {
				var dataobj = eval("("+res+")");
				openid = dataobj.openid;
			  
			  if(openid != '(null)'&&openid != ''&&openid != undefined){
				if(!isbind){
					isbind = true;
					clearInterval(interUserInfo);
					nfyg.encrypt(openid, function(data) {
						openid = data;
						nfyg.encrypt(mobile, function(res) {
							bindAccount(res,openid);
						})
					})
				}
			  }
			  
		    });
		  });
		}
	}
  };

  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
  var otherCommon = {
    getRandomNumber: function (start, end, n) {
      var arr = [];
      for (var i = 0; i < n; i++) {
        var number = Math.floor(Math.random() * (end - start + 1) + start);
        if (arr.indexOf(number) < 0) {
          arr.push(number)
        } else {
          i--
        }
      }
      return arr
    },
    GetQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = decodeURIComponent(window.location.search).substr(1).match(reg);
      if (r != null) {
        return decodeURI(r[2])
      }
      return null
    },
    promptShow: function (msg) {
      $("#prompt").children("em").html(msg);
      $("#prompt").show();
      window.setTimeout(function () {
        $("#prompt").hide()
      }, 2000)
    },
    timeCountDown: function (obj) {
      if (wait == 0) {
        $(obj).removeClass("disabled").css("background-color","#331c5a");
        $(obj).html("获取验证码");
        wait = 60
      } else {
        $(obj).addClass("disabled").css("background-color","#999");
        $(obj).html(wait + " s");
        wait--;
        setTimeout(function () {
          otherCommon.timeCountDown(obj)
        }, 1000)
      }
    },
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
          callback(res)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          otherCommon.promptShow("<strong>抱歉，网络繁忙请稍后</strong><br/>或尝试切换网络试试")
        }
      })
    },
    getDatanormal: function (type, url, datatype, data, async, callback) {
      $.ajax({
        type: type,
        url: url,
        dataType: datatype,
        data: data,
        async: async,
        timeout: 5000,
        success: function (res) {
          callback(res)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          otherCommon.promptShow("<strong>抱歉，网络繁忙请稍后</strong><br/>或尝试切换网络试试")
        }
      })
    },
    curentTime: function (now) {
      var year = now.getFullYear(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        hh = now.getHours(),
        mm = now.getMinutes();
      var clock = year + "-";
      if (month < 10) {
        clock += "0";
      }
      clock += month + "-";
      if (day < 10) {
        clock += "0";
      }
      clock += day + " ";
      return (clock);
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
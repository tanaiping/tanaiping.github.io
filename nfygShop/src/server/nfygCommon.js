/**nfygCommon.js
 * author : yerongtao
 * last modified date : 2019/10.10 */
const u = navigator.userAgent;
const ua = u.toLowerCase();
export const browser = {
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
    isNfyg: ua.match(/iPhone\sOS/i) == "iphone os" ? (typeof window.isNfygPlatform == "function" ? window.isNfygPlatform() : false) : (window.news ? true : false) //是否花生地铁APP        
}
export const getBaseInfo = () => {
    if (browser.isNfyg) {
        if (browser.ios) {
            return window.getBaseInfo();
        } else {
            return window.news.getBaseInfo();
        }
    } else return null
}
export const getUserInfo = () => {
    if (browser.isNfyg) {
        if (browser.ios) {
            return window.getUserInfo();
        } else {
            let userInfo = window.news.getUserInfo();
            if (!userInfo) {
                userInfo = '{ "userId": "", "isSetSecurity": 0, "isSafe": 0, "point": 0, "vipType": 0, "level": 0, "status": 0, "experience": 0, "isSetTaste": 0, "sex": 0 }';
            }
            return userInfo;
        }
    } else return null
}
export const getPosition = () => {
    if (browser.isNfyg) {
        if (browser.ios) {
            return window.getPosition();
        } else {
            return window.news.getPosition();
        }
    } else return null
}
// 打开APP的固定页(协议跳转)
/*type *wallet-钱包 *cardPackage-卡包 *signin-登录 *myDetail-个人资料 *novel-小说首页 *buyTime-小说购买时长 */
export const openAppPage = (type) => {
    let versionCode;
    let baseInfo = getBaseInfo();
    if (baseInfo != "") {
        baseInfo = JSON.parse(baseInfo);
        versionCode = baseInfo.versionCode
    }
    if (browser.isNfyg) {
        const appLink = {
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
                ios: versionCode >= 429 ? "nfyg://1/PNNovelVC" : "nfyg://2/Novel",
                and: versionCode >= 256 ? "nfyg://1/com.nfyg.hsbb.views.novel.ReadFragment" : "nfyg://2/Novel"
            },
            buyTime: {
                ios: "nfyg://1/PNBuyTimeVC",
                and: "nfyg://1/com.nfyg.hsbb.views.pay.BookComboActivity"
            },
            chat: {
                ios: versionCode >= 439 ? "nfyg://1/PNChatMainVC" : "",
                and: versionCode >= 257 ? "nfyg://2/Chat" : ""
            }
        };
        const link = browser.ios ? appLink[type].ios : appLink[type].and;
        window.location.href = link;
    }
}
export const getNewBaseInfo = (callback) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler('getCommonH5Data', {
                    getNewBaseInfo: "getNewBaseInfo"
                }, (res) => {
                    callback(res);
                });
            });
        } else {
            callback(window.news.getBaseInfo());
        }
    }
}
export const getNewUserInfo = (callback) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler('getCommonH5Data', {
                    getNewUserInfo: "getNewUserInfo"
                }, (res) => {
                    callback(res);
                });
            });
        } else {
            let userInfo = window.news.getUserInfo();
            if (!userInfo) {
                userInfo = '{ "userId": "", "isSetSecurity": 0, "isSafe": 0, "point": 0, "vipType": 0, "level": 0, "status": 0, "experience": 0, "isSetTaste": 0, "sex": 0 }';
            }
            callback(userInfo);
        }
    }
}
//  AES加密(用户相关)
export const encrypt = (value, callback) => {
    if (browser.isNfyg) {
        value = value.toString()
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler("encrypt", value, (res) => {
                    callback(res);
                });
            });
        } else {
            callback(window.news.encrypt(value));
        }
    }
}
//  AES加密 -- 多参数  value  json对象{a:"aaa",b:"bbb",c:"ccc"} 要求传入的值为string类型   callback  返回加密后的一个对象
export const mul_encrypt = (value, callback) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler("mul_encrypt", value, (res) => {
                    let data = {};
                    for (let item in res) {
                        if (res.hasOwnProperty(item)) {
                            data[item] = res[item]
                        }
                    }
                    callback(data);
                });
            });
        } else {
            let data = {};
            for (let item in value) {


                if (value.hasOwnProperty(item)) {
                    data[item] = window.news.encrypt(value[item])
                }
            }
            callback(data);
        }
    }
}
//  AES解密
export const decrypt = (value, callback) => {
    if (browser.isNfyg) {
        value = value.toString()
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler("decrypt", value, (res) => {
                    callback(res);
                });
            });
        } else {
            callback(window.news.decrypt(value));
        }
    }
}
//  分享到指定的某个平台(分享网页链接)[适用场景：前端做分享按钮]
/* sharePlatform  0：微信朋友圈 、 1：微信好友、2：QQ、3：QQ空间、4：微博 */
export const scriptShare = (sharePlatform, url, imageUrl, title, text) => {
    if (browser.isNfyg) {
        if (browser.ios) {
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
    }
}
//  分享到指定的某个平台(分享图片)[适用场景：前端做分享按钮]
/** sharePlatform  0：微信朋友圈 、 1：微信好友、2：QQ、3：QQ空间、4：微博 
 *  shareType      0：以表情的形式分享（限微信） 1：下载，2：以图片的形式分享 */
export const scriptShareImg = (sharePlatform, imageUrl, shareType) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler("scriptShareImg", {
                    sharePlatform: sharePlatform,
                    imageUrl: imageUrl,
                    isShare: shareType
                }, () => { });
            });
        } else {
            return window.news.scriptShareImg(sharePlatform, imageUrl, shareType);
        }
    }
}
//  打开分享弹框[适用场景：调起APP的分享按钮]
export const openSharePanel = (url, imageUrl, title, text) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            return window.webkit.messageHandlers.openSharePanel.postMessage({
                url: url,
                imageUrl: imageUrl,
                title: title,
                text: text
            });
        } else {
            return window.news.openSharePanel(url, imageUrl, title, text);
        }
    }
}
export const checkAppInstall = (andName, iosName, callback) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler("checkAppInstall", {
                    "checkAppInstall": iosName
                }, function responseCallback (res) {
                    callback(res);
                });
            });
        } else {
            callback(window.news.checkAppInstall(andName));
        }
    }
}
// 打开页面
export const tolink = (url, title, sourceType) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            return window.webkit.messageHandlers.toLink.postMessage({
                url: url,
                title: title,
                sourceType: parseInt(sourceType)
            });
        } else {
            return window.news.toLink(url, title, parseInt(sourceType));
        }
    }
}
//  打开APP原生登陆页
export const pushToLoginView = () => {
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler("pushToLoginView", {
                    pushToLoginView: "pushToLoginView"
                }, () => { });
            });
        } else {
            return window.news.pushToLoginView();
        }
    }
}
/*调用客户端的埋点方法*/
export const saveH5Statistic = (id, itemName) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            window.webkit.messageHandlers.saveH5Statistics.postMessage({
                id: id,
                jsonValue: itemName
            });
        } else {
            window.news.saveH5Statistics(id, '{"jsonValue":"' + itemName + '"}');
        }
    }
}
export const commonH5Data = (type, data, callback) => {
    /** getCommonH5Data  使用方法：nfyg.commonH5Data('get', data, function(res){})
     *  saveCommonH5Data  使用方法：nfyg.commonH5Data('save', data, function(res){})  */
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler(type === "get" ? "getCommonH5Data" : "saveCommonH5Data", data, (res) => {
                    callback(res);
                });
            });
        } else {
            let key = Object.keys(data)[0];
            let value = Object.values(data)[0];
            if (type === "get") {
                let h5Data = window.news.getCommonH5Data(key);
                callback(h5Data);
            } else {
                return window.news.saveCommonH5Data(key, value);
            }
        }
    }
}
export const h5Log = (tag, logInfo) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge((bridge) => {
                bridge.callHandler("h5Log", {
                    tag: tag,
                    logInfo: logInfo
                }, () => { });
            });
        } else {
            window.news.h5Log(tag, logInfo)
        }
    }
}
//  支付（单纯使用微信或者支付宝）/** payType  支付方式:1-微信支付;3-支付宝支付 */
export const peanutPay = (payType, bussiCode, bussiDesc, goodsCode, goodsDesc, price, userId, extContent) => {
    if (browser.isNfyg) {
        if (browser.ios) {
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
                    }, () => { });
                });
        } else {
            window.news.peanutPay(payType, bussiCode, bussiDesc, goodsCode, goodsDesc, price, userId, extContent);
        }
    }
}
// 混合支付下单（钱包余额+现金）
export const peanutMixturePay = (commodityKey, maxNum) => {
    if (browser.isNfyg) {
        if (browser.ios) {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler("peanutMixturePay", {
                    commodityKey: commodityKey,
                    maxNum: maxNum
                }, () => { });
            });
        } else {
            window.news.peanutMixturePay(commodityKey, maxNum);
        }
    }
}
export const setupWebViewJavascriptBridge = (callback) => {
    if (window.WebViewJavascriptBridge) {
        return callback(window.WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    let WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(() => {
        document.documentElement.removeChild(WVJBIframe);
    }, 0);
}
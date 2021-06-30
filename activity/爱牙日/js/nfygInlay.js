var ua = navigator.userAgent.toLowerCase();
var nfyg = {
    closeWindow:function(){
         if (ua.match(/iPhone\sOS/i) == "iphone os") {
         return	window.webkit.messageHandlers.closeWindow.postMessage("");
         }
         else{
         return	window.news.closeWindow();
         }
    },
    openUrl:function(url){
         if (ua.match(/iPhone\sOS/i) == "iphone os") {
         	window.webkit.messageHandlers.openUrl.postMessage(url);
         }
         else{
         window.news.toLink(url);
         }
    },
        plistaToRecommend:function(type, data){
         if (ua.match(/iPhone\sOS/i) == "iphone os") {
             window.webkit.messageHandlers.toRecommend.postMessage({"type":type,"data":data});
         }
         else{
         window.news.toRecommend(type,JSON.stringify(data));
         }
    },
    isPlatform:function(){
        if (ua.match(/iPhone\sOS/i) == "iphone os") {
         	if (typeof isNfygPlatform === 'function') {
                return isNfygPlatform();
            }
         }
         else if (window.news){
         	return true;
         }
         return false;
    },
    getUserInfo:function(){
        if (ua.match(/iPhone\sOS/i) == "iphone os") {
           return getUserInfo();
         }
         else {
           return window.news.getUserInfo();
         }
         return false;
    },
    scriptShare:function(sharePlatform,url,imageUrl,title,text){
        if (ua.match(/iPhone\sOS/i) == "iphone os") {
            return window.webkit.messageHandlers.scriptShare.postMessage({"sharePlatform":sharePlatform, "url":url, "imageUrl":imageUrl, "text":text,"title":title});
         }
        else {
           window.news.scriptShare(sharePlatform,url,imageUrl,title,text);
         }
         return false;
    },
}

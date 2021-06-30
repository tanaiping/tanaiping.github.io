function dateFormat(){
	Date.prototype.format = function(fmt) { 
     var o = { 
        "M+" : this.getMonth()+1,                 //月份 
        "d+" : this.getDate(),                    //日 
        "h+" : this.getHours(),                   //小时 
        "m+" : this.getMinutes(),                 //分 
        "s+" : this.getSeconds(),                 //秒 
        "q+" : Math.floor((this.getMonth()+3)/3), //季度 
        "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}   
}
function user(){
	var localUser = localStorage.userName;
	var localPass = localStorage.passWord;
	console.log(localUser);
	if(localUser != "admin" || localUser == "" || localPass != "123456" || localPass == ""){
		var locaBarUrl = window.location.hash;
		var locaUrl = locaBarUrl.substr(3);
		localStorage.Url = locaUrl;
		window.location.href="login.html";
		
	}
}

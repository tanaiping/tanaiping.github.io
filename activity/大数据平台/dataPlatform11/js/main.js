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
function mDate(){
	 // 初始化时间控件
    var start ={
      elem: '#siteStartTime', //需显示日期的元素选择器
          event: 'click', //触发事件
          format: 'YYYY-MM-DD', //日期格式
          istime: false, //是否开启时间选择
          isclear: false, //是否显示清空
          istoday: false, //是否显示今天
          issure: false, //是否显示确认
          min: '1900-01-01', //设定最小日期为当前日期  
          max: laydate.now(-1), //最大日期
          start: laydate.now(),
        choose: function(datas){
           end.min = datas; //开始日选好后，重置结束日的最小日期
             end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end ={
      elem: '#siteEndTime', //需显示日期的元素选择器
          event: 'click', //触发事件
          format: 'YYYY-MM-DD', //日期格式
          istime: false, //是否开启时间选择
          isclear: false, //是否显示清空
          istoday: false, //是否显示今天
          issure: false, //是否显示确认
          min: laydate.now(-7), //设定最小日期为当前日期  
          max: laydate.now(-1), //最大日期
        choose: function(datas){
          start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    }
    laydate(start);
    laydate(end);
    //默认最近7天
    $("#siteStartTime").val(laydate.now(-7));
    $("#siteEndTime").val(laydate.now(-1));
}
function flowDate(){
	// 初始化时间控件
    var start ={
      elem: '#flowStartTime', //需显示日期的元素选择器
          event: 'click', //触发事件
          format: 'YYYY-MM-DD', //日期格式
          istime: false, //是否开启时间选择
          isclear: false, //是否显示清空
          istoday: false, //是否显示今天
          issure: false, //是否显示确认
          min: '1900-01-01', //设定最小日期为当前日期  
          max: laydate.now(-1), //最大日期
          start: laydate.now(),
        choose: function(datas){
           end.min = datas; //开始日选好后，重置结束日的最小日期
             end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end ={
      elem: '#flowEndTime', //需显示日期的元素选择器
          event: 'click', //触发事件
          format: 'YYYY-MM-DD', //日期格式
          istime: false, //是否开启时间选择
          isclear: false, //是否显示清空
          istoday: false, //是否显示今天
          issure: false, //是否显示确认
          min: laydate.now(-7), //设定最小日期为当前日期  
          max: laydate.now(-1), //最大日期
        choose: function(datas){
          start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    }
    laydate(start);
    laydate(end);
    //默认最近7天
    $("#flowStartTime").val(laydate.now(-7));
    $("#flowEndTime").val(laydate.now(-1));
}
function lineDate(){
	// 初始化时间控件
    var start ={
      elem: '#lineStartTime', //需显示日期的元素选择器
          event: 'click', //触发事件
          format: 'YYYY-MM-DD', //日期格式
          istime: false, //是否开启时间选择
          isclear: false, //是否显示清空
          istoday: false, //是否显示今天
          issure: false, //是否显示确认
          min: '1900-01-01', //设定最小日期为当前日期  
          max: laydate.now(-1), //最大日期
          start: laydate.now(),
        choose: function(datas){
           end.min = datas; //开始日选好后，重置结束日的最小日期
             end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end ={
      elem: '#lineEndTime', //需显示日期的元素选择器
          event: 'click', //触发事件
          format: 'YYYY-MM-DD', //日期格式
          istime: false, //是否开启时间选择
          isclear: false, //是否显示清空
          istoday: false, //是否显示今天
          issure: false, //是否显示确认
          min: laydate.now(-7), //设定最小日期为当前日期  
          max: laydate.now(-1), //最大日期
        choose: function(datas){
          start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    }
    laydate(start);
    laydate(end);
    //默认最近7天
    $("#lineStartTime").val(laydate.now(-7));
    $("#lineEndTime").val(laydate.now(-1));
}

window.cbk = function() {
        var mySubway = subway("metro_line", {
            adcode: 3100,
            theme: "colorful",
            client: 0,
            doubleclick: {
                switch: true
            }
        });

        //地铁加载完成，执行complete事件
        mySubway.event.on("subway.complete", function(ev, info) {
            var id = info.id;
        });

        //点击站点，显示此站点的信息窗体
        mySubway.event.on("station.touch", function(ev, info) {
            if(station_touch ==2){
                var id = info.id;
                mySubway.stopAnimation();
                mySubway.addInfoWindow(id, {});
                var center = mySubway.getStCenter(id);
                mySubway.setCenter(center);
            }else{
                $(".end-line input").val(info.name).focus();
            }
        });

        //点击线路名，高亮此线路
        mySubway.event.on("lineName.touch", function(ev, info) {
            mySubway.showLine(info.id);
            var select_obj = qs('#g-select');
            mySubway.setFitView(select_obj);
            var center = mySubway.getSelectedLineCenter();
            mySubway.setCenter(center);
        });

        //点击空白, 关闭infowindow
        mySubway.event.on("subway.touch", function() {
            mySubway.clearInfoWindow();
        });

        //设置起点
        mySubway.event.on("startStation.touch", function(ev, info) {
            mySubway.stopAnimation();
            mySubway.clearInfoWindow();
            mySubway.setStart(info.id, {});
            startInfo = info;
            route();
            $(".start-line input").val(info.name);
            linesFun(0);
        });

        //设置终点
        mySubway.event.on("endStation.touch", function(ev, info) {
            mySubway.stopAnimation();
            mySubway.clearInfoWindow();
            mySubway.setEnd(info.id, {});
            endInfo = info;
            route();
            $(".end-line input").val(info.name);
            linesFun(0);
        });

        //路线规划
        var startInfo = {},
            endInfo = {};
        function route() {
            if (startInfo.id && endInfo.id) {
                mySubway.route(startInfo.id, endInfo.id, {});
                startInfo = {};
                endInfo = {};
            }
        }

        //-----------------------自定义事件 ------------------------------------
        function select_station(stationName,inputId){
            var keyword=stationName;
            if(stationName!=""){
                var param = buildParam(keyword);
                var id;
                $.ajax({
                    url : net_address+"/v1/metro/getSiteByKeyword",
                    async: false,
                    type: 'post',
                    data:param,
                    success  : function(res) {
                              console.log("ssss===="+res);
                            if(res.resultCode==0){
                                id=res.data[0].siteId;
                                $("#"+inputId).val(res.data[0].siteName);
                                console.log("ssssss"+res.data[0].siteName);
                            }else{
                                id="";
                            }
                    }
                });

                return id;
            }

            // 收集参数
            function buildParam(keyword){
               var param = {};
               var keyword = keyword;
               param["keyword"] = keyword;
               return JSON.stringify(param);
            }
            
        }

        /*线路查询 切换始、终点站 */
        $(".switch-img").click(function(){
            $(".route_close_btn").click(); //先要执行关键的按钮 。 不然两个互换始终点 点击的图标会消失
            var chage;
            var start = $("#start_line").val();
            var end = $("#end_line").val();
            change= start;
            start = $("#start_line").val(end);
            end = $("#end_line").val(change);
            mySubway.route($("#start_line").val(), $("#end_line").val());
            mySubway.setStart($("#start_line").val());
            mySubway.setEnd($("#end_line").val());
        });

        function linesFun(index){
            var sId = select_station($("#start_line").val(),"start_line");
            var dId = select_station($("#end_line").val(),"end_line");
            $("#query-result").empty();
            if(sId!=""&&dId!=""&&sId!="undefined"&&dId!="undefined"){
                var time = 0; //预计多少分钟
                var siteList = [];//途经多少站
                var lines = "";
                var param = buildParam(sId,dId);
                console.log(param);
                $.ajax({
                    url : net_address+"/v1/metro/Routes",
                    type: 'post',
                    data:param,
                    success  : function(res) {
                              console.log(res);
                            if(res.resultCode==0){
                                var html ="";
                                html+='<div class="com-pad result-box">';
                                if(res.data.routeList.length>1){
                                    if(index==0){
                                        html+='<dl class="line-menu-dl"><dd class="act">推荐线路</dd><dd>线路二</dd></dl>';
                                    }else{
                                        html+='<dl class="line-menu-dl"><dd>推荐线路</dd><dd class="act">线路二</dd></dl>';
                                    }
                                    html+='<div class="lines-box"><div class="line-info border-b"><ul class="station-name-list">';
                                }else{
                                        html+='<div class="lines-box"><div class="line-info border-b"><ul class="station-name-list">';
                                }
                                for(var j=0;j<res.data.routeList[index].routeLineList.length;j++){
                                        if(j==0){
                                            console.log("!1");
                                            lines = res.data.routeList[index].routeLineList[j].lineId;
                                            html+='<li class="lines-start">'+res.data.routeList[index].routeLineList[j].siteName+'</li><li class="lines-redline"><em></em></li>';
                                        }else{
                                            console.log("!2");
                                            if(lines != res.data.routeList[index].routeLineList[j].lineId){
                                                 if(j!=res.data.routeList[index].routeLineList.length-1){ 
                                                    html+='<li class="lines-change">'+res.data.routeList[index].routeLineList[j].siteName+'</li>';
                                                    html+='<li class="lines-line"><em></em><span class="change-info">'+ res.data.routeList[index].routeLineList[j].oriName+'</span></li>'
                                                 }else{
                                                    html+='<li class="lines-nochange">'+res.data.routeList[index].routeLineList[j].siteName+'</li>';
                                                 }
                                                lines = res.data.routeList[index].routeLineList[j].lineId;
                                            }else if(j==res.data.routeList[index].routeLineList.length-1&&lines == res.data.routeList[index].routeLineList[j].lineId){
                                                html+='<li class="lines-nochange">'+res.data.routeList[index].routeLineList[j].siteName+'</li>';
                                            }
                                            
                                        }
                                        siteList.push(res.data.routeList[index].routeLineList[j].siteName);
                                        time+=res.data.routeList[index].routeLineList[j].time;
                                    }
                                var minute = 0;
                                minute =Math.ceil(time/60);//向上取整
                                console.log(time+"===="+minute);
                                html+='</ul></div>';
                                html+='<div class="line-detailinfo">';
                                html+='<img src="images/station_num.png" alt=""><em class="t1">途经'+siteList.length+'站</em>';
                                html+='<img src="images/time_ico.png" alt=""><em class="t2">预计时间'+minute+'分钟</em>';
                                html+='<img src="images/price_ico.png" alt=""><em class="t3">票价'+res.data.price+'元</em></div></div>';
                                html+='</div>';
                                $("#query-result").append(html).show();
                                // console.log(res.data.RouteDetail.RouteLine[0].siteName);
                                mySubway.clearRoute();
                                var len = res.data.routeList[index].routeLineList.length;
                                for(var j=0;j<len-1;j++){
                                    var m =parseInt(j+1);
                                    start = res.data.routeList[index].routeLineList[j].siteName;
                                    end = res.data.routeList[index].routeLineList[m].siteName;
                                    mySubway.route(start, end);
                                    
                                }
                                mySubway.setStart(res.data.routeList[index].routeLineList[0].siteName);
                                mySubway.setEnd(res.data.routeList[index].routeLineList[len-1].siteName);
                            }
                    }
                });

                // 收集参数
                function buildParam(sId,dId){
                   var param = {};
                   param["sId"] = sId;
                   param["dId"] = dId;
                   return JSON.stringify(param);
                }

            }else{
                alert("您的输入有误！！！");
            }
        }

        /* 点击搜索事件 */
        $("#start_line,#end_line").on('keypress',function(e) {  
                var keycode = e.keyCode;  
                // var siteList0 = [];
                // var siteList1 = [];
                if(keycode=='13') {  
                    e.preventDefault();    
                    //请求搜索接口 
                    linesFun(0);
                } 

         }); 

        //推荐线路  线路2
        $("#query-result").on("click","dd",function(){
            var index = $("#query-result dd").index(this);
            $("#query-result dd").removeClass('act').eq(index).addClass('act');
            $(".lines-box").hide().eq(index).show();
            linesFun(index);
        });

        /*  根据线路/站点查询线路   */
        $("#end_station").on('keypress',function(e) {  
            var keycode = e.keyCode;  
                if(keycode=='13') {  
                  e.preventDefault(); 
                  var lineId = $(".start-line select option:selected").attr("lineid");
                  var stationName = $(this).val();
                  var siteId =  select_station(stationName,"end_station");
                  console.log("siteId===="+siteId+"lineId===="+lineId+"====="+param);
                    var param = buildParam(lineId,siteId);
                    console.log(param);
                    $.ajax({
                        url : net_address+"/v1/metro/lineListBySite",
                        type: 'post',
                        data:param,
                        success  : function(res) {
                                  console.log(res);
                                if(res.resultCode==0){
                                    $("#query-result").show();
                                    $("#query-result").empty();
                                    var html = '';
                                    for(var i=0;i<res.data.length;i++){
                                        getStationList(res.data[i].lineId,1);
                                        var len =stationList.length;
                                        var lineTimes = res.data[i].lineTime.split("##");
                                        console.log(lineTimes.length+"lineTimes.length");
                                        console.log(stationList.join()+"6666666");
                                        html+='<div class="com-pad result-box"><div class="station-work-time-box border-b">';
                                        html+='<div class="subway-namebox"><span>'+res.data[i].lineName+'</span><em></em></div>';
                                        html+='<div class="subway-timebox"><div class="direct"><img src="images/direct_ico.png" alt=""><span>'+stationList[0]+'方向</span></div>';
                                        html+='<div class="times">'+lineTimes[0]+'</div></div>';
                                        html+='<div class="subway-timebox"><div class="direct"><img src="images/direct_ico.png" alt=""><span>'+stationList[len-1]+'方向</span></div>';
                                        html+='<div class="times">'+lineTimes[1]+'</div></div>';
                                        html+='</div>';
                                    }
                                    html+='<div class="station-detailinfo"><img src="images/high-speed.png" alt=""><em class="t1">高铁</em>';
                                    html+='<img src="images/plane.png" alt=""><em class="t2">机场</em><img src="images/port.png" alt=""><em class="t3">口岸</em>';
                                    html+='<a href="javascript:;" class="station-detail-link">站点详情<img src="images/add_ico.png" alt=""></a></div>'   
                                     html+='</div>';
                                    $("#query-result").append(html);
                            }
                        }
                    });

                 // 收集参数
                    function buildParam(lineId,siteId){
                       var param = {};
                       param["siteId"] = siteId;
                       param["lineId"] = lineId;
                       return JSON.stringify(param);
                    }

                }

        });

        /*  获取厕所列表   */
        $("#toilet_station").on('keypress',function(e) {  
            var keycode = e.keyCode;  
                if(keycode=='13') {  
                    e.preventDefault(); 
                  var lineId = $(".start-line select option:selected").attr("lineid");
                  var stationName = $(this).val();
                  var siteId =  select_station(stationName,"toilet_station");
                  var html ="";
                  if(siteId!=""&&siteId!="undefined"){
                        var param = buildParam(siteId);
                        console.log(param);
                        $.ajax({
                            url : net_address+"/v1/metro/wcList",
                            type: 'post',
                            data:param,
                            success  : function(res) {
                                      console.log(res.data);
                                    if(res.resultCode==0){
                                        if(res.data.length>0){ //有结果的时候
                                            $("#query-result").show();
                                            $("#query-result .result-box").empty();
                                            for(var i=0;i<res.data.length;i++){
                                                console.log(i);
                                                if(siteId==res.data[i].siteId){
                                                    html+='<div class="com-pad result-box">';
                                                    html+='<div class="station-work-time-box border-b"><h3 class="result-title">为您找到此站有1个洗手间</h3>';
                                                    html+='<div class="toilet-box"><em>'+res.data[i].wcTitle+'</em><br/>闸机外需要刷卡出站</div></div></div>';
                                                    $("#query-result").append(html);
                                                    return false;
                                                }else{
                                                    html+='<div class="com-pad result-box">';
                                                    html+='<div class="station-work-time-box border-b"><h3 class="result-title">此站没有洗手间';
                                                    html+='<div class="desc1">为您找到最近<em>'+res.data[i].siteName+'</em>的1个洗手间</div></h3>';
                                                    html+='<div class="toilet-box"><em>'+res.data[i].wcTitle+'</em><br/>闸机外需要刷卡出站</div></div>';
                                                    html+='<div class="route-text">前往路线</div><ul class="station-name-list">';
                                                    html+='<li class="lines-start">'+stationName+'</li>';
                                                    html+='<li class="lines-redline"><em></em><span class="change-info">1号线（罗宝线）机场东方向 3站</span></li>';
                                                    html+='<li class="lines-start">'+res.data[i].siteName+'</li></ul></div></div>';
                                                    $("#query-result").append(html);
                                                    return false;
                                                }
                                            }
                                        }
                                        
                                    }
                            }
                        });
                    }

                     // 收集参数
                        function buildParam(siteId){
                           var param = {};
                           param["siteId"] = siteId;
                           return JSON.stringify(param);
                        }
                }

        });

        /*  获取站点出口 */
        $("#out_station").on('keypress',function(e) {  
            var keycode = e.keyCode;  
                if(keycode=='13') {  
                  e.preventDefault(); 
                  var lineId = $(".start-line select")
                  var siteId =  select_station($(this).val(),"out_station");
                  console.log(siteId);
                  if(siteId!=""&&siteId!="undefined"){
                        var param = buildParam(siteId);
                        console.log(param);
                        $.ajax({
                            url : net_address+"/v1/metro/exitList",
                            type: 'post',
                            data:param,
                            async:false,
                            success  : function(res) {
                                      console.log(res);
                                    if(res.resultCode==0){
                                        localStorage.setItem("key",JSON.stringify(res.data));
                                        window.location.href="export_detail.html";
                                    }
                            }
                        });
                    }

                     // 收集参数
                        function buildParam(siteId){
                           var param = {};
                           param["siteId"] = siteId;
                           return JSON.stringify(param);
                        }
                }

        });

        /* 线路切换 */
 
        $('.start-line select').on('change',function(){
            // mySubway.clearRoute();
            var $this_val = $(this).val();
            var $this_text = $(".start-line select").find("option:selected").text();
            if($this_val!=-1){
               mySubway.showLine($this_text);
            }else{

            }

            $(".end-line input").val();
            $("#query-result").empty();
        });

    };


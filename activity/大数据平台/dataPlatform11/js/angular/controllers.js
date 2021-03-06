﻿/**
 *
 * Responsive website using AngularJS
 * http://www.script-tutorials.com/responsive-website-using-angularjs/
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Script Tutorials
 * http://www.script-tutorials.com/
 */

'use strict';

// optional controllers

function HomeCtrl($scope, $http,$rootScope,$timeout) {
	//获取实时人数
	$scope.curAllNum = '10000';
	$scope.numRun2 = $("#cur_data").numberAnimate({num:$scope.curAllNum, speed:2000, symbol:","});
	function ajaxGetNum(){
		$http({
		    method: 'GET',
		    url: $rootScope.url + 'ajax_data.php?action=currentCount&area=' + $rootScope.dragText
		}).then(function successCallback(response) {
		        // 请求成功执行代码
		        $scope.curAllNum = response.data.data.uv;
		        console.log($scope.curAllNum);
		        $scope.numRun2.resetData($scope.curAllNum);
		    }, function errorCallback(response) {
		        // 请求失败执行代码
		});
	}
	  $rootScope.c = 0;
	  var loop = function() {
	    $timeout(function() {
	      loop();
	      $rootScope.c += 1;
	      ajaxGetNum();
	    }, 3000)
	  };
	  loop();
	ajaxGetNum();
	
	//设置当前时间
    setCurTime();
    setInterval(setCurTime,3000);
    
    ajaxGetAllNum();    
    function ajaxGetAllNum(){
			$http({
			    method: 'GET',
			    url: $rootScope.url + 'ajax_data.php?action=allCount&area=' + $rootScope.dragText
			}).then(function successCallback(response) {
			        // 请求成功执行代码
			        $("#allNum").text(FormatNum(response.data.data.uv));
			    }, function errorCallback(response) {
			        // 请求失败执行代码
			});
	}
    
    $rootScope.c = 0;
	  var loop2 = function() {
	    $timeout(function() {
	      loop2();
	      $rootScope.c += 1;
	      ajaxGetAllNum();
	    }, 3000000)
	  };
	  loop2();
	  ajaxGetAllNum(); 


    //获取用户数
    function setCurTime(){
      var mydate = new Date();
      var h = mydate.getHours(); //获取当前小时数(0-23)
      var m = mydate.getMinutes(); //获取当前分钟数(0-59)
      var s = mydate.getSeconds(); //获取当前秒数(0-59)
      if (h<10) {h = "0" +h;}
          if (m<10) {m = "0" +m;}
          if (s<10) {s = "0" +s;}
      var time_text = h+":"+m+":"+s;
      $("#time").text(time_text);
    }
    
    
	

    //点击站点出来tips
    var stationTimeout;
    $scope.getStation=function(event){
    	var stationName = $(event.target).attr("station-name");
    	clearTimeout(stationTimeout);
		var obj = $(event.target).parents(".subway-wrap");
		var $this_left = parseInt($(event.target).css("left"))-62;
		var $this_top = parseInt($(event.target).css("top"))+13-78;
    	$http({
		    method: 'GET',
		    url: $rootScope.url + 'ajax_data.php?action=stationCount&area=' + $rootScope.dragText+'&state='+stationName
		}).then(function successCallback(response) {
		        // 请求成功执行代码
		        if($(".tips-stationclick").length==0){
					obj.append('<div class="tips-stationclick">'+
						       '<div class="tips-box"><p class="text-indent"><em class="cur-times2"></em></p>'+
							    '<p><em id="station_name2" class="m80"></em><em>,</em><em class="uv"></em><em>人</em></p></div></div>');
				}else{
					$(".tips-stationclick").show();
				}
				$(".cur-times2").text(getNowFormatDate());
				$("#station_name2").text($(event.target).attr("station-name"));
				$(".tips-stationclick").css({"left":$this_left+"px","top":$this_top+"px"});
				$(".uv").text(response.data.data.uv);
				stationTimeout = setTimeout(function(){$(".tips-stationclick").hide();},3000);
		    }, function errorCallback(response) {
		        // 请求失败执行代码
		});
    }

    
    


    //获取当前时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var second = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (min >= 1 && min <= 9) {
            min = "0" + min;
        }
        if (second >= 0 && second <= 9) {
            second = "0" + second;
        }
        // date.getFullYear() + seperator1 + month + seperator1 + strDate+ " " + 
        var currentdate =hour + seperator2 + min + seperator2 + second;
        return currentdate;
    }

    function FormatNum(str){
        var str = ''+str;
        var newStr = "";
        var count = 0;

        if(str.indexOf(".")==-1){
            for(var i=str.length-1;i>=0;i--){
                if(count % 3 == 0 && count != 0){
                    newStr = str.charAt(i) + "," + newStr;
                }else{
                    newStr = str.charAt(i) + newStr;
                }
                count++;
            }
            //str = newStr + ".00"; //自动补小数点后两位
            str = newStr;
        }
        else
        {
            for(var i = str.indexOf(".")-1;i>=0;i--){
                if(count % 3 == 0 && count != 0){
                    newStr = str.charAt(i) + "," + newStr;
                }else{
                    newStr = str.charAt(i) + newStr; //逐个字符相接起来
                }
                count++;
            }
            str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
        }
        return str;
    }  
}

/* fen  */
function flowQueryCtrl($scope, $rootScope, $http, $timeout) {
	
	dateFormat();
	if($("#laydate_box").length==0){
		flowDate();
	}else{
		
	}
	
	function flowQueryTime(){
		$scope.flowStartTime = $("#flowStartTime").val();
		$scope.flowEndTime = $("#flowEndTime").val();
		$scope.startTime = new Date($scope.flowStartTime).format("yyyyMMdd");
		$scope.endTime = new Date($scope.flowEndTime).format("yyyyMMdd");
	}
	//查询
	$scope.queryBt=function(){
		flowQueryTime();
		$http({
			method: 'GET',
			url: $rootScope.url + 'ajax_data.php?action=cityFlow&startTime='+$scope.startTime+'&endTime='+$scope.endTime+'&area=' + $rootScope.dragText,
		}).then(function successCallback(response) {
			$scope.list = response.data.list;
			$scope.list2 = response.data.list2;
			$scope.data = response.data.list1;
			console.log(response.data.list2);
			queryEcharts();
		}, function errorCallback(response) {
			// 请求失败执行代码
		});
	}
	flowQueryTime();
	$http({
		method: 'GET',
		url: $rootScope.url + 'ajax_data.php?action=cityFlow&startTime='+$scope.startTime+'&endTime='+$scope.endTime+'&area=' + $rootScope.dragText,
	}).then(function successCallback(response) {
		$scope.list = response.data.list;
		$scope.list2 = response.data.list2;
		$scope.data = response.data.list1;
		console.log(response.data.list2);
		queryEcharts();
	}, function errorCallback(response) {
		// 请求失败执行代码
	});
	
	function queryEcharts(){
		var queryChart = echarts.init(document.getElementById("queryChart"));
		var option = {
			grid: {
				left: '5%',
				right: '5%',
				containLabel: true
			},
			tooltip: {
				show: true,
				trigger: 'axis',
				backgroundColor: ['#ffffff'],
				textStyle: {
					color: ['#003'],
				},
				/*axisPointer:{
					type:"cross"
				}*/
			},
			xAxis: {
				data: $scope.list2,
				boundaryGap: false,
				axisLabel: {
					color: "#FFFFFF"
				},
				axisTick: {
					show: false
				},
				//去掉x轴线
				axisLine: {
					show: false
				},
			},
			yAxis: {
				// 去除y轴上的刻度线
				axisTick: {
					show: false
				},
				axisLabel: {
					color: "#FFFFFF"
				},
				//去掉y轴线
				axisLine: {
					show: false
				},
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
			},
			series: [{
				name: '折线A',
				type: 'line',
				data: $scope.list,
				showSymbol: false,
				itemStyle: {
					normal: {
						color: "#2ec7c9",
						lineStyle: {
							color: "#2ec7c9",
							width: "4"
						}
					}
				},

			}]
		};
		queryChart.setOption(option);
	}
	
}

//实时曲线图
function diagramCtrl($scope, $http, $timeout, $rootScope) {
	//页面初始化
	$http({
		method: 'GET',
		url: $rootScope.url + 'ajax_data.php?action=tealTimeLine&area=' + $rootScope.dragText,
	}).then(function successCallback(response) {
		/*$scope.data1 = response.data.data1;
		$scope.data2 = response.data.data2;
		$scope.data3 = response.data.data3;
		$scope.data4 = response.data.data4;
		$scope.data = response.data.list;*/
		console.log(response.data);
		diagramQuery();
	}, function errorCallback(response) {
		// 请求失败执行代码
	});
	function diagramQuery(){
		var diagramChart = echarts.init(document.getElementById("diagramChart"));
		var option2 = {
			title: {
				text: '线路人流趋势图',
				left: '5%',
				top: '22',
				textStyle: {
					color: '#afc2e2',
	
				}
			},
			grid: {
				left: '5%',
				right: '5%',
				top: '12%',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				top: '27',
				textStyle: {
					color: '#fff',
	
				},
				data: ['一号线', '二号线', '三号线', '四号线', '五号线']
			},
			xAxis: {
				type: 'category',
				axisLabel: {
					color: "#FFFFFF",
					fontSize: '16'
				},
				axisLine: {
					lineStyle: {
						color: '#FFFFFF'
					}
				},
				data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					color: "#2ec7c9",
					fontSize: '16'
				},
				axisTick: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#2ec7c9'
					}
				},
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
			},
			series: [{
					name: '一号线',
					type: 'line',
					smooth: true,
					symbolSize: '10',
					itemStyle: {
						normal: {
							lineStyle: {
								width: "4"
							}
						}
					},
					data: [1121, 1234, 911, 934, 110, 1330, 150, 232, 201, 154, 190, 330, 410, 1230, 123, 455, 657, 674, 7844, 563, 2123, 453, 2345, 222],
				},
				{
					name: '二号线',
					type: 'line',
					smooth: true,
					symbolSize: '10',
					itemStyle: {
						normal: {
							lineStyle: {
								width: "4"
							}
						}
					},
					data: [1240, 555, 911, 934, 110, 1330, 150, 232, 201, 154, 190, 330, 410, 1230, 123, 455, 657, 674, 7844, 563, 2123, 453, 2345, 222],
				},
				{
					name: '三号线',
					type: 'line',
					smooth: true,
					symbolSize: '10',
					itemStyle: {
						normal: {
							lineStyle: {
								width: "4"
							}
						}
					},
					data: [2260, 1124, 911, 934, 110, 1330, 150, 232, 201, 154, 190, 330, 410, 1230, 123, 455, 657, 674, 7844, 563, 2123, 453, 2345, 222],
				},
				{
					name: '四号线',
					type: 'line',
					smooth: true,
					symbolSize: '10',
					itemStyle: {
						normal: {
							lineStyle: {
								width: "4"
							}
						}
					},
					data: [330, 1478, 911, 934, 110, 1330, 150, 232, 201, 154, 190, 330, 410, 1230, 123, 455, 657, 674, 7844, 563, 2123, 453, 2345, 222],
				},
				{
					name: '五号线',
					type: 'line',
					smooth: true,
					symbolSize: '10',
					itemStyle: {
						normal: {
							lineStyle: {
								width: "4"
							}
						}
					},
					data: [3130, 11, 2342, 1111, 110, 1330, 150, 232, 201, 154, 190, 330, 410, 1230, 123, 455, 657, 674, 7844, 563, 2123, 453, 2345, 222],
				}
			]
		};
		diagramChart.setOption(option2);
	}
}
//历史人流查询
function lineFlowQueryCtrl($scope, $http, $timeout, $rootScope) {
	dateFormat();
	lineDate();
	function lineQueryTime(){
		$scope.lineStartTime = $("#lineStartTime").val();
		$scope.lineEndTime = $("#lineEndTime").val();
		$scope.startTime = new Date($scope.lineStartTime).format("yyyyMMdd");
		$scope.endTime = new Date($scope.lineEndTime).format("yyyyMMdd");
	}
	lineQueryTime();
	
	//查询
	$scope.lineQueryBt=function(){
		lineQueryTime();
		$http({
			method: 'GET',
			url: $rootScope.url + 'ajax_data.php?ext=1&action=lineFlow&startTime='+$scope.startTime+'&endTime='+$scope.endTime+'&area=' + $rootScope.dragText,
		}).then(function successCallback(response) {
			$scope.lineList = response.data.list;
			$scope.lineDtate = response.data.date;
			$scope.data = response.data.list1;
			console.log(response.data.list1);
			lineEcharts();
		}, function errorCallback(response) {
			// 请求失败执行代码
		});
	}
	
	$http({
		method: 'GET',
		url: $rootScope.url + 'ajax_data.php?ext=1&action=lineFlow&startTime='+$scope.startTime+'&endTime='+$scope.endTime+'&area=' + $rootScope.dragText,
	}).then(function successCallback(response) {
		$scope.lineList = response.data.list;
		$scope.lineDtate = response.data.date;
		$scope.data = response.data.list1;
		console.log(response.data.list1);
		lineEcharts();
	}, function errorCallback(response) {
		// 请求失败执行代码
	});
	function lineEcharts(){
		var lineQueryChart = echarts.init(document.getElementById("lineQueryChart"));
		var option3 = {
			grid: {
				left: '5%',
				right: '5%',
				containLabel: true
			},
			tooltip: {
				show: true,
				trigger: 'axis',
				backgroundColor: ['#ffffff'],
				textStyle: {
					color: ['#003'],
				},
				/*axisPointer:{
					type:"cross"
				}*/
			},
			xAxis: {
				data: $scope.lineDtate,
				boundaryGap: false,
				axisLabel: {
					color: "#FFFFFF"
				},
				axisTick: {
					show: false
				},
				//去掉x轴线
				axisLine: {
					show: false
				},
			},
			yAxis: {
				// 去除y轴上的刻度线
				axisTick: {
					show: false
				},
				axisLabel: {
					color: "#FFFFFF"
				},
				//去掉y轴线
				axisLine: {
					show: false
				},
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
			},
			series: [{
				name: '折线A',
				type: 'line',
				data: $scope.lineList,
				showSymbol: false,
				itemStyle: {
					normal: {
						color: "#2ec7c9",
						lineStyle: {
							color: "#2ec7c9",
							width: "4"
						}
					}
				},
	
			}]
		};
		lineQueryChart.setOption(option3);
	}
}
//实时出行组合
function travelCombinationCtrl($scope, $http, $timeout,$rootScope) {

    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('main'));
    var  data = []; 
    var coords = []; 
    var isEchairs = false;
  var links = [];

  var colors = ['#44fd20', '#20fd92', '#20f0fd', '#f5fd20', '#7320fd', '#fdf020', '#e80c9d', '#e80c9d', '#fb048f', '#e80c21', '#fb0404'];

  function getColorPalette(i) {
      return colors[i];
  }
    var option = {
        title: {
            text: ''
        },
        tooltip: {},
        xAxis: {
            show: false,
            // type : 'category',
            // boundaryGap : false,
            // data : axisData
            type: 'value',
            min: 0,
            max: 1460,
        },
        yAxis: {
            show: false,
            type: 'value',
            min: 0,
            max: 1188,
            inverse: true
        },
        dataRange: {
            min: 0,
            max: 1500,
            y: '60%',
            calculable: true,
            color: ['#d20528', 'orange', 'yellow', 'lime', 'aqua'],
            show:false
        },
        grid: {
              containLabel: true,
              top: '0',
              bottom: '-20',
              left: '-35',
              right: '0'
          },
        series: [{
            type: 'effectScatter',  //波纹 graph effectScatter
            // rippleEffect: {
            //     brushType: 'stroke'
            // },
            layout: 'none',
            roam:true,
            coordinateSystem: 'cartesian2d',
            symbolSize: 12,
            edgeSymbol: ['none', 'arrow'], // ['none', 'arrow'] ['circle', 'arrow']
            edgeSymbolSize: [2, 10],
            data: data,
            links: links,
            label: {
                normal: {
                    show: true,
                    position: 'right',//显示位置
                    offset:[5, 0], //偏移设置
                    formatter: '{b}', //圆环显示文字
                    color:"#00FFFC",
                    fontSize:14
                },
                emphasis: {
                  show: true,
                }
            }
        }, {
            name: '',
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            zlevel: 1,
          effect: {
                  show: true,
                  period: 3,
                  trailLength: 0.01,
                  symbolSize: 13,
                  symbol: "triangle",
                  //color:'rgba(55,155,255,0.5)'
              },
            lineStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: 'rgb(255, 0, 0)'
                    }, {
                        offset: 1,
                        color: 'rgb(0, 255, 0)'
                    }]),
                    color:'#a0a0a0',
                    color: function() {
                        return getColorPalette(3);
                    }(),
                    width: 2,
                    opacity: 0.6,
                    curveness: 0.2,//贝塞尔曲线度
                    type:"dotted"
                }
            },
            data: coords
        }]
    };
   
  	$rootScope.c = 0;
	  var loop3 = function() {
	    $timeout(function() {
	      loop3();
	      $rootScope.c += 1;
	      getEchartsData();
	    }, 10000)
	  };
	 loop3();

	 getEchartsData();
      //获取echarts数据 并组装数据
      function getEchartsData(){
      	
      	$http({
		    method: 'GET',
		    url: $rootScope.url + 'ajax_data.php?action=topLine&area=gz&size=20'

		}).then(function successCallback(response) {
		        // 请求成功执行代码
		        $scope.data = response.data.ranking;
		        var station = response.data.stationData; 
		        var people = response.data.people; 
		        var stationData=[],valueData=[];
		        for(var i=0;i<station.length;i++){
		        	stationData.push(station[i])
		        }
		        for(var i=0;i<people.length;i++){
		        	valueData.push(people[i])
		        }
		        //组装data数据
		        for(var y=0;y<stationData.length;y++){
		          var param =[];
		          var sta_name =stationData[y];
		          $(".station-box").each(function(){
		          if($(this).attr("station-name")===sta_name){
		            var left = parseInt($(this).css("left"))+8;
		            var top = parseInt($(this).css("top"))+10;
		            param.push(left);
		            param.push(top);
		          }
		        })
		        data.push({"name":stationData[y],"value":param});
		        }
//		         console.log( JSON.stringify(data));
		        //组装画线的数据
		        for(var x=0;x<data.length;x+=2){
		          var coord1 = [];
		          var coord2 = [];
		          var coord = [];
		          // var coord = [];
		          var left1 = data[x].value[0];
		          var top1 = data[x].value[1];
		          coord1.push(left1);
		          coord1.push(top1);
		          coord.push({"coord":coord1});
		          left1 = data[(x+1)].value[0];
		          top1 = data[(x+1)].value[1];
		          coord2.push(left1);
		          coord2.push(top1);
		          coord.push({"coord":coord2,"value":valueData[x/2]});
		          coords.push(coord);
		        }
		        
		        // 为echarts对象加载数据 
		        if(!isEchairs){
		        	//只调用一次
		        	myChart.setOption(option);
		        }
		        isEchairs=true;
    			 
//		        console.log( JSON.stringify(coords)+"====coords");
        
      }, function errorCallback(response) {
		        // 请求失败执行代码
		});  
		
		
      }

}

//实时Top站点人数
function numberOfSitesCtrl($scope, $http, $timeout) {}
//历史人流查询
function siteFlowQueryCtrl($scope, $http, $timeout, $rootScope) {
	dateFormat();
	mDate();
//	$scope.mStartTime2 = new Date().format("yyyyMMdd");
//	console.log($scope.mStartTime2);
	
	function time(){
		$scope.siteStartTime = $("#siteStartTime").val();
		$scope.siteEndTime = $("#siteEndTime").val();
		$scope.startTime = new Date($scope.siteStartTime).format("yyyyMMdd");
		$scope.endTime = new Date($scope.siteEndTime).format("yyyyMMdd");
		console.log($scope.startTime);
		$scope.stations = $("#select1").find("option:selected").text();
		$scope.stations2 = $("#select2").find("option:selected").text();
		$scope.stations3 = $("#select3").find("option:selected").text();
	}
	//点击查询
	$scope.siteQueryBt=function(){
		time();
		
		$http({
			method: 'GET',
			url: $rootScope.url + 'ajax_data.php?action=historyStationFlow&startTime='+$scope.startTime+'&endTime='+$scope.endTime+'&stations='+$scope.stations+'&stations1='+$scope.stations2+'&stations2='+$scope.stations3+'&area=' + $rootScope.dragText,
		}).then(function successCallback(response) {
			$scope.data1 = response.data.data1;
			$scope.data2 = response.data.data2;
			$scope.data3 = response.data.data3;
			$scope.data4 = response.data.data4;
			$scope.data = response.data.list;
			console.log(response.data);
			siteQuery();
		}, function errorCallback(response) {
			// 请求失败执行代码
		});
	}
	time();
	//页面初始化
	$http({
		method: 'GET',
		url: $rootScope.url + 'ajax_data.php?action=historyStationFlow&startTime=20180501&endTime=20180506&stations='+$scope.stations+'&stations1='+$scope.stations2+'&stations2='+$scope.stations3+'&area=' + $rootScope.dragText,
	}).then(function successCallback(response) {
		$scope.data1 = response.data.data1;
		$scope.data2 = response.data.data2;
		$scope.data3 = response.data.data3;
		$scope.data4 = response.data.data4;
		$scope.data = response.data.list;
		console.log(response.data);
		siteQuery();
	}, function errorCallback(response) {
		// 请求失败执行代码
	});
	
	//公共echarts 
	function siteQuery(){
		var siteQueryChart = echarts.init(document.getElementById("siteQueryChart"));
		var option4 = {
			grid: {
				left: '5%',
				right: '5%',
				containLabel: true
			},
			tooltip: {
				show: true,
				trigger: 'axis',
				backgroundColor: ['#ffffff'],
				textStyle: {
					color: ['#003'],
				},
				/*axisPointer:{
					type:"cross"
				}*/
			},
			xAxis: {
				data: $scope.data4,
				boundaryGap: false,
				axisLabel: {
					color: "#FFFFFF"
				},
				axisTick: {
					show: false
				},
				//去掉x轴线
				axisLine: {
					show: false
				},
			},
			yAxis: {
				// 去除y轴上的刻度线
				axisTick: {
					show: false
				},
				axisLabel: {
					color: "#FFFFFF"
				},
				//去掉y轴线
				axisLine: {
					show: false
				},
				splitLine: {
					lineStyle: {
						type: 'dashed'
					}
				},
			},
			series: [{
				name: '站点1',
				type: 'line',
				data: $scope.data3,
				showSymbol: false,
				itemStyle: {
					normal: {
						color: "#2ec7c9",
						lineStyle: {
							color: "#2ec7c9",
							width: "4"
						}
					}
				},

			}, {
				name: '站点2',
				type: 'line',
				data: $scope.data1,
				showSymbol: false,
				itemStyle: {
					normal: {
						color: "#1fec0a",
						lineStyle: {
							color: "#1fec0a",
							width: "4"
						}
					}
				},

			}, {
				name: '站点3',
				type: 'line',
				data: $scope.data2,
				showSymbol: false,
				itemStyle: {
					normal: {
						color: "#fff100",
						lineStyle: {
							color: "#fff100",
							width: "4"
						}
					}
				},

			}]
		};
		siteQueryChart.setOption(option4);	
	}
}
//实时车厢拥堵情况
function carCongestionCtrl($scope, $http, $timeout) {}
//实时列车位置和人数
function positionAndNumberCtrl($scope, $http, $timeout) {}
//列车到站时刻表
function timetableCtrl($scope, $http, $timeout) {}
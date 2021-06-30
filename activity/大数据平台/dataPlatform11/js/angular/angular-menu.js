/**
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

// angular.js main app initialization
var app = angular.module('bonanzooka', []).
config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'pages/urbanSituation/starChart.html',
			activetab: 'projects',
			controller: HomeCtrl
		}).
		/*when('/project/:projectId', {
			templateUrl: function(params) {
				return 'pages/' + params.projectId + '.html';
			},
			controller: ProjectCtrl,
			activetab: 'projects'
		}).*/
		/* fen */
		when('/flowQuery', {
			templateUrl: 'pages/urbanSituation/flowQuery.html',
			controller: flowQueryCtrl,
			activetab: 'flowQuery'
		}).
		/* 路线情况 begin */
		when('/diagram', {
			templateUrl: 'pages/lineSituation/diagram.html',
			controller: diagramCtrl,
			activetab: 'diagram'
		}).

		when('/lineFlowQuery', {
			templateUrl: 'pages/lineSituation/lineFlowQuery.html',
			controller: lineFlowQueryCtrl,
			activetab: 'lineFlowQuery'
		}).

		when('/travelCombination', {
			templateUrl: 'pages/lineSituation/travelCombination.html',
			controller: travelCombinationCtrl,
			activetab: 'travelCombination'
		}).
		/* 路线情况 end */

		/* 站点情况 begin */
		when('/numberOfSites', {
			templateUrl: 'pages/siteSituation/numberOfSites.html',
			controller: numberOfSitesCtrl,
			activetab: 'numberOfSites'
		}).
		when('/siteFlowQuery', {
			templateUrl: 'pages/siteSituation/siteFlowQuery.html',
			controller: siteFlowQueryCtrl,
			activetab: 'siteFlowQuery'
		}).
		/* 站点情况 end */

		/* 列车情况 begin */
		when('/carCongestion', {
			templateUrl: 'pages/trainCondition/carCongestion.html',
			controller: carCongestionCtrl,
			activetab: 'carCongestion'
		}).
		when('/positionAndNumber', {
			templateUrl: 'pages/trainCondition/positionAndNumber.html',
			controller: positionAndNumberCtrl,
			activetab: 'positionAndNumber'
		}).
		when('/timetable', {
			templateUrl: 'pages/trainCondition/timetable.html',
			controller: timetableCtrl,
			activetab: 'timetable'
		}).

		/* 列车情况 end */

		/* fen end */

		otherwise({
			redirectTo: '/'
		});
	}
]);

app.config(['$locationProvider',
	function($location) {
		$location.hashPrefix('!');
	}
]);
app.run(['$rootScope',function($rootScope){
	  $rootScope.dragFlag=false;
	  $rootScope.dragText="sz";
	  $rootScope.url="http://192.168.2.45:9092/";
}]);
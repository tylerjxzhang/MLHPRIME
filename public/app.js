(function(){
	var app = angular.module('firefly',['ui.router', 'ngRoute', 'ngMap']);

	app.config(function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "landing.html",
        controller: "IndexCtrl"
      })
      .when("/app/:category/:radius", {
        templateUrl: "main.html",
        controller: "MainCtrl"
      });
    $locationProvider.html5Mode(true);
	});

  app.controller('IndexCtrl', function($rootScope, $scope, $routeParams, $http){
    console.log("index controller loaded");
  });

  app.controller('MainCtrl', function($rootScope, $scope, $routeParams, $http){
    console.log("main controller loaded");
    console.log($routeParams);
  });
})();
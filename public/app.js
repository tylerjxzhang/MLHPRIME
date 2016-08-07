(function(){
	var app = angular.module('firefly',['ui.router', 'ngRoute', 'uiGmapgoogle-maps']);

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

  app.controller('MainCtrl', function($rootScope, $scope, $routeParams, $http, uiGmapGoogleMapApi){
    console.log("main controller loaded");
    console.log($routeParams);
    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 15
    };

    var options = {
      enableHighAccuracy: false
    };
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        $scope.$apply(function(){
          $scope.map.center = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
        });
        console.log(JSON.stringify($scope.map));
      },
      function(error) {
        alert('Unable to get location: ' + error.message);
      },
      options
    );
  });
})();
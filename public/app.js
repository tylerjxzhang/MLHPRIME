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
    $scope.keyword = $routeParams.category;
    $scope.radius = $routeParams.radius;
    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 12
    };

    $scope.markers = [];
    addMarker = function (data) {
      $scope.markers.push(
        {
            id: data.name,
            latitude: data.lat,
            longitude: data.lon
        }
      );
    };

    var options = {
      enableHighAccuracy: false
    };

    displayMarker = function() {
      $http({
        method: 'GET',
        url: '/api?lat=' + $scope.map.center.latitude + '\&lon=' + $scope.map.center.longitude + '\&radius=' + $scope.radius + '\&keyword='+ $scope.keyword
      }).then(function successCallback(response) {
          response.data.forEach(function(d){
            info = {
              'name': d.name,
              'lat': d.geometry.location.lat,
              'lon': d.geometry.location.lng
            };
            addMarker(info);
          });
          console.log($scope.markers);
          console.log(response);
      }, function errorCallback(response) {
        console.log(response);
      });
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
        displayMarker();
      },
      function(error) {
        alert('Unable to get location: ' + error.message);
      },
      options
    );
  });
})();
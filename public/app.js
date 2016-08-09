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

  app.controller('IndexCtrl', function($scope, $routeParams, $http){
  });

  app.controller('MainCtrl', function($scope, $routeParams, $http, uiGmapGoogleMapApi){
    // Loading screen
    $scope.loading = true;
    
    // Markers
    $scope.circles = [];
    var marker_id = 0;

    // Marker styling
    var styles = [
    {
      "featureType":"landscape",
      "stylers":[
      {
        "hue":"#ffe500"
      },
      {
        "saturation":-100
      },
      {
        "lightness":-45
      }
      ]
    },
    {
      "featureType":"poi",
      "stylers":[
      {
        "hue":"#0008ff"
      },
      {
        "saturation":-87
      },
      {
        "lightness":-51
      }
      ]
    },
    {
      "featureType":"road",
      "elementType":"labels.icon",
      "stylers":[
      {
        "hue":"#1100ff"
      },
      {
        "saturation":-65
      },
      {
        "gamma":1.05
      },
      {
        "visibility":"off"
      },
      {
        "lightness":-25
      }
      ]
    },
    {
      "featureType":"road.highway",
      "stylers":[
      {
        "lightness":21
      },
      {
        "saturation":-48
      },
      {
        "hue":"#ffff00"
      }
      ]
    },
    {
      "featureType":"water",
      "stylers":[
      {
        "saturation":-42
      },
      {
        "hue":"#0091ff"
      },
      {
        "lightness":-73
      }
      ]
    },
    {
      "featureType":"poi"
    }];

    // Query string params
    $scope.query = {
      'keyword':$routeParams.category,
      'radius':$routeParams.radius
    };

    // Map init setting
    $scope.map = {
      center: {
        latitude: 43.70011,
        longitude: -79.41630
      },
      options: {
        styles: styles
      },
      zoom: 13
    };

    // Draw new circle
    drawMarker = function(data) {
      $scope.circles.push(
      {
        id: ++marker_id,
        center: {
          latitude: data.lat,
          longitude: data.lon
        },
        radius: data.rad,
        stroke: {
          color: '#000',
          weight: 2,
          opacity: 1
        },
        fill: {
          color: '#FFFF66',
          opacity: 0.5
        }
      }
      );
    };

    // Create new circle
    addMarker = function(d) {
      info = {
        'name': d.name,
        'lat': d.geometry.location.lat,
        'lon': d.geometry.location.lng,
        'rad': 20 + d.score * 200,
        'fill': {
          'color': '#FFFF66',
          'opacity': d.score
        }
      };
      drawMarker(info);
      // Hide loading screen
      $scope.loading = false;
    };

    // Perform query and add circles
    displayMarkers = function() {
      $http({
        method: 'GET',
        url: '/api?lat='+$scope.map.center.latitude+'\&lon='+$scope.map.center.longitude+'\&radius='+$scope.query.radius+'\&keyword='+$scope.query.keyword
      }).then(
      function successCallback(response) {
        console.log('API response', response);
        response.data.forEach(addMarker);
      },function errorCallback(err) {
        console.log(err);
      });
    };

    getPosition = function() {
      navigator.geolocation.getCurrentPosition(
      function(position) {
        $scope.$apply(function() {
          $scope.map.center = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        });
        console.log('Found your current location', $scope.map.center);
        displayMarkers();
      },function(error) {
        $scope.$apply(function() {
          $scope.map.center = {
            latitude: 43.70011,
            longitude: -79.41630
          };
        });
        console.log('Unable to get location,');
        displayMarkers();
      },{
        enableHighAccuracy: false
      });
    };

    init = function() {
      getPosition();
    };

    init();
    
  });
})();
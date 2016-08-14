(function(){
	var app = angular.module('firefly',['ui.router', 'ngRoute', 'uiGmapgoogle-maps', 'google.places']);

	app.config(function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    $routeProvider
    .when("/", {
      templateUrl: "landing.html",
      controller: "IndexCtrl"
    })
    .when("/app/:lon/:lat/:category/:radius", {
      templateUrl: "main.html",
      controller: "MainCtrl"
    });
    $locationProvider.html5Mode(true);
  });

  app.controller('IndexCtrl', function($scope, $routeParams, $http, $location){
    $scope.loading = true;

    $scope.search = {
      'useCurrentLocation' : true,
      'location' : null,
      'category' : null,
      'radius' : 5,
      'currentLocation' : null
    };

    var getCurrentLocation = function() {
      navigator.geolocation.getCurrentPosition(
      function(position) {
        $scope.$apply(function() {
          $scope.search.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          $scope.loading = false;
        });
        console.log('Found your current location', $scope.search.currentLocation);
      },function(error) {
        $scope.$apply(function() {
          $scope.search.currentLocation = {
            latitude: 43.70011,
            longitude: -79.41630
          };
          $scope.loading = false;
        });
        console.log('Unable to get location, use toronto for fall back location');
      },{
        enableHighAccuracy: false
      });
    };

    getCurrentLocation();

    var getGeoCoord = function(loca) {
      return $http({
        method: 'GET',
        url: '/api/locate?address='+loca
      });
    };

    $scope.discover = function() {
      if ($scope.search.category) {
        if ($scope.search.useCurrentLocation && $scope.search.currentLocation) {
          $location.path('/app/' + $scope.search.currentLocation.longitude + '/' + $scope.search.currentLocation.latitude + '/' + $scope.search.category + '/' + $scope.search.radius);
        } else if (!$scope.search.useCurrentLocation && $scope.search.location) {
          $http.get('/api/locate?address='+$scope.search.location.formatted_address)
            .then(function successCallback (response) {
            $location.path('/app/' + response.data.longitude + '/' + response.data.latitude + '/' + $scope.search.category + '/' + $scope.search.radius);
          }, function errorCallback (response) {
            console.log(response);
          });
        }
      }
    };
  });

  app.controller('MainCtrl', function($scope, $routeParams, $http, uiGmapGoogleMapApi){
    // Loading screen
    $scope.loading = true;

    // Markers
    $scope.circles = [];
    $scope.markers = [];
    var marker_id = 0;
    var circle_id = 0;

    // Marker styling
    var styles = [{
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
      ]},{
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
      ]},{
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
      ]},{
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
      ]},{
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
      ]},{
      "featureType":"poi"
    }];

    // Query string params
    $scope.query = {
      'keyword':$routeParams.category,
      'radius':$routeParams.radius,
      'lon':$routeParams.lon,
      'lat':$routeParams.lat
    };

    $scope.category = $routeParams.category;

    // Map init setting
    $scope.map = {
      center: {
        latitude: $scope.query.lat,
        longitude: $scope.query.lon
      },
      options: {
        styles: styles
      },
      zoom: 13
    };

    getColor = function (value){
      //value from 0 to 1
      var hue=((1-value)*120).toString(10);
      return ["hsl(",hue,",100%,50%)"].join("");
    };

    // Draw new circle
    drawMarker = function(data) {
      $scope.circles.push(
        {
          id: ++circle_id,
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
            color: getColor(1 - data.score),
            opacity: 0.5
          }
        }
      );
      $scope.markers.push(
        {
          id: ++marker_id,
          location:{
            latitude: data.lat,
            longitude: data.lon
          },
          tweets: data.tweets,
          title: data.name,
          clickable: true
        }
      );
    };

    // Create new circle
    addMarker = function(d) {
      if (!d.score) {
        return
      }
      info = {
        'name': d.name,
        'lat': d.geometry.location.lat,
        'lon': d.geometry.location.lng,
        'rad': 20 + d.score * 200,
        'fill': {
          'color': '#FFFF66',
          'opacity': d.score
        },
        'tweets': d.tweets,
        'score': d.score
      };
      drawMarker(info);
      // Hide loading screen
      $scope.loading = false;
    };

    // Perform query and add circles
    displayMarkers = function() {
      $http({
        method: 'GET',
        url: '/api/discover?lat='+$scope.map.center.latitude+'\&lon='+$scope.map.center.longitude+'\&radius='+$scope.query.radius+'\&keyword='+$scope.query.keyword
      }).then(
      function successCallback(response) {
        console.log('API response', response);
        if (response.data) {
          response.data.forEach(addMarker);
        } else {
          $scope.loading = false;
        }
      },function errorCallback(err) {
        console.log(err);
      });
    };

    init = function() {
      displayMarkers();
    };

    init();
  });
})();

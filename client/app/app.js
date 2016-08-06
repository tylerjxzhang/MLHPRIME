'use strict';

angular.module('orbit360App', ['orbit360App.auth', 'orbit360App.admin', 'orbit360App.constants',
    'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'btford.socket-io', 'validation.match', 'ngMap','ngMaterial', 'mdPickers', 'ngFileUpload'
  ])
  .config(function($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider.otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
    var customBlueMap =     $mdThemingProvider.extendPalette('blue', {
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50'],
      '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
      .primaryPalette('customBlue', {
        'default': '500',
        'hue-1': '50'
      })
      .accentPalette('red');
  });
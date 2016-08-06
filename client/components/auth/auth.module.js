'use strict';

angular.module('orbit360App.auth', ['orbit360App.constants', 'orbit360App.util', 'ngCookies',
    'ngRoute'
  ])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });

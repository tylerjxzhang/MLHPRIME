'use strict';

class NavbarController {
  //end-non-standard

  //start-non-standard
  constructor($location, Auth) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  isActive(route) {
    return route === this.$location.path();
  }
}

angular.module('orbit360App')
  .controller('NavbarController', NavbarController);

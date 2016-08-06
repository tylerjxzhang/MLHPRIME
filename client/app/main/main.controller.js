'use strict';
class MainController {

  constructor($location, Auth) {
      this.$location = $location;
      this.isLoggedIn = Auth.isLoggedIn;
      this.isOpen = false;
    }

  quickSignup(form) {
    if (form.$valid) {
      this.$location.path('/signup/').search({name: this.user.name, email: this.user.email});
    }
  }
}

angular.module('orbit360App')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controllerAs: 'ma',
    controller: MainController
  });



/*constructor($http, $scope, socket) {
      this.$http = $http;
      this.socket = socket;
      this.awesomeThings = [];

      $scope.$on('$destroy', function() {
        socket.unsyncUpdates('thing');
      });
    }

    $onInit() {
      this.$http.get('/api/things')
        .then(response => {
          this.awesomeThings = response.data;
          this.socket.syncUpdates('thing', this.awesomeThings);
        });
    }

    addThing() {
      if (this.newThing) {
        this.$http.post('/api/things', {
          name: this.newThing
        });
        this.newThing = '';
      }
    }

    deleteThing(thing) {
      this.$http.delete('/api/things/' + thing._id);
    }*/
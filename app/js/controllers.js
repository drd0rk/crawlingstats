(function () {
  "use strict";

  angular.module("crawlingcontrollers", []).
    controller("stats", ["$scope", "matches", function ($scope, matches) {
      $scope.matches = matches.query();
    }]).
    controller("addmatch", ["$scope", "moment", "matches", "users", function ($scope, moment, matches, users) {
      $scope.resetMatch = function () {
        $scope.newMatch = {
          date: Date.now()
        };
      };
      $scope.addMatch = function () {
        matches.save($scope.newMatch);
        $scope.resetMatch();
        $scope.showSuccess = 1;
      };
      $scope.users = users.query();
      $scope.resetMatch();
    }]).
    controller("adduser", ["$scope", "users", function ($scope, users) {
      $scope.addUser = function () {
        users.save($scope.newUser);
        $scope.newUser = {};
      };
    }]);

}());

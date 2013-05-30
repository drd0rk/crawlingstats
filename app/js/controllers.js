(function () {
  "use strict";

  angular.module("crawlingcontrollers", []).
    controller("stats", ["$scope", "matches", "users", 'matchutils', 'userstats', function ($scope, matches, users, matchutils, userstats) {
      var calculateStats;
      $scope.users = users.query();
      $scope.matches = matches.query();
      $scope.stats = [];

      $scope.sortCriterion = ['-winRatio', '-games', '-crawlIndex', 'crawled'];
      $scope.reverse = false;
      $scope.sortBy = function (criterion) {
        if (criterion.toString() === $scope.sortCriterion.toString()) {
          $scope.reverse = !$scope.reverse;
        } else {
          $scope.sortCriterion = criterion;
          $scope.reverse = false;
        }
      };
      $scope.isToZero = matchutils.isToZero;

      $scope.$watch("users.$resolved && matches.$resolved", function (resolved) {
        $scope.stats = userstats.calc($scope.matches);
      });

      $scope.getUser = function (id) {
        return $scope.users.filter(function (u) { return u._id === id; })[0];
      };

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

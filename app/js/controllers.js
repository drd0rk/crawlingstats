(function () {
  "use strict";

  angular.module("crawlingcontrollers", []).

    controller("stats", ["$scope", "matches", "users", 'matchutils', 'overallstats', 'userstats', 'teamstats', function ($scope, matches, users, matchutils, overallstats, userstats, teamstats) {
      $scope.users = users.query();
      $scope.matches = matches.query();

      $scope.sortCriterion = ['-winRatio', '-games', '-crawlIndex', 'crawled'];
      $scope.teamSortCriterion = ['-winRatio', '-games', '-crawlRatio', 'crawled'];
      $scope.reverse = false;
      $scope.teamReverse = false;
      $scope.sortBy = function (criterion) {
        if (criterion.toString() === $scope.sortCriterion.toString()) {
          $scope.reverse = !$scope.reverse;
        } else {
          $scope.sortCriterion = criterion;
          $scope.reverse = false;
        }
      };
      $scope.teamSortBy = function (criterion) {
        if (criterion.toString() === $scope.teamSortCriterion.toString()) {
          $scope.teamReverse = !$scope.teamReverse;
        } else {
          $scope.teamSortCriterion = criterion;
          $scope.teamReverse = false;
        }
      };
      $scope.isToZero = matchutils.isToZero;

      $scope.$watch("matches.$resolved", function (resolved) {
        $scope.userstats = userstats.calc($scope.matches);
        $scope.teamstats = teamstats.calc($scope.matches);
        $scope.overallstats = overallstats.calc($scope.matches);
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

      $scope.removeSelected = function (user) {
        var m = $scope.newMatch;
        return [m.team1, m.team2].every(function (t) {
          if (t === undefined) {
            return true;
          } else {
            return [t.defensive, t.offensive].every(function (p) {
              return p !== user._id;
            });
          }
        });
      };

      $scope.getUserName = function (id) {
        if (!id) {
          return '';
        }
        return $scope.users.filter(function (u) {
          return u._id === id;
        })[0].name;
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

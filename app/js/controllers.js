(function () {
  "use strict";

  angular.module("crawlingcontrollers", []).
    controller("stats", ["$scope", "matches", "users", function ($scope, matches, users) {
      var calculateStats;
      $scope.users = users.query();
      $scope.matches = matches.query();
      $scope.stats = [];

      $scope.getUser = function (id) {
        return $scope.users.filter(function (u) { return u._id === id; })[0];
      };

      $scope.$watch("users.$resolved && matches.$resolved", function (resolved) {
        if (resolved === true) {
          calculateStats($scope.users, $scope.matches);
        }
      });

      calculateStats = function (users, matches) {
        users.forEach(function (u) {
          var ustats = {
            user: u
          };
          var userMatches = matches.filter(function (m) {
            return ['defensive', 'offensive'].some(function (pos) {
              return m.team1[pos] === u._id || m.team2[pos] === u._id;
            });
          });
          var team1Matches = userMatches.filter(function (m) {
            return ["defensive", 'offensive'].some(function (pos) {
              return m.team1[pos] === u._id;
            });
          });
          var team2Matches = userMatches.filter(function (m) {
            return ["defensive", 'offensive'].some(function (pos) {
              return m.team2[pos] === u._id;
            });
          });
          var userWins = team1Matches.filter(function (m) {
            return m.result.team1 > m.result.team2;
          }).concat(team2Matches.filter(function (m) {
            return m.result.team2 > m.result.team1;
          }));
          var userLosses = team1Matches.filter(function (m) {
            return m.result.team1 < m.result.team2;
          }).concat(team2Matches.filter(function (m) {
            return m.result.team2 < m.result.team1;
          }));

          // games count
          ustats.games = userMatches.length;
          ustats.wins = userWins.length;
          ustats.losses = userLosses.length;
          ustats.crawled = userLosses.filter(function (m) {
            return m.result.team1 === 0 || m.result.team2 === 0;
          }).length;
          ustats.letCrawl = userWins.filter(function (m) {
            return m.result.team1 === 0 || m.result.team2 === 0;
          }).length;
          ustats.crawlIndex = ustats.letCrawl - ustats.crawled;

          $scope.stats.push(ustats);
        });
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

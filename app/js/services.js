(function () {
  "use strict";

  /*global moment*/

  angular.module("crawlingservices", []).

    factory("moment", function () {
      return moment;
    }).

    factory("matches", ["cachedResource", "users", function (cachedResource, users) {
      return cachedResource({path: "/matches"});
    }]).

    factory("users", ["cachedResource", function (cachedResource) {
      return cachedResource({path: "/users/:id"});
    }])

    .factory('matchutils', [function () {
      return {
        getWinningTeam: function (match) {
          if (match.result.team1 > match.result.team2) {
            return match.team1;
          }
          return match.team2;
        },

        getLosingTeam: function (match) {
          if (match.result.team2 > match.result.team1) {
            return match.team1;
          }
          return match.team2;
        },

        isToZero: function (match) {
          if (match.result.team1 === 0 || match.result.team2 === 0) {
            return true;
          }
          return false;
        }
      };
    }])

    .factory('RawStats', [function () {
      return function () {
        var stats =  {};
        return {
          add: function (key, statname, value) {
            if (!stats[key]) {
              stats[key] = {};
            }
            if (!stats[key][statname]) {
              stats[key][statname] = 0;
            }
            stats[key][statname] += value;
          },

          addOne: function (key, statname) {
            this.add(key, statname, 1);
          },

          getAll: function () {
            return stats;
          }
        };
      };
    }])

    .factory('userstats', ['RawStats', 'matchutils', 'users', function (RawStats, mu, users) {
      return {
        calc: function (matches) {
          var rawStats = new RawStats(), userstats = [];
          matches.forEach(function (m) {
            // wins
            rawStats.addOne(mu.getWinningTeam(m).defensive, 'wins');
            rawStats.addOne(mu.getWinningTeam(m).offensive, 'wins');
            // losses
            rawStats.addOne(mu.getLosingTeam(m).defensive, 'losses');
            rawStats.addOne(mu.getLosingTeam(m).offensive, 'losses');
            // crawls
            if (mu.isToZero(m)) {
              rawStats.addOne(mu.getLosingTeam(m).defensive, 'crawled');
              rawStats.addOne(mu.getLosingTeam(m).offensive, 'crawled');
              rawStats.addOne(mu.getWinningTeam(m).defensive, 'letCrawl');
              rawStats.addOne(mu.getWinningTeam(m).offensive, 'letCrawl');
            }
          });
          Object.getOwnPropertyNames(rawStats.getAll()).forEach(function (s) {
            var stats = rawStats.getAll()[s];
            stats.wins = stats.wins || 0;
            stats.losses = stats.losses || 0;
            stats.crawled = stats.crawled || 0;
            stats.letCrawl = stats.letCrawl || 0;
            stats.games = stats.wins + stats.losses;
            stats.winRatio = (stats.wins / stats.games) * 100 || 0;
            stats.crawlRatio = (stats.crawled / stats.games) * 100 || 0;
            stats.letCrawlRatio = (stats.letCrawl / stats.games) * 100 || 0;
            stats.user = users.get({id: s});
            userstats.push(stats);
          });
          return userstats;
        }
      };
    }]);

}());

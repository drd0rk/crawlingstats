(function () {
  "use strict";

  /*global moment*/

  angular.module("crawlingservices", []).

    factory("moment", function () {
      return moment;
    }).

    factory("matches", ["cachedResource", "users", function (cachedResource, users) {
      var res = cachedResource({path: "/matches"});
      res.getByTimeSpan = function (begin, end, callback) {
        var matches = [];
        this.query(function (all) {
          angular.copy(all.filter(function (m) {
            return m.date > begin && m.date < end;
          }), matches);
          matches.$resolved = true;
        });
        return matches;
      }
      return res;
    }]).

    factory("users", ["cachedResource", function (cachedResource) {
      return cachedResource({path: "/users/:_id"});
    }])

    .factory('matchutils', [function () {
      return {
        getWinningTeam: function (match) {
          if (match.result.team1 > match.result.team2) {
            return match.team1;
          }
          return match.team2;
        },

        getWinningTeamGoals: function (match) {
          if (match.result.team1 > match.result.team2) {
            return match.result.team1;
          }
          return match.result.team2;
        },

        getLosingTeam: function (match) {
          if (match.result.team2 > match.result.team1) {
            return match.team1;
          }
          return match.team2;
        },

        getLosingTeamGoals: function (match) {
          if (match.result.team2 > match.result.team1) {
            return match.result.team1;
          }
          return match.result.team2;
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
          set: function (key, statname, value) {
            if (!stats[key]) {
              stats[key] = {};
            }
            stats[key][statname] = value;
          },

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

    .factory('overallstats', ['RawStats', 'matchutils', 'users', 'matches', function (RawStats, mu, users, matches) {
      return {
        calc: function (matches) {
          var stats = {};
          matches.forEach(function (m) {
            if (mu.isToZero(m)) {
              stats.lastCrawlers = mu.getLosingTeam(m);
              stats.lastLetCrawlers = mu.getWinningTeam(m);
            }
          });
          return stats;
        }
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
            stats.user = s;
            if (stats.games >= 5) {
              userstats.push(stats);
            }
          });
          return userstats;
        }
      };
    }])

    .factory('teamstats', ['RawStats', 'matchutils', 'users', function (RawStats, mu, users) {
      return {
        calc: function (matches) {
          var rawStats = new RawStats(), teamstats = [];
          matches.forEach(function (m) {
            var wTeam = mu.getWinningTeam(m).defensive + '-' + mu.getWinningTeam(m).offensive;
            var lTeam = mu.getLosingTeam(m).defensive + '-' + mu.getLosingTeam(m).offensive;
            rawStats.set(wTeam, 'team', mu.getWinningTeam(m));
            rawStats.set(lTeam, 'team', mu.getLosingTeam(m));
            // wins
            rawStats.addOne(wTeam, 'wins');
            // losses
            rawStats.addOne(lTeam, 'losses');
            // goals
            rawStats.add(wTeam, 'goals', mu.getWinningTeamGoals(m));
            rawStats.add(lTeam, 'goals', mu.getLosingTeamGoals(m));
            // crawls
            if (mu.isToZero(m)) {
              rawStats.addOne(wTeam, 'letCrawl');
              rawStats.addOne(lTeam, 'crawled');
            }
          });
          Object.getOwnPropertyNames(rawStats.getAll()).forEach(function (s) {
            var stats = rawStats.getAll()[s];
            stats.wins = stats.wins || 0;
            stats.losses = stats.losses || 0;
            stats.goals = stats.goals || 0;
            stats.crawled = stats.crawled || 0;
            stats.letCrawl = stats.letCrawl || 0;
            stats.games = stats.wins + stats.losses;
            stats.winRatio = (stats.wins / stats.games) * 100 || 0;
            stats.crawlRatio = (stats.crawled / stats.games) * 100 || 0;
            stats.letCrawlRatio = (stats.letCrawl / stats.games) * 100 || 0;
            stats.goalsPerGame = (stats.goals / stats.games) || 0;
            if (stats.games >= 5) {
              teamstats.push(stats);
            }
          });
          return teamstats;
        }
      };
    }]);

}());

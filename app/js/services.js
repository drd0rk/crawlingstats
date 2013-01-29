(function () {
  "use strict";

  /*global moment*/

  angular.module("crawlingservices", []).
    factory("moment", function () {
      return moment;
    }).
    factory("matches", ["cachedResource", "users", function (cachedResource, users) {
      return cachedResource("/matches", {
        afterRead: function (match) {
          if (typeof match.team1.defensive === "string") {
            match.team1.defensive = users.get({id: match.team1.defensive});
          }
          if (typeof match.team1.offensive === "string") {
            match.team1.offensive = users.get({id: match.team1.offensive});
          }
          if (typeof match.team2.defensive === "string") {
            match.team2.defensive = users.get({id: match.team2.defensive});
          }
          if (typeof match.team2.offensive === "string") {
            match.team2.offensive = users.get({id: match.team2.offensive});
          }
          return match;
        },
        beforeWrite: function (match) {
          if (typeof match.team1.defensive === "object") {
            match.team1.defensive = match.team1.defensive._id;
          }
          if (typeof match.team1.offensive === "object") {
            match.team1.offensive = match.team1.offensive._id;
          }
          if (typeof match.team2.defensive === "object") {
            match.team2.defensive = match.team2.defensive._id;
          }
          if (typeof match.team2.offensive === "object") {
            match.team2.offensive = match.team2.offensive._id;
          }
          return match;
        }
      });
    }]).
    factory("users", ["cachedResource", function (cachedResource) {
      return cachedResource("/users/:id");
    }]);

}());

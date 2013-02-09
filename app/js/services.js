(function () {
  "use strict";

  /*global moment*/

  angular.module("crawlingservices", []).
    factory("moment", function () {
      return moment;
    }).
    factory("matches", ["cachedResource", "users", function (cachedResource, users) {
      return cachedResource({
        path: "/matches"
      });
    }]).
    factory("users", ["cachedResource", function (cachedResource) {
      return cachedResource({path: "/users/:id"});
    }]);

}());

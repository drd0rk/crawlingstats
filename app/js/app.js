(function () {
  "use strict";

  angular.module("crawlingstats", ["cachedResource", "crawlingcontrollers", "crawlingservices", "crawlingdirectives", "crawlingfilters"]).
    config(["$routeProvider", function ($routeProvider) {
      $routeProvider.when("/stats", {templateUrl: "partials/stats.html", controller: "stats"});
      $routeProvider.when("/addmatch", {templateUrl: "partials/addmatch.html", controller: "addmatch"});
      $routeProvider.when("/adduser", {templateUrl: "partials/adduser.html", controller: "adduser"});
      $routeProvider.otherwise({redirectTo: "/stats"});
    }]);

}());

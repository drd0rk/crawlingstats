(function () {
  "use strict";

  angular.module("crawlingdirectives", []).
    directive("datetime", ["moment", function (moment) {
      var format = "DD.MM.YYYY HH:mm";
      return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, el, attrs, ctrl) {
          ctrl.$formatters.unshift(function (timestamp) {
            return moment(timestamp).format(format);
          });
          ctrl.$parsers.unshift(function (formatted) {
            return moment(formatted, format).valueOf();
          });
        }
      };
    }]);

}());

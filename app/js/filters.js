(function () {
  "use strict";

  angular.module("crawlingfilters", []).
    filter("datetime", ["moment", function (moment) {
      return function (timestamp) {
        return moment(timestamp).format("DD.MM.YYYY HH:mm");
      };
    }]);

}());

(function () {
  "use strict";

  angular.module("crawlingfilters", [])

    .filter("datetime", ["moment", function (moment) {
      return function (timestamp) {
        return moment(timestamp).format("DD.MM.YYYY HH:mm");
      };
    }])

    .filter('team', ['users', function (users) {
      return function (team) {
        if (team) {
          return users.get({_id: team.defensive}).name + ', ' + users.get({_id: team.offensive}).name;
        }
        return '';
      };
    }])

    .filter('player', ['users', function (users) {
      return function (id) {
        return users.get({_id: id}).name;
      };
    }]);

}());

(function () {
  "use strict";

  angular.module("cachedResource", ["ngResource"]).
    factory("cachedResource", ["$resource", function ($resource) {
      return function (options) {
        var res = $resource(options.path, {});
        var items;
        var idAttribute = options.idAttribute || '_id';

        return {
          query: function (callback) {
            if (!items) {
              return this.refresh(callback)
            }
            return items;
          },

          get: function (opts, callback) {
            var cached = items.filter(function (i) {
              return i[idAttribute] === opts[idAttribute];
            })[0];
            if (cached) {
              (callback || angular.noop)(cached);
            }
            return cached || res.get(opts, callback);
          },

          save: function (item, callback) {
            res.save(item, function (createdItem) {
              items.push(createdItem);
              (callback || angular.noop)(createdItem);
            });
          },

          refresh: function (callback) {
            items = res.query(callback);
            return items;
          }
        };
      };
    }]);

}());

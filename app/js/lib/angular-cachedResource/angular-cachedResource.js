(function () {
  "use strict";

  angular.module("cachedResource", ["ngResource"]).
    factory("cachedResource", ["$resource", function ($resource) {
      return function (options) {
        if (!options.hooks) {
          options.hooks = {};
        }

        var res = $resource(options.path, {});
        var items = res.query(function (newItems) {
            if (options.hooks.afterRead) {
              items = newItems.map(function (item) {
                return options.hooks.afterRead(item);
              });
            }
          });

        return {
          query: function () {
            return items;
          },

          get: function (opts, callback) {
            return res.get(opts, callback);
          },

          save: function (item, callback) {
            if (options.hooks.beforeWrite) {
              item = options.hooks.beforeWrite(item);
            }
            res.save(item, function (createdItem) {
              if (options.hooks.afterRead) {
                createdItem = options.hooks.afterRead(createdItem);
              }
              items.push(createdItem);
              if (callback) {
                callback(createdItem);
              }
            });
          },

          refresh: function (callback) {
            items = res.query(callback);
          }
        };
      };
    }]);

}());

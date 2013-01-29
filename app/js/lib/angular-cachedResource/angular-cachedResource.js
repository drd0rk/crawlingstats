(function () {
  "use strict";

  angular.module("cachedResource", ["ngResource"]).
    factory("cachedResource", ["$resource", function ($resource) {
      return function (path, hooks) {
        if (!hooks) {
          hooks = {};
        }
        var res = $resource(path, {}),
          items = res.query(function (newItems) {
            if (hooks.afterRead) {
              items = newItems.map(function (item) {
                return hooks.afterRead(item);
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
            if (hooks.beforeWrite) {
              item = hooks.beforeWrite(item);
            }
            res.save(item, function (createdItem) {
              if (hooks.afterRead) {
                createdItem = hooks.afterRead(createdItem);
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

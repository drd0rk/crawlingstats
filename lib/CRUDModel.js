(function () {
  "use strict";

  var Logger = require('basic-logger'),
    log = new Logger({prefix: "lib/CRUDModel"}),
    async = require('async');

  module.exports = function (db) {
    return function (collectionName) {
      var getCollection;

      getCollection = function (callback) {
        db.collection(collectionName, callback);
      };

      return {
        getCollection: getCollection,

        retrieve: function (id, callback) {
          if (typeof id === "string") {
            id = db.bsonLib.ObjectID(id);
          }
          async.waterfall([
            getCollection,
            function (coll, callback) {
              coll.findOne({_id: id}, callback);
            }
          ], callback);
        },

        list: function (config, callback) {
          if (typeof config === "function") {
            callback = config;
            config = {};
          }
          async.waterfall([
            getCollection,
            function (coll, callback) {
              coll.find(config.options || {}).
                sort(config.orderBy || {}).
                skip(config.offset || 0).
                limit(config.limit || 0).
                toArray(callback);
            }
          ], callback);
        },

        create: function (data, callback) {
          async.waterfall([
            getCollection,
            function (coll, callback) {
              coll.insert(data, callback);
            },
            function (inserted, callback) {
              callback(null, inserted[0]);
            }
          ], callback);
        }

      };
    };
  }

}());

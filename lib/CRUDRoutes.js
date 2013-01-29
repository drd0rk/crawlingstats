(function () {
  "use strict";

  var Logger = require('basic-logger'),
    log = new Logger({prefix: "lib/CRUDRoutes"});

  module.exports = function (model) {
    return {
      retrieve: function (req, res) {
        model.retrieve(req.params.id, function (err, instance) {
          if (err) {
            log.error(err);
            res.send(500);
          } else {
            if (instance === null) {
              res.send(404);
            } else {
              res.send(instance);
            }
          }
        });
      },

      create: function (req, res) {
        model.create(req.body, function (err, created) {
          if (err) {
            log.error(err);
            res.send(500);
          } else {
            res.send(201, created);
          }
        });
      },

      list: function (req, res) {
        model.list(function (err, items) {
          if (err) {
            log.error(err);
            res.send(500);
          } else {
            res.send(items);
          }
        });
      }
    };
  };

}());

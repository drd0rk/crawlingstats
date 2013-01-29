(function () {
  "use strict";

  var Logger = require('basic-logger'),
    log = new Logger({prefix: "routes/matches"}),
    extend = require('xtend');

  module.exports = function (db) {
    var matchModel = require('../models/match')(db),
      CRUDRoutes = require('../lib/CRUDRoutes');

    return extend(new CRUDRoutes(matchModel), {
      list: function (req, res) {
        matchModel.list({
          orderBy: {
            date: -1
          }
        }, function (err, matches) {
          if (err) {
            log.error(err);
            res.send(500);
          } else {
            res.send(matches);
          }
        });
      }
    });
  };

}());

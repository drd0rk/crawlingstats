(function () {
  "use strict";

  var Logger = require('basic-logger'),
    log = new Logger({prefix: "routes/users"}),
    extend = require('xtend');

  module.exports = function (db) {
    var userModel = require('../models/user')(db),
      CRUDRoutes = require('../lib/CRUDRoutes');

    return extend(new CRUDRoutes(userModel), {
    });
  };

}());

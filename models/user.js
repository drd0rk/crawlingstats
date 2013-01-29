(function () {
  "use strict";

  var Logger = require('basic-logger'),
    log = new Logger({prefix: "models/user"}),
    extend = require('xtend');

  module.exports = function (db) {
    var CRUDModel, getCollection;

    CRUDModel = require('../lib/CRUDModel')(db);

    return extend(new CRUDModel("users"), {
    });
  };
  
}());

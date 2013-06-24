(function () {
  "use strict";

  var Logger = require('basic-logger'),
    log = new Logger({prefix: "server.js"}),
    express = require('express'),
    app = express(),
    mongodb = require('mongodb');

  app.configure(function () {
    app.set("port", process.env.PORT || 3000);
    app.use(express.compress());
    app.use(express.static(__dirname + "/app"));
    app.use(express.bodyParser());
  });

  app.configure("development", function () {
    Logger.setLevel("trace");
    app.set("mongodburl", "mongodb://localhost:27017/crawlingstats");
  });

  app.configure("production", function () {
    Logger.setLevel("info");
    app.set("mongodburl", process.env.MONGOLAB_URI);
  });

  mongodb.Db.connect(app.get("mongodburl"), {server: {poolSize: 150, auto_reconnect: true}, db: {safe_mode: true}}, function (err, db) {
    if (err) {
      return log.error(err);
    }
    log.trace("DB connection established");

    var users = require('./routes/users')(db),
      matches = require('./routes/matches')(db);

    // user routes
    app.get("/users", users.list);
    app.get("/users/:id", users.retrieve);
    app.post("/users", users.create);

    // match routes
    app.get("/matches", matches.list);
    app.get("/matches/:matchid", matches.retrieve);
    app.post("/matches", matches.create);

    app.listen(app.get("port"), function () {
      log.trace("App running, listening to port %d", app.get("port"));
    });
  });

}());

const Log = require("../models/log.model");

exports.createLog = (req, res) => {
    const log = new Log({
      username: req.body.username,
      airport: req.body.airport,
      log: req.body.log,
      language: req.body.language,
      date: new Date()
    });
  
    log.save((err, log) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
        res.send({ message: "Log entry was added successfully!" });
    });
  };

  // Retrieve log entries by username or return all logs if the user is admin
exports.getLogs = (req, res) => {
    const { username, userRole } = req.body;
    if (userRole.includes('ROLE_ADMIN')) {
      Log.find({}, (err, logs) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.json(logs);
      });
    } else {
      Log.find({ username: username }, (err, logs) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.json(logs);
      });
    }
  };
  
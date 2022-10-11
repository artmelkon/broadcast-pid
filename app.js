const os = require("os");
const fs = require("fs");
const winston = require("winston");
require("winston-mongodb");
const morgan = require("morgan");
const express = require("express");
require('express-async-errors');
require("dotenv").config();

// listener related exports
const { dbUri, rootObj } = require("./initialData");
const launchListener = require('./services/directory-listener');
const logger = require("./utils/logger");

const app = express();

process.env.CPU = os.hostname().split(".")[0];
const uri = dbUri();

/* use default code than custom handlers it doesn't create duplicate lines in the log*/
// logger.info(uri)

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
  logger.info(process.env.NODE_ENV);
  app.use(morgan("tiny"));
} else {
  winston.add(
    new winston.transports.MongoDB({
      db: uri,
      collection: `errorlog_${process.env.CPU}`,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      tryReconnect: true,
    })
  );
}

app.use(express.json());
require("./utils/routes")(app);
require("./utils/db-connect")(uri);

setTimeout(() => {
  logger.info("the listener booted");
  launchListener(rootObj());
}, 2000);

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => logger.info(`Connected successfully on port: ${PORT}`));

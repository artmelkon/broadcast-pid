const os = require("os");
const fs = require("fs");
const winston = require("winston");
require("winston-mongodb");
const { format, transports } = require("winston");
const { combine, timestamp, printf } = format;
// const si = require('systeminformation'); // check the docs for systeminformation
const morgan = require("morgan");
const express = require("express");
require('express-async-errors');
require("dotenv").config();

// listener related exports
const { dbUri, rootObj } = require("./initialData");
const launchListener = require('./services/directory-listener')

const app = express();

process.env.CPU = os.hostname().split(".")[0];
const uri = dbUri();
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

/* use default code than custom handlers it doesn't create duplicate lines in the log*/
// console.log(uri)
console.log(uri);
winston.add(
  new winston.transports.File({
    filename: "error.log",
    handleExceptions: true,
    format: combine(timestamp(), customFormat),
  })
);

winston.add(
  new winston.transports.File({
    filename: "error.log",
    handleRejections: true,
    format: combine(timestamp(), customFormat),
  })
);

// if (process.env.NODE_ENV !== "development") {
//   winston.add(
//     new winston.transports.MongoDB({
//       db: uri,
//       options: {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//     })
//   );
// }

if (process.env.NODE_ENV === "development") {
  winston.add(
    new winston.transports.Console({
      format: format.simple(),
    })
  );
  console.log(process.env.NODE_ENV);
  app.use(morgan("tiny"));
}

app.use(express.json());
require("./utils/routes")(app);
require("./utils/db-connect")(uri);

setTimeout(() => {
  console.log("the listener booted");
  launchListener(rootObj());
}, 2000);

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Connected successfully on port: ${PORT}`));

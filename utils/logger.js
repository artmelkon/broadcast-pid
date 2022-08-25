const { createLogger, format, transports } = require("winston");
const { combine, printf, timestamp, prettyPrint } = format;

const dbUri = require('../db-init');
const uri = dbUri();

const customFormat = printf(({ level, timestamp, message }) => {
  return `${timestamp} ${level} => ${message}`;
});

const errorLogger = createLogger({
  level: "error",
  format: combine(timestamp(), prettyPrint(), customFormat),
  transports: [
    new transports.File({ filename: "error.log" }),
    new transports.MongoDB({
      db: uri,
      collection: `errorlog_${process.env.CPU}`,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      tryReconnect: true
    })
  ],
  // exceptionHandlers: [ new transports.File({ filename: "error.log", }) ],
  // rejectionHandlers: [ new transports.File({ filename: "error.log", }) ],
});

module.exports = { errorLogger };

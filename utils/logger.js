const { createLogger, format, transports } = require("winston");
const { combine, printf, timestamp, prettyPrint } = format;

const customFormat = printf(({ level, timestamp, message }) => {
  return `${timestamp} ${level} => ${message}`;
});

const errorLogger = createLogger({
  level: "error",
  format: combine(timestamp(), prettyPrint(), customFormat),
  transports: [new transports.File({ filename: "error.log" })],
  // exceptionHandlers: [ new transports.File({ filename: "error.log", }) ],
  // rejectionHandlers: [ new transports.File({ filename: "error.log", }) ],
});

module.exports = { errorLogger };

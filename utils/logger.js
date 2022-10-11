const os = require("os");
const { createLogger, format, transports } = require("winston");
const winston = require("winston/lib/winston/config");
const { combine, printf, timestamp, prettyPrint, label } = format;

const { dbUri } = require("../initialData");
const uri = dbUri();

const customFormat = printf(({ level, label, message, timestamp }) => {
  return `Level: ${level}, [${label}], message: ${message}, timestamp: ${timestamp}`;
});

module.exports = createLogger({
  level: "info",
  format: combine(
    label({ label: process.env.CPU }),
    timestamp({format: "YYYY-MM-DD hh:mm:ss.SSS A"}),
    prettyPrint(),
    customFormat
  ),
  transports: [new transports.File({ filename: "error.log", level: "error" })],
  exceptionHandlers: [
    new transports.File({ filename: "error.log", level: "error" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "error.log", level: "error" }),
  ],
});

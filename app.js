const os = require('os')
const winston = require('winston');
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const morgan = require('morgan');
const chokidar = require('chokidar');
const express = require('express');
require('dotenv').config()

const app = express();
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

/* use default code than custom handlers it doesn't create duplicate lines in the log*/

winston.add(new winston.transports.File({
  filename: 'error.log',
  handleExceptions: true,
  format: combine(
    timestamp(),
    customFormat
  )
}))

winston.add(new winston.transports.File({
  filename: 'error.log',
  handleRejections: true,
  format: combine(
    timestamp(),
    customFormat
  )
}))

if(process.env.NODE_ENV === 'development') {
  winston.add(new winston.transports.Console({
    format: format.simple()
  }))
  console.log(process.env.NODE_ENV)
  app.use(morgan('tiny'))
}

// throw new Error('Testing pretty print!')
app.use(express.json())
require('./utils/routes')(app)

chokidar.watch('/Volumes/sambashare/').on('all', (event, path) => {
  console.log(event, path)
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Connected successfully on port: ${PORT}`))
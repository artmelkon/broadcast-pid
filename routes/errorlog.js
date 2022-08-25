const {readFile, access, constants} = require('fs');
const os = require('os')
const path = require('path');
const express = require('express');
const logger = require('../utils/logger');
const router = express.Router();

router.get('/', (req, res, next) => {
  console.log(process.env.CPU)
  const errorLog = path.join(__dirname, '../error.log');
  access(errorLog, constants.F_OK, err => {
    if(err) {
      console.error(`${errorLog} does not exists!`);
      logger.errorLogger.error(err.message, err)
      res.status(404).send(`${errorLog} does not exists!`);
    }
    readFile(errorLog, 'utf8', (err, log) => {
      if(err) {
        logger.errorLogger.error(err.massage, err);
        return;
      }
      res.status(200).send(log)
    })
  })
})

module.exports = router;
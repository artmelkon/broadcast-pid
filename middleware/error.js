const logger = require('../utils/logger');

module.exports = function(err, req, res, next) {
  // let errStatus = res.status(err.status || 500)
  // // Log the errors
  // console.log(errStatus)
  loger.error(err.message)
  res.status(404).send('Unable to locate PID for given App!')
}
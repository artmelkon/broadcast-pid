const processIdRoutes = require('../routes/processId');
const errorLogRoutes = require('../routes/errorlog');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use('/api/processId/:app', processIdRoutes);
  app.use('/api/errorlog', errorLogRoutes)
  app.use(error)
}


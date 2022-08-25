const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = function (uri) {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`MongoDB connected to successfully!`))
    .catch(err => logger.errorLogger.error(err.message, err));
};

const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = function (uri) {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => logger.info(`MongoDB connected to successfully!`))
};

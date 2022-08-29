const mongoose = require("mongoose");

module.exports = function (uri) {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`MongoDB connected to successfully!`))
};

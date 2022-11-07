const mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0:27017/auth")
  .then(() => console.log("DB connected..."))
  .catch((err) => console.error(err.message));

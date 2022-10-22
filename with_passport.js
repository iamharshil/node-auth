const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// passport config
require("./passports/config/passport")(passport);

// DB config
const db = require("./passports/config/keys").MongoURI;

// config
const PORT = process.env.PORT || 3000;

// connect to db
mongoose
  .connect(db, { useNewUrlParser: "true", useUnifiedTopology: "true" })
  .then(() => console.log("MongoDB Connected.!!"))
  .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./passports/views"));

// bodyParser is now part of express
app.use(express.urlencoded({ extended: false }));

// Express session
// cSpell:words resave
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./passports/routes/index"));
app.use("/users", require("./passports/routes/users"));

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

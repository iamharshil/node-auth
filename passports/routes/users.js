const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// user model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  // cSpell:words erorrs
  let errors = [];

  // check required fields.
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all the fields." });
  }

  // Check password matches
  if (password !== password2) {
    errors.push({ msg: "Passwords did not matched." });
  }

  // check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be least 6 characters." });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // validation passed
    User.findOne({ email }).then((user) => {
      if (user) {
        // User exists
        errors.push({ msg: "Email already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to hash
            newUser.password = hash;
            // save user
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", "You are now registered.!!");
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

// Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// logout handle
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out.");
    res.redirect("/users/login");
  });
});

module.exports = router;

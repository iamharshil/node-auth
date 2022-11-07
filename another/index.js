const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const DB = require("./config/Database");
const User = require("./models/User.model");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

function generateJWT(user) {
  const key = process.env.JWT_SECRET;
  let token = jwt.sign(user.toJSON(), key, { expiresIn: "30 seconds" });
  return token;
}

app.get("/api/signup", async (req, res) => {
  const user = await User.create(req.body, (err, user) => {
    if (err) {
      res.json(err.message);
    } else {
      res.json(user);
    }
  });
});

app.get("/api/login", async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.json(err.message);
    } else {
      if (user.password == password) {
        const token = generateJWT(user);
        const options = {
          httpOnly: true,
          Expires: new Date(Date.now() + process.env.EXP_TOKEN),
        };
        res
          .status(200)
          .cookie("token", token, options)
          .json({ message: "login successful", token });
      } else {
        res.json({ message: "credentials does not match" });
      }
    }
  });
});

app.get("/", async (req, res) => {
  const token = req.cookies.token;
  const verify = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(verify);
  if (verify) {
    res.json("You have access to this page");
  } else {
    res.status(404).json("You don't have access to this page");
  }
});

app.get("/delete", async (req, res) => {
  // res.clearCookie("token"); or
  res.cookie("token", { expiresIn: Date.now() });
  // res.end(); //if there is no other response with it.
  res.json(req.cookies.token);
});

app.listen(PORT, console.log("Running..."));

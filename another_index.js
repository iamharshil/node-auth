const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(cookieParser());

const generateToken = async (user, statusCode, res) => {
  const token = await user.jwtGenerateToken();
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.EXPIRE_TOKEN), // 1 * 60 * 60 * 1000
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

function userRoutes(req, res, next) {
  // when user is log in.
  generateToken(user, 200, res);
}

app.use("/api".userRoutes);

app.listen(4000, "running...");

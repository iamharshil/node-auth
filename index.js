const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
require("dotenv").config();

// METHOD 1:
// code for creating jwt auth

const createToken = async () => {
  const token = await jwt.sign({ _id: "123" }, process.env.JWT_KEY, {
    expiresIn: "2 seconds",
  });
  console.log(token);
  const verify = await jwt.verify(token, process.env.JWT_KEY);
  console.log(verify);
};
createToken();
// END

// Method 3:
// Using https://github.com/auth0/express-openid-connect
// and   https://auth0.com/docs/quickstart/webapp/express

// LINK: https://www.youtube.com/watch?v=QQwo4E_B0y8

// END

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

// to save token
// document.cookie = `token=${token}`

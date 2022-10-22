const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());


app.get("/api", (req,res) => {
  res.json({
    message: "Welcome to API"
  });
});

app.post("/api/posts",verifyToken, (req, res) => {
  jwt.verify(req.token, 'thisismysecretkeyhaha', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
        res.json({
          message: "Post created...",
          authData
        });
      }
  });
});

app.post("/api/login", (req,res) => {
  // Mock User;
  const user = {
    id: 1,
    username: "brad",
    email: 'brad@gmail.com',
  };
  jwt.sign({user}, 'thisismysecretkeyhaha', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token
    });
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers['authorization'];

  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space to get first index
    const bearer = bearerHeader.split(' ');

    // get token from array
    const bearerToken = bearer[1];

    // set the token
    req.token = bearerToken;

    // next middleware
    next();

  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.listen(3000, () => console.log(`Server is listening to http://localhost:3000`));
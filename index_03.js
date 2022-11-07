const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { name: "harsh" });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res, next) => {});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", (req, res, next) => {});

app.listen(3000);

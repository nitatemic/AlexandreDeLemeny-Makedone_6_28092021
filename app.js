const express = require("express");

const app = express();

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.post("/post", function (req, res) {
  res.send("Got a POST request");
});

module.exports = app;

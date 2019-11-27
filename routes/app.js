// Requires
var express = require("express");

// inicializa
var app = express();

app.get("/", (request, response, next) => {
  response.status(200).json({
    head: "success",
    body: "Todo verde :)"
  });
});

module.exports = app;

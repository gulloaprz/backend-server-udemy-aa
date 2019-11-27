// Requires
var express = require("express");
var mongoose = require("mongoose");

// inicializa
var app = express();

// conexión bd
mongoose.connect("mongodb://localhost:27017/hospitaldb", (error, response) => {
  if (error) throw error;

  console.log("Base de datos en el puerto 27017: \x1b[32m%s\x1b[0m", "online");
});

// Rutas
app.get("/", (request, response, next) => {
  response.status(200).json({
    head: "success",
    body: "Todo verde :)"
  });
});

// excuchar puerto
app.listen(3000, () => {
  console.log(
    "Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m",
    "online"
  );
});

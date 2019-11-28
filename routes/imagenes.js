// Requires
var express = require("express");
const path = require("path");
const fs = require("fs");

// inicializa
var app = express();

app.get("/:tipo/:imagen", (request, response, next) => {
  const tipo = request.params.tipo;
  const imagen = request.params.imagen;

  const pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${imagen}`);
  const pathNoImagen = path.resolve(__dirname, `../assets/no-img.jpg`);

  if (fs.existsSync(pathImagen)) {
    response.sendFile(pathImagen);
  } else {
    response.sendFile(pathNoImagen);
  }
});

module.exports = app;

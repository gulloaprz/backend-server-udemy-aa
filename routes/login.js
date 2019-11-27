// Requires
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const seed = require("../config/config").SEED;

// inicializa
var app = express();

// importa modelo
var Usuario = require("../models/usuario");

app.post("/", (request, response) => {
  const body = request.body;

  Usuario.findOne({ email: body.email }, (errors, usuarioDB) => {
    if (errors) {
      return response.status(500).json({
        head: "error",
        body: { message: "Error al loggear", errors }
      });
    }

    if (!usuarioDB) {
      return response.status(400).json({
        head: "error",
        body: { message: "Credenciales incorrectas - email", errors }
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return response.status(400).json({
        head: "error",
        body: { message: "Credenciales incorrectas - password", errors }
      });
    }

    //  Crear token
    usuarioDB.password = ":)";
    const token = jwt.sign({ usuario: usuarioDB }, seed, {
      expiresIn: 14400
    }); // 4hrs
    response.status(200).json({
      head: "success",
      body: { token, usuario: usuarioDB }
    });
  });
});

module.exports = app;

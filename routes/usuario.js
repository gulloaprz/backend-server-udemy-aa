// Requires
var express = require("express");
var bcrypt = require("bcryptjs");
var mdAutenticacion = require("../middlewares/autenticacion");

// inicializa
var app = express();

// importa modelo
var Usuario = require("../models/usuario");

// =======================================
// Obtener todos los usuarios
// =======================================
app.get("/", (request, response) => {
  const desde = Number(request.query.desde) || 0;

  Usuario.find({}, "nombre email img role")
    .skip(desde)
    .limit(5)
    .exec((errors, usuarios) => {
      if (errors) {
        response.status(500).json({
          head: "error",
          body: { message: "error cargando usuarios", errors }
        });
      }

      Usuario.count((errorscount, count) => {
        if (errorscount) {
          response.status(500).json({
            head: "error",
            body: { message: "error al contar usuarios", errors: errorscount }
          });
        }

        response.status(200).json({
          head: "success",
          body: { total: count, usuarios }
        });
      });
    });
});

// =======================================
// Crear nuevo usuario
// =======================================
app.post("/", mdAutenticacion.verificaToken, (request, response) => {
  const body = request.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((errors, usuarioDB) => {
    if (errors) {
      response.status(400).json({
        head: "error",
        body: { message: "error al crear usuario", errors }
      });
    }

    response.status(201).json({
      head: "success",
      body: usuarioDB
    });
  });
});

// =======================================
// Actualizar usuario
// =======================================
app.put("/:id", mdAutenticacion.verificaToken, (request, response) => {
  const id = request.params.id;
  const body = request.body;

  Usuario.findById(id, (errors, usuario) => {
    if (errors) {
      return response.status(500).json({
        head: "error",
        body: { message: "error al buscar usuario", errors }
      });
    }

    if (!usuario) {
      return response.status(400).json({
        head: "error",
        body: { message: `El usuario con el id ${id} no existe`, errors }
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((errorsave, usuarioDB) => {
      if (errorsave) {
        return response.status(500).json({
          head: "error",
          body: { message: "Error al actualizar usuario", errors: errorsave }
        });
      }

      usuarioDB.password = ":)";

      response.status(200).json({
        head: "success",
        body: usuarioDB
      });
    });
  });
});

// =======================================
// Borrar un usuario
// =======================================
app.delete("/:id", mdAutenticacion.verificaToken, (request, response) => {
  const id = request.params.id;

  Usuario.findByIdAndRemove(id, (errors, usuarioDB) => {
    if (errors) {
      response.status(500).json({
        head: "error",
        body: { message: "Error al borrar usuario", errors }
      });
    }

    if (!usuarioDB) {
      response.status(400).json({
        head: "error",
        body: { message: `El usuario con el id ${id} no existe`, errors }
      });
    }

    response.status(200).json({
      head: "suscess",
      body: usuarioDB
    });
  });
});

module.exports = app;

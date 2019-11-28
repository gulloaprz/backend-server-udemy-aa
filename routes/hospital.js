// Requires
const express = require("express");
const mdAutenticacion = require("../middlewares/autenticacion");

// incializa
const app = express();

// importa modelo
const Hospital = require("../models/hospital");

// =======================================
// Obtener todos los hospitales
// =======================================
app.get("/", (request, response) => {
  const desde = Number(request.query.desde) || 0;

  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((errors, hospitales) => {
      if (errors) {
        return response.status(500).json({
          head: "error",
          body: { message: "Error al cargar hospitales", errors }
        });
      }

      Hospital.count((errorscount, count) => {
        if (errorscount) {
          response.status(500).json({
            head: "error",
            body: { message: "error al contar hospitales", errors: errorscount }
          });
        }

        response.status(200).json({
          head: "success",
          body: { total: count, hospitales }
        });
      });
    });
});

// =======================================
// Crear nuevo hospital
// =======================================
app.post("/", mdAutenticacion.verificaToken, (request, response) => {
  const body = request.body;

  const hospital = new Hospital({
    nombre: body.nombre,
    usuario: request.usuarioInToken._id
  });

  hospital.save((errors, hospitalDB) => {
    if (errors) {
      return response.status(400).json({
        head: "error",
        body: { message: "error al crear hospital", errors }
      });
    }
    response.status(201).json({ head: "success", body: hospitalDB });
  });
});

// =======================================
// Actualizar hospital
// =======================================
app.put("/:id", mdAutenticacion.verificaToken, (request, response) => {
  const id = request.params.id;
  const body = request.body;

  Hospital.findById(id, (errors, hospital) => {
    if (errors) {
      return response.status(500).json({
        head: "error",
        body: { message: "Error al buscar hospital", errors }
      });
    }

    if (!hospital) {
      return response.status(400).json({
        head: "error",
        body: { message: `El hospital con el id ${id} no existe`, errors }
      });
    }

    hospital.nombre = body.nombre;
    hospital.usuario = request.usuarioInToken._id;

    hospital.save((errorssave, hospitalDB) => {
      if (errorssave) {
        return response.status(500).json({
          head: "error",
          body: { message: "error al actualizar hospital", errors: errorssave }
        });
      }

      response.status(200).json({
        head: "success",
        body: hospitalDB
      });
    });
  });
});

// =======================================
// Borrar un hospital
// =======================================
app.delete("/:id", mdAutenticacion.verificaToken, (request, response) => {
  const id = request.params.id;

  Hospital.findByIdAndRemove(id, (errors, hospitalDB) => {
    if (errors) {
      return response.status(500).json({
        head: "error",
        body: { message: "Error al borrar hospital", errors }
      });
    }

    if (!hospitalDB) {
      response.status(400).json({
        head: "error",
        body: { message: `El hospital con el id ${id} no existe`, errors }
      });
    }

    response.status(200).json({
      head: "success",
      body: hospitalDB
    });
  });
});
module.exports = app;

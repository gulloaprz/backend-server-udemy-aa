// Requires
const expres = require("express");
const mdAutenticacion = require("../middlewares/autenticacion");

// inicaliza
const app = expres();

// importa modelo
const Medico = require("../models/medico");

// =======================================
// Obtener todos los medicos
// =======================================
app.get("/", (request, response) => {
  const desde = Number(request.query.desde) || 0;

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("hospital")
    .exec((errors, medicos) => {
      if (errors) {
        return response.status(500).json({
          head: "error",
          body: { message: "Error al cargar medicos", errors }
        });
      }

      Medico.count((errorscount, count) => {
        if (errorscount) {
          response.status(500).json({
            head: "error",
            body: { message: "error al contar medicos", errors: errorscount }
          });
        }

        response.status(200).json({
          head: "success",
          body: { total: count, medicos }
        });
      });
    });
});

// =======================================
// Crear nuevo médico
// =======================================
app.post("/", mdAutenticacion.verificaToken, (request, response) => {
  const body = request.body;

  const medico = new Medico({
    nombre: body.nombre,
    usuario: request.usuarioInToken._id,
    hospital: body.hospital
  });

  medico.save((errors, medicoDB) => {
    if (errors) {
      return response.status(400).json({
        head: "error",
        body: { message: "error al crear médico", errors }
      });
    }
    response.status(201).json({ head: "success", body: medicoDB });
  });
});

// =======================================
// Actualizar médico
// =======================================
app.put("/:id", mdAutenticacion.verificaToken, (request, response) => {
  const id = request.params.id;
  const body = request.body;

  Medico.findById(id, (errors, medico) => {
    if (errors) {
      return response.status(500).json({
        head: "error",
        body: { message: "Error al buscar medico", errors }
      });
    }

    if (!medico) {
      return response.status(400).json({
        head: "error",
        body: { message: `El médico con el id ${id} no existe`, errors }
      });
    }

    medico.nombre = body.nombre;
    medico.usuario = request.usuarioInToken._id;
    medico.hospital = body.hospital;

    medico.save((errorssave, medicoDB) => {
      if (errorssave) {
        return response.status(500).json({
          head: "error",
          body: { message: "error al actualizar médico", errors: errorssave }
        });
      }

      response.status(200).json({
        head: "success",
        body: medicoDB
      });
    });
  });
});

// =======================================
// Borrar un médico
// =======================================
app.delete("/:id", mdAutenticacion.verificaToken, (request, response) => {
  const id = request.params.id;

  Medico.findByIdAndRemove(id, (errors, medicoDB) => {
    if (errors) {
      return response.status(500).json({
        head: "error",
        body: { message: "Error al borrar médico", errors }
      });
    }

    if (!medicoDB) {
      response.status(400).json({
        head: "error",
        body: { message: `El médico con el id ${id} no existe`, errors }
      });
    }

    response.status(200).json({
      head: "success",
      body: medicoDB
    });
  });
});
module.exports = app;

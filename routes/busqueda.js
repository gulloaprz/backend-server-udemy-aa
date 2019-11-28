// Requires
var express = require("express");

// inicializa
var app = express();

// importa modelos
var Usuario = require("../models/usuario");
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");

// =======================================
// Obtener búsqueda general
// =======================================
app.get("/todo/:busqueda", (request, response) => {
  const busqueda = request.params.busqueda;

  Promise.all([
    buscarHospitales(busqueda),
    buscarMedicos(busqueda),
    buscarUsuarios(busqueda)
  ]).then(respuestas => {
    response.status(200).json({
      head: "success",
      body: {
        hospitales: respuestas[0],
        medicos: respuestas[1],
        usuarios: respuestas[2]
      }
    });
  });
});

// =======================================
// Obtener búsqueda por colección
// =======================================
app.get("/:tabla/:busqueda", (request, response) => {
  const tabla = request.params.tabla;
  const busqueda = request.params.busqueda;

  let promesa;
  switch (tabla) {
    case "hospitales":
      promesa = buscarHospitales(busqueda);
      break;
    case "medicos":
      promesa = buscarMedicos(busqueda);
      break;
    case "usuarios":
      promesa = buscarUsuarios(busqueda);
      break;
    default:
      return response.status(400).json({
        head: "erorr",
        body: "La tabla que intentas buscar no existe"
      });
  }

  promesa.then(data => {
    response.status(200).json({
      head: "success",
      body: { [tabla]: data }
    });
  });
});

function buscarHospitales(busqueda) {
  const regexp = new RegExp(busqueda, "i");
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regexp }, (errors, hospitales) => {
      if (errors) {
        reject("Error al buscar hospitales", errors);
      }

      resolve(hospitales);
    });
  });
}

function buscarMedicos(busqueda) {
  const regexp = new RegExp(busqueda, "i");
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regexp }, (errors, medicos) => {
      if (errors) {
        reject("Error al buscar médicos", errors);
      }

      resolve(medicos);
    });
  });
}

function buscarUsuarios(busqueda) {
  const regexp = new RegExp(busqueda, "i");
  return new Promise((resolve, reject) => {
    Usuario.find({}, "nombre email role")
      .or([{ nombre: regexp }, { email: regexp }])
      .exec((errors, usuarios) => {
        if (errors) {
          reject("Error al buscar usuarios", errors);
        }

        resolve(usuarios);
      });
  });
}

module.exports = app;

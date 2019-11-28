// Requires
var express = require("express");
var fileUpload = require("express-fileupload");
var fs = require("fs");
var mdAutenticacion = require("../middlewares/autenticacion");

// inicializa
var app = express();

// importa modelos
var Usuario = require("../models/usuario");
var Hospital = require("../models/hospital");
var Medico = require("../models/medico");

// =======================================
//
// =======================================
app.use(fileUpload());
app.put("/:tipo/:id", (request, response) => {
  const tipo = request.params.tipo;
  const id = request.params.id;

  // Tipos de  colección
  const tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return response.status(400).json({
      head: "error",
      body: {
        message: "La colección no es válida"
      }
    });
  }

  if (!request.files) {
    return response.status(400).json({
      head: "error",
      body: { message: "No se cargó la imagen" }
    });
  }

  // obtener nombre de la imagen
  const archivo = request.files.imagen;
  const arrayNombre = archivo.name.split(".");
  const extension = arrayNombre[arrayNombre.length - 1];

  // Extensiones válidas
  const extensionesValidas = ["png", "jpg", "gif", "jpeg"];

  if (extensionesValidas.indexOf(extension) < 0) {
    return response.status(400).json({
      head: "error",
      body: {
        message: `Solo se permiten imágenes con la extensiones ${extensionesValidas.join(
          ", "
        )}`
      }
    });
  }

  // Nombre del archivo
  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Mover el archivo de la memoria temporal al directorio
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, errorsmove => {
    if (errorsmove) {
      return response.status(500).json({
        head: "error",
        body: { message: "Error al mover archivos", errors: errorsmove }
      });
    }
  });

  subirPorTipo(tipo, id, nombreArchivo, response);
  //   return response.status(200).json({
  //     head: "success",
  //     body: { tipo, id, nombreArchivo }
  //   });
});

function subirPorTipo(tipo, id, nombreArchivo, response) {
  switch (tipo) {
    case "hospitales":
      Hospital.findById(id, (errors, hospitalDB) => {
        // Elimina imagen anterior si existe
        const pathViejo = `./uploads/hospitales/${hospitalDB.img}`;
        if (hospitalDB.img && fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        hospitalDB.img = nombreArchivo;
        hospitalDB.save((errorsupd, hospitalActualizado) => {
          if (errorsupd) {
            return response.status(500).json({
              head: "error",
              body: {
                message: "Error al actualizar hospital",
                errors: errorsupd
              }
            });
          }
          return response.status(200).json({
            head: "success",
            body: hospitalActualizado
          });
        });
      });
      break;
    case "medicos":
      Medico.findById(id, (errors, medicoDB) => {
        // Elimina imagen anterior si existe
        const pathViejo = `./uploads/medicos/${medicoDB.img}`;
        if (medicoDB.img && fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        medicoDB.img = nombreArchivo;
        medicoDB.save((errorsupd, medicoActualizado) => {
          if (errorsupd) {
            return response.status(500).json({
              head: "error",
              body: {
                message: "Error al actualizar médico",
                errors: errorsupd
              }
            });
          }
          return response.status(200).json({
            head: "success",
            body: medicoActualizado
          });
        });
      });
      break;
    case "usuarios":
      Usuario.findById(id, (errors, usuarioDB) => {
        // Elimina imagen anterior si existe
        const pathViejo = `./uploads/usuarios/${usuarioDB.img}`;
        if (usuarioDB.img && fs.existsSync(pathViejo)) {
          fs.unlinkSync(pathViejo);
        }

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((errorsupd, usuarioActualizado) => {
          if (errorsupd) {
            return response.status(500).json({
              head: "error",
              body: {
                message: "Error al actualizar usuario",
                errors: errorsupd
              }
            });
          }

          usuarioActualizado.password = ":)";
          return response.status(200).json({
            head: "success",
            body: usuarioActualizado
          });
        });
      });

      break;
  }
}

module.exports = app;

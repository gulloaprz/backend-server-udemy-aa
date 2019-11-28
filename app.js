// Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// inicializa
var app = express();

// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require("./routes/app");
var usuarioRoutes = require("./routes/usuario");
const loginRoutes = require("./routes/login");
const hospitalRoutes = require("./routes/hospital");
const medicoRoutes = require("./routes/medico");
const busquedaRoutes = require("./routes/busqueda");
const uploadRoutes = require("./routes/upload");
const imagenesRoutes = require("./routes/imagenes");

// conexión bd
mongoose.connect("mongodb://localhost:27017/hospitalDB", (error, response) => {
  if (error) throw error;

  console.log("Base de datos en el puerto 27017: \x1b[32m%s\x1b[0m", "online");
});

// Rutas
app.use("/usuario", usuarioRoutes);
app.use("/login", loginRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/medico", medicoRoutes);
app.use("/busqueda", busquedaRoutes);
app.use("/upload", uploadRoutes);
app.use("/imagenes", imagenesRoutes);
app.use("/", appRoutes);

// excuchar puerto
app.listen(3000, () => {
  console.log(
    "Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m",
    "online"
  );
});

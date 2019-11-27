const jwt = require("jsonwebtoken");
const seed = require("../config/config").SEED;

// =======================================
// Verifica token
// =======================================
exports.verificaToken = function(request, response, next) {
  const token = request.query.token;
  jwt.verify(token, seed, (errors, decoded) => {
    if (errors) {
      return response.status(401).json({
        head: "error",
        body: { message: "Token no válido", errors }
      });
    }

    request.usuarioInToken = decoded.usuario;
    next();
  });
};

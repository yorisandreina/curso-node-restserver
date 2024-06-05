const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validaCampos = require("../middlewares/validar-campos");
const validaArchivos = require("../middlewares/validar-archivo");

module.exports = {
  ...validaCampos,
  ...validaJWT,
  ...validaRoles,
  ...validaArchivos
};
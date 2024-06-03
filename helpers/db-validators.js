const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (role = "") => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    // Error personalizado
    throw new Error(`El rol ${role} no está registrado en la BD`);
  }
};

const existeEmail = async(email = '') => {
  const existeEmail = await Usuario.findOne({ email });
  if (existeEmail) {
    throw new Error(`El correo ${email} ya está registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeusuario = await Usuario.findById(id);
  if (!existeusuario) {
    throw new Error(`El id ${id} no existe`);
  }
};

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId
}

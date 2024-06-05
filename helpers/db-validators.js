const { Categoria, Producto } = require('../models');
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
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe`);
  }
};

/**
 * Categorias
 */

const existeCategoria = async(id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id ${id} no existe`);
  }
}

/**
 * Productos
 */

const existeProducto = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id ${id} no existe`);
  }
};

/**
 * Validar colleciones permitidas
 */

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

  const incluida = colecciones.includes(coleccion);
  if(!incluida) {
    throw new Error(`La coleccion ${coleccion} no es permitida. Colecciones permitidas: ${colecciones}`);
  }

  return true;

}

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}

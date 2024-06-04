const response = require("express");
const { Producto } = require("../models");

// obtenerCategorias = paginado - total - populate
const obtenerProductos = async (req, res = response) => {
  // const {q, nombre = 'no name', apikey} = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  // Ejecuta ambas al mismo tiempo y si una da error entonces todas dan error
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .skip(desde)
      .limit(limite),
  ]);

  res.json({
    total,
    productos,
  });
};

// obtenerCategoria - populate {}
const obtenerProducto = async (req, res = response) => {
  // const {q, nombre = 'no name', apikey} = req.query;
  const { id } = req.params;

  // Ejecuta ambas al mismo tiempo y si una da error entonces todas dan error
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(producto);
};

const crearProducto = async (req, res = response) => {

  const {estado, usuario, ...body} = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  // Guardar DB
  await producto.save();

  res.status(201).json(producto);
};

// actualizarCategoria
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if(data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
};

// borrarCategoria - estado: false - solo admin
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;

  // Fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);

  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(productoBorrado);
};

module.exports = {
  obtenerProducto,
  obtenerProductos,
  actualizarProducto,
  crearProducto,
  borrarProducto
} 

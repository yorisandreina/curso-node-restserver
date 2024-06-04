const response = require('express');
const { Categoria } = require('../models');

// obtenerCategorias = paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

  // const {q, nombre = 'no name', apikey} = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  // Ejecuta ambas al mismo tiempo y si una da error entonces todas dan error
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(desde)
        .limit(limite),
  ]);

  res.json({
    total,
    categorias,
  });
};

// obtenerCategoria - populate {}
const obtenerCategoria = async (req, res = response) => {
  // const {q, nombre = 'no name', apikey} = req.query;
  const { id } = req.params;

  // Ejecuta ambas al mismo tiempo y si una da error entonces todas dan error
  const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

  res.json(categoria);
};

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    // Generra la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria 
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

  res.json({
    categoria,
  });
};

// borrarCategoria - estado: false - solo admin
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  // Fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete(id);

  const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true});

  res.json(categoriaBorrada);
};

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}
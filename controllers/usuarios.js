const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req, res = response) => {

    // const {q, nombre = 'no name', apikey} = req.query;
    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true };

    // Ejecuta ambas al mismo tiempo y si una da error entonces todas dan error
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
        .skip(desde)
        .limit(limite)
    ]);

    res.json({
        total, 
        usuarios
    });
};

const usuariosPost = async(req, res = response) => {

    const {nombre, email, password, role} = req.body;
    const usuario = new Usuario({nombre, email, password, role});

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync(); // default es 10
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar BD
    await usuario.save();

    res.json({
        usuario
    });
};

const usuariosPut = async(req, res = response) => {

    const {id} = req.params;
    const {_id, password, google, email, ...resto} = req.body;

    // Validar contra base de datos
    if(password) {
        const salt = bcryptjs.genSaltSync(); // default es 10
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: "put API - controlador",
        usuario
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador",
    });
};

const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json({
        usuario
    });
};


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
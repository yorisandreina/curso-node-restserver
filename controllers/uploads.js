const fs = require('fs');
const path = require('path');
const {response} = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');

const { Usuario, Producto } = require('../models/')

const cargarArchivo = async(req, res = response) => {

    try {

      const nombre = await subirArchivo(req.files, undefined, 'textos');
      res.json({nombre});

    } catch (msg) {

        res.status(400).json({msg});
    }

}

const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                })
            }

        break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
              return res.status(400).json({
                msg: `No existe producto con el id ${id}`,
              });
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // Limpiar imegenes previas
    try {
        if(modelo.img) {
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }
    } catch (error) {
        res.json(error);
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);

}

const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({
                    msg: `No existe usuario con el id ${id}`
                })
            }

        break;
        
        case 'productos':
            modelo = await Producto.findById(id);
            // Acá es mejor que regrese una imagen por defecto no ese texto
            if (!modelo) {
              return res.status(400).json({
                msg: `No existe producto con el id ${id}`,
              });
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvidó validar esto'});
    }

    // Limpiar imegenes previas
    try {
        if(modelo.img) {
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }
    } catch (error) {
        res.json(error);
    }

    const pathImagenNoExistente = path.join(__dirname, '../assets/no-image.png');
    res.sendFile(pathImagenNoExistente);

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}
const { response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({email});
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            })
        }

        // Verificar si el usuario esta activo
        if (!usuario.estado) {
          return res.status(400).json({
            msg: "Usuario / Password no son correctos - estado: false",
          });
        }

        // Verificar contrasena
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
          usuario, 
          token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el admin'
        })
    }

}

const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {
      const { email, nombre, img } = await googleVerify(id_token);

      let usuario = await Usuario.findOne({ email });

      if (!usuario) {
        // Tengo que crearlo
        const data = {
          nombre,
          email,
          password: ":P",
          img,
          google: true,
        };

        usuario = new Usuario(data);
        await usuario.save();
      }

      // Si el usuario en DB
      if (!usuario.estado) {
        return res.status(401).json({
          msg: "Hable con el admin, usuario bloqueado",
        });
      }

      // Generar el JWT
      const token = await generarJWT(usuario.id);

      res.json({
        usuario,
        token
      });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar',
            error: error.message
        })
    }

}

module.exports = {
    login,
    googleSignIn
}
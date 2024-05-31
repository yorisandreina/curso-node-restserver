const { Router } = require('express');

const { usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');

const router = Router();

// Obtener data
    router.get("/", usuariosGet);

    // Actualizar data
    router.put('/:id', usuariosPut);

    // Crear nuevos recursos
    router.post("/", usuariosPost);

    router.patch("/", usuariosPatch);

    // Borrar algo, pero no necesariamente de la BD
    router.delete("/", usuariosDelete);

module.exports = router;
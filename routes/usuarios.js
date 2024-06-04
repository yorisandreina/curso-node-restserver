const { Router } = require('express');

const { usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares')

const router = Router();

// Obtener data
    router.get("/", usuariosGet);

    // Actualizar data
    router.put(
      "/:id",
      [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioPorId),
        check("role").custom(esRoleValido),
        validarCampos,
      ],
      usuariosPut
    );

    // Crear nuevos recursos
    router.post(
      "/",
      [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("email").custom(existeEmail),
        check("password", "El password debe ser más de 6 letras").isLength({
          min: 6,
        }),
        // check("role", "No es un role permitido").isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check("role").custom(esRoleValido),
        validarCampos,
      ],
      usuariosPost
    );

    router.patch("/", usuariosPatch);

    // Borrar algo, pero no necesariamente de la BD
    router.delete(
      "/:id",
      [
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioPorId),
        validarCampos,
      ],
      usuariosDelete
    );

module.exports = router;
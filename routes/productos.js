const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");
const { existeProducto, existeCategoria } = require("../helpers/db-validators");

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias
router.get("/", obtenerProductos);

// Obetener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de Mongo").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  obtenerProducto
);

// Crear categoria - privado (cualquier persona con token valido)
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id de Mongo").isMongoId(),
    check("categoria").custom(existeCategoria),
    validarCampos,
  ],
  crearProducto
);

// Actualizar - privado (cualquiera con token valido)
router.put(
  "/:id",
  [
    validarJWT,
    // check("categoria", "No es un id de Mongo").isMongoId(),
    check("id").custom(existeProducto),
    validarCampos,
  ],
  actualizarProducto);

// Borrar categoria - solo admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de Mongo").isMongoId(),
    validarCampos,
    check("id").custom(existeProducto),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;

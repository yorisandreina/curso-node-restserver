const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos, validarJWT, esAdminRole
} = require("../middlewares");
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require("../controllers/categorias");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias
router.get('/', obtenerCategorias);

// Obetener una categoria por id - publico
router.get("/:id", [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

// Crear categoria - privado (cualquier persona con token valido)
router.post("/", [
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    validarCampos
], crearCategoria);

// Actualizar - privado (cualquiera con token valido)
router.put("/:id", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria),
    validarCampos
], actualizarCategoria);

// Borrar categoria - solo admin
router.delete(
  "/:id",[
    validarJWT, 
    esAdminRole, 
    check("id", "No es un id de Mongo").isMongoId(),
    validarCampos,
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);

module.exports = router;
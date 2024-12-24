const express = require('express');
const router = express.Router();

const{newProduct, allProducts,deleteProduct,login}= require('../controllers/product');

// MÉTODOS DE PETICIÓN
// POST: Se envía información del frontend y el backend la recibe
// GET: Devuelve información del backend al frontend
// PUT: Actualiza información en el backend
// DELETE: Elimina información en el backend


// Endpoint para crear un nuevo producto
router.post('/store/new-product', newProduct);

// Endpoint para devolver todos los productos en el sistema
router.get('/store/get-products', allProducts);

// Endpoint para eliminar un producto por ID
router.delete('/store//delete-product/:id_producto',deleteProduct)

// Endpoint para el login
router.post('/store/login', login);

module.exports = router;
const express = require('express');
const router = express.Router();

const{newClient, allClients, deleteClient, newProduct, allProducts, deleteProduct, login}= require('../controllers/product');

// MÉTODOS DE PETICIÓN
// POST: Se envía información del frontend y el backend la recibe
// GET: Devuelve información del backend al frontend
// PUT: Actualiza información en el backend
// DELETE: Elimina información en el backend


//=================================================================================================
// SECCIÓN DE CLIENTES
//=================================================================================================

// Endpoint para crear un nuevo cliente
router.post('/store/new-client', newClient);

// Endpoint para devolver todos los clientes en el sistema
router.get('/store/get-clients', allClients);

// Endpoint para eliminar un cliente por ID
router.delete('/store/delete-client/:id_cliente', deleteClient);

//=================================================================================================
// SECCIÓN DE PRODUCTOS
//=================================================================================================

// Endpoint para crear un nuevo producto
router.post('/store/new-product', newProduct);

// Endpoint para devolver todos los productos en el sistema
router.get('/store/get-products', allProducts);

// Endpoint para eliminar un producto por ID
router.delete('/store/delete-product/:id_producto', deleteProduct);

//=================================================================================================
// SECCIÓN DE LOGIN
//=================================================================================================

// Endpoint para el login
router.post('/store/login', login);



module.exports = router;
const products = require('../models/product');

// Importar la información del admin
const {adminData}=require("../config/config")

//=================================================================================================
// SECCIÓN DE CLIENTES
//=================================================================================================


// Controlador para manejar la creación de un nuevo cliente
module.exports.newClient = async (req, res) => {
    try {
        const newClient = req.body;

        if (isNaN(newClient.id_cliente)) {
            return res.status(400).json({
                message: "El ID del cliente debe ser un número.",
                status: "error",
            });
        }

        // Validar que la edad sea un número mayor o igual a 0
        if (newClient.edad < 0 || isNaN(newClient.edad)) {
            return res.status(400).json({
                message: "La edad debe ser un número mayor o igual a 0.",
                status: "error",
            });
        }

        // Validar que no se repitan ni el ID ni el NIT
        const exists = clients.some(
            (client) =>
                client.id_cliente === newClient.id_cliente ||
                client.nit === newClient.nit
        );
        if (exists) {
            return res.status(400).json({
                message: "El cliente ya existe (ID o NIT duplicado).",
                status: "error",
            });
        }

        // Agregar el cliente si pasa todas las validaciones
        clients.push(newClient);
        res.status(201).json({
            message: "Cliente creado con éxito.",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: "error",
        });
    }
};

// Controlador para obtener todos los clientes
module.exports.allClients = async (req, res) => {
    try {
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

// Controlador para eliminar un cliente
module.exports.deleteClient = async (req, res) => {
    try {
        const { id_cliente } = req.params;

        const index = clients.findIndex(
            (client) => client.id_cliente === id_cliente
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Cliente no encontrado.",
                status: "error",
            });
        }

        clients.splice(index, 1);
        res.status(200).json({
            message: "Cliente eliminado con éxito.",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: "error",
        });
    }
};




//=================================================================================================
// SECCIÓN DE PRODUCTOS
//=================================================================================================

// Controlador para manejar la creación de un nuevo producto
module.exports.newProduct = async (req, res) => {
    try {
        const newProduct = req.body;

        if (isNaN(newProduct.id_producto)) {
            return res.status(400).json({
                message: "El ID del producto debe ser un número.",
                status: "error",
            });
        }

        // Validar que el precio sea mayor a 0
        if (newProduct.precio_producto <= 0) {
            return res.status(400).json({
                message: "El precio debe ser mayor a 0.",
                status: "error",
            });
        }

        // Validar que el stock sea mayor o igual a 0
        if (newProduct.stock_producto < 0) {
            return res.status(400).json({
                message: "El stock debe ser mayor o igual a 0.",
                status: "error",
            });
        }

        // Validar que no se repitan ni el ID ni el nombre
        const exists = products.some(
            (product) =>
                product.id_producto === newProduct.id_producto ||
                product.nombre_producto === newProduct.nombre_producto
        );
        if (exists) {
            return res.status(400).json({
                message: "El producto ya existe (ID o nombre duplicado).",
                status: "error",
            });
        }

        // Agregar el producto si pasa todas las validaciones
        products.push(newProduct);
        res.status(201).json({
            message: "Producto creado con éxito.",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: "error",
        });
    }
};

// Controlador para obtener todos los productos
module.exports.allProducts=async(req,res)=>{
    try{
        res.status(200).json(products);
    }catch(error){
        res.status(400).json({
            error:error.message
        })
    }
}


// Controlador para eliminar un producto
module.exports.deleteProduct = async (req, res) => {
    try {
        const { id_producto } = req.params;

        const index = products.findIndex(
            (product) => product.id_producto === id_producto
        );

        if (index === -1) {
            return res.status(404).json({
                message: "Producto no encontrado.",
                status: "error",
            });
        }

        products.splice(index, 1);
        res.status(200).json({
            message: "Producto eliminado con éxito.",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: "error",
        });
    }
};

//=================================================================================================
// Controlador para manejar el login
//=================================================================================================
module.exports.login=async(req,res)=>{
    try{
        if(req.body.username==adminData.username &&
            req.body.password==adminData.password){
                res.status(200).json({
                    message:"Login exitoso",
                    status:"success"
                });
        }else{
            res.status(401).json({
                message:"Usuario/Contraseña incorrecta intente de nuevo!",
                status:"error"
            });
        }
        
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}
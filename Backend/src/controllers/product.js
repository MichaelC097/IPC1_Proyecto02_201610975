const products = require('../models/product');

// Importar la información del admin
const {adminData}=require("../config/config")

// Controlador para manejar la creación de un nuevo producto
module.exports.newProduct = async (req, res) => {
    try {
        const newProduct = req.body;

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
        const exists = products.find(
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


// Controlador para manejar el login
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
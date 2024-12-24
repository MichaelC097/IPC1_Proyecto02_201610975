import React ,{useState,useEffect} from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import Background from "../components/background";

import Table from 'react-bootstrap/Table';

import {Bar,Pie} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend)
const Dashboard =()=>{  
    const [ productBody, setProductBody]= useState(''); // Para guardar el contenido de mi nuevo producto
    // UseState para administrar los productos que obtengamos de nuestro backend
    const[products, setProducts]=useState([]);
    // Datos de mi gráfica de barras de productos por precio
    const[barChartData,setBarChartData]=useState(null);
    // Datos de mi gráfica de pie (Productos con precio mayor a 100 vs productos con precio menor/igual a 100)
    const[pieChartData,setPieChartData]=useState(null);

    // Función que maneja el cambio de texto en el textarea
    const handleChange=(event)=>{
        setProductBody(event.target.value);
    };

    // Función que maneja el envío de mi producto hacia el backend para su creación
    const handleSubmit=async()=>{
        const data={
            content:productBody // Contenido del textarea
        }
        // Realizamos la solicitud al backend para crear nuevo producto
        const response= await fetch('http://localhost:3005/store/new-product',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(JSON.parse(data.content)),
        });

        const result = await response.json();
        if(result.status==="success"){
            await Swal.fire({
                title:'<span style="color:#A0A4B4;">Nuevo producto</span>',
                html:'<span style="color:#A0A4B4;">Creación de producto exitosa</span>',
                icon:"success",
                confirmButtonText:"Cerrar",
                background:"#222",
                confirmButtonColor:"red",
            })
            await updateProducts();
        }else{
            await Swal.fire({
                title:'<span style="color:#A0A4B4;">Nuevo producto</span>',
                html:'<span style="color:#A0A4B4;">Error al crear el producto</span>',
                icon:"error",
                confirmButtonText:"Cerrar",
                background:"#222",
                confirmButtonColor:"red",
            })
        }
    }


    // Petición al backend para obtener todos los productos registrados
    const getProducts = async()=>{
        const response= await fetch("http://localhost:3005/store/get-products",{
            method:"GET",
            headers:{
                'Content-Type':'application/json',
            },
        });
        // Capturamos los productos obtenidos
        const products=await response.json();
        return products;
    }
    
    // Función para actualizar los productos actuales, con los más recientes del backend
    const updateProducts = async()=>{
        try{
            var products= await getProducts();
            // Actualizamos productos
            setProducts(products);
        }catch(error){
            console.log(error)
        }
    }
    
    // Función para eliminar un producto
const deleteProduct = async (id_producto) => {
    const response = await fetch(
        `http://localhost:3005/store/delete-product/${id_producto}`,
        {
            method: "DELETE",
        }
    );
    const result = await response.json();
    if (result.status === "success") {
        await Swal.fire({
            title: "Producto eliminado",
            text: result.message,
            icon: "success",
            confirmButtonText: "Cerrar",
        });
        await updateProducts();
    } else {
        await Swal.fire({
            title: "Error al eliminar",
            text: result.message,
            icon: "error",
            confirmButtonText: "Cerrar",
        });
    }
};


    // Configurar los datos de las gráficas mediante el uso de UseEffect
    useEffect(()=>{
        if(products.length>0){
            // Gráfica de barras
            const sortedProducts= [...products].sort((a,b)=>a.price-b.price);
            const barData={
                labels: sortedProducts.map((product)=>product.name),
                datasets:[
                    {
                        label:'Precio',
                        data:sortedProducts.map((product)=>product.price),
                    }
                ]
            }
            // Actualizamos la información de mi gráfica de barras
            setBarChartData(barData);

            // Gráfica de pie
            // Cantidad de productos con precio mayor a 100
            const higherPriceCount = products.filter((product)=> product.price>100).length;
            // Cantidad de productos con precio menor o igual a 100
            const lowPriceCount=products.length-higherPriceCount;
            const pieData={
                labels:['Precio >100', 'Precio <= 100'],
                datasets:[
                    {
                        data:[higherPriceCount,lowPriceCount],
                        backgroundColor:['rgba(255,99,132,0.6)','rgba(24, 147, 219, 0.6)'],
                    }
                ]
            };
            setPieChartData(pieData);
        }
    },
    [products]);
    
    return(
        <>
            <Background/>
            <div>
                <h2>Bienvenido al dashboard de la tienda</h2>
                <textarea
                    rows="10"
                    cols="50"
                    placeholder='Crea un nuevo producto aquí.....'
                    value={productBody} // Valor del textarea almacenado en mi variable del contenido del producto
                    onChange={handleChange} // Función para actualizar el estado de mi producto
                />
                <br/>
                <button onClick={handleSubmit}>Enviar</button>
            </div>
            <h1>Productos registrados en el sistema</h1>
            <div className="table-container">
                <Table striped bordered hover variant='dark'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*Recorremos los productos y mostramos cada uno en una fila */}
                        { products.length>0 ?(
                            products.map((product)=>(
                                <tr key={product.id_producto}>
                                    <td>{product.id_producto}</td>
                                    <td>{product.nombre_producto}</td>
                                    <td>{product.precio_producto}</td>
                                    <td>{product.stock_producto}</td>
                                    <td>
                                    <button onClick={() => deleteProduct(product.id_producto)}>
                                        Eliminar
                                    </button>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="3">No hay productos registrados</td>
                            </tr>
                        )}  
                    </tbody>
                </Table>
                <h1>Gráfica de productos ordenados por precio</h1>
                <div style={{width:'70%', margin:'auto'}}>
                    {barChartData? <Bar data={barChartData}/>:<p>Cargando gráfica......</p>}
                </div>
                <h1>Gráfica de productos con precio&gt; 100 vs precio&lt;=100</h1>
                <div style={{width:'70%', margin:'auto'}}>
                    {pieChartData? <Pie data={pieChartData}/>:<p>Cargando gráfica......</p>}
                </div>
            </div>
        </>

    );
}


export default Dashboard;
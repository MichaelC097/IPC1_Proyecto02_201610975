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


//=================================================================================================
// SECCIÓN DE CLIENTES
//=================================================================================================
ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend)
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
                labels: sortedProducts.map((product)=>product.nombre_producto),
                datasets:[
                    {
                        label:'Precio',
                        data:sortedProducts.map((product)=>product.precio_producto),
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
    

//=================================================================================================
// SECCIÓN DE CLIENTES
//=================================================================================================
ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Title,Tooltip,Legend)
const Dashboard =()=>{  
    const [ clientBody, setClientBody]= useState(''); // Para guardar el contenido de nuevo cliente
    const[clients, setClients]=useState([]); // Para los clientes obtenidos
    const[barChartData,setBarChartData]=useState(null); // Gráfica de barras
    const[pieChartData,setPieChartData]=useState(null); // Gráfica de pie

    // Función que maneja el cambio de texto en el textarea
    const handleChange=(event)=>{
        setClientBody(event.target.value);
    };

    // Función que maneja el envío de un nuevo cliente
    const handleSubmit=async()=>{
        const data={
            content:clientBody // Contenido del nuevo cliente
        }
        const response= await fetch('http://localhost:3005/store/new-client',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify(JSON.parse(data.content)),
        });

        const result = await response.json();
        if(result.status==="success"){
            await Swal.fire({
                title:'<span style="color:#A0A4B4;">Nuevo Cliente</span>',
                html:'<span style="color:#A0A4B4;">Creación de cliente exitosa</span>',
                icon:"success",
                confirmButtonText:"Cerrar",
                background:"#222",
                confirmButtonColor:"red",
            })
            await updateClients();
        }else{
            await Swal.fire({
                title:'<span style="color:#A0A4B4;">Nuevo Cliente</span>',
                html:'<span style="color:#A0A4B4;">Error al crear el cliente</span>',
                icon:"error",
                confirmButtonText:"Cerrar",
                background:"#222",
                confirmButtonColor:"red",
            })
        }
    }

    // Petición al backend para obtener todos los clientes
    const getClients = async()=>{
        const response= await fetch("http://localhost:3005/store/get-clients",{
            method:"GET",
            headers:{
                'Content-Type':'application/json',
            },
        });
        const clients = await response.json();
        return clients;
    }

    // Función para actualizar los clientes
    const updateClients = async()=>{
        try{
            var clients = await getClients();
            setClients(clients);
        }catch(error){
            console.log(error)
        }
    }

    // Función para eliminar un cliente
    const deleteClient = async (id_cliente) => {
        const response = await fetch(
            `http://localhost:3005/store/delete-client/${id_cliente}`,
            {
                method: "DELETE",
            }
        );
        const result = await response.json();
        if (result.status === "success") {
            await Swal.fire({
                title: "Cliente eliminado",
                text: result.message,
                icon: "success",
                confirmButtonText: "Cerrar",
            });
            await updateClients();
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
        if(clients.length>0){
            // Gráfica de barras (por ejemplo, cantidad de clientes por edad)
            const sortedClients = [...clients].sort((a,b) => a.age - b.age); // Ordenamos por edad
            const barData = {
                labels: sortedClients.map((client) => client.name),
                datasets: [
                    {
                        label: 'Edad',
                        data: sortedClients.map((client) => client.age),
                    }
                ]
            }
            setBarChartData(barData);

            // Gráfica de pie (clientes activos vs inactivos)
            const activeClients = clients.filter((client) => client.status === 'active').length;
            const inactiveClients = clients.length - activeClients;
            const pieData = {
                labels: ['Activos', 'Inactivos'],
                datasets: [
                    {
                        data: [activeClients, inactiveClients],
                        backgroundColor: ['rgba(24, 147, 219, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                    }
                ]
            };
            setPieChartData(pieData);
        }
    }, [clients]);




    return(
        <>
        <Background/>
        <h1>Bienvenidos al Dashboard del sistema</h1>

        <div>
            <div>
                <h2>Sección de productos</h2>
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
            <h2>Productos registrados en el sistema</h2>
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
                <h2>Gráfica de productos ordenados por precio</h2>
                <div style={{width:'70%', margin:'auto'}}>
                    {barChartData? <Bar data={barChartData}/>:<p>Cargando gráfica......</p>}
                </div>
                <h2>Gráfica de productos con precio&gt; 100 vs precio&lt;=100</h2>
                <div style={{width:'70%', margin:'auto'}}>
                    {pieChartData? <Pie data={pieChartData}/>:<p>Cargando gráfica......</p>}
                </div>
            </div>
        </div>




        <div>
            <div>
                <h2>Sección de clientes</h2>
                <textarea
                    rows="10"
                    cols="50"
                    placeholder='Crea un nuevo cliente aquí.....'
                    value={clientBody} // Valor del textarea almacenado en mi variable del contenido del cliente
                    onChange={handleChange} // Función para actualizar el estado de mi cliente
                />
                <br/>
                <button onClick={handleSubmit}>Enviar</button>
            </div>
            <h2>Clientes registrados en el sistema</h2>
            <div className="table-container">
                <Table striped bordered hover variant='dark'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        { clients.length > 0 ? (
                            clients.map((client) => (
                                <tr key={client.id_cliente}>
                                    <td>{client.id_cliente}</td>
                                    <td>{client.name}</td>
                                    <td>{client.age}</td>
                                    <td>{client.status}</td>
                                    <td>
                                        <button onClick={() => deleteClient(client.id_cliente)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No hay clientes registrados</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                <h2>Gráfica de clientes ordenados por edad</h2>
                <div style={{width:'70%', margin:'auto'}}>
                    {barChartData ? <Bar data={barChartData} /> : <p>Cargando gráfica......</p>}
                </div>

                <h2>Gráfica de clientes activos vs inactivos</h2>
                <div style={{width:'70%', margin:'auto'}}>
                    {pieChartData ? <Pie data={pieChartData} /> : <p>Cargando gráfica......</p>}
                </div>
            </div>
        </div>
        </>
    );
}


export default Dashboard;
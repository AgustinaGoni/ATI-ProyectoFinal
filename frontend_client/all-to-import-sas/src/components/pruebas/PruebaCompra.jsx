// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../../hooks/useCart";
// import { Box, Button, Flex } from "@chakra-ui/react";
// import PaymentButton from "../PaymentButton";
// import { getIdUsuarioDesdeToken, obtenerDatosUsuario } from "../../js/api/usuarios/obtenerDatosUsuario";

// const PruebaCompra = () => {
//   const [usuario, setUsuario] = useState([]);
//   const [datosCompra, setDatosCompra] = useState([]);
//   const [comentario, setComentario] = useState("");

//   const {
//     id,
//     nombre,
//     apellido,
//     correoElectronico,
//     telefono,
//     razonSocial,
//     rut,
//   } = usuario;
//   const { carrito } = useCart();

//   useEffect(() => {
//     const fetchData = async () => {
//       const datos = await obtenerDatosUsuario();
//       setUsuario(datos);
//     };

//     fetchData();
//   }, []);

//   console.log(usuario);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUsuario((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const datosFacturacionUsuario = {
//       nombre,
//       apellido,
//       correoElectronico,
//       telefono: "091112233",
//       razonSocial: "ABCD",
//       rut: 1234,
//     };

//     setDatosCompra((prevData) => ({
//       carrito,
//       datosFacturacionUsuario,
//     }));
//   };

//   const [direcciones, setDirecciones] = useState([]);

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     const datos = await getDireccionUsuario();
//   //     setDirecciones(datos);
//   //   };

//   //   fetchData();
//   // }, []);

//   // console.log(direcciones);

//   const [direccionSeleccionada, setDireccionSeleccionada] = useState("");

//   const handleDireccionChange = (e) => {
//     setDireccionSeleccionada(e.target.value);
//     //setOpcionEnvio(e.target.value);
//   };

//   const handleSubmitDireccion = async (e) => {
//     e.preventDefault();

//     // Encuentra la dirección seleccionada en usuario.direcciones
//     const direccion = direcciones.find(
//       (d) => d.id === parseInt(direccionSeleccionada)
//     );

//     // Asegúrate de que la dirección exista antes de actualizar el estado
//     if (direccion) {
//       setDatosCompra((prevData) => ({
//         ...prevData,
//         datosEnvio: {
//           ...prevData.datosEnvio,
//           direccion: direccion,
//         },
//       }));
//     }
//   };

//   console.log(datosCompra);

//   // const datosProductosMercadoPago = {
//   //   productosDTO:
//   //     datosCompra && datosCompra.carrito
//   //       ? datosCompra.carrito.map((item) => ({
//   //           title: item.nombre,
//   //           quantity: item.cantidad,
//   //           price: item.precio,
//   //         }))
//   //       : [],
//   // };

//   // const datosProductosMercadoPago = {
//   //   productos:
//   //     datosCompra && datosCompra.carrito
//   //       ? datosCompra.carrito.map((item) => ({
//   //           id: item.id,
//   //           nombre: item.nombre,
//   //           precioUnitario: item.precio,
//   //           cantidad: item.cantidad,
//   //         }))
//   //       : [],
//   //   cliente: {
//   //     nombre,
//   //     apellido,
//   //     email: correoElectronico,
//   //     // codigoAreaTelefono: "+598",
//   //     numeroTelefono: "091112233",
//   //     tipoDocumento: "CI",
//   //     numeroDocumento: "1234567",
//   //     direccion: {
//   //       departamento: "string",
//   //       ciudad: "string",
//   //       calle: "string",
//   //       codigoPostal: "string",
//   //       nroPuerta: "string",
//   //       nroApartamento: "string",
//   //     },
//   //   },
//   // };

//   const [opcionEnvio, setOpcionEnvio] = useState("domicilio"); // 'domicilio' o 'retiro'

//   const datosProductosMercadoPago = {
//     productos:
//       datosCompra && datosCompra.carrito
//         ? datosCompra.carrito.map((item) => ({
//             id: item.id,
//             nombre: item.nombre,
//             precioUnitario: item.precio,
//             cantidad: item.cantidad,
//           }))
//         : [],
//     cliente: {
//       idCliente: id,
//       nombre,
//       apellido,
//       email: correoElectronico,
//       numeroTelefono: usuario.telefono,
//       razonSocial: usuario.razonSocial ? usuario.razonSocial : "",
//       rut: usuario.rut ? usuario.rut : "",
//     },
//     opcionEnvio: opcionEnvio, // 'domicilio' o 'retiro'
//     envioDomicilio:
//       opcionEnvio === "domicilio"
//         ? {
//             idDireccion: Number(direccionSeleccionada),
//             comentario: comentario,
//           }
//         : {
//             idDireccion: 0,
//             comentario: "",
//           },
//     retiroCompra:
//       opcionEnvio === "retiro"
//         ? {
//             nombreApellido: "Guillermo Montecoral",
//             tipoDocumento: "CI",
//             numeroDocumento: "1234567",
//             comentario: "Retiro en persona", // Campo adicional para la nota
//           }
//         : {
//             nombreApellido: "",
//             tipoDocumento: "",
//             numeroDocumento: "",
//             comentario: "", // Campo adicional para la nota
//           },
//   };

//   console.log(datosProductosMercadoPago);

//   const comprar = {
//     items:
//       datosCompra && datosCompra.carrito
//         ? datosCompra.carrito.map((item) => ({
//             idProducto: item.id,
//             cantidad: item.cantidad,
//           }))
//         : [],
//     idCliente: getIdUsuarioDesdeToken(),
//     tipoEnvio: "domicilio",
//     envioDomicilio: {
//       idDireccion: 1,
//       comentario: "Comentario a la desde el front 17:37 horas",
//     },
//     retiroCompra: {
//       numeroDocumento: "",
//       nombreApellido: "",
//       comentario: "",
//     },
//   };

//   // console.log(comprar)

//   const handleGuardarCompra = async () => {
//     try {
//       const response = await fetch(
//         `https://localhost:7079/api/Compra/AltaCompra2`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(comprar),
//         }
//       );
//       const data = await response.json();
//       console.log(data);
//       // setPreferenceId(data.res.id);

//       if (response.ok) {
//         console.log("Se realizo con exito");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
//   // console.log(comentario)
//   return (
//     <>
//       <Box my={4} bg={"blue.300"}>
//         <form onSubmit={handleSubmit}>
//           <Flex flexDirection={"column"}>
//             <label htmlFor="">Nombre</label>
//             <input type="text" defaultValue={usuario.nombre} />

//             <label htmlFor="">Apellido</label>
//             <input type="text" defaultValue={usuario.apellido} />

//             <label htmlFor="">Correo</label>
//             <input type="email" defaultValue={usuario.correoElectronico} />

//             <label htmlFor="">Telefono</label>
//             <input
//               type="text"
//               defaultValue={telefono}
//               name="telefono"
//               onChange={handleChange}
//             />

//             <label htmlFor="">Razon social</label>
//             <input
//               type="text"
//               defaultValue={razonSocial}
//               name="razonSocial"
//               onChange={handleChange}
//             />

//             <label htmlFor="">Rut</label>
//             <input
//               type="text"
//               defaultValue={rut}
//               name="rut"
//               onChange={handleChange}
//             />
//             <Button colorScheme="teal" type="submit">
//               Cargar datos facturacion
//             </Button>
//           </Flex>
//         </form>
//       </Box>
//       <Box bg={"green.300"}>
//         <form onSubmit={handleSubmitDireccion}>
//           <Flex flexDirection={"column"}>
//             <select name="" id="" onChange={handleDireccionChange}>
//               <option value="default">Seleccionar direccion</option>
//               {direcciones ? (
//                 direcciones.map((direccion) => (
//                   <option key={direccion.id} value={direccion.id}>
//                     {direccion.calle} - {direccion.ciudad} -{" "}
//                     {direccion.departamento}
//                   </option>
//                 ))
//               ) : (
//                 <option value="">No hay direcciones disponibles</option>
//               )}
//             </select>
//             <label htmlFor="comentario">COMENTARIO</label>
//             <input
//               type="text"
//               onChange={(e) => setComentario(e.target.value)}
//             />
//             <Button colorScheme="teal" type="submit">
//               Cargar datos direccion
//             </Button>
//           </Flex>
//         </form>
//       </Box>

//       <Box my={8} p={10} bg={"yellow.100"}>
//         <h1>RESUMEN</h1>
//         <div>
//           <h2>Productos</h2>
//           <ul>
//             {datosCompra && datosCompra.carrito ? (
//               datosCompra.carrito.map((item) => (
//                 <li key={item.id}>
//                   Cod: {item.codigo} - {item.nombre} - ${item.precio} -
//                   cantidad: {item.cantidad}
//                 </li>
//               ))
//             ) : (
//               <li value="">No hay datos disponibles</li>
//             )}
//           </ul>
//           <h2>Datos facturacion</h2>
//           <ul>
//             {datosCompra && datosCompra.datosFacturacionUsuario ? (
//               <>
//                 {" "}
//                 <li>{datosCompra.datosFacturacionUsuario.nombre}</li>
//                 <li>{datosCompra.datosFacturacionUsuario.apellido}</li>
//                 <li>{datosCompra.datosFacturacionUsuario.correoElectronico}</li>
//                 <li>{datosCompra.datosFacturacionUsuario.telefono}</li>
//                 <li>{datosCompra.datosFacturacionUsuario.razonSocial}</li>
//                 <li>{datosCompra.datosFacturacionUsuario.rut}</li>
//               </>
//             ) : (
//               <li value="">No hay datos disponibles</li>
//             )}
//             {/* <li>{datosCompra.datosFacturacionUsuario.razonSocial}</li>
//             <li>{datosCompra.datosFacturacionUsuario.rut}</li> */}
//           </ul>
//           <h2>Direccion</h2>
//           <ul>
//             {datosCompra && datosCompra.datosEnvio ? (
//               <>
//                 <li>{datosCompra.datosEnvio.direccion.calle}</li>
//                 <li>{datosCompra.datosEnvio.direccion.nroPuerta}</li>
//                 <li>{datosCompra.datosEnvio.direccion.ciudad}</li>
//                 <li>{datosCompra.datosEnvio.direccion.departamento}</li>
//                 <li>{datosCompra.datosEnvio.direccion.codigoPostal}</li>
//                 <li>{datosCompra.datosEnvio.comentario}</li>
//               </>
//             ) : (
//               <li value="">No hay datos disponibles</li>
//             )}
//           </ul>
//         </div>
//         <div>
//           <label>
//             <input
//               type="radio"
//               value="domicilio"
//               checked={opcionEnvio === "domicilio"}
//               onChange={() => setOpcionEnvio("domicilio")}
//             />
//             Envío a domicilio
//           </label>
//           <label>
//             <input
//               type="radio"
//               value="retiro"
//               checked={opcionEnvio === "retiro"}
//               onChange={() => setOpcionEnvio("retiro")}
//             />
//             Retiro en tienda
//           </label>
//         </div>
//       </Box>
//       <Button my={5} bg={"blue.300"} onClick={handleGuardarCompra}>
//         Guardar compra en la BD
//       </Button>
//       <Box p={8} bg={"red.300"}>
//         <PaymentButton datosProductosMercadoPago={datosProductosMercadoPago} />
//         {/* <PaymentButton /> */}
//       </Box>
//     </>
//   );
// };

// export default PruebaCompra;

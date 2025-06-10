import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Flex,
  Select,
  Textarea,
  Text,
  Grid,
  GridItem,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Image,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useCart } from "../../hooks/useCart";
import PaymentButton from "../PaymentButton";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { obtenerDatosUsuario } from "../../js/api/usuarios/obtenerDatosUsuario";

const BillingDetails = ({ setDatosCompra, onNext }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [telefono, setTelefono] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [RUT, setRUT] = useState("");

  const {
    carrito,
    limpiarCarrito,
    actualizarCantidadPorInput,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const datos = await obtenerDatosUsuario();
      setUsuario(datos);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setCorreoElectronico(usuario.correoElectronico);
    setTelefono(usuario.telefono);
    setRazonSocial(usuario.razonSocial);
    setRUT(RUT);
  }, [usuario]);

  console.log(usuario);
  // console.log(nombre);
  // console.log(telefono);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarTelefono(telefono)) {
      console.log("ERROR EN EL TELEFONO");
      return;
    }

    // const datosUsuario = {
    //   nombre,
    //   apellido,
    //   correoElectronico,
    //   telefono,
    //   razonSocial,
    //   RUT
    // };

    // console.log(datosUsuario)
    // setDatosCompra([{datosCliente: usuario}]);
    setDatosCompra((prevData) => ({
      // ...prevData,
      carrito,
      usuario,
    }));
    onNext();
  };

  function validarTelefono(telefono) {
    const regex = /^(2\d{7}|4\d{7}|09[1-9]\d{6})$/;
    return regex.test(telefono);
  }

  // // Ejemplos de uso:
  // console.log(validarTelefono("29123456")); // true, número fijo válido
  // console.log(validarTelefono("43136472")); // true, número fijo válido
  // console.log(validarTelefono("99123456")); // true, número móvil válido
  // console.log(validarTelefono("12345678")); // false, número no válido
  // console.log(validarTelefono("29123abc")); // false, contiene caracteres no numéricos
  // console.log(validarTelefono("491234567")); // false, más de 8 dígitos

  return (
    <Box>
      <Box mb={4}>
        <Heading py={2} fontSize={"lg"}>
          Datos de facturación
        </Heading>
      </Box>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4} width="100%" mb={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="nombre" m={0}>
              Nombre
            </FormLabel>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ingrese su nombre"
              variant="flushed"
              defaultValue={nombre}
              onChange={(e) => handleChange(e)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="apellido" m={0}>
              Apellido
            </FormLabel>
            <Input
              id="apellido"
              name="apellido"
              type="text"
              placeholder="Ingrese su apellido"
              variant="flushed"
              defaultValue={apellido}
              onChange={(e) => handleChange(e)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="email" m={0}>
              Correo Electrónico
            </FormLabel>
            <Input
              id="email"
              name="correoElectronico"
              type="email"
              placeholder="Ingrese su correo electrónico"
              variant="flushed"
              defaultValue={correoElectronico}
              onChange={(e) => handleChange(e)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="telefono" m={0}>
              Teléfono
            </FormLabel>
            <Input
              id="telefono"
              name="telefono"
              type="text"
              placeholder="Ingrese su número de teléfono"
              variant="flushed"
              defaultValue={telefono}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="empresa" m={0}>
              Razon Social{" "}
              <Box as="span" fontWeight={"light"}>
                (Opcional)
              </Box>
            </FormLabel>
            <Input
              id="razonSocial"
              name="razonSocial"
              type="text"
              placeholder="Ingrese la razón social de su empresa"
              variant="flushed"
              defaultValue={razonSocial}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="rut" m={0}>
              RUT{" "}
              <Box as="span" fontWeight={"light"}>
                (Opcional)
              </Box>
            </FormLabel>
            <Input
              id="rut"
              name="rut"
              type="text"
              placeholder="Ingrese el RUT de la empresa"
              variant="flushed"
              defaultValue={RUT}
              onChange={handleChange}
            />
          </FormControl>
        </VStack>
        <Flex justifyContent={"space-between"}>
          <Button variant="link" onClick={() => navigate("/micarrito")}>
            Volver al carrito
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            // onClick={onNext}
          >
            Siguiente
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

//Direcciones de prueba
// const generateTestData = [
//   {
//     id: "1",
//     departamento: "Montevideo",
//     localidad: "Pocitos",
//     calle: "Avenida Brasil",
//     codigoPostal: "11300",
//     numeroPuerta: "1234",
//     numeroApartamento: "101",
//   },
//   {
//     id: "2",
//     departamento: "Canelones",
//     localidad: "Ciudad de la Costa",
//     calle: "Giannattasio",
//     codigoPostal: "15000",
//     numeroPuerta: "5678",
//     numeroApartamento: "",
//   },
//   {
//     id: "3",
//     departamento: "Maldonado",
//     localidad: "Punta del Este",
//     calle: "Rambla Lorenzo Batlle Pacheco",
//     codigoPostal: "20100",
//     numeroPuerta: "910",
//     numeroApartamento: "",
//   },
// ];

// Imprimir los datos generados para verificar
// console.log(generateTestData);

// const ShippingDetails = ({ setDatosCompra, datosCompra, onNext, onBack }) => {
//   console.log(Array.isArray(datosCompra));

//   const tiposDeEnvio = {
//     envioDomicilio: "Enviar a domicilio",
//     retiroPersona: "Retirar en persona",
//   };

//   // console.log(datosCompra);
//   const [selectedIndex, setSelectedIndex] = useState([]);
//   const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
//   const [checkBoxSeleccionado, setCheckBoxSeleccionado] = useState("");

//   const handleToggle = (index) => {
//     setSelectedIndex(index);
//     setCheckBoxSeleccionado(
//       index === 0 ? tiposDeEnvio.envioDomicilio : tiposDeEnvio.retiroPersona
//     );
//   };

//   console.log("Nombre del checkbox seleccionado: " + checkBoxSeleccionado);
//   // const direccionDeEnvio = {
//   //   tipoDeEnvio: "Enviar a domicilio",
//   //   direccion: direccionSeleccionada,
//   // };

//   const handleChange = (e) => {
//     // const { name, value } = e.target;

//     const nuevaDireccion = e.target.value;
//     setDireccionSeleccionada(nuevaDireccion);

//     const direccionDeEnvio = {
//       tipoDeEnvio: checkBoxSeleccionado,
//       direccion: nuevaDireccion,
//     };
//     // setDatosCompra((prevData) => ({
//     //   ...prevData,
//     //   // [name]: value,
//     //   direccionDeEnvio,
//     // }));

//     setDatosCompra((prevData) => [
//       ...prevData,
//       // [name]: value,
//       direccionDeEnvio,
//     ]);
//   };
//   console.log(datosCompra);
//   console.log(direccionSeleccionada);

//   return (
//     <Box>
//       <Box mb={4}>
//         <Heading pb={2} fontSize={"lg"}>
//           Opciones de envío
//         </Heading>
//       </Box>
//       <Accordion
//         allowToggle
//         index={selectedIndex}
//         onChange={handleToggle}
//         my={4}
//       >
//         <AccordionItem
//           borderTop={"none"}
//           borderBottom={"1px"}
//           borderColor={"gray.300"}
//         >
//           {({ isExpanded }) => (
//             <>
//               <h2>
//                 <AccordionButton
//                   onClick={handleToggle}
//                   // onClick={() => {
//                   //   handleToggle();
//                   //   // handleChange();
//                   // }}
//                 >
//                   <Checkbox
//                     size={"sm"}
//                     rounded
//                     isChecked={isExpanded}
//                     pointerEvents="none"
//                     // defaultValue={'Enviar a domicilio'}
//                   >
//                     {/* Enviar a domicilio */}
//                     {tiposDeEnvio.envioDomicilio}
//                   </Checkbox>
//                 </AccordionButton>
//               </h2>
//               <AccordionPanel pb={4}>
//                 <Box as="form" my={6}>
//                   <VStack spacing={4} width="100%">
//                     <FormControl isRequired>
//                       <FormLabel m={0}>Dirección</FormLabel>

//                       <Select
//                         variant="flushed"
//                         placeholder="Seleccione su direccion"
//                         onChange={handleChange}
//                       >
//                         {generateTestData.map((direccion) => (
//                           <option key={direccion.id} value={direccion.id}>
//                             {`${direccion.calle} ${direccion.numeroPuerta}, ${direccion.numeroApartamento}, ${direccion.localidad} ${direccion.codigoPostal}, ${direccion.departamento}`}
//                           </option>
//                         ))}
//                         {/* <option value="option1">
//                           Cuareim 1451, S/N, S/N, Centro, Montevideo, 11100
//                         </option>
//                         <option value="option2">
//                           18 de Julio 2506, 9, 306, Centro, Montevideo, 11100
//                         </option> */}
//                       </Select>

//                       <Button size={"sm"} mt={5}>
//                         Agregar nueva dirección
//                       </Button>
//                     </FormControl>
//                     <FormControl>
//                       <FormLabel m={0}>
//                         Comentario{" "}
//                         <Box as="span" fontWeight={"light"}>
//                           (Opcional)
//                         </Box>
//                       </FormLabel>
//                       <Textarea
//                         type="text"
//                         placeholder="Si es necesario puede ingresar un comentario sobre su pedido"
//                         variant="flushed"
//                       />
//                     </FormControl>
//                   </VStack>
//                 </Box>
//               </AccordionPanel>
//             </>
//           )}
//         </AccordionItem>
//         <AccordionItem
//           borderTop={"none"}
//           borderBottom={"1px"}
//           borderColor={"gray.300"}
//         >
//           {({ isExpanded }) => (
//             <>
//               <h2>
//                 <AccordionButton
//                   onClick={() => {
//                     handleToggle();
//                     handleChange();
//                   }}
//                 >
//                   <Checkbox
//                     size={"sm"}
//                     rounded
//                     isChecked={isExpanded}
//                     pointerEvents="none"
//                   >
//                     {tiposDeEnvio.retiroPersona}
//                   </Checkbox>
//                   {/* <AccordionIcon /> */}
//                 </AccordionButton>
//               </h2>
//               <AccordionPanel pb={4}>
//                 <Box as="form" my={6}>
//                   <VStack spacing={4} width="100%">
//                     <FormControl isRequired>
//                       <FormLabel m={0}>
//                         Nombre y apellido de quien retira
//                       </FormLabel>
//                       <Input
//                         type="text"
//                         placeholder="Ingrese nombre y apellido"
//                         variant="flushed"
//                       />
//                     </FormControl>
//                     <FormControl isRequired>
//                       <FormLabel m={0}>Documento de identidad</FormLabel>
//                       <Input
//                         type="text"
//                         placeholder="Ingrese el Documento de identidad"
//                         variant="flushed"
//                       />
//                     </FormControl>
//                     <FormControl>
//                       <FormLabel m={0}>
//                         Comentario{" "}
//                         <Box as="span" fontWeight={"light"}>
//                           (Opcional)
//                         </Box>
//                       </FormLabel>
//                       <Textarea
//                         type="text"
//                         placeholder="Si es necesario puede ingresar un comentario sobre su pedido"
//                         variant="flushed"
//                       />
//                     </FormControl>
//                   </VStack>
//                 </Box>
//                 <Flex
//                   flexDirection={"column"}
//                   gap={1}
//                   fontSize={"sm"}
//                   justifyContent={"start"}
//                 >
//                   <Text fontWeight={"semibold"} fontSize={"md"}>
//                     Lugar de retiro
//                   </Text>
//                   <Text>
//                     <Box as="span" fontWeight={"semibold"}>
//                       Dirección:
//                     </Box>{" "}
//                     Calle 0000, Nro. Puerta, Barrio, Departamento
//                   </Text>
//                   <Text>
//                     <Box as="span" fontWeight={"semibold"}>
//                       Telefono:
//                     </Box>{" "}
//                     099 000 000 | 0000 0000{" "}
//                   </Text>
//                   <Text>
//                     <Box as="span" fontWeight={"semibold"}>
//                       Horario:
//                     </Box>{" "}
//                     Lunes a viernes de 09:00 a 17:00 horas
//                   </Text>
//                   <Text>
//                     <Box as="span" fontWeight={"semibold"}></Box>Esta
//                     información para realizar el retiro se les inviara por mail
//                     una vez confirmada la compra
//                   </Text>
//                 </Flex>
//               </AccordionPanel>
//             </>
//           )}
//         </AccordionItem>
//       </Accordion>
//       <Flex justifyContent={"space-between"}>
//         <Button variant="link" onClick={onBack}>
//           Atrás
//         </Button>
//         <Button colorScheme="teal" onClick={onNext}>
//           Siguiente
//         </Button>
//       </Flex>
//     </Box>
//   );
// };

const ShippingDetails = ({ setDatosCompra, datosCompra, onNext, onBack }) => {
  const [usuario, setUsuario] = useState([]);
  const [direccion, setDireccion] = useState([]);

  const {
    carrito,
    limpiarCarrito,
    actualizarCantidadPorInput,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const datos = await getDatosUsuario();
      setDireccion(datos.direcciones);
    };

    fetchData();
  }, []);

  const tiposDeEnvio = {
    envioDomicilio: "Enviar a domicilio",
    retiroPersona: "Retirar en persona",
  };

  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [checkBoxSeleccionado, setCheckBoxSeleccionado] = useState("");

  const handleToggle = (tipoEnvio) => {
    setCheckBoxSeleccionado(tipoEnvio);
    setDatosCompra((prevData) => {
      return [{ ...prevData }];
    });
  };

  const handleDireccionChange = (e) => {
    const nuevaDireccion = e.target.value;
    setDireccionSeleccionada(nuevaDireccion);

    setDatosCompra(prevData => {
      const tipoEnvio = checkBoxSeleccionado;
      const currentIndex = prevData.findIndex(item => item.tipoDeEnvio === tipoEnvio);
  
      if (currentIndex !== -1) {
        return prevData.map((item, index) => {
          if (index === currentIndex) {
            return { ...item, direccion: nuevaDireccion };
          } else {
            return item; 
          }
        });
      } else {
        return [...prevData, { tipoDeEnvio: tipoEnvio, direccion: nuevaDireccion }];
      }
    });
  };

  const handleRetiroChange = (e) => {
    const { name, value } = e.target;

    setDatosCompra((prevData) => {
      const tipoEnvio = checkBoxSeleccionado;

      const nuevosDatosEnvio = {
        ...prevData[0].datosEnvio, 
        tipoEnvio,
        [name]: value, 
      };

      return [
        {
          ...prevData[0],
          datosEnvio: nuevosDatosEnvio,
        },
      ];
    });
  };

  console.log(usuario)

  console.log(datosCompra);
  return (
    <Box>
      <Box mb={4}>
        <Heading pb={2} fontSize={"lg"}>
          Opciones de envío
        </Heading>
      </Box>
      <Accordion allowToggle my={4}>
        <AccordionItem
          borderTop={"none"}
          borderBottom={"1px"}
          borderColor={"gray.300"}
          //isExpanded={checkBoxSeleccionado === tiposDeEnvio.envioDomicilio}
        >
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton
                  onClick={() => handleToggle(tiposDeEnvio.envioDomicilio)}
                >
                  <Checkbox
                    size={"sm"}
                    rounded
                    // isChecked={
                    //   checkBoxSeleccionado === tiposDeEnvio.envioDomicilio
                    // }
                    isChecked={isExpanded}
                    pointerEvents="none"
                  >
                    {tiposDeEnvio.envioDomicilio}
                  </Checkbox>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box as="form" my={6}>
                  <VStack spacing={4} width="100%">
                    <FormControl isRequired>
                      <FormLabel m={0}>Dirección</FormLabel>
                      <Select
                        variant="flushed"
                        placeholder="Seleccione su dirección"
                        onChange={handleDireccionChange}
                      >
                        {direccion.map((direccion) => (
                          <option key={direccion.id} value={direccion.id}>
                            {`${direccion.calle}, ${direccion.nroPuerta}, ${direccion.ciudad} ${direccion.codigoPostal}, ${direccion.departamento}`}
                          </option>
                        ))}
                      </Select>
                      <Button size={"sm"} mt={5}>
                        Agregar nueva dirección
                      </Button>
                    </FormControl>
                    <FormControl>
                      <FormLabel m={0}>
                        Comentario{" "}
                        <Box as="span" fontWeight={"light"}>
                          (Opcional)
                        </Box>
                      </FormLabel>
                      <Textarea
                        type="text"
                        placeholder="Si es necesario puede ingresar un comentario sobre su pedido"
                        variant="flushed"
                      />
                    </FormControl>
                  </VStack>
                </Box>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
        <AccordionItem
          borderTop={"none"}
          borderBottom={"1px"}
          borderColor={"gray.300"}
          //isExpanded={checkBoxSeleccionado === tiposDeEnvio.retiroPersona}
        >
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton
                  onClick={() => handleToggle(tiposDeEnvio.retiroPersona)}
                >
                  <Checkbox
                    size={"sm"}
                    rounded
                    // isChecked={
                    //   checkBoxSeleccionado === tiposDeEnvio.retiroPersona
                    // }
                    isChecked={isExpanded}
                    pointerEvents="none"
                  >
                    {tiposDeEnvio.retiroPersona}
                  </Checkbox>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box as="form" my={6}>
                  <VStack spacing={4} width="100%">
                    <FormControl isRequired>
                      <FormLabel m={0}>
                        Nombre y apellido de quien retira
                      </FormLabel>
                      <Input
                        type="text"
                        name="nombreApellido"
                        placeholder="Ingrese nombre y apellido"
                        variant="flushed"
                        onChange={handleRetiroChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel m={0}>Documento de identidad</FormLabel>
                      <Input
                        type="text"
                        name="documento"
                        placeholder="Ingrese el Documento de identidad"
                        variant="flushed"
                        onChange={handleRetiroChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel m={0}>
                        Comentario{" "}
                        <Box as="span" fontWeight={"light"}>
                          (Opcional)
                        </Box>
                      </FormLabel>
                      <Textarea
                        type="text"
                        name="comentario"
                        placeholder="Si es necesario puede ingresar un comentario sobre su pedido"
                        variant="flushed"
                        onChange={handleRetiroChange}
                      />
                    </FormControl>
                  </VStack>
                </Box>
                <Flex
                  flexDirection={"column"}
                  gap={1}
                  fontSize={"sm"}
                  justifyContent={"start"}
                >
                  <Text fontWeight={"semibold"} fontSize={"md"}>
                    Lugar de retiro
                  </Text>
                  <Text>
                    <Box as="span" fontWeight={"semibold"}>
                      Dirección:
                    </Box>{" "}
                    Calle 0000, Nro. Puerta, Barrio, Departamento
                  </Text>
                  <Text>
                    <Box as="span" fontWeight={"semibold"}>
                      Telefono:
                    </Box>{" "}
                    099 000 000 | 0000 0000
                  </Text>
                  <Text>
                    <Box as="span" fontWeight={"semibold"}>
                      Horario:
                    </Box>{" "}
                    Lunes a viernes de 09:00 a 17:00 horas
                  </Text>
                  <Text>
                    <Box as="span" fontWeight={"semibold"}></Box>Esta
                    información para realizar el retiro se les enviara por mail
                    una vez confirmada la compra
                  </Text>
                </Flex>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
      <Flex justifyContent={"space-between"}>
        <Button variant="link" onClick={onBack}>
          Atrás
        </Button>
        <Button colorScheme="teal" onClick={onNext}>
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
};

const Payment = ({ datosCompra, onBack }) => {
  console.log(Array.isArray(datosCompra));

  const navigate = useNavigate();
  const {
    carrito,
    limpiarCarrito,
    actualizarCantidadPorInput,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
  } = useCart();

  const carritoTotalPagar = useMemo(
    () =>
      carrito
        .reduce((total, item) => total + item.cantidad * item.price, 0)
        .toFixed(2),
    [carrito]
  );
  const carritoCantidadProductos = useMemo(
    () => carrito.reduce((total, item) => total + item.cantidad, 0),
    [carrito]
  );

  return (
    <>
      <Box mb={4}>
        <Heading pb={2} fontSize={"lg"}>
          Realizar el pago
        </Heading>
      </Box>
      <Box></Box>
      <Box>
        <Text fontSize={"lg"}>Tu pedido</Text>
      </Box>
     
      <Grid my={4}>
        <GridItem
          colSpan={5}
          border={"1px solid"}
          borderColor={"rgba(51, 51, 51, 0.2)"}
          borderRadius={8}
          p={4}
          height="fit-content"
        >
          <Box mb={4}>
            <Heading py={2} fontSize={"lg"}>
              Resumen
            </Heading>
          </Box>

          {datosCompra.map((datos) => (
            <>
              <h4>Datos de facturación</h4>
              <p>{datos.usuario.nombre}</p>
              <p>{datos.usuario.apellido}</p>
              <p>{datos.usuario.correoElectronico}</p>
              <p>{datos.usuario.telefono}</p>
              <h4>Datos de envío</h4>
              <p>{datos.tipoEnvio}</p>
              {datos.tipoEnvio === "Enviar a domicilio" ? (
                generateTestData.map((direccion) =>
                  direccion.id === datos.direccionId ? (
                    <p>{`${direccion.calle} ${direccion.numeroPuerta} - ${direccion.localidad} ${direccion.codigoPostal} - ${direccion.departamento} `}</p>
                  ) : null
                )
              ) : (
                <>
                  <p>{datos.nombreApellido}</p>
                  <p>{datos.documento}</p>
                  <p>{datos.comentario}</p>
                </>
              )}
            </>
          ))}
          <h4>Deatlle de la orden</h4>
          <Box>
            {carrito.map((producto) => (
              <Card
                key={producto.id}
                borderBottom="1px"
                borderColor={"gray.200"}
                borderRadius={0}
                boxShadow="none"
                mb={4}
              >
                <CardBody
                  p={3}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  gap={3}
                >
                  <Box
                    boxSize={"40px"}
                    display={"flex"}
                    justifyContent={"center"}
                    w={"auto"}
                  >
                    <Image
                      src={producto.image}
                      alt={`Imagen del producto ${producto.title}`}
                      objectFit={"contain"}
                      w={"40px"}
                      h={"40px"}
                    />
                  </Box>
                  <Box w={"full"} px={{ base: 3, sm: 5 }}>
                    <Box mb={6} h={"32px"}>
                      <Heading
                        as="h3"
                        fontSize={{ base: "xs", sm: "md" }}
                        fontWeight="bold"
                      >
                        {producto.title}
                      </Heading>
                    </Box>
                    <Stack
                      justifyContent="space-between"
                      alignItems={"center"}
                      direction="row"
                      spacing={{ base: 2, sm: 0 }}
                    >
                      <Flex gap={"3"}>
                        <Text>Cantidad: {producto.cantidad}</Text>
                      </Flex>
                      <Text color="blue.600">$ {producto.price}</Text>
                    </Stack>
                  </Box>
                </CardBody>
              </Card>
            ))}

            <Button variant={"link"} size={'sm'} onClick={() => navigate("/micarrito")}>
              Modificar algún producto
            </Button>
          </Box>
          <p>{`Cantidad de prodcutos ${carritoCantidadProductos}`}</p>
          <p>{`Total a pagar ${carritoTotalPagar}`}</p>
          {/* <PaymentButton/> */}
          {/* </Flex> */}
        </GridItem>
      </Grid>
      <Box my={6}>
        <Text>
          Una vez haga clic en el botón PAGAR será redirigido a la página de
          Mercado Pago para poder realizar el pago de forma segura.
        </Text>
      </Box>
      <Flex justifyContent={"space-between"}>
        <Button variant="link" onClick={onBack}>
          Atrás
        </Button>
        {/* <Button colorScheme="teal">Pagar</Button> */}
        <PaymentButton />
      </Flex>
    </>
  );
};

export { BillingDetails, ShippingDetails, Payment };

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Input,
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
  FormHelperText,
  FormErrorMessage,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useCart } from "../../hooks/useCart";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { verificarDocumentoDeIdentidad } from "../../js/validaciones/documentoDeIdentidad";
import AgregarDireccion from "../usuario/direcciones/AgregarDireccion";
import { API_URL, getToken } from "../../js/config";
import { obtenerDatosNegocio } from "../../js/api/datos-negocio/obtenerDatosDelNegocio";
import { obtenerDatosDelNegocioPorId } from "../../js/api/datos-negocio/obtenerDatosDelNegocioPorId";
import { useUsuario } from "../../hooks/useUsuario";

const DatosEnvio = ({
  datosFacturacion,
  setDatosEnvio,
  datosEnvio,
  onNext,
  onBack,
  setPreferenceId,
}) => {
  const { usuario } = useUsuario();
  const [erroresDatos, setErroresDatos] = useState({
    nombreApellido: "",
    numeroDocumento: "",
    idDireccion: "",
    tipoEnvio: "",
    idLugarRetiro: "",
  });
  const [direcciones, setDirecciones] = useState([]);
  const [datosNegocio, setDatosNegocio] = useState([]);
  const [datosNegocioPorId, setDatosNegocioPorId] = useState({});
  const [departamentoMontevideo, setDepartamentoMontevideo] = useState("");

  const [checkBoxSeleccionado, setCheckBoxSeleccionado] = useState("");
  const toast = useToast();
  const [datos, setDatos] = useState({});

  const [selectedIndex, setSelectedIndex] = useState();
  const [loading, setLoading] = useState(false); // Estado para manejar la carga


  useEffect(() => {
    const initialEnvio =
      datosEnvio.tipoEnvio === "domicilio"
        ? {
            tipoEnvio: "domicilio",
            idDireccion: Number(datosEnvio.idDireccion) || "",
            comentario: datosEnvio.comentarioEnvio || "",
          }
        : {
            tipoEnvio: "retiro",
            nombreApellido: datosEnvio.nombreApellido || "",
            tipoDocumento: "CI",
            numeroDocumento: datosEnvio.numeroDocumento || "",
            comentario: datosEnvio.comentarioRetiro || "",
            idLugarRetiro: datosEnvio.idLugarRetiro || "",
          };

    if (datosEnvio.tipoEnvio === "domicilio") {
      setSelectedIndex(0);
    } else if (datosEnvio.tipoEnvio === "retiro") {
      setSelectedIndex(1);
    }

    setDatos(initialEnvio);
    setCheckBoxSeleccionado(datosEnvio.tipoEnvio);

    setDirecciones(usuario.direcciones);
    fetchDatosNegocio();
    initMercadoPago(publicKey);
  }, []);

  const tiposDeEnvio = {
    envioDomicilio: "domicilio",
    retiroPersona: "retiro",
  };

  const handleToggle = (e) => {
    const { name, value } = e.target;
    if (name === "domicilio") {
      setSelectedIndex(0);
    } else if (name === "retiro") {
      setSelectedIndex(1);
    }
    setCheckBoxSeleccionado(name);
    if (datosEnvio.tipoEnvio != name) {
      setDatosEnvio({
        tipoEnvio: name,
      });
    }else{
      setDatosEnvio({
        tipoEnvio: "",
      });
    }
  };

  const handleDireccionChange = (e) => {
    const { name, value } = e.target;

    setDatosEnvio((prevDatos) => ({
      ...prevDatos,
      tipoEnvio: checkBoxSeleccionado,
      [name]: value,
    }));

    if (value.trim() === "") {
      setErroresDatos((prev) => ({
        ...prev,
        [name]: "Este campo es requerido.",
      }));
    } else {
      setErroresDatos((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRetiroChange = (e) => {
    const { name, value } = e.target;
    setDatosEnvio((prevDatos) => ({
      ...prevDatos,
      tipoEnvio: checkBoxSeleccionado,
      [name]: value,
    }));

    if (value.trim() === "") {
      setErroresDatos((prev) => ({
        ...prev,
        [name]: "Este campo es requerido.",
      }));
    } else {
      setErroresDatos((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLugarRetiroChange = (e) => {
    const { value } = e.target;
    fetchDatosNegocioPorId(Number(value));
    handleRetiroChange(e);
  };

  const { carrito } = useCart();

  const datosProductosMercadoPago = {
    productos: carrito.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      precioUnitario: item.precio,
      cantidad: item.cantidad,
    })),
    cliente: {
      idCliente: datosFacturacion.idCliente,
      nombre: datosFacturacion.nombre,
      apellido: datosFacturacion.apellido,
      email: datosFacturacion.email,
      numeroTelefono: datosFacturacion.numeroTelefono,
      documentoIdentidad: datosFacturacion.documentoIdentidad,
      razonSocial: datosFacturacion.checkFacturaRut
        ? datosFacturacion.razonSocial
        : "",
      rut: datosFacturacion.checkFacturaRut ? datosFacturacion.rut : "",
    },
    opcionEnvio: datosEnvio.tipoEnvio, // 'domicilio' o 'retiro'
    guardarDatosExtras: datosFacturacion.guardarNuevosDatos,
    envioDomicilio:
      datosEnvio.tipoEnvio === "domicilio"
        ? {
            idDireccion: Number(datosEnvio.idDireccion),
            comentario: datosEnvio.comentarioEnvio || "",
          }
        : {
            idDireccion: 0,
            comentario: "",
          },
    retiroCompra:
      datosEnvio.tipoEnvio === "retiro"
        ? {
            nombreApellido: datosEnvio.nombreApellido,
            tipoDocumento: "CI",
            numeroDocumento: datosEnvio.numeroDocumento,
            comentario: datosEnvio.comentarioRetiro || "",
            idDatosNegocio: datosEnvio.idLugarRetiro,
          }
        : {
            nombreApellido: "",
            tipoDocumento: "",
            numeroDocumento: "",
            comentario: "",
            idDatosNegocio: "",
          },
  };

  const publicKey = "APP_USR-a85ea354-c55e-4478-93ab-8cc1e1cedb6c";

  const fetchDatosNegocio = async () => {
    try {
      const datos = await obtenerDatosNegocio();
      setDatosNegocio(datos);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDatosNegocioPorId = async (negocioId) => {
    try {
      const datos = await obtenerDatosDelNegocioPorId(negocioId);
      setDatosNegocioPorId(datos);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePayment = async () => {
    setPreferenceId(0)
    try {
      const response = await fetch(`${API_URL}MercadoPago/create_preference`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosProductosMercadoPago),
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          setPreferenceId(data.res.id);
          return data.res.id;
        } else {
          throw new Error(data.message || "Error en la respuesta del servidor");
        }
      } else {
        const error = await response.text();
        throw new Error(error || "Respuesta no válida del servidor");
      }
    } catch (e) {
      console.error("Error:", e);
      toast({
        title: "Hubo un error",
        description: e.message || "Error desconocido",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleNext = async () => {
    setErroresDatos({
      nombreApellido: "",
      numeroDocumento: "",
      idDireccion: "",
      tipoEnvio: "",
    });

    if (!datosEnvio.tipoEnvio) {
      setErroresDatos((prev) => ({
        ...prev,
        tipoEnvio: "Debe seleccionar un tipo de envio",
      }));
      return;
    }

    try {
      setLoading(true)
      const { nombreApellido, numeroDocumento, tipoEnvio, idDireccion } =
        datosEnvio;

      if (datosEnvio.tipoEnvio === "domicilio") {
        if (!datosEnvio.idDireccion) {
          setErroresDatos((prev) => ({
            ...prev,
            idDireccion: "Debe seleccionar una dirección.",
          }));
          return;
        }
      }

      if (datosEnvio.tipoEnvio === "retiro") {
        if (!nombreApellido) {
          setErroresDatos((prev) => ({
            ...prev,
            nombreApellido: "El nombre y apellido es requerido.",
          }));
          return;
        }

        if (!datosEnvio.idLugarRetiro) {
          setErroresDatos((prev) => ({
            ...prev,
            idLugarRetiro: "Debe seleccionar una dirección de retiro.",
          }));
          return;
        }

        if (!numeroDocumento) {
          setErroresDatos((prev) => ({
            ...prev,
            numeroDocumento: "El número de cédula es requerido.",
          }));
          return;
        } else if (!verificarDocumentoDeIdentidad(numeroDocumento)) {
          setErroresDatos((prev) => ({
            ...prev,
            numeroDocumento: "El número de cédula ingresado es incorrecto.",
          }));
          return;
        }
      }
      const id = await handlePayment();
      if (id) {
        onNext(id); // Pasar el id de preferencia actualizado
      }
    } catch (e) {
      setErroresDatos((prev) => ({
        ...prev,
        numeroDocumento: e.message || "Error desconocido",
      }));
    }
    finally{
      setLoading(false)
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleDireccionAgregada = (nuevaDireccion) => {
    setDirecciones((prevDirecciones) => [...prevDirecciones, nuevaDireccion]);
  };

  return (
    <>
      <Box mb={4}>
        <Heading pb={2} fontSize={"lg"}>
          Opciones de envío
        </Heading>
      </Box>
      {erroresDatos.tipoEnvio && (
        <Text color="red.500" mb={4}>
          {erroresDatos.tipoEnvio}
        </Text>
      )}
      <Box p={6} rounded={8} boxShadow="lg" height="fit-content">
        <Accordion
          index={selectedIndex}
          onChange={(index) => setSelectedIndex(index)}
          allowToggle
          my={4}
        >
          <AccordionItem
            borderTop={"none"}
            borderBottom={"1px"}
            borderColor={"gray.300"}
          >
            {({ isExpanded }) => (
              <>
                <Heading>
                  <AccordionButton
                    px={0}
                    name="domicilio"
                    value={datos.envioDomicilio}
                    onClick={(e) => handleToggle(e)}
                  >
                    <Checkbox
                      size={"sm"}
                      rounded
                      isChecked={isExpanded}
                      pointerEvents="none"
                      fontWeight={600}
                    >
                      Enviar a domicilio
                    </Checkbox>
                  </AccordionButton>
                </Heading>
                <AccordionPanel pb={4}>
                  <Box as="form" my={6}>
                    <VStack spacing={4} width="100%">
                      <FormControl
                        isRequired
                        isInvalid={erroresDatos.idDireccion}
                      >
                        <FormLabel fontWeight={600} m={0}>
                          Dirección
                        </FormLabel>
                        <Select
                          variant="flushed"
                          placeholder="Seleccione su dirección"
                          name="idDireccion"
                          value={datosEnvio.idDireccion}
                          onChange={handleDireccionChange}
                        >
                          {direcciones.map((direccion) => {
                            if (
                              direccion.departamento.toLowerCase() ===
                              "montevideo"
                            ) {
                              setDepartamentoMontevideo(true);
                            }

                            const direccionCompleta = `${direccion.calle} ${
                              direccion.nroPuerta
                            }, ${
                              direccion.nroApartamento
                                ? direccion.nroApartamento
                                : "S/N"
                            }, ${direccion.ciudad} ${direccion.codigoPostal}, ${
                              direccion.departamento
                            }`;

                            return (
                              <option key={direccion.id} value={direccion.id}>
                                {direccionCompleta}
                              </option>
                            );
                          })}
                        </Select>
                        <FormHelperText>
                          El costo de envío dentro de Montevideo es de $200,
                          para el interior se le contactará por los medios
                          proporcionados para informarles el costo de envío y se
                          paga al momento de recibirlo.
                        </FormHelperText>
                        <FormErrorMessage>
                          {erroresDatos.idDireccion}
                        </FormErrorMessage>
                        <Button size={"sm"} mt={5} onClick={onOpen}>
                          Agregar nueva dirección
                        </Button>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight={600} m={0}>
                          Comentario{" "}
                          <Box as="span" color={"gray"} fontWeight={"light"}>
                            (Opcional)
                          </Box>
                        </FormLabel>
                        <Textarea
                          type="text"
                          name="comentarioEnvio"
                          value={datosEnvio.comentarioEnvio}
                          placeholder="Si es necesario puede ingresar un comentario sobre su pedido"
                          variant="flushed"
                          onChange={handleDireccionChange}
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
          >
            {({ isExpanded }) => (
              <>
                <Heading>
                  <AccordionButton
                    px={0}
                    name="retiro"
      
                    value={datos.retiroPersona}
                    onClick={(e) => handleToggle(e)}
                  >
                    <Checkbox
                      size={"sm"}
                      rounded
                      isChecked={isExpanded}
                      pointerEvents="none"
                      fontWeight={600}
                    >
                      Retirar en persona
                    </Checkbox>
                  </AccordionButton>
                </Heading>
                <AccordionPanel pb={4}>
                  <Box as="form" my={6}>
                    <VStack spacing={4} width="100%">
                      <FormControl
                        isRequired
                        isInvalid={erroresDatos.nombreApellido}
                      >
                        <FormLabel fontWeight={600} m={0}>
                          Nombre y apellido de quien retira
                        </FormLabel>
                        <Input
                          type="text"
                          name="nombreApellido"
                          placeholder="Ingrese nombre y apellido"
                          variant="flushed"
                          value={datosEnvio.nombreApellido || ""}
                          onChange={handleRetiroChange}
                        />
                        <FormErrorMessage>
                          {erroresDatos.nombreApellido}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isRequired
                        isInvalid={erroresDatos.numeroDocumento}
                      >
                        <FormLabel fontWeight={600} m={0}>
                          Documento de identidad
                        </FormLabel>
                        <Input
                          maxLength={8}
                          type="text"
                          name="numeroDocumento"
                          placeholder="Ingrese el Documento de identidad"
                          variant="flushed"
                          value={datosEnvio.numeroDocumento || ""}
                          onChange={handleRetiroChange}
                        />
                        {!erroresDatos.numeroDocumento ? (
                          <FormHelperText>
                            No incluir puntos ni guiones.
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            {erroresDatos.numeroDocumento}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <FormControl
                        isRequired
                        isInvalid={erroresDatos.idLugarRetiro}
                      >
                        <FormLabel fontWeight={600} m={0}>
                          Lugar de retiro
                        </FormLabel>
                        <Select
                          variant="flushed"
                          placeholder="Seleccionar el lugar de retiro"
                          name="idLugarRetiro"
                          value={datosEnvio.idLugarRetiro || ""}
                          onChange={handleLugarRetiroChange}
                        >
                          {datosNegocio.map((dato) => (
                            <option key={dato.id} value={dato.id}>
                              {dato.nombre}
                            </option>
                          ))}
                        </Select>
                        <FormErrorMessage>
                          {erroresDatos.idLugarRetiro}
                        </FormErrorMessage>
                      </FormControl>
                      {datosNegocioPorId &&
                        Object.keys(datosNegocioPorId).length > 0 && (
                          <Flex
                            flexDirection={"column"}
                            gap={1}
                            fontSize={"sm"}
                            justifyContent={"start"}
                            w={"100%"}
                          >
                            <Text fontWeight={"semibold"} fontSize={"md"}>
                              Lugar de retiro en {datosNegocioPorId.nombre}
                            </Text>
                            <Text>
                              <Box as="span" fontWeight={"semibold"}>
                                Dirección:
                              </Box>{" "}
                              {datosNegocioPorId.direccion.calle}{" "}
                              {datosNegocioPorId.direccion.nroPuerta},{" "}
                              {datosNegocioPorId.direccion.nroApartamento}
                              {datosNegocioPorId.direccion.ciudad}{" "}
                              {datosNegocioPorId.direccion.codigoPostal},{" "}
                              {datosNegocioPorId.direccion.departamento}
                            </Text>
                            <Text>
                              <Box as="span" fontWeight={"semibold"}>
                                Telefono:
                              </Box>{" "}
                              {datosNegocioPorId.telefono}
                            </Text>
                            <Text>
                              <Box as="span" fontWeight={"semibold"}>
                                Horario:
                              </Box>{" "}
                              {datosNegocioPorId.horario}
                            </Text>
                            <Text>
                              <Box as="span" fontWeight={"semibold"}></Box>Esta
                              información de retiro se les enviara por mail una
                              vez confirmada la compra
                            </Text>
                          </Flex>
                        )}
                      <FormControl>
                        <FormLabel fontWeight={600} m={0}>
                          Comentario{" "}
                          <Box as="span" color={"gray"} fontWeight={"light"}>
                            (Opcional)
                          </Box>
                        </FormLabel>
                        <Textarea
                          type="text"
                          name="comentarioRetiro"
                          placeholder="Si es necesario puede ingresar un comentario sobre su pedido"
                          variant="flushed"
                          value={datosEnvio.comentarioRetiro || ""}
                          onChange={handleRetiroChange}
                        />
                      </FormControl>
                    </VStack>
                  </Box>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
        <Flex justifyContent={"space-between"}>
          <Button
            size={{ base: "xs", md: "sm" }}
            variant="link"
            color={"primary"}
            fontWeight={600}
            onClick={onBack}
          >
            Atrás
          </Button>
          <Button
          isLoading={loading}
            variant={"solid"}
            color={"botonColor"}
            bg={"botonBg"}
            _hover={{
              transition: "all .5s ease-out",
              border: "1px solid",
              borderColor: "botonBg",
              bg: "botonColor",
              color: "botonBg",
            }}
            size={{ base: "sm" }}
            onClick={handleNext}
          >
            Siguiente
          </Button>
        </Flex>
      </Box>
      <AgregarDireccion
        isOpen={isOpen}
        onClose={onClose}
        idCliente={usuario.id}
        onDireccionAgregada={handleDireccionAgregada}
      />
    </>
  );
};

export default DatosEnvio;

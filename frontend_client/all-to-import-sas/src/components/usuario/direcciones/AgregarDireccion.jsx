import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  Flex,
  Spinner,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormHelperText,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { API_URL, getToken } from "../../../js/config";

const departamentos = [
  "Artigas",
  "Canelones",
  "Cerro Largo",
  "Colonia",
  "Durazno",
  "Flores",
  "Florida",
  "Lavalleja",
  "Maldonado",
  "Montevideo",
  "Paysandú",
  "Rio Negro",
  "Rivera",
  "Rocha",
  "Salto",
  "San José",
  "Soriano",
  "Tacuarembó",
  "Treinta y Tres",
];

const barriosMontevideo = [
  {
    departamento: "MONTEVIDEO",
    localidades: [
      {
        localidad: "ABAYUBA",
        codigo_postal: "12500",
      },
      {
        localidad: "AGUADA",
        codigo_postal: "11800",
      },
      {
        localidad: "AIRES PUROS",
        codigo_postal: "12200",
      },
      {
        localidad: "ATAHUAPA",
        codigo_postal: "12500",
      },
      {
        localidad: "BELLA ITALIA",
        codigo_postal: "11500",
      },
      {
        localidad: "BELLA VISTA",
        codigo_postal: "11700",
      },
      {
        localidad: "BUCEO",
        codigo_postal: "11400",
      },
      {
        localidad: "CARRASCO",
        codigo_postal: "11500",
      },
      {
        localidad: "CARRASCO NORTE",
        codigo_postal: "11600",
      },
      {
        localidad: "CASABO",
        codigo_postal: "12800",
      },
      {
        localidad: "CASAVALLE",
        codigo_postal: "12300",
      },
      {
        localidad: "CENTRO",
        codigo_postal: "11100",
      },
      {
        localidad: "CERRO",
        codigo_postal: "12900",
      },
      {
        localidad: "CIUDAD VIEJA",
        codigo_postal: "11000",
      },
      {
        localidad: "COLON",
        codigo_postal: "12900",
      },
      {
        localidad: "CORDON",
        codigo_postal: "11200",
      },
      {
        localidad: "JACINTO VERA",
        codigo_postal: "11600",
      },
      {
        localidad: "LA BLANQUEADA",
        codigo_postal: "11600",
      },
      {
        localidad: "LA COMERCIAL",
        codigo_postal: "11600",
      },
      {
        localidad: "LA TEJA",
        codigo_postal: "12600",
      },
      {
        localidad: "LARRAÑAGA",
        codigo_postal: "11500",
      },
      {
        localidad: "MALVIN",
        codigo_postal: "11400",
      },
      {
        localidad: "MANGA",
        codigo_postal: "12500",
      },
      {
        localidad: "MERCEDES",
        codigo_postal: "11000",
      },
      {
        localidad: "PARK WAY",
        codigo_postal: "11500",
      },
      {
        localidad: "PARQUE BATTLE",
        codigo_postal: "11600",
      },
      {
        localidad: "PARQUE RODO",
        codigo_postal: "11200",
      },
      {
        localidad: "PEÑAROL",
        codigo_postal: "12500",
      },
      {
        localidad: "PIRIA",
        codigo_postal: "11100",
      },
      {
        localidad: "PUNTA CARRETAS",
        codigo_postal: "11300",
      },
      {
        localidad: "PUNTA GORDA",
        codigo_postal: "11400",
      },
      {
        localidad: "REDUCTO",
        codigo_postal: "11800",
      },
      {
        localidad: "SAYAGO",
        codigo_postal: "12400",
      },
      {
        localidad: "UNION",
        codigo_postal: "11700",
      },
      {
        localidad: "VILLA ESPAÑOLA",
        codigo_postal: "12200",
      },
      {
        localidad: "VILLA GARCIA",
        codigo_postal: "12100",
      },
      {
        localidad: "ZONA AMERICANA",
        codigo_postal: "11300",
      },
    ],
  },
];

const eliminarTildes = (texto) => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Mapeo de departamentos con y sin tildes
const departamentosMap = departamentos.reduce((acc, departamento) => {
  acc[departamento] = eliminarTildes(departamento);
  return acc;
}, {});

const obtenerDepartamentos = async (departamento) => {
  const url = `https://direcciones.ide.uy/api/v0/geocode/localidades?alias=false&departamento=${encodeURIComponent(
    departamento
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching localidades:", error);
    return [];
  }
};

const validarDatos = (datos) => {
  const { departamento, ciudad, calle, nroPuerta, codigoPostal } = datos;

  const errores = {};

  if (!departamento) errores.departamento = "El departamento es requerido.";
  if (!ciudad) errores.ciudad = "La ciudad es requerida.";
  if (!calle) errores.calle = "La calle es requerida.";
  if (!nroPuerta)
    errores.nroPuerta =
      "El número de puerta es requerido. Sino cuenta con número de puerta ingrese S/N.";
  if (!codigoPostal) {
    errores.codigoPostal = "El código postal es requerido.";
  } else if (isNaN(codigoPostal)) {
    errores.codigoPostal = "El código postal debe ser un número.";
  } else if (codigoPostal.length > 5) {
    errores.codigoPostal = "El código postal debe tener solo 5 números.";
  }

  return errores;
};

const AgregarDireccion = ({
  idCliente,
  isOpen,
  onClose,
  onDireccionAgregada,
}) => {
  const toast = useToast();
  const initialFocusRef = useRef();

  const [departamento, setDepartamento] = useState("");
  const [ciudades, setCiudades] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [calle, setCalle] = useState("");
  const [nroPuerta, setNroPuerta] = useState("");
  const [nroApartamento, setNroApartamento] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [erroresDatos, setErroresDatos] = useState({});

  useEffect(() => {
    if (departamento) {
      obtenerCiudades();
    }
  }, [departamento]);

  const obtenerCiudades = async () => {
    const departamentoSinTilde = departamentosMap[departamento];
    const datos = await obtenerDepartamentos(departamentoSinTilde);
    setCiudades(datos);
  };

  const handleDepartamentoChange = (e) => {
    setCodigoPostal("");
    setDepartamento(e.target.value);
  };

  const handleCiudadChange = (e) => {
    setCodigoPostal("");
    const c = ciudades.find((ciudad) => ciudad.id === Number(e.target.value));
    setCiudad(c);
    setCodigoPostal(String(c.codigoPostal));
  };

  const handleCodigoPostalChange = (e) => {
    setCodigoPostal(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const direccion = {
        id: 0,
        departamento,
        ciudad: ciudad.nombre,
        calle,
        nroPuerta,
        nroApartamento,
        codigoPostal,
        comentario,
      };

      const errores = validarDatos(direccion);

      if (Object.keys(errores).length > 0) {
        setErroresDatos(errores);
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${API_URL}Usuario/${idCliente}/direcciones`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(direccion),
        }
      );
      if (response.ok) {
        const nuevaDireccion = await response.json();
        onDireccionAgregada(nuevaDireccion);
        onClose();
      }
      onClose();
      toast({
        title: "Dirección agregada",
        description: "Tu nueva dirección ha sido registrada con éxito",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (e) {
      console.error("Error:", e);
      toast({
        title: "Hubo un error",
        description: e.message || "Error al guardar la nueva dirección.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
      setDepartamento("");
      setCiudad("");
      setCalle("");
      setCodigoPostal("");
      setNroApartamento("");
      setNroPuerta("");
      setComentario("");
    }
  };
  const handleClose = () => {
    setErroresDatos({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={{ base: "95%", lg: "100%" }}>
        <ModalHeader mx="auto">
          {loading ? "Registrando la nueva dirección" : "Agregar dirección"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Flex justifyContent="center" alignItems="center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Flex>
          ) : (
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={4} width="100%">
                <FormControl isInvalid={erroresDatos.departamento}>
                  <FormLabel fontWeight={600} m={0}>
                    Departamento{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Select
                    variant={"flushed"}
                    name="departamento"
                    placeholder="Seleccionar departamento"
                    onChange={handleDepartamentoChange}
                  >
                    {departamentos.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </Select>
                  {erroresDatos.departamento && (
                    <FormErrorMessage>
                      {erroresDatos.departamento}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.ciudad}>
                  <FormLabel fontWeight={600} m={0}>
                    Ciudad{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Select
                    variant={"flushed"}
                    name="ciudad"
                    placeholder="Seleccionar ciudad"
                    onChange={handleCiudadChange}
                  >
                    {ciudades.map((ciudad) => (
                      <option key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
                      </option>
                    ))}
                  </Select>
                  {erroresDatos.ciudad && (
                    <FormErrorMessage>{erroresDatos.ciudad}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.codigoPostal}>
                  <FormLabel fontWeight={600} m={0}>
                    Código Postal{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    variant={"flushed"}
                    name="codigoPostal"
                    type="text"
                    maxLength="5"
                    placeholder="Ingresar código postal"
                    value={codigoPostal}
                    onChange={handleCodigoPostalChange}
                  />
                  {erroresDatos.codigoPostal && (
                    <FormErrorMessage>
                      {erroresDatos.codigoPostal}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.calle}>
                  <FormLabel fontWeight={600} m={0}>
                    Calle{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    variant={"flushed"}
                    name="calle"
                    placeholder="Calle"
                    onChange={(e) => setCalle(e.target.value)}
                  />
                  <FormHelperText>
                    Ejemplo: Calle a esq. Calle B (Si corresponde)
                  </FormHelperText>
                  {erroresDatos.calle && (
                    <FormErrorMessage>{erroresDatos.calle}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={erroresDatos.nroPuerta}>
                  <FormLabel fontWeight={600} m={0}>
                    Número de Puerta{" "}
                    <Text as={"span"} color={"red.600"}>
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    variant={"flushed"}
                    name="nroPuerta"
                    placeholder="Número de Puerta"
                    onChange={(e) => setNroPuerta(e.target.value)}
                  />
                  <FormHelperText>
                    Sino cuenta con número de puerta ingrese S/N
                  </FormHelperText>
                  {erroresDatos.nroPuerta && (
                    <FormErrorMessage>
                      {erroresDatos.nroPuerta}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight={600} m={0}>
                    Número de Apartamento{" "}
                    <Box as="span" fontWeight={300}>
                      (Opcional)
                    </Box>
                  </FormLabel>
                  <Input
                    variant={"flushed"}
                    placeholder="Número de Apartamento"
                    onChange={(e) => setNroApartamento(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight={600} m={0}>
                    Comentario{" "}
                    <Box as="span" fontWeight={300}>
                      (Opcional)
                    </Box>
                  </FormLabel>
                  <Textarea
                    variant={"flushed"}
                    placeholder="Comentario"
                    onChange={(e) => setComentario(e.target.value)}
                  />
                </FormControl>
                <Flex w={"full"} justifyContent={"end"} gap={8}>
                  <Button
                    variant="ghost"
                    size={{ base: "sm" }}
                    color={"primary"}
                    fontWeight={600}
                    onClick={handleClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant={"solid"}
                    color={"botonColor"}
                    bg={"botonBg"}
                    border="1px solid"
                    borderColor="transparent"
                    _hover={{
                      transition: "all .5s ease-out",
                      border: "1px solid",
                      borderColor: "botonBg",
                      bg: "botonColor",
                      color: "botonBg",
                    }}
                    size={{ base: "sm" }}
                  >
                    Guardar
                  </Button>
                </Flex>
              </VStack>
            </Box>
          )}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AgregarDireccion;

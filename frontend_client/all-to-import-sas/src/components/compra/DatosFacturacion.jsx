import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Flex,
  Switch,
  FormHelperText,
  FormErrorMessage,
  Checkbox,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { verificarDocumentoDeIdentidad } from "../../js/validaciones/documentoDeIdentidad";
import { verificarNumeroTelefonico } from "../../js/validaciones/numeroTelefonico";
import { AnimatePresence, motion } from "framer-motion";
import { useUsuario } from "../../hooks/useUsuario";
import { buscarSiExisteDocumento } from "../../js/api/usuarios/cliente/buscarSiExisteDocumento";
const DatosFacturacion = ({
  datosFacturacion,
  setDatosFacturacion,
  onNext,
}) => {
  const navigate = useNavigate();
  const [animarFacturaRut, setAnimarFacturaRut] = useState(false);
  const { usuario } = useUsuario();
  const [erroresDatos, setErroresDatos] = useState({
    numeroTelefono: "",
    documentoIdentidad: "",
    rut: "",
    razonSocial: "",
  });
  const [loading, setLoading] = useState(false);
  const {
    id,
    nombre,
    apellido,
    correoElectronico,
    telefono,
    documentoIdentidad,
    razonSocial,
    rut,
  } = usuario;

  useEffect(() => {
    if (usuario) {
      setDatosFacturacion({
        idCliente: id || "",
        nombre: nombre || "",
        apellido: apellido || "",
        email: correoElectronico || "",
        numeroTelefono: telefono || "",
        documentoIdentidad: documentoIdentidad || "",
        razonSocial: razonSocial || "",
        rut: rut || "",
        guardarNuevosDatos: datosFacturacion.guardarNuevosDatos || false,
        checkFacturaRut: datosFacturacion.checkFacturaRut || false,
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const valor = type === "checkbox" ? checked : value;

    setDatosFacturacion((prevData) => ({
      ...prevData,
      [name]: valor,
    }));
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setDatosFacturacion((prevData) => ({
      ...prevData,
      checkFacturaRut: isChecked,
    }));

    setAnimarFacturaRut(!animarFacturaRut);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const { numeroTelefono, documentoIdentidad, razonSocial, rut } =
        datosFacturacion;
      setErroresDatos({
        numeroTelefono: "",
        documentoIdentidad: "",
        razonSocial: "",
        rut: "",
      });

      if (!numeroTelefono || numeroTelefono.trim() === "") {
        setErroresDatos((prev) => ({
          ...prev,
          numeroTelefono: "El número de teléfono es requerido.",
        }));
        return;
      } else if (!verificarNumeroTelefonico(numeroTelefono)) {
        setErroresDatos((prev) => ({
          ...prev,
          numeroTelefono: "El número de teléfono no es válido.",
        }));
        return;
      }

      if ((!razonSocial && rut) || (razonSocial && !rut)) {
        if (!razonSocial || razonSocial.trim() === "") {
          setErroresDatos((prev) => ({
            ...prev,
            razonSocial: "La razón social es requerida.",
          }));
        }
        if (!rut || rut.trim() === "") {
          setErroresDatos((prev) => ({
            ...prev,
            rut: "El RUT es requerido.",
          }));
        }
        return;
      }

      const existeDocumento = await buscarSiExisteDocumento(documentoIdentidad, id)
      if (!documentoIdentidad || documentoIdentidad.trim() === "") {
        setErroresDatos((prev) => ({
          ...prev,
          documentoIdentidad: "El documento de identidad es requerido.",
        }));
        return;
      } else if (!verificarDocumentoDeIdentidad(documentoIdentidad)) {
        setErroresDatos((prev) => ({
          ...prev,
          documentoIdentidad:
            "El documento de identidad ingresado es incorrecto.",
        }));
        return;
      } else if(existeDocumento){
        setErroresDatos((prev) => ({
          ...prev,
          documentoIdentidad:
            "El documento de identidad ya se encuentra registrado.",
        }));
        return;
      }
      onNext(datosFacturacion);
    } catch (e) {
      console.error(e);
      setErroresDatos((prev) => ({
        ...prev,
        documentoIdentidad: e.message || "Error desconocido",
      }));
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <>
      <Box mb={4}>
        <Heading py={2} fontSize={"lg"}>
          Datos de facturación
        </Heading>
      </Box>
      <Box
        as="form"
        onSubmit={handleSubmit}
        p={6}
        rounded={8}
        boxShadow="lg"
        height="fit-content"
      >
        <VStack spacing={4} width="100%" mb={4}>
          <FormControl isRequired>
            <FormLabel fontWeight={600} htmlFor="nombre" m={0}>
              Nombre
            </FormLabel>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ingrese su nombre"
              variant="flushed"
              value={datosFacturacion.nombre || ""}
              readOnly
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight={600} htmlFor="apellido" m={0}>
              Apellido
            </FormLabel>
            <Input
              id="apellido"
              name="apellido"
              type="text"
              placeholder="Ingrese su apellido"
              variant="flushed"
              value={datosFacturacion.apellido || ""}
              readOnly
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontWeight={600} htmlFor="email" m={0}>
              Correo Electrónico
            </FormLabel>
            <Input
              id="email"
              name="correoElectronico"
              type="email"
              placeholder="Ingrese su correo electrónico"
              variant="flushed"
              value={datosFacturacion.email || ""}
              readOnly
            />
          </FormControl>
          <FormControl isInvalid={erroresDatos.numeroTelefono}>
            <FormLabel fontWeight={600} htmlFor="numeroTelefono" m={0}>
              Teléfono
            </FormLabel>
            <Input
              id="numeroTelefono"
              name="numeroTelefono"
              type="text"
              placeholder="Ingrese su número de teléfono"
              variant="flushed"
              value={datosFacturacion.numeroTelefono || ""}
              onChange={handleChange}
            />
            {erroresDatos.numeroTelefono && (
              <FormErrorMessage>{erroresDatos.numeroTelefono}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={erroresDatos.documentoIdentidad}>
            <FormLabel fontWeight={600} htmlFor="documentoIdentidad" m={0}>
              Documento de identidad
            </FormLabel>
            <Input
              id="documentoIdentidad"
              name="documentoIdentidad"
              type="text"
              placeholder="Ingrese su documento de identidad"
              variant="flushed"
              value={datosFacturacion.documentoIdentidad || ""}
              maxLength="8"
              onChange={handleChange}
            />
            {!erroresDatos.documentoIdentidad ? (
              <FormHelperText>No incluir puntos ni guiones.</FormHelperText>
            ) : (
              <FormErrorMessage>
                {erroresDatos.documentoIdentidad}
              </FormErrorMessage>
            )}
          </FormControl>
          <Checkbox
            w={"100%"}
            size="sm"
            name="checkFacturaRut"
            isChecked={animarFacturaRut}
            onChange={handleCheckboxChange}
          >
            ¿Necesitas factura con RUT?
          </Checkbox>
          <AnimatePresence>
            {animarFacturaRut && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                
                style={{ overflow: "hidden", width: "100%", marginTop:"4px" }}
              >
                <VStack spacing={4} >
                  <FormControl isInvalid={erroresDatos.razonSocial}>
                    <FormLabel fontWeight={600} htmlFor="empresa" m={0}>
                      Razon Social
                    </FormLabel>
                    <Input
                      id="razonSocial"
                      name="razonSocial"
                      type="text"
                      placeholder="Ingrese la razón social de su empresa"
                      variant="flushed"
                      value={datosFacturacion.razonSocial || ""}
                      onChange={handleChange}
                    />
                    {erroresDatos.razonSocial && (
                      <FormErrorMessage>
                        {erroresDatos.razonSocial}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl isInvalid={erroresDatos.rut}>
                    <FormLabel fontWeight={600} htmlFor="rut" m={0}>
                      RUT
                    </FormLabel>
                    <Input
                      id="rut"
                      name="rut"
                      type="text"
                      placeholder="Ingrese el RUT de la empresa"
                      variant="flushed"
                      value={datosFacturacion.rut || ""}
                      onChange={handleChange}
                    />
                    {erroresDatos.rut && (
                      <FormErrorMessage>{erroresDatos.rut}</FormErrorMessage>
                    )}
                  </FormControl>
                </VStack>
              </motion.div>
            )}
          </AnimatePresence>
          <FormControl display="flex" alignItems="center">
            <FormLabel
              htmlFor="datos"
              mb="0"
              fontSize={{ base: "sm", md: "md" }}
            >
              ¿Guardar los datos ingresados?
            </FormLabel>
            <Switch
              name="guardarNuevosDatos"
              id="datos"
              isChecked={datosFacturacion.guardarNuevosDatos}
              onChange={handleChange}
            />
          </FormControl>
        </VStack>
        <Flex alignItems={"center"} justifyContent={"space-between"} mt={8}>
          <Button
            size={{ base: "xs", md: "sm" }}
            variant="link"
            color={"primary"}
            fontWeight={600}
            onClick={() => navigate("/mi-carrito")}
          >
            Volver al carrito
          </Button>
          <Button
          isLoading={loading}
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
            Siguiente
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default DatosFacturacion;

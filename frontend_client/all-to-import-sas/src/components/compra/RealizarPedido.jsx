import {
  Box,
  Heading,
  Container,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DatosEnvio from "./DatosEnvio";
import DatosFacturacion from "./DatosFacturacion";
import DetalleCompra from "./DetalleCompra";

const steps = [{ title: "Facturación" }, { title: "Envío" }, { title: "Pago" }];

const RealizarPedido = () => {

  const [step, setStep] = useState(0);
  const [datosEnvio, setDatosEnvio] = useState({});
  const [datosFacturacion, setDatosFacturacion] = useState({});
  const [preferenceId, setPreferenceId] = useState(0);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Container maxW="1280px" my={10} px={5} mt={4}>
      <Heading textAlign={"center"} textTransform={"uppercase"}>
        Realizar pedido
      </Heading>
      <Stepper size={{ base: "sm", md: "md" }} index={step} my={8}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      {step === 0 && (
        <DatosFacturacion
          datosFacturacion={datosFacturacion}
          setDatosFacturacion={setDatosFacturacion}
          onNext={nextStep}
        />
      )}
      {step === 1 && (
        <DatosEnvio
          datosEnvio={datosEnvio}
          setDatosEnvio={setDatosEnvio}
          datosFacturacion={datosFacturacion}
          setPreferenceId={setPreferenceId}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}
      {step === 2 && (
        <DetalleCompra
          preferenceId={preferenceId}
          datosFacturacion={datosFacturacion}
          datosEnvio={datosEnvio}
          onBack={prevStep}
        />
      )}
    </Container>
  );
};

export default RealizarPedido;

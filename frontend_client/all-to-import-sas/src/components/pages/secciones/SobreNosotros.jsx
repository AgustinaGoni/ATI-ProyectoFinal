import React from 'react'
import { Box, Heading, Text, Icon } from '@chakra-ui/react';
import { IconTool } from '@tabler/icons-react';

const SobreNosotros = () => {
  return (
    <Box
    textAlign="center"
    py={10}
    px={6}
    minHeight="100vh"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
  >
    <Icon as={IconTool} boxSize={24} color="gray.600" mb={4} />
    <Heading as="h1" size="2xl" mb={4} color="gray.700">
      Página en Construcción
    </Heading>
    <Text fontSize="lg" color="gray.500">
      Estamos trabajando para traerte esta página pronto. ¡Gracias por tu paciencia!
    </Text>
  </Box>
  )
}

export default SobreNosotros
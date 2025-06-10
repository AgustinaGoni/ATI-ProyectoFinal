import { Box, Flex, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";

const ProductosSkeleton = () => {
  return (
    <SimpleGrid columns={{ base: 2, md: 2, lg: 4 }} gap={6}>
      {[...Array(8)].map((_, index) => (
        <Box key={index} p={4} boxShadow="lg" borderRadius="8px">
          <Stack spacing={4}>
            <Skeleton height="200px" />
            <Skeleton height="20px" width="60%" />
            <Flex justifyContent="space-between" alignItems="center">
              <Skeleton height="20px" width="30%" />
              <Skeleton height="40px" width="30%" />
            </Flex>
          </Stack>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default ProductosSkeleton;

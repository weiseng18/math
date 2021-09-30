import { Container, VStack } from "@chakra-ui/react"

const PageWrapper = ({ children }) => {
  return (
    <Container maxW="100vw" margin="0" padding="0" overflowX="hidden">
      <VStack spacing={4} w="100vw" px="15vw" py="40px" h="100%">
        {children}
      </VStack>
    </Container>
  )
}

export default PageWrapper

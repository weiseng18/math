import { HStack, Spinner } from "@chakra-ui/react"

const LoadingSpinner = () => {
  return (
    <HStack>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </HStack>
  )
}

export { LoadingSpinner }

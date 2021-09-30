import { HStack, Spinner, Text } from "@chakra-ui/react"

const ErrorText = ({ children }) => {
  return <Text color="crimson">Error: {children}</Text>
}

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

export { ErrorText, LoadingSpinner }

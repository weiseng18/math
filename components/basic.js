import { Button, HStack, Input, Spinner, Text } from "@chakra-ui/react"

const ErrorText = ({ children }) => {
  return <Text color="crimson">Error: {children}</Text>
}

const InputBar = ({
  handleChange,
  handleKeydown,
  handleSubmit,
  query,
  errorMsg,
  isLoading,
}) => {
  return (
    <HStack spacing={4} w="100%">
      <Input
        isRequired
        onChange={handleChange}
        onKeyDown={handleKeydown}
        value={query}
        placeholder="Put in your query"
      />
      <Button
        disabled={errorMsg !== "" || !query.length || isLoading}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </HStack>
  )
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

export { ErrorText, InputBar, LoadingSpinner }

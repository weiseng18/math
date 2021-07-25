import { Flex, Text } from "@chakra-ui/react"

import { MathTypeset } from "../components/MathJax"

const Index = () => {
  return (
    <>
      <MathTypeset />
      <Flex
        h="100vh"
        w="100vw"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        {renderEquation()}
      </Flex>
    </>
  )
}

const renderEquation = () => {
  return (
    <Flex>
      <Text pr={4}>Equation: </Text>
      $y = ax^2 + bx + c$
    </Flex>
  )
}

export default Index

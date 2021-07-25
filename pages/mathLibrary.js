import { Flex, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"

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
        <Table w="60%">
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Sample</Th>
            </Tr>
          </Thead>
          <Tbody>
            {renderEquation()}
            {renderSymbols()}
            {renderEnvironment()}
          </Tbody>
        </Table>
      </Flex>
    </>
  )
}

const renderEquation = () => {
  return (
    <Tr>
      <Td>
        <Text pr={4}>Equation: </Text>
      </Td>
      <Td>$y = ax^2 + bx + c$</Td>
    </Tr>
  )
}

const renderSymbols = () => {
  return (
    <Tr>
      <Td>
        <Text pr={4}>Symbols: </Text>
      </Td>
      <Td>
        $x \in \mathbb{"{"}R{"}"}$
      </Td>
    </Tr>
  )
}

const renderEnvironment = () => {
  return (
    <Tr>
      <Td>
        <Text pr={4}>Environment: </Text>
      </Td>
      <Td>
        $\begin{"{"}pmatrix{"}"}1 & 2 & 3 \\ 4 & 5 & 6 \end{"{"}pmatrix{"}"}$
      </Td>
    </Tr>
  )
}

export default Index

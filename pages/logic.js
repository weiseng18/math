import {
  Button,
  Code,
  Container,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"

import Router, { useRouter } from "next/router"
import axios from "axios"

import { LogicToken } from "frontend/constants"

import {
  logicTextBf,
  convertTokenizedLogicExpressionToLatex,
} from "frontend/utils"

const Page = () => {
  const [query, setQuery] = useState("") // text in the input
  const [error, setError] = useState("") // error regarding query

  const [loading, setLoading] = useState(true) // if page is loading or handleSubmit is running

  const [booleans, setBooleans] = useState([]) // 2D array of enumerated booleans
  const [answers, setAnswers] = useState([]) // 1D array of evaluated answers
  const [variables, setVariables] = useState([]) // 1D array of detected variables
  const [expression, setExpression] = useState([]) // 1D array of tokenized expression

  const router = useRouter()

  const handleChange = (e) => {
    setError("")
    setQuery(e.target.value)
  }

  const handleKeydown = (e) => {
    if (e.keyCode == 13 || e.key == "Enter") handleSubmit()
  }

  const handleSubmit = async (passedQuery = "") => {
    // empty query
    if (query === "" && passedQuery === "") return

    const expr = query === "" ? passedQuery : query

    try {
      setLoading(true)

      const res = await axios.get("/api/logic/truthTable", {
        params: {
          expression: expr,
        },
      })

      setBooleans(res.data.booleans)
      setAnswers(res.data.answers)
      setVariables(res.data.variables)
      setExpression(res.data.expression)

      Router.push({
        query: {
          expression: expr,
        },
      })

      // force math typesetting
      MathJax.typeset()

      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err.response.data.message)
    }
  }

  useEffect(() => {
    if (query === "") {
      if (router.query.expression) {
        const expression = router.query.expression
        setQuery(expression)
        handleSubmit(expression)
      } else {
        setQuery("")
        setBooleans([])
        setAnswers([])
      }
    } else {
      MathJax.typeset()
    }
  }, [router.query])

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <Container maxW="100vw" margin="0" padding="0" overflowX="hidden">
      <VStack spacing={4} w="100vw" px="15vw" py="40px" h="100%">
        {/* display the tokens that can be used */}
        <HStack spacing={4}>
          <Text>Supported syntax:</Text>
          {Object.keys(LogicToken).map((key) => (
            <Code>{LogicToken[key]}</Code>
          ))}
          <Code>A-Z</Code>
          <Code>a-z</Code>
        </HStack>
        <HStack spacing={4} w="100%">
          <Input
            isRequired
            onChange={handleChange}
            onKeyDown={handleKeydown}
            value={query}
            placeholder="Put in your query"
          />
          <Button
            disabled={error !== "" || !query.length || loading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </HStack>
        {error !== "" && <Text color="crimson">Error: {error}</Text>}
        {loading && (
          <HStack>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </HStack>
        )}
        {answers.length > 0 && (
          <VStack spacing={8} pt={8} w="100%" maxW="600px">
            <HStack spacing={1}>
              <Text>Your input is interpreted as:</Text>
              <Text>{convertTokenizedLogicExpressionToLatex(expression)}</Text>
            </HStack>
            <Table variant="striped" size="sm" w="auto">
              <Thead>
                <Tr>
                  {variables.length > 0 &&
                    variables.map((one) => <Th>${logicTextBf(one)}$</Th>)}
                  <Th>
                    {convertTokenizedLogicExpressionToLatex(expression, true)}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {booleans.length > 0 &&
                  booleans.map((row, idx) => {
                    let tableRow = row.map((cell) => (
                      <Td>{cell ? "T" : "F"}</Td>
                    ))
                    let ans = <Td>{answers[idx] ? "T" : "F"}</Td>
                    tableRow.push(ans)
                    return <Tr>{tableRow}</Tr>
                  })}
              </Tbody>
            </Table>
          </VStack>
        )}
      </VStack>
    </Container>
  )
}

export default Page

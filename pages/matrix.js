import { Button, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"

import axios from "axios"

import { convert2DArrayToMatrix } from "../utils"

const Page = () => {
  const [query, setQuery] = useState("") // text in the input
  const [error, setError] = useState("") // error regarding query

  const [command, setCommand] = useState("") // action from processed query
  const [inputArray, setInputArray] = useState([[]]) // matrix from processed query
  const [answer, setAnswer] = useState("")

  const handleChange = (e) => {
    setError("")
    setQuery(e.target.value)
  }

  const handleKeydown = (e) => {
    if (e.keyCode == 13 || e.key == "Enter") handleSubmit()
  }

  const handleSubmit = async () => {
    // empty query
    if (query === "") return

    try {
      // split query into action and matrix
      const arr = query.split(" ")
      const action = arr.shift()
      const matrix = arr.join(" ")

      let res
      switch (action) {
        case "determinant":
        case "det":
          res = await axios.get("/api/matrix/determinant", {
            params: {
              matrix,
            },
          })
          setCommand("\\mathrm{det}")
          break
      }
      setInputArray(JSON.parse(matrix))
      setAnswer(res.data)

      // force math typesetting
      MathJax.typeset()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Flex h="100vh" w="100vw" justifyContent="center" alignItems="center">
      <VStack spacing={4} w="60%">
        <HStack spacing={4} w="100%">
          <Input
            isRequired
            onChange={handleChange}
            onKeyDown={handleKeydown}
            placeholder="Put in your query"
          />
          <Button
            disabled={error !== "" || !query.length}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </HStack>
        {error !== "" && <Text color="crimson">Error: {error}</Text>}
        {answer !== "" && (
          <VStack key={inputArray.join()} spacing={8} pt={8}>
            <HStack spacing={1}>
              <Text>Your input is interpreted as:</Text>
              <Text>${convert2DArrayToMatrix(inputArray)}$</Text>
            </HStack>
            <HStack spacing={1} bgColor="gray.200" padding={4}>
              <Text>
                ${command}
                {convert2DArrayToMatrix(inputArray)} = $
              </Text>
              <Text>${answer}$</Text>
            </HStack>
          </VStack>
        )}
      </VStack>
    </Flex>
  )
}

export default Page

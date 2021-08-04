import { Button, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"

import axios from "axios"

import { convert2DArrayToMatrix } from "../utils"

const Page = () => {
  const [query, setQuery] = useState("")
  const [inputArray, setInputArray] = useState("")
  const [answer, setAnswer] = useState("")

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleKeydown = (e) => {
    if (e.keyCode == 13 || e.key == "Enter") handleSubmit()
  }

  const handleSubmit = async () => {
    if (query === "") return

    const res = await axios.get("/api/matrix/determinant", {
      params: {
        matrix: query,
      },
    })

    setInputArray(JSON.parse(query))
    setAnswer(res.data)

    // force math typesetting
    MathJax.typeset()
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
          <Button disabled={!query.length} onClick={handleSubmit}>
            Submit
          </Button>
        </HStack>
        {answer && (
          <HStack key={inputArray.join()} spacing={8} alignItems="flex-start">
            <Text>Input: ${convert2DArrayToMatrix(inputArray)}$</Text>
            <Text>Output: ${answer}$</Text>
          </HStack>
        )}
      </VStack>
    </Flex>
  )
}

export default Page

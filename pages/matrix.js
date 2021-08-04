import { Button, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"

import axios from "axios"

const Page = () => {
  const [query, setQuery] = useState("")
  const [answer, setAnswer] = useState("")

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSubmit = async () => {
    if (query === "") return

    const res = await axios.get("/api/matrix/determinant", {
      params: {
        matrix: query,
      },
    })

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
            placeholder="Put in your query"
          />
          <Button disabled={!query.length} onClick={handleSubmit}>
            Submit
          </Button>
        </HStack>
        {answer && (
          <>
            <Text>Output: ${answer}$</Text>
          </>
        )}
      </VStack>
    </Flex>
  )
}

export default Page

import { Button, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"

import axios from "axios"

import { convert2DArrayToMatrix } from "../utils"

const Page = () => {
  const [query, setQuery] = useState("") // text in the input
  const [error, setError] = useState("") // error regarding query

  const [command, setCommand] = useState("") // action from processed query
  const [inputArray, setInputArray] = useState([[]]) // matrix from processed query
  const [answer, setAnswer] = useState("") // Latex string

  // only for rref
  const [rrefActions, setRrefActions] = useState([])

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
          setAnswer(res.data)
          break
        case "rref":
          res = await axios.get("/api/matrix/rref", {
            params: {
              matrix,
            },
          })
          setCommand("\\mathrm{rref}")
          setAnswer(convert2DArrayToMatrix(res.data.matrix))
          setRrefActions(res.data.actions)
          break
      }
      setInputArray(JSON.parse(matrix))

      // force math typesetting
      MathJax.typeset()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Flex
      h="100vh"
      w="100vw"
      justifyContent="center"
      alignItems="center"
      mx="auto"
    >
      <VStack
        spacing={4}
        w="100vw"
        px="15vw"
        py="60px"
        h="100%"
        overflowY="auto"
      >
        <HStack spacing={4} w="100%" my="auto">
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
          <VStack key={inputArray.join()} spacing={8} pt={8} w="50%">
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
            {rrefActions.length > 0 && rrefSteps(rrefActions)}
          </VStack>
        )}
      </VStack>
    </Flex>
  )
}

const rrefSteps = (rrefActions) => {
  const descriptionText = (action, params) => {
    if (action === "none") return ["Begin with"]
    else if (action === "addMultiple")
      return [
        "Add",
        `$${params[1]}$`,
        "times of row",
        `$${params[0]}$`,
        "to row",
        `$${params[2]}$`,
        `$(\\text{or }R_${params[2]} ${params[1] < 0 ? "-" : "+"} ${Math.abs(
          params[1]
        )}R_${params[0]})$`,
      ]
    else if (action === "swap")
      return [
        "Swap row",
        `$${params[0]}$`,
        "with row",
        `$${params[1]}$`,
        `$(\\text{or }R_${params[0]} \\leftrightarrow R_${params[1]})$`,
      ]
    else if (action === "multiplyRow")
      return [
        "Multiply row",
        `$${params[0]}$`,
        "by factor",
        `$${params[1]}$`,
        `$(\\text{or }${params[1]}R_${params[0]})$`,
      ]
  }

  return (
    <VStack spacing={4} alignItems="flex-start" w="100%">
      {rrefActions.map((one) => (
        <>
          <HStack spacing={1} justifyContent="center">
            {descriptionText(one.action, one.params).map((two) => (
              <Text>{two}</Text>
            ))}
          </HStack>
          <Text alignSelf="center">${convert2DArrayToMatrix(one.matrix)}$</Text>
        </>
      ))}
    </VStack>
  )
}

export default Page

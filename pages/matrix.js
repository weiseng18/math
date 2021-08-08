import {
  Button,
  Flex,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"

import Router, { useRouter } from "next/router"
import axios from "axios"

import { convert2DArrayToMatrix } from "../utils"

const Page = () => {
  const [query, setQuery] = useState("") // text in the input
  const [error, setError] = useState("") // error regarding query

  const [loading, setLoading] = useState(true) // if page is loading or handleSubmit is running

  const [command, setCommand] = useState("") // action from processed query
  const [inputArray, setInputArray] = useState([[]]) // matrix from processed query
  const [answer, setAnswer] = useState("") // Latex string

  // only for rref
  const [rrefActions, setRrefActions] = useState([])

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

    try {
      setLoading(true)

      // split query into action and matrix
      let arr = query === "" ? passedQuery.split(" ") : query.split(" ")
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
          Router.push({
            query: { action: "det", matrix },
          })
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
          Router.push({
            query: { action: "rref", matrix },
          })
          break
      }
      setInputArray(JSON.parse(matrix))

      // force math typesetting
      MathJax.typeset()

      setLoading(false)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (query === "") {
      if (router.query.action && router.query.matrix) {
        const command = router.query.action
        const matrix = router.query.matrix
        setQuery(command + " " + matrix)
        handleSubmit(command + " " + matrix)
      } else {
        setQuery("")
        setInputArray([[]])
        setAnswer("")
      }
    }
  }, [router.query])

  useEffect(() => {
    setLoading(false)
  }, [])

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
    else if (action === "addMultiple") {
      if (params[1] > 0)
        return [
          "Add",
          `$${params[1]}$`,
          "times of row",
          `$${params[0]}$`,
          "to row",
          `$${params[2]}$`,
          `$(\\text{or }R_${params[2]} + ${params[1]}R_${params[0]})$`,
        ]
      else
        return [
          "Subtract",
          `$${-params[1]}$`,
          "times of row",
          `$${params[0]}$`,
          "from row",
          `$${params[2]}$`,
          `$(\\text{or }R_${params[2]} - ${-params[1]}R_${params[0]})$`,
        ]
    } else if (action === "swap")
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

import { HStack, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import PageWrapper from "components/PageWrapper"
import { ErrorText, InputBar, LoadingSpinner } from "components/basic"

import Router, { useRouter } from "next/router"
import axios from "axios"

import {
  convert2DArrayToMatrix,
  convert2DArraysToAugmentedMatrix,
} from "frontend/utils"

const Page = () => {
  const [query, setQuery] = useState("") // text in the input
  const [error, setError] = useState("") // error regarding query

  const [loading, setLoading] = useState(true) // if page is loading or handleSubmit is running

  const [question, setQuestion] = useState("") // action from processed query
  const [inputArray, setInputArray] = useState([[]]) // matrix from processed query
  const [answer, setAnswer] = useState("") // Latex string

  // only for rref or inverse
  // holds the data for intermediate steps
  const [actions, setActions] = useState([])

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
      let arr = passedQuery === "" ? query.split(" ") : passedQuery.split(" ")
      const action = arr.shift()
      const matrix = arr.join(" ")

      // to setInputArray(matrixArray) later
      const matrixArray = JSON.parse(matrix)

      let res
      switch (action) {
        case "determinant":
        case "det":
          res = await axios.get("/api/matrix/determinant", {
            params: {
              matrix,
            },
          })
          setQuestion("\\mathrm{det}" + convert2DArrayToMatrix(matrixArray))
          setAnswer(res.data)
          setActions([])
          Router.push({
            query: { action: "det", matrix },
          })
          break
        case "inverse":
        case "inv":
          res = await axios.get("/api/matrix/inverse", {
            params: {
              matrix,
            },
          })
          setQuestion(convert2DArrayToMatrix(matrixArray) + "^{-1}")
          setAnswer(convert2DArrayToMatrix(res.data.matrix))
          setActions(res.data.actions)
          Router.push({
            query: { action: "inverse", matrix },
          })
          break
        case "rref":
          res = await axios.get("/api/matrix/rref", {
            params: {
              matrix,
            },
          })
          setQuestion("\\mathrm{rref}" + convert2DArrayToMatrix(matrixArray))
          setAnswer(convert2DArrayToMatrix(res.data.matrix))
          setActions(res.data.actions)
          Router.push({
            query: { action: "rref", matrix },
          })
          break
        case "status":
          res = await axios.get("/api/matrix/status", {
            params: {
              matrix,
            },
          })
          setQuestion(
            "\\text{Is }" +
              convert2DArrayToMatrix(matrixArray) +
              "\\text{ in REF, RREF, or neither?}"
          )
          // say Neither instead of None
          setAnswer(res.data.type === "None" ? "Neither" : res.data.type)
          setActions([])
          Router.push({
            query: { action: "status", matrix },
          })
          break
        default:
          setLoading(false)
          setAnswer("")
          setActions([])
          throw new Error("Unrecognized command")
      }
      setInputArray(matrixArray)

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
    } else {
      MathJax.typeset()
    }
  }, [router.query])

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <PageWrapper>
      <InputBar
        handleChange={handleChange}
        handleKeydown={handleKeydown}
        handleSubmit={handleSubmit}
        query={query}
        errorMsg={error}
        isLoading={loading}
      />
      {error && error !== "" && <ErrorText>{error}</ErrorText>}
      {loading && <LoadingSpinner />}
      {answer !== "" && (
        <VStack
          key={inputArray.join() + question}
          spacing={8}
          pt={8}
          w="100%"
          maxW="600px"
        >
          <HStack spacing={1}>
            <Text>Your input is interpreted as:</Text>
            <Text>${convert2DArrayToMatrix(inputArray)}$</Text>
          </HStack>
          {router.query.action && router.query.action !== "status" && (
            <HStack spacing={1} bgColor="gray.200" padding={4}>
              <>
                <Text>${question} = $</Text>
                <Text>${answer}$</Text>
              </>
            </HStack>
          )}
          {router.query.action && router.query.action === "status" && (
            <VStack spacing={4} bgColor="gray.200" padding={4}>
              <>
                <Text>${question}$</Text>
                <Text>Ans: {answer}</Text>
              </>
            </VStack>
          )}
          {router.query.action &&
            router.query.action === "rref" &&
            actions.length > 0 &&
            rrefSteps(actions)}
          {router.query.action &&
            router.query.action === "inverse" &&
            actions.length > 0 &&
            inverseSteps(actions)}
        </VStack>
      )}
    </PageWrapper>
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
          `$${params[0] + 1}$`,
          "to row",
          `$${params[2] + 1}$`,
          `$(\\text{or }R_${params[2] + 1} + ${params[1]}R_${params[0] + 1})$`,
        ]
      else
        return [
          "Subtract",
          `$${-params[1]}$`,
          "times of row",
          `$${params[0] + 1}$`,
          "from row",
          `$${params[2] + 1}$`,
          `$(\\text{or }R_${params[2] + 1} - ${-params[1]}R_${params[0] + 1})$`,
        ]
    } else if (action === "swap")
      return [
        "Swap row",
        `$${params[0] + 1}$`,
        "with row",
        `$${params[1] + 1}$`,
        `$(\\text{or }R_${params[0] + 1} \\leftrightarrow R_${params[1] + 1})$`,
      ]
    else if (action === "multiplyRow")
      return [
        "Multiply row",
        `$${params[0] + 1}$`,
        "by factor",
        `$${params[1] + 1}$`,
        `$(\\text{or }${params[1] + 1}R_${params[0] + 1})$`,
      ]
  }

  return (
    <VStack spacing={4} alignItems="flex-start" w="100%">
      {rrefActions.map((one) => (
        <>
          <HStack
            flexWrap="wrap"
            spacing={1}
            justifyContent="flex-start"
            lineHeight="2em"
          >
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

const inverseSteps = (inverseActions) => {
  const descriptionText = (action, params) => {
    if (action === "none") return ["Begin with"]
    else if (action === "addMultiple") {
      if (params[1] > 0)
        return [
          "Add",
          `$${params[1]}$`,
          "times of row",
          `$${params[0] + 1}$`,
          "to row",
          `$${params[2] + 1}$`,
          `$(\\text{or }R_${params[2] + 1} + ${params[1]}R_${params[0] + 1})$`,
        ]
      else
        return [
          "Subtract",
          `$${-params[1]}$`,
          "times of row",
          `$${params[0] + 1}$`,
          "from row",
          `$${params[2] + 1}$`,
          `$(\\text{or }R_${params[2] + 1} - ${-params[1]}R_${params[0] + 1})$`,
        ]
    } else if (action === "swap")
      return [
        "Swap row",
        `$${params[0] + 1}$`,
        "with row",
        `$${params[1] + 1}$`,
        `$(\\text{or }R_${params[0] + 1} \\leftrightarrow R_${params[1] + 1})$`,
      ]
    else if (action === "multiplyRow")
      return [
        "Multiply row",
        `$${params[0] + 1}$`,
        "by factor",
        `$${params[1] + 1}$`,
        `$(\\text{or }${params[1] + 1}R_${params[0] + 1})$`,
      ]
  }

  return (
    <VStack spacing={4} alignItems="flex-start" w="100%">
      {inverseActions.map((one) => (
        <>
          <HStack
            flexWrap="wrap"
            spacing={1}
            justifyContent="flex-start"
            lineHeight="2em"
          >
            {descriptionText(one.action, one.params).map((two) => (
              <Text>{two}</Text>
            ))}
          </HStack>
          <Text alignSelf="center">
            ${convert2DArraysToAugmentedMatrix(one.matrix, one.inverse)}$
          </Text>
        </>
      ))}
    </VStack>
  )
}

export default Page

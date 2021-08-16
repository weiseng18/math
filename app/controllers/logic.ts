import { VercelRequest, VercelResponse } from "@vercel/node"
import * as _ from "lodash"

import Tokenizer from "../classes/logic/Tokenizer"
import TruthTableGenerator from "../classes/logic/TruthTableGenerator"

const generateTruthTable = (req: VercelRequest, res: VercelResponse) => {
  try {
    let expression = req.query.expression
    if (Array.isArray(expression)) expression = expression.join()

    // Step 1: Tokenize the expression
    const tokenizer = new Tokenizer()
    const tokens = tokenizer.tokenize(expression)

    // Step 2: TruthTableGenerator
    // - In TruthTableGenerator, SyntaxTree is created to parse the expression
    // - Call TruthTableGenerator.generate() to create the truth table
    const generator = new TruthTableGenerator(tokens)
    const result = generator.generate()

    // Post-processing
    const variables = Object.keys(tokens.variables)
    const tokenizedExpression = tokens.tokens.map((one) => one.value)

    res.json({
      ...result,
      variables,
      expression: tokenizedExpression,
    })
  } catch (err) {
    const errorCode = _.get(err, "code", 500)
    res.status(errorCode).json({ message: err.message })
  }
}

export default {
  generateTruthTable,
}

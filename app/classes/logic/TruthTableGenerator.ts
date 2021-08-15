import * as _ from "lodash"

import { Node, SyntaxTree } from "./SyntaxTree"

import { IExpressionInfo, BitmaskObject } from "../../types/Logic"

class TruthTableGenerator {
  tokens: {
    type: string
    value: string
  }[]
  variables: string[]
  variablesInfo: { [varName: string]: number[] }

  constructor(props: IExpressionInfo) {
    this.tokens = props.tokens
    this.variables = Object.keys(props.variables)
    this.variablesInfo = props.variables
  }

  /**
   * Generates truth table
   */
  generate() {
    const bin = Math.pow(2, this.variables.length)

    // 2d array containing the enumerated booleans
    // [F, F, ..., F, F]
    // [F, F, ..., F, T]
    // ...
    // [T, T, ..., T, T]
    let enumeratedBooleanRows = []

    // 1d array containing the result, evaluated by substituting the booleans
    let ansArray = []

    let tree = new SyntaxTree({
      tokens: this.tokens,
      variables: this.variablesInfo,
    })
    const node = tree.build()

    for (let i = 0; i < bin; i++) {
      let rowArray: boolean[] = []

      let mask = i.toString(2) // generate bitmask
      while (mask.length < this.variables.length) mask = "0" + mask // pad with zeroes
      let bitmaskObject: { [varName: string]: boolean } = {} // generate bitmask object
      this.variables.forEach((varName, idx) => {
        const which = mask[idx] === "1"
        bitmaskObject[varName] = which // assign boolean
        rowArray.push(which) // add to row array
      })

      // result
      const res = tree.eval(node, bitmaskObject)
      ansArray.push(res)

      enumeratedBooleanRows.push(rowArray)
    }
    return {
      booleans: enumeratedBooleanRows,
      answers: ansArray,
    }
  }
}

export default TruthTableGenerator

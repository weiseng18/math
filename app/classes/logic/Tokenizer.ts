import { LogicToken } from "../../types/Logic"

import * as _ from "lodash"

class Tokenizer {
  private keys: string[] // enum name (e.g. BINARY_AND)
  private values: string[] // enum value (e.g. &)

  private operatorChars: string[] // e.g. => is an operator, but = and > are both valid chars

  private alphaChars: string[] // e.g. => is an operator, but = and > are both valid chars

  constructor() {
    this.keys = Object.keys(LogicToken)

    const vals = Object.keys(LogicToken).map(
      (key) => LogicToken[key as keyof typeof LogicToken]
    )
    this.values = vals

    // chars that operators consist of
    this.operatorChars = vals.join("").split("")

    let alphaChars: string[] = []
    // A-Z
    _.range(65, 65 + 26).forEach((num) =>
      alphaChars.push(String.fromCharCode(num))
    )
    // a-z
    _.range(97, 97 + 26).forEach((num) =>
      alphaChars.push(String.fromCharCode(num))
    )
    this.alphaChars = alphaChars
  }

  tokenize(inp: string) {
    // stores the output
    let tokens = []

    // loop through input
    let chunk = ""
    for (let i = 0; i < inp.length; i++) {
      if (this.isInvalid(inp[i])) continue

      chunk += inp[i]
      chunk = chunk.trim()

      if (this.isAlphaChar(chunk)) {
        // can assume alphabet = variable for now
        tokens.push({
          type: "VAR",
          value: chunk,
        })
        chunk = ""
      } else if (this.isOperatorString(chunk)) {
        // check if is a LogicToken
        tokens.push({
          type: "OP",
          value: chunk,
        })
        chunk = ""
      }
    }

    return tokens
  }

  /**
   * Checks if str is a valid operator.
   * @param str string to check
   * @returns boolean
   */
  isOperatorString(str: string) {
    return _.includes(this.values, str)
  }

  /**
   * Checks if entire str contains only invalid chars.
   * @param str string to check
   * @returns boolean
   */
  isInvalid(str: string) {
    return !(
      _.includes(this.operatorChars, str) || _.includes(this.alphaChars, str)
    )
  }

  /**
   * Checks if str is 1 char long, and in [A-Z] or [a-z]
   * @param str string to test
   * @returns boolean
   */
  isAlphaChar = function (str: string) {
    return (
      typeof str === "string" &&
      str.length === 1 &&
      _.includes(this.alphaChars, str)
    )
  }
}

export default Tokenizer

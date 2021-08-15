enum LogicToken {
  LEFT_BRACKET = "(",
  RIGHT_BRACKET = ")",
  NEGATION = "!",
  BINARY_AND = "&",
  BINARY_OR = "|",
  IMPLIES = "=>",
}

interface IExpressionInfo {
  tokens: {
    type: string
    value: string
  }[]
  variables: { [varName: string]: number[] }
}

interface BitmaskObject {
  [key: string]: boolean
}

export { LogicToken, IExpressionInfo, BitmaskObject }

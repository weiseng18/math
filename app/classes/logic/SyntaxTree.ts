import { IExpressionInfo, LogicToken } from "../../types/Logic"

class Node {
  value: string
  type: string
  left: Node
  right: Node
  constructor(value: string, type: string, left: Node, right: Node) {
    this.value = value
    this.type = type
    this.left = left
    this.right = right
  }
}

interface IStackItem {
  node: Node
  operator: IToken
}

interface IToken {
  type: string
  value: string
}

class SyntaxTree {
  tokens: IToken[]
  variables: { [varName: string]: number[] }

  constructor(props: IExpressionInfo) {
    this.tokens = props.tokens
    this.variables = props.variables
  }

  newNullNode() {
    return new Node("", "", null, null)
  }

  /**
   * Builds a syntax tree of a mathematical logic expression
   * @returns Node representing the root of the tree
   */
  build(): Node {
    let cur = null

    let stack: IStackItem[] = []
    let unclosedBrackets = 0

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i]
      if (token.value === LogicToken.LEFT_BRACKET) {
        unclosedBrackets++
      } else if (token.value === LogicToken.RIGHT_BRACKET) {
        unclosedBrackets--
        if (stack.length > 0 && unclosedBrackets === 0) {
          // complete remaining operations since the bracket is closed
          while (stack.length > 0) {
            const newTop = stack.pop()
            cur = this.handleOperatorWithNode(newTop, cur)
          }
        }
      } else if (token.type === "VAR") {
        if (stack.length > 0 && unclosedBrackets === 0) {
          const top = stack.pop()
          cur = this.handleOperatorWithVariable(top, token)
          while (stack.length > 0) {
            const newTop = stack.pop()
            cur = this.handleOperatorWithNode(newTop, cur)
          }
        } else {
          cur = new Node(token.value, token.type, null, null)
        }
      } else {
        if (token.value === LogicToken.NEGATION) {
          // Negation has only 1 parameter, which will come to the right (after) the negation operator.
          stack.push({
            node: null,
            operator: token,
          })
        } else {
          // This operator is not negation. It has 2 parameters, one on the left (before), and one on the right (after) the operator.
          // Here, cur refers to the parameter on the left.
          stack.push({
            node: cur,
            operator: token,
          })
          cur = null
        }
      }
    }

    while (stack.length > 0) {
      const newTop = stack.pop()
      cur = this.handleOperatorWithNode(newTop, cur)
    }

    return cur
  }

  /**
   * Generates an object that contains the entire tree structure of a syntax tree.
   * @param root Node representing the root of the tree
   * @returns object containing the entire tree structure
   */
  toObj(root: Node) {
    let leftOutput = {},
      rightOutput = {}
    if (root.left !== null) leftOutput = this.toObj(root.left)
    if (root.right !== null) rightOutput = this.toObj(root.right)

    return {
      value: root.value,
      type: root.type,
      left: leftOutput,
      right: rightOutput,
    }
  }

  /**
   * Creates a new node for variable B.
   *
   * Creates a new node for operation C, with Node(variable B) as its right child.
   *
   * If C is the binary negation, then Node(variable A) is null. Else, Node(variable A) is the left child of Node(operation C).
   * @param top variable A (Node), and operation C
   * @param token new variable B
   * @returns Node(operation C)
   */
  handleOperatorWithVariable(top: IStackItem, token: IToken): Node {
    // create new node with this variable
    const varNode = new Node(token.value, token.type, null, null)

    if (top.operator.value === LogicToken.NEGATION) {
      // negation only has 1 parameter, so handle separately
      const opNode = new Node(
        top.operator.value,
        top.operator.type,
        null,
        varNode
      )
      return opNode
    } else {
      //    operator (root)
      //     /      \
      // top.node   varNode
      const opNode = new Node(
        top.operator.value,
        top.operator.type,
        top.node,
        varNode
      )
      return opNode
    }
  }

  /**
   * Creates a new node for operation C, with Node(variable B) as its right child.
   *
   * If C is the binary negation, then Node(variable A) is null. Else, Node(variable A) is the left child of Node(operation C).
   * @param top variable A (Node), and operation C
   * @param node variable B (Node)
   * @returns Node(operation C)
   */
  handleOperatorWithNode(top: IStackItem, node: Node): Node {
    if (top.operator.value === LogicToken.NEGATION) {
      // negation only has 1 parameter, so handle separately
      const opNode = new Node(top.operator.value, top.operator.type, null, node)
      return opNode
    } else {
      //    operator (root)
      //     /      \
      // top.node   node
      const opNode = new Node(
        top.operator.value,
        top.operator.type,
        top.node,
        node
      )
      return opNode
    }
  }
}

export default SyntaxTree
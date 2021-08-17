import { LogicToken, LogicTokenType, BitmaskObject } from "app/types/Logic"

import { BadRequest } from "app/classes/Error"

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

  constructor(tokens: IToken[]) {
    this.tokens = tokens
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

    let prevToken

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i]
      if (token.value === LogicToken.LEFT_BRACKET) {
        unclosedBrackets++
        stack.push({
          node: null,
          operator: token,
        })
      } else if (token.value === LogicToken.RIGHT_BRACKET) {
        unclosedBrackets--

        // complete remaining operations since the bracket is closed
        let done = false
        while (stack.length > 0 && !done) {
          const newTop = stack.pop()
          if (newTop.operator.value === LogicToken.LEFT_BRACKET) done = true
          else cur = this.handleOperatorWithNode(newTop, cur)
        }
      } else if (token.type === LogicTokenType.VARIABLE) {
        // The token is a variable

        if (prevToken === LogicTokenType.VARIABLE) {
          // two variables in a row => syntax error
          throw new BadRequest("Missing binary operator")
        }

        if (
          stack.length > 0 &&
          stack[stack.length - 1].operator.value !== "("
        ) {
          const top = stack.pop()
          cur = this.handleOperatorWithVariable(top, token)
          while (
            stack.length > 0 &&
            stack[stack.length - 1].operator.value !== "("
          ) {
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

      // if unclosedBrackets < 0, this means that the SyntaxTree tried to close a bracket that has not been opened.
      // As such, this is a missing left parenthesis
      if (unclosedBrackets < 0) {
        throw new BadRequest("Missing left parenthesis")
      }

      // store prev token
      prevToken = token.type
    }

    while (stack.length > 0) {
      const newTop = stack.pop()
      cur = this.handleOperatorWithNode(newTop, cur)
    }

    // if there are still unclosed brackets, throw error
    if (unclosedBrackets > 0) {
      throw new BadRequest("Missing right parenthesis")
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
   * Evaluates a mathematical logic expression, given the values of unknowns to substitute into
   * @param root Node representing the root of the tree
   * @param mask object, maps varName to boolean
   * @returns evaluated mathematical logic expression, true or false
   */
  eval(root: Node, mask: BitmaskObject): boolean {
    if (root.type === LogicTokenType.OPERATOR) {
      if (root.value === LogicToken.NEGATION)
        return !this.eval(root.right, mask)
      else if (root.value === LogicToken.BINARY_AND)
        return this.eval(root.left, mask) && this.eval(root.right, mask)
      else if (root.value === LogicToken.BINARY_OR)
        return this.eval(root.left, mask) || this.eval(root.right, mask)
      else if (root.value === LogicToken.IMPLIES)
        // !p || q (implication law)
        return !this.eval(root.left, mask) || this.eval(root.right, mask)
    } else {
      // unknowns, to be substituted
      const varName = root.value
      return mask[varName]
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

export { Node, SyntaxTree }

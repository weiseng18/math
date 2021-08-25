// standard testing modules
import chai from "chai"

import { LogicTokenType } from "app/types/Logic"

// import classes to be tested
import Tokenizer from "app/classes/logic/Tokenizer"
import { SyntaxTree } from "app/classes/logic/SyntaxTree"
import TruthTableGenerator from "app/classes/logic/TruthTableGenerator"

export default () => {
  describe("Tokenizer", () => {
    describe("Tokenizer.tokenize", () => {
      const tokenizer = new Tokenizer()

      it("should parse strings without invalid chars properly", () => {
        const logicStrings = [
          "!p",
          "p & q",
          "p | q => q",
          "!(p | q)",
          "!p <=> q",
        ]
        const logicParsed = [
          ["!", "p"],
          ["p", "&", "q"],
          ["p", "|", "q", "=>", "q"],
          ["!", "(", "p", "|", "q", ")"],
          ["!", "p", "<=>", "q"],
        ]
        const variables = [
          {
            p: [1],
          },
          {
            p: [0],
            q: [2],
          },
          {
            p: [0],
            q: [2, 4],
          },
          {
            p: [2],
            q: [4],
          },
          {
            p: [1],
            q: [3],
          },
        ]
        logicStrings.forEach((str, idx) => {
          const res = tokenizer.tokenize(str)

          // check that each token was parsed and received properly
          const vals = res.tokens.map((info) => info.value)
          chai.expect(logicParsed[idx]).to.eql(vals)

          // check that all vars present in the order
          const variablesInfo = res.variables
          chai.expect(variables[idx]).to.eql(variablesInfo)
        })
      })

      it("should ignore invalid chars, and continue to parse the string", () => {
        const logicStrings = [
          "!p..",
          "p & q??",
          "p | q => q?.",
          "1!(2p6 54| 3q)11",
          " p      q   ",
        ]
        const logicParsed = [
          ["!", "p"],
          ["p", "&", "q"],
          ["p", "|", "q", "=>", "q"],
          ["!", "(", "p", "|", "q", ")"],
          ["p", "q"],
        ]
        const variables = [
          {
            p: [1],
          },
          {
            p: [0],
            q: [2],
          },
          {
            p: [0],
            q: [2, 4],
          },
          {
            p: [2],
            q: [4],
          },
          {
            p: [0],
            q: [1],
          },
        ]
        logicStrings.forEach((str, idx) => {
          const res = tokenizer.tokenize(str)

          // check that each token was parsed and received properly
          const vals = res.tokens.map((info) => info.value)
          chai.expect(logicParsed[idx]).to.eql(vals)

          // check that all vars present in the order
          const variablesInfo = res.variables
          chai.expect(variables[idx]).to.eql(variablesInfo)
        })
      })
    })
  })
  describe("Syntax tree", () => {
    const tokenizer = new Tokenizer()
    describe("SyntaxTree.toObj", () => {
      it("should generate an accurate syntax tree", () => {
        const logicStrings = [
          "!p",
          "p & q",
          "p | q => q",
          "!(p | q)",
          "!p <=> q",
        ]

        const treeObjects = [
          {
            value: "!",
            type: LogicTokenType.OPERATOR,
            left: {},
            right: {
              value: "p",
              type: LogicTokenType.VARIABLE,
              left: {},
              right: {},
            },
          },
          {
            value: "&",
            type: LogicTokenType.OPERATOR,
            left: {
              value: "p",
              type: LogicTokenType.VARIABLE,
              left: {},
              right: {},
            },
            right: {
              value: "q",
              type: LogicTokenType.VARIABLE,
              left: {},
              right: {},
            },
          },
          {
            value: "=>",
            type: LogicTokenType.OPERATOR,
            left: {
              value: "|",
              type: LogicTokenType.OPERATOR,
              left: {
                value: "p",
                type: LogicTokenType.VARIABLE,
                left: {},
                right: {},
              },
              right: {
                value: "q",
                type: LogicTokenType.VARIABLE,
                left: {},
                right: {},
              },
            },
            right: {
              value: "q",
              type: LogicTokenType.VARIABLE,
              left: {},
              right: {},
            },
          },
          {
            value: "!",
            type: LogicTokenType.OPERATOR,
            left: {},
            right: {
              value: "|",
              type: LogicTokenType.OPERATOR,
              left: {
                value: "p",
                type: LogicTokenType.VARIABLE,
                left: {},
                right: {},
              },
              right: {
                value: "q",
                type: LogicTokenType.VARIABLE,
                left: {},
                right: {},
              },
            },
          },
          {
            left: {
              left: {},
              right: {
                left: {},
                right: {},
                type: "VAR",
                value: "p",
              },
              type: "OP",
              value: "!",
            },
            right: {
              left: {},
              right: {},
              type: "VAR",
              value: "q",
            },
            type: "OP",
            value: "<=>",
          },
        ]

        logicStrings.forEach((str, idx) => {
          const res = tokenizer.tokenize(str)
          const tree = new SyntaxTree(res.tokens)
          const node = tree.build()
          const stringified = tree.toObj(node)

          const correct = treeObjects[idx]
          chai.expect(stringified).to.eql(correct)
        })
      })
    })
    describe("SyntaxTree.eval", () => {
      it("should evaluate logic expressions correctly", () => {
        const logicStrings = ["p & q", "(p => q) => r"]

        // one array per logicString
        // each array will contain objects
        const checkers = [
          [
            { mask: { p: false, q: false }, answer: false },
            { mask: { p: false, q: true }, answer: false },
            { mask: { p: true, q: false }, answer: false },
            { mask: { p: true, q: true }, answer: true },
          ],
          [
            { mask: { p: false, q: false, r: false }, answer: false },
            { mask: { p: false, q: false, r: true }, answer: true },
            { mask: { p: false, q: true, r: false }, answer: false },
            { mask: { p: false, q: true, r: true }, answer: true },
            { mask: { p: true, q: false, r: false }, answer: true },
            { mask: { p: true, q: false, r: true }, answer: true },
            { mask: { p: true, q: true, r: false }, answer: false },
            { mask: { p: true, q: true, r: true }, answer: true },
          ],
        ]

        logicStrings.forEach((str, idx) => {
          const res = tokenizer.tokenize(str)
          const tree = new SyntaxTree(res.tokens)
          const node = tree.build()
          checkers[idx].forEach((obj) => {
            const evaluated = tree.eval(node, obj.mask)
            chai.expect(evaluated).to.equal(obj.answer)
          })
        })
      })
    })
  })

  describe("Truth table generator", () => {
    describe("TruthTableGenerator.generate", () => {
      const tokenizer = new Tokenizer()
      it("should correctly evaluate truth table, given a tokenized expression and variable info", () => {
        const logicStrings = [
          "!p",
          "p & q",
          "!(p | q)",
          "(p => q) => r",
          "!p <=> q",
        ]

        const answers = [
          { booleans: [[false], [true]], answers: [true, false] },
          {
            booleans: [
              [false, false],
              [false, true],
              [true, false],
              [true, true],
            ],
            answers: [false, false, false, true],
          },
          {
            booleans: [
              [false, false],
              [false, true],
              [true, false],
              [true, true],
            ],
            answers: [true, false, false, false],
          },
          {
            booleans: [
              [false, false, false],
              [false, false, true],
              [false, true, false],
              [false, true, true],
              [true, false, false],
              [true, false, true],
              [true, true, false],
              [true, true, true],
            ],
            answers: [false, true, false, true, true, true, false, true],
          },
          {
            answers: [false, true, true, false],
            booleans: [
              [false, false],
              [false, true],
              [true, false],
              [true, true],
            ],
          },
        ]

        logicStrings.forEach((logicExpr, idx) => {
          const res = tokenizer.tokenize(logicExpr)
          const generator = new TruthTableGenerator(res)
          const resGen = generator.generate()

          chai.expect(resGen).to.eql(answers[idx])
        })
      })
    })
  })
}

// standard testing modules
import chai from "chai"

// import stuff to be tested
import Tokenizer from "../../classes/logic/Tokenizer"
import SyntaxTree from "../../classes/logic/SyntaxTree"

export default () => {
  describe("Tokenizer", () => {
    describe("Tokenizer.tokenize", () => {
      const tokenizer = new Tokenizer()

      it("should parse strings without invalid chars properly", () => {
        const logicStrings = ["!p", "p & q", "p | q => q", "!(p | q)"]
        const logicParsed = [
          ["!", "p"],
          ["p", "&", "q"],
          ["p", "|", "q", "=>", "q"],
          ["!", "(", "p", "|", "q", ")"],
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
        const logicStrings = ["!p", "p & q", "p | q => q", "!(p | q)"]

        const treeObjects = [
          {
            cur: "!",
            left: {},
            right: {
              cur: "p",
              left: {},
              right: {},
            },
          },
          {
            cur: "&",
            left: {
              cur: "p",
              left: {},
              right: {},
            },
            right: {
              cur: "q",
              left: {},
              right: {},
            },
          },
          {
            cur: "=>",
            left: {
              cur: "|",
              left: {
                cur: "p",
                left: {},
                right: {},
              },
              right: {
                cur: "q",
                left: {},
                right: {},
              },
            },
            right: {
              cur: "q",
              left: {},
              right: {},
            },
          },
          {
            cur: "!",
            left: {},
            right: {
              cur: "|",
              left: {
                cur: "p",
                left: {},
                right: {},
              },
              right: {
                cur: "q",
                left: {},
                right: {},
              },
            },
          },
        ]

        logicStrings.forEach((str, idx) => {
          const res = tokenizer.tokenize(str)
          const tree = new SyntaxTree(res)
          const node = tree.build()
          const stringified = tree.toObj(node)

          const correct = treeObjects[idx]
          chai.expect(stringified).to.eql(correct)
        })
      })
    })
  })
}

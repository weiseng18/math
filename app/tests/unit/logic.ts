// standard testing modules
import chai from "chai"

// import stuff to be tested
import Parser from "../../classes/logic/Parser"

export default () => {
  describe("Parser", () => {
    describe("Parser.tokenize", () => {
      const parser = new Parser()

      it("should parse strings without invalid chars properly", () => {
        const logicStrings = ["!p", "p & q", "p | q => q", "!(p | q)"]
        const logicParsed = [
          ["!", "p"],
          ["p", "&", "q"],
          ["p", "|", "q", "=>", "q"],
          ["!", "(", "p", "|", "q", ")"],
        ]
        logicStrings.forEach((str, idx) => {
          const res = parser.tokenize(str)
          const vals = res.map((info) => info.value)
          chai.expect(logicParsed[idx]).to.eql(vals)
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
        logicStrings.forEach((str, idx) => {
          const res = parser.tokenize(str)
          const vals = res.map((info) => info.value)
          chai.expect(logicParsed[idx]).to.eql(vals)
        })
      })
    })
  })
}

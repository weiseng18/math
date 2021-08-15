// standard testing modules
import chai from "chai"

// import stuff to be tested
import Tokenizer from "../../classes/logic/Tokenizer"

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
        logicStrings.forEach((str, idx) => {
          const res = tokenizer.tokenize(str)
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
          const res = tokenizer.tokenize(str)
          const vals = res.map((info) => info.value)
          chai.expect(logicParsed[idx]).to.eql(vals)
        })
      })
    })
  })
}

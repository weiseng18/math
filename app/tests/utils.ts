// standard testing modules
import chai from "chai"

import { range } from "../utils/misc"

// import utils to be tested
import { isZeroRow } from "../utils/Matrix"

describe("Util tests", () => {
  describe("Matrix: isZeroRow", () => {
    it("should return true for zero array", () => {
      const res = range(5).every((val) => {
        // create zero array with length val+1
        const tmp = []
        for (let i = 0; i < val + 1; i++) tmp.push(0)
        return isZeroRow(tmp)
      })
      chai.expect(res).to.equal(true)
    })
    it("should return false for non-zero array", () => {
      const nonZeroArrays = [[1, 2, 3], [0, 0, 1], [1]]
      nonZeroArrays.forEach((arr) => {
        const res = isZeroRow(arr)
        chai.expect(res).to.equal(false)
      })
    })
  })
})

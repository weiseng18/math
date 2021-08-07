// standard testing modules
import chai from "chai"

// import utils to be tested
import { range } from "../../utils/misc"
import { isZeroRow, leadingEntryIndex } from "../../utils/Matrix"

describe("Util tests", () => {
  describe("Misc: range", () => {
    it("should return an array of length N", () => {
      const res = range(5).every((val) => {
        return range(val + 1).length === val + 1
      })
      chai.expect(res).to.equal(true)
    })
  })

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

  describe("Matrix: leadingEntryIndex", () => {
    it("should return index of the first nonzero entry", () => {
      const arrays = [[1, 2, 3], [0, 0, 1], [1]]
      const ans = [0, 2, 0]

      arrays.forEach((arr, idx) => {
        const res = leadingEntryIndex(arr)
        chai.expect(res).to.equal(ans[idx])
      })
    })
    it("should return -1 for zero arrays", () => {
      const res = range(5).every((val) => {
        // create zero array with length val+1
        const tmp = []
        for (let i = 0; i < val + 1; i++) tmp.push(0)
        return leadingEntryIndex(tmp) === -1
      })
      chai.expect(res).to.equal(true)
    })
  })
})

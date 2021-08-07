// standard testing modules
import chai from "chai"

import { EchelonType } from "../../types/Matrix"

// import stuff to be tested
import { Matrix } from "../../classes/Matrix"

export default () => {
  describe("echelonStatus", () => {
    it("should return RREF correctly", () => {
      const matrices = [
        [
          [1, 0, 0],
          [0, 1, 0],
        ],
        [
          [0, 0],
          [0, 0],
          [0, 0],
        ],
      ]

      const res = matrices.every((arr) => {
        const matrix = new Matrix({
          rows: arr.length,
          columns: arr[0].length,
          entries: arr,
        })
        const status = matrix.echelonStatus()
        return status == EchelonType.RREF
      })

      chai.expect(res).to.equal(true)
    })
    it("should return REF correctly", () => {
      const matrices = [
        [
          [1, 0, 0],
          [0, 2, 0],
        ],
        [
          [1, 1, 3],
          [0, 2, 0],
        ],
        [
          [1, 0, 3],
          [0, 0, 1],
        ],
      ]

      const res = matrices.every((arr) => {
        const matrix = new Matrix({
          rows: arr.length,
          columns: arr[0].length,
          entries: arr,
        })
        const status = matrix.echelonStatus()
        return status == EchelonType.REF
      })

      chai.expect(res).to.equal(true)
    })
    it("should return NONE correctly", () => {
      const matrices = [
        [
          [0, 0, 0],
          [1, 0, 3],
          [0, 0, 0],
        ],
        [
          [0, 1, 0],
          [1, 0, 3],
          [0, 0, 0],
        ],
      ]

      const res = matrices.every((arr) => {
        const matrix = new Matrix({
          rows: arr.length,
          columns: arr[0].length,
          entries: arr,
        })
        const status = matrix.echelonStatus()
        return status == EchelonType.NONE
      })

      chai.expect(res).to.equal(true)
    })
  })
}

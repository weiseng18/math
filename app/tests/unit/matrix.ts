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

      matrices.forEach((arr) => {
        const matrix = new Matrix({
          rows: arr.length,
          columns: arr[0].length,
          entries: arr,
        })
        const status = matrix.echelonStatus()
        chai.expect(status).to.equal(EchelonType.RREF)
      })
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

      matrices.forEach((arr) => {
        const matrix = new Matrix({
          rows: arr.length,
          columns: arr[0].length,
          entries: arr,
        })
        const status = matrix.echelonStatus()
        chai.expect(status).to.equal(EchelonType.REF)
      })
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

      matrices.forEach((arr) => {
        const matrix = new Matrix({
          rows: arr.length,
          columns: arr[0].length,
          entries: arr,
        })
        const status = matrix.echelonStatus()
        chai.expect(status).to.equal(EchelonType.NONE)
      })
    })
  })
}

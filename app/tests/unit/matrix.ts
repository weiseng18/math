// standard testing modules
import chai from "chai"

import { EchelonType } from "../../types/Matrix"
import { range } from "../../utils/misc"

// import stuff to be tested
import { Matrix, SquareMatrix } from "../../classes/Matrix"

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

  describe("Row operations", () => {
    describe("multiplyRow", () => {
      it("should multiply a row by a factor correctly", () => {
        const matrix = new Matrix({
          rows: 3,
          columns: 3,
          entries: [
            [1, 2, 3],
            [1, 0, 0],
            [0, 1, 0],
          ],
        })

        // tests
        const inputs = [
          { rowIdx: 0, factor: 2 },
          { rowIdx: 1, factor: 1 },
          { rowIdx: 2, factor: -1 },
        ]
        const outputs = [
          [2, 4, 6],
          [1, 0, 0],
          [-0, -1, -0],
        ]

        inputs.forEach((options, idx) => {
          matrix.multiplyRow(options.rowIdx, options.factor)
          chai.expect(matrix.entries[options.rowIdx]).to.eql(outputs[idx])
        })
      })
    })
    describe("swapRows", () => {
      it("should swap rows correctly", () => {
        const matrix = new Matrix({
          rows: 3,
          columns: 3,
          entries: [
            [1, 2, 3],
            [1, 0, 0],
            [0, 1, 0],
          ],
        })

        // tests
        const inputs = [
          { rowOne: 0, rowTwo: 2 },
          { rowOne: 1, rowTwo: 0 },
        ]
        const outputs = [
          {
            newRowOne: [0, 1, 0],
            newRowTwo: [1, 2, 3],
          },
          {
            newRowOne: [0, 1, 0],
            newRowTwo: [1, 0, 0],
          },
        ]

        inputs.forEach((options, idx) => {
          matrix.swapRows(options.rowOne, options.rowTwo)
          chai
            .expect(matrix.entries[options.rowOne])
            .to.eql(outputs[idx].newRowOne)
          chai
            .expect(matrix.entries[options.rowTwo])
            .to.eql(outputs[idx].newRowTwo)
        })
      })
    })
    describe("addMultiple", () => {
      it("should add a multiple of one row to another row correctly", () => {
        const matrix = new Matrix({
          rows: 3,
          columns: 3,
          entries: [
            [1, 2, 3],
            [1, 0, 0],
            [0, 1, 0],
          ],
        })

        // tests
        const inputs = [
          { baseRowIdx: 0, factor: 1, addToIdx: 2 },
          { baseRowIdx: 1, factor: 2, addToIdx: 0 },
        ]
        const outputs = [
          [1, 3, 3],
          [3, 2, 3],
        ]

        inputs.forEach((options, idx) => {
          matrix.addMultiple(
            options.baseRowIdx,
            options.factor,
            options.addToIdx
          )
          chai.expect(matrix.entries[options.addToIdx]).to.eql(outputs[idx])
        })
      })
    })
  })

  describe("toREF", () => {
    it("should correctly reduce a matrix to REF", () => {
      const matrices = [
        [
          [1, 2, 3],
          [2, 3, 4],
          [3, 4, 5],
        ],
        [
          [1, 0, 0],
          [0, 3, 0],
          [0, 0, 2],
        ],
      ]
      matrices.forEach((array) => {
        const matrix = new Matrix({
          rows: array.length,
          columns: array[0].length,
          entries: array,
        })
        const actions = matrix.toREF()
        const res = matrix.echelonStatus()
        chai.expect(res).to.not.equal(EchelonType.NONE)
      })
    })
  })

  describe("toREF", () => {
    it("should correctly reduce a matrix to RREF", () => {
      const matrices = [
        [
          [1, 2, 3],
          [2, 3, 4],
          [3, 4, 5],
        ],
        [
          [1, 0, 0],
          [0, 3, 0],
          [0, 0, 2],
        ],
      ]
      matrices.forEach((array) => {
        const matrix = new Matrix({
          rows: array.length,
          columns: array[0].length,
          entries: array,
        })
        const actions = matrix.toRREF()
        const res = matrix.echelonStatus()
        chai.expect(res).to.equal(EchelonType.RREF)
      })
    })
  })

  describe("isIdentity", () => {
    it("should return true for identity matrices", () => {
      range(5).forEach((val) => {
        const length = val + 1
        // create identity matrix of size length
        const matrix = new SquareMatrix({ rows: length, columns: length })
        range(length).forEach((i) => {
          matrix.entries[i][i] = 1
        })
        // check
        const res = matrix.isIdentity()
        chai.expect(res).to.equal(true)
      })
    })
    it("should return false for non-identity matrices", () => {
      const matrices = [
        [
          [1, 2, 3],
          [2, 3, 4],
          [3, 4, 5],
        ],
        [
          [1, 0, 0],
          [0, 3, 0],
          [0, 0, 2],
        ],
      ]
      matrices.forEach((arr) => {
        const matrix = new SquareMatrix({
          rows: arr.length,
          columns: arr.length,
          entries: arr,
        })
        // check
        const res = matrix.isIdentity()
        chai.expect(res).to.equal(false)
      })
    })
  })
}

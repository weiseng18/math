import { range } from "../utils/misc"

import { EchelonType, RowOperation } from "../types/Matrix"
import { leadingEntryIndex } from "../utils/Matrix"

import * as _ from "lodash"

interface IMatrix {
  rows: number
  columns: number
  entries?: Array<Array<number>>
}

abstract class BaseMatrix {
  rows: number
  columns: number
  entries?: Array<Array<number>>

  constructor(props: IMatrix) {
    this.rows = props.rows
    this.columns = props.columns

    if (props.entries) this.entries = props.entries
    else {
      // initialize a zero matrix
      let tmp = [],
        row = []
      for (let i = 0; i < this.columns; i++) row.push(0)
      for (let i = 0; i < this.rows; i++) tmp.push([...row])
      this.entries = tmp
    }
  }

  /**
   * Returns whether a matrix is in RREF, REF, or NONE.
   */
  echelonStatus(): EchelonType {
    // obtain array of leading entry indices
    let leadingIndices: number[] = []
    this.entries.forEach((row) => {
      const leadingIndex = leadingEntryIndex(row)
      leadingIndices.push(leadingIndex)
    })

    // remove all end -1s as they are extra zero rows at the bottom of the matrix
    while (
      leadingIndices.length > 0 &&
      leadingIndices[leadingIndices.length - 1] === -1
    )
      leadingIndices.pop()

    // Check 1a: if there are still non-zero rows, this means they are not at the bottom, so return NONE
    if (leadingIndices.some((one) => one === -1)) return EchelonType.NONE

    // Check 1b: if leadingEntryIndices not in increasing order, return NONE
    let idx = 1
    while (idx < this.rows) {
      if (leadingIndices[idx - 1] >= leadingIndices[idx])
        return EchelonType.NONE
      idx++
    }

    // reaching here means is either REF or RREF

    // Check 2: if leadingIndices has no more entries (i.e. was all -1s), this is a zero matrix, and is RREF
    if (leadingIndices.length === 0) return EchelonType.RREF

    // Check 3: For RREF, all leading entries of nonzero rows should be 1
    const allLeadingOne = leadingIndices.every(
      (colIdx, rowIdx) => this.entries[rowIdx][colIdx] === 1
    )
    if (!allLeadingOne) return EchelonType.REF

    // Check 4: For RREF, the only nonzero value in a pivot column is the pivot point
    const pivotColumnsCheck = leadingIndices.every((colIdx, idx) => {
      const res = range(this.rows).every((rowIdx) => {
        // if the leading index found previously belongs to this row
        if (idx == rowIdx) return true

        return this.entries[rowIdx][colIdx] === 0
      })
      return res
    })
    if (!pivotColumnsCheck) return EchelonType.REF

    // reaching here means RREF
    return EchelonType.RREF
  }

  /**
   * Multiplies a row by a given factor
   * @param rowIdx row index number
   * @param factor factor to multiply by
   */
  multiplyRow(rowIdx: number, factor: number) {
    this.entries[rowIdx] = this.entries[rowIdx].map((one) => factor * one)
  }

  /**
   * Swaps rows i and j
   * @param i row index number
   * @param j row index number
   */
  swapRows(i: number, j: number) {
    const tmp = this.entries[i]
    this.entries[i] = this.entries[j]
    this.entries[j] = tmp
  }

  /**
   * Adds a multiple of one row to another row
   * @param rowIdx index of the row to multiply factor
   * @param factor factor to multiply by
   * @param addToIdx index of the row to add to
   */
  addMultiple(rowIdx: number, factor: number, addToIdx: number) {
    range(this.columns).forEach((colIdx) => {
      this.entries[addToIdx][colIdx] += this.entries[rowIdx][colIdx] * factor
    })
  }

  /**
   * Returns true if every entry in column colIdx, below and inclusive of row startRow is 0, false otherwise
   * @param startRow highest row to start checking from
   * @param colIdx index of the column
   */
  isZeroColumnBelowRow(colIdx: number, startRow: number = 0) {
    return range(this.rows - startRow).every(
      (rowIdx) => this.entries[rowIdx + startRow][colIdx] === 0
    )
  }

  /**
   * Reduces the matrix to REF
   */
  toREF() {
    let actions = [] // array of actions done during REF

    actions.push({
      action: RowOperation.NONE,
      params: [],
      matrix: _.cloneDeep(this.entries),
    })

    let colIdx = 0 // leftmost nonzero column idx
    let rowsDone = 0 // number of rows done

    while (this.echelonStatus() === EchelonType.NONE) {
      // find next nonzero column
      let foundColumn = false
      while (!foundColumn && colIdx < this.columns) {
        // remember to exclude the top rows as they are done
        if (this.isZeroColumnBelowRow(colIdx, rowsDone)) colIdx++
        else foundColumn = true
      }

      if (foundColumn) {
        let firstEntryRowIdx = -1
        // find first nonzero entry in column, that is excluding the done rows
        for (let i = rowsDone; i < this.rows; i++)
          if (this.entries[i][colIdx] !== 0) {
            firstEntryRowIdx = i
            break
          }

        // swap top row with this row
        if (rowsDone !== firstEntryRowIdx) {
          this.swapRows(rowsDone, firstEntryRowIdx)
          actions.push({
            action: RowOperation.SWAP,
            params: [rowsDone, firstEntryRowIdx],
            matrix: _.cloneDeep(this.entries),
          })
        }

        // add multiple of top row to every other row below
        const pivotValue = this.entries[rowsDone][colIdx]
        for (let i = rowsDone + 1; i < this.rows; i++) {
          const factor = (this.entries[i][colIdx] / pivotValue) * -1
          this.addMultiple(rowsDone, factor, i)
          actions.push({
            action: RowOperation.ADD_MULTIPLE,
            params: [rowsDone, factor, i],
            matrix: _.cloneDeep(this.entries),
          })
        }

        // mark as done
        rowsDone++
        colIdx++
      } else {
        break
      }
    }

    return actions
  }

  /**
   * Reduces the matrix to RREF
   */
  toRREF() {
    let actions = this.toREF()

    // make all leading entries 1
    this.entries.forEach((row, rowIdx) => {
      const colIdx = leadingEntryIndex(row)
      if (colIdx !== -1) {
        const leadingVal = row[colIdx]
        const factor = 1 / leadingVal
        if (factor !== 1) {
          this.multiplyRow(rowIdx, factor)
          actions.push({
            action: RowOperation.MULTIPLY_ROW,
            params: [rowIdx, factor],
            matrix: _.cloneDeep(this.entries),
          })
        }
      }
    })

    // add multiples to rows above
    for (let i = this.rows - 1; i >= 0; i--) {
      const colIdx = leadingEntryIndex(this.entries[i])
      if (colIdx === -1) continue

      for (let j = i - 1; j >= 0; j--) {
        const factor = -this.entries[j][colIdx]
        if (factor !== 0) {
          this.addMultiple(i, factor, j)
          actions.push({
            action: RowOperation.ADD_MULTIPLE,
            params: [i, factor, j],
            matrix: _.cloneDeep(this.entries),
          })
        }
      }
    }

    return actions
  }
}

class Matrix extends BaseMatrix {
  constructor(props: IMatrix) {
    super(props)
  }
}

class SquareMatrix extends BaseMatrix {
  constructor(props: IMatrix) {
    if (props.rows != props.columns)
      throw new Error("Row and column counts do not match")
    super(props)
  }

  calcDeterminant() {
    // base case
    if (this.rows == 1) return this.entries[0][0]

    let determinant = 0
    for (let k = 0; k < this.columns; k++) {
      // (n-1) by (n-1) matrix that excludes row 1 and column k
      const mat = new SquareMatrix({
        rows: this.rows - 1,
        columns: this.columns - 1,
      })
      // copy respective rows and columns
      for (let i = 1; i < this.rows; i++)
        for (let j = 0; j < this.columns; j++) {
          if (j == k) continue
          const col = j > k ? j - 1 : j
          mat.entries[i - 1][col] = this.entries[i][j]
        }
      // determine whether to add or subtract
      const sign = k % 2 ? -1 : 1

      // sum up
      determinant += sign * this.entries[0][k] * mat.calcDeterminant()
    }

    return determinant
  }

  /**
   * Checks if the matrix is the identity matrix.
   * @returns boolean
   */
  isIdentity() {
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.columns; j++) {
        if (i == j && this.entries[i][j] !== 1) return false
        else if (i != j && this.entries[i][j] !== 0) return false
      }
    return true
  }

  /**
   * Calculates the inverse matrix of the current matrix.
   *
   * It performs RREF on the current matrix, obtaining the actions array.
   * The actions array describes the row operations done to perform RREF.
   * The same actions are played onto an identity matrix, giving us the inverse matrix.
   */
  inverse() {
    // if matrix is singular, throw error that the matrix is singular
    if (this.calcDeterminant() === 0)
      throw new Error("Matrix is singular; No inverse exists")

    const rrefActions = this.toRREF()

    // create identity matrix
    const identity = new SquareMatrix({
      rows: this.rows,
      columns: this.columns,
    })
    range(this.rows).forEach((i) => {
      identity.entries[i][i] = 1
    })

    // play the actions onto the identity matrix, while storing the intermediate states
    let actions: {
      inverse: number[][]
      action: RowOperation
      params: number[]
      matrix: number[][]
    }[] = []

    rrefActions.forEach((step) => {
      // what action to perform onto the identity matrix
      const actionToPerform = step.action
      const params = step.params
      if (actionToPerform === RowOperation.ADD_MULTIPLE) {
        identity.addMultiple(params[0], params[1], params[2])
      } else if (actionToPerform === RowOperation.MULTIPLY_ROW) {
        identity.multiplyRow(params[0], params[1])
      } else if (actionToPerform === RowOperation.SWAP) {
        identity.swapRows(params[0], params[1])
      }

      // copied action object, adding inverse
      const newAction = {
        ...step,
        inverse: _.cloneDeep(identity.entries),
      }
      actions.push(newAction)
    })

    this.entries = identity.entries
    return actions
  }
}

export { Matrix, SquareMatrix }

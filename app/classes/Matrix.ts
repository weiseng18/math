import { range } from "../utils/misc"

import { EchelonType } from "../types/Matrix"
import { leadingEntryIndex } from "../utils/Matrix"

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

    // Check 1b: if leadingEntryIndices not in non-decreasing order, return NONE
    let idx = 1
    while (idx < this.rows) {
      if (leadingIndices[idx - 1] > leadingIndices[idx]) return EchelonType.NONE
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
}

export { Matrix, SquareMatrix }

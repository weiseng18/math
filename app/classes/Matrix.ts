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

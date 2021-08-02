interface IMatrix {
  rows: number
  columns: number
  entries: Array<Array<number>>
}

abstract class BaseMatrix {
  rows: number
  columns: number
  entries: Array<Array<number>>

  constructor(props: IMatrix) {
    this.rows = props.rows
    this.columns = props.columns
    this.entries = props.entries
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
    if (this.rows == 2) {
      return (
        this.entries[0][0] * this.entries[1][1] -
        this.entries[0][1] * this.entries[1][0]
      )
    } else {
      throw new Error("Unsupported")
    }
  }
}

export { Matrix, SquareMatrix }

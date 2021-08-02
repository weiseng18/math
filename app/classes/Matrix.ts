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
  rows: number
  columns: number
  entries: Array<Array<number>>

  constructor(props: IMatrix) {
    super(props)
  }
}

class SquareMatrix extends BaseMatrix {
  rows: number
  columns: number
  entries: Array<Array<number>>

  constructor(props: IMatrix) {
    if (props.rows != props.columns)
      throw new Error("Row and column counts do not match")
    super(props)
  }
}

export { Matrix, SquareMatrix }

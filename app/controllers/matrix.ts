import { VercelRequest, VercelResponse } from "@vercel/node"

import { Matrix, SquareMatrix } from "../classes/Matrix"

const calcDeterminant = (req: VercelRequest, res: VercelResponse) => {
  try {
    let matrix
    // string array
    if (Array.isArray(req.query.matrix))
      matrix = JSON.parse(req.query.matrix.join())
    else matrix = JSON.parse(req.query.matrix)

    const rows = matrix.length
    const cols = matrix[0].length

    const squareMatrix = new SquareMatrix({
      rows,
      columns: cols,
      entries: matrix,
    })

    // can assume square matrix
    const determinant = squareMatrix.calcDeterminant()
    res.json(determinant)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const reduceRREF = (req: VercelRequest, res: VercelResponse) => {
  try {
    let arr
    // string array
    if (Array.isArray(req.query.matrix))
      arr = JSON.parse(req.query.matrix.join())
    else arr = JSON.parse(req.query.matrix)

    const rows = arr.length
    const cols = arr[0].length

    const matrix = new Matrix({
      rows,
      columns: cols,
      entries: arr,
    })

    const actions = matrix.toRREF()
    res.json({
      actions,
      matrix: matrix.entries,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default {
  calcDeterminant,
  reduceRREF,
}

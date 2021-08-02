import { VercelRequest, VercelResponse } from "@vercel/node"

import { SquareMatrix } from "../classes/Matrix"

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
    if (rows == 2) {
      const determinant =
        squareMatrix.entries[0][0] * squareMatrix.entries[1][1] -
        squareMatrix.entries[0][1] * squareMatrix.entries[1][0]
      res.json(determinant)
    } else {
      throw new Error("Unsupported")
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default {
  calcDeterminant,
}

import { VercelRequest, VercelResponse } from "@vercel/node"
import * as _ from "lodash"

import { Matrix, SquareMatrix } from "app/classes/Matrix"

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
    const errorCode = _.get(err, "code", 500)
    res.status(errorCode).json({ message: err.message })
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
    const errorCode = _.get(err, "code", 500)
    res.status(errorCode).json({ message: err.message })
  }
}

const calcInverse = (req: VercelRequest, res: VercelResponse) => {
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

    const actions = squareMatrix.inverse()
    res.json({
      actions,
      matrix: squareMatrix.entries,
    })
  } catch (err) {
    const errorCode = _.get(err, "code", 500)
    res.status(errorCode).json({ message: err.message })
  }
}

const echelonStatus = (req: VercelRequest, res: VercelResponse) => {
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

    const status = matrix.echelonStatus()
    res.json({
      type: status,
    })
  } catch (err) {
    const errorCode = _.get(err, "code", 500)
    res.status(errorCode).json({ message: err.message })
  }
}

export default {
  calcDeterminant,
  reduceRREF,
  calcInverse,
  echelonStatus,
}

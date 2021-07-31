const calcDeterminant = (req, res) => {
  const matrix = JSON.parse(req.query.matrix)

  const rows = matrix.length
  const cols = matrix[0].length

  if (rows !== cols) {
    res.status(500).json({ message: "Row and column counts do not match" })
  }

  // can assume square matrix
  if (rows == 2) {
    const determinant =
      matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    res.json(determinant)
  } else {
    res.status(500).json({ message: "Unsupported" })
  }
}

module.exports = { calcDeterminant }

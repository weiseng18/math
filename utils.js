/**
 * Converts Javascript 2D array into a string that represents the matrix in Latex.
 * @param {*} array 2-dimensional array
 * @returns Escaped Latex string
 */
const convert2DArrayToMatrix = (array) => {
  const rowCount = array.length

  const prefix = "\\begin{pmatrix}"
  const suffix = "\\end{pmatrix}"

  let mathString = prefix
  array.forEach((row, idx) => {
    const string = row.join(" & ")
    const lineBreak = idx == rowCount - 1 ? "" : "\\\\"
    mathString += string + lineBreak
  })
  mathString += suffix

  return mathString
}

export { convert2DArrayToMatrix }

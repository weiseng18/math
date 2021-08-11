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

/**
 * Converts two Javascript 2D arrays into a string that represents the augmented matrix in Latex.
 * @param {*} left 2-dimensional array
 * @param {*} right 2-dimensional array
 * @returns Escaped Latex string
 */
const convert2DArraysToAugmentedMatrix = (left, right) => {
  const rowCount = left.length

  const leftColCount = left[0].length
  const rightColCount = right[0].length

  // define augmented matrix environment
  const env =
    "\\newenvironment{sysmatrix}[1]{\\left(\\begin{array}{@{}#1@{}}}{\\end{array}\\right)}"

  const prefix = "\\begin{sysmatrix}"
  const suffix = "\\end{sysmatrix}"

  let columns = "{"
  for (let i = 0; i < leftColCount; i++) columns += "c"
  columns += "|"
  for (let i = 0; i < rightColCount; i++) columns += "c"
  columns += "}"

  let mathString = env + prefix + columns
  left.forEach((row, idx) => {
    const leftString = row.join(" & ")
    const rightString = right[idx].join(" & ")
    const lineBreak = idx == rowCount - 1 ? "" : "\\\\"
    mathString += leftString + " & " + rightString + lineBreak
  })
  mathString += suffix

  return mathString
}

export { convert2DArrayToMatrix, convert2DArraysToAugmentedMatrix }

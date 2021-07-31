import Test from "../../methods/test"
import Matrix from "../../methods/matrix"

const app = require("express")()

app.get("/api/test", Test.test)

/**
 * Calculates the determinant of a square matrix
 *
 * @param {*} matrix 2D Javascript array
 */
app.get("/api/matrix/determinant", Matrix.calcDeterminant)

module.exports = app

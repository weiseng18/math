import Test from "../../app/controllers/test"
import Matrix from "../../app/controllers/matrix"

const app = require("express")()

app.get("/api/test", Test.test)

/**
 * Calculates the determinant of a square matrix
 *
 * @param {*} matrix 2D Javascript array
 */
app.get("/api/matrix/determinant", Matrix.calcDeterminant)

module.exports = app

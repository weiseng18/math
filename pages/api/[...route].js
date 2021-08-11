import Test from "app/controllers/test"
import Matrix from "app/controllers/matrix"

const app = require("express")()

app.get("/api/test", Test.test)

app.get("/api/matrix/determinant", Matrix.calcDeterminant)
app.get("/api/matrix/rref", Matrix.reduceRREF)
app.get("/api/matrix/inverse", Matrix.calcInverse)

module.exports = app

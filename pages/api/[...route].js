import Test from "app/controllers/test"
import Matrix from "app/controllers/matrix"
import Logic from "app/controllers/logic"

const app = require("express")()

app.get("/api/test", Test.test)

app.get("/api/matrix/determinant", Matrix.calcDeterminant)
app.get("/api/matrix/rref", Matrix.reduceRREF)
app.get("/api/matrix/inverse", Matrix.calcInverse)
app.get("/api/matrix/status", Matrix.echelonStatus)

app.get("/api/logic/truthTable", Logic.generateTruthTable)

module.exports = app

const app = require("express")()

app.get("/api/test", (req, res) => {
  res.send("API call successful")
})

module.exports = app

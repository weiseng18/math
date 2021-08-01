// standard testing modules
const chai = require("chai")
const chaiHttp = require("chai-http")

// modules that help testing serverless functions
const { createServer } = require("vercel-node-server")
const listen = require("test-listen")

// import methods to be tested
const Test = require("../app/methods/test")
const Matrix = require("../app/methods/matrix")

// beforeEach management
let route, method, server, url

let testIndex = 0
const toTest = [
  {
    route: "/test",
    method: Test.test,
  },
  {
    route: "/matrix/determinant",
    method: Matrix.calcDeterminant,
  },
]

chai.use(chaiHttp)

describe("API tests", () => {
  const start = async () => {
    const testInfo = toTest[testIndex]

    route = testInfo.route
    method = testInfo.method
    server = createServer(method)
    url = await listen(server)

    testIndex++
  }

  const stop = () => {
    server.close()
  }

  describe("/api/test", () => {
    before(start)
    after(stop)

    it("should return successful", async () => {
      await chai
        .request(url)
        .get(route)
        .then((res) => {
          chai.expect(res.statusCode).to.equal(200)
          chai.expect(res.text).to.equal("API call successful")
        })
    })
  })

  describe("/api/matrix/determinant", () => {
    before(start)
    after(stop)

    it("should return determinant of 2 by 2 matrix", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,2],[3,4]]",
        })
        .then((res) => {
          chai.expect(res.statusCode).to.equal(200)
          chai.expect(res.body).to.equal(-2)
        })
    })
    it("should not return determinant of 3 by 3 matrix", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,2,3],[4,5,6],[7,8,9]]",
        })
        .then((res) => {
          chai.expect(res.statusCode).to.equal(500)
          chai.expect(res.body.message).to.equal("Unsupported")
        })
    })
  })
})

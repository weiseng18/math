// standard testing modules
import chai from "chai"
import chaiHttp from "chai-http"

// modules that help testing serverless functions
import { createServer } from "vercel-node-server"
import listen from "test-listen"

// types
import { Server } from "http"

// import controller methods to be tested
import Test from "app/controllers/test"
import Matrix from "app/controllers/matrix"
import Logic from "app/controllers/logic"

// beforeEach management
let route: string, method, server: Server, url: string

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
  {
    route: "/matrix/inverse",
    method: Matrix.calcInverse,
  },
  {
    route: "/matrix/rref",
    method: Matrix.reduceRREF,
  },
  {
    route: "/logic/truthTable",
    method: Logic.generateTruthTable,
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
          chai.expect(res.status).to.equal(200)
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
          chai.expect(res.status).to.equal(200)
          chai.expect(res.body).to.equal(-2)
        })
    })
    it("should return determinant of 3 by 3 matrix", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,2,3],[4,5,6],[7,8,9]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(200)
          chai.expect(res.body).to.equal(0)
        })
    })
    it("should obtain 400 for 3 by 2 matrix", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,2],[3,4],[5,6]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai
            .expect(res.body.message)
            .to.equal("Row and column counts do not match")
        })
    })
    it("should obtain 400 for 3 by 3 matrix with extra data", async () => {
      // the backend treats this as a 3 by 3 matrix
      // since it takes the number of elements in the 1st row as the number of columns
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,0,0],[0,4,0,1,2],[0,0,2]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Matrix is not rectangle")
        })
    })
    it("should obtain 400 for 3 by 3 matrix with missing data", async () => {
      // the backend treats this as a 3 by 3 matrix
      // since it takes the number of elements in the 1st row as the number of columns
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,0,0],[0,4],[0,0]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Matrix is not rectangle")
        })
    })
  })

  describe("/api/matrix/inverse", () => {
    before(start)
    after(stop)

    it("should return inverse of 3 by 3 matrix", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,0,0],[0,4,0],[0,0,2]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(200)
        })
    })
    it("should obtain 400 for 3 by 2 matrix", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,2],[3,4],[5,6]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai
            .expect(res.body.message)
            .to.equal("Row and column counts do not match")
        })
    })
    it("should obtain 400 for singular square matrix", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,2],[0,0]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai
            .expect(res.body.message)
            .to.equal("Matrix is singular; No inverse exists")
        })
    })
    it("should obtain 400 for 3 by 3 matrix with extra data", async () => {
      // the backend treats this as a 3 by 3 matrix
      // since it takes the number of elements in the 1st row as the number of columns
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,0,0],[0,4,0,1,2],[0,0,2]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Matrix is not rectangle")
        })
    })
    it("should obtain 400 for 3 by 3 matrix with missing data", async () => {
      // the backend treats this as a 3 by 3 matrix
      // since it takes the number of elements in the 1st row as the number of columns
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,0,0],[0,4],[0,0]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Matrix is not rectangle")
        })
    })
  })

  describe("/api/matrix/rref", () => {
    before(start)
    after(stop)

    it("should successfully perform rref", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,0,0],[0,4,0],[0,0,2]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(200)
        })
    })
    it("should obtain 400 for 3 by 1 matrix with extra data", async () => {
      // the backend treats this as a 3 by 1 matrix
      // since it takes the number of elements in the 1st row as the number of columns
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1],[3,4],[5,6]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Matrix is not rectangle")
        })
    })
    it("should obtain 400 for 3 by 2 matrix with missing data", async () => {
      // the backend treats this as a 3 by 2 matrix
      // since it takes the number of elements in the 1st row as the number of columns
      await chai
        .request(url)
        .get(route)
        .query({
          matrix: "[[1,2],[3],[5]]",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Matrix is not rectangle")
        })
    })
  })

  describe("/api/logic/truthTable", () => {
    before(start)
    after(stop)

    it("should succeed for a valid logic expression", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          expression: "!(p & q)",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(200)
        })
    })

    it("should obtain 400 if expression is missing right parenthesis", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          expression: "!(p & q",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Missing right parenthesis")
        })
    })

    it("should obtain 400 if expression is missing left parenthesis", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          expression: "!p & q)",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Missing left parenthesis")
        })
    })

    it("should obtain 400 if expression has two variables in a row", async () => {
      await chai
        .request(url)
        .get(route)
        .query({
          expression: "!p q & r",
        })
        .then((res) => {
          chai.expect(res.status).to.equal(400)
          chai.expect(res.body.message).to.equal("Missing binary operator")
        })
    })
  })
})

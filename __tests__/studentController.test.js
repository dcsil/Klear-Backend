const sinon = require('sinon')
const request = require('supertest')
const dbConnection = require('../src/config/dbConnection')
const app = require('../src/app')
const jwt = require('jsonwebtoken')

function delay () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })
}
beforeAll(async () => {
  await delay()
})

describe('Health check', () => {
  const sandbox = sinon.createSandbox()

  afterEach(() => {
    sinon.reset()
    sinon.restore()
    sandbox.restore()
  })

  it('should return hello', async function () {
    results = []
    const response = await request(app).get('/student/health')
    expect(response.statusCode).toBe(200)
    expect(response.body.hello).toBe('Hello from the backend!')
  })
})

describe('Integration tests for getting all students', () => {
  const sandbox = sinon.createSandbox()
  let mysqlMock
  beforeEach(() => {
    stub = sinon.stub(jwt, 'verify').callsFake(() => {
      return true
    })

    mysqlMock = sinon.mock(dbConnection)
  })

  afterEach(() => {
    sinon.reset()
    sinon.restore()
    sandbox.restore()
  })

  it('should return a list of students', async function () {
    results = []
    const response = await request(app).get('/student/all')
    expect(response.statusCode).toBe(200)

  })
})

describe('Integration tests for getting student info', () => {
  const sandbox = sinon.createSandbox()
  let mysqlMock
  beforeEach(() => {
    stub = sinon.stub(jwt, 'verify').callsFake(() => {
      return true
    })

    mysqlMock = sinon.mock(dbConnection)
  })

  afterEach(() => {
    sinon.reset()
    sinon.restore()
    sandbox.restore()
  })

  it('should send error when no student id provided', async function () {
    results = []
    id = {}
    const response = await (await request(app).get('/student/info').send(id))
    expect(response.statusCode).toBe(400)
  })

  it('should send error when student id is null', async function () {
    results = []
    id = {}
    const response = await (await request(app).get('/student/info').send(id))
    expect(response.statusCode).toBe(400)
  })

  it('should return student info', async function () {
    results = []
    id = {
      student_id: "1",
    }
    const response = await (await request(app).get('/student/info').send(id))
    expect(response.statusCode).toBe(200)

  })
})

describe('Integration tests for getting student history', () => {
  const sandbox = sinon.createSandbox()
  let mysqlMock
  beforeEach(() => {
    stub = sinon.stub(jwt, 'verify').callsFake(() => {
      return true
    })

    mysqlMock = sinon.mock(dbConnection)
  })

  afterEach(() => {
    sinon.reset()
    sinon.restore()
    sandbox.restore()
  })

  it('should send error when no student id provided', async function () {
    results = []
    id = {}
    const response = await (await request(app).get('/student/history').send(id))
    expect(response.statusCode).toBe(400)
  })

  it('should send error when student id is null', async function () {
    results = []
    id = {}
    const response = await (await request(app).get('/student/history').send(id))
    expect(response.statusCode).toBe(400)
  })

  it('should return student history', async function () {
    results = []
    id = {
      student_id: "1",
    }
    const response = await (await request(app).get('/student/history').send(id))
    expect(response.statusCode).toBe(200)

  })
})

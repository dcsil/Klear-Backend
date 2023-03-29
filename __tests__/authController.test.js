const sinon = require('sinon')
const request = require('supertest')
const bcrypt = require('bcrypt')
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

describe('Integration tests for register', () => {
  const sandbox = sinon.createSandbox()
  let mysqlMock
  let bcryptMock
  const user = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'blah@blah.com',
    password: 'some_password_hash'
  }

  beforeEach(() => {
    bcryptMock = sandbox.stub(bcrypt, 'hash')
    bcryptMock.resolves('some_random_hash')

    stub = sinon.stub(jwt, 'sign').callsFake(() => {
      return 'random'
    })

    mysqlMock = sinon.mock(dbConnection)
  })

  afterEach(() => {
    sinon.reset()
    sinon.restore()
    sandbox.restore()
  })

  it('should not insert a new user since it exists', async function () {
    const results = [user]
    const expectation = mysqlMock.expects('query')
      .callsArgWith(1, null, results)
    const response = await request(app).post('/register').send(user)
    expect(response.statusCode).toBe(409)
  })

  it('should register a new user', async function () {
    results = []
    mysqlMock.expects('query')
      .atLeast(1)
      .callsArgWith(1, null, results)

    access_token = { access_token: 'random' }
    mysqlMock.expects('query')
      .atLeast(1)
      .callsArgWith(1, null, access_token) // can be nothing

    const response = await request(app).post('/register').send(user)
    expect(response.statusCode).toBe(200)
    expect(response.body.accessToken).toBe('random')
  })
})

describe('Integration tests for login', () => {
  const sandbox = sinon.createSandbox()
  let mysqlMock
  let bcryptMock
  const user = {
    email: 'login@login.com',
    password: '123'
  }
  beforeEach(() => {
    stub = sinon.stub(jwt, 'sign').callsFake(() => {
      return 'random'
    })

    mysqlMock = sinon.mock(dbConnection)
    bcryptMock = sandbox.stub(bcrypt, 'compare')
  })

  afterEach(() => {
    sinon.reset()
    sinon.restore()
    sandbox.restore()
  })

  it('should fail to login is no user', async function () {
    results = []
    const expectation = mysqlMock.expects('query')
      .callsArgWith(1, null, results)
    const response = await request(app).post('/login').send(user)
    expect(response.statusCode).toBe(401)
  })

  it('should fail to login if password is incorrect', async function () {
    bcryptMock.resolves(false)
    results = [user]
    const expectation = mysqlMock.expects('query')
      .callsArgWith(1, null, results)
    const response = await request(app).post('/login').send(user)
    expect(response.text).toBe('Password incorrect!')
  })

  it('should login the user with correct email and password', async function () {
    bcryptMock.resolves(true)
    results = [user]
    const expectation = mysqlMock.expects('query')
      .callsArgWith(1, null, results)
    const response = await request(app).post('/login').send(user)
    expect(response.statusCode).toBe(200)
    expect(response.body.accessToken).toBe('random')
  })
})

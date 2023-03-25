const sinon = require("sinon");
const request = require('supertest');
const bcrypt = require("bcrypt")
const dbConnection = require("../src/config/dbConnection");
const app = require('../src/app');
const generateAccessTokenModule = require("../src/config/generateAccessToken");

function delay() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }
beforeAll(async () => {
    await delay();
});

describe('Integration tests for register', () => {
    let sandbox = sinon.createSandbox();
    let mysqlMock
    let bcryptMock;
    let accessTokenMock;
    beforeEach(() => {

        bcryptMock = sandbox.stub(bcrypt, "hash");
        bcryptMock.resolves("some_random_hash")
        accessTokenMock = sandbox.stub(generateAccessTokenModule, "generateAccessToken");
        accessTokenMock.returns("random")

        mysqlMock = sinon.mock(dbConnection);

    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should not insert a new user since it exists", async function () {

        // var mysqlMock = sinon.mock(dbConnection);
        const user = {
            firstName: "Jane",
            lastName: "Doe",
            email: "blah@blah.com",
            password: "some_password_hash"
        };
        var results = [user];
        var expectation = mysqlMock.expects('query')
                .callsArgWith(1, null, results);

        //Preform
        const response = await request(app).post('/register').send(user)
        expect(response.statusCode).toBe(409)

        sinon.restore()
    });

    it ("should register a new user", async function () {
        const user = {
            firstName: "Jane",
            lastName: "Doe",
            email: "blah@blah.com",
            password: "some_password_hash"
        };
        results = []
        mysqlMock.expects('query')
            .atLeast(1)
            .callsArgWith(1, null, results)
        
        access_token = {access_token: "random"}
        mysqlMock.expects('query')
            .atLeast(1)
            .callsArgWith(1, null, access_token) //can be nothing
        
        const response = await request(app).post('/register').send(user)
        expect(response.statusCode).toBe(200)
        // expect(response.body.accessToken).toBe('random')
        sinon.restore()
    })

})

describe('Integration tests for login', () => {
    let sandbox = sinon.createSandbox();
    let mysqlMock
    let bcryptMock;
    beforeEach(() => {

        // accessTokenMock = sandbox.stub(generateAccessTokenModule, "generateAccessToken");
        // accessTokenMock.returns("random")

        mysqlMock = sinon.mock(dbConnection);
        bcryptMock = sandbox.stub(bcrypt, "compare");

    });

    afterEach(() => {
        sandbox.restore()
    })

    it('should fail to login is no user', async function () {
        const user = {
            email: "login@login.com", 
            password: "pw"
        }
        results = []
        var expectation = mysqlMock.expects('query')
            .callsArgWith(1, null, results);
        const response = await request(app).post('/login').send(user)
        expect(response.statusCode).toBe(401)
    });

    it('should fail to login if password is incorrect', async function () {
       
        bcryptMock.resolves(false);
        const user = {
            email: "login@login.com", 
            password: "123"
        }
        results = [user]
        var expectation = mysqlMock.expects('query')
            .callsArgWith(1, null, results);
        const response = await request(app).post('/login').send(user)
        expect(response.text).toBe("Password incorrect!")
        bcryptMock.reset()
    });

    it('should login the user with correct email and password', async function () {
        bcryptMock.resolves(true);
        const user = {
            email: "login@login.com", 
            password: "123"
        }
        results = [user]
        var expectation = mysqlMock.expects('query')
            .callsArgWith(1, null, results);
        const response = await request(app).post('/login').send(user)
        expect(response.statusCode).toBe(200)
        bcryptMock.restore()
    })
})
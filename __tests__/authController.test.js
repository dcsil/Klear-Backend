const sinon = require("sinon");
const dbConnection = require("../src/config/dbConnection")
const register = require('../src/controller/authController').register

test("should not insert a new user since it exists", async () => {

    //Test Setup
    const user = {
        firstName: "Jane",
        lastName: "Doe",
        email: "email@example.com",
        password: "some_password_hash"
    };

    //Mocks
    const query = sinon.stub(dbConnection, "query");
    query.onCall(0).returns({length: 1})
    query.onCall(1).returns({access_token: "random_string"})
    const searchQuery = "SELECT * FROM staff WHERE email = 'email@example.com'"
    
    const insertQuery = {
        text: 'INSERT INTO staff VALUES (NULL, $1, $2, $3, $4, $5) RETURNING *',
        values: [user.firstName, user.lastName, user.email, user.password]
    }

    //Preform
    await register({body: user});

    //Assert
    sinon.assert.calledWith(query, searchQuery);
    sinon.assert.neverCalledWith(query, insertQuery)
    query.restore()
});

test("should insert a new user to register", async () => {

    //Test Setup
    const user = {
        firstName: "Jane",
        lastName: "Doe",
        email: "email@example.com",
        password: "some_password_hash"
    };

    const searchQuery = "SELECT * FROM staff WHERE email = 'email@example.com'"
    
    const insertQuery = {
        text: 'INSERT INTO staff VALUES (NULL, $1, $2, $3, $4, $5) RETURNING *',
        values: [user.firstName, user.lastName, user.email, user.password]
    }

    //Mocks
    const query = sinon.stub(dbConnection, "query");
    query
        .onFirstCall().callsArgWith(1, searchQuery).returns({length: 0})
        .onSecondCall().callsArgWith(1, insertQuery).returns({access_token: "random"})
    const spy = sinon.spy();
    query('arg0', spy);  // spy should be called with m1
    query('arg0', spy);  // spy should be called with m2

    //Preform
    await register({body: user});

    //Assert
    sinon.assert.calledWith(spy.getCall(0), searchQuery);
    sinon.assert.calledWith(spy.getCall(1), insertQuery)
});
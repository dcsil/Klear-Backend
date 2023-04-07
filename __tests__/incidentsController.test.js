const sinon = require('sinon')
const request = require('supertest')
const bcrypt = require('bcrypt')
const dbConnection = require('../src/config/dbConnection')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const jwtHelper = require('../src/config/jwtHelper')
const incidentHelper = require('../src/controller/helpers/incidentHelper')
const incidentController = require('../src/controller/IncidentsController')

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


describe('Tests for fetch all', () => {
    const sandbox = sinon.createSandbox()
    let mysqlMock
    let getRandomStudentMock
    
    beforeEach(() => {
        mysqlMock = sinon.mock(dbConnection)
        getRandomStudentMock = sinon.mock(incidentHelper)
    })

    afterEach(() => {
        sinon.reset()
        sinon.restore()
        sandbox.restore()
    })

    it('should fail to fetch if auth not authenticated', async function () {
        const stub = sinon.stub(jwtHelper, 'verifyAccessToken').callsFake(() => {
            return false
        })

        const response = await request(app).get('/incidents/all/1')
        expect(response.statusCode).toBe(401)

    })

    it('should fetch for active incidents', async function () {
        sinon.stub(jwt, 'verify').callsFake(() => {
            return true
        })
        const results = [{
            incident_id: 1,
            event: 'Falling',
            date: '2023-03-16 11:38:17',
            status: null,
            resolved_user: null,
            screenshot: 'fake.jpeg'
        }]

        mysqlMock.expects('query')
            .atLeast(1)
            .callsArgWith(1, null, results)
        
        const response = await request(app).get('/incidents/all/0')
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results)
    })

    it('should fetch for past incidents', async function () {
        sinon.stub(jwt, 'verify').callsFake(() => {
            return true
        })
        const results = [{
            incident_id: 1,
            event: 'Falling',
            date: '2023-03-16 11:38:17',
            status: 1,
            resolved_user: 1,
            screenshot: 'fake.jpeg'
        }]

        mysqlMock.expects('query')
            .atLeast(1)
            .callsArgWith(1, null, results)
        
        const response = await request(app).get('/incidents/all/0')
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual(results)
    })
})

describe('Tests for fetching one incident', () => {
    const sandbox = sinon.createSandbox()
    let mysqlMock
    let helper

    
    beforeEach(() => {
        mysqlMock = sinon.mock(dbConnection)
        const stub = sinon.stub(jwt, 'verify').callsFake(() => {
            return true
        })
    })

    afterEach(() => {
        sinon.reset()
        sinon.restore()
        sandbox.restore()
    })

    it('should fetch the correct incident', async () => {
        const studentList = [{
            student_id: 1,
            first_name: 'Hi',
            last_name: 'Name'
        }]
        sinon.stub(incidentHelper, "findRelatedStudents").resolves(studentList);
        result = [{
            incident_id: 1,
            event: 'falling',
            date: '2023-03-16 11:38:17',
            status: 0,
            resolved_user: 1,
            first_name: 'name',
            last_name: 'name',
        }]
        mysqlMock.expects('query')
            .atLeast(1)
            .callsArgWith(1, null, result)

        const response = await request(app).get('/incidents/get/1')
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual(result[0])
    })
})

describe('should add an incident correctly', () => {
    const sandbox = sinon.createSandbox()
    let mysqlMock
    let payload

    beforeEach(() => {
        mysqlMock = sinon.mock(dbConnection)
        const stub = sinon.stub(jwt, 'verify').callsFake(() => {
            return true
        })
        payload = {
            event: 'fall',
            date: '2023-03-16 11:38:17',
            imageUrl: '1.jpeg'
        }
    })

    afterEach(() => {
        sinon.reset()
        sinon.restore()
        sandbox.restore()
    })

    it('should return bad request with empty body', async () => {
        const response = await request(app).post('/incidents/add')
        expect(response.text).toBe('Bad Request')

    })

    it('should return properly with good headers', async () => {
        sinon.stub(incidentHelper, "getRandomStudent").resolves(1);
        sinon.stub(incidentHelper, "addIncident").returns(1);
        sinon.stub(incidentHelper, "addStudentIncident").resolves(1);
        sinon.stub(incidentHelper, "findRelatedStudents").resolves(1);
        const response = await request(app).post('/incidents/add')
                                           .send(payload)

        expect(response.text).toBe('Incident added successfully')

    })

    it('should return with bad request if previous methods fail', async () => {
        sinon.stub(incidentHelper, "getRandomStudent").resolves(1);
        sinon.stub(incidentHelper, "addIncident").returns(1);
        sinon.stub(incidentHelper, "addStudentIncident").resolves(0);
        sinon.stub(incidentHelper, "findRelatedStudents").resolves(1);

        const response = await request(app).post('/incidents/add')
                                           .send(payload)

        expect(response.text).toBe('Bad Request')
    })
})

describe('Tests for resolving an incident', () => {
    const sandbox = sinon.createSandbox()
    let mysqlMock
    let jwtMock
    let payload
    beforeEach(() => {
        mysqlMock = sinon.mock(dbConnection)
        sinon.stub(jwt, 'verify').callsFake(() => {
            return 'some@email.com'
        })
        jwtMock = sinon.mock(jwt)
        payload = {
            status: 0,
            incidentId: 1
        }
    })

    afterEach(() => {
        sinon.reset()
        sinon.restore()
        sandbox.restore()
    })

    it('should fail to resolve if body is empty', async () => {
        sinon.stub(incidentHelper, "getStaffId").returns(null)
        const response = await request(app).post('/incidents/resolve')
        expect(response.text).toBe('Bad Request')
    })

    it('should resolve properly with correct headers', async () => {
        sinon.stub(incidentHelper, "getStaffId").returns(1)
        mysqlMock.expects('query')
            .atLeast(1)
            .callsArgWith(1, null, [])

        const response = await request(app).post('/incidents/resolve')
                                           .send(payload)

        expect(response.text).toBe("Incident marked resolved")
    })

    it('should fail if no staff was found', async () => {
        sinon.stub(incidentHelper, "getStaffId").returns(null)
   
        const response = await request(app).post('/incidents/resolve')
                                           .send(payload)

        expect(response.text).toBe("Bad Request")
    })
})

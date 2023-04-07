const sinon = require('sinon')
const request = require('supertest')
const bcrypt = require('bcrypt')
const dbConnection = require('../src/config/dbConnection')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const jwtHelper = require('../src/config/jwtHelper')
const incidentHelper = require('../src/controller/helpers/incidentHelper')

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

    
    beforeEach(() => {
        mysqlMock = sinon.mock(dbConnection)
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

// describe('Tests for fetching one incident', () => {
//     const sandbox = sinon.createSandbox()
//     let mysqlMock

    
//     beforeEach(() => {
//         mysqlMock = sinon.mock(dbConnection)
//         const stub = sinon.stub(jwt, 'verify').callsFake(() => {
//             return true
//         })
//     })

//     afterEach(() => {
//         sinon.reset()
//         sinon.restore()
//         sandbox.restore()
//     })

//     it('should fetch the correct incident', async () => {
//         const studentList = [{
//             student_id: 1,
//             first_name: 'Hi',
//             last_name: 'Name'
//         }]
//         sinon.stub(incidentHelper, "findRelatedStudents").resolves(studentList);
//         result = [{
//             incident_id: 1,
//             event: 'falling',
//             date: '2023-03-16 11:38:17',
//             status: 0,
//             resolved_user: 1,
//             first_name: 'name',
//             last_name: 'name',
//         }]
//         mysqlMock.expects('query')
//             .atLeast(1)
//             .callsArgWith(1, null, result)

//         const response = await request(app).get('/incidents/get/1')
//         expect(response.statusCode).toBe(200)
//         expect(response.body).toBe(result)
//     })
// })

describe('should add an incident correctly', () => {
    const sandbox = sinon.createSandbox()
    let mysqlMock

    
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

    it('should return bad request with empty body', async () => {
        sinon.stub(incidentHelper, "getRandomStudent").resolves(1);
        sinon.stub(incidentHelper, "addIncident").resolves(1);
        sinon.stub(incidentHelper, "addStudentIncident").resolves(1);
        const response = await request(app).post('/incidents/add')

        expect(response.text).toBe('Bad Request')

    })

    it('should return properly with good headers', async () => {
        sinon.stub(incidentHelper, "getRandomStudent").resolves(1);
        sinon.stub(incidentHelper, "addIncident").resolves(1);
        sinon.stub(incidentHelper, "addStudentIncident").resolves(1);
        const payload = {
            event: 'fall',
            date: '2023-03-16 11:38:17',
            imageUrl: '1.jpeg'
        }
        const response = await request(app).post('/incidents/add')
                                           .send(payload)

        expect(response.text).toBe('Incident added successfully')

    })
})

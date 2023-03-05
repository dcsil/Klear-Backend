const request = require('supertest');
const app = require('../src/app');

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

describe('Integration test suite', () => {
  it('Test sampleRoute', async () => {
    const response = await request(app).get('/sampleRouteMiddleName/helloBackend');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      { hello: "Hello from the backend!"}
    );
  });
});
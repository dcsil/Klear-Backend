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
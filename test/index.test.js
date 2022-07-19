const request = require('supertest');
const assert = require('assert');
const app = require('../app')

describe("Health", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/health")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});